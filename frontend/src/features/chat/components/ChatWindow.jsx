import { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import { useSelector } from "react-redux";

const WELCOME_MESSAGES = [
  { id: 1, text: "What's on your mind today?" },
  { id: 2, text: "Ready to explore a new topic?" },
  { id: 3, text: "How can QueryMind assist you today?" },
  { id: 4, text: "Ask me anything, I'm here to help." }
];

const ChatWindow = ({ messages }) => {
  const bottomRef = useRef(null);
  const [welcomeMessage, setWelcomeMessage] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!messages || messages.length === 0) {
      const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
      setWelcomeMessage(WELCOME_MESSAGES[randomIndex]);
    }
  }, [messages?.length]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide flex flex-col relative w-full h-full">
      <style>{`
        @keyframes fadeInWelcome {
          from { opacity: 0; transform: translateY(8px); filter: blur(2px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-welcome {
          animation: fadeInWelcome 1s ease-out forwards;
        }
      `}</style>
      
      {(!messages || messages.length === 0) && welcomeMessage ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-white/40 text-3xl font-medium tracking-wide animate-welcome select-none pointer-events-none text-center leading-relaxed">
            {welcomeMessage.text}
          </p>
        </div>
      ) : (
        <div className="w-full space-y-5">
          {messages?.map((msg, idx) => (
            <MessageBubble 
              key={msg._id || msg.id || idx} 
              content={msg.content || msg.message} 
              role={msg.role || (msg.isUser ? "user" : "assistant")} 
            />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
