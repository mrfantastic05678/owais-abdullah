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

/**
 * Paints one continuous blue→green gradient across a run of chars, sized
 * and positioned relative to `originLeft` so multiple elements (chars, or
 * whole words in a multi-word highlight) read as a single unbroken sweep
 * instead of each restarting its own gradient.
 */
function paintGradientRun(chars: HTMLSpanElement[], headingRect: DOMRect) {
  if (chars.length === 0) return;
  const first = chars[0].getBoundingClientRect();
  const last = chars[chars.length - 1].getBoundingClientRect();
  const runLeft = first.left - headingRect.left;
  const runWidth = last.right - first.left;

  chars.forEach((charSpan) => {
    const offsetInRun = charSpan.getBoundingClientRect().left - headingRect.left - runLeft;
    charSpan.dataset.hl = "1";
    charSpan.style.backgroundImage =
      "linear-gradient(to right, var(--accent) 0%, var(--accent) 60%, var(--signal-500) 100%)";
    charSpan.style.backgroundSize = `${runWidth}px 100%`;
    charSpan.style.backgroundPosition = `-${offsetInRun}px 0`;
    charSpan.style.setProperty("-webkit-background-clip", "text");
    charSpan.style.backgroundClip = "text";
    charSpan.style.setProperty("-webkit-text-fill-color", "transparent");
  });
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
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !headingRef.current) return;

      const heading = headingRef.current;
      const text = heading.textContent || heading.innerText;
      heading.innerHTML = "";

      const highlightSet = new Set(highlightWords);
      const words = text.split(" ");

      // Build DOM first, tracking each word's chars + highlight flag —
      // gradient painting happens in a second pass once everything has a
      // real layout position to measure.
      const wordMeta: { chars: HTMLSpanElement[]; isHighlight: boolean }[] = [];

      words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "inline-block whitespace-nowrap overflow-hidden";
        if (wordIdx < words.length - 1) wordSpan.style.marginRight = "0.25em";

        const isHighlight = highlightSet.has(word);
        const wordChars: HTMLSpanElement[] = [];
        word.split("").forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.innerText = char;
          charSpan.className = "inline-block translate-y-[120%] text-transparent";
          wordSpan.appendChild(charSpan);
          wordChars.push(charSpan);
        });
        heading.appendChild(wordSpan);
        wordMeta.push({ chars: wordChars, isHighlight });
      });

      // Merge consecutive highlighted words into single gradient runs so
      // "AI employees" reads as one sweep, not two independent ones.
      const headingRect = heading.getBoundingClientRect();
      let i = 0;
      while (i < wordMeta.length) {
        if (wordMeta[i].isHighlight) {
          const run: HTMLSpanElement[] = [];
          while (i < wordMeta.length && wordMeta[i].isHighlight) {
            run.push(...wordMeta[i].chars);
            i++;
          }
          paintGradientRun(run, headingRect);
        } else {
          i++;
        }
      }

      const chars = heading.querySelectorAll("span > span");

      ScrollTrigger.create({
        trigger: heading,
        start,
        onEnter: () =>
          gsap.to(chars, {
            y: "0%",
            // Highlighted chars stay transparent — their inline gradient
            // background-clip paints the visible color, not this property
            color: (i: number, el: Element) =>
              (el as HTMLElement).dataset.hl ? "transparent" : "var(--foreground)",
            duration,
            stagger,
            ease: "power4.out",
            overwrite: "auto",
          }),
        onLeaveBack: () =>
          gsap.set(chars, { y: "120%", color: "transparent", overwrite: "auto" }),
      });
    },
    { scope: headingRef, dependencies: [reduced, highlightWords, stagger, duration, start] }
  );

  // Reduced motion / pre-hydration: render plain text with contiguous
  // highlight-word runs wrapped as one span, so the gradient still shows
  // as a single sweep without JS
  const staticContent =
    typeof children === "string" && highlightWords.length > 0 ? (
      (() => {
        const words = children.split(" ");
        const highlightSet = new Set(highlightWords);
        const nodes: React.ReactNode[] = [];
        let i = 0;
        while (i < words.length) {
          if (highlightSet.has(words[i])) {
            const run: string[] = [];
            while (i < words.length && highlightSet.has(words[i])) {
              run.push(words[i]);
              i++;
            }
            nodes.push(
              <span key={i} className="text-highlight">
                {run.join(" ")}
              </span>
            );
          } else {
            nodes.push(words[i]);
            i++;
          }
          if (i < words.length) nodes.push(" ");
        }
        return nodes;
      })()
    ) : (
      children
    );

  return (
    <Tag ref={headingRef} className={className}>
      {reduced ? staticContent : children}
    </Tag>
  );
}
