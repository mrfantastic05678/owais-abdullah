"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "story", label: "Digital FTE" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Articles" },
  { id: "experience", label: "Experience" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

/**
 * Fixed right-edge dot navigation for the homepage. Active dot tracks
 * scroll position seamlessly across all 9 homepage sections.
 */
export default function DotRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom of page check (ensures contact is highlighted at footer)
      if (windowHeight + scrollY >= documentHeight - 80) {
        setActive(SECTIONS[SECTIONS.length - 1].id);
        ticking = false;
        return;
      }

      // Top of page check
      if (scrollY < 120) {
        setActive(SECTIONS[0].id);
        ticking = false;
        return;
      }

      // Focal reading line at 35% of viewport height
      const focalY = scrollY + windowHeight * 0.35;
      let matchedId = SECTIONS[0].id;

      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollY;
          if (focalY >= top) {
            matchedId = id;
          }
        }
      }

      setActive(matchedId);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActive(id);
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className="hidden xl:flex fixed right-4 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5 py-3 px-1.5 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md border border-slate-200/60 dark:border-teal-900/30 shadow-xs"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => scrollToSection(e, id)}
            aria-label={`Go to ${label} section`}
            className="group relative flex items-center justify-center w-3 h-3 cursor-pointer"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-2.5 h-2.5 bg-teal-600 dark:bg-teal-400 ring-4 ring-teal-500/25"
                  : "w-1.5 h-1.5 bg-slate-400/80 dark:bg-slate-600 group-hover:bg-teal-500/80 group-hover:scale-125"
              }`}
            />
            <span className="absolute right-6 px-2.5 py-0.5 rounded-md bg-white/95 dark:bg-[#041417]/95 border border-slate-200 dark:border-teal-500/30 shadow-md whitespace-nowrap text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
