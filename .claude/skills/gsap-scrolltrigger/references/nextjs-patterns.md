# Next.js App Router GSAP Patterns

SSR-safe patterns for GSAP ScrollTrigger in Next.js 15 with App Router.

## Critical Rules

### 1. Always Use "use client" Directive

GSAP requires browser APIs. Any component using ScrollTrigger MUST be a client component.

```typescript
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  // Component code
}
```

### 2. Use useGSAP Hook (Preferred)

The `useGSAP` hook from `@gsap/react` handles cleanup automatically and prevents memory leaks.

```typescript
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const container = useRef();

  useGSAP(() => {
    gsap.from(".box", {
      y: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: ".box",
        start: "top 80%",
      }
    });
  }, { scope: container });

  return <div ref={container}><div className="box">Animate me</div></div>;
}
```

### 3. Alternative: useLayoutEffect with gsap.context()

For more control, use `useLayoutEffect` with manual cleanup.

```typescript
"use client";

import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const container = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".box", {
        y: 100,
        scrollTrigger: { trigger: ".box", start: "top 80%" }
      });
    }, container);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return <div ref={container}><div className="box">Animate me</div></div>;
}
```

## Route Change Handling

### Problem: ScrollTrigger breaks on navigation

Next.js App Router doesn't unmount/remount components on route changes. ScrollTriggers persist and break.

### Solution: Kill triggers on route change

```typescript
"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export function useScrollTriggerCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // Kill all triggers on route change
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [pathname]);

  useEffect(() => {
    // Refresh after route transition
    ScrollTrigger.refresh();
  }, [pathname]);
}
```

## Dynamic Imports for Performance

Load GSAP components only when needed to reduce initial bundle size.

```typescript
import dynamic from 'next/dynamic';

const ScrollAnimation = dynamic(
  () => import('@/components/ScrollAnimation'),
  { ssr: false } // Only load on client
);

export default function Page() {
  return <ScrollAnimation />;
}
```

## Centralized GSAP Configuration

Create a single config file to avoid redundant plugin registration.

**`lib/gsapConfig.ts`**
```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default gsap;
```

**Usage in components:**
```typescript
import gsap from '@/lib/gsapConfig';

// No need to register plugins again
```

## Common SSR Errors to Avoid

| Error | Cause | Solution |
|-------|--------|----------|
| "window is not defined" | Server-side execution | Use "use client" directive |
| "ScrollTrigger is not defined" | Missing plugin registration | Register ScrollTrigger before use |
| "Maximum update depth exceeded" | State in render causing loops | Move state to useEffect/useGSAP |
| Hydration mismatch | Browser API in render | Use useEffect for browser-only code |

## Next.js 15 Specific Patterns

### Server Actions Compatibility

GSAP works fine with Server Actions - just keep animations on client side.

```typescript
// app/page.tsx - Server Component
import { ScrollReveal } from '@/components/ScrollReveal';

export default function Page() {
  return (
    <main>
      <h1>Hello</h1>
      <ScrollReveal>
        <p>This content animates on scroll</p>
      </ScrollReveal>
    </main>
  );
}

// components/ScrollReveal.tsx - Client Component
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const container = useRef();

  useGSAP(() => {
    gsap.from(container.current.children, {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });
  }, { scope: container });

  return <div ref={container}>{children}</div>;
}
```

## Performance Tips for Next.js

1. **Use dynamic imports** for heavy GSAP plugins
2. **Defer non-critical animations** until after hydration
3. **Use `use client` only on leaf components** - keep as much server-only as possible
4. **Consider React Server Components** for static content, only make animated parts client components
