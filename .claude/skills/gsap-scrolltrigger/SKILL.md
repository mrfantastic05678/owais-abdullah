---
name: gsap-scrolltrigger
description: |
  Build production-grade GSAP ScrollTrigger animations with React and Next.js best practices.
  This skill should be used when users ask to create scroll animations, parallax effects,
  horizontal scrolling, pinning, or any GSAP ScrollTrigger implementation. It encodes
  comprehensive domain expertise including GSAP 3.13+ features, performance optimization,
  SSR-safe patterns, and accessibility considerations.
allowed-tools: Read, Write, Edit, Glob, Grep
related-skills:
  - frontend-designer
  - building-nextjs-apps
  - vercel-react-best-practices
  - web-design-guidelines
---

# GSAP ScrollTrigger

Build production-grade scroll-triggered animations using GSAP with React and Next.js. This skill encodes comprehensive domain expertise from official GSAP documentation, community best practices, and real-world implementations.

## What This Skill Does
- Generate scroll-triggered animations (parallax, horizontal scroll, pinning, reveals)
- Create SSR-safe GSAP components for Next.js App Router
- Optimize animations for performance (GPU acceleration, batching, mobile)
- Implement accessibility-compliant animations (reduced motion, ARIA)
- Troubleshoot common ScrollTrigger issues
- Provide framework-specific patterns (React, Next.js, Vue, Svelte)
- Create memorable scroll storytelling experiences with choreography planning

## What This Skill Does NOT Do
- Replace Motion.dev/Framer Motion for UI micro-interactions (use frontend-designer skill)
- Generate 3D animations without Three.js context
- Create animations that break SSR hydration (follows strict SSR-safe patterns)

---

## When to Use This Skill

**Use GSAP ScrollTrigger for:**
- Landing pages and storytelling websites
- Marketing sites with scroll-driven narratives
- Portfolio showcases with scroll-based reveals
- Product pages with animated feature explanations
- Any "scroll storytelling" where scrollbar controls timeline

**Use Motion.dev (frontend-designer skill) for:**
- App UI / Dashboards / Functional components
- Hover states, tap feedback, micro-interactions
- Modal/panel transitions
- Form input animations
- Any "intent-driven" animations

**Example decision:**
```
"This hero section tells a story as you scroll" → Use GSAP (this skill)
"This button needs a hover effect" → Use Motion.dev (frontend-designer)
"The cards should reveal on scroll" → Use GSAP (this skill)
"The nav should slide in on click" → Use Motion.dev (frontend-designer)
```

---

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing GSAP config, component structure, styling patterns |
| **Conversation** | Animation requirements, trigger elements, timing/easing needs |
| **Skill References** | GSAP best practices, common patterns, troubleshooting guides |
| **User Guidelines** | Project-specific animation standards, performance requirements |

Ensure all required context is gathered before implementing.
Only ask user for THEIR specific requirements (domain expertise is in this skill).

---

## Required Clarifications

Ask about USER'S context (not domain knowledge):

1. **Animation Type**: "What type of scroll effect?" (parallax, horizontal scroll, pinning, reveal, batch)
2. **Trigger Elements**: "Which elements trigger the animation?"
3. **Timing**: "When should animations start/end relative to viewport?"
4. **Mobile**: "Any mobile-specific requirements or constraints?"

---

## Workflow

### 1. The Design & Motion Choreography (Planning Phase)

**STOP.** Before writing code, act as a **Lead Motion Designer**. AI models suffer from "distributional convergence" (reverting to safe, boring averages). Fight this by planning the timeline.

#### A. Define the "Epicenter of Design"
What is the ONE core interaction that makes this unforgettable?

**Examples:**
- "A sphere that morphs into the product logo as you scroll"
- "Text that explodes character-by-character, then reforms into a headline"
- "Cards that stack in 3D space as the user explores features"

#### B. Draft the Choreography Script
Plan the scroll percentage timeline explicitly:

