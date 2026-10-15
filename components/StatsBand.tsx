"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { value: 3, suffix: "+ Years", label: "Production Engineering" },
  { value: 50, suffix: "+", label: "Projects Shipped Worldwide" },
  { value: 1, suffix: " Live SaaS", label: "Founded & Deployed (Octively)" },
  { value: 100, suffix: "% Spec", label: "Zero AI Vibe Coding" },
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
    <div 
      ref={containerRef} 
      className="my-12 max-w-6xl mx-auto px-5 sm:px-6"
    >
      <div className="clean-glass-card p-5 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center md:text-left">
        {STATS.map(({ value, suffix, label }, idx) => (
          <div 
            key={label} 
            className={`space-y-1 ${idx >= 2 ? "hidden md:block" : ""}`}
          >
            <span
              data-count={value}
              data-suffix={suffix}
              className={`block font-extrabold text-3xl sm:text-4xl tracking-tight tabular-nums ${
                idx === 1 
                  ? "text-teal-700 dark:text-teal-400"
                  : idx === 3
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-foreground"
              }`}
            >
              {value}
              {suffix}
            </span>
            <span className="block text-xs font-semibold text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
