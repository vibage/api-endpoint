import { createLogger } from "bunyan";
import { Request, Response } from "express";
import * as VibeController from "./controller";

const log = createLogger({
  name: "Vibe",
});




export async function addVibe(req: Request, res: Response) {

    const { hostId } = req.body;
  
    try {
      const vibe = await VibeController.addVibe(hostId);
      res.status(200).send(vibe);
    } catch (err) {
      log.error({ err });
      res.status(400).send(err);
    }
}
  
export async function removeVibe(req: Request, res: Response) {
    const { hostId, vibeId } = req.body;
    try {
      const vibe = await VibeController.removeVibe(hostId, vibeId);
      res.status(200).send(vibe);
    } catch (err) {
      log.error({ err });
      res.status(400).send(err);
    }
}
  
export async function getVibes(req: Request, res: Response) {
    const { hostId, vibeId } = req.params;
    try {
      const vibes = await VibeController.getVibes(hostId, vibeId);
      res.status(200).send(vibes);
    } catch (err) {
      log.error({ err });
      res.status(400).send(err);
    }
}
  



export async function addGenre(req: Request, res: Response) {

  const { hostId, vibeId, genre } = req.body;

  try {
    const vibe = await VibeController.addGenre(hostId, vibeId, genre);
    res.status(200).send(vibe);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function removeGenre(req: Request, res: Response) {
  const { hostId, vibeId, genre } = req.body;
  try {
    const vibe = await VibeController.removeGenre(hostId, vibeId, genre);
    res.status(200).send(vibe);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function getGenres(req: Request, res: Response) {
  const { hostId, vibeId } = req.params;
  try {
    const genres = await VibeController.getGenres(hostId, vibeId);
    res.status(200).send(JSON.stringify(genres));
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}



export async function setExplicit(req: Request, res: Response) {
  const { hostId, vibeId, explicit } = req.params;
  try {
    const vibe = await VibeController.setExplicit(hostId, vibeId, explicit);
    res.status(200).send(vibe);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function getExplicit(req: Request, res: Response) {
  const { hostId, vibeId } = req.body;
  try {
    const explicit = await VibeController.getExplicit(hostId, vibeId);
    res.status(200).send(explicit);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}



export async function setPricing(req: Request, res: Response) {
    const { hostId, vibeId, pricing } = req.params;
    try {
      const vibe = await VibeController.setPricing(hostId, vibeId, pricing);
      res.status(200).send(vibe);
    } catch (err) {
      log.error({ err });
      res.status(400).send(err);
    }
  }
  
export async function getPricing(req: Request, res: Response) {
    const { hostId, vibeId } = req.body;
    try {
      const pricing = await VibeController.getPricing(hostId, vibeId);
      res.status(200).send(pricing);
    } catch (err) {
      log.error({ err });
      res.status(400).send(err);
    }
  }
  


export async function setDefaultPlaylist(req: Request, res: Response) {
    const { hostId, vibeId, defaultPlaylist } = req.params;
    try {
      const vibe = await VibeController.setDefaultPlaylist(hostId, vibeId, defaultPlaylist);
      res.status(200).send(vibe);
    } catch (err) {
      log.error({ err });
      res.status(400).send(err);
    }
  }
  
export async function getDefaultPlaylist(req: Request, res: Response) {
    const { hostId, vibeId } = req.body;
    try {
      const defaultPlaylist = await VibeController.getDefaultPlaylist(hostId, vibeId);
      res.status(200).send(defaultPlaylist);
    } catch (err) {
      log.error({ err });
      res.status(400).send(err);
    }
  }
  
  
export async function setName(req: Request, res: Response) {
    const { hostId, vibeId, name } = req.body;
    try { 
      const vibe= await VibeController.setName(hostId, vibeId, name);
      res.status(200).send(vibe);
    } catch (err) {
      log.error({ err });
      res.status(400).send(err);
    }
  }
  
export async function getName(req: Request, res: Response) {
    const { hostId, vibeId } = req.body;
    try {
      const name = await VibeController.getName(hostId, vibeId);
      res.status(200).send(name);
    } catch (err) {
      log.error({ err });
      res.status(400).send(err);
    }
  }
  