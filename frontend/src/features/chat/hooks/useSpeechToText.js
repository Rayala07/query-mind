import { useRef, useState, useCallback, useEffect } from "react";

/**
 * useSpeechToText
 *
 * Wraps the browser's Web Speech API and exposes a minimal interface:
 *   - isListening   → boolean, true while recognition is active
 *   - isSupported   → boolean, false when browser lacks the API
 *   - startListening(onResult) → begins recognition; calls onResult(transcript) on interim/final results
 *   - stopListening()          → aborts recognition immediately
 *
 * Config:
 *   - continuous     = false  (auto-stops after a pause)
 *   - interimResults = true   (provides live interim transcripts)
 *   - lang           = "en-IN"
 */
export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(null);

  // Lazy evaluation to ensure window is available.
  const SpeechRecognitionAPI = typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;
    
  const isSupported = Boolean(SpeechRecognitionAPI);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (onResult) => {
      if (!isSupported) return;

      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }

      onResultRef.current = onResult;

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onResultRef.current?.(transcript);
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        if (event.error === "aborted") return;
        recognitionRef.current = null;
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [isSupported]
  );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return { isListening, isSupported, startListening, stopListening };
};
