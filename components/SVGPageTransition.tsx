"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";

const SVG_PATH_D =
  "M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213";

interface SVGPageTransitionProps {
  children: ReactNode;
  strokeColor?: string;
  overlayClassName?: string;
  leaveDuration?: number;
  enterDuration?: number;
  maxStrokeWidth?: number;
}

export default function SVGPageTransition({
  children,
  strokeColor,
  overlayClassName = "",
  leaveDuration = 0.4,
  enterDuration = 0.4,
  maxStrokeWidth = 500,
}: SVGPageTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [resolvedColor, setResolvedColor] = useState(strokeColor ?? "#3D7BFF");
  const reducedRef = useRef(false);
  const leaveTlRef = useRef<gsap.core.Timeline | null>(null);
  const enterTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Default stroke comes from the brand token, not a hardcoded hex
    if (!strokeColor) {
      const token = getComputedStyle(document.documentElement)
        .getPropertyValue("--brand-500")
        .trim();
      if (token) setResolvedColor(token);
    }
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      gsap.set(pathRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
        strokeWidth: 2,
      });
    }
  }, [strokeColor]);

  useEffect(() => {
    return () => {
      leaveTlRef.current?.kill();
      enterTlRef.current?.kill();
    };
  }, []);

  return (
    <>
      <TransitionRouter
        auto
        leave={(next) => {
          if (reducedRef.current) {
            next();
            return;
          }
          leaveTlRef.current?.kill();
          // next() must fire only once the cover fully draws — calling it
          // earlier swaps the page while the stroke is still thin, so the
          // new page appears through a half-finished overlay. The actual
          // SPA navigation this triggers is fast (Header/Footer live inside
          // this provider, so auto mode intercepts the click instead of
          // falling back to a full browser reload) — the visible wait is
          // just this draw, not the navigation itself.
          const tl = gsap.timeline({ onComplete: next });
          leaveTlRef.current = tl;

          tl.to(overlayRef.current, {
            opacity: 1,
            duration: 0.12,
            ease: "power2.inOut",
          }).to(
            pathRef.current,
            {
              strokeDashoffset: 0,
              strokeWidth: maxStrokeWidth,
              duration: leaveDuration,
              ease: "power2.inOut",
            },
            0
          );
        }}
        enter={(next) => {
          if (reducedRef.current) {
            next();
            return;
          }
          // Take over from the leave draw — enter's tweens continue the
          // sweep from wherever the leave animation currently is
          leaveTlRef.current?.kill();
          enterTlRef.current?.kill();
          const tl = gsap.timeline({
            onComplete: () => {
              next();
            },
          });
          enterTlRef.current = tl;

          tl.to(pathRef.current, {
            strokeDashoffset: -pathLength,
            strokeWidth: 2,
            duration: enterDuration,
            ease: "power2.inOut",
          })
            .to(
              overlayRef.current,
              {
                opacity: 0,
                duration: 0.2,
                ease: "power2.inOut",
              },
              0.1
            )
            .set(pathRef.current, {
              strokeDashoffset: pathLength,
              strokeWidth: 2,
            });
        }}
      >
        {children}
      </TransitionRouter>
      <div
        ref={overlayRef}
        className={`fixed inset-0 pointer-events-none flex items-center justify-center opacity-0 ${overlayClassName}`}
        style={{ zIndex: 9999 }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1316 664"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ transform: "scale(1.3)", transformOrigin: "center" }}
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            ref={pathRef}
            d={SVG_PATH_D}
            stroke={resolvedColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
