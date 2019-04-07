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

export async function getVibe(vibeId: string) {
  log.info(`Get: vibeId=${vibeId}`);
  const vibe = await VibeModel.getVibe(vibeId);
  return vibe;
}

export async function setGenera(vibeId: string, genera: string) {
  log.info(`Add Genre: vibeId=${vibeId}, genera=${genera}`);

  // get current genera
  // const currentGenera = await getGenera(hostId, vibeId);

  // also need to validate genre type
  // get all genera from spotify

  // if (currentGenera.split(",").includes(genre)) {
  //   log.error("Genre already added");
  //   throw new Error("Genre already added");
  // }

  // add genre to vibe database
  const vibe = await VibeModel.setGenera(vibeId, genera);

  return vibe;
}

// export async function removeGenre(
//   hostId: string,
//   vibeId: string,
//   genre: string,
// ) {
//   log.info(
//     `Removing genre: hostId=${hostId}, vibeId=${vibeId}, genre=${genre}`,
//   );

//   const vibe = await VibeModel.removeGenre(hostId, vibeId, genre);

//   return vibe;
// }

// export async function getGenres(hostId: string, vibeId: string) {
//   log.info(`Get Genres: hostId=${hostId}, vibeId=${vibeId}`);

//   const genres = await VibeModel.getGenres(hostId, vibeId);
//   return genres;
// }

export async function setExplicit(vibeId: string, explicit: boolean) {
  log.info(`Set Explicit: vibeId=${vibeId}, explicit=${explicit}`);

  const vibe = await VibeModel.setExplicit(vibeId, explicit);
  return vibe;
}

// export async function getExplicit(hostId: string, vibeId: string) {
//   log.info(`Get Explicit: hostId=${hostId}, vibeId=${vibeId}`);

//   const explicit = await VibeModel.getExplicit(hostId, vibeId);
//   return explicit;
// }

// export async function setPricing(
//   hostId: string,
//   vibeId: string,
//   pricing: string,
// ) {
//   log.info(
//     `set pricing: hostId=${hostId}, vibeId=${vibeId}, pricing=${pricing}`,
//   );

//   const vibe = await VibeModel.setPricing(hostId, vibeId, pricing);
//   return vibe;
// }

// export async function getPricing(hostId: string, vibeId: string) {
//   log.info(`get pricing: hostId=${hostId}, vibeId=${vibeId}`);

//   const pricing = await VibeModel.getPricing(hostId, vibeId);
//   return pricing;
// }

// export async function setDefaultPlaylist(
//   hostId: string,
//   vibeId: string,
//   defaultPlaylist: string,
// ) {
//   log.info(
//     `set default playlist: hostId=${hostId}, vibeId=${vibeId}, defaultPlaylist=${defaultPlaylist}`,
//   );

//   const vibe = await VibeModel.setDefaultPlaylist(
//     hostId,
//     vibeId,
//     defaultPlaylist,
//   );
//   return vibe;
// }

// export async function getDefaultPlaylist(hostId: string, vibeId: string) {
//   log.info(`get default playlist: hostId=${hostId}, vibeId=${vibeId}`);

//   const DefaultPlaylist = await VibeModel.getDefaultPlaylist(hostId, vibeId);
//   return DefaultPlaylist;
// }

// export async function setName(hostId: string, vibeId: string, name: string) {
//   log.info(
//     `set default playlist: hostId=${hostId}, vibeId=${vibeId}, defaultPlaylist=${name}`,
//   );

//   const vibe = await VibeModel.setName(hostId, vibeId, name);
//   return vibe;
// }

// export async function getName(hostId: string, vibeId: string) {
//   log.info(`get name: hostId=${hostId}, vibeId=${vibeId}`);

//   const name = await VibeModel.getName(hostId, vibeId);
//   return name;
// }
