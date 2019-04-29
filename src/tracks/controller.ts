import { createLogger } from "bunyan";
import * as TrackLikeModel from "../models/track-like.model";
import * as TrackModel from "../models/track.model";
import * as UserModel from "../models/user.model";
import Player from "../players/spotify/player";
import { io } from "../server";
import { ITrack } from "../types/track";
import * as UserController from "../user/controller";
import * as VibeController from "../vibe/controller";

const log = createLogger({
  name: "Track",
});

/*========================================
     Queuer Functions
==========================================*/

export async function addTrack(uid: string, hostId: string, trackId: string) {
  log.info(`Add: uid=${uid} hostId=${hostId}, trackId=${trackId}`);

  // validate that everything is defined here.

  // get user data
  const host = await UserController.getUserById(hostId);

  // auth the user
  const user = await UserController.authUser(uid);

  // get host vibe
  const vibe = await VibeController.getVibe(host.currentVibe);

  // the user can't add the track bc of vibe settings
  if (vibe && !vibe.canUserAddTrack) {
    // maybe try to return errors with this convention
    return {
      error: true,
      code: 400,
      message: "Host has disabled adding songs",
    };
  }

  // get amount of tokens to remove for the vibe
  // check if the user had added a track recently based on the companies rules

  // remove tokens from user
  await UserController.removeUserTokens(user.id, 1);

  // get track data
  const trackData = await Player.getTrackData(trackId, host);

  // add track to database
  await TrackModel.addTrack(hostId, trackData, user.id);

  // automatically like song
  await likeTrack(uid, hostId, trackId)

  // send tracks via socket
  await sendAllTracks(host.id);

  return {
    action: "DTK",
    amount: 1,
  };
}

export async function likeTrack(uid: string, hostId: string, trackId: string) {
  log.info(`Like: uid=${uid} hostId=${hostId}, trackId=${trackId}`);

  const queuer = await UserController.authUser(uid);

  await TrackLikeModel.likeTrack(hostId, queuer.id, trackId);
  await TrackModel.incrementTrackLike(trackId, 1);
  sendAllTracks(hostId);
  return {
    status: "done",
  };
}

export async function unlikeTrack(
  uid: string,
  hostId: string,
  trackId: string,
) {
  log.info(`Unlike: uid=${uid} hostId=${hostId} trackId=${trackId}`);

  // authenticate
  const queuer = await UserController.authUser(uid);

  await TrackLikeModel.unlikeTrack(queuer.id, trackId);
  await TrackModel.incrementTrackLike(trackId, -1);
  sendAllTracks(hostId);
  return {
    status: "done",
  };
}

export function getTracks(hostId: string) {
  return TrackModel.getTracks(hostId);
}

// this probably shouldn't send a socket to everyone
export async function getPlayer(hostId: string) {
  log.info(`Get Player: hostId=${hostId}`);

  const host = await UserController.getUserById(hostId);

  if (!host.player) {
    return null;
  }

  return host.player;
}

export async function search(hostId: string, query: string) {
  log.info(`Search: hostId=${hostId}, query=${query}`);

  // load users settings
  const host = await UserController.getUserById(hostId);
  const vibe = await VibeController.getVibe(host.currentVibe);

  const tracks = await Player.search(query, host);

  const filterFunc = (track: ITrack) => {
    if (!vibe) {
      // if no vibe, then just return normal tracks
      return true;
    } else if (!vibe.explicit && track.explicit) {
      // filter explicit content
      return false;
    } else {
      return true;
    }
  };

  const sortFunc = (track1: ITrack, track2: ITrack) => {
    return track2.popularity - track1.popularity;
  };

  // filter results based on user settings
  const result = tracks.filter(filterFunc).sort(sortFunc);

  return result;
}

/*========================================
     Host Functions
==========================================*/

export async function startQueue(uid: string, deviceId: string) {
  log.info(`Start: uid=${uid}, deviceId=${deviceId}`);

  const host = await UserController.authUser(uid);

  await UserController.setDeviceId(host.id, deviceId);

  // user is a host
  if (!host.spotifyId) {
    throw new Error("User is not a host");
  }

  await UserModel.setQueueState(host.id, true);

  // check the host's player context to see if they were playing a song before
  // and if they were restore it to the correct place
  if (host.player) {
    log.info("Resuming user's play back");

    const trackUri = host.player.track_window.current_track.uri;
    const position = host.player.position;

    const res = await Player.play(host, deviceId, trackUri, position);

    return res;
  }

  // check host's setting to see if they want to play something else if
  // there is not something in the queue

  // if they have a vibe that wants to add all the songs ot the queue
  const vibe = await VibeController.getVibe(host.currentVibe);

  if (vibe && vibe.playlistId) {
    // these next two statements could be ran at the same time
    await clearQueue(uid);
    const playlistTracks = await Player.getPlaylistTracks(
      host,
      vibe.playlistId,
    );

    // add all the tracks from the playlist
    for (const track of playlistTracks) {
      await TrackModel.addTrack(host.id, track, host.id);
    }

    nextTrack(uid);
  }
}

export async function setPlayerState(uid: string, player: object) {
  const host = await UserController.authUser(uid);

  io.to(host.id).emit("player", player);

  await UserModel.setPlayerState(host.id, player);

  return {
    status: "done",
  };
}

export async function stopPlayer(uid: string) {
  log.info("Stop Queue");
  const host = await UserController.authUser(uid);

  await Player.pause(host);
  await UserModel.setPlayerState(host.id, null);
  await UserModel.setQueueState(host.id, false);
  io.to(host.id).emit("player", null);
}

export async function clearQueue(uid: string) {
  log.info("Clear Queue");
  const host = await UserController.authUser(uid);
  await TrackModel.clearQueue(host.id);
  sendAllTracks(host.id, []);
}

export async function play(uid: string) {
  log.info(`Play: uid=${uid}`);

  const host = await UserController.authUser(uid);

  const data = await Player.play(host, host.deviceId as string);

  return data;
}

export async function pause(uid: string) {
  log.info(`Pause: uid=${uid}`);

  const host = await UserController.authUser(uid);
  const data = await Player.pause(host);

  return data;
}

export async function removeTrack(uid: string, trackId: string) {
  log.info(`Remove: uid=${uid}, trackId=${trackId}`);

  // auth host
  const host = await UserController.authUser(uid);

  // remove from database
  const track = await TrackModel.removeTrack(trackId);

  sendAllTracks(host.id);
  return track;
}

export async function nextTrack(uid: string) {
  log.info(`Next Track: uid=${uid}`);

  const host = await UserController.authUser(uid);

  const tracks = await getTracks(host.id);

  if (tracks.length === 0) {
    throw new Error("End of Queue");
  }

  // play the next track
  await Player.play(host, host.deviceId as string, tracks[0].uri);

  // remove the track
  await removeTrack(host.uid, tracks[0].id);

  // send tracks to user
  sendAllTracks(host.id);

  // send the next track to the user
  return tracks[1];
}

export async function playCertainTrack(uid: string, trackId: string) {
  log.info(`Play Track: uid=${uid} trackId=${trackId}`);

  const host = await UserController.authUser(uid);

  const track = await TrackModel.getTrack(trackId);

  if (!track) {
    throw new Error("Track does not exist");
  }

  // play the next track
  await Player.play(host, host.deviceId as string, track.uri);

  // remove the track
  await removeTrack(host.uid, track.id);

  // send tracks to user
  sendAllTracks(host.id);

  return {
    status: "done",
  };
}

async function sendAllTracks(hostId: string, tracks?: ITrack[]) {
  log.info("Sending all tracks");
  if (tracks) {
    io.to(hostId).emit("tracks", tracks);
  } else {
    getTracks(hostId).then((loadedTracks) => {
      io.to(hostId).emit("tracks", loadedTracks);
    });
  }
}
