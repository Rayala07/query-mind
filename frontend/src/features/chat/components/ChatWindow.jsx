import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

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
      "Great question!\n\n**Supervised learning** trains on labeled data — the model learns the mapping from inputs to known outputs. Examples include classification and regression.\n\n**Unsupervised learning** works with unlabeled data, finding hidden patterns or structures on its own. Examples include clustering (K-Means) and dimensionality reduction (PCA).\n\nThe key distinction: supervised learning requires ground truth labels; unsupervised does not.",
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
      "Sure!\n\n**Supervised:** Email spam detection — the model is trained on thousands of emails labeled as \"spam\" or \"not spam\", and learns to classify new emails accordingly.\n\n**Unsupervised:** Customer segmentation — a retail company groups customers by purchasing behavior without predefined categories, discovering natural clusters like \"deal hunters\", \"loyal shoppers\", etc.",
  },
];

const ChatWindow = ({ messages = mockMessages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-hide">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg.message} isUser={msg.isUser} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
