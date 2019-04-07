import { createLogger } from "bunyan";
import { ITrackModel } from "../def/track";
import * as HostModel from "../host/model";
import * as QueuerController from "../queuer/controller";
import { io } from "../server";
import * as TrackModel from "../tracks/model";
import { makeApiRequest } from "../utils";

const log = createLogger({
  name: "Track",
});

export async function addTrack(
  hostId: string,
  trackId: string,
  queuerId: string,
) {
  log.info(
    `Add Track: hostId=${hostId}, trackId=${trackId}, queuerId=${queuerId}`,
  );

  // check if the user had added a track recently based on the companies rules

  // get user data
  const user = await HostModel.getUser(hostId);

  if (!user) {
    return false;
  }

  // get amount of tokens to remove for the vibe

  // remove tokens from user
  await QueuerController.removeUserTokens(queuerId, 1);

  // get track data
  const trackData: ITrack = await makeApiRequest(
    `/v1/tracks/${trackId}`,
    "GET",
    user,
  );

  // add track to database
  const track = await TrackModel.addTrack(hostId, trackData, queuerId);

  console.log(track);

  // send tracks via socket
  await sendAllTracks(hostId);
  return track;
}

export async function removeTrack(hostId: string, uri: string) {
  log.info(`Removing track: userId=${hostId}, uri=${uri}`);

  // get user information
  const user = await HostModel.getUser(hostId);

  if (!user) {
    throw new Error("User does not exist");
  }

  // remove from database
  await TrackModel.removeTrack(hostId, uri);

  await sendAllTracks(hostId);
}

export async function likeTrack(
  hostId: string,
  trackId: string,
  queuerId: string,
) {
  log.info(`Like: hostId=${hostId}, trackId=${trackId}, queuerId=${queuerId}`);
  const like = await TrackModel.likeTrack(hostId, queuerId, trackId);
  sendAllTracks(hostId);
  return like;
}

export async function unlikeTrack(
  hostId: string,
  queuerId: string,
  trackId: string,
) {
  log.info(`Unlike: hostId=${hostId} queuerId=${queuerId} trackId=${trackId}`);
  await TrackModel.unlikeTrack(queuerId, trackId);
  sendAllTracks(hostId);
  return {
    status: "done",
  };
}

export async function pay4Track(
  hostId: string,
  trackUri: string,
  userId: string,
) {
  const track = await TrackModel.pay4Track(hostId, trackUri, userId);
  return track;
}

export function getTracks(hostId: string) {
  return TrackModel.getTracks(hostId);
}

export async function nextTrack(userId: string) {
  log.info("Next Track");
  const tracks = await getTracks(userId);

  if (tracks.length === 1) {
    throw new Error("End of Queue");
  }

  // play the next track
  await makeApiRequest("/v1/me/player/play", "PUT", userId, {
    uris: [tracks[0].uri],
  });

  // remove the track
  await removeTrack(userId, tracks[0].uri);

  // send tracks to user
  await sendAllTracks(userId);

  // send the next track to the user
  return tracks[1];
}

export async function sendAllTracks(userId: string, tracks?: ITrackModel[]) {
  const allTracks: ITrackModel[] = await new Promise(async (resolve, rej) => {
    if (tracks) {
      resolve(tracks);
    } else {
      const loadedTracks = await getTracks(userId);
      resolve(loadedTracks);
    }
  });

  io.to(userId).emit("tracks", allTracks);
}
