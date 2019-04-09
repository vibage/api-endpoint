import { createLogger } from "bunyan";
import * as HostController from "../host/controller";
import { io } from "../server";
import * as TrackController from "../tracks/controller";
import { makeApiRequest } from "../utils";

const log = createLogger({
  name: "Player",
});

export async function startQueue(hostId: string, deviceId: string) {
  log.info(`Playing Fizzle: hostId=${hostId}`);

  const host = await HostController.getHost(hostId);

  const tracks = await TrackController.getTracks(hostId);

  if (tracks.length === 0) {
    throw new Error("Queue empty");
  }

  const payload = {
    uris: [tracks[0].uri],
  };

  const data = await makeApiRequest(
    `/v1/me/player/play?device_id=${deviceId}`,
    "PUT",
    host,
    payload,
  );

  // remove song from queue
  await TrackController.removeTrack(hostId, tracks[0].uri);

  return data;
}

export async function getPlayer(hostId: string) {
  log.info(`Player info: hostId=${hostId}`);

  const host = await HostController.getHost(hostId);

  io.to(hostId).emit("player", JSON.parse(host.player));
}

export async function sendPlayer(hostId: string, player: any) {
  log.info("Sending Player", hostId);
  HostController.setPlayerState(hostId, JSON.stringify(player));
  io.to(hostId).emit("player", player);
  return {
    status: "Done",
  };
}

export async function play(hostId: string) {
  log.info(`Play: hostId=${hostId}`);

  const data = await makeApiRequest("/v1/me/player/play", "PUT", hostId);

  return data;
}

export async function pause(hostId: string) {
  log.info(`Pause: hostId=${hostId}`);

  const data = await makeApiRequest("/v1/me/player/pause", "PUT", hostId);

  return data;
}
