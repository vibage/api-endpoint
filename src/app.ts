import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import path from "path";
export const app = express();

// configure environment variables
const envPath = path.join(__dirname, `../dotenv/${process.env.NODE_ENV}.env`);
console.log("Path:", envPath);
config({ path: envPath });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,  Access-Control-Allow-Headers, Authorization",
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
