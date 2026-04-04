import { useRef, useEffect, useCallback } from "react";
import {
  RiMicLine,
  RiVoiceprintLine,
  RiSendPlaneLine,
  RiLoader4Line,
} from "@remixicon/react";
import { useSpeechToText } from "../hooks/useSpeechToText";

const MessageInput = ({ value, onChange, onSend, isLoading = false }) => {
  const textareaRef = useRef(null);
  const valueRef = useRef(value);

  // Keep valueRef in sync with value prop
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const { isListening, isSupported, startListening, stopListening } =
    useSpeechToText();

  /* ── Auto-resize textarea ─────────────────────────────────────── */
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  /* ── Keyboard shortcut ────────────────────────────────────────── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) onSend?.();
    }
  };

  /* ── Mic toggle ───────────────────────────────────────────────── */
  const handleMicClick = () => {
    if (!isSupported) return;

    if (isListening) {
      stopListening();
    } else {
      // Capture the current value *at the time speech starts* so we don't
      // overwrite any newly typed text before the first results come in.
      // But we must use valueRef.current inside the callback to avoid stale closures.
      const initialValue = valueRef.current;
      
      startListening((transcript) => {
        // Appending the transcript to the value that existed when speech started.
        // This ensures that live updates replace the PREVIOUS interim results,
        // rather than continuously adding to the string.
        const prefix = initialValue.trimEnd();
        onChange(prefix ? `${prefix} ${transcript}` : transcript);
      });
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
          placeholder={
            isListening
              ? "Listening…"
              : isLoading
                ? "Waiting for response…"
                : "Message QueryMind..."
          }
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-sm text-white/85 placeholder-white/25 resize-none outline-none leading-relaxed py-0.5 scrollbar-hide disabled:opacity-50"
          style={{ maxHeight: "160px" }}
        />

        {/* Voice Button */}
        <button
          onClick={handleMicClick}
          disabled={isLoading || !isSupported}
          className={`
            relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl
            transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed
            ${
              isListening
                ? "text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20"
                : "text-white/35 hover:text-white/65 hover:bg-white/[0.06]"
            }
          `}
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          title={
            !isSupported
              ? "Voice input not supported in this browser"
              : isListening
                ? "Stop listening"
                : "Start voice input"
          }
        >
          {/* Pulse ring — visible only while listening */}
          {isListening && (
            <span className="absolute inset-0 rounded-xl animate-ping bg-red-500/20 pointer-events-none" />
          )}

          {isListening ? (
            <RiVoiceprintLine size={17} />
          ) : (
            <RiMicLine size={17} />
          )}
        </button>

        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={!value?.trim() || isLoading}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white/60 hover:text-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
          aria-label="Send message"
        >
          {isLoading ? (
            <RiLoader4Line size={16} className="animate-spin" />
          ) : (
            <RiSendPlaneLine size={16} />
          )}
        </button>
      </div>

      <p className="text-center text-[10px] text-white/15 mt-2.5 tracking-wide">
        QueryMind can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default MessageInput;
