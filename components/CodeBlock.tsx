"use client";

import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

interface CodeBlockProps {
  code: string;
  className?: string;
}

export default function CodeBlock({ code, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <pre className="bg-muted/70 border border-border/60 p-3 pr-12 rounded-lg overflow-x-auto text-xs font-mono text-foreground">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy command to clipboard"}
        title={copied ? "Copied!" : "Copy to clipboard"}
        className="absolute right-2.5 top-2.5 p-1.5 rounded-md bg-background/80 hover:bg-background border border-border/80 text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm opacity-90 group-hover:opacity-100"
      >
        {copied ? (
          <FaCheck className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <FaCopy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
