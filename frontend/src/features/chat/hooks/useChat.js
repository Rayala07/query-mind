import { initSocketConnection, getSocket } from "../services/chat.socket";
import {
  sendMessage,
  getChats,
  getMessagesOfChat,
  deleteChat,
} from "../services/chat.api.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
  appendMessageChunk,
  setTyping,
  deleteChat as deleteChatAction,
} from "../chat.slice.js";

export const useChat = () => {
  const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chat);

  useEffect(() => {
    const socket = initSocketConnection();

    const handleMessageChunk = (data) => {
      if (data.chatId && data.chunk) {
        dispatch(
          appendMessageChunk({ chatId: data.chatId, chunk: data.chunk }),
        );
      }
    };

    const handleTyping = (data) => {
      dispatch(setTyping(data.isTyping));
    };

    socket.on("message_chunk", handleMessageChunk);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("message_chunk", handleMessageChunk);
      socket.off("typing", handleTyping);
    };
  }, [dispatch]);

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true));
      const socket = getSocket();
      const socketId = socket?.id;

      const data = await sendMessage({ message, chatId, socketId });
      const { chat, ai_message } = data;

      if (!chatId) {
        dispatch(createNewChat({ chatId: chat._id, title: chat.title }));
      }
      dispatch(
        addNewMessage({
          chatId: chatId || chat._id,
          content: message,
          role: "user",
        }),
      );
      dispatch(
        addNewMessage({
          chatId: chatId || chat._id,
          content: ai_message.content,
          role: ai_message.role,
        }),
      );
      dispatch(setCurrentChatId(chat._id));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    try {
      dispatch(setLoading(true));
      const { chats } = await getChats();

      dispatch(
        setChats(
          chats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdated: chat.updatedAt,
            };
            return acc;
          }, {}),
        ),
      );
      dispatch(setLoading(false));
    } catch (err) {}
  }

  async function handleOpenChat(chatId) {
    try {
      dispatch(setLoading(true));

      if (chats[chatId]?.messages.length === 0) {
        const { messages } = await getMessagesOfChat(chatId);

        const formattedMessages = messages.map((msg) => ({
          content: msg.content,
          role: msg.role,
        }));

        dispatch(addMessages({ chatId, messages: formattedMessages }));
      }
      dispatch(setCurrentChatId(chatId));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError(err));
    }
  }

  async function handleDeleteChat(chatId) {
    try {
      dispatch(setLoading(true));
      await deleteChat(chatId);
      dispatch(deleteChatAction({ chatId }));
      dispatch(setLoading(false));
      dispatch(setCurrentChatId(null));
    } catch (err) {
      dispatch(setError(err));
    }
  }

  return {
    initSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
  };
};
