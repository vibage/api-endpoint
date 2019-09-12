import { createLogger } from "bunyan";
import * as TrackLikeModel from "../models/track-like.model";
import * as UserModel from "../models/user.model";
import Player from "../players/spotify/player";
import { IHost } from "../types/user";
import * as VibeController from "../vibe/controller";

const log = createLogger({
  name: "User",
});

export function createUser(uid: string, name: string) {
  log.info(`Create: uid=${uid} name=${name}`);
  return UserModel.createUser(uid, name);
}

export async function refreshAuthToken(uid: string) {
  log.info(`Refresh: uid=${uid}`);

  const user = await authUser(uid);

  const tokenData = await Player.refreshToken(user);

  const updatedUser = await UserModel.setToken(
    user._id,
    tokenData.access_token,
  );

  return updatedUser;
}

// this function is acting as authentication for right now
export async function getUser(uid: string) {
  log.info(`Get: uid=${uid}`);
  const user = await UserModel.getUserByUid(uid);
  if (!user) {
    return null;
  }
  return user;
}

export async function authUser(uid: string) {
  log.info(`Auth: uid=${uid}`);
  const user = await UserModel.getUserByUid(uid);
  if (!user) {
    throw new Error("Not authorized");
  }
  return user;
}

export async function getUserById(userId: string) {
  log.info(`Get by id: userId=${userId}`);
  const user = await UserModel.getUser(userId);
  if (!user) {
    throw new Error("User does not exist");
  }
  return user;
}

export async function getActiveHosts() {
  return UserModel.getActiveHosts();
}

export async function getVibe(userId: string) {
  log.info(`Get Vibe: userId=${userId}`);
  const host = (await getUserById(userId)) as IHost;
  const vibe = await VibeController.getVibe(host.currentVibe);
  return vibe;
}

export async function addSpot(uid: string, code: string) {
  log.info(`Creating: uid=${uid} code=${code}`);

  // make sure the user exists
  const user = await authUser(uid);

  const tokens = await Player.authorize(code);

  const spotifyUser = await Player.getProfile(tokens.access_token);

  // search to see if host has already made an account
  const prevHost = await UserModel.getUserBySpotId(spotifyUser.id);
  if (prevHost) {
    throw new Error("Spotify user already exists");
  }

  const defaultVibe = await VibeController.getVibeByName("Anything Goes");

  if (!defaultVibe) {
    throw new Error("Vibe don't exist");
  }

  // set spotify data
  const newUser = await UserModel.setSpotifyData(
    user._id,
    spotifyUser.id,
    tokens.access_token,
    tokens.refresh_token,
    defaultVibe.id,
  );

  return newUser;
}

export async function getLikes(userId: string) {
  log.info(`Get Like, userId=${userId}`);

  const likes = await TrackLikeModel.getLikesForUser(userId);
  return likes;
}

export async function addTokens(userId: string, num: number) {
  const user = await UserModel.addTokens(userId, num);
  return user;
}

export async function setVibe(uid: string, vibeId: string) {
  log.info(`Set vibe: uid=${uid}, vibeId=${vibeId}`);

  const user = await authUser(uid);

  await UserModel.setVibe(user._id, vibeId);
  return {
    status: "done",
  };
}

export function setDeviceId(id: string, deviceId: string) {
  log.info(`Set device_id: id=${id}, deviceId=${deviceId}`);
  return UserModel.setDeviceId(id, deviceId);
}

export async function removeUserTokens(userId: string, num: number) {
  log.info(`Remove Token: userId=${userId}, num=${num}`);

  const queuer = await getUserById(userId);

  if (queuer.tokens < num) {
    throw new Error("Not enough tokens");
  }

  await UserModel.addTokens(userId, -num);
}

export async function setPlaylistId(uid: string, playlistId: string) {
  log.info(`Set playlistid: uid=${uid} playlist=${playlistId}`);
  const host = await authUser(uid);

  return UserModel.setPlaylistId(host._id, playlistId);
}
