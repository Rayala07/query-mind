import app from "./src/app.js";
import "dotenv/config";
import connectDB from "./src/config/db.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB();

httpServer.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
