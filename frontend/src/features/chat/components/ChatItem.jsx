import { RiDeleteBinLine } from "@remixicon/react";

const ChatItem = ({ title, isActive = false, onClick, onDelete }) => {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 ${
        isActive ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <span className="text-sm text-white/70 truncate flex-1 group-hover:text-white/90 transition-colors duration-150">
        {title}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="ml-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-all duration-150 flex-shrink-0"
        aria-label="Delete chat"
      >
        <RiDeleteBinLine size={14} />
      </button>
    </div>
  );
};

export default ChatItem;
