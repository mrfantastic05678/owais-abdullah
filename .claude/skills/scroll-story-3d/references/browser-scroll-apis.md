# Scroll-Driving APIs — Current State

Verify current status via Context7 (`/mdn/content`) before relying on this —
browser support shifts and this file can go stale.

## Native CSS scroll-driven animations (`scroll-timeline` / `view-timeline` / `animation-timeline`)

- Lets a `@keyframes` animation progress by scroll position instead of time,
  with zero JS and no main-thread scroll listener — the browser can run it
  off the main thread, so it's cheaper and janks less than any JS approach.
- As of this research: solid in Chromium; Safari has shipped support in
  recent versions; Firefox has shipped it in Nightly but it has not been
  universally on by default across all release channels — treat it as
  **progressive enhancement, not the only implementation**, until you've
  confirmed current support for your actual target browsers.
- Feature-detect with `@supports (animation-timeline: scroll())`.
- Good fit for simple property animations (opacity/transform fades tied to
  scroll) — not a good fit by itself for driving canvas-frame selection,
  which needs a JS callback per frame anyway. Use it for the text-overlay
  fades/slides, and JS for the canvas scrubbing.

## JS fallback: `requestAnimationFrame` + scroll position, not scroll events directly

- Don't run per-frame draw logic inside a raw `scroll` event handler — reads
  happen at uncontrolled frequency and can pile up faster than the browser
  paints. Read scroll position in the handler (cheap), flag "dirty", and do
  the actual canvas draw inside the next `requestAnimationFrame`.
- `IntersectionObserver` is the right tool for "has the section entered/left
  the viewport" (start/stop the rAF loop, lazy-init the frame sequence) —
  it is not a continuous-progress API, so it can't replace the rAF scroll
  read for frame selection.
- This skill's engine (`assets/standalone/scroll-story.js`) implements this
  pattern directly, zero dependencies. No polyfill package is bundled —
  keep it that way; a hand-rolled ~100-line engine is more maintainable and
  debuggable than pulling in a scroll-timeline polyfill for this use case.

## GSAP ScrollTrigger — optional enhancement, not the default

If the user already has GSAP in their stack (common in agency/marketing
sites), ScrollTrigger's `pin` + `scrub` options are a reasonable swap-in for
the pinning/progress-tracking half of the engine (it still leaves canvas
frame drawing to your own `onUpdate` callback). Pattern:

```js
gsap.timeline({
  scrollTrigger: {
    trigger: '.scroll-story',
    start: 'top top',
    end: '+=3000',   // pin distance = total scrubbable scroll range
    scrub: true,       // true = 1:1 with scroll, or a number of seconds of lag
    pin: true,
  },
}).to({ frame: 0 }, {
  frame: TOTAL_FRAMES - 1,
  ease: 'none',
  onUpdate: drawCurrentFrame, // your canvas draw function, reading `this.targets()[0].frame`
});
```

Don't reach for this by default — it's an extra ~50-70KB dependency for
something the vanilla engine already does. Only wire it in if asked, or if
the project already ships GSAP elsewhere.

## Always confirm before implementing

Query Context7 (`/mdn/content` or `/greensock/gsap-skills`) for the current
API shape of whichever of the above you're about to use, and Tavily for
current browser support tables, if the target browser matrix matters for the
project (e.g. a client specifically cares about older Firefox/Safari). Don't
assume this file's snapshot is still accurate — CSS scroll-driven animations
in particular are an actively evolving spec.
