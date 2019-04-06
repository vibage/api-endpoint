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
