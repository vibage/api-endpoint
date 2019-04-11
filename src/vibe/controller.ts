import { createLogger } from "bunyan";
import * as VibeModel from "./model";

const log = createLogger({
  name: "Vibe",
});

export async function createVibe(hostId: string) {
  log.info(`Create: hostId=${hostId}`);
  const vibe = await VibeModel.createVibe(hostId);
  return vibe;
}

export async function removeVibe(vibeId: string) {
  log.info(`Remove: vibeId=${vibeId}`);
  const vibe = await VibeModel.removeVibe(vibeId);
  return vibe;
}

export async function getVibe(vibeId: string | undefined) {
  log.info(`Get: vibeId=${vibeId}`);
  if (!vibeId) { return null; }
  const vibe = await VibeModel.getVibe(vibeId);
  if (!vibe) {
    throw new Error("Vibe does not exist");
  }
  return vibe;
}

export async function setGenera(vibeId: string, genera: string) {
  log.info(`Add Genre: vibeId=${vibeId}, genera=${genera}`);

  // add genre to vibe database
  const vibe = await VibeModel.setGenera(vibeId, genera);

  return vibe;
}

export async function setExplicit(vibeId: string, explicit: boolean) {
  log.info(`Set Explicit: vibeId=${vibeId}, explicit=${explicit}`);

  const vibe = await VibeModel.setExplicit(vibeId, explicit);
  return vibe;
}
