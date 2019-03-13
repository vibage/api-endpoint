import mongoose from "mongoose";
import { createLogger } from "bunyan";

const log = createLogger({ name: "DB"});

const uri = "mongodb+srv://admin:admin@cluster0-aligf.mongodb.net/devices?retryWrites=true";

mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(
    () => {
      log.info("Connected to Database");
    },
    (err) => {
      log.info({ err });
      throw err;
    },
  );