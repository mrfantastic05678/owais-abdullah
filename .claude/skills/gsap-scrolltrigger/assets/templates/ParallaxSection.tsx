"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxSectionProps {
  children: ReactNode;
  background: ReactNode;
  speed?: number;
  className?: string;
  bgClassName?: string;
}

/**
 * ParallaxSection Component
 *
 * Creates a parallax effect where the background moves at a different speed
 * than the foreground content during scroll.
 *
 * @param children - Foreground content
 * @param background - Background element(s)
 * @param speed - Parallax speed multiplier (0.5 = half speed, 1 = normal, 2 = double)
 * @param className - Container CSS classes
 * @param bgClassName - Background CSS classes
 */
export function ParallaxSection({
  children,
  background,
  speed = 0.5,
  className = '',
  bgClassName = ''
}: ParallaxSectionProps) {
  const container = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!bgRef.current || !container.current) return;

      gsap.to(bgRef.current, {
        yPercent: -50 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        ref={bgRef}
        className={cn('absolute inset-0 -z-10 will-change-transform', bgClassName)}
      >
        {background}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
