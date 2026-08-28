"use client";

import React, { useEffect, useRef, useState, type CSSProperties } from "react";
import { Bot, Network, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface ScrollStoryAct {
  act: string;
  badge: string;
  title: string;
  body: string;
  start: number; // scroll progress %, 0-100
  end: number;
  Icon: React.ElementType;
  accentColor: string;
}

const TOTAL_FRAMES = 100;
const FRAMES_BASE_URL = "/frames/fte-story/frame_";
const FRAME_PAD = 4;
const FRAME_EXT = "webp";

const ACTS: ScrollStoryAct[] = [
  {
    act: "ACT I",
    badge: "01 / INGESTION",
    title: "Inbox Fills",
    body: "Client webhooks trigger. Form submissions, Slack events, and API payloads stream in overnight.",
    start: 0,
    end: 32,
    Icon: Bot,
    accentColor: "from-blue-500/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400",
  },
  {
    act: "ACT II",
    badge: "02 / EXECUTION",
    title: "Agent Fans Out",
    body: "Neural node parses each payload, checks SOPs, and dispatches parallel worker chains autonomously.",
    start: 34,
    end: 66,
    Icon: Network,
    accentColor: "from-indigo-500/20 to-blue-500/10 border-blue-500/30 text-blue-400",
  },
  {
    act: "ACT III",
    badge: "03 / DISPATCH",
    title: "Reports Stack",
    body: "Completed actions are logged. External databases sync. Morning summary lands before your shift starts.",
    start: 68,
    end: 100,
    Icon: CheckCircle2,
    accentColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function drawBitmap(canvas: HTMLCanvasElement, bmp: ImageBitmap) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
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
}

export default function FTEStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const currentFrameRef = useRef(-1);
  const tickingRef = useRef(false);
  const [progressPct, setProgressPct] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let started = false;

    function loadFrame(n: number): Promise<ImageBitmap | null> {
      const padded = String(n).padStart(FRAME_PAD, "0");
      const url = `${FRAMES_BASE_URL}${padded}.${FRAME_EXT}`;
      return fetch(url)
        .then((r) => r.blob())
        .then((blob) => createImageBitmap(blob))
        .catch(() => null);
    }

    function renderFrame(progress: number) {
      const index = clamp(Math.round(progress * (TOTAL_FRAMES - 1)), 0, TOTAL_FRAMES - 1);
      if (index === currentFrameRef.current) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Find nearest loaded frame if current requested frame is not ready
      let bmp = framesRef.current[index];
      if (!bmp) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          if (index - offset >= 0 && framesRef.current[index - offset]) {
            bmp = framesRef.current[index - offset];
            break;
          }
          if (index + offset < TOTAL_FRAMES && framesRef.current[index + offset]) {
            bmp = framesRef.current[index + offset];
            break;
          }
        }
      }

      if (bmp) {
        currentFrameRef.current = index;
        drawBitmap(canvas, bmp);
      }
    }

    function raf() {
      tickingRef.current = false;
      const wrapperEl = wrapperRef.current;
      if (!wrapperEl) return;
      const rect = wrapperEl.getBoundingClientRect();
      const scrollableDistance = wrapperEl.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, Math.max(scrollableDistance, 0));
      const progress = scrollableDistance > 0 ? scrolled / scrollableDistance : 0;

      renderFrame(progress);
      setProgressPct(progress * 100);
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(raf);
    }

    async function preloadFrames() {
      // Eagerly load frame 1 (LCP)
      const first = await loadFrame(1);
      if (first) {
        framesRef.current[0] = first;
        if (canvasRef.current) {
          drawBitmap(canvasRef.current, first);
        }
      }

      // Preload remaining frames
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        loadFrame(i).then((bmp) => {
          if (bmp) framesRef.current[i - 1] = bmp;
        });
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            preloadFrames();
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
          }
        });
      },
      { rootMargin: "250px 0px" }
    );
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return (
    <section id="story" className="relative border-b border-border bg-background">
      {reduced ? (
        /* Reduced motion static fallback */
        <div className="py-20 max-w-4xl mx-auto px-5 text-center">
          <span className="text-accent font-mono text-xs tracking-widest uppercase mb-2 block">
            In action
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold mb-4 text-foreground">
            Watch a <span className="bg-gradient-to-r from-accent via-accent to-signal-500 bg-clip-text text-transparent">Digital FTE</span> take a job
          </h2>
            {ACTS.map(({ act, title, body, Icon, accentColor }) => {
              const IconComp = Icon as React.ComponentType<{ className?: string }>;
              return (
                <div
                  key={title}
                  className="border border-border/80 rounded-2xl bg-card/90 backdrop-blur-md p-5 flex items-start gap-4 text-left shadow-lg"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 bg-gradient-to-br ${accentColor}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-accent uppercase font-bold">{act}</span>
                    <span className="text-foreground font-semibold text-base">{title}</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{body}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ScrollStory 3D Frame Sequence Container (260vh scroll path) */
        <div ref={wrapperRef} className="relative" style={{ height: "260vh" }}>
          <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6">
            {/* Header copy above the stage */}
            <div className="text-center mb-4 sm:mb-6 max-w-3xl mx-auto z-20">
              <span className="text-accent font-mono text-xs tracking-widest uppercase mb-2 inline-flex items-center gap-1.5 bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                <Sparkles className="w-3.5 h-3.5" />
                Interactive Demo
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-1 text-foreground tracking-tight">
                Watch a <span className="bg-gradient-to-r from-accent via-accent to-signal-500 bg-clip-text text-transparent">Digital FTE</span> take a job
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                Scroll smoothly to watch the autonomous workflow execute in real time across the 3 acts.
              </p>
            </div>

            {/* Stage: Canvas Frame Player */}
            <div className="relative w-full max-w-3xl aspect-[16/9] sm:h-[380px] border border-border/90 rounded-2xl overflow-hidden bg-black shadow-2xl">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover block"
              />

              {/* Status Header Badge (Top-Left, outside center art) */}
              <div className="absolute top-3.5 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-signal-500 animate-pulse shadow-[0_0_8px_var(--signal-500)]" />
                <span className="text-[11px] font-mono font-medium text-slate-200 tracking-wider">
                  OWAIS.OS / 3D SCROLL STORY
                </span>
              </div>

              {/* Non-intrusive Act HUD Cards (Bottom-Right) */}
              <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:max-w-[340px] z-30 pointer-events-none">
                {ACTS.map((act) => {
                  const visible = progressPct >= act.start && progressPct <= act.end;
                  return (
                    <div
                      key={act.act}
                      className={`p-3.5 sm:p-4 rounded-xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl text-left transition-all duration-500 ${
                        visible
                          ? "opacity-100 translate-y-0 relative"
                          : "opacity-0 translate-y-3 absolute inset-0 pointer-events-none"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono tracking-wider font-semibold text-accent bg-accent/15 px-2 py-0.5 rounded border border-accent/30">
                            {act.act}
                          </span>
                          <h4 className="text-white text-xs sm:text-sm font-bold tracking-tight">
                            {act.title}
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">
                          {act.badge}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                        {act.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="flex items-center justify-between w-full max-w-sm mx-auto mt-3 px-2 z-20">
              <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                Scroll to scrub
                <ArrowRight className="w-3 h-3 text-accent animate-pulse" />
              </span>

              <div className="flex gap-2 items-center" aria-hidden="true">
                {ACTS.map((act) => {
                  const active = progressPct >= act.start && progressPct <= act.end;
                  return (
                    <div
                      key={act.act}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        active
                          ? "w-7 bg-signal-500"
                          : "w-2 bg-border"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
