import * as UserModel from "./model";
import fetch from "node-fetch";
import { createLogger } from "bunyan";
import { makeApiRequest } from "../utils";

const log = createLogger({
  name: "Users"
})

export async function requestAuthToken(code: string) {
  log.info(`Authorizing: code=${code}`);

  const redirect_uri = encodeURIComponent(
    "https://tgt101.com/650Panel/login.html",
  );
  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&client_id=a7e126eaee8b4c6f9e689a8b3b15efa5&client_secret=7de3ad7d3a6a4669926a627b5c4588a8`,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const result = await response.json();

  // get the user's spotify id
  const userDataRes = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${result.access_token}`,
    },
  });
  const userData = await userDataRes.json();

  // create playlist for user
  const playlistData = {
    name: "Fizzle List",
    public: false,
    description: "Playlist used to see what songs fizzle is playing. Please do not change anything with this"
  }

  const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
    body: JSON.stringify(playlistData),
    headers: {
      Authorization: `Bearer ${result.access_token}`,
      "Content-Type": "application/json",
    },
    method: "POST"
  });
  const playlistInfo = await playlistRes.json();

  // create the user
  const user = await UserModel.createUser(
    userData.display_name,
    userData.id,
    result.access_token,
    result.refresh_token,
    playlistInfo.id,
    playlistInfo.uri
  );

  return user;
}

export async function refreshToken(userId: string) {
  log.info(`Refresh: userId=${userId}`);

  const user = await UserModel.getUser(userId);

  if (!user) throw new Error("User not found");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: `grant_type=refresh_token&refresh_token=${user.refreshToken}&client_id=a7e126eaee8b4c6f9e689a8b3b15efa5&client_secret=7de3ad7d3a6a4669926a627b5c4588a8`,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const data = await response.json();

  return await UserModel.setTokens(userId, data.access_token);
}

export async function getAuthToken(userId: string) {
  log.info(`Get Auth Token: userId=${userId}`);

  // make this more efficent later
  await makeApiRequest("/v1/me", "GET", userId);

  // perform some kind of authorization here
  const user = await UserModel.getUser(userId);

  if (!user) throw new Error("User does not exist");

  // make sure the token still works

  return user.accessToken;
}
