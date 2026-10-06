"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";

const TOTAL_FRAMES = 100;
const FRAMES_BASE_URL = "/frames/fte-story/frame_";

interface StageInfo {
  id: number;
  stage: string;
  badge: string;
  title: string;
  desc: string;
}

const STAGES: StageInfo[] = [
  {
    id: 0,
    stage: "STAGE 01",
    badge: "01 / INGESTION",
    title: "Inbox Fills",
    desc: "Client webhooks trigger. Form submissions, Slack events, and API payloads stream in overnight without human gating.",
  },
  {
    id: 1,
    stage: "STAGE 02",
    badge: "02 / EXECUTION",
    title: "Agent Fans Out",
    desc: "Neural node parses each payload, checks SOPs, queries Postgres memory, and dispatches parallel worker chains autonomously.",
  },
  {
    id: 2,
    stage: "STAGE 03",
    badge: "03 / DISPATCH",
    title: "Reports Stack",
    desc: "Completed actions are recorded in ledger. External databases sync. Morning summary lands before your shift starts.",
  },
];

export default function FTEStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const currentFrameRef = useRef(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Active stage based on frame
  const activeStage =
    currentFrame <= 35 ? 0 : currentFrame <= 70 ? 1 : 2;

  // Render a specific frame onto canvas
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bmp = framesRef.current[frameIdx];
    if (!bmp) return;

    const dpr = window.devicePixelRatio || 1;
    const targetWidth = Math.round(canvas.clientWidth * dpr);
    const targetHeight = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const canvasRatio = canvas.width / canvas.height;
    const bmpRatio = bmp.width / bmp.height;
    let dw: number, dh: number, dx: number, dy: number;

    if (bmpRatio > canvasRatio) {
      dh = canvas.height;
      dw = dh * bmpRatio;
      dx = (canvas.width - dw) / 2;
      dy = 0;
    } else {
      dw = canvas.width;
      dh = dw / bmpRatio;
      dx = 0;
      dy = (canvas.height - dh) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, dx, dy, dw, dh);
  }, []);

  // Preload all frames on mount
  useEffect(() => {
    let canceled = false;

    async function loadAllFrames() {
      const batchSize = 10;
      for (let i = 1; i <= TOTAL_FRAMES; i += batchSize) {
        if (canceled) break;
        const batch = [];
        for (let j = i; j < i + batchSize && j <= TOTAL_FRAMES; j++) {
          const frameNum = String(j).padStart(4, "0");
          const url = `${FRAMES_BASE_URL}${frameNum}.webp`;
          batch.push(
            fetch(url)
              .then((res) => res.blob())
              .then((blob) => createImageBitmap(blob))
              .then((bmp) => {
                if (!canceled) {
                  framesRef.current[j - 1] = bmp;
                  if (j === 1) {
                    setIsLoading(false);
                    renderFrame(0);
                  }
                }
              })
              .catch(() => {})
          );
        }
        await Promise.all(batch);
      }
    }

    loadAllFrames();

    return () => {
      canceled = true;
    };
  }, [renderFrame]);

  // Scroll listener that scrubs video frame
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!wrapperRef.current) {
            ticking = false;
            return;
          }
          const rect = wrapperRef.current.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight;
          if (totalScrollable > 0) {
            const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
            const frameIndex = Math.min(
              TOTAL_FRAMES - 1,
              Math.floor(progress * TOTAL_FRAMES)
            );
            if (frameIndex !== currentFrameRef.current) {
              currentFrameRef.current = frameIndex;
              setCurrentFrame(frameIndex);
              renderFrame(frameIndex);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [renderFrame]);

  return (
    <section id="story" className="relative w-full pt-4 sm:pt-20 md:pt-24 scroll-mt-20">
      {/* Scroll path container (240vh height drives playback as user scrolls) */}
      <div ref={wrapperRef} className="relative w-full" style={{ height: "240vh" }}>
        
        {/* Sticky stage viewport with balanced top clearance on mobile */}
        <div className="sticky top-16 sm:top-24 h-[calc(100dvh-4.5rem)] sm:h-[calc(100vh-6rem)] flex flex-col justify-center items-center overflow-hidden px-2.5 sm:px-6 pt-1 sm:pt-6">
          
          {/* Header copy */}
          <div className="text-center mb-2.5 sm:mb-7 max-w-2xl mx-auto z-20 px-2">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider font-bold text-teal-700 dark:text-teal-400 block mb-1">
              AUTONOMOUS LIFECYCLE
            </span>
            <h2 className="text-xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Watch a <span className="text-teal-700 dark:text-teal-400">Digital FTE</span> execute
            </h2>
            <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              100-frame deterministic loop · Scroll down to scrub workflow in real time
            </p>
          </div>

          {/* 16:9 Aspect Video Stage Viewport */}
          <div className="relative w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-slate-950 shadow-2xl mx-auto">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover block"
            />

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 text-white">
                <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-teal-400">
                  Loading Workflow Frames...
                </span>
              </div>
            )}

            {/* Top-Left Engine Status Badge */}
            <div className="absolute top-3.5 left-4 z-20 flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono font-medium text-slate-200 tracking-wider">
                OWAIS.OS / WORKFLOW ENGINE
              </span>
            </div>

            {/* Desktop-only In-frame Stage Card */}
            <div className="hidden sm:block absolute bottom-4 right-4 sm:max-w-[340px] z-30 pointer-events-none">
              {STAGES.map((s) => {
                const isActive = activeStage === s.id;
                if (!isActive) return null;

                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl text-left transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono tracking-wider font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded border border-teal-500/40">
                          {s.stage}
                        </span>
                        <h4 className="text-white text-sm font-bold tracking-tight">
                          {s.title}
                        </h4>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Mobile-only Stage Card Outside Video Canvas */}
          <div className="sm:hidden w-full max-w-4xl mx-auto mt-2 px-0.5 z-20">
            {STAGES.map((s) => {
              const isActive = activeStage === s.id;
              if (!isActive) return null;

              return (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-black/85 dark:bg-[#061B1E]/95 backdrop-blur-md border border-white/15 dark:border-teal-900/50 shadow-md text-left transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-wider font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded border border-teal-500/40">
                        {s.stage}
                      </span>
                      <h4 className="text-white text-xs font-bold tracking-tight">
                        {s.title}
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Scroll Telemetry & Progress Indicators */}
          <div className="flex items-center justify-between w-full max-w-4xl mx-auto mt-2 sm:mt-3 px-2 z-20">
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <span>Scroll to scrub</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
            </span>

            {/* Stage Progress Pills */}
            <div className="flex gap-2 items-center">
              {STAGES.map((s) => (
                <div
                  key={s.id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeStage === s.id
                      ? "w-8 bg-teal-600 dark:bg-teal-400"
                      : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
