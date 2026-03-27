import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  const { message, chat: chatId } = req.body;

  let title = null;
  let chat = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await Chat.create({
      user: req.user.id,
      title,
    });
  }

  const user_message = await Message.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const messages = await Message.find({ chat: chatId || chat._id });

  const response = await generateResponse(messages);

  const ai_message = await Message.create({
    chat: chatId || chat._id,
    content: response,
    role: "ai",
  });

  res.status(201).json({
    success: true,
    title,
    chat,
    user_message,
    ai_message,
  });
};

export const getChats = async (req, res) => {
  const userId = req.user.id;

  const chats = await Chat.find({ user: userId });

  if (!chats) {
    return res.status(404).json({
      success: false,
      message: "Chats not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Chats retrieved successfully",
    chats,
  });
};

export const getMessagesOfChat = async (req, res) => {
  const chatId = req.params.chatId;

  const chat = await Chat.findOne({ _id: chatId, user: req.user.id });

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  const messages = await Message.find({ chat: chatId });

  res.status(200).json({
    success: true,
    message: "Messages retrieved successfully",
    messages,
  });
};

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findOne({ _id: chatId, user: req.user.id });

  if (!chat) {
    return res.status(404).json({
      status: false,
      message: "Chat not found",
    });
  }

  await Chat.deleteOne({ _id: chatId, user: req.user.id });
  await Message.deleteMany({ chat: chatId });

  res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
};
