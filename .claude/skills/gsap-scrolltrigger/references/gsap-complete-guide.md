# GSAP ScrollTrigger: Complete Research & Reference Guide (2024-2026)

> A comprehensive single-source-of-truth document for GSAP ScrollTrigger covering latest updates, best practices, templates, common issues, advanced patterns, and community resources.

---

## Table of Contents

1. [GSAP Latest Updates & Version History](#1-gsap-latest-updates--version-history-2024-2026)
2. [Best Practices](#2-best-practices-2024-2026)
3. [Templates & Boilerplates](#3-templates--boilerplates)
4. [Real-World Problems & Solutions](#4-real-world-problems--solutions-2024-2026)
5. [Advanced Patterns](#5-advanced-patterns)
6. [Community Resources](#6-community-resources)
7. [Framework-Specific Integration](#7-framework-specific-integration)

---

## 1. GSAP Latest Updates & Version History (2024-2026)

### Version 3.14 (2025)

**Key Features:**
- **MorphSVG "smooth" feature** - Adds extra "smoothing" anchor points to artwork for better morphs
- **New Demo Hub** - Centralized collection of 50+ popular demos, expanding with framework-specific examples
- Lots of minor improvements and fixes

**Breaking Changes:** None significant for ScrollTrigger

### Version 3.13 (2024/2025)

**Major Feature: GSAP is now 100% FREE!**
- All bonus plugins (SplitText, MorphSVG, ScrollSmoother, etc.) are now free for everyone
- GSAP was acquired by Webflow
- Club GSAP membership discontinued (existing members get special recognition)

**SplitText Rewrite:**
- 50% smaller file size
- 14 new features including:
  - `aria-label` and `aria-hidden` support
  - `autoSplit` capability
  - `onSplit()` callback
  - `deepSlice`, `propIndex`, RegExp support
  - `prepareText()` function

**New Feature: Animate to CSS Variable**
```javascript
// NEW in 3.13
gsap.to(".target", { color: "var(--my-color)" });
```

**Breaking Changes (SplitText):**
- Removed `lineThreshold` setting
- Function-based `specialChars` removed (array still works)
- Class name incrementing now element-based instead of global

### Version 3.12 (Earlier 2024)

- Improvements to ScrollTrigger and core functionality
- Enhanced framework integration patterns

---

## 2. Best Practices (2024-2026)

### Performance Optimization Techniques

#### GPU Acceleration Properties
| Property | Performance Rating | Notes |
|----------|-------------------|-------|
| `x`, `y`, `scale`, `rotation` | Excellent | Use transforms for positioning |
| `opacity` | Excellent | Great for fades |
| `top`, `left`, `right`, `bottom` | Poor (Avoid) | Triggers reflow/layout |
| `filter`, `boxShadow` | Very Poor (Use Sparingly) | CPU intensive, test thoroughly |

**Always use:**
```javascript
// GOOD - GPU accelerated
gsap.to(".box", { x: 100, y: 50, scale: 1.2, opacity: 0.8 });

// BAD - Layout thrashing
gsap.to(".box", { left: 100, top: 50 });
```

#### CSS `will-change` Property
```css
.box {
  will-change: transform, opacity;
}
```

#### Batch Animations
- Instead of animating individual elements, use batching
- `ScrollTrigger.batch()` is optimized for multiple elements
- Use `lazy: false` in ScrollTrigger for resource optimization

#### Reduce ScrollTrigger Count
- Avoid having too many scroll-triggered animations active at once
- Use `ScrollTrigger.batch()` for groups of similar elements
- Consider using CSS transitions for simple animations

### Code Organization Patterns

#### Centralized Configuration (Next.js)
Create a single configuration file to avoid redundant plugin registration:

**`lib/gsapConfig.ts`**
```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default gsap;
```

**Usage in components:**
```typescript
import gsap from "@/lib/gsapConfig";
// No need to register plugins again
```

### ScrollTrigger-Specific Best Practices

#### 1. Use `gsap.context()` for Framework Integration
```javascript
// React/Next.js
const containerRef = useRef();
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(".box", { x: 100 });
  }, containerRef);
  return () => ctx.revert(); // Cleanup
}, []);
```

#### 2. Use `useGSAP()` Hook (React)
```javascript
import { useGSAP } from "@gsap/react";

const MyComponent = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.to(".box", {
      scrollTrigger: {
        trigger: ".box",
        start: "top 80%",
        scrub: true
      },
      x: 100
    });
  }, { scope: container });

  return <div ref={container}>...</div>;
};
```

#### 3. Function-Based Values for Responsive Start/End
```javascript
// BAD - Won't update on resize
end: `+=${elem.offsetHeight}`

// GOOD - Will update on resize
end: () => `+=${elem.offsetHeight}`
```

#### 4. Use `invalidateOnRefresh` for Dynamic Values
```javascript
gsap.to(".box", {
  x: window.innerWidth * 0.5,
  scrollTrigger: {
    trigger: ".box",
    invalidateOnRefresh: true // Recalculate on resize
  }
});
```

#### 5. Markers for Debugging
```javascript
scrollTrigger: {
  trigger: ".box",
  start: "top 80%",
  markers: true, // Visual debugging - remove in production
  scrub: true
}
```

### Framework Integrations

#### React/Next.js Best Practices

1. **Always use `useLayoutEffect` or `useGSAP` hook**
2. **Clean up with `gsap.context()`**
3. **Use refs instead of document queries**
4. **Handle route changes properly**

```javascript
"use client";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSection() {
  const container = useRef();

  useGSAP(() => {
    // All GSAP code here
    ScrollTrigger.refresh();
  }, { scope: container });

  return <div ref={container}>...</div>;
}
```

#### Vue Best Practices
```javascript
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  setup() {
    const boxRef = ref(null);
    let ctx;

    onMounted(() => {
      ctx = gsap.context(() => {
        gsap.to(boxRef.value, {
          scrollTrigger: {
            trigger: boxRef.value,
            start: "top 80%"
          },
          y: 50
        });
      });
    });

    onUnmounted(() => {
      ctx.revert();
    });

    return { boxRef };
  }
};
```

#### Svelte Best Practices
```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  let box;
  let ctx;

  onMount(() => {
    ctx = gsap.context(() => {
      gsap.to(box, {
        scrollTrigger: {
          trigger: box,
          start: "top 80%"
        },
        y: 50
      });
    });
  });

  onDestroy(() => {
    ctx?.revert();
  });
</script>

<div bind:this={box} />
```

---

## 3. Templates & Boilerplates

### Official GSAP Resources

#### Stackblitz Starter Templates
GSAP provides official starter templates for all major frameworks:
- **React**: [GSAP React Starter](https://stackblitz.com/edit/gsap-react-starter)
- **Next.js**: [GSAP Next.js Starter](https://stackblitz.com/edit/gsap-nextjs-starter)
- **Vue**: [GSAP Vue Starter](https://stackblitz.com/edit/gsap-vue-starter)
- **Svelte**: [GSAP Svelte Starter](https://stackblitz.com/edit/gsap-svelte-starter)
- **Vanilla**: [GSAP Starter](https://stackblitz.com/edit/gsap-starter)

#### CodePen Starter
[Official GSAP CodePen Starter](https://codepen.io/GreenSock/pen/aYYOdN) - Loads all plugins

### Community Templates

#### GitHub Projects
| Project | Stars | Description |
|---------|-------|-------------|
| [codebucks27/The-Weirdos-NFT-Website](https://github.com/codebucks27/The-Weirdos-NFT-Website-Starter-Code) | 411 | NFT Collection landing page with GSAP scrolling |
| [codebucks27/wibe-studio](https://github.com/codebucks27/wibe-studio) | 227 | Fashion Studio Website with locomotive-scroll |
| [codrops/OnScrollLayoutFormations](https://github.com/codrops/OnScrollLayoutFormations) | 100 | Layout formations on scroll using GSAP |

### Common ScrollTrigger Patterns

#### 1. Basic Reveal on Scroll
```javascript
gsap.from(".reveal", {
  y: 50,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".reveal",
    start: "top 80%"
  }
});
```

#### 2. Parallax Effect
```javascript
gsap.to(".parallax-bg", {
  yPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
```

#### 3. Horizontal Scroll
```javascript
const sections = gsap.utils.toArray(".horizontal-section");
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-container",
    pin: true,
    scrub: 1,
    end: () => "+=" + document.querySelector(".horizontal-container").offsetWidth
  }
});
```

#### 4. Pinned Section with Animation
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".pinned-section",
    start: "top top",
    end: "+=100%",
    pin: true,
    scrub: true
  }
});

tl.from(".content-1", { x: -100, opacity: 0 })
  .from(".content-2", { x: 100, opacity: 0 }, "<0.2")
  .from(".content-3", { y: 50, opacity: 0 }, "<0.2");
```

#### 5. Batch Reveal Animation
```javascript
ScrollTrigger.batch(".card", {
  interval: 0.1,
  batchMax: 3,
  onEnter: batch => gsap.to(batch, {
    opacity: 1,
    y: 0,
    stagger: 0.15,
    overwrite: true
  }),
  start: "top 85%"
});
```

---

## 4. Real-World Problems & Solutions (2024-2026)

### Common ScrollTrigger Issues

#### Issue 1: Nested ScrollTriggers in Timelines
**Problem:** Cannot put ScrollTriggers on animations nested inside a timeline.

**Solution:**
```javascript
// WRONG
const tl = gsap.timeline();
tl.to(".box1", {
  x: 100,
  scrollTrigger: { trigger: ".box1" }
});
tl.to(".box2", {
  x: 100,
  scrollTrigger: { trigger: ".box2" }
});

// CORRECT - Apply ScrollTrigger to parent timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});
tl.to(".box1", { x: 100 })
  .to(".box2", { x: 100 });
```

#### Issue 2: Multiple ScrollTriggers on Same Element Properties
**Problem:** Creating logic issues with multiple ScrollTriggers animating same properties.

**Solution:**
```javascript
// WRONG - Creates logic conflicts
gsap.to('h1', {
  x: 100,
  scrollTrigger: { trigger: 'h1', start: 'top bottom', end: 'center center', scrub: true }
});
gsap.to('h1', {
  x: 200,
  scrollTrigger: { trigger: 'h1', start: 'center center', end: 'bottom top', scrub: true }
});

// CORRECT - Use timeline with single ScrollTrigger
const tl = gsap.timeline({
  scrollTrigger: { trigger: 'h1', start: 'top bottom', end: 'bottom top', scrub: true }
});
tl.to('h1', { x: 100 })
  .to('h1', { x: 200 });
```

### Mobile/Touch Device Problems

#### Problem 1: ScrollTrigger Firing Too Early/Late on Mobile
**Cause:** Floating address bar causes viewport height changes.

**Solution 1: Use `normalizeScroll()`**
```javascript
ScrollTrigger.normalizeScroll(true);
```

**Solution 2: Use `matchMedia()` for Mobile-Specific Behavior**
```javascript
ScrollTrigger.matchMedia({
  // Desktop
  "(min-width: 768px)": function() {
    gsap.to(".hero", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom center",
        scrub: true,
        pin: true
      }
    });
  },
  // Mobile
  "(max-width: 767px)": function() {
    // Simpler animation for mobile
    gsap.from(".hero", {
      y: 50,
      opacity: 0,
      scrollTrigger: {
        trigger: ".hero",
        start: "top 80%"
      }
    });
  }
});
```

#### Problem 2: Jerky/Slow Scrolling on Mobile
**Cause:** Scroll on mobile handled in different thread.

**Solution: Use `normalizeScroll` on touch devices only**
```javascript
if (ScrollTrigger.isTouch) {
  ScrollTrigger.normalizeScroll(true);
}
```

#### Problem 3: Not Enough Scroll Space on Mobile for All Triggers
**Solution: Use `clamp()` or adjust start/end values**
```javascript
scrollTrigger: {
  start: "clamp(top bottom)",
  end: "clamp(bottom top)"
}

// Or adjust for last element
if (isLastElement) {
  end: () => `+=${window.innerHeight - trigger.offsetHeight}`
}
```

### Framework Integration Issues

#### React Router Navigation
**Problem:** ScrollTrigger breaks when navigating back.

**Solution:**
```javascript
useEffect(() => {
  // Clear scroll memory on mount
  ScrollTrigger.clearScrollMemory();

  // Refresh on route change
  ScrollTrigger.refresh();

  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
}, [pathname]);
```

#### State Changes Causing Animation Issues
**Problem:** React state changes break ScrollTrigger animations.

**Solution:**
```javascript
const containerRef = useRef();

useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Animation code
  }, containerRef);

  return () => ctx.revert();
}, [/* state dependencies */]);
```

### Performance Problems

#### Too Many ScrollTriggers
**Problem:** 100+ ScrollTriggers causing page slowdown.

**Solution: Use `ScrollTrigger.batch()`**
```javascript
ScrollTrigger.batch(".animatable", {
  onEnter: batch => gsap.to(batch, {
    opacity: 1,
    y: 0,
    stagger: 0.1
  })
});
```

#### Unnecessary Re-renders in Frameworks
**Solution:** Proper cleanup with context
```javascript
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Create animations
  });

  return () => ctx.revert(); // Proper cleanup
}, []);
```

### Common Gotchas

#### Gotcha 1: Forgetting to Register Plugin
```javascript
// REQUIRED - protects from tree shaking
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

#### Gotcha 2: Using Wrong Scroller
```javascript
// If scrolling a div, specify scroller
scrollTrigger: {
  trigger: ".element",
  scroller: ".scroll-container", // Important!
  start: "top 80%"
}
```

#### Gotcha 3: Animations Starting Off-Screen
**Problem:** Animation starts mid-viewport but resets off-screen.

**Solution:**
```javascript
// Set initial state with gsap.set()
gsap.set(".box", { y: 100, opacity: 0 });

// Then animate with ScrollTrigger
gsap.to(".box", {
  y: 0,
  opacity: 1,
  scrollTrigger: {
    trigger: ".box",
    start: "top 80%"
  }
});
```

---

## 5. Advanced Patterns

### Pinning Scenarios

#### Basic Pinning
```javascript
gsap.to(".pinned-element", {
  scrollTrigger: {
    trigger: ".pinned-element",
    start: "top top",
    end: "+=300", // Pin for 300px of scroll
    pin: true
  }
});
```

#### Pinning with Spacing Control
```javascript
scrollTrigger: {
  pin: true,
  pinSpacing: false // Don't add spacer
}

// Or use margin instead of padding
scrollTrigger: {
  pin: true,
  pinSpacing: "margin"
}
```

#### Pinned Element Parallax
```javascript
// Solution: Nest divs, pin outer, animate inner
gsap.to(".inner-content", {
  yPercent: 50,
  scrollTrigger: {
    trigger: ".outer-container",
    pin: ".outer-container",
    scrub: true,
    start: "top top",
    end: "bottom bottom"
  }
});
```

### Horizontal Scroll Implementations

#### Basic Horizontal Scroll
```javascript
const sections = gsap.utils.toArray(".panel");
const container = document.querySelector(".container");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: container,
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + container.offsetWidth
  }
});
```

#### Horizontal Scroll with Nested Animations
```javascript
const horizontalScroll = gsap.to(".panels", {
  xPercent: -100 * (panels.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-container",
    pin: true,
    scrub: true,
    end: () => "+=" + container.offsetWidth
  }
});

// Add to horizontal scroll timeline
panels.forEach((panel, i) => {
  gsap.to(panel.querySelector(".content"), {
    y: -50,
    scrollTrigger: {
      trigger: panel,
      containerAnimation: horizontalScroll, // Key!
      start: "left center",
      end: "right center",
      scrub: true
    }
  });
});
```

### Parallax Effects

#### Simple Parallax
```javascript
gsap.to(".parallax-element", {
  yPercent: -20,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-container",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
```

#### Multi-Layer Parallax
```javascript
const parallaxLayers = [
  { selector: ".layer-bg", speed: 0.2 },
  { selector: ".layer-mid", speed: 0.5 },
  { selector: ".layer-fg", speed: 0.8 }
];

parallaxLayers.forEach(layer => {
  gsap.to(layer.selector, {
    yPercent: -100 * layer.speed,
    ease: "none",
    scrollTrigger: {
      trigger: ".parallax-container",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});
```

### Timeline Management

#### Scroll-Triggered Timeline
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "bottom bottom",
    scrub: 1
  }
});

