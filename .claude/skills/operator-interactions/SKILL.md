---
name: operator-interactions
description: |
  Ten hand-built animated button styles plus a labeled cursor-follower
  system, all designed for the "Operator" theme (dark, sharp radii,
  blue/green dual-accent, mono-labeled console voice) originally built for
  owaisabdullah.dev. Each button reuses a motif already established
  elsewhere on that site (status-dot pulse, char-scatter text, canvas
  pixel-reveal, terminal brackets) instead of a generic Dribbble hover, so
  they read as one coherent interaction language rather than a random
  effects grab-bag. This skill should be used when a user asks for
  "animated buttons," a custom cursor, hover micro-interactions, or wants
  to extend/reuse the specific button set built in this project (magnetic
  pull, scan line, status confirm, char shuffle, diagonal fill, bracket
  expand, progress drain, pixel dissolve, split flap, signal ping) on a new
  page or a different dark-themed project.
---

# Operator Interactions

Ten button styles + one cursor system, built dependency-free (vanilla CSS/canvas/rAF, no GSAP/Framer required although they compose fine alongside either). All assets are copied real component source from a shipped project, not pseudocode — read them directly rather than re-deriving.

## Before implementation

| Source | Gather |
|---|---|
| **Codebase** | Does the target project already have dark-theme CSS custom properties (`--accent`, `--signal-500` or equivalent)? These components read colors via `getComputedStyle` / CSS vars, not hardcoded hex — confirm the token names match or remap them. |
| **Conversation** | Which of the 10 styles does the user want, and where? Don't apply all ten everywhere — each was matched to a *specific* semantic location (see the mapping table below) in the source project; a new project needs its own mapping, not a blind copy. |
| **assets/** | `assets/components/*.tsx` — the five reusable React components. `assets/hooks/usePrefersReducedMotion.ts` — required by all of them. `assets/interactions.css` — the CSS-only effects (scan-sweep, progress-drain, split-flap, cursor-follower, gradient text). `assets/buttons-preview.html` — a self-contained, framework-free HTML preview of all 10 styles; open it directly in a browser to demo before wiring into React. |

Only ask the user for their specific target (which styles, which pages/elements) — don't ask them to explain what a "magnetic button" is; that's this skill's job.

## The 10 styles — catalog

| # | Style | Motif it reuses | Best fit | Component/CSS |
|---|---|---|---|---|
| 01 | **Magnetic pull** | — (physical/tactile) | The single primary CTA on a page — use once, not repeated | `MagneticButton.tsx` |
| 02 | **Scan line** | Terminal diagnostic sweep | Persistent chrome (nav CTA), mono-labeled buttons | `.btn-scan-sweep` in `interactions.css` |
| 03 | **Status confirm** | Existing success/checkmark state | Form submit buttons — morphs blue→green with a drawn checkmark | inline pattern, see "Status confirm" below |
| 04 | **Char shuffle** | Scatter-text reveal | "Load more" / pagination — reads as a brief decode before the count updates | inline pattern, see "Char shuffle" below |
| 05 | **Diagonal fill** | — | Repeated secondary CTAs (e.g. 6× service cards) — cheapest/quietest of the ten, use for anything appearing many times on one screen | CSS `clip-path`, see preview `.btn-diag` |
| 06 | **Bracket expand** | Terminal `[ ]` notation | Text links with existing console-coded copy | CSS transform, see preview `.btn-bracket` |
| 07 | **Progress drain** | "Agent is working" | Buttons that lead to a process/pipeline/loading state | `.btn-progress-drain` in `interactions.css` + inset `<svg><rect/></svg>` |
| 08 | **Pixel dissolve** | Canvas pixelation (matches image reveals elsewhere) | Card-level CTAs paired with pixel-revealed thumbnails | `PixelTextButton.tsx` |
| 09 | **Split flap** | Departure-board flip | "View all" style buttons — reveals a more specific secondary label | `SplitFlapLabel.tsx` + `.split-flap` |
| 10 | **Signal ping** | Existing status-dot pulse | Persistent "live/available" badges (not really a button — a status indicator) | `StatusDot.tsx` |

**Restraint rule** (carried over from the source project's hallmark-informed pass): don't use all ten on one page. Map each to ONE clear semantic slot; anything appearing 3+ times on a screen should get the quietest style (05 or a plain hover), not the most elaborate one.

## Wiring patterns

### Magnetic pull (01)
```tsx
import MagneticButton from "./components/MagneticButton";

<MagneticButton>
  <Link href="#contact" className="...">Start a project</Link>
</MagneticButton>
```
Tracks pointer within the wrapper's own bounding box via `pointermove`, translates the inner element toward it (`strength` prop, default 0.35), eases back on leave. Inert on touch/reduced-motion (checks `pointer: fine` + `usePrefersReducedMotion`).

### Scan line (02) / Progress drain (07)
Pure CSS — add the class, no JS:
```tsx
<Link href="/contact" className="btn-scan-sweep ...">HIRE ME</Link>

<Link href="#next" className="btn-progress-drain group ...">
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <rect x="1" y="1" width="98" height="98" rx="4" />
  </svg>
  How it works
</Link>
```
`rx` on the rect should match the button's actual `border-radius` in px (scaled to the 0–100 viewBox).

### Status confirm (03)
Not a standalone component — wire directly into a form's submit handler so the checkmark is actually visible before any success panel swap:
```tsx
const [justSent, setJustSent] = useState(false);
const [checkDrawn, setCheckDrawn] = useState(false);

useEffect(() => {
  if (!justSent) { setCheckDrawn(false); return; }
  const raf = requestAnimationFrame(() => setCheckDrawn(true));
  return () => cancelAnimationFrame(raf);
}, [justSent]);

// on success:
setJustSent(true);
setTimeout(() => { setJustSent(false); setStatus("success"); }, 900);
```
**Why the two-state dance**: a freshly-mounted SVG node with `strokeDashoffset: 0` has no prior frame to transition *from* — the checkmark would just appear pre-drawn instead of animating. Mount hidden (`dashoffset: 24`), flip to 0 one frame later so the browser has something to interpolate.
```tsx
<svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
  <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ strokeDasharray: 24, strokeDashoffset: checkDrawn ? 0 : 24,
             transition: "stroke-dashoffset 0.35s ease 0.1s" }} />
</svg>
```

### Char shuffle (04)
```tsx
const GLYPHS = "!<>-_\\/[]{}—=+*^?#";
function shuffleReveal(el: HTMLElement, finalText: string) {
  let frame = 0;
  const id = setInterval(() => {
    el.textContent = finalText.split("").map((ch, i) =>
      ch === " " ? " " : i < frame ? finalText[i] : GLYPHS[Math.random() * GLYPHS.length | 0]
    ).join("");
    if (++frame > finalText.length) { clearInterval(id); el.textContent = finalText; }
  }, 35);
}
```
Trigger on `mouseenter`; reset to the plain string on `mouseleave`. Skip entirely under reduced motion.

### Pixel dissolve (08)
```tsx
import PixelTextButton from "./components/PixelTextButton";

<Link href={project.link} className="text-accent inline-flex items-center">
  <PixelTextButton label="View Project" hoverLabel="Open live →" colorToken="--accent" fontSize={16} />
</Link>
```
**Known trap already fixed in the component**: the canvas box is sized by CSS layout of the *rest* label. If `hoverLabel` is longer, it clips unless you reserve width for the wider of the two — `PixelTextButton` does this itself via an offscreen `measureText` pass on mount; don't strip that out when adapting.

### Split flap (09)
```tsx
import SplitFlapLabel from "./components/SplitFlapLabel";

<button className="group ...">
  <SplitFlapLabel primary="View All Posts" secondary="See every article" />
</button>
```
Parent **must** carry the literal class `group` (plain CSS selector in `interactions.css`, works with or without Tailwind).

### Signal ping (10)
```tsx
import StatusDot from "./components/StatusDot";

<span className="badge ...">
  <StatusDot size={8} />
  Available for work
</span>
```
Always-on (not hover-gated) — this is a persistent status indicator, not a button interaction. Drops the ring under reduced motion, keeps the solid dot.

## Cursor follower

`CursorFollower.tsx` mounts once, globally (e.g. in a root layout), and renders a single fixed-position lerped dot. Elements opt into a labeled state via data attributes:
```html
<div data-cursor="view" data-cursor-label="OPEN">...</div>
<div data-cursor="live" data-cursor-label="LIVE">...</div>
<div data-cursor="scroll" data-cursor-label="SCROLL">...</div>
<div data-cursor="drag" data-cursor-label="DRAG">...</div>
```
Resolution is **nearest ancestor wins** (`target.closest("[data-cursor]")`). This matters for lists/sliders: if a draggable container has `data-cursor="drag"`, every card inside it inherits the big 64px DRAG circle *unless* the card itself carries its own `data-cursor` — give individual cards `data-cursor="link"` (a value with no matching CSS rule in `interactions.css`) to fall back to the plain 34px `.is-link` ring instead of the container's big circle. This was a real bug caught in the source project: blog cards inside a drag-slider were all showing the oversized DRAG cursor until each card got `data-cursor="link"`.

Requires `pointer: fine` (desktop) and `prefers-reduced-motion: no-preference` — inert (and invisible, `display:none` at mount) otherwise, native cursor untouched.

## Dual-accent gradient text

`.text-highlight` (in `interactions.css`) is a 60% blue → 40% green gradient for emphasized words inside headings. **Gotcha**: `background-clip: text` only works on an element that owns its own glyphs directly. If you're animating a heading char-by-char (each letter its own `<span>`), the WORD wrapper has no text of its own — the gradient renders nothing. Fix: paint the gradient per-character, sized to the full word/phrase width and offset by each char's own `offsetLeft`, so it reads as one continuous sweep instead of banding per letter. `CharRevealHeading.tsx` (not included in this skill's assets — it's app-specific scroll-reveal logic, but the *gradient-slicing technique* inside it is the reusable part) also merges **consecutive** highlighted words into one shared run, so a two-word highlight like "AI employees" doesn't restart the gradient mid-phrase.

## Anti-patterns

- ❌ Using all 10 styles on one page — pick one per semantic slot, repeat the quietest one (05 diagonal fill) for anything appearing 3+ times.
- ❌ Applying diagonal fill (05) to a wide/short element (a full-bleed row spanning a card's width). The clip-path diagonal only reads as diagonal when the element is roughly square-ish or compact — stretched across a wide short strip it just looks like a flat color bar sweeping in, no visible diagonal edge. Reserve 05 for compact buttons/links, not edge-to-edge bleed rows.
- ❌ Skipping the width-reservation step in pixel-dissolve when the two labels differ in length — causes visible clipping.
- ❌ Setting a freshly-mounted SVG stroke straight to its "revealed" dashoffset — no animation plays; always mount hidden, flip a frame later.
- ❌ Giving a draggable/scrollable container's `data-cursor` state to itself only — individual interactive children need their own override or they inherit the big circle.
- ❌ Hardcoding hex colors inside these components — all of them read from CSS custom properties (`--accent`, `--signal-500`, etc.) via `getComputedStyle`; remap the token names, don't inline new colors.
- ❌ Repeated cards in a grid without `h-full` on both the grid-item wrapper and the card's own root — CSS Grid stretches row height automatically, but a card without `h-full` won't fill that stretched space, so cards with less content end up visibly shorter than their siblings in the same row.

## Validation

- Hover each wired button in a real browser — `assets/buttons-preview.html` is the fastest way to sanity-check a style in isolation before wiring it into React.
- Toggle OS-level "reduce motion" and confirm every effect degrades to something static and legible (no missing content, no infinite-loop animation).
- Tab through with keyboard only — buttons must remain focusable/operable without a mouse; the magnetic-pull and cursor-follower effects are pointer-only enhancements, never a11y requirements.
