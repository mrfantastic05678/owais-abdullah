"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  stagger = 0.02,
  duration = 0.8,
  start = "top 80%",
}: CharRevealHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    const heading = headingRef.current;
    const text = heading.innerText;
    heading.innerHTML = "";

    const highlightSet = new Set(highlightWords);
    const words = text.split(" ");

    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "inline-block whitespace-nowrap overflow-hidden";
      if (wordIdx < words.length - 1) wordSpan.style.marginRight = "0.25em";

      const isHighlight = highlightSet.has(word);
      word.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.innerText = char;
        charSpan.className = "inline-block translate-y-[120%] text-transparent";
        if (isHighlight) charSpan.dataset.hl = "1";
        wordSpan.appendChild(charSpan);
      });
      heading.appendChild(wordSpan);
    });

    const chars = heading.querySelectorAll("span > span");

    const trigger = ScrollTrigger.create({
      trigger: heading,
      start,
      onEnter: () =>
        gsap.to(chars, {
          y: "0%",
          color: (i: number, el: Element) =>
            (el as HTMLElement).dataset.hl ? "var(--signal-500)" : "var(--foreground)",
          duration,
          stagger,
          ease: "power4.out",
          overwrite: "auto",
        }),
      onLeaveBack: () =>
        gsap.set(chars, { y: "120%", color: "transparent", overwrite: "auto" }),
    });

    return () => {
      trigger.kill();
    };
  }, [highlightWords, stagger, duration, start]);

  return (
    <Tag ref={headingRef} className={className}>
      {children}
    </Tag>
  );
}
