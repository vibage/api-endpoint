import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
app.use(cookieParser());

import "./db";
import "./routes";

app.use((err: any, req: any, res: any, next: any) => {
  console.log(err);
  res.status(500).send(err.message);
});
