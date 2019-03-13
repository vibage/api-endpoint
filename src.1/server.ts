import { app } from "./app";
import { createLogger } from "bunyan";

const log = createLogger({
  name: "Server"
})

const port = 3000;

const server = app.listen(port, () => log.info(`Listening on port ${port}!`));

export default server;