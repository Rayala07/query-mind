import { initSocketConnection } from "../services/chat.socket";
import {
  sendMessage,
  getChats,
  getMessagesOfChat,
  deleteChat,
} from "../services/chat.api.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice.js";

export const useChat = () => {
  const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chat);

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true));
      const data = await sendMessage({ message, chatId });
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

  return {
    initSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
