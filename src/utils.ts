import { createLogger } from "bunyan";
import * as UserModel from "./users/model";
import * as UserController from "./users/controller";
import fetch from "node-fetch";
import { ISpotifyUserModel } from "./def/spotifyUser";

// Dannyiel Voos came up with name (ish)

const log =  createLogger({ name: "Utils" })

async function sendRequest(route: string, method: string, token: string, payload?: Object) {

  const body = method === "GET" ? {} : { body: JSON.stringify(payload), method };

  const options = {
    ...body,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  log.info({ options });


  const res = await fetch(`https://api.spotify.com${route}`, options);

  if (res.status === 204) {
    return {
      status: "204"
    };
  }
  const data = await res.json();
  return data;
}

export async function makeApiRequest(route: string, method: string, userThing: string | ISpotifyUserModel, payload?: Object) {
  log.info(`API Request: route=${route}, method=${method}`);

  // get user
  const user = (typeof userThing === "string") ? await UserModel.getUser(userThing) : userThing;

  if (!user) throw new Error("User does not exist");

  const data = await sendRequest(route, method, user.accessToken, payload);

  // check if it is an expired token
  if (data.error && data.error.message === "The access token expired" && data.error.status === 401) {
    log.info("Refreshing Token");
    await UserController.refreshToken(user.id);
    await sendRequest(route, method, user.accessToken, payload);
  }

  return data;
}