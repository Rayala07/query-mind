import { io } from "socket.io-client";

let socket;

export const initSocketConnection = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected to server with ID:", socket.id);
    });
  }
  return socket;
};

export const getSocket = () => {
  return socket;
};
