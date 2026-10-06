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
            className={`group/copy inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-sans font-medium transition-all active:scale-95 cursor-pointer border ${
              copied
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                : "bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-teal-100 border-teal-500/30 hover:border-teal-400/50 shadow-xs"
            }`}
            title="Copy code to clipboard"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-teal-400 group-hover/copy:scale-110 group-hover/copy:text-teal-200 transition-transform shrink-0" />
                <span>Copy</span>
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
