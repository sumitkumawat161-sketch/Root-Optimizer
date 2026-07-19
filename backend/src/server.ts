import http from "http";
import app from "./app";
import { env } from "./config/env";
import { initSocket } from "./sockets/trackingSocket";

const server = http.createServer(app);

initSocket(server);

server.listen(env.port, () => {
  console.log(`Route Optimizer backend running on port ${env.port}`);
});
