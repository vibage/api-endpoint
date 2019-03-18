import * as UserModel from "../users/model";
import { createLogger } from "bunyan";
import { makeApiRequest } from "../utils";
import * as TrackController from "../tracks/controller";

const log = createLogger({
  name: "Player"
});

export async function startQueue(userId: string) {
  log.info(`Playing Fizzle: userId=${userId}`);

  const user = await UserModel.getUser(userId);

  if (!user) return false;

  await makeApiRequest("/v1/me/player/repeat", "PUT", user, {state: "off"});
  await makeApiRequest("/v1/me/player/shuffle", "PUT", user, {state: "false"});

  const tracks = await TrackController.getTracks(userId);

  if (tracks.length === 0) throw new Error("Queue empty");

  const payload = {
    uris: [ tracks[0].uri ],
  }


  const data = await makeApiRequest("/v1/me/player/play", "PUT", user, payload);

  return data;
}

export async function getPlayer(userId: string) {
  log.info(`Player info: userId=${userId}`);

  const data = await makeApiRequest("/v1/me/player", "GET", userId);

  return data;
}

export async function play(userId: string) {
  log.info(`Play: userId=${userId}`);

  const data = await makeApiRequest("/v1/me/player/play", "PUT", userId);

  return data;
}

export async function pause(userId: string) {
  log.info(`Pause: userId=${userId}`);

  const data = await makeApiRequest("/v1/me/player/pause", "PUT", userId);

  return data;
}
