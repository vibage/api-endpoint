import { createLogger } from "bunyan";
import * as TrackLikeModel from "../models/track-like.model";
import * as TrackModel from "../models/track.model";
import * as UserModel from "../models/user.model";
import Player from "../players/spotify/player";
import { io } from "../server";
import { ITrack } from "../types/track";
import { IHost, IUser } from "../types/user";
import * as UserController from "../user/controller";
import * as VibeController from "../vibe/controller";

const log = createLogger({
  name: "Track",
});

/*========================================
     Queuer Functions
==========================================*/

export async function addTrack(user: IUser, hostId: string, trackId: string) {
  log.info(`Add: user=${user.name} hostId=${hostId}, trackId=${trackId}`);

  // validate that everything is defined here.

  // get user data
  const host = (await UserController.getUserById(hostId)) as IHost;

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

  // get track data
  const trackData = await Player.getTrackData(trackId, host);

  // if song is already in queue, throw error
  const inQueue = await TrackModel.getQueuedTrackByUri(hostId, trackData.uri);
  if (inQueue.length) {
    return {
      error: true,
      code: 400,
      message: "Song is already in queue",
    };
  }

  // get amount of tokens to remove for the vibe
  // check if the user had added a track recently based on the companies rules

  // remove tokens from user
  await UserController.removeUserTokens(user._id, 1);

  // add track to database
  const track = await TrackModel.addTrack(hostId, trackData, user._id);

  // check if queue is empty and the default playlist not playing
  // if this is true then go ahead and play the added song
  const tracks = await TrackModel.getTracks(hostId);
  if (tracks.length === 1 && host.player === null) {
    console.log("Added track");
    nextTrack(host);
  }

  // automatically like song
  await likeTrack(user, hostId, track.id, false);

  // send tracks via socket
  await sendAllTracks(hostId);

  return {
    action: "DTK",
    amount: 1,
    track,
  };
}

export async function likeTrack(
  user: IUser,
  hostId: string,
  trackId: string,
  shouldSend = true,
) {
  log.info(`Like: user=${user.name} hostId=${hostId}, trackId=${trackId}`);

  await TrackLikeModel.likeTrack(hostId, user._id, trackId);
  await TrackModel.incrementTrackLike(trackId, 1);
  if (shouldSend) {
    await sendAllTracks(hostId);
  }
  return {
    status: "done",
  };
}

export async function unlikeTrack(
  user: IUser,
  hostId: string,
  trackId: string,
) {
  log.info(`Unlike: user=${user.name} hostId=${hostId} trackId=${trackId}`);

  await TrackLikeModel.unlikeTrack(user._id, trackId);
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

  const host = (await UserController.getUserById(hostId)) as IHost;

  if (!host.player) {
    return null;
  }

  return host.player;
}

export async function search(hostId: string, query: string) {
  log.info(`Search: hostId=${hostId}, query=${query}`);

  // load users settings
  const host = (await UserController.getUserById(hostId)) as IHost;

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

export async function startQueue(host: IHost, deviceId: string) {
  log.info(`Start: host=${host.name}, deviceId=${deviceId}`);

  await UserController.setDeviceId(host._id, deviceId);
  await UserModel.setQueueState(host._id, true);

  // if they have a vibe that wants to add all the songs ot the queue
  const vibe = await VibeController.getVibe(host.currentVibe);

  if (vibe && vibe.playlistId) {
    // these next two statements could be ran at the same time
    await clearQueue(host);
    const playlistTracks = await Player.getPlaylistTracks(
      host,
      vibe.playlistId,
    );

    // add all the tracks from the playlist
    for (const track of playlistTracks) {
      await TrackModel.addTrack(host._id, track, host._id);
    }

    nextTrack(host);
  }

  return {
    status: "done",
  };
}

export async function resumeQueue(host: IHost) {
  log.info("Resuming user's play back");

  if (!host.player) {
    throw new Error("Queue has no player");
  }

  const trackUri = host.player.track_window.current_track.uri;
  const position = host.player.position;

  const res = await Player.play(host, host.deviceId, trackUri, position);

  return res;
}

// async function addPlaylistToQueue(host: IHost, playlistId: string) {}

export async function setPlayerState(host: IHost, player: object | null) {
  io.to(host._id).emit("player", player);

  await UserModel.setPlayerState(host._id, player);

  return {
    status: "done",
  };
}

export async function stopPlayer(host: IHost) {
  log.info("Stop Queue");

  await Player.pause(host);
  await setPlayerState(host, null);
  await UserModel.setQueueState(host._id, false);
  await clearQueue(host);
}

export async function clearQueue(host: IHost) {
  log.info("Clear Queue");
  await TrackModel.clearQueue(host._id);
  sendAllTracks(host._id, []);
}

export async function play(uid: string) {
  log.info(`Play: uid=${uid}`);

  const host = (await UserController.authUser(uid)) as IHost;

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

  sendAllTracks(host._id);
  return track;
}

export async function nextTrack(host: IHost) {
  log.info(`Next Track: host=${host.name}`);

  const tracks = await getTracks(host._id);

  if (tracks.length === 0) {
    throw new Error("End of Queue");
  }

  // play the next track
  await Player.play(host, host.deviceId as string, tracks[0].uri);

  // remove the track
  await removeTrack(host.uid, tracks[0].id);

  // send tracks to user
  sendAllTracks(host._id);

  // send the next track to the user
  return tracks[1];
}

export async function playCertainTrack(uid: string, trackId: string) {
  log.info(`Play Track: uid=${uid} trackId=${trackId}`);

  const host = (await UserController.authUser(uid)) as IHost;

  const track = await TrackModel.getTrack(trackId);

  if (!track) {
    throw new Error("Track does not exist");
  }

  // play the next track
  await Player.play(host, host.deviceId as string, track.uri);

  // remove the track
  await removeTrack(host.uid, track.id);

  // send tracks to user
  sendAllTracks(host._id);

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
