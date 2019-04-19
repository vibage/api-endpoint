import { createLogger } from "bunyan";
import mongoose from "mongoose";

const log = createLogger({ name: "DB" });

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("No mongo uri!");
}

mongoose.connect(uri, { useNewUrlParser: true }).then(
  () => {
    log.info(`Connected to Database at ${uri}`);
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
