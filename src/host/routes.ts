import { createLogger } from "bunyan";
import { NextFunction, Request, Response } from "express";
import { RouteWrapper } from "../utils";
import * as controller from "./controller";

const log = createLogger({
  name: "Users",
});

export async function authorize(req: Request, res: Response) {
  const { code } = req.query;
  try {
    const user = await controller.requestAuthToken(code);
    res.status(200).send(user);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function refreshToken(req: Request, res: Response) {
  const { id } = req.body;
  try {
    const user = await controller.refreshToken(id);
    res.status(200).send(user);
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function getToken(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const token = await controller.getAuthToken(id);
    res.status(200).send(token);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

export async function getNearbyUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  RouteWrapper(controller.getNearbyUsers(), res, next);
}

export async function searchSpotify(req: Request, res: Response) {
  const { id } = req.params;
  const { query } = req.query;
  const data = await controller.searchSpotify(id, query);
  res.send(data);
}

export async function getVibe(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const vibe = await controller.getVibe(id);
    res.status(200).send(JSON.stringify(vibe));
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}
