"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#";

interface CharShuffleTextProps {
  text: string;
  className?: string;
}

/**
 * Scrambles the label through random glyphs on hover before resolving back
 * to the real text — a callback to ScatterText's char-reveal, repurposed
 * as a pointer interaction for "decoding more content" (pagination, load
 * more). Reduced motion: no-op, text never changes.
 */
export default function CharShuffleText({ text, className = "" }: CharShuffleTextProps) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const reduced = usePrefersReducedMotion();

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const play = () => {
    if (reduced) return;
    clearInterval(intervalRef.current);
    frameRef.current = 0;
    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((ch, i) =>
            ch === " " ? " " : i < frameRef.current ? text[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
      );
      frameRef.current += 1;
      if (frameRef.current > text.length) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 35);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setDisplay(text);
  };

  return (
    <span className={`inline-block whitespace-nowrap ${className}`} onMouseEnter={play} onMouseLeave={reset}>
      {display}
    </span>
  );
}