```
Example Choreography Script:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0-20% Scroll: Hero text reveals character-by-character
20-40%: Product image pins while features slide in
40-60%: Image rotates 360° and scales to 2.5x
60-80%: Features cascade down with staggered delays
80-100%: CTA emerges with elastic bounce
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### C. Commit to a BOLD Aesthetic Direction
Avoid safe/templated designs. Choose an extreme:

| Tone | Characteristics | Example Techniques |
|------|----------------|-------------------|
| **Brutalist/Raw** | Raw typography, exposed grids, high contrast | Monospace fonts, visible borders, harsh animations |
| **Maximalist Chaos** | Layered elements, vibrant colors, overlapping content | Multiple parallax layers, contrasting gradients |
| **Retro-Futuristic** | Neon, glow effects, synthwave aesthetics | Bloom filters, grid overlays, scan lines |
| **Luxury/Refined** | Subtle motion, generous spacing, premium feel | Slow easing (power2.inOut), smooth transitions |
| **Editorial/Magazine** | Bold typography, asymmetric layouts | Large headlines, offset positioning |

**Typography Rules (from frontend-designer):**
- ❌ **BANNED:** Inter, Roboto, Arial, Open Sans (generic fonts)
- ✅ **REQUIRED:** Distinctive display fonts + clean body type

**Texture & Depth:**
- Avoid flat solid colors
- Use: noise overlays, gradients, blur filters, glassmorphism, grain

### 2. Choose the Animation Pattern

Determine the scroll animation type:

| Pattern | Best For | Key Technique |
|---------|----------|---------------|
| **Basic Reveal** | Content sections entering viewport | Fade + slide with stagger |
| **Parallax** | Creating depth and dimension | Multi-layer different speeds |
| **Horizontal Scroll** | Storytelling across panels | `pin: true` + `xPercent` |
| **Pinning** | Layered narratives | Element fixed while others scroll |
| **Batch Reveal** | Multiple similar items | `ScrollTrigger.batch()` |
| **Text Split** | Dramatic headlines | Character/word staggering |
| **3D Transform** | Immersive experiences | `perspective` + `rotationX/Y` |

### 3. Design Tokens & Variable-First Styling

**CRITICAL:** Never hardcode colors. Use CSS variables from your theme.

```css
/* In your globals.css or theme file */
:root {
  --brand-epicenter: #8b5cf6;
  --brand-secondary: #ec4899;
  --surface-glass: rgba(255, 255, 255, 0.1);
  --accent-vibrant: #22d3ee;
}
```

```typescript
// ❌ WRONG - Hardcoded color
gsap.to(".ball", { backgroundColor: "#8b5cf6" });

// ✅ CORRECT - CSS variable
gsap.to(".ball", { backgroundColor: "var(--brand-epicenter)" });
```

### 4. Generate SSR-Safe Component Code

Follow the Next.js App Router patterns:
```typescript
"use client"

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const container = useRef();

  useGSAP(() => {
    // Animation code here
    // Safe to use refs, SSR-safe
  }, { scope: container });

  return <div ref={container}>...</div>;
}
```

### 5. Apply Performance Best Practices

- Use GPU-accelerated properties (`x`, `y`, `scale`, `opacity`)
- Avoid layout-affecting properties (`top`, `left`, `width`, `height`)
- Add `will-change: transform, opacity` to animating elements
- Use `ScrollTrigger.batch()` for multiple similar elements
- Enable `normalizeScroll` for mobile touch devices

### 6. Ensure Accessibility

- Honor `prefers-reduced-motion` media query
- Use `matchMedia()` to simplify or disable animations
- Maintain semantic markup (no wrapper divs solely for animation)
- Ensure animated content remains perceivable

### 7. Mobile Optimization

- Use `normalizeScroll(true)` for iOS momentum scrolling
- Implement `matchMedia()` breakpoints for mobile-specific behavior
- Adjust start/end values for smaller viewports
- Reduce animation complexity on mobile devices

---

## Motion Micro-Interactions (GSAP Specialties)

While Motion.dev excels at UI micro-interactions (hover, tap, state changes), GSAP ScrollTrigger shines in **scroll-driven micro-interactions**. These are subtle animations tied to scroll position that create delight and guide attention.

### Scrub-Based Micro-Interactions

**Use `scrub: true`** for animations that feel tied to scroll physics:

```typescript
// Subtle scale on scroll - element "breathes" as you scroll
gsap.to(".card", {
  scale: 1.05,
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  scrollTrigger: {
    trigger: ".card",
    start: "top 80%",
    end: "bottom 20%",
    scrub: 1  // Smooth 1-second scrub
  }
});
```

### Physics-Based Easing for Scroll

**Recommended easing functions** for scroll animations:

| Easing | Best For | Effect |
|--------|----------|--------|
| `power1.inOut` | General movement | Smooth, natural feel |
| `power2.inOut` | Luxury/refined | Slower, more graceful |
| `power4.inOut` | Dramatic reveals | Strong build and release |
| `elastic.out(1, 0.5)` | Playful elements | Bouncy, energetic |
| `back.out(1.7)` | Text reveals | Overshoots slightly |
| `none` | Parallax backgrounds | Linear, no easing |

### Character-By-Character Text Animation

Create dramatic headline reveals by animating each character:

```typescript
// Split text into spans (simulate SplitText)
const text = "Scroll to Animate";
const chars = text.split("").map((char, i) =>
  `<span class="char" style="display: inline-block">${char}</span>`
).join("");

