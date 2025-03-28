"use client";

import { useState, useEffect, useRef } from "react";
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
  // Initialize messages as an empty array
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

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
              startAutoClearTimer(); // Start timer after loading
            }
          } catch (e) {
            console.error("Error parsing chatMessages:", e);
          }
        } else {
          setMessages([
            {
              role: "assistant",
              content: "**Hello!** I'm here to help You. Ask anything about Owais Abdullah's services or tech!",
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
  }, []);

  // Save messages and update timer
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
      localStorage.setItem("chatLastUpdated", Date.now().toString());
      startAutoClearTimer(); // Reset timer on any message change
    }
  }, [messages]);

  const startAutoClearTimer = () => {
    // Clear any existing timer
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
    }
    
    // Set new timer
    clearTimerRef.current = setTimeout(() => {
      clearLocalStorage();
    }, AUTO_CLEAR_TIMEOUT);
  };

  const clearLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("chatMessages");
      localStorage.removeItem("chatLastUpdated");
      setMessages([
        {
          role: "assistant",
          content: "**Hello!** I'm here to help You. Ask anything about Owais Abdullah's services or tech!",
        },
      ]);
    }
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!input.trim()) return;

    // Validate input
    try {
      UserInputSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0]?.message || "Invalid input");
        return;
      }
    }

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Call the API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
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
        { role: "assistant", content: "*Sorry, I&apos;m having trouble right now. Try again soon!*" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, setInput, handleSubmit, isLoading, validationError };
}