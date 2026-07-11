"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface MagneticButtonProps {
  children: React.ReactNode;
  /** How strongly the button follows the cursor (0–1) */
  strength?: number;
  className?: string;
}

/**
 * Wraps a button/link so it drifts toward the cursor within its own
 * bounding box, then eases back to rest on leave. Desktop fine-pointer
 * and motion-allowed only — inert everywhere else, so touch/keyboard
 * users get the plain element with no wrapper overhead.
 */
export default function MagneticButton({ children, strength = 0.35, className = "" }: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const onMove = (e: PointerEvent) => {
      const r = inner.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      inner.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onLeave = () => {
      inner.style.transition = "transform .4s cubic-bezier(.2,.8,.2,1)";
      inner.style.transform = "translate(0, 0)";
    };
    const onEnter = () => {
      inner.style.transition = "";
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerenter", onEnter);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerenter", onEnter);
    };
  }, [reduced, strength]);

  return (
    <div ref={wrapRef} className={`inline-block ${className}`}>
      <div ref={innerRef} className="inline-block will-change-transform">
        {children}
      </div>
    </div>
  );
}
