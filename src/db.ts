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

// import * as admin from "firebase-admin";
// import serviceAccount from "./keys/vibage-ad58445fd61c.json";

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as any),
// });

// export const db = admin.firestore();

// db.collection("users");

// const docRef = db.collection("users").doc("alovelace");

// const setAda = docRef.set({
//   first: "Ada",
//   last: "Lovelace",
//   born: 1815,
// });
