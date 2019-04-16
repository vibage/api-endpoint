import { createLogger } from "bunyan";
import { Request, Response } from "express";
import * as VibeController from "./controller";

const log = createLogger({
  name: "Vibe",
});

export async function createVibe(req: Request, res: Response) {
  const { hostId } = req.body;
  try {
    const vibe = await VibeController.createVibe(hostId);
    res.status(200).send(vibe);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function removeVibe(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const vibe = await VibeController.removeVibe(id);
    res.status(200).send(vibe);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function getVibe(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const vibes = await VibeController.getVibe(id);
    res.status(200).send(vibes);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function setGenre(req: Request, res: Response) {
  const { genre } = req.body;
  const { id } = req.params;
  try {
    const vibe = await VibeController.setGenera(id, genre);
    res.status(200).send(vibe);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function getPopular(req: Request, res: Response) {
  try {
    const vibes = await VibeController.getPopular();
    res.status(200).send(vibes);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function setExplicit(req: Request, res: Response) {
  const { id } = req.params;
  const { explicit } = req.body;
  try {
    const vibe = await VibeController.setExplicit(id, explicit);
    res.status(200).send(vibe);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}
