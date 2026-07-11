"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "story", label: "Digital FTE" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

/**
 * Fixed right-edge dot navigation for the homepage. Active dot follows
 * scroll via IntersectionObserver. Hidden on small screens.
 */
export default function DotRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -40% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3"
    >
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={`Go to ${label}`}
          className="group relative flex items-center justify-center w-3 h-3"
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === id
                ? "w-2.5 h-2.5 bg-accent"
                : "w-1.5 h-1.5 bg-border group-hover:bg-muted-foreground"
            }`}
          />
          <span className="absolute right-5 whitespace-nowrap text-[0.65rem] font-mono uppercase tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
          </span>
        </a>
      ))}
    </nav>
  );
}
