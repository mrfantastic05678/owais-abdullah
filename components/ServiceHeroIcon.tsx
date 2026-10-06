"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LucideIcon, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface ServiceHeroIconProps {
  icon: LucideIcon;
  gradient?: string;
}

const ServiceHeroIcon: React.FC<ServiceHeroIconProps> = ({ icon: Icon }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Gentle 3D perspective tilt driven by scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -8]);

  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[420px]" ref={ref}>
      {/* Ambient background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 via-emerald-500/15 to-teal-600/20 rounded-[2.5rem] blur-2xl opacity-60 pointer-events-none" />

      {/* Main Architectural Spec Card */}
      <motion.div
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative rounded-3xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] p-6 sm:p-7 shadow-2xl overflow-hidden"
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-dot-lattice opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top HUD Header */}
        <div className="relative z-10 flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#10343A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs shadow-emerald-500" />
            <span className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-400 tracking-wider uppercase">
              ENGINE // ACTIVE
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
            SPEC-FIRST
          </span>
        </div>

        {/* Center Illuminated Holographic Stage */}
        <div className="relative z-10 my-8 flex items-center justify-center">
          {/* Orbital pulse rings */}
          <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full border border-teal-500/20 animate-ping opacity-20 pointer-events-none" />
          <div className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-teal-500/30 pointer-events-none" />

          {/* Central Holographic Icon Badge */}
          <motion.div
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-emerald-500/20 border border-teal-500/40 flex items-center justify-center shadow-xl shadow-teal-500/20"
            animate={{
              y: [-3, 3, -3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-12 h-12 sm:w-14 sm:h-14 text-teal-600 dark:text-teal-400 drop-shadow-md" />
          </motion.div>

          {/* Floating Telemetry Pill 1 (Top Left) */}
          <motion.div
            className="absolute -top-3 left-0 sm:left-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#05181b]/95 border border-slate-200 dark:border-teal-900/60 shadow-md text-[11px] font-mono text-slate-700 dark:text-teal-200 backdrop-blur-md"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Type-Safe API</span>
          </motion.div>

          {/* Floating Telemetry Pill 2 (Bottom Right) */}
          <motion.div
            className="absolute -bottom-3 right-0 sm:right-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#05181b]/95 border border-slate-200 dark:border-teal-900/60 shadow-md text-[11px] font-mono text-slate-700 dark:text-teal-200 backdrop-blur-md"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Zap className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>Sub-50ms Edge</span>
          </motion.div>
        </div>

        {/* Bottom Micro-Metrics Strip */}
        <div className="relative z-10 pt-5 border-t border-slate-100 dark:border-[#10343A] grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-[#05181b]/80 border border-slate-200/60 dark:border-[#10343A]">
            <span className="block text-[9px] font-mono text-muted-foreground uppercase">UPTIME</span>
            <span className="text-xs font-mono font-bold text-foreground">99.9%</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-[#05181b]/80 border border-slate-200/60 dark:border-[#10343A]">
            <span className="block text-[9px] font-mono text-muted-foreground uppercase">SECURITY</span>
            <span className="text-xs font-mono font-bold text-foreground">SOC2 Ready</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-[#05181b]/80 border border-slate-200/60 dark:border-[#10343A]">
            <span className="block text-[9px] font-mono text-muted-foreground uppercase">DELIVERY</span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Spec First</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceHeroIcon;
