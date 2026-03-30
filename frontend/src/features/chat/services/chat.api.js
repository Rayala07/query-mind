import axios from "axios";

const chat_api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const sendMessage = async ({ message, chatId }) => {
  try {
    const response = await chat_api.post("/api/chats/message", {
      message,
      chat: chatId,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getChats = async () => {
  try {
    const response = await chat_api.get("/api/chats");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getMessagesOfChat = async (chatId) => {
  try {
    const response = await chat_api.get(`/api/chats/${chatId}/messages`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteChat = async (chatId) => {
  try {
    const response = await chat_api.delete(`/api/chats/delete/${chatId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
