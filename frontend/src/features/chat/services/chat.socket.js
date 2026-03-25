import { io } from "socket.io-client";

export const initSocketConnection = () => {
  const socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Socket.IO connected to server");
  });
};
