# Common GSAP ScrollTrigger Patterns

Production-ready code templates for common scroll animation patterns.

## Table of Contents

1. [Basic Reveal](#1-basic-reveal)
2. [Parallax Background](#2-parallax-background)
3. [Horizontal Scroll](#3-horizontal-scroll)
4. [Pinned Section](#4-pinned-section)
5. [Batch Reveal](#5-batch-reveal)
6. [Staggered Text Animation](#6-staggered-text-animation)
7. [Image Reveal with Scale](#7-image-reveal-with-scale)
8. [Progress Indicator](#8-progress-indicator)
9. [Page Transitions](#9-page-transitions)
10. [Mobile-Responsive Adjustments](#10-mobile-responsive-adjustments)

---

## 1. Basic Reveal

Elements fade and slide in when entering viewport.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function BasicReveal({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(container.current!.children, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }, { scope: container });

  return <div ref={container}>{children}</div>;
}
```

---

## 2. Parallax Background

Background moves at different speed than foreground.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function ParallaxSection({
  background,
  children,
  speed = 0.5
}: {
  background: React.ReactNode;
  children: React.ReactNode;
  speed?: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(bgRef.current, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative min-h-screen overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 -z-10">
        {background}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

---

## 3. Horizontal Scroll

Vertical scroll drives horizontal movement with snap points.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function HorizontalScroll({
  sections,
  className = ""
}: {
  sections: React.ReactNode[];
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray(panelsRef.current!.children);
    const width = container.current!.offsetWidth;

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => "+=" + width
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className={`h-screen overflow-hidden ${className}`}>
      <div ref={wrapper} className="flex h-full">
        <div ref={panelsRef} className="flex">
          {sections.map((section, i) => (
            <div key={i} className="h-screen w-full flex-shrink-0 flex items-center justify-center">
              {section}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 4. Pinned Section

Element stays fixed while content animates over it.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function PinnedSection({
  height = "200vh",
  children
}: {
  height?: string;
  children: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: `+=${height}`,
        pin: true,
        scrub: 1
      }
    });

    // Add your animations to the timeline
    tl.from(".content-1", { x: -100, opacity: 0 })
      .from(".content-2", { x: 100, opacity: 0 }, "<0.2")
      .from(".content-3", { y: 50, opacity: 0 }, "<0.2");
  }, { scope: container });

  return (
    <div ref={container} className="relative">
      {children}
    </div>
  );
}
```

---

## 5. Batch Reveal

Multiple elements animate in groups for better performance.

```typescript
"use client";

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export function BatchReveal({
  selector,
  className = ""
}: {
  selector: string;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.batch(selector, {
      interval: 0.1,
      batchMax: 3,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          overwrite: true
        });
      },
      start: "top 85%"
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [selector]);

  return (
    <div ref={container} className={className}>
      {/* Initial styles for batch elements */}
      <style>{`
        ${selector} {
          opacity: 0;
          transform: translateY(40px);
        }
      `}</style>
    </div>
  );
}
```

---

## 6. Staggered Text Animation

Text reveals character by character or word by word.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function StaggeredText({
  text,
  className = "",
  stagger = 0.05
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const chars = container.current!.querySelectorAll('.char');
    gsap.from(chars, {
      y: 100,
      opacity: 0,
      rotationX: -90,
      stagger,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%"
      }
    });
  }, { scope: container });

  // Split text into spans
  const splitText = text.split('').map((char, i) => (
    <span key={i} className="char inline-block">{char === ' ' ? '\u00A0' : char}</span>
  ));

  return (
    <div ref={container} className={className}>
      {splitText}
    </div>
  );
}
```

---

## 7. Image Reveal with Scale

Image scales up from center while revealing.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function ImageReveal({
  src,
  alt,
  className = ""
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%"
      }
    });

    tl.from(imageRef.current, {
        scale: 1.3,
        duration: 1.5,
        ease: "power2.out"
      })
      .to(overlayRef.current, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1,
        ease: "power4.inOut"
      }, "<");
  }, { scope: container });

  return (
    <div ref={container} className={`relative overflow-hidden ${className}`}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-background origin-top"
      />
    </div>
  );
}
```

---

## 8. Progress Indicator

Visual progress bar linked to scroll position.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress({
  color = "bg-primary",
  height = "h-1",
  position = "top"
}: {
  color?: string;
  height?: string;
  position?: "top" | "bottom";
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useGSAP(() => {
    ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setWidth(self.progress * 100);
      }
    });
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 ${position}-0 z-50 pointer-events-none`}
    >
      <div
        ref={barRef}
        className={`${height} ${color} origin-left`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
```

---

## 9. Page Transitions

Smooth transitions between pages with GSAP.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useEffect } from 'react';

export function PageTransition({
  children
}: {
  children: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Entrance animation
    gsap.from(container.current!.children, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });

    return () => {
      // Exit animation
      gsap.to(container.current!.children, {
        y: -30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in"
      });
    };
  }, { scope: container });

  return <div ref={container}>{children}</div>;
}
```

---

## 10. Mobile-Responsive Adjustments

Different animations for mobile vs desktop using matchMedia.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function ResponsiveAnimation({
  children
}: {
  children: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Desktop: Full pinning animation
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": function() {
        gsap.to(container.current, {
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=200vh",
            pin: true,
            scrub: true
          }
        });
      },
      // Mobile: Simple reveal
      "(max-width: 767px)": function() {
        gsap.from(container.current, {
          y: 50,
          opacity: 0,
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%"
          }
        });
      }
    });
  }, { scope: container });

  return <div ref={container}>{children}</div>;
}
```

---

## Usage Tips

1. **Always clean up**: Use `useGSAP` hook or manual cleanup in `useEffect` return
2. **Test on mobile**: Use browser dev tools to test touch interactions
3. **Markers for debugging**: Add `markers: true` during development, remove for production
4. **Performance**: Use `will-change: transform, opacity` in CSS for animating elements
5. **Accessibility**: Implement `prefers-reduced-motion` to respect user preferences

```css
/* Add to your global CSS */
.animate-element {
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .animate-element {
    will-change: auto;
  }
}
```