element.innerHTML = chars;

// Animate each character
gsap.from(".char", {
  y: 100,
  opacity: 0,
  rotationX: -90,
  stagger: 0.05,
  duration: 0.8,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: element,
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});
```

### Layered Narrative (Pinning)

Use `pin: true` to create layered storytelling:

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".narrative-section",
    start: "top top",
    end: "+=300%",  // Scroll 3x viewport height
    pin: true,
    scrub: 1
  }
});

// Layer 1: Hero image scales down
tl.to(".hero-image", { scale: 0.5, opacity: 0.5 })
  // Layer 2: Features slide in from sides
  .from(".feature-left", { x: -100, opacity: 0 }, "<")
  .from(".feature-right", { x: 100, opacity: 0 }, "<")
  // Layer 3: CTA pops up
  .from(".cta-button", { y: 50, opacity: 0, scale: 0.8 }, "<0.2");
```

### Micro-Interaction Design Principles

1. **Purposeful Motion**: Every animation should have a purpose (guide attention, provide feedback, tell story)
2. **Subtle Over Strong**: Prefer 0.95-1.05 scale over 0.5-2.0 for micro-interactions
3. **Physics Feel**: Use `scrub: true` for "connected to scroll" feel
4. **Ease Matters**: Match easing to brand personality (playful = elastic, luxury = power2)
5. **Performance First**: Use GPU properties only

### Common Micro-Interaction Patterns

| Pattern | Code Example | When to Use |
|---------|--------------|-------------|
| **Scale on Scroll** | `scale: 1.1, scrub: 1` | Cards, images gaining focus |
| **Parallax Float** | `yPercent: -20, scrub: true` | Background elements, depth |
| **Rotation Reveal** | `rotation: 360, scrub: 0.5` | Icons, shapes transforming |
| **Color Shift** | `color: "var(--accent)", scrub: 1` | Brand colors transitioning |
| **Shadow Grow** | `boxShadow: "...", scrub: true` | Elements lifting/pressing |
| **Border Glow** | `borderColor: "var(--glow)", scrub: 1` | Focus states, active items |

---

## Quick Reference: Common Patterns

### Basic Reveal Animation
```typescript
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

### Parallax Effect
```typescript
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

### Horizontal Scroll
```typescript
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

### Batch Reveal (Performance)
```typescript
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

## GSAP 3.13+ Key Features

### All Plugins Are Free (Since Webflow Acquisition)
- SplitText, ScrollSmoother, MorphSVG, MotionPath, DrawSVG, etc.
- No more Club GSAP membership required

### CSS Variable Animation
```typescript
// NEW in 3.13
gsap.to(".target", { color: "var(--my-color)" });
```

### Improved SplitText (3.13 Rewrite)
- 50% smaller file size
- 14 new features (aria-label, autoSplit, onSplit callback)
- Better nesting and word/letter staggering

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Animations not triggering | DOM not ready | Use `useLayoutEffect` or `useGSAP` hook |
| Nested ScrollTriggers fail | Logic conflict | Apply to parent timeline only |
| Mobile address bar issues | Viewport height changes | Use `normalizeScroll()` |
| Too many triggers | Performance bottleneck | Use `ScrollTrigger.batch()` |
| React Router navigation | Triggers persist | Kill triggers on unmount with `gsap.context()` |
| Horizontal scroll breaks | Static end values | Use function-based `end: () => ...` |

---

## Performance Checklist

Before deploying, verify:

- [ ] Using GPU-accelerated properties (`x`, `y`, `scale`, `opacity`)
- [ ] Avoided layout thrashing (`top`, `left`, `width`, `height`)
- [ ] Using `gsap.context()` or `useGSAP()` for cleanup
- [ ] Using `ScrollTrigger.batch()` for multiple elements
- [ ] Removed `markers: true` in production
- [ ] Tested on mobile with `normalizeScroll`
- [ ] Implemented `prefers-reduced-motion` support
- [ ] Registered ScrollTrigger plugin
- [ ] Used function-based values for responsive start/end

