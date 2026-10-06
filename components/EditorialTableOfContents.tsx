"use client";

import React, { useEffect, useState } from "react";
import { PortableTextBlock } from "@portabletext/types";
import { ListOrdered, ChevronRight, Hash } from "lucide-react";

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

interface EditorialTOCProps {
  content: PortableTextBlock[];
  hasFaqs?: boolean;
  variant?: "sidebar" | "mobile-bar";
}

function extractPlainText(children: any): string {
  if (!children) return "";
  if (Array.isArray(children)) {
    return children
      .map((c) => {
        if (typeof c === "string") return c;
        if (c?.text) return c.text;
        if (c?.props?.children) return extractPlainText(c.props.children);
        return "";
      })
      .join("");
  }
  return "";
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function EditorialTableOfContents({
  content,
  hasFaqs = false,
  variant = "sidebar",
}: EditorialTOCProps) {
  const headings = React.useMemo<TOCHeading[]>(() => {
    const extracted: TOCHeading[] = [];
    if (Array.isArray(content)) {
      content.forEach((block) => {
        if (block.style && block.style.startsWith("h") && block.children) {
          const level = parseInt(block.style[1]) || 2;
          const text = extractPlainText(block.children).trim();
          if (text) {
            const id = slugifyHeading(text);
            extracted.push({ id, text, level });
          }
        }
      });
    }

    if (hasFaqs) {
      extracted.push({ id: "faqs", text: "Architecture FAQs", level: 2 });
    }
    extracted.push({ id: "comments", text: "Technical Discussions", level: 2 });

    return extracted;
  }, [content, hasFaqs]);

  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      let currentActive = headings[0].id;

      for (let i = 0; i < headings.length; i++) {
        const el = document.getElementById(headings[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            currentActive = headings[i].id;
          }
        }
      }
      setActiveId(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -110;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  // VARIANT: Mobile Quick-Jump Bar
  if (variant === "mobile-bar") {
    return (
      <div className="lg:hidden mb-6 p-2.5 sm:p-3 rounded-xl bg-secondary/50 border border-border flex items-center justify-between gap-3 overflow-hidden">
        <span className="font-mono font-bold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Hash className="w-3 h-3 text-accent" />
          Jump To:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {headings.map((item, idx) => (
            <button
              key={item.id}
              onClick={(e) => scrollToSection(e, item.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono shrink-0 transition-all border ${
                activeId === item.id
                  ? "bg-accent/15 border-accent text-accent font-semibold"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {idx + 1}. {item.text.length > 20 ? `${item.text.slice(0, 18)}…` : item.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // VARIANT: Sidebar Card
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
      <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-3.5 flex items-center gap-2 pb-2.5 border-b border-border/80">
        <ListOrdered className="w-3.5 h-3.5 text-accent" />
        <span>Article Index</span>
      </div>

      <nav className="flex flex-col gap-1">
        {headings.map((item, idx) => {
          const isActive = activeId === item.id;
          const isSub = item.level >= 3;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className={`group flex items-start gap-2.5 py-1.5 text-xs transition-colors rounded-md px-1.5 ${
                isSub ? "pl-5 text-muted-foreground" : ""
              } ${
                isActive
                  ? "text-accent font-semibold bg-accent/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 transition-all ${
                  isActive
                    ? "bg-accent shadow-[0_0_8px_rgba(20,184,166,0.8)] scale-110"
                    : "bg-border group-hover:bg-muted-foreground/60"
                }`}
              />
              <span className="leading-snug">
                {!isSub && <span className="font-mono text-[11px] opacity-70 mr-1">{idx + 1}.</span>}
                {item.text}
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
