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

  console.log("Socket.IO server is running.");

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }

  return io;
}

export function emitToSocket(socketId, event, data) {
  if (io && socketId) {
    io.to(socketId).emit(event, data);
  }
}
