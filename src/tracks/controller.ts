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
  hostId: string,
  trackId: string,
  ipAddress: string,
) {
  log.info(`Add Track: userId=${hostId}, trackId=${trackId}, ip=${ipAddress}`);

  // check if the user had added a track recently based on the companies rules

  // get user data
  const user = await HostModel.getUser(hostId);

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
  const track = await TrackModel.addTrack(hostId, trackData, ipAddress);

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
  trackUri: string,
  likerId: string,
) {
  log.info(
    `Track Like: userId=${hostId}, trackUri=${trackUri}, likerId=${likerId}`,
  );
  const like = await TrackModel.likeTrack(hostId, likerId, trackUri);
  sendAllTracks(hostId);
  return like;
}

export async function pay4Track(hostId: string, trackUri: string, userId: string) {
  const track = await TrackModel.pay4Track(hostId, trackUri, userId);
  return track;
}
export async function getTracks(hostId: string) {
  const tracks = await TrackModel.getTracks(hostId);
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

  await sendAllTracks(userId);

  // send the next track to the user
  return tracks[1];
}

export async function sendAllTracks(userId: string, tracks?: ITrackModel[]) {
  const allTracks = await new Promise(async (resolve, rej) => {
    if (tracks) {
      resolve(tracks);
    } else {
      const loadedTracks = await getTracks(userId);
      resolve(loadedTracks);
    }
  });
  io.to(userId).emit("tracks", allTracks);
}
