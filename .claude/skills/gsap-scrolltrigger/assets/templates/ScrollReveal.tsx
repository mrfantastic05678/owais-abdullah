"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  stagger?: number;
  trigger?: string;
}

/**
 * ScrollReveal Component
 *
 * Reveal children elements with a fade and slide animation when they enter the viewport.
 *
 * @param children - Elements to animate
 * @param className - Additional CSS classes
 * @param delay - Delay before animation starts (default: 0)
 * @param direction - Direction of slide animation (default: 'up')
 * @param distance - Distance to slide in pixels (default: 60)
 * @param stagger - Stagger delay between children (default: 0.1)
 * @param trigger - Custom trigger selector (default: container)
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 60,
  stagger = 0.1,
  trigger
}: ScrollRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = trigger
        ? document.querySelector(trigger)
        : container.current;

      if (!element) return;

      // Get animation values based on direction
      const getAnimationValues = () => {
        switch (direction) {
          case 'down':
            return { y: -distance };
          case 'left':
            return { x: distance };
          case 'right':
            return { x: -distance };
          default: // 'up'
            return { y: distance };
        }
      };

      const values = getAnimationValues();

      gsap.from(element.children, {
        ...values,
        opacity: 0,
        duration: 0.8,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trigger || element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className={cn('', className)}>
      {children}
    </div>
  );
}
