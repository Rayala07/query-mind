import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { useSelector } from "react-redux";

const ChatWindow = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-hide">
      {messages?.map((msg, idx) => (
        <MessageBubble key={msg._id || msg.id || idx} content={msg.content || msg.message} role={msg.role || (msg.isUser ? "user" : "assistant")} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
