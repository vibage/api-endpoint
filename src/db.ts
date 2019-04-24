import { createLogger } from "bunyan";
import mongoose from "mongoose";

import * as VibeController from "./vibe/controller";

const log = createLogger({ name: "DB" });

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("No mongo uri!");
}

mongoose.connect(uri, { useNewUrlParser: true }).then(
  () => {
    log.info(`Connected to Database at ${uri}`);

    // Probably should not put this code here.
    // Maybe make function that is ran once db connects and server starts.

    // create default vibes
    VibeController.createDefaultVibes();
  },
  (err) => {
    log.info({ err });
    throw err;
  },
);

// const Firestore = require("@google-cloud/firestore");

// const db = new Firestore({
//   projectId: "vibage",
//   keyFilename: "/path/to/keyfile.json",
// });
