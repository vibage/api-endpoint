import { createLogger } from "bunyan";
import { Request, Response } from "express";
import * as PlayerController from "./controller";

const log = createLogger({
  name: "Player",
});

export async function startQueue(req: Request, res: Response) {
  const { id, deviceId } = req.body;
  await PlayerController.startQueue(id, deviceId);
  res.send({ status: "done" });
}

export async function getPlayer(req: Request, res: Response) {
  const { id } = req.params;
  const data = await PlayerController.getPlayer(id);
  res.send(data);
}

export async function setPlayer(req: Request, res: Response) {
  const { id, state } = req.body;
  const data = await PlayerController.sendPlayer(id, state);
  res.send(data);
}

export async function play(req: Request, res: Response) {
  const { id } = req.body;
  try {
    await PlayerController.play(id);
    res.status(200).send({ status: "done" });
  } catch (err) {
    log.error({ err });
    res.status(200).send(err);
  }
}

export async function pause(req: Request, res: Response) {
  const { id } = req.body;
  try {
    await PlayerController.pause(id);
    res.status(200).send({ status: "done" });
  } catch (err) {
    log.error({ err });
    res.status(200).send(err);
  }
}
