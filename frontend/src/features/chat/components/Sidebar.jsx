import { useState } from "react";
import { RiAddLine, RiLogoutBoxLine } from "@remixicon/react";
import ChatItem from "./ChatItem";
import userProfileImg from "../../../assets/user_profile.jpeg";

const mockChats = [
  { id: 1, title: "How does quantum computing work?" },
  { id: 2, title: "Explain React Server Components" },
  { id: 3, title: "Best practices for REST APIs" },
  { id: 4, title: "Machine learning fundamentals" },
  { id: 5, title: "TypeScript advanced types" },
];

const Sidebar = ({ activeChatId, onSelectChat, onNewChat }) => {
  const [chats, setChats] = useState(mockChats);
  const [showLogout, setShowLogout] = useState(false);

  const handleDelete = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <aside className="w-64 h-full flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] flex-shrink-0">
      {/* Top: Profile + New Chat */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowLogout((prev) => !prev)}
            className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10 hover:ring-white/25 transition-all duration-150 flex-shrink-0"
          >
            <img
              src={userProfileImg}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </button>
          {showLogout && (
            <div className="absolute left-0 top-10 z-50 bg-[#141414] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
              <button
                onClick={() => setShowLogout(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors duration-150 whitespace-nowrap w-full"
              >
                <RiLogoutBoxLine size={15} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>

        {/* New Chat */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white/90 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-lg transition-all duration-150"
        >
          <RiAddLine size={14} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-hide">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            title={chat.title}
            isActive={activeChatId === chat.id}
            onDelete={() => handleDelete(chat.id)}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
