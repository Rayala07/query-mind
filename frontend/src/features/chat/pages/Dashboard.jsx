import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { useChat } from "../hooks/useChat";
import { setCurrentChatId } from "../chat.slice";
import { initSocketConnection } from "../services/chat.socket";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { chats, currentChatId, isLoading } = useSelector((state) => state.chat);
  const { handleSendMessage, handleGetChats, handleOpenChat } = useChat();

  useEffect(() => {
    initSocketConnection();
    handleGetChats();
  }, []);

  const [inputValue, setInputValue] = useState("");

  const messages = chats[currentChatId]?.messages || [];

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    setInputValue("");
    await handleSendMessage({ message: trimmed, chatId: currentChatId });
  };

  const handleSelectChat = (chatId) => {
    handleOpenChat(chatId);
  };

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
    setInputValue("");
  };

  return (
    <main className="h-screen bg-[#080808] text-white flex overflow-hidden">
      <Sidebar
        activeChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* Chat Area */}
      <section className="flex-1 flex flex-col min-w-0">
        <ChatWindow messages={messages} />
        <MessageInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </section>
    </main>
  );
};

export default Dashboard;
