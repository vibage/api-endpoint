import { createLogger } from "bunyan";
import * as VibeModel from "../models/vibe.model";

const log = createLogger({
  name: "Vibe",
});

export async function removeVibe(vibeId: string) {
  log.info(`Remove: vibeId=${vibeId}`);
  const vibe = await VibeModel.removeVibe(vibeId);
  return vibe;
}

export async function getVibe(vibeId: string | undefined) {
  log.info(`Get: vibeId=${vibeId}`);
  if (!vibeId) {
    return null;
  }
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

export async function getPopular() {
  // just return all vibes for now, later we will make it where there are
  // different catagories of vibes you can choose from
  const vibes = await VibeModel.getAll();
  return vibes;
}

export function getVibeByName(name: string) {
  return VibeModel.getVibeByName(name);
}

export async function createDefaultVibes() {
  const vibe = await getVibeByName("Anything Goes");
  if (vibe) {
    log.info("Default Vibes have already been created");
    return;
  }

  log.info("Creating default vibes");

  await VibeModel.createVibe("Anything Goes", true, true);
  await VibeModel.createVibe("Chill Coffee", false, true);
  await VibeModel.createVibe("Playlist Only", true, false);
}
