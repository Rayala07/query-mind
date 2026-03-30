import { useRef, useEffect, useCallback } from "react";
import { RiMicLine, RiSendPlaneLine, RiLoader4Line } from "@remixicon/react";

const MessageInput = ({ value, onChange, onSend, isLoading = false }) => {
  const textareaRef = useRef(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) onSend?.();
    }
  };

  return (
    <div className="px-4 py-4 border-t border-white/[0.06] bg-[#080808]">
      <div className="flex items-end gap-2 bg-[#111111] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-white/[0.15] transition-colors duration-200">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Waiting for response…" : "Message QueryMind..."}
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-sm text-white/85 placeholder-white/25 resize-none outline-none leading-relaxed py-0.5 scrollbar-hide disabled:opacity-50"
          style={{ maxHeight: "160px" }}
        />

        {/* Voice Button */}
        <button
          disabled={isLoading}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-white/35 hover:text-white/65 hover:bg-white/[0.06] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Voice input"
        >
          <RiMicLine size={17} />
        </button>

        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={!value?.trim() || isLoading}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white/60 hover:text-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
          aria-label="Send message"
        >
          {isLoading
            ? <RiLoader4Line size={16} className="animate-spin" />
            : <RiSendPlaneLine size={16} />
          }
        </button>
      </div>
      <p className="text-center text-[10px] text-white/15 mt-2.5 tracking-wide">
        QueryMind can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default MessageInput;
