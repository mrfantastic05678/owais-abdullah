"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  sections: ReactNode[];
  className?: string;
  snap?: boolean;
}

/**
 * HorizontalScroll Component
 *
 * Converts vertical scroll to horizontal movement across multiple sections.
 * Each section takes up the full viewport height.
 *
 * @param sections - Array of section content to display horizontally
 * @param className - Additional CSS classes
 * @param snap - Enable snap points for each section (default: true)
 */
export function HorizontalScroll({
  sections,
  className = '',
  snap = true
}: HorizontalScrollProps) {
  const container = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current || !panelsRef.current) return;

      const panels = gsap.utils.toArray(panelsRef.current.children);
      const width = container.current.offsetWidth;

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          scrub: 1,
          snap: snap ? 1 / (panels.length - 1) : false,
          end: () => `+=${width}`,
          // markers: true, // Enable for debugging, remove in production
        },
      });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className={cn('h-screen overflow-hidden', className)}
    >
      <div ref={wrapper} className="flex h-full">
        <div ref={panelsRef} className="flex">
          {sections.map((section, i) => (
            <div
              key={i}
              className="h-screen w-full flex-shrink-0 flex items-center justify-center"
            >
              {section}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
