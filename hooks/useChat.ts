"use client";

import { useState, useEffect } from "react";
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

export function useChat() {
  // Initialize messages as an empty array
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Load messages from localStorage only on the client side
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chatMessages");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setMessages(parsed); // Set stored messages
          }
        } catch (e) {
          console.error("Error parsing chatMessages:", e);
        }
      } else {
        // Set a default welcome message if nothing is stored
        setMessages([
          {
            role: "assistant",
            content: "**Hello!** I'm here to help You. Ask anything about Owais Abdullah's services or tech!",
          },
        ]);
      }
    }
  }, []); 

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
        { role: "assistant", content: "*Sorry, I&#39;m having trouble right now. Try again soon!*" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, setInput, handleSubmit, isLoading, validationError };
}