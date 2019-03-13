import { Response, Request } from "express";
import * as trackController from "./controller";
import { createLogger } from "bunyan";

const log = createLogger({
  name: "Track"
})

export async function addTrack(req: Request, res: Response) {
  const { id, trackId } = req.body;
  const ip = req.connection.remoteAddress as string;
  try {
    const track = await trackController.addTrack(id, trackId, ip);
    res.status(200).send(JSON.stringify(track))
  } catch (err) {
    log.error({err});
    res.status(400).send(err);
  }
}

export async function removeTrack(req: Request, res: Response) {
  const { id, uri } = req.body;
  try {
    const track = await trackController.removeTrack(id, uri);
    res.status(200).send(JSON.stringify(track))
  } catch (err) {
    log.error({err});
    res.status(400).send(err);
  }
}

export async function getTracks(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const tracks = await trackController.getTracks(id);
    res.status(200).send(JSON.stringify(tracks))
  } catch (err) {
    log.error({err});
    res.status(400).send(err);
  }
}

export async function nextTrack(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const data = await trackController.nextTrack(id);
    res.status(200).send(data);
  }catch (err) {
    log.error({err});
    res.status(400).send(err);
  }
}
