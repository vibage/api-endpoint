import { NextFunction, Request, Response } from "express";
import { AsyncRouteWrapper } from "../utils";
import * as userController from "./controller";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { uid, name } = req.body;
  const user = userController.createUser(uid, name);
  AsyncRouteWrapper(user, res, next);
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  // this should maybe be an auth token later instead of a param
  const { id } = req.params;
  const user = userController.getUser(id);
  AsyncRouteWrapper(user, res, next);
}

export async function refreshAuthToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { uid } = req.body;
  const user = userController.refreshAuthToken(uid);
  AsyncRouteWrapper(user, res, next);
}

export async function getActiveHosts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const users = userController.getActiveHosts();
  AsyncRouteWrapper(users, res, next);
}

export async function addSpotifyData(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { uid, code } = req.body;
  const user = userController.addSpot(uid, code);
  AsyncRouteWrapper(user, res, next);
}

export async function getLikes(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  const likes = userController.getLikes(id);
  AsyncRouteWrapper(likes, res, next);
}
