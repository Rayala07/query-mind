import { initSocketConnection } from "../services/chat.socket";
import {
  sendMessage,
  getChats,
  getMessagesOfChat,
  deleteChat,
} from "../services/chat.api.js";
import { useDispatch } from "react-redux";
import {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
} from "../chat.slice.js";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true));
      const data = await sendMessage({ message, chatId });
      const { chat, ai_message } = data;

      dispatch(createNewChat({ chatId: chat._id, title: chat.title }));
      dispatch(
        addNewMessage({ chatId: chat._id, content: message, role: "user" }),
      );
      dispatch(
        addNewMessage({
          chatId: chat._id,
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

  return {
    initSocketConnection,
    handleSendMessage,
  };
};
