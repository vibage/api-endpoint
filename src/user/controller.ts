import { createLogger } from "bunyan";
import fetch from "node-fetch";
import { clientId, clientSecret } from "../utils";
import * as VibeController from "../vibe/controller";
import * as UserModel from "./model";

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

  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: `grant_type=refresh_token&refresh_token=${
      user.refreshToken
    }&client_id=${clientId}&client_secret=${clientSecret}`,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const data: ISpotifyAuth = await response.json();

  const updatedUser = await UserModel.setToken(user.id, data.access_token);

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
  const host = await getUserById(userId);
  const vibe = await VibeController.getVibe(host.currentVibe);
  return vibe;
}

export async function addSpot(uid: string, code: string) {
  log.info(`Creating: uid=${uid} code=${code}`);

  // make sure the user exists
  const user = await authUser(uid);

  const redirectUri = encodeURIComponent("https://fizzle.tgt101.com");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    body:
      `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}` +
      `&client_id=${clientId}&client_secret=${clientSecret}`,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const tokens: ISpotifyAuth = await response.json();
  console.log(tokens);
  if (tokens.error) {
    throw new Error("Spotify Auth Expired");
  }

  // get the user's spotify id
  const userDataRes = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });
  const spotifyUser: ISpotifyUser = await userDataRes.json();
  console.log(spotifyUser);

  // search to see if host has already made an account
  const prevHost = await UserModel.getUserBySpotId(spotifyUser.id);
  if (prevHost) {
    throw new Error("Spotify user already exists");
  }

  // set spotify data
  const newUser = await UserModel.setSpotifyData(
    user.id,
    spotifyUser.id,
    tokens.access_token,
    tokens.refresh_token,
  );

  return newUser;
}

export async function getLikes(userId: string) {
  log.info(`Get Like, userId=${userId}`);

  const likes = await UserModel.getLikes(userId);
  return likes;
}

export async function addTokens(userId: string, num: number) {
  const user = await UserModel.addTokens(userId, num);
  return user;
}

export async function setVibe(uid: string, vibeId: string) {
  log.info(`Set vibe: uid=${uid}, vibeId=${vibeId}`);

  const user = await authUser(uid);

  const res = await UserModel.setVibe(user.id, vibeId);
  return res;
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

  const user = await UserModel.addTokens(userId, -num);
  return user;
}
