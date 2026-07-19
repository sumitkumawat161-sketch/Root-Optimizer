import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { env } from "../config/env";
import prisma from "../config/prismaClient";

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: env.clientUrl, methods: ["GET", "POST"] }
  });

  io.on("connection", (socket: Socket) => {
    socket.on("vehicle:location-update", async (payload: {
      vehicleId: string;
      latitude: number;
      longitude: number;
    }) => {
      try {
        await prisma.vehicle.update({
          where: { id: payload.vehicleId },
          data: { latitude: payload.latitude, longitude: payload.longitude }
        });
        io?.emit("vehicle:location-broadcast", payload);
      } catch (err) {
        socket.emit("error", { message: "Failed to update vehicle location" });
      }
    });

    socket.on("disconnect", () => {
      // client disconnected
    });
  });

  return io;
}

export function getIo(): Server {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
}