---

## Output Checklist

Before delivering GSAP code, verify:

- [ ] Component is SSR-safe (uses "use client" directive)
- [ ] Cleanup implemented (`gsap.context()` revert or `useGSAP`)
- [ ] Performance optimized (GPU properties, batching)
- [ ] Mobile responsive (matchMedia, normalizeScroll)
- [ ] Accessibility compliant (reduced motion support)
- [ ] No hardcoded hex colors (uses CSS variables/theme)
- [ ] TypeScript strict mode compliant
- [ ] Animation purpose aligns with user requirements

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/gsap-research.md` | Original research document with agent-focused patterns |
| `references/gsap-complete-guide.md` | Comprehensive 2024-2026 GSAP guide (1,263 lines) |
| `references/nextjs-patterns.md` | Next.js App Router specific patterns |
| `references/common-patterns.md` | Code templates for common scroll effects |
| `references/creative-patterns.md` | **NEW** - Advanced creative patterns and real-world examples |
| `assets/templates/` | Ready-to-use component templates |
| `assets/examples/FullScrollAnimationWebsite.tsx` | Complete multi-section scroll showcase |
| `assets/examples/ImageRevealShowcase.tsx` | **NEW** - Curtain, circle, slice reveal techniques |
| `assets/examples/Advanced3DShowcase.tsx` | **NEW** - 3D transforms, flips, accordion, tilt |
| `assets/examples/TextAnimationShowcase.tsx` | **NEW** - Character/word animations, counters, marquee |

**For large reference files**, use Grep with these patterns to find relevant sections:

```bash
# Search for specific patterns
grep -n "horizontal scroll" references/gsap-complete-guide.md
grep -n "mobile\|responsive" references/gsap-complete-guide.md
grep -n "performance\|optimization" references/gsap-complete-guide.md

# Search creative patterns for inspiration
grep -n "curtain\|circle\|slice" references/creative-patterns.md
grep -n "3d\|flip\|rotate" references/creative-patterns.md
grep -n "text\|character\|word" references/creative-patterns.md
```

---

## Integration with Other Skills

### frontend-designer (Primary Partner Skill)

**When to use BOTH skills together:**

| Task | Primary Skill | Secondary Skill |
|------|---------------|-----------------|
| Build a landing page with scroll animations | `gsap-scrolltrigger` | `frontend-designer` |
| Design the overall UI/UX system | `frontend-designer` | `gsap-scrolltrigger` |
| Create button hover effects | `frontend-designer` | - |
| Create scroll-triggered parallax | `gsap-scrolltrigger` | - |
| Full page redesign with motion | Use both together | - |

**Combined workflow:**
```
1. Start with frontend-designer for:
   - Design tokens and theme system
   - Overall layout and typography
   - Component architecture
   - Motion.dev UI micro-interactions

2. Then use gsap-scrolltrigger for:
   - Scroll-based storytelling
   - Parallax backgrounds
   - Horizontal scrolling sections
   - Pinned narrative sections
```

### building-nextjs-apps

Use for Next.js-specific patterns:
- App Router file structure
- Server components vs client components
- Route transitions and navigation
- API routes and data fetching

### vercel-react-best-practices

Use for production optimization:
- Bundle size optimization
- Code splitting strategies
- Image optimization patterns
- Lighthouse performance improvements

### web-design-guidelines

Use for compliance checks:
- WCAG accessibility requirements
- ARIA attribute patterns
- Color contrast verification
- Keyboard navigation support

### ux-evaluator

Use to review your scroll animations:
- Visual hierarchy analysis
- Spacing and positioning checks
- Animation timing feedback
- User experience scoring

---

## How to Invoke This Skill

### Direct Invocation (Recommended)
```
/gsap-scrolltrigger
```

### Contextual Triggers
This skill activates when you ask for:
- "Scroll animations" or "scroll-triggered effects"
- "Parallax background" or "parallax scrolling"
- "Horizontal scroll" or "horizontal scrolling"
- "Pinning elements" or "pinned sections"
- "GSAP ScrollTrigger" or "GSAP animations"
- "Scroll storytelling" or "scroll-based narrative"

### Example Commands
```
"Create a parallax hero section with GSAP"
"Add scroll-triggered reveals to my cards"
"Build a horizontal scrolling showcase"
"Make this image pin and rotate on scroll"
```
