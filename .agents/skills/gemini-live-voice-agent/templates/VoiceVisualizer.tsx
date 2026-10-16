"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveVoiceStatus } from "@/hooks/useLiveVoice";

interface VoiceVisualizerProps {
  status: LiveVoiceStatus;
  volume: number; // 0 to 1
  isUserSpeaking: boolean;
}

export function VoiceVisualizer({ status, volume, isUserSpeaking }: VoiceVisualizerProps) {
  const isSpeaking = status === "speaking";
  const isListening = status === "listening";
  const isConnecting = status === "connecting" || status === "requesting-mic";

  // Dynamic scale calculation based on real-time volume
  const dynamicScale = isConnecting
    ? 1
    : 1 + Math.min(volume * 0.7, 0.55);

  const ringScale1 = 1 + Math.min(volume * 1.1, 0.9);
  const ringScale2 = 1 + Math.min(volume * 1.6, 1.3);

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full py-2">
      {/* Visual Cues Container */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        
        {/* Outermost Acoustic Expansion Ring (Ripples outward with sound) */}
        <motion.div
          className="absolute rounded-full border border-teal-500/25 pointer-events-none"
          animate={{
            width: `${140 * ringScale2}px`,
            height: `${140 * ringScale2}px`,
            opacity: isSpeaking || isUserSpeaking ? Math.min(0.6, 0.15 + volume * 0.8) : isConnecting ? 0.2 : 0.08,
            borderColor: isSpeaking
              ? "rgba(20, 184, 166, 0.4)"
              : isUserSpeaking
              ? "rgba(16, 185, 129, 0.45)"
              : "rgba(20, 184, 166, 0.15)",
          }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        />

        {/* Secondary Acoustic Ring */}
        <motion.div
          className="absolute rounded-full border border-teal-400/35 pointer-events-none"
          animate={{
            width: `${115 * ringScale1}px`,
            height: `${115 * ringScale1}px`,
            opacity: isSpeaking || isUserSpeaking ? Math.min(0.8, 0.25 + volume * 0.9) : isConnecting ? 0.3 : 0.15,
            borderColor: isSpeaking
              ? "rgba(45, 212, 191, 0.5)"
              : isUserSpeaking
              ? "rgba(52, 211, 153, 0.55)"
              : "rgba(45, 212, 191, 0.25)",
          }}
          transition={{ duration: 0.09, ease: "easeOut" }}
        />

        {/* Ambient Chromatic Glow Field (Behind central orb) */}
        <motion.div
          className="absolute rounded-full blur-2xl pointer-events-none"
          animate={{
            width: `${120 + volume * 160}px`,
            height: `${120 + volume * 160}px`,
            opacity: isSpeaking ? 0.75 : isUserSpeaking ? 0.65 : isConnecting ? 0.55 : 0.35,
            background: isSpeaking
              ? "radial-gradient(circle, rgba(20,184,166,0.65) 0%, rgba(13,148,136,0.25) 50%, transparent 75%)"
              : isUserSpeaking
              ? "radial-gradient(circle, rgba(16,185,129,0.65) 0%, rgba(5,150,105,0.25) 50%, transparent 75%)"
              : isConnecting
              ? "radial-gradient(circle, rgba(45,212,191,0.55) 0%, rgba(13,148,136,0.25) 50%, transparent 75%)"
              : "radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)",
          }}
          transition={{ duration: 0.12 }}
        />

        {/* Connecting Orbital Particle Ring */}
        {isConnecting && (
          <motion.div
            className="absolute w-36 h-36 rounded-full border border-dashed border-teal-400/40 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf] absolute -top-1 left-1/2 -translate-x-1/2" />
          </motion.div>
        )}

        {/* Central Luminous Fluid Orb (Always a seamless circle, never a square) */}
        <motion.div
          className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center cursor-default shadow-2xl backdrop-blur-md overflow-hidden"
          animate={{
            scale: isConnecting ? [0.96, 1.04, 0.96] : dynamicScale,
          }}
          transition={
            isConnecting
              ? { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
              : { duration: 0.08, ease: "easeOut" }
          }
          style={{
            borderRadius: "9999px",
            background: isSpeaking
              ? "radial-gradient(circle at 35% 35%, #5eead4 0%, #14b8a6 45%, #0f766e 80%, #042f2e 100%)"
              : isUserSpeaking
              ? "radial-gradient(circle at 35% 35%, #6ee7b7 0%, #10b981 45%, #047857 80%, #022c22 100%)"
              : isConnecting
              ? "radial-gradient(circle at 35% 35%, #5eead4 0%, #0d9488 45%, #042f2e 85%, #021a1b 100%)"
              : "radial-gradient(circle at 35% 35%, #2dd4bf 0%, #0d9488 45%, #042f2e 85%, #021a1b 100%)",
            boxShadow: isSpeaking
              ? "0 0 35px rgba(45, 212, 191, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.45)"
              : isUserSpeaking
              ? "0 0 30px rgba(52, 211, 153, 0.55), inset 0 0 12px rgba(255, 255, 255, 0.4)"
              : isConnecting
              ? "0 0 28px rgba(45, 212, 191, 0.5), inset 0 0 12px rgba(255, 255, 255, 0.35)"
              : "0 0 20px rgba(20, 184, 166, 0.3), inset 0 0 8px rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Internal Shimmer Core */}
          <motion.div
            className="w-10 h-10 rounded-full bg-white/35 blur-sm pointer-events-none"
            animate={{
              scale: isSpeaking || isUserSpeaking ? [0.85, 1.25, 0.85] : isConnecting ? [0.8, 1.15, 0.8] : [0.95, 1.05, 0.95],
              opacity: isSpeaking ? [0.6, 0.95, 0.6] : isConnecting ? [0.4, 0.75, 0.4] : [0.3, 0.5, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: isSpeaking ? 1.2 : isConnecting ? 2.0 : 2.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Dynamic Status Capsule Pill */}
      <AnimatePresence mode="wait">
        <motion.div
          key={status + (isUserSpeaking ? "-user" : "")}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mt-1 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-[#071F23] border border-slate-200 dark:border-teal-900/50 shadow-xs"
        >
          {/* Status Dot Indicator */}
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSpeaking
                  ? "bg-teal-400"
                  : isUserSpeaking
                  ? "bg-emerald-400"
                  : isConnecting
                  ? "bg-amber-400"
                  : "bg-teal-500"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isSpeaking
                  ? "bg-teal-500"
                  : isUserSpeaking
                  ? "bg-emerald-500"
                  : isConnecting
                  ? "bg-amber-500"
                  : "bg-teal-500"
              }`}
            />
          </span>

          <span className="text-xs font-mono font-semibold tracking-tight text-foreground">
            {isConnecting && "Connecting Voice Link..."}
            {isSpeaking && "Otto is speaking..."}
            {isListening && isUserSpeaking && "Hearing your voice..."}
            {isListening && !isUserSpeaking && "Listening · Speak freely"}
            {status === "idle" && "Ready to Talk"}
            {status === "ended" && "Voice Session Ended"}
            {status === "error" && "Connection Error"}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
