import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

const Dashboard = () => {
  const { chats, currentChatId } = useSelector((state) => state.chat);
  const [messages, setMessages] = useState(chats[currentChatId]?.messages || []);
  const [inputValue, setInputValue] = useState("");
  const [activeChatId, setActiveChatId] = useState(1);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), isUser: true, message: trimmed },
    ]);
    setInputValue("");
  };

  const handleNewChat = () => {
    setMessages(chats[currentChatId]?.messages || []);
    setInputValue("");
    setActiveChatId(currentChatId);
  };

  return (
    <main className="h-screen bg-[#080808] text-white flex overflow-hidden">
      <Sidebar
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
      />

      {/* Chat Area */}
      <section className="flex-1 flex flex-col min-w-0">
        <ChatWindow messages={messages} />
        <MessageInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
        />
      </section>
    </main>
  );
};

export default Dashboard;
