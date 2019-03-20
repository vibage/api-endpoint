import { createLogger } from "bunyan";
import { Request, Response } from "express";
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

export async function getNearbyUsers(req: Request, res: Response) {
  const users = await controller.getNearbyUsers();
  res.send(users);
}
