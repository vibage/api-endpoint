import { createLogger } from "bunyan";
import http from "http";
import socketIO from "socket.io";
import { app } from "./app";

export const server = new http.Server(app);

const log = createLogger({
  name: "Server",
});

export const io = socketIO(server);

io.on("connection", (socket) => {
  log.info("Connection");
  socket.on("myId", (id: any) => {
    log.info(`Join Room ${id}`);
    socket.join(id);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => log.info(`Listening on port ${port}!`));
