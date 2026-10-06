"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

interface EditorialCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function EditorialCodeBlock({
  code,
  language,
  filename,
}: EditorialCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const displayFilename = filename || (language ? `${language.toLowerCase()}` : "code");
  const displayLang = language ? language.toUpperCase() : "CODE";

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border bg-[#020C0E] shadow-lg shadow-black/20 text-left font-mono">
      {/* Top Bar */}
      <div className="bg-[#041417] px-4 py-2.5 border-b border-border flex items-center justify-between text-xs text-muted-foreground select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[11px] sm:text-xs text-muted-foreground font-medium">
            {displayFilename}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] sm:text-[11px] font-mono text-accent font-semibold tracking-wider">
            {displayLang}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/60 hover:bg-secondary text-[11px] text-muted-foreground hover:text-foreground border border-border transition-all active:scale-95"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-sans font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <SplitFlapLabel primary="Copy" secondary="Copy Code" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed text-[#99F6E4] font-mono selection:bg-teal-900/60 selection:text-white">
        <pre className="m-0 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
