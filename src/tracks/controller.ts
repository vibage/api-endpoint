import { createLogger } from "bunyan";
import { ITrackModel } from "../def/track";
import * as HostController from "../host/controller";
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
  const host = await HostController.getHost(hostId);

  // get amount of tokens to remove for the vibe

  // remove tokens from user
  await QueuerController.removeUserTokens(queuerId, 1);

  // get track data
  const trackData: ITrack = await makeApiRequest(
    `/v1/tracks/${trackId}`,
    "GET",
    host,
  );

  // add track to database
  const track = await TrackModel.addTrack(hostId, trackData, queuerId);

  // send tracks via socket
  await sendAllTracks(hostId);
  return track;
}

export async function removeTrack(hostId: string, uri: string) {
  log.info(`Removing track: hostId=${hostId}, uri=${uri}`);

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

export function getTracks(hostId: string) {
  return TrackModel.getTracks(hostId);
}

export async function nextTrack(hostId: string) {
  log.info(`Next Track: hostId=${hostId}`);
  const tracks = await getTracks(hostId);

  if (tracks.length === 0) {
    throw new Error("End of Queue");
  }

  console.log(tracks);

  // play the next track
  await makeApiRequest("/v1/me/player/play", "PUT", hostId, {
    uris: [tracks[0].uri],
  });

  // remove the track
  await removeTrack(hostId, tracks[0].uri);

  // send tracks to user
  await sendAllTracks(hostId);

  // send the next track to the user
  return tracks[1];
}

export async function sendAllTracks(hostId: string, tracks?: ITrackModel[]) {
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
