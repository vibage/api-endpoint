import { createLogger } from "bunyan";
import { NextFunction, Response } from "express";
import fetch from "node-fetch";
import { IUserModel } from "./def/user";
import * as UserController from "./user/controller";

const log = createLogger({ name: "Utils" });

export const clientId = "a7e126eaee8b4c6f9e689a8b3b15efa5";
export const clientSecret = "7de3ad7d3a6a4669926a627b5c4588a8";

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

  log.info({ body });

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
  userThing: string | IUserModel,
  payload?: object,
) {
  log.info(`API Request: route=${route}, method=${method}`);

  // get user
  const user =
    typeof userThing === "string"
      ? await UserController.getUserById(userThing)
      : userThing;

  if (!user) {
    throw new Error("User does not exist");
  }

  const data = await sendRequest(
    route,
    method,
    user.accessToken as string,
    payload,
  );

  // check if it is an expired token
  if (
    data.error &&
    data.error.message === "The access token expired" &&
    data.error.status === 401
  ) {
    log.info("Refreshing Token");
    await UserController.refreshAuthToken(user.id);
    await sendRequest(route, method, user.accessToken as string, payload);
  }

  return data;
}

export function AsyncRouteWrapper<T>(
  value: Promise<T>,
  res: Response,
  next: NextFunction,
) {
  value
    .then((val) => {
      res.status(200).json(val);
    })
    .catch((err) => {
      next(err);
    });
}
