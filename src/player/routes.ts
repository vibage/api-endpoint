import { Request, Response } from "express";
import * as PlayerController from "./controller";
import { createLogger } from "bunyan";

const log = createLogger({
  name: "Player"
})

export async function playPlaylist(req: Request, res: Response) {
  const { id } = req.body;
  await PlayerController.playPlaylist(id);
  res.send("done");
}

export async function play(req: Request, res: Response) {
  const { id } = req.body;
  try {
    await PlayerController.play(id);
    res.status(200).send("done");
  } catch(err) {
    log.error({ err });
    res.status(200).send(err);
  }
}

export async function pause(req: Request, res: Response) {
  const { id } = req.body;
  try {
    await PlayerController.pause(id);
    res.status(200).send("done");
  } catch(err) {
    log.error({ err });
    res.status(200).send(err);
  }
}