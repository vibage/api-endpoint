import { createLogger } from "bunyan";
import fetch from "node-fetch";
import * as UserModel from "../users/model";
import * as TrackModel from "../tracks/model";
import { makeApiRequest } from "../utils";
import { ISpotifyTrackModel } from "../def/spotifyTrack";
import { io } from "../server";

const log = createLogger({
  name: "Track"
})

export async function addTrack(userId: string, trackId: string, ipAddress: string) {
  log.info(`Add Track: userId=${userId}, trackId=${trackId}, ip=${ipAddress}`);

  // check if the user had added a track recently based on the companies rules

  // get user data
  const user = await UserModel.getUser(userId);

  if (!user) return false;

  // get track data
  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const trackData: ITrack = await res.json();

  // add track to playlist
  await fetch(`https://api.spotify.com/v1/playlists/${user.playlistId}/tracks`, {
    body: JSON.stringify({
      uris: [trackData.uri],
    }),
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST"
  })

  // add track to database
  const track = await TrackModel.addTrack(userId, trackData, ipAddress);

  // send tracks via socket
  await sendAllTracks(userId);
  return track;
}

export async function removeTrack(userId: string, uri: string) {
  log.info(`Removing track: userId=${userId}, uri=${uri}`)

  // get user information
  const user = await UserModel.getUser(userId);

  if (!user) throw new Error("User does not exist");

  const payload = JSON.stringify({
    tracks: [{
      uri
    }]
  });

  // remove from playlist
  const removeRes = await fetch(`https://api.spotify.com/v1/playlists/${user.playlistId}/tracks`, {
    body: payload,
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
    method: "DELETE"
  })
  const data = removeRes.json();
  log.info(JSON.stringify(data));

  // remove from database
  await TrackModel.removeTrack(userId, uri);

  await sendAllTracks(userId);

}

export async function getTracks(userId: string) {
  const tracks = await TrackModel.getTracks(userId);
  return tracks;
}

export async function nextTrack(userId: string) {
  const tracks = await getTracks(userId);

  // remove the first track
  await removeTrack(userId, tracks[0].uri);

  //play the next track
  const data = await makeApiRequest("/v1/me/player/play", "PUT", userId, {
    uris:[tracks[1].uri]
  });

  await sendAllTracks(userId);

  return data;
}

export async function sendAllTracks(userId: string, tracks?: ISpotifyTrackModel[]){
  const allTracks = await new Promise(async (resolve, rej) => {
    if (tracks) {
      resolve(tracks)
    } else {
      const tracks = await getTracks(userId);
      resolve(tracks);
    }
  });
  console.log(allTracks)
  io.to(userId).emit("tracks", allTracks);
}