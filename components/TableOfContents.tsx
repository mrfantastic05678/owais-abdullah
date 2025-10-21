"use client";

import React, { useEffect, useState } from "react";
import { PortableTextBlock } from "@portabletext/types";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
  items?: TOCItem[];
}

interface TableOfContentsProps {
  content: PortableTextBlock[];
}

function buildTOCTree(items: TOCItem[]): TOCItem[] {
  const root: TOCItem[] = [];
  const stack: TOCItem[] = [];

  items.forEach((item) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.items) parent.items = [];
      parent.items.push(item);
    }
    stack.push(item);
  });

  return root;
}

function extractText(children: unknown): string {
  if (Array.isArray(children) && children[0]) {
    if (typeof children[0] === "string") {
      return children[0];
    }
    if (typeof children[0] === "object" && "props" in children[0]) {
      return (
        (children[0] as { props: { children?: string } }).props.children || ""
      );
    }
  }
  return "";
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [tocTree, setTocTree] = useState<TOCItem[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Extract headings from the portable text content
  useEffect(() => {
    const items: TOCItem[] = [];
    const numberedSections: { [key: number]: number } = {};
    const hasNumberedHeadings = content.some((block) => {
      if (block.style?.startsWith("h") && block.children?.[0]) {
        const text =
          extractText(block.children) || block.children[0].text || "";
        return /^\s*\d+(\.\d+)*\.*\s*/.test(text);
      }
      return false;
    });

    content.forEach((block) => {
      if (block.style?.startsWith("h") && block.children?.[0]) {
        const level = parseInt(block.style[1]) || 1;
        Object.keys(numberedSections).forEach((key) => {
          if (parseInt(key) > level) {
            delete numberedSections[parseInt(key)];
          }
        });
        numberedSections[level] = (numberedSections[level] || 0) + 1;
        const text =
          extractText(block.children) || block.children[0].text || "";
        if (text) {
          const id = text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
          let displayText = text;
          if (!hasNumberedHeadings) {
            const prefix = Object.entries(numberedSections)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([, num]) => num)
              .join(".");
            displayText = `${prefix}. ${text}`;
          }
          items.push({ id, text: displayText, level });
        }
      }
    });
    setHeadings(items);
    setTocTree(buildTOCTree(items));
  }, [content]);

  // Handle scroll and intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -35% 0px" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Adjust this value to your liking
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;
  // --- Render TOC Items with hierarchy and style ---
  const renderTOCItem = (item: TOCItem) => {
    const { id, text, level, items } = item;
    const hasChildren = items && items.length > 0;
    const isExpanded = expandedItems.has(id);
    // Style for heading levels
    let headingClass = "";
    if (level === 1) {
      headingClass =
        "font-semibold text-base md:text-lg text-foreground";
    } else if (level === 2) {
      headingClass =
        "font-semibold text-sm md:text-base text-foreground/90";
    } else {
      headingClass =
        "font-medium text-xs sm:text-sm text-foreground/60";
    }
    return (
      <li key={id} className="list-none">
        <div
          className={cn(
            "flex items-center gap-2 py-1 cursor-pointer hover:text-primary transition-colors duration-200",
            headingClass,
            activeId === id ? "text-primary font-bold" : ""
          )}
          style={{ paddingLeft: `${(level - 1) * 0.8}rem` }}
        >
          {/* Always render a fixed-width chevron spacer for alignment */}
          {hasChildren ? (
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform flex-shrink-0",
                isExpanded && "transform rotate-90"
              )}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(id);
              }}
            />
          ) : (
            <span style={{ width: 16, display: "inline-block" }} />
          )}
          <span onClick={() => handleClick(id)}>{text}</span>
        </div>
        {hasChildren && isExpanded && (
          <ul className="mt-1">{items.map((child) => renderTOCItem(child))}</ul>
        )}
      </li>
    );
  };

  return (
    <nav className="">
      <div className="bg-toc-background backdrop-blur-sm border border-border rounded-lg p-3 sm:p-5">
        <h2 className="text-md sm:text-lg font-semibold mb-4 text-foreground">
          Table of Contents
        </h2>
        <ul className="space-y-1">
          {tocTree.map((item) => renderTOCItem(item))}
        </ul>
      </div>
    </nav>
  );
}
