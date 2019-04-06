import { createLogger } from "bunyan";
import { NextFunction, Response } from "express";
import fetch from "node-fetch";
import { IHostModel } from "./def/host";
import * as HostController from "./host/controller";
import * as HostModel from "./host/model";

const log = createLogger({ name: "Utils" });

async function sendRequest(
  route: string,
  method: string,
  token: string,
  payload?: object,
) {
  const body =
    method === "GET" ? {} : { body: JSON.stringify(payload), method };

  const options = {
    ...body,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  log.info({ options });

  const res = await fetch(`https://api.spotify.com${route}`, options);

  if (res.status === 204) {
    return {
      status: "204",
    };
  }
  const data = await res.json();

  return data;
}

export async function makeApiRequest(
  route: string,
  method: string,
  userThing: string | IHostModel,
  payload?: object,
) {
  log.info(`API Request: route=${route}, method=${method}`);

  // get user
  const user =
    typeof userThing === "string"
      ? await HostModel.getUser(userThing)
      : userThing;

  if (!user) {
    throw new Error("User does not exist");
  }

  const data = await sendRequest(route, method, user.accessToken, payload);

  // check if it is an expired token
  if (
    data.error &&
    data.error.message === "The access token expired" &&
    data.error.status === 401
  ) {
    log.info("Refreshing Token");
    await HostController.refreshToken(user.id);
    await sendRequest(route, method, user.accessToken, payload);
  }

  return data;
}

export function RouteWrapper(
  value: Promise<any>,
  res: Response,
  next: NextFunction,
): void {
  value
    .then((val) => {
      res.send(val);
    })
    .catch((err) => {
      next(err);
    });
}
