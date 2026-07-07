---
name: scroll-story-3d
description: |
  Builds Apple/Nike/Tesla-style "3D scroll story" product-reveal sections —
  a pinned hero where a product floats calmly, then dramatically transforms
  (explodes/opens/melts/deconstructs), then rebuilds, driven entirely by
  scroll position rather than autoplay. Outputs any combination of: a
  dependency-free vanilla HTML/CSS/JS bundle (drop into any site), a
  Shopify Online Store 2.0 section (Liquid + schema, editable in the theme
  editor), or a React/Next.js client component styled with Tailwind
  utility classes. Includes ffmpeg
  CLI scripts to turn a source video into a scroll-scrubbable WebP frame
  sequence and to stitch forward/reverse clips into a seamless loop —
  replacing manual Canva/CapCut editing with a single command. This skill
  should be used when a user asks to build a scroll-triggered / scroll-scrub
  / "scrollytelling" hero, a 3D product reveal section, an Apple-style
  scroll animation, or a Shopify section with that effect. It does not
  generate the source product video/images (that's a separate AI image/video
  generation step, out of scope) — it starts from a video the user already
  has or will provide.
---

# Scroll Story 3D

Builds the pinned, scroll-scrubbed "three-act" product reveal seen on
Apple/Nike/Tesla product pages: **Act 1** calm/floating (~0-28% of the
section's scroll range), **Act 2** dramatic transformation (~28-68%),
**Act 3** rebuild/resolve (~68-100%). The percentages are configurable, not
hardcoded — they're just sane defaults.

**Core technique**: pre-extract the source video into a still-image (WebP)
sequence and draw the right frame to a `<canvas>` per scroll position,
rather than scrubbing `video.currentTime` directly. Raw video scrubbing is
what most tutorials show, but it stutters inconsistently across
Firefox/Safari/mobile — see `references/perf-and-frame-budget.md` and
`references/browser-scroll-apis.md` for why, and when video-scrub is still
an acceptable simpler fallback.

**No third-party GUI apps.** Video prep (extracting frames, stitching a
forward+reverse loop) is done with the CLI scripts in `scripts/`, not
Canva/CapCut/etc. AI-generating the source product video/images (11Labs-style)
is out of this skill's scope — assume the user has, or will separately
obtain, a source clip or already-rendered image sequence.

## Before implementation

Gather context before writing anything:

| Source | Gather |
|---|---|
| **Conversation** | Target output: standalone site, Shopify section, or both. Product name/story (what "explodes"/transforms). Does the user already have a source video, or just images? |
| **Codebase** | If dropping into an existing project: existing CSS variable/token conventions, build tooling (plain HTML vs a framework), asset folder layout. For Shopify: theme's existing `/assets` and `/sections` structure. |
| **This skill's references/** | Frame budget and loading strategy (`perf-and-frame-budget.md`), current scroll API state (`browser-scroll-apis.md`), Shopify schema conventions (`shopify-section-schema.md`). |
| **Context7 / Tavily MCP** | Confirm current browser support for CSS `scroll-timeline`/`animation-timeline` and current Shopify section schema fields before finalizing — both evolve; don't trust this skill's snapshot blindly (see references for what to re-check). |

Only ask the user for THEIR specifics (product/story, target output, do they
have a source video). Don't ask them to explain scroll-driven animation
concepts — that domain knowledge lives in `references/`.

## Workflow

### 1. Prepare the video asset (if starting from raw clips)

- Two separate clips (forward "transform" + reverse "rebuild")? Run
  `scripts/build-loop.sh -f forward.mp4 -r reverse.mp4 -o loop.mp4`.
- Only one clip and want the reverse auto-generated? Omit `-r`:
  `scripts/build-loop.sh -f forward.mp4 -o loop.mp4`.
- Either way, this replaces the manual Canva/CapCut "merge two clips into a
  loop" step with one ffmpeg command.

### 2. Choose the playback mode

- **`frames` mode (recommended, best perf)**: run
  `scripts/extract-frames.sh -i loop.mp4 -o assets/frames/product -n 60`
  to produce a WebP sequence. See `references/perf-and-frame-budget.md`
  before picking `-n`/`-w` — don't just default blindly on unusually long
  pinned sections.
- **`video` mode (simpler, fallback)**: skip frame extraction, point the
  engine straight at the `<video>` element. Use this when the user wants
  zero build step (e.g. a Shopify merchant with no CLI access), and accept
  the perf/consistency tradeoff documented in `references/browser-scroll-apis.md`.

### 3. Generate the output

- **Standalone site**: copy `assets/standalone/scroll-story.css`,
  `scroll-story.js`, and adapt `assets/standalone/index.html`'s markup
  (container structure, `data-scroll-story` config JSON, per-act overlay
  divs with `data-act data-start=".." data-end=".."`) to the user's actual
  product/copy/breakpoints. Do not invent product copy — use what the user
  gave you, or ask.
- **Shopify section**: copy `scroll-story.css`/`scroll-story.js` into the
  theme's `/assets` unmodified, copy
  `assets/shopify/sections/scroll-story.liquid` into `/sections`, and adjust
  only if the theme's markup/token conventions require it (e.g. wrap in the
  theme's existing section-spacing classes). Read
  `references/shopify-section-schema.md` first — it explains why `video`
  mode is the schema default (frames mode needs a manual Shopify Files
  upload step, not fully self-serve from the theme editor) and the
  `block.shopify_attributes` requirement for theme-editor click-to-select.
- **React/Next.js + Tailwind**: copy `assets/react/ScrollStory.tsx` into the
  project's components directory as-is (`'use client'` component, no extra
  npm dependencies — just React + Tailwind, both already present in a
  Next.js/Tailwind project). Pass `acts` as props instead of editing markup;
  don't hand-roll a second implementation of the scroll/pin/frame logic —
  this file already ports the same algorithm to hooks/refs. If the host
  project has its own design-token/CSS-variable conventions (see this repo's
  `mkt-*`/`adm-*`/`prt-*` prefixes if working inside Octively), swap the
  Tailwind classes for the project's tokens rather than leaving raw
  Tailwind utilities that clash with the design system.
