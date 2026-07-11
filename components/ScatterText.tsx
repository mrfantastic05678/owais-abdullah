"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScatterTextProps = {
  children?: string;
  /** Max random offset (px) chars scatter on x/y */
  scatterXY?: number;
  /** Max random depth (px) chars scatter on z */
  scatterZ?: number;
  /** Max random rotation (deg) */
  scatterRotation?: number;
};

const ScatterText = ({
  children = "Most agencies sell hours. I ship systems that keep working after everyone logs off.",
  scatterXY = 800,
  scatterZ = 900,
  scatterRotation = 180,
}: ScatterTextProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !wrapperRef.current) return;

      const chars = wrapperRef.current.querySelectorAll<HTMLElement>(".scatter-char");
      if (!chars.length) return;

      chars.forEach((c) => {
        gsap.set(c, {
          x: (Math.random() - 0.5) * scatterXY,
          y: (Math.random() - 0.5) * scatterXY,
          z: (Math.random() - 0.5) * scatterZ,
          rotation: (Math.random() - 0.5) * scatterRotation,
          opacity: 0,
          scale: 0,
        });
      });

      gsap.to(chars, {
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 80%",
          end: "center center",
          scrub: 1.5,
        },
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.02,
        ease: "power2.out",
      });
    },
    { scope: wrapperRef, dependencies: [reduced, scatterXY, scatterZ, scatterRotation] }
  );

  // Words are wrapped in non-breaking spans at render time, so lines can
  // only break between words — never mid-word — in every mode.
  const words = children.split(/\s+/);

  return (
    <div
      ref={wrapperRef}
      data-cursor="scroll"
      data-cursor-label="SCROLL"
      className="min-h-[70vh] flex items-center justify-center px-6 overflow-hidden relative"
    >
      <p className="text-[clamp(1.5rem,4vw,3.5rem)] font-semibold leading-[1.2] text-center max-w-[24ch] text-foreground relative z-10">
        {words.map((word, wi) => (
          <React.Fragment key={wi}>
            <span className="inline-block whitespace-nowrap">
              {[...word].map((ch, ci) => (
                <span key={ci} className="scatter-char inline-block will-change-transform">
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

export default ScatterText;
