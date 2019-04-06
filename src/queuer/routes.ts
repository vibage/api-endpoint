import { createLogger } from "bunyan";
import { Request, Response } from "express";
import * as queuerController from "./controller";

const log = createLogger({
  name: "Queuer",
});

export async function getQueuer(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const queuer = await queuerController.getQueuer(id);
    res.status(200).send(JSON.stringify(queuer));
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function getUserLikes(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const likes = await queuerController.getUserLikes(id);
    res.status(200).send(
      JSON.stringify({
        payload: likes,
      }),
    );
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}

export async function createUser(req: Request, res: Response) {
  const { queuerId } = req.body;
  try {
    const queuer = await queuerController.createQueuer(queuerId);
    res.status(200).send(JSON.stringify(queuer));
  } catch (err) {
    log.error({ err });
    res.status(400).send(err);
  }
}
