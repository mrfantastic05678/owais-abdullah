# Comprehensive GSAP Guide: Single Source of Truth for Scroll-Triggered UIs

This document serves as a complete, self-contained resource on the GreenSock Animation Platform (GSAP), with a focus on its use for creating high-performance, scroll-triggered user interfaces (UIs). It draws from official documentation, community forums, tutorials, and real-world examples up to early 2026. The content is structured to enable any AI agent or developer to build robust GSAP-powered animations, emphasizing the ScrollTrigger plugin for scroll-based interactions. This "single source of truth" includes core concepts, best practices, templates/boilerplates, common problems/solutions, and integration tips.

## 1. GSAP Overview
GSAP is a robust JavaScript library for creating high-performance animations on the web. It's framework-agnostic, working seamlessly with HTML, SVG, Canvas, React, Vue, Next.js, and more. Key advantages include:
- **Performance**: Animates anything JavaScript can touch, with sub-pixel accuracy and hardware acceleration.
- **Flexibility**: Handles tweens, timelines, easing, and plugins like ScrollTrigger for scroll-driven effects.
- **Size**: Core is ~27KB gzipped; plugins add minimal overhead.

### Installation
- **CDN**: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>`
- **npm**: `npm install gsap`
- Import: `import { gsap } from "gsap";`

Register plugins: `gsap.registerPlugin(ScrollTrigger);`

### Basic Usage
GSAP revolves around **Tweens** (single animations) and **Timelines** (sequences of tweens).
- **Tween Example**: `gsap.to(".box", { x: 100, duration: 1, ease: "power2.out" });` – Moves an element 100px right over 1 second with easing.
- **Timeline Example**:
  ```
  const tl = gsap.timeline();
  tl.to(".box1", { x: 200, duration: 1 })
    .to(".box2", { y: 150, duration: 1, delay: 0.5 });
  ```
  Timelines allow nesting, labels (e.g., `tl.addLabel("midpoint", 1);`), and controls like `tl.play()`, `tl.pause()`, or `tl.reverse()`.

GSAP supports targets like classes, IDs, variables, or arrays. Use `gsap.from()` for entrance animations, `gsap.fromTo()` for custom start/end states, and `gsap.set()` for instant property changes.

## 2. ScrollTrigger Plugin: Core for Scroll-Triggered UIs
ScrollTrigger (introduced in GSAP 3.3.0) ties animations to scroll position, enabling scrubbing, pinning, snapping, and callbacks. It's ideal for parallax, reveals, and interactive UIs.

### Setup and Key Features
- **Basic ScrollTrigger**: 
  ```
  gsap.to(".box", {
    x: 500,
    scrollTrigger: { trigger: ".box", start: "top center", end: "bottom top", scrub: true }
  });
  ```
  - **Trigger**: Element whose position triggers the animation (e.g., selector or DOM node).
  - **Start/End**: Positions like "top center" (trigger's top hits viewport center) or functions for dynamic values.
  - **Scrub**: Links animation progress to scroll (true for direct, number for smoothed lag).

- **Pinning**: `pin: true` fixes the trigger in place during the animation. Use `pinSpacing: "margin"` to avoid layout shifts. Avoid animating pinned elements directly; nest them inside.
- **Callbacks**: `onEnter`, `onLeave`, `onUpdate` for events. `toggleActions: "play pause resume reset"` controls playback.
- **Advanced**: `endTrigger` for separate end elements, `anticipatePin` for fast scrolls, `preventOverlaps` to force prior animations to complete.

### Methods
| Method | Description | Example |
|--------|-------------|---------|
| `refresh()` | Recalculates positions (auto on resize). | `ScrollTrigger.refresh();` |
| `enable()/disable()` | Toggles the trigger. | `trigger.enable();` |
| `kill()` | Removes the trigger and cleans up. | `trigger.kill();` |
| `getVelocity()` | Returns scroll speed. | `ScrollTrigger.getVelocity();` |
| `batch()` | Groups triggers for efficiency. | `ScrollTrigger.batch(".elements", { onEnter: batch => gsap.to(batch, { opacity: 1 }) });` |

## 3. Best Practices for GSAP and ScrollTrigger
From community insights and tutorials (2025 updates), here are distilled best practices for performance, organization, and scroll-triggered UIs.

### Performance Optimization
- **Animate Transforms/Opacity**: Prefer `x`, `y`, `scale`, `rotation`, `opacity` over layout-affecting properties like `top`, `left`, `width` (causes reflows).
- **will-change: transform**: Add to animated elements for GPU acceleration.
- **Avoid Filters in Safari**: They tank performance; use alternatives.
- **Throttle Refreshes**: ScrollTrigger debounces scrolls; use `invalidateOnRefresh: true` for dynamic values.
- **Custom Scrollers**: For libraries like Locomotive Scroll, set `scroller: ".smooth-scroll"`.
- **Mobile/Touch**: Use `normalizeScroll(true)` to handle iOS momentum scrolling issues.
- **Cleanup**: In frameworks, use `gsap.context()` or hooks like `useGSAP()` to revert/kill animations on unmount.

### Code Organization
- **Use Timelines for Sequencing**: Chain tweens on timelines instead of delays for better control.
- **Nesting and Modularity**: Nest timelines for reusable modules.
- **Labels and Seeking**: Mark key points with `addLabel()` for easy navigation.
- **Function-Based Values**: For responsiveness, e.g., `start: () => "top " + window.innerHeight * 0.5`.
- **matchMedia**: Handle breakpoints: `gsap.matchMedia().add("(max-width: 768px)", () => { /* mobile animation */ });`.
- **Ease Customization**: Use CustomEase for tailored feels (e.g., delayed elastic out).
- **Avoid Over-Animation**: Keep UIs intuitive; ensure accessibility (e.g., reduced motion via `@media (prefers-reduced-motion)`).

### ScrollTrigger-Specific
- **Order Matters**: Create triggers top-to-bottom; use `refreshPriority` if needed.
- **Debug with Markers**: Add `markers: true` to visualize start/end.
- **Responsive Pinning**: Use function-based `end` for horizontal scrolls that adapt to viewport.
- **Integrate with Smooth Scrolling**: Pair with ScrollSmoother; initialize in `useLayoutEffect` to fix fixed element issues.

## 4. Templates and Boilerplates
GSAP thrives on CodePen for demos. Fork these for quick starts.

| Template/Boilerplate | Description | Link/Source |
|----------------------|-------------|-------------|
| GSAP Starter Pen | Basic HTML/JS setup with GSAP loaded. | [CodePen GSAP Starter](https://codepen.io/GreenSock/pen/aYYOdN) |
| ScrollTrigger Demo | Simple scroll scrub with pinning. | Fork from GSAP docs examples. |
| React/Next.js Boilerplate | useGSAP hook for cleanup; includes matchMedia. | [StackBlitz GSAP React Starters](https://stackblitz.com/@gsap-dev/collections/gsap-react-starters) |
| Webflow GSAP Template | Pre-built effects like scramble text, inertia sliders. | Free from OFF+BRAND (2025). |
| Astro GSAP Boilerplate | Handles bonus plugins via CDN/public folder. | GitHub repo for Vercel deployment. |
| Parallax CodePen | Responsive parallax with Bezier paths. | CapCut/GSAP templates. |

For frameworks:
- **React**: Use `useGSAP()` for context-based animations.
- **Next.js**: Client components for animations; avoid "use client" on server-rendered parts for SEO.
- **Webflow**: Built-in GSAP timeline editor (v1 as of 2025); export for custom tweaks.

## 5. Real-World Problems and Solutions
Common issues from forums, Stack Overflow, and X discussions (2025-2026).

| Problem | Cause | Solution |
|---------|-------|----------|
| Animations not triggering on load/mobile. | DOM not ready; smooth scrollers like Locomotive interfere. | Use `ScrollTrigger.update()` on scroll; refresh after DOM load. For Locomotive, call `refresh()` on resize/scroll. |
| Pinned elements disappear/jump. | Strict mode in React; incorrect spacer creation. | Use `gsap.context()` in `useLayoutEffect`; single ScrollTrigger for pinning. |
| Horizontal scroll pinning fails responsively. | Static end values; overflow issues. | Function-based `end`; set `overflow-x: hidden` on body/container. |
| CPU spikes/crashes in Next.js. | Race conditions on navigation. | Add safety checks in ScrollTrigger code; kill triggers on unmount. |
| Animations jump on resize/mobile. | Address bar shifts viewport; no invalidation. | `invalidateOnRefresh: true`; debounce resizes. |
| Nested ScrollTriggers fail. | Logic conflict; can't scrub nested timelines properly. | Apply ScrollTrigger to parent timeline only. |
| Vite/Next build issues. | Plugin registration; scroll not detected. | Use StackBlitz templates; ensure window scroll ref. |
| Curved path tracking unresponsive. | Static SVGs break on resize. | Dynamic Bezier with GSAP motionPath; recalculate on resize. |
| Webflow animations break scaling. | Hardcoded values; no media queries. | Use matchMedia; custom events for breakpoints. |

## 6. Building Scroll-Triggered UIs: Agent Skill Application
To create a GSAP scroll-triggered UI:
1. **Plan**: Sketch triggers, pins, and sequences.
2. **Setup**: Register plugins; use timelines for modularity.
3. **Implement**: Add ScrollTrigger with scrub/pin; test with markers.
4. **Optimize**: Apply best practices; handle resizes with matchMedia.
5. **Debug**: Use `refresh()`; check for common pitfalls.
6. **Enhance**: Add CustomEase for feel; integrate with frameworks.

Example: 3D Card Scroll (from X).
```
gsap.set(".cards", { y: "100vh" }); // Start off-screen
const tlMove = gsap.timeline({ scrollTrigger: { trigger: ".section", pin: true, scrub: 1, end: "+=300vh" } });
tlMove.to(".cards", { y: 0, stagger: 0.5, ease: "power2.out" });

const tlRotate = gsap.timeline({ scrollTrigger: { ... } }); // Delayed 3D rotate
tlRotate.to(".card1", { rotationY: 45 }, "-=1"); // Custom timing
```

This guide equips agents to generate production-ready GSAP code for dynamic, engaging UIs. For updates, reference greensock.com/docs.



# Addendum to GSAP Guide: Missed Elements and 2025-2026 Updates

Upon review and fresh research (as of February 2026), the original guide was comprehensive but missed several key updates, features, and resources from late 2024 through 2025. GSAP evolved significantly due to Webflow's acquisition in October 2024, making all bonus plugins free and integrating GSAP natively into Webflow. Below, I outline the misses, integrate them into the structure of the original guide, and provide net-new sections. This keeps it as a "single source of truth" for agents building scroll-triggered UIs. Changes are bolded for clarity.

## 1. GSAP Overview (Updates)
- **Version History**: The guide referenced GSAP 3.12.5 (2023). Key releases since:
  - **3.13 (April 2025)**: SplitText plugin rewritten (50% smaller, 14 new features like better nesting, word/letter staggering). New ability to animate to CSS variables (e.g., `gsap.to(".box", { "--my-var": 100 });`). All bonus plugins (e.g., ScrollSmoother, MorphSVG) became 100% free, sponsored by Webflow.
  - **3.14 (December 2025)**: MorphSVG gains "smooth" feature for fluid path morphing. New GSAP Demo Hub for browsing examples. Minor fixes like better resize handling in ScrollTrigger.
- **Licensing**: Fully free for all uses, including commercial. No more "Club GSAP" paywall.
- **Missed Plugins**: The guide focused on ScrollTrigger but omitted complementary ones for UIs:
  - **ScrollSmoother**: Wraps content for parallax-like smooth scrolling (requires ScrollTrigger). Example: `ScrollSmoother.create({ smooth: 1, effects: true });` – Handles iOS issues better.
  - **Flip**: State-based animations (e.g., layout changes without recalculating positions). Ideal for responsive UIs.
  - **Observer**: Non-scroll event listener for wheel/touch/pointer; combines with ScrollTrigger for hybrid interactions (e.g., snap on wheel up/down).
  - **MotionPath**: Animate along SVG/Bezier paths, responsive with function-based values.

## 2. ScrollTrigger Plugin (Updates)
- **New Features**: Better integration with CSS variables for dynamic triggers. Enhanced `normalizeScroll` for touch devices. In 3.14, improved snapping precision and overlap prevention.
- **Webflow Native Support**: Since July 2025, Webflow Designer includes GSAP timelines with ScrollTrigger-like behavior (no code needed). Supports breakpoints, prefers-reduced-motion, and page scoping. New actions: Lottie (Dec 2025) for JSON animations, Set for instant changes, Spline for visual easing.

## 3. Best Practices (Additions)
- **Accessibility**: Honor `@media (prefers-reduced-motion: reduce)` by pausing or simplifying animations (e.g., via `gsap.matchMedia()`). Webflow's integration auto-handles this.
- **Responsive Design**: Use breakpoints in Webflow or `gsap.matchMedia()` for device-specific tweaks. For curved paths, interpolate sizes dynamically on resize.
- **Common Mistakes to Avoid** (from official resources):
  - Using `from()` with logic issues (e.g., overlapping starts causing jumps); use `fromTo()` or `immediateRender: false`.
  - Nesting ScrollTriggers in timelines (logically impossible; apply to parent only).
  - Animating non-GPU properties (e.g., `top` instead of `y`).
  - Forgetting `will-change: transform` or not using `xPercent/yPercent` for relative positioning.
- **Performance in 2025+**: Combine with Observer for snap delays (e.g., wait before snapping sections). Use `ScrollTrigger.observe()` for touch/wheel to prevent jank.
- **Debugging**: New GSAP Demo Hub (launched Dec 2025) for examples. Enable `markers` and use GSDevTools plugin for timeline visualization.

## 4. Templates and Boilerplates (Additions)
- **Webflow-Specific**: Pre-made GSAP collections from Flowbase/Codrops (2025): Text hovers, reveals, highlights. One-click add to projects.
- **Demo Hub**: Official GSAP site (gsap.com/demos) with 50+ searchable demos, including framework-specific (React, Vue) and community ones.
- **YouTube Tutorials**: Updated 2025-2026 guides like "Ultimate Guide to Scroll Animation" (debugging, pins, scrubs) and "GSAP Scroll Effects: Card Stacking" for horizontal/vertical UIs.
- **Real-World Sites**: Awwwards-worthy examples using GSAP for card stacking, curved paths (e.g., Lando Norris site demo).

## 5. Real-World Problems and Solutions (Additions)
New issues from 2025-2026 forums/Webflow:

| Problem | Cause | Solution |
|---------|-------|----------|
| Webflow GSAP bugs (e.g., unreliable triggers). | Early 2025 rollout issues. | Update to latest (post-Dec 2025); use custom code fallbacks or report via Webflow help. |
| `gsap.from()` delays in Next.js. | SSR hydration mismatches. | Wrap in `useLayoutEffect`; use `useGSAP()` hook. |
| Scroll snap with delays. | No built-in wait for animations. | Combine ScrollTrigger with Observer: Use `onUp/onDown` callbacks to `gotoPanel` after delay. |
| FOUC (Flash of Unstyled Content) in GSAP. | Animations load after DOM. | Set initial states with `gsap.set()` before timelines; use CSS for hidden starts. |
| Integration with Lottie/Spline in Webflow. | New actions (Dec 2025). | Use native Set/Lottie actions in timelines; no custom code needed. |
| Path morphing jank. | Non-smooth paths in MorphSVG. | Enable new "smooth" feature in 3.14. |

- **General Troubleshooting**: From GSAP GitHub issues (2025+): SVG inconsistencies fixed in 3.13; better error logging in GSDevTools.

## 7. New Section: Community and Resources
- **Forums**: GSAP forums (gsap.com/community) for Q&A; active in 2026 with Webflow threads.
- **GitHub**: greensock/GSAP for issues/changelogs.
- **Learning**: Official docs (gsap.com/docs/v3/), YouTube (GreenSock channel), Codrops tutorials.
- **AI Integration**: Use GSAP with AI tools for dynamic UIs (e.g., generate paths via ML, animate with ScrollTrigger).

## 8. New Section: Building Advanced Scroll-Triggered UIs
- **Hybrid Example**: Card stacking with horizontal scroll (2026 trend):
  ```
  gsap.timeline({
    scrollTrigger: { trigger: ".cards", pin: true, scrub: 1, snap: 1 / (sections.length - 1), end: () => "+=" + document.querySelector(".cards").offsetWidth }
  }).to(".cards", { xPercent: -100 * (sections.length - 1), ease: "none" });
  ```
  Add Observer for snap delays: `Observer.create({ onDown: () => gsap.to(window, {scrollTo: {y: "+=100vh"}}) });`.
- **Agent Tip**: For AI-generated code, validate with `gsap.context()` for cleanup; test on mobile with `normalizeScroll`.

This addresses all misses. The guide is now fully updated for 2026, enabling agents to create cutting-edge scroll UIs. For live demos, check gsap.com/demos.