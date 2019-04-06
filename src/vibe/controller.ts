import { createLogger } from "bunyan";
import fetch from "node-fetch";
import { ITrackModel } from "../def/track";
import * as HostModel from "../host/model";
import { io } from "../server";
import * as VibeModel from "./model";
import { makeApiRequest } from "../utils";

const log = createLogger({
  name: "Vibe",
});


export async function addGenre(hostId: string, vibeId: string, genre: string) {
  log.info(`Add Genre: hostId=${hostId}, vibeId=${vibeId}, genre=${genre}`);

  // get current genres
  const currentGenres = await getGenres(hostId, vibeId);

  // also need to validate genre type
  //get all genres from spotify

  if (currentGenres.split(',').includes(genre)) { 
    log.error('Genre already added')
    throw 'Genre already added'
  }

  // add genre to vibe database
  const vibe = await VibeModel.addGenre(hostId, vibeId, genre);

  return vibe;
}

export async function removeGenre(hostId: string, vibeId: string, genre: string) {
  log.info(`Removing genre: hostId=${hostId}, vibeId=${vibeId}, genre=${genre}`);

  vibe = await VibeModel.removeGenre(hostId, vibeId, genre);

  return vibe;
}

export async function getGenres(hostId: string, vibeId: string) {
  log.info(`Get Genres: hostId=${hostId}, vibeId=${vibeId}`);

  const genres = await VibeModel.getGenres(hostId, vibeId);
  return genres;
}



export async function setExplicit(hostId: string, vibeId: string, explicit: string) {
  log.info(`Set Explicit: hostId=${hostId}, vibeId=${vibeId}, explicit=${explicit}`);

  vibe = await VibeModel.setExplicit(hostId, vibeId, explicit);
  return vibe;
}

export async function getExplicit(hostId: string, vibeId: string) {
    log.info(`Get Explicit: hostId=${hostId}, vibeId=${vibeId}`);

    explicit = await VibeModel.getExplicit(hostId, vibeId);
    return explicit;
}


export async function setPricing(hostId: string, vibeId: string, pricing: string) {
    log.info(`set pricing: hostId=${hostId}, vibeId=${vibeId}, pricing=${pricing}`);

    vibe = await VibeModel.setPricing(hostId, vibeId, pricing);
    return vibe;
  }
  
export async function getPricing(hostId: string, vibeId: string) {
    log.info(`get pricing: hostId=${hostId}, vibeId=${vibeId}`);

    pricing = await VibeModel.getPricing(hostId, vibeId);
    return pricing;
  }
  

  
export async function setDefaultPlaylist(hostId: string, vibeId: string, defaultPlaylist: string) {
    log.info(`set default playlist: hostId=${hostId}, vibeId=${vibeId}, defaultPlaylist=${defaultPlaylist}`);

    vibe = await VibeModel.setDefaultPlaylist(hostId, vibeId, defaultPlaylist);
    return vibe;
  }
  
export async function getDefaultPlaylist(hostId: string, vibeId: string) {
    log.info(`get default playlist: hostId=${hostId}, vibeId=${vibeId}`);

    DefaultPlaylist = await VibeModel.getDefaultPlaylist(hostId, vibeId);
    return DefaultPlaylist;
  }
  
  
  