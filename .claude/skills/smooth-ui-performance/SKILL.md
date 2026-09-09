---
name: smooth-ui-performance
description: Production-grade standards for 60FPS/120FPS smooth UI performance, mobile touch responsiveness, GPU layer compositing, and animation lifecycle management in Next.js and React applications.
---

# Smooth UI Performance & 60FPS Engineering Standards

This skill documents critical engineering rules to keep web applications, marketing homepages, and portfolio sites silky smooth on both mobile and desktop.

## 1. Smooth Scrolling & Touch Event Isolation (Lenis / GSAP)
- **Never Hijack Native Mobile Touch Scrolling:**
  Mobile operating systems (iOS Safari, Android Chrome) implement hardware-accelerated momentum deceleration with rubber-banding at 60Hz/120Hz (ProMotion).
  Intercepting touch events in JavaScript (touchMultiplier > 0, smoothTouch: true) creates noticeable input lag, jitter, and excessive battery consumption.
  - **Rule:** Check window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 768. If false, bypass custom smooth scroll libraries and let the browser's native touch engine handle scrolling.
- **RequestAnimationFrame Timing Argument:**
  equestAnimationFrame((time) => lenis.raf(time)) already passes the high-resolution timestamp in **milliseconds**. Never multiply by 1000 (	ime * 1000), which injects microsecond values and corrupts velocity/momentum calculations.

## 2. GPU Compositor Layers & CSS Backdrop Filter Blur
- **Backdrop-Blur on Moving Elements (ackdrop-blur-*):**
  Applying ackdrop-filter: blur(...) to continuously animating elements (such as infinite marquee tracks, sliders, or floating particles) forces the GPU compositor to take a framebuffer snapshot, run a 2D Gaussian blur pass, and blend it behind each element on **every single animation frame**.
  - **Impact:** 100+ moving cards with ackdrop-blur-sm will instantly drop frame rates from 60 FPS to 20-30 FPS.
  - **Rule:** Use opaque or semi-opaque dark card backgrounds (g-card border border-border/80) on continuously moving or looping elements. Reserve ackdrop-filter for fixed overlays (like sticky modals or the navigation header).
- **Hardware Layer Promotion:**
  Use will-change-transform selectively on root scrolling tracks or marquee containers to promote them to dedicated GPU composite layers without incurring main-thread layout repaints.

## 3. WebGL / Canvas Lifecycle & Off-Screen Unmounting
- **Pause/Unmount Off-Screen 3D & Shaders:**
  Continuous WebGL simulation loops (e.g. Three.js, React Three Fiber, fluid distortion shaders) consume dedicated GPU pipelines and block the main thread.
  - **Rule:** Wrap heavy Canvas components in an IntersectionObserver. When the parent section leaves the viewport (e.g. user scrolls past Hero), unmount or pause the render loop (nimId = null).
  - **Rule:** Never mount heavy WebGL shaders on mobile screens (< 1024px or pointer: coarse).

## 4. Scroll Scrubbing Decoupling from React State
- **Decouple Continuous Progress from React State:**
  When rendering frame sequences, progress bars, or canvas scrubbers:
  - **Anti-Pattern:** Calling setProgress(progress * 100) inside equestAnimationFrame on scroll. This forces React to trigger virtual DOM reconciliation, diffing, and re-rendering 60 times a second.
  - **Pattern:** Update the <canvas> or DOM elements directly via refs (drawBitmap, element.style.transform). Only trigger a React setState when discrete milestones or step indices change (e.g. ctiveAct: 0 -> 1 -> 2).

## 5. Responsive Component Mounting & Mobile Canvas Fallbacks
- **Avoid Duplicate Hidden Mounts:**
  Never render duplicate heavy components simultaneously with Tailwind classes like hidden md:block and lock md:hidden if they instantiate JS controllers, event listeners, or rAF loops. Instead, render a single responsive component that adapts dynamically.
- **Bypass Pixelation / Canvas Effects on Touch Screens:**
  Complex pixelation filters, particle effects, or canvas image decoders that re-fetch image buffers should be bypassed on mobile devices in favor of native Next.js <Image> tags.