tl.from(".hero", { y: 100, opacity: 0 })
  .from(".content", { x: -50, opacity: 0 }, "<0.2")
  .from(".footer", { y: 50, opacity: 0 }, "<0.2");
```

#### Labels for Snapping
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    snap: {
      snapTo: "labels",
      duration: { min: 0.2, max: 3 },
      ease: "power1.inOut"
    }
  }
});

tl.addLabel("section1")
  .from(".section1", { opacity: 0 })
  .addLabel("section2")
  .from(".section2", { opacity: 0 })
  .addLabel("section3")
  .from(".section3", { opacity: 0 });
```

### Nested ScrollTriggers

#### Using `containerAnimation`
```javascript
const mainScroll = gsap.to(".horizontal-wrapper", {
  xPercent: -100,
  scrollTrigger: {
    trigger: ".horizontal-container",
    pin: true,
    scrub: true
  }
});

// Nested triggers within horizontal scroll
gsap.utils.toArray(".panel").forEach((panel, i) => {
  gsap.from(panel.querySelector(".content"), {
    y: 100,
    scrollTrigger: {
      trigger: panel,
      containerAnimation: mainScroll, // Link to parent
      start: "left center",
      toggleActions: "play none none reverse"
    }
  });
});
```

### Advanced Callback Usage

