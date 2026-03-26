import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

const mockMessages = [
  {
    id: 1,
    isUser: true,
    message: "What is the difference between supervised and unsupervised learning?",
  },
  {
    id: 2,
    isUser: false,
    message:
      "Great question!\n\nSupervised learning trains on labeled data — the model learns the mapping from inputs to known outputs. Examples include classification and regression.\n\nUnsupervised learning works with unlabeled data, finding hidden patterns or structures on its own. Examples include clustering (K-Means) and dimensionality reduction (PCA).\n\nThe key distinction: supervised learning requires ground truth labels; unsupervised does not.",
  },
  {
    id: 3,
    isUser: true,
    message: "Can you give me a practical real-world example of each?",
  },
  {
    id: 4,
    isUser: false,
    message:
      "Sure!\n\nSupervised: Email spam detection — the model is trained on thousands of emails labeled as spam or not spam, and learns to classify new emails accordingly.\n\nUnsupervised: Customer segmentation — a retail company groups customers by purchasing behavior without predefined categories, discovering natural clusters like deal hunters, loyal shoppers, etc.",
  },
];

const Dashboard = () => {
  const [messages, setMessages] = useState(mockMessages);
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
    setMessages([]);
    setInputValue("");
    setActiveChatId(null);
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
