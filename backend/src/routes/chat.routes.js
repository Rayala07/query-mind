import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getChats,
  getChat,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/message", authMiddleware, sendMessage);
chatRouter.get("/", authMiddleware, getChats);
chatRouter.get("/:chatId", authMiddleware, getChat);

export default chatRouter;
