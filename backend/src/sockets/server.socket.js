import { Server } from "socket.io";
import "dotenv/config";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  console.log("Socket.IO server is running.")

  io.on("connection", (socket) => {
    console.log("A user connected" + socket.id);
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }

  return io;
}
