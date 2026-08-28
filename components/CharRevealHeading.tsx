"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface CharRevealHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  highlightWords?: string[];
  stagger?: number;
  duration?: number;
  start?: string;
}

export default function CharRevealHeading({
  children,
  as: Tag = "h2",
  className = "",
  highlightWords = [],
  stagger = 0.04,
  duration = 0.7,
  start = "top 85%",
}: CharRevealHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();

  // Extract raw text
  const text = typeof children === "string" ? children : "";
  const rawWords = text ? text.split(/\s+/).filter(Boolean) : [];
  const highlightSet = new Set(highlightWords);

  // Group into runs (highlighted runs vs normal runs)
  type Run = {
    isHighlight: boolean;
    words: string[];
  };

  const runs: Run[] = [];
  rawWords.forEach((word) => {
    const isHl = highlightSet.has(word);
    const lastRun = runs[runs.length - 1];
    if (lastRun && lastRun.isHighlight === isHl) {
      lastRun.words.push(word);
    } else {
      runs.push({ isHighlight: isHl, words: [word] });
    }
  });

  useGSAP(
    () => {
      if (reduced || !headingRef.current) return;

      const animatedWords = headingRef.current.querySelectorAll(".heading-word-inner");
      if (!animatedWords.length) return;

      gsap.from(animatedWords, {
        yPercent: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: headingRef, dependencies: [reduced, text, stagger, duration, start] }
  );

  if (!text || reduced) {
    return (
      <Tag ref={headingRef} className={className}>
        {runs.length > 0 ? (
          runs.map((run, rIdx) => (
            <React.Fragment key={rIdx}>
              {run.isHighlight ? (
                <span className="text-highlight">{run.words.join(" ")}</span>
              ) : (
                <span>{run.words.join(" ")}</span>
              )}
              {rIdx < runs.length - 1 && " "}
            </React.Fragment>
          ))
        ) : (
          children
        )}
      </Tag>
    );
  }

  return (
    <Tag ref={headingRef} className={className}>
      {runs.map((run, rIdx) => {
        if (run.isHighlight) {
          // Whole highlighted multi-word phrase with ONE continuous unbroken gradient sweep
          return (
            <React.Fragment key={rIdx}>
              <span className="inline-block overflow-hidden align-top">
                <span className="heading-word-inner text-highlight inline-block">
                  {run.words.join(" ")}
                </span>
              </span>
              {rIdx < runs.length - 1 && " "}
            </React.Fragment>
          );
        }

        // Normal words
        return (
          <React.Fragment key={rIdx}>
            {run.words.map((w, wIdx) => (
              <React.Fragment key={wIdx}>
                <span className="inline-block overflow-hidden align-top text-foreground">
                  <span className="heading-word-inner inline-block">
                    {w}
                  </span>
                </span>
                {wIdx < run.words.length - 1 && " "}
              </React.Fragment>
            ))}
            {rIdx < runs.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </Tag>
  );
}
