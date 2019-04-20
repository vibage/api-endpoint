import { createLogger } from "bunyan";
import { ITrackModel } from "../def/track";
import { IUserModel, User } from "../def/user";
import { io } from "../server";
import * as TrackModel from "../tracks/model";
import * as UserController from "../user/controller";
import * as UserModel from "../user/model";
import { makeApiRequest } from "../utils";
import * as VibeController from "../vibe/controller";

const log = createLogger({
  name: "Track",
});

/*========================================
     Queuer Functions
==========================================*/

export async function addTrack(uid: string, hostId: string, trackId: string) {
  log.info(`Add: uid=${uid} hostId=${hostId}, trackId=${trackId}`);

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
  const trackData: ITrack = await makeApiRequest(
    `/v1/tracks/${trackId}`,
    "GET",
    host,
  );

  // add track to database
  const track = await TrackModel.addTrack(hostId, trackData, user.id);

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

  await TrackModel.likeTrack(hostId, queuer.id, trackId);
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

  await TrackModel.unlikeTrack(queuer.id, trackId);
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

  const result: { tracks: { items: ITrack[] } } = await makeApiRequest(
    `/v1/search?q=${query}&type=track&market=US`,
    "GET",
    hostId,
  );

  const vibe = await VibeController.getVibe(host.currentVibe);

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

  // filter results based on user settings
  result.tracks.items = result.tracks.items.filter(filterFunc);

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

    const payload = {
      uris: [host.player.track_window.current_track.uri],
      position_ms: host.player.position,
    };

    // just send a play request and it should pick up where it left off
    const res = await makeApiRequest(
      `/v1/me/player/play?device_id=${deviceId}`,
      "PUT",
      host as IUserModel,
      payload,
    );

    return res;
  } else {
    // check host's setting to see if they want to play something else if
    // there is not something in the queue
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

export async function play(uid: string) {
  log.info(`Play: uid=${uid}`);

  const host = await UserController.authUser(uid);
  const data = await makeApiRequest(
    `/v1/me/player/play?device_id=${host.deviceId}`,
    "PUT",
    host.id,
  );

  return data;
}

export async function pause(uid: string) {
  log.info(`Play: uid=${uid}`);

  const host = await UserController.authUser(uid);
  const data = await makeApiRequest("/v1/me/player/pause", "PUT", host.id);

  return data;
}

export async function removeTrack(uid: string, trackId: string) {
  log.info(`Remove: uid=${uid}, trackId=${trackId}`);

  // auth host
  const host = await UserController.authUser(uid);

  // remove from database
  const track = await TrackModel.removeTrack(trackId);

  await sendAllTracks(host.id);
  return track;
}

export async function nextTrack(uid: string) {
  log.info(`Next Track: uid=${uid}`);

  const host = await UserController.authUser(uid);

  const tracks = await getTracks(host.id);

  console.log({ host, tracks });

  if (tracks.length === 0) {
    throw new Error("End of Queue");
  }

  // play the next track
  await makeApiRequest(
    `/v1/me/player/play?device_id=${host.deviceId}`,
    "PUT",
    host,
    {
      uris: [tracks[0].uri],
    },
  );

  // remove the track
  await removeTrack(host.uid, tracks[0].id);

  // send tracks to user
  await sendAllTracks(host.id);

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
  await makeApiRequest(
    `/v1/me/player/play?device_id=${host.deviceId}`,
    "PUT",
    host,
    {
      uris: [track.uri],
    },
  );

  // remove the track
  await removeTrack(host.uid, track.id);

  // send tracks to user
  await sendAllTracks(host.id);

  return {
    status: "done",
  };
}

async function sendAllTracks(hostId: string, tracks?: ITrackModel[]) {
  log.info("Sending all tracks");
  const allTracks: ITrackModel[] = await new Promise(async (resolve, rej) => {
    if (tracks) {
      resolve(tracks);
    } else {
      const loadedTracks = await getTracks(hostId);
      resolve(loadedTracks);
    }
  });

  io.to(hostId).emit("tracks", allTracks);
}
