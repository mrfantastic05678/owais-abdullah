"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";

interface AgentNavEventDetail {
  target: string;
  displayName: string;
  type?: "section" | "page";
  url?: string;
}

export function AgentNavigationHUD() {
  const [activeNav, setActiveNav] = useState<AgentNavEventDetail | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleNavEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AgentNavEventDetail>;
      if (!customEvent.detail) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setActiveNav(customEvent.detail);

      timerRef.current = setTimeout(() => {
        setActiveNav(null);
        timerRef.current = null;
      }, 2600);
    };

    window.addEventListener("agent_navigation", handleNavEvent);
    return () => {
      window.removeEventListener("agent_navigation", handleNavEvent);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!activeNav) return null;

  return (
    <>
      {/* Top Luminous Progress / Warp Beam */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none overflow-hidden">
        <motion.div
          className="h-full w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 shadow-[0_0_16px_rgba(20,184,166,0.95)]"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 2.4, times: [0, 0.75, 1], ease: "easeInOut" }}
        />
      </div>

      {/* Floating Futuristic HUD Pill */}
      <AnimatePresence>
        {activeNav && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-[99999] pointer-events-none select-none max-w-[calc(100vw-2rem)]"
          >
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/95 dark:bg-[#031518]/95 backdrop-blur-md border border-teal-500/50 text-foreground shadow-2xl shadow-teal-950/50">
              <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                <Image
                  src="/assets/bot.png"
                  alt="Otto AI"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[11px] font-mono font-bold tracking-tight text-teal-400 shrink-0">
                  Otto AI
                </span>
                <span className="text-slate-500 dark:text-slate-600 font-mono text-[10px]">·</span>
                <span className="text-[11px] font-sans font-medium text-slate-100 truncate">
                  Navigating to <strong className="text-teal-300 font-semibold">{activeNav.displayName}</strong>
                </span>
              </div>
              <Compass
                className="w-3.5 h-3.5 text-teal-400 animate-spin ml-1 shrink-0"
                style={{ animationDuration: "4s" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
