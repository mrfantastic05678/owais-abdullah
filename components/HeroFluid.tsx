"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const FluidCursor = dynamic(() => import("@/components/FluidCursor"), {
  ssr: false,
});

/**
 * Mounts the WebGL fluid-distortion layer inside the hero only, and only
 * when it can help: fine pointer, motion allowed, and after first idle so
 * it never competes with LCP. Unmounted entirely otherwise.
 */
export default function HeroFluid() {
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    // Strictly desktop (>= 1024px, fine pointer, motion-allowed)
    if (
      typeof window === "undefined" ||
      window.innerWidth < 1024 ||
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle: number = hasIdle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2500 })
      : (window.setTimeout(() => setReady(true), 1500) as unknown as number);

    // Watch hero section visibility — unmount when scrolled out of view to free GPU
    const heroEl = document.getElementById("hero");
    let observer: IntersectionObserver | null = null;
    if (heroEl && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(heroEl);
    }

    return () => {
      if (hasIdle) {
        window.cancelIdleCallback(idle);
      } else {
        clearTimeout(idle);
      }
      observer?.disconnect();
    };
  }, []);

  if (!ready) return null;
  return <FluidCursor inView={inView} className="pointer-events-none" />;
}