#### Progress Tracking
```javascript
scrollTrigger: {
  trigger: ".element",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    console.log("Progress:", self.progress);
    console.log("Direction:", self.direction);
    document.querySelector(".progress-bar").style.width = `${self.progress * 100}%`;
  }
}
```

#### Lifecycle Callbacks
```javascript
scrollTrigger: {
  trigger: ".element",
  onEnter: () => console.log("Entered"),
  onLeave: () => console.log("Left"),
  onEnterBack: () => console.log("Entered back"),
  onLeaveBack: () => console.log("Left back"),
  onRefresh: () => console.log("Refreshed"),
  onUpdate: (self) => console.log("Updated:", self.progress)
}
```

### Velocity-Based Animations

#### Skew on Scroll Velocity
```javascript
gsap.to(".skew-element", {
  skewY: 5,
  ease: "none",
  scrollTrigger: {
    trigger: ".skew-container",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    onUpdate: (self) => {
      const velocity = self.getVelocity() / 300;
      gsap.to(".skew-element", {
        skewY: velocity,
        overwrite: true,
        duration: 0.1
      });
    }
  }
});
```

---

## 6. Community Resources

### Official Documentation
- **Main Docs**: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **Getting Started**: https://gsap.com/get-started/
- **Installation Helper**: https://gsap.com/install/

