import { createLogger } from "bunyan";
import mongoose from "mongoose";

const log = createLogger({ name: "DB" });

const uri =
  process.env.NODE_ENV === "prod"
    ? "mongodb+srv://admin:admin@cluster0-aligf.mongodb.net/devices?retryWrites=true"
    : "mongodb://mongodb:27017/local";

mongoose.connect(uri, { useNewUrlParser: true }).then(
  () => {
    log.info("Connected to Database");
  },
  (err) => {
    log.info({ err });
    throw err;
  },
);
