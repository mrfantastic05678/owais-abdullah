"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { z } from "zod";

// Message schema
const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

// User input schema
const UserInputSchema = z
  .string()
  .min(1)
  .max(1000)
  .refine(
    (input) => ![/script/i, /<.*>/, /\{\{.*\}\}/, /\$\{.*\}/].some((pattern) => pattern.test(input)),
    { message: "Input contains potentially unsafe content" },
  );

type Message = z.infer<typeof MessageSchema>;

// Mock response for rate limits
const getMockResponse = (query: string): string => {
  const sanitizedQuery = query.length > 50 ? query.substring(0, 50) + "..." : query;
  return `
I'm currently at my rate limit. Please try again soon!

**Meanwhile, I can help with:**
- Questions about my portfolio
- My services or technologies

Your question was: *"${sanitizedQuery}"*
  `;
};

const AUTO_CLEAR_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("chatMessages");
      localStorage.removeItem("chatLastUpdated");
      setMessages([
        {
          role: "assistant",
          content: "I am Owais's AI assistant. Ask me anything about his spec-driven development process, Digital FTEs, Next.js SaaS architecture, or ultra-fast Astro builds.",
        },
      ]);
    }
  }, []);

  const startAutoClearTimer = useCallback(() => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
    }
    clearTimerRef.current = setTimeout(() => {
      clearLocalStorage();
    }, AUTO_CLEAR_TIMEOUT);
  }, [clearLocalStorage]);

  // Sync conversation session to Neon PostgreSQL
  const syncSessionToDb = useCallback(
    async (
      msgs: Message[],
      lead?: {
        name?: string;
        email?: string;
        website?: string;
        phone?: string;
        message?: string;
        source?: string;
      },
      sessionMode: string = "text"
    ) => {
      if (typeof window === "undefined" || msgs.length <= 1) return;
      try {
        let visitorId = localStorage.getItem("otto_visitor_id");
        if (!visitorId) {
          visitorId = `vis_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
          localStorage.setItem("otto_visitor_id", visitorId);
        }

        let sessionId = sessionStorage.getItem("otto_chat_session_id");
        if (!sessionId) {
          sessionId = `sess_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
          sessionStorage.setItem("otto_chat_session_id", sessionId);
        }

        await fetch("/api/chat/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            visitorId,
            mode: sessionMode,
            messages: msgs,
            leadInfo: lead,
            path: window.location.pathname || "/",
          }),
        });
      } catch {
        // fail-safe background sync
      }
    },
    []
  );

  // Initialize messages and set auto-clear
  useEffect(() => {
    const initializeChat = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("chatMessages");
        const lastUpdated = localStorage.getItem("chatLastUpdated");

        // Check if we should clear existing messages
        if (stored && lastUpdated) {
          const lastUpdateTime = parseInt(lastUpdated);
          const timeSinceLastUpdate = Date.now() - lastUpdateTime;

          if (timeSinceLastUpdate > AUTO_CLEAR_TIMEOUT) {
            clearLocalStorage();
          }
        }

        // Load messages or set default
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setMessages(parsed);
              startAutoClearTimer();
            }
          } catch (e) {
            console.error("Error parsing chatMessages:", e);
          }
        } else {
          setMessages([
            {
              role: "assistant",
              content: "I am Owais's AI assistant. Ask me anything about his spec-driven development process, Digital FTEs, Next.js SaaS architecture, or ultra-fast Astro builds.",
            },
          ]);
        }
      }
    };

    initializeChat();

    return () => {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
      }
    };
  }, [clearLocalStorage, startAutoClearTimer]);

  // Save messages to localStorage and auto-sync to DB
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
      localStorage.setItem("chatLastUpdated", Date.now().toString());
      startAutoClearTimer();

      if (messages.length > 1) {
        syncSessionToDb(messages);
      }
    }
  }, [messages, startAutoClearTimer, syncSessionToDb]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!input.trim()) return;

    try {
      UserInputSchema.parse(input);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0].message);
        return;
      }
    }

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else if (response.status === 429) {
        setMessages((prev) => [...prev, { role: "assistant", content: getMockResponse(input) }]);
      } else {
        throw new Error("API error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "*Sorry, I'm having trouble right now. Try again soon!*" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessages = (newMsgs: Message[]) => {
    setMessages((prev) => [...prev, ...newMsgs]);
  };

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    validationError,
    clearChat: clearLocalStorage,
    addMessages,
    syncSessionToDb,
  };
}