### Official Resources Page
- **Tips & Tricks**: https://gsap.com/resources/
- **Mistakes to Avoid**: https://gsap.com/resources/st-mistakes/
- **Demos**: https://gsap.com/resources/demos/
- **Cheatsheet**: https://gsap.com/resources/cheatsheet/

### Community Forums
- **GSAP Forums**: https://gsap.com/community/forums/
- **Showcase**: https://gsap.com/showcase/

### Learning Resources

#### Video Tutorials
- **Introducing ScrollTrigger** (GSAP Official) - 21 minutes
- **Learn GSAP for Webflow** (GSAP Official) - 1 hour
- **Easy React Animation with useGSAP()** (GSAP Official) - 12 minutes
- **Creative Coding Club** - 250+ premium GSAP lessons
- **Mastering Web Animation** - Comprehensive course on motion principles

#### YouTube Channels
- **GSAP Official**: https://www.youtube.com/@GSAP
- **PIXEL PERFECT**: GSAP ScrollTrigger Masterclass series (2025)
- **Codegrid**: Next.js Scroll Animation tutorials
- **Web Bae**: GSAP + Webflow tutorials

#### Community Creators
- **Cassie Evans**: GSAP tutorials and demos
- **Aron (Webflow)**: GSAP for Webflow developers
- **Osmo**: Ready-made effects and components

