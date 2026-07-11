"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Real, checkable numbers only
const STATS = [
  { value: 3, suffix: "+", label: "Years in tech" },
  { value: 50, suffix: "+", label: "Projects shipped" },
  { value: 1, suffix: "", label: "SaaS founded — Octively, live" },
  { value: 2, suffix: "", label: "Concurrent senior roles" },
];

export default function StatsBand() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !containerRef.current) return;

      const nums = containerRef.current.querySelectorAll<HTMLElement>("[data-count]");

      const play = () => {
        nums.forEach((el) => {
          const target = Number(el.dataset.count || 0);
          const state = { n: 0 };
          gsap.to(state, {
            n: target,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${Math.round(state.n)}${el.dataset.suffix || ""}`;
            },
          });
        });
      };
      const reset = () => {
        nums.forEach((el) => {
          el.textContent = `0${el.dataset.suffix || ""}`;
        });
      };

      // Replays every time the band scrolls back into view
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",
        onEnter: play,
        onLeaveBack: reset,
      });
    },
    { scope: containerRef, dependencies: [reduced] }
  );

  return (
    <div ref={containerRef} className="border-y border-border bg-card/40">
      <div className="max-w-7xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(({ value, suffix, label }) => (
          <div key={label} className="text-center">
            <span
              data-count={value}
              data-suffix={suffix}
              className="block font-heading font-semibold text-3xl md:text-4xl text-accent"
            >
              {value}
              {suffix}
            </span>
            <span className="block mt-1 text-xs md:text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
