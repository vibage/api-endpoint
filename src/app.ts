import * as bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { createLogger } from "bunyan";
export const app = express();

const log = createLogger({ name: "App"});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

import "./spotify/routes";
import "./smart_home/routes";

app.get("/ping", (_: Request, res: Response) => {
  log.info("pong " + new Date().getTime());
  res.send("pong");
});

import "./db";

