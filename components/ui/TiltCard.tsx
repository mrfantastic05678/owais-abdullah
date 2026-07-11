"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees at the card's edge */
  maxTilt?: number;
  /** How strongly the backdrop layers (siblings with [data-tilt-layer]) drift opposite the tilt */
  layerDrift?: number;
}

/**
 * Pointer-driven 3D tilt: the card rotates toward the cursor within its own
 * bounds (rotateX/rotateY + perspective), with a moving specular highlight
 * that sells the glass/depth feel, and sibling [data-tilt-layer] elements
 * (the stacked backdrop cards) drift for parallax. Desktop fine-pointer and
 * motion-allowed only — resets to flat/static everywhere else.
 */
export default function TiltCard({ children, className = "", maxTilt = 10, layerDrift = 14 }: TiltCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!wrap || !card) return;

    const layers = wrap.querySelectorAll<HTMLElement>("[data-tilt-layer]");

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glow) {
        glow.style.opacity = "1";
        glow.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, color-mix(in srgb, var(--brand-400) 35%, transparent), transparent 55%)`;
      }

      layers.forEach((layer, i) => {
        const depth = (i + 1) * layerDrift;
        layer.style.transform = `translate(${(px - 0.5) * -depth}px, ${(py - 0.5) * -depth}px)`;
      });
    };

    const onLeave = () => {
      card.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1)";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      if (glow) glow.style.opacity = "0";
      layers.forEach((layer) => {
        layer.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1)";
        layer.style.transform = "translate(0, 0)";
      });
    };

    const onEnter = () => {
      card.style.transition = "";
      layers.forEach((layer) => (layer.style.transition = ""));
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerenter", onEnter);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerenter", onEnter);
    };
  }, [reduced, maxTilt, layerDrift]);

  return (
    <div ref={wrapRef} className={className} style={{ transformStyle: "preserve-3d" }}>
      <div ref={cardRef} className="relative will-change-transform" style={{ transformStyle: "preserve-3d" }}>
        {children}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 rounded-[inherit]"
        />
      </div>
    </div>
  );
}
