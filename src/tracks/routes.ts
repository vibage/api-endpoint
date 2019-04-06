import { createLogger } from "bunyan";
import { Request, Response } from "express";
import * as trackController from "./controller";

const log = createLogger({
  name: "Track",
});

export async function addTrack(req: Request, res: Response) {
  const { hostId, trackId } = req.body;
  const ip = req.connection.remoteAddress as string;
  try {
    const track = await trackController.addTrack(hostId, trackId, ip);
    res.status(200).send(JSON.stringify(track));
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function removeTrack(req: Request, res: Response) {
  const { hostId, uri } = req.body;
  try {
    const track = await trackController.removeTrack(hostId, uri);
    res.status(200).send(JSON.stringify(track));
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function getTracks(req: Request, res: Response) {
  const { hostId } = req.params;
  try {
    const tracks = await trackController.getTracks(hostId);
    res.status(200).send(JSON.stringify(tracks));
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function nextTrack(req: Request, res: Response) {
  const { hostId } = req.params;
  try {
    const data = await trackController.nextTrack(hostId);
    res.status(200).send(data);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function likeTrack(req: Request, res: Response) {
  const { hostId, trackUri, userId } = req.body;
  try {
    const like = await trackController.likeTrack(hostId, trackUri, userId);
    res.status(200).send(like);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function pay4Track(req: Request, res: Response) {
  const { hostId, trackUri, userId } = req.body;
  try {
    const track = await trackController.pay4Track(hostId, trackUri, userId);
    res.status(200).send(track);
  } catch (err) {
    log.error({ err });
    res.status(400)
  }
}