- **Multiple targets at once**: the standalone and Shopify outputs share
  `scroll-story.css`/`scroll-story.js` verbatim — don't fork them;
  parametrize instead if a project genuinely needs different behavior. The
  React version is a separate, intentionally-duplicated port (different
  module system/rendering model) — keep it in sync with the vanilla engine
  by hand if you change the core algorithm in one place.

### 4. Wire up the three acts

Every overlay/copy element needs `data-act data-start="N" data-end="N"`
(percent of the pinned scroll range). Defaults: Act 1 `0-28`, Act 2 `28-68`,
Act 3 `68-100`, with small gaps between acts (e.g. 28-30) so overlays don't
overlap mid-transition — adjust to the user's actual story beats, don't just
hardcode these three defaults if their narrative has a different shape.

### 5. Verify before calling it done

- `prefers-reduced-motion: reduce` shows a static, non-pinned fallback (the
  engine already handles this — confirm it's wired to a real fallback image
  URL, not left empty).
- First frame (or `video` poster) loads eagerly/high-priority — it's the
  section's LCP candidate.
- Actually scroll through it (real browser, throttled if possible) — check
  for stutter, empty flashes before frames load, and overlay timing against
  the intended three-act beats.
- If Shopify: confirm the section appears in "Add section" with sensible
  preset defaults (not blank), and that each block is click-to-selectable
  in the theme editor (needs `block.shopify_attributes`).

## What this skill does NOT do

- Does not generate product images/video via AI (11Labs, nano-banana, etc.)
  — assume that asset already exists or is produced separately.
- Does not use Canva, CapCut, or any other GUI video editor — all video
  processing goes through `scripts/*.sh` (ffmpeg).
- Does not bundle GSAP or any scroll-animation library by default — the
  engine is vanilla JS. GSAP ScrollTrigger is documented as an *optional*
  swap-in in `references/browser-scroll-apis.md`, only if the project
  already depends on it.

## Reference files

| File | Read when |
|---|---|
| `references/perf-and-frame-budget.md` | Deciding frame count/resolution, preloading strategy, before calling frame extraction "done" |
| `references/browser-scroll-apis.md` | Deciding frames-vs-video mode, native CSS scroll-timeline vs JS fallback, whether to use GSAP |
| `references/shopify-section-schema.md` | Any Shopify section work — schema fields, blocks, why video mode is the schema default |

## Scripts

| Script | Purpose |
|---|---|
| `scripts/build-loop.sh` | Merge forward+reverse clips (or auto-reverse one clip) into a seamless loop video — replaces Canva/CapCut |
| `scripts/extract-frames.sh` | Convert a video into a DPR-aware WebP frame sequence for canvas scrubbing |

Both require `ffmpeg`/`ffprobe` on PATH and print an install hint if missing
rather than failing silently.