### CodePen Collections
Search for inspiration:
- [GSAP ScrollTrigger on CodePen](https://codepen.io/search/pens?q=gsap+scrolltrigger)
- [GreenSock's Profile](https://codepen.io/GreenSock/)

### Free Community Resources
- **Digidop Blog**: GSAP learning tips and tutorials
- **Slater.app**: GSAP integration for Webflow

---

## 7. Framework-Specific Integration

### React Integration

#### Using `@gsap/react` Package
```bash
npm install gsap @gsap/react
```

```javascript
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

function ScrollAnimation() {
  const container = useRef();

  useGSAP(() => {
    // Safe to use refs here
    gsap.from(".box", {
      scrollTrigger: {
        trigger: ".box",
        start: "top 80%",
        scrub: true
      },
      y: 100
    });
  }, { scope: container }); // Scope for cleanup

  return <div ref={container} className="box">Animate me</div>;
}
```

#### Handling Route Changes
```javascript
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

useEffect(() => {
  // Kill all ScrollTriggers on route change
  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, [pathname]);

// Refresh after route transition
useEffect(() => {
  ScrollTrigger.refresh();
}, [pathname]);
```

### Next.js Integration

#### App Router Setup
**`"use client"` Directive Required**

```javascript
// app/components/scroll-animation.tsx
"use client";

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const container = useRef();

  useGSAP(() => {
    const triggers = ScrollTrigger.getAll();

    gsap.from(".animate-on-scroll", {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });

    return () => {
      // Cleanup
      triggers.forEach(t => t.kill());
    };
  }, { scope: container });

  return (
    <div ref={container}>
      <div className="animate-on-scroll">Item 1</div>
      <div className="animate-on-scroll">Item 2</div>
    </div>
  );
}
```

#### Dynamic Imports for Performance
```javascript
import dynamic from 'next/dynamic';

const ScrollAnimation = dynamic(
  () => import('@/components/ScrollAnimation'),
  { ssr: false } // Only load on client
);
```

#### Centralized GSAP Config (Recommended)
**`lib/gsapConfig.ts`**
```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default gsap;
```

**Usage in components:**
```javascript
import gsap from '@/lib/gsapConfig';

// No need to register plugins again
```

### Vue Integration

#### Composition API
```javascript
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(".item", {
      y: 50,
      scrollTrigger: {
        trigger: container.value,
        start: "top 80%"
      }
    });
  }, container.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div ref="container">
    <div class="item">Item</div>
  </div>
</template>
```

### Svelte Integration

#### Using Actions (Recommended Pattern)
```javascript
// actions/gsapAnimate.js
export function gsapAnimate(node, options) {
  gsap.registerPlugin(ScrollTrigger);

  const { type = 'from', scrollTrigger = {}, ...gsapOptions } = options;
  gsapOptions.scrollTrigger = {
    trigger: node,
    ...scrollTrigger
  };

  gsap[type](node, gsapOptions);

  return {
    destroy() {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  };
}
```

**Usage:**
```svelte
<script>
  import { gsapAnimate } from './actions/gsapAnimate';
</script>

<div use:gsapAnimate={{
  type: 'from',
  y: 50,
  opacity: 0,
  scrollTrigger: {
    start: 'top 80%'
  }
}}>
  Animate me!
</div>
```

---

## Quick Reference: ScrollTrigger Properties

### Essential Properties

| Property | Type | Description |
|----------|------|-------------|
| `trigger` | Element/String | Element that triggers the animation |
| `start` | String/Function | When animation starts (default: "top bottom") |
| `end` | String/Function | When animation ends |
| `scrub` | Boolean/Number | Link animation to scrollbar |
| `pin` | Boolean/String/Element | Pin element during animation |
| `markers` | Boolean | Show debug markers |

### Toggle Actions

Format: `"onEnter onLeave onEnterBack onLeaveBack"`

Values: `play`, `pause`, `resume`, `reverse`, `reset`, `none`, `restart`, `complete`

```javascript
toggleActions: "play reverse play reverse" // Play on enter, reverse on leave, etc.
```

### Callbacks

| Callback | When Fires |
|----------|------------|
| `onEnter` | Trigger enters viewport scrolling forward |
| `onLeave` | Trigger leaves viewport scrolling forward |
| `onEnterBack` | Trigger enters viewport scrolling backward |
| `onLeaveBack` | Trigger leaves viewport scrolling backward |
| `onUpdate` | Every update (scroll event) |
| `onRefresh` | After refresh/recalculation |
| `onInit` | When ScrollTrigger initializes |
| `onScrubComplete` | When scrub animation completes |

### Utility Methods

```javascript
// Get all ScrollTriggers
ScrollTrigger.getAll()

// Get by ID
ScrollTrigger.getById("my-id")

// Refresh all
ScrollTrigger.refresh()

// Kill all
ScrollTrigger.getAll().forEach(st => st.kill())

// Clear scroll memory
ScrollTrigger.clearScrollMemory()

// Batch animation
ScrollTrigger.batch(".elements", { onEnter: batch => ... })
```

---

## Performance Checklist

Before deploying ScrollTrigger animations:

- [ ] Using GPU-accelerated properties (`x`, `y`, `scale`, `opacity`)
- [ ] Avoided layout thrashing properties (`top`, `left`, etc.)
- [ ] Using `gsap.context()` for proper cleanup in frameworks
- [ ] Using `ScrollTrigger.batch()` for multiple similar elements
- [ ] Removed markers in production
- [ ] Tested on mobile devices
- [ ] Using `matchMedia()` for responsive behavior
- [ ] Using function-based values for dynamic calculations
- [ ] Registered ScrollTrigger plugin
- [ ] Tested with route changes (SPA)

---

## Troubleshooting Guide

### Animation Not Firing
1. Check if plugin is registered
2. Verify trigger element exists
3. Enable `markers: true` to see start/end positions
4. Check console for errors
5. Verify scroller is correct (default is viewport)

### Animation Jerky/Laggy
1. Use `scrub: true` for smooth link to scroll
2. Use `normalizeScroll: true` for mobile
3. Reduce number of ScrollTriggers
4. Use GPU-accelerated properties only
5. Consider reducing complexity on mobile

### Wrong Start/End Positions
1. Enable markers to visualize
2. Check for dynamic heights (use function-based values)
3. Verify element is not being animated elsewhere
4. Check for CSS transforms affecting position

### Breaks on Resize
1. Use function-based values for start/end
2. Set `invalidateOnRefresh: true`
3. Use `matchMedia()` for different breakpoint behaviors

### Mobile Issues
1. Use `normalizeScroll: true`
2. Use `matchMedia()` for mobile-specific animations
3. Check `isTouch` for touch-device-specific logic
4. Adjust start/end values for smaller viewports

---

## Version History Summary

| Version | Year | Key Changes |
|---------|------|-------------|
| 3.14 | 2025 | MorphSVG smooth feature, Demo Hub |
| 3.13 | 2024/2025 | GSAP becomes FREE, SplitText rewrite, CSS variable animation |
| 3.12 | 2024 | Improvements to ScrollTrigger |
| 3.11+ | 2023 | `matchMedia()`, `context()`, `useGSAP()` hook |

---

## Contributing & Updates

This document was compiled in February 2026. For the latest updates:
- Check GSAP's official blog: https://gsap.com/blog/
- Follow GSAP on Twitter/X
- Join the GSAP Discord/community forums

---

**Last Updated:** February 4, 2026
**GSAP Version:** 3.14+
**Document Version:** 1.0
