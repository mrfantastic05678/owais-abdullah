"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Bot, Network, CheckCircle } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import CharRevealHeading from "@/components/CharRevealHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FTEStoryProps = {
  /** Scroll distance (px) the section stays pinned for */
  pinLength?: number;
};

const ACTS = [
  {
    title: "Act I — Inbox fills",
    body: "Client webhooks trigger. Emails, form submissions, and Slack messages queue up overnight.",
    Icon: Bot,
    iconClass: "text-accent bg-muted/50 border-border",
    iconCount: 3,
  },
  {
    title: "Act II — Agent fans out",
    body: "The agent parses each trigger, maps it against your SOPs, and executes the right workflow chain.",
    Icon: Network,
    iconClass: "text-accent bg-accent/10 border-accent",
    iconCount: 1,
  },
  {
    title: "Act III — Reports stack",
    body: "Completed tasks are logged. Sheets update. A morning summary lands in your inbox before you sit down.",
    Icon: CheckCircle,
    iconClass: "text-signal-500 bg-signal-500/10 border-border",
    iconCount: 3,
  },
];

export default function FTEStory({ pinLength = 2000 }: FTEStoryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      if (!containerRef.current || !canvasRef.current || !progressRef.current) return;

      // Pinned 3-act sequence — each act has a distinct hand-off:
      //    Act I drifts up and out, Act II zooms through, Act III settles.
      const acts = canvasRef.current.querySelectorAll(".fte-act");
      const dots = progressRef.current.querySelectorAll(".fte-dot");

      const dotOn = { width: 28, backgroundColor: "var(--signal-500)", borderRadius: 4 };
      const dotOff = { width: 8, backgroundColor: "var(--border)", borderRadius: "50%" };

      gsap.set(acts, { opacity: 0, scale: 0.95 });
      gsap.set(acts[0], { opacity: 1, scale: 1, y: 0 });
      gsap.set(dots[0], dotOn);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${pinLength}`,
          scrub: true,
          pin: true,
        },
      });

      // Act I → II: inbox drifts up, network zooms in from behind
      tl.to(acts[0], { opacity: 0, y: -40, scale: 0.95, duration: 1 })
        .to(dots[0], { ...dotOff, duration: 0.5 }, "<")
        .fromTo(acts[1], { opacity: 0, scale: 0.8, y: 0 }, { opacity: 1, scale: 1, duration: 1 }, "<0.5")
        .to(dots[1], { ...dotOn, duration: 0.5 }, "<")
        // Act II → III: network zooms past camera, reports settle down into place
        .to(acts[1], { opacity: 0, scale: 1.15, duration: 1 })
        .to(dots[1], { ...dotOff, duration: 0.5 }, "<")
        .fromTo(acts[2], { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, "<0.5")
        .to(dots[2], { ...dotOn, duration: 0.5 }, "<");
    },
    { scope: containerRef, dependencies: [reduced, pinLength] }
  );

  return (
    <section
      id="story"
      ref={containerRef}
      data-cursor="scroll"
      data-cursor-label="SCROLL"
      className="py-24 bg-gradient-to-b from-background to-card relative overflow-hidden border-b border-border"
    >
      <div className="max-w-4xl mx-auto px-5 text-center">
        <span className="text-accent font-mono text-xs tracking-widest uppercase mb-2 block">
          In action
        </span>
        <CharRevealHeading
          as="h2"
          className="text-4xl md:text-5xl font-semibold mb-4 text-foreground relative inline-block"
          highlightWords={["Digital", "FTE"]}
          start="top 75%"
        >
          Watch a Digital FTE take a job
        </CharRevealHeading>
        <p className="text-muted-foreground max-w-lg mx-auto mb-12">
          Three acts of an autonomous agent: triggers arrive, work fans out, reports stack up.
        </p>

        {reduced ? (
          /* Reduced motion / SSR: all three acts stacked and readable, no pin */
          <div className="flex flex-col gap-6 mx-auto w-full max-w-3xl">
            {ACTS.map(({ title, body, Icon, iconClass, iconCount }) => (
              <div key={title} className="border border-border rounded-xl bg-card p-8 flex flex-col items-center gap-4">
                <h3 className="text-2xl font-medium text-foreground">{title}</h3>
                <div className="flex gap-4">
                  {Array.from({ length: iconCount }).map((_, i) => (
                    <div key={i} className={`w-12 h-12 rounded-lg border flex items-center justify-center ${iconClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm max-w-sm text-center">{body}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative mx-auto w-full max-w-3xl">
            <div ref={canvasRef} className="w-full aspect-video border border-border rounded-xl overflow-hidden relative bg-card shadow-2xl">
              {ACTS.map(({ title, body, Icon, iconClass, iconCount }, actIdx) => (
                <div
                  key={title}
                  className={`fte-act absolute inset-0 flex flex-col items-center justify-center gap-4 ${actIdx > 0 ? "opacity-0 pointer-events-none" : ""}`}
                >
                  <h3 className="text-2xl font-medium text-foreground">{title}</h3>
                  <div className="flex gap-4 mb-2">
                    {Array.from({ length: iconCount }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded-lg border flex items-center justify-center ${iconClass} ${actIdx === 0 ? "animate-pulse" : ""}`}
                        style={actIdx === 0 ? { animationDelay: `${(i + 1) * 0.2}s` } : undefined}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm max-w-sm text-center">{body}</p>
                </div>
              ))}
            </div>

            <div ref={progressRef} className="flex gap-3 justify-center mt-6" aria-hidden="true">
              {ACTS.map(({ title }) => (
                <div key={title} className="fte-dot w-2 h-2 rounded-full bg-border"></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
