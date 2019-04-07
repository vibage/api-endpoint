import { createLogger } from "bunyan";
import * as HostModel from "../host/model";
import { io } from "../server";
import * as TrackController from "../tracks/controller";
import { makeApiRequest } from "../utils";

const log = createLogger({
  name: "Player",
});

export async function startQueue(userId: string, deviceId: string) {
  log.info(`Playing Fizzle: userId=${userId}`);

  const user = await HostModel.getUser(userId);

  if (!user) {
    return false;
  }

  const tracks = await TrackController.getTracks(userId);

  if (tracks.length === 0) {
    throw new Error("Queue empty");
  }

  const payload = {
    uris: [tracks[0].uri],
  };

  const data = await makeApiRequest(
    `/v1/me/player/play?device_id=${deviceId}`,
    "PUT",
    user,
    payload,
  );

  // remove song from queue
  await TrackController.removeTrack(userId, tracks[0].uri);

  return data;
}

export async function getPlayer(userId: string) {
  log.info(`Player info: userId=${userId}`);

  const user = await HostModel.getUser(userId);
  if (!user) {
    return;
  }

  io.to(userId).emit("player", JSON.parse(user.player));
}

export async function sendPlayer(userId: string, player: any) {
  log.info("Sending Player", userId);
  HostModel.setPlayerState(userId, JSON.stringify(player));
  io.to(userId).emit("player", player);
  return {
    status: "Done",
  };
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
