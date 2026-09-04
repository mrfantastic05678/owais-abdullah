"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowUpRight, Check, Star } from "lucide-react";

interface GooglePreferredSourceProps {
  variant?: "card" | "pill" | "compact";
  placement?: string;
  className?: string;
}

declare global {
  interface Window {
    preferredSource?: {
      init: (options: { theme?: string; lang?: string }) => void;
      addPreferredSource: () => void;
    };
    PREFERRED_SOURCE?: Array<(sdk: any) => void>;
  }
}

// Authentic Google 'G' Multi-color SVG Icon
export function GoogleGIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.28 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.24A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.24 5.42l4.04-3.15z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function GooglePreferredSourceButton({
  variant = "pill",
  placement = "general",
  className = "",
}: GooglePreferredSourceProps) {
  const pathname = usePathname();
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClicked(true);

    // 1. Log Telemetry to Server
    try {
      const payload = JSON.stringify({
        event: "google_preferred_click",
        variant: "A",
        path: pathname,
        placement,
      });

      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon("/api/promo-tracking", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/promo-tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}

    // 2. Trigger Google Flow (SDK or Smooth Centered Popup Fallback)
    if (typeof window !== "undefined" && window.preferredSource?.addPreferredSource) {
      window.preferredSource.addPreferredSource();
    } else {
      const targetUrl = "https://www.google.com/preferences/source?q=owaisabdullah.dev";
      const width = 640;
      const height = 720;
      const left = window.screen.width ? (window.screen.width - width) / 2 : 100;
      const top = window.screen.height ? (window.screen.height - height) / 2 : 100;

      window.open(
        targetUrl,
        "GoogleSourcePreferences",
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );
    }
  };

  // -------------------------------------------------------------------------
  // VARIANT 1: CARD (For Bottom of Blog Articles)
  // -------------------------------------------------------------------------
  if (variant === "card") {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#0b1329] via-[#091024] to-[#060a17] p-5 sm:p-6 text-foreground shadow-xl shadow-blue-950/30 ${className}`}
      >
        {/* Google Colors Ambient Corner Glows */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <GoogleGIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono tracking-wider uppercase text-blue-400 font-bold flex items-center gap-1">
                  <Star size={11} className="fill-blue-400 text-blue-400" />
                  Google Preferred Source
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-sans text-white leading-snug">
                Follow Owais Abdullah on Google Search & Discover
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1 max-w-xl">
                Add this domain as a preferred source to see new AI engineering, Next.js SaaS, and Digital FTE breakdowns prioritized in your Google Top Stories, AI Overviews, and Discover feed.
              </p>
            </div>
          </div>

          <button
            onClick={handleClick}
            className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-white/90 text-neutral-900 font-semibold text-xs transition-all duration-200 shadow-md shadow-white/10 hover:shadow-white/20 active:scale-[0.98] shrink-0 self-start md:self-center"
          >
            <GoogleGIcon className="w-4 h-4" />
            <span>{clicked ? "Added / Opening Preferences" : "Add as Preferred Source"}</span>
            {clicked ? (
              <Check size={14} className="text-emerald-600" />
            ) : (
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VARIANT 2: PILL (For Footer & Page Headers)
  // -------------------------------------------------------------------------
  if (variant === "pill") {
    return (
      <button
        onClick={handleClick}
        className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card/80 hover:border-blue-500/40 hover:bg-card text-foreground text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/10 active:scale-95 ${className}`}
      >
        <GoogleGIcon className="w-3.5 h-3.5" />
        <span className="group-hover:text-blue-400 transition-colors">
          {clicked ? "Opening Google Preferences..." : "Make Preferred on Google"}
        </span>
        <ArrowUpRight size={12} className="text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    );
  }

  // -------------------------------------------------------------------------
  // VARIANT 3: COMPACT (Minimal Inline Badge)
  // -------------------------------------------------------------------------
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-blue-400 transition-colors font-mono ${className}`}
    >
      <GoogleGIcon className="w-3.5 h-3.5" />
      <span>Add on Google</span>
    </button>
  );
}
