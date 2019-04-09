import { createLogger } from "bunyan";
import fetch from "node-fetch";
import { IHostModel } from "../def/host";
import { IVibeModel } from "../def/vibe";
import { makeApiRequest } from "../utils";
import * as VibeController from "../vibe/controller";
import * as HostModel from "./model";

const log = createLogger({
  name: "Host",
});

export async function getHost(hostId: string): Promise<IHostModel> {
  const host = await HostModel.getUser(hostId);
  if (!host) {
    throw new Error("Host does not exist");
  }
  return host;
}

export function setPlayerState(hostId: string, player: string) {
  return HostModel.setPlayerState(hostId, player);
}

export async function createHost(code: string, name: string, uid: string) {
  log.info(`Creating: code=${code}, name=${name}, uid=${uid}`);

  // check if host with uri already exists

  const hostByUid = await HostModel.getHostByUid(uid);
  if (hostByUid) {
    throw new Error("Already made account");
  }

  const redirectUri = encodeURIComponent("https://fizzle.tgt101.com");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    body:
      `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}` +
      `&client_id=a7e126eaee8b4c6f9e689a8b3b15efa5&client_secret=7de3ad7d3a6a4669926a627b5c4588a8`,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const tokens: ISpotifyAuth = await response.json();

  console.log(tokens);

  // get the user's spotify id
  const userDataRes = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });
  const spotifyUser: ISpotifyUser = await userDataRes.json();

  console.log(spotifyUser);

  // search to see if host has already made an account
  // const prevHost = HostModel.doesSpotifyIdExist(spotifyUser.id);

  // if (prevHost) {
  //   log.info("Spotify user already exists");
  //   return prevHost;
  // }

  const vibe = await VibeController.createVibe(spotifyUser.id);

  // create the user
  const host = await HostModel.createUser(
    name,
    uid,
    spotifyUser.id,
    tokens.access_token,
    tokens.refresh_token,
    vibe._id,
  );

  return host;
}

export async function refreshToken(hostId: string) {
  log.info(`Refresh: hostId=${hostId}`);

  const user = await HostModel.getUser(hostId);

  if (!user) {
    throw new Error("User not found");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: `grant_type=refresh_token&refresh_token=${
      user.refreshToken
    }&client_id=a7e126eaee8b4c6f9e689a8b3b15efa5&client_secret=7de3ad7d3a6a4669926a627b5c4588a8`,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const data = await response.json();

  return await HostModel.setTokens(hostId, data.access_token);
}

export async function getAuthToken(hostId: string) {
  log.info(`Get Auth Token: hostId=${hostId}`);

  // perform some kind of authorization here
  const host = await getHost(hostId);

  return host.accessToken;
}

export async function getNearbyUsers() {
  log.info("Get all");
  return HostModel.getAllUsers();
}

export async function searchSpotify(hostId: string, query: string) {
  log.info(`Search: hostId=${hostId}, query=${query}`);
  // load users settings

  const host = await getHost(hostId);

  const result: { tracks: { items: ITrack[] } } = await makeApiRequest(
    `/v1/search?q=${query}&type=track`,
    "GET",
    hostId,
  );

  const vibe = (await VibeController.getVibe(host.currentVibe)) as IVibeModel;

  // filter results based on user settings
  const filteredTracks = result.tracks.items.filter((track) => {
    if (!vibe.explicit && track.explicit) {
      return false;
    }
    return true;
  });

  return { tracks: { items: filteredTracks } };
}

export async function getVibe(hostId: string) {
  log.info(`Get Vibe: hostId=${hostId}`);
  const host = await getHost(hostId);
  const vibe = await VibeController.getVibe(host.currentVibe);
  return vibe;
}
