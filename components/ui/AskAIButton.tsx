"use client";

import { MessageCircle } from "lucide-react";

/** Small CTA that opens the existing ChatBot widget via a window event. */
export default function AskAIButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-chat"))}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mt-5"
    >
      <MessageCircle className="w-4 h-4" />
      Ask my AI assistant about my work
    </button>
  );
}
