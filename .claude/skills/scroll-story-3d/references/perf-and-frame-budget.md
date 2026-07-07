# Performance & Frame Budget

## Why canvas frame-sequence beats raw `<video>` scrubbing

Setting `video.currentTime` on scroll (the naive "Apple-style" approach) is
what most tutorials show, but it stutters in production:

- Browsers optimize video decoders for forward playback, not random seeks;
  scrubbing forces repeated keyframe seeks and drops frames, worse on
  mid/low-end mobile.
- Behavior is inconsistent across engines (Firefox vs Safari vs Chromium
  handle seek-driven decode differently — same code stutters on one, not
  the other).
- iOS Safari has historically fought programmatic video control (autoplay/
  inline restrictions, seek throttling).

The reliable pattern (used by Apple's own product pages and most
professional "scroll story" sites): **pre-extract the video into a still
image sequence, draw the correct frame to a `<canvas>` per scroll position.**
Decoding a still image is cheap and consistent; there's no seek penalty.
Video only wins on raw file size, but frame sequences compress well (WebP)
and can be frame-budgeted to stay small — see below.

Use `scripts/extract-frames.sh` for this. Treat `<video>` scrubbing as a
fallback mode only (simpler to wire up, acceptable for low-stakes sections),
not the default.

## Frame budget

- Heuristic: `maxFrames ≈ floor(scrollDistancePx / 2)`. Going higher wastes
  bandwidth without a visible smoothness gain — the user can't perceive finer
  granularity than roughly one frame per 2px of scroll.
- Default to **40–80 frames** for a typical single-viewport-height pinned
  section (matches most real-world scroll-story implementations). Only go
  higher if the pinned scroll distance is unusually long (multi-viewport pin).
- Size images at the container's CSS width, not viewport width, and multiply
  by device pixel ratio for a `@2x` set (`extract-frames.sh --dpr2`). Serving
  3x-native-resolution frames to a 1x display wastes bandwidth for zero gain.
- Prefer WebP over PNG/JPEG: same visual quality at a fraction of the size
  (real sequences have gone from ~15MB in PNG down to a few MB in WebP).
- Rule of thumb total budget: keep the whole sequence under ~3–5MB on
  desktop-targeted sections, less on mobile-first ones. If ffmpeg output
  exceeds that, cut frame count before dropping quality further.

## Loading strategy

1. **First frame is the LCP candidate.** Load it eagerly, at high priority
   (`fetchpriority="high"`, no `loading="lazy"`), same as any hero image.
2. **Preload the rest in the background** after first paint, not blocking
   interactivity — kick off loading once the section scrolls near the
   viewport (e.g. via `IntersectionObserver` on the section wrapper) rather
   than on page load for below-the-fold placements.
3. **Decode off the main thread where possible.** Use `createImageBitmap()`
   to decode each frame into an `ImageBitmap`, not `new Image()` + draw,
   which decodes synchronously on first draw and can jank the very scroll
   interaction you're trying to make smooth.
4. **Release memory you don't need.** Don't keep every decoded bitmap pinned
   in memory forever on very long sequences — for the frame counts this
   skill targets (40–80) it's fine to hold them all, but don't scale the
   frame count up without reconsidering this.
5. Always render frame draws inside `requestAnimationFrame`, driven by a
   scroll-position read, not a `scroll` event handler that draws directly
   (batches work to the browser's paint cycle, avoids redundant draws).

## Accessibility: `prefers-reduced-motion`

Users with `prefers-reduced-motion: reduce` should get a static, calm-state
image instead of the scrubbed sequence — no pinning, no motion, same content.
Check this once on init and branch the whole engine, don't just disable
easing. See `assets/standalone/scroll-story.js` for the implementation.

## Targets to test against

- LCP (first frame / hero) ≤ 2.5s on throttled mobile.
- No dropped-frame stalls > ~100ms during a continuous scroll (watch for
  jank in DevTools Performance panel while scrolling the pinned section).
- Total transfer for the sequence within the budget above.
- Test with CPU + network throttling in DevTools, not just on a dev machine.
