import { createLogger } from "bunyan";
import { Request, Response } from "express";
import * as userController from "./controller";

const log = createLogger({
  name: "Track",
});

export async function getUserLikes(req: Request, res: Response) {
  const { userId } = req.body;
  try {
    const likes = await userController.getUserLikes(userId);
    res.status(200).send(JSON.stringify(likes));
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function getUserTokens(req: Request, res: Response) {
  const { userId } = req.body;
  try {
    const tokens = await userController.getUserTokens(userId);
    res.status(200).send(JSON.stringify(tokens));
  } catch (err) {
    log.error( {err} );
    res.status(400).send(err);
  }
}

export async function addUserTokens(req: Request, res: Response) {
  const { userId, numTokens } = req.body;
  try {
    const user = await userController.addUserTokens(userId, numTokens);
    res.status(200).send(JSON.stringify(user));
  } catch (err) {
    log.error( {err} );
    res.status(400).send(err);
  }
}

export async function removeUserTokens(req: Request, res: Response) {
  const { userId, numTokens } = req.body;
  try {
    const user = await userController.removeUserTokens(userId, numTokens);
    res.status(200).send(JSON.stringify(user));
  } catch (err) {
    log.error( {err} );
    res.status(400).send(err);
  }
}