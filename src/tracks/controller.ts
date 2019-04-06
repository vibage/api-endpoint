import { createLogger } from "bunyan";
import fetch from "node-fetch";
import { ITrackModel } from "../def/track";
import * as HostModel from "../host/model";
import { io } from "../server";
import * as TrackModel from "../tracks/model";
import { makeApiRequest } from "../utils";

const log = createLogger({
  name: "Track",
});

export async function addTrack(
  userId: string,
  trackId: string,
  ipAddress: string,
) {
  log.info(`Add Track: userId=${userId}, trackId=${trackId}, ip=${ipAddress}`);

  // check if the user had added a track recently based on the companies rules

  // get user data
  const user = await HostModel.getUser(userId);

  if (!user) {
    return false;
  }

  // get track data
  const trackData: ITrack = await makeApiRequest(
    `/v1/tracks/${trackId}`,
    "GET",
    user,
  );

  // add track to database
  const track = await TrackModel.addTrack(userId, trackData, ipAddress);

  // send tracks via socket
  await sendAllTracks(userId);
  return track;
}

export async function removeTrack(userId: string, uri: string) {
  log.info(`Removing track: userId=${userId}, uri=${uri}`);

  // get user information
  const user = await HostModel.getUser(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  // remove from database
  await TrackModel.removeTrack(userId, uri);

  await sendAllTracks(userId);
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

export async function getTracks(userId: string) {
  const tracks = await TrackModel.getTracks(userId);
  return tracks;
}

export async function nextTrack(userId: string) {
  log.info("Next Track");
  const tracks = await getTracks(userId);

  if (tracks.length === 1) {
    throw new Error("End of Queue");
  }

  // remove the first track
  await removeTrack(userId, tracks[0].uri);

  // play the next track
  await makeApiRequest("/v1/me/player/play", "PUT", userId, {
    uris: [tracks[1].uri],
  });

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
