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

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle: number = hasIdle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
      : (window.setTimeout(() => setReady(true), 1200) as unknown as number);
    return () => {
      if (hasIdle) {
        window.cancelIdleCallback(idle);
      } else {
        clearTimeout(idle);
      }
    };
  }, []);

  if (!ready) return null;
  return <FluidCursor className="pointer-events-none" />;
}
