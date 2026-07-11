---
name: scroll-story-3d
description: |
  Builds Apple/Nike/Tesla-style "3D scroll story" product-reveal sections —
  a pinned hero where a product floats calmly, then dramatically transforms
  (explodes/opens/melts/deconstructs), then rebuilds, driven entirely by
  scroll position rather than autoplay. Also supports the "shader dissolve"
  scroll effect — two images cross-fading via GLSL shaders with center-origin
  radial dissolve, Sobel edge detection, grayscale transition, and edge glow
  driven by scroll (popularised by Shopify product pages). And the "card
  convergence" scroll effect — scattered cards with images converge to the
  center as the user scrolls, using GSAP ScrollTrigger with scatter offset,
  random rotation, and smooth scrub (inspired by Awwwards-winning sites).
  Outputs any combination of: a dependency-free vanilla HTML/CSS/JS bundle
  (drop into any site), a Shopify Online Store 2.0 section (Liquid + schema,
  editable in the theme editor), or a React/Next.js client component styled
  with Tailwind utility classes. Includes ffmpeg CLI scripts to turn a
  source video into a scroll-scrubbable WebP frame sequence and to stitch
  forward/reverse clips into a seamless loop — replacing manual Canva/CapCut
  editing with a single command. This skill should be used when a user asks
  to build a scroll-triggered / scroll-scrub / "scrollytelling" hero, a 3D
  product reveal section, an Apple-style scroll animation, a Shopify
  dissolve/edge-detection scroll effect, a card convergence scroll
  animation, a shader-based loading animation, or a Shopify section with
  any of these effects. Five techniques are available: **frame-sequence
  scrubbing** (for video-based reveals), **shader dissolve** (for
  image-to-image transitions with edge glow), **card convergence** (for
  GSAP-driven card scatter-to-center), **shader loader** (for
  click-to-reveal loading animations with pixelation, noise, and glow),
  and **fluid distortion** (for R3F-based WebGL scenes with fluid
  post-processing distortion and 3D models), **pixel image** (for
  scroll-triggered pixelation reveal on images via GSAP + Canvas), and
  **fella nav** (for an animated full-screen navigation menu with GSAP
  timeline, text splitting, and interactive indicator), and **fall text**
  (for a scroll-triggered falling color-blocks text reveal with GSAP
  SplitText and random fall physics),   and **scatter text** (for a
  scroll-triggered character scatter animation where text breaks apart
  into vertical line groups and random boxes, then returns to original
  positions — inspired by maxmilkin.com), and **model scroll** (for a
  scroll-driven 3D model that rotates 360° as the page scrolls, using
  React Three Fiber with Lenis scroll progress — popularised by
  Awwwards-winning 3D portfolio sites), and **mask box reveal** (for a
  full-screen video revealed through draggable mask boxes with canvas
  clipping — popularised by or.studio, winner of Site of the Day on
  Awwwards), and **svg page transition** (for a premium page transition
  effect using SVG path drawing with GSAP DrawSVGPlugin — popularised by
  Awwwards-winning agency sites), and **overlapping slider** (for a
  fluid, draggable card slider where sliding cards overlap with rotation
  and scale transforms — built with the smooothy library and popularised
  by Awwwards-winning websites).
  It does not generate the source product video/images (that's a separate
  AI image/video generation step, out of scope) — it starts from assets
  the user already has or will provide.
---

# Scroll Story 3D

This skill supports **thirteen techniques** for scroll-driven effects:

| Technique | Best for | Approach |
|---|---|---|
| **Frame-sequence** (original) | Video-based reveals with three-act narrative (calm → transform → rebuild) | Pre-extract video frames as WebP, draw to canvas per scroll position |
| **Shader dissolve** | Image-to-image transitions with dissolve, edge detection, grayscale, glow | Two stacked Three.js canvases with custom GLSL fragment shaders, driven by Lenis scroll progress |
| **Card convergence** | GSAP-driven card scatter-to-center reveal with images | Scattered cards with random rotation converge to center via GSAP ScrollTrigger scrub |
| **Shader loader** | Click-to-reveal loading animation with pixelation, Perlin noise, edge glow | Full-screen Three.js shader overlay with GSAP-driven transition on user interaction |
| **Fluid distortion** | WebGL hero scenes with fluid post-processing distortion | React Three Fiber canvas with `<Fluid>` effect, 3D model/geometry, and overlay text |
| **Pixel image** | Scroll-triggered pixelation reveal on images | Canvas 2D + GSAP ScrollTrigger animating pixel block size from coarse to fine |
| **Fella nav** | Animated full-screen navigation menus | GSAP timeline with clip-path reveal, SplitText line animation, indicator tracking |
| **Fall text** | Scroll-triggered falling color-blocks text reveal | SplitText words + per-word color overlays that fall with random x/y/rotation via GSAP ScrollTrigger |
| **Scatter text** | Scroll-triggered character scatter reveal | SplitText chars scattered to 4 groups (left/right lines + random boxes) that return to original positions via GSAP ScrollTrigger scrub |
| **Model scroll** | Scroll-driven 3D model rotation | Fixed R3F canvas with GLB model that rotates 360° on Y axis based on Lenis scroll progress |
| **Mask box reveal** | Draggable mask boxes over full-screen video | Canvas 2D draws video portion under each mask box using offset-based clipping, with drag interaction |
| **SVG page transition** | Premium page transitions between routes | GSAP + DrawSVGPlugin animates SVG path draw with expanding stroke on leave, reverse on enter, wrapping next-transition-router |
| **Overlapping slider** | Fluid draggable card slider with overlap transforms | smooothy library with variable-width cards, offset-based overlap transforms (rotate, scale, translate), momentum physics |

---

## Technique 1: Frame-sequence scrubbing (original recipe)

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
Canva/CapCut/etc. AI-generating the source product video/images is out of
this skill's scope.

### Before implementation (Technique 1)

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

### Workflow (Technique 1)

#### 1. Prepare the video asset

- Two separate clips (forward "transform" + reverse "rebuild")? Run
  `scripts/build-loop.sh -f forward.mp4 -r reverse.mp4 -o loop.mp4`.
- Only one clip and want the reverse auto-generated? Omit `-r`:
  `scripts/build-loop.sh -f forward.mp4 -o loop.mp4`.

#### 2. Choose the playback mode

- **`frames` mode (recommended, best perf)**: run
  `scripts/extract-frames.sh -i loop.mp4 -o assets/frames/product -n 60`
  to produce a WebP sequence. See `references/perf-and-frame-budget.md`.
- **`video` mode (simpler, fallback)**: skip frame extraction, point the
  engine straight at the `<video>` element.

#### 3. Generate the output (Technique 1)

- **Standalone site**: copy `assets/frame-sequence/standalone/scroll-story.css`,
  `scroll-story.js`, and adapt `assets/frame-sequence/standalone/index.html`'s markup.
- **Shopify section**: copy `scroll-story.css`/`scroll-story.js` into the
  theme's `/assets` unmodified, copy
  `assets/frame-sequence/shopify/sections/scroll-story.liquid` into `/sections`.
- **React/Next.js + Tailwind**: copy `assets/frame-sequence/react/ScrollStory.tsx` into the
  project's components directory.

#### 4. Wire up the three acts

Every overlay/copy element needs `data-act data-start="N" data-end="N"`
(percent of the pinned scroll range). Defaults: Act 1 `0-28`, Act 2 `28-68`,
Act 3 `68-100`.

#### 5. Verify

- `prefers-reduced-motion: reduce` shows a static, non-pinned fallback.
- First frame loads eagerly — it's the section's LCP candidate.
- Actually scroll through it (real browser, throttled if possible).
- If Shopify: confirm the section appears in "Add section" with sensible
  preset defaults, and that each block is click-to-selectable in the theme
  editor (needs `block.shopify_attributes`).

---

## Technique 2: Three.js shader dissolve (new recipe)

Builds the dissolve/edge-detection scroll effect popularised by Shopify
product pages — two images stacked in layers. The top image dissolves from
the center outward using a radial dissolve with noisy/pixelated edge, Sobel
edge detection, grayscale transition, and edge glow. Simultaneously, the
bottom image transitions from dark (edges only) to fully visible in color.
The entire animation is driven by scroll progress via Lenis.

**Core technique**: Two stacked Three.js orthographic scenes, each with a
full-screen `PlaneGeometry` and a custom GLSL fragment shader. The top
shader handles center-origin dissolve with edge detection; the bottom shader
handles the reverse (dark-to-light reveal). Lenis provides smooth scrolling
and a normalised `progress` value (0–1) that drives all uniforms.

**Dependencies**: Three.js, Lenis, and a build tool (Vite recommended for
development). The standalone version uses CDN imports via importmap.

### What the shaders do

**Top canvas shader** (`coverFragmentShader`):
- Radial dissolve from center — distance-based mask with FBM noise for jagged/pixelated edge
- Sobel operator edge detection — luminance-based kernel convolution
- Grayscale transition — mixes colour channels toward luminance
- Edge glow — white glow on detected edges that fades with scroll progress
- Sparkle effect — random bright pixels at the dissolve boundary

**Bottom canvas shader** (`coverFragmentShaderReverse`):
- Starts fully dark — only Sobel-detected edges visible in white
- Darkness, grayscale, and edge intensity fade out with scroll
- Reveals the full-color image underneath

### Before implementation (Technique 2)

| Source | Gather |
|---|---|
| **Conversation** | Target output: standalone site, Shopify section, or both. Two image URLs (top "before" image that dissolves away, bottom "after" image that reveals). Does the user want custom centre point, edge colour, or timing curves? |
| **Codebase** | For Next.js: ensure `three` and `lenis` are installed (`npm install three lenis`). For standalone: browser must support importmap (modern Chrome/Firefox/Safari/Edge). |
| **MCP research** | Use `context7 resolve-library-id` for `three` to get latest version and docs. Use `context7 resolve-library-id` for `lenis`. |

Don't ask the user to explain shader maths. That domain knowledge is encoded
in the asset files — just adapt the image URLs and optional tuning params.

### Workflow (Technique 2)

#### 1. Prepare image assets

Two images are required:
- **Top image** (dissolves away) — the "before" state
- **Bottom image** (appears) — the "after" state

Use high-resolution images (at least 1920px wide) for sharp edge detection.
The shaders handle aspect-ratio correction automatically via `uResolution`
and `uImageResolution` uniforms.

#### 2. Choose output target

- **Standalone site**: copy `assets/shader-dissolve/standalone/` — serves
  via Vite dev server or any static file server. Edit image URLs in
  `app.js` to point to your assets.
- **Shopify section**: copy
  `assets/shader-dissolve/shopify/sections/shader-dissolve.liquid` into the
  theme's `/sections`. Merchants pick images via native image pickers.
- **React/Next.js + Tailwind**: copy
  `assets/shader-dissolve/react/ShaderDissolve.tsx` into the project's
  components directory. Pass `imageTop`, `imageBottom` as props.

#### 3. Configure animation parameters

| Parameter | Uniform | Default | Effect |
|---|---|---|---|
| Dissolve centre | `uCenter` | `(0.5, 0.5)` | Origin point of the radial dissolve |
| Dissolve speed multiplier | progress calc | `1.0` | How fast the dissolve completes relative to scroll |
| Edge intensity | `uEdgeIntensity` | varies (0→0.5 top, 0.6→0 bottom) | Strength of Sobel edge glow |
| Edge brightness | `uEdgeBrightness` | `1.0 → 0.0` (top) | Brightness of edge glow |
| Grayscale amount | `uGrayscale` | `0→1` (top), `1→0` (bottom) | How much colour is desaturated |
| Darkness | `uDarkness` | `1→0` (bottom) | How dark the image starts (bottom canvas) |

#### 4. Verify

- Check that both images load and the dissolve originates from the correct
  centre point.
- Edge detection should show crisp outlines — if too faint, increase
  `uEdgeIntensity` multiplier.
- The dissolve edge should have a pixelated/noisy character — if too
  smooth, adjust `noiseScale` in the fragment shader.
- Test on mobile: ensure Lenis touch-scroll works and the 300vh container
  provides enough scroll space (adjust `height` if needed).
- `prefers-reduced-motion: reduce` should show a static full-colour image
  (the bottom image, no animation).

---

## Technique 3: GSAP Card Convergence

Builds the scroll-driven card convergence effect seen on Awwwards-winning
sites — a set of image cards scattered around the viewport with random
rotation converge smoothly to the centre as the user scrolls. The effect
creates a premium, polished feel where content gathers into a cohesive
composition driven entirely by scroll position.

**Core technique**: GSAP ScrollTrigger with `scrub` synchronises each
card's position, rotation, and scale to scroll progress. Cards start at
scattered positions (calculated via `getBoundingClientRect` offset from
section centre) and animate to `(x: 0, y: 0, rotation: 0)` over the
scroll range. Lenis provides smooth scrolling. The `measureOffset`
helper computes the distance from each card's centre to the section
centre, ensuring correct positioning regardless of layout.

**Dependencies**: GSAP + ScrollTrigger, and optionally Lenis for smooth
scrolling. The standalone version loads GSAP from CDN.

### How it works

1. **Card data** — each card has an image URL, initial X/Y offset
   (percentage from centre), background colour, and optional alt text.
2. **Scatter state** — on mount, each card gets a random rotation
   (`±12°`) and a random `z-index`. Cards are positioned absolutely
   using the configured percentage offsets.
3. **`measureOffset` helper** — for each card, calculates the pixel
   distance from its centre to the section's centre using
   `getBoundingClientRect`. This converts percentage offsets to pixel
   values that GSAP can animate.
4. **GSAP ScrollTrigger** — `gsap.fromTo()` animates each card from its
   scattered `(x, y)` offset + random rotation to `(0, 0, 0)` with
   `scrub: 1.5` for a smooth scroll-linked transition.
5. **Resize handling** — on window resize, the context is reverted and
   offsets recalculated so cards maintain correct scatter positions.

### Before implementation (Technique 3)

| Source | Gather |
|---|---|
| **Conversation** | Target output: standalone site, Shopify section, or both. Number of cards (4–8 recommended). Image assets. Does the project already use GSAP or Lenis? |
| **Codebase** | If Next.js: ensure `gsap` and `@gsap/react` are installed (`npm install gsap @gsap/react`). If standalone: no build step needed — GSAP loads from CDN. |
| **MCP research** | Use `context7 resolve-library-id` for `gsap` to get latest version. Check `context7 query-docs "/@gsap/react"` for useGSAP hook patterns if using React. |

### Workflow (Technique 3)

#### 1. Prepare card images

Collect 4–8 images at ~400px width. Cards display at
`clamp(140px, 16vw, 220px)` wide by `clamp(180px, 20vw, 280px)` tall.
Choose images with clear subjects on contrasting backgrounds for best
visual impact.

#### 2. Choose output target

- **Standalone site**: serve `assets/card-convergence/standalone/`.
  Edit the `cards` array in `app.js` with your image URLs, offsets, and
  background colours.
- **Shopify section**: copy
  `assets/card-convergence/shopify/sections/card-convergence.liquid` into
  the theme's `/sections`. Merchants add card images and set offset
  percentages via the theme editor.
- **React/Next.js + Tailwind**: copy
  `assets/card-convergence/react/CardConvergence.tsx` into the project's
  components directory. Pass `cards` prop with image URLs and offsets.

#### 3. Configure cards

Each card needs:
| Parameter | Type | Description |
|---|---|---|
| `src` | string | Image URL |
| `x` | number | Horizontal offset from centre in % (e.g. `-40` = 40% left) |
| `y` | number | Vertical offset from centre in % |
| `bgColor` | string (optional) | Background colour behind the image |

Aim for balanced scatter: some cards in each quadrant, avoid clustering
at the edges. The `measureOffset` helper handles positioning at any
viewport size.

#### 4. Verify

- Cards should appear scattered on page load and smoothly converge to
  centre as you scroll through the section.
- Random rotation (±12°) should never clip outside the viewport on
  desktop or mobile — if cards exceed the viewport on small screens,
  reduce offset percentages.
- On window resize, cards should maintain correct scatter positions
  (the resize handler recalculates offsets).
- Lenis should be integrated for smooth scrolling in standalone and
  React versions; the Shopify version uses native scroll (merchants can
  add Lenis separately).

---

## Technique 4: Shader-based Loading Animation

Builds the premium, cinematic loading animation seen on award-winning
websites — a full-screen shader overlay with pixelation filter, Perlin
noise displacement, radial gradient reveal, and volumetric edge glow.
The loader covers the page until the user clicks, then reveals the
underlying content with a smooth 3-second transition.

**Core technique**: A single Three.js orthographic scene with a custom
GLSL fragment shader that combines:
- **Pixelation filter** — snaps UV coordinates to an 8×8 pixel grid for
  a retro digital-glitch look
- **Classic 3D Perlin noise** — displaces UVs and drives organic
  distortion patterns animated by `uTime`
- **Radial gradient reveal** — calculates distance from centre with
  aspect correction; the `uTransition` uniform (animated by GSAP from
  0→1 on click) shifts the gradient so corners dissolve outward
- **Volumetric edge glow** — detects the dissolve boundary on the
  unclamped noise gradient and applies a pulsing glow using the
  customizable `uBorderColor`

**Dependencies**: Three.js + GSAP. The standalone version loads both
from CDN.

### How it works

1. **Loader overlay** — a fixed full-screen `<div>` with a `<canvas>`
   and a "CLICK TO REVEAL" text prompt sits above all page content.
2. **Shader uniforms** — `uTransition` (0→1, GSAP-animated on click),
   `uResolution` (screen size), `uTime` (elapsed time for animated
   noise), `uBorderColor` (customizable glow colour).
3. **On click** — GSAP fades the text prompt up and out (`y: -25`,
   `opacity: 0`), then animates `uTransition` from 0 to 1 over 3s with
   `power2.inOut` easing. The shader responds by dissolving the solid
   black plane from the centre outward.
4. **On complete** — pointer events are disabled on the loader so the
   user can interact with the revealed content underneath.
5. **Animation loop** — `requestAnimationFrame` updates `uTime` every
   frame, keeping the Perlin noise and glow animation dynamic.

### Before implementation (Technique 4)

| Source | Gather |
|---|---|
| **Conversation** | Target output: standalone site, Shopify section, or both. Preferred border/glow colour. Custom prompt text. Does the project already use Three.js or GSAP? |
| **Codebase** | If Next.js: ensure `three` and `gsap` are installed (`npm install three gsap`). |
| **MCP research** | Use `context7 resolve-library-id` for `three` and `gsap` to get latest versions. |

### Workflow (Technique 4)

#### 1. Choose output target

- **Standalone site**: serve `assets/shader-loader/standalone/`.
  Edit the `borderColor` in `app.js` and prompt text in `index.html`.
- **Shopify section**: copy
  `assets/shader-loader/shopify/sections/shader-loader.liquid` into
  the theme's `/sections`. Merchants set glow colour, prompt text, and
  transition duration via the theme editor.
- **React/Next.js + Tailwind**: copy
  `assets/shader-loader/react/ShaderLoader.tsx` into the project's
  components directory. Pass `borderColor`, `promptText`, and
  `transitionDuration` as props. Wrap page content as children.

#### 2. Configure parameters

| Parameter | Default | Description |
|---|---|---|
| `promptText` | `"CLICK TO REVEAL"` | Text shown on the loader |
| `borderColor` | `#0066ff` | Glow colour for the volumetric edge |
| `transitionDuration` | `3.0` | Seconds for the reveal animation |

#### 3. Verify

- On page load, the loader should show a solid black screen with
  animated Perlin noise distortion and a pulsing edge glow.
- Clicking should fade the prompt text and begin the radial dissolve
  from centre outward.
- The edge glow should pulse dynamically (driven by `uTime`).
- On complete, the loader should become non-interactive (pointer events
  disabled) revealing the page content underneath.
- Resize should not break the shader aspect ratio or positioning.

---

## Technique 5: Fluid Distortion Hero

Builds a full-screen WebGL hero section with a 3D scene (model or
procedural geometry) overlaid with a fluid distortion post-processing
effect. The fluid simulation creates organic, flowing distortions that
make the scene feel alive — like smoke or liquid moving across the
screen. Popularised by award-winning portfolio and product pages.

**Core technique**: A React Three Fiber `<Canvas>` with an
`<EffectComposer>` wrapping both a `<Bloom>` pass and a `<Fluid>` pass
from `@whatisjery/react-fluid-distortion`. The `<Fluid>` component
renders a real-time fluid simulation as a post-processing effect, with
configurable `fluidColor` and `curl` (vorticity) parameters.

**Dependencies**: Next.js project with `three`, `@react-three/fiber`,
`@react-three/drei`, `@react-three/postprocessing`, and
`@whatisjery/react-fluid-distortion` installed.

### How it works

1. **Scene setup** — a full-screen `<Canvas>` renders a 3D scene with
   lighting (`Environment`, `HemisphereLight`, `DirectionalLight`).
2. **Model** — a GLB model loaded via `useGLTF` (or a procedural
   `TorusKnotGeometry` fallback) rotates continuously via `useFrame`.
3. **Post-processing** — `<EffectComposer>` chains a `<Bloom>` pass
   (subtle glow) and a `<Fluid>` pass (fluid distortion simulation).
4. **Overlay text** — HTML headings and description are layered above
   the canvas using absolute positioning with a higher `z-index`.
5. **Animation loop** — `useFrame` increments `rotation.y` of the model
   group on every render frame for constant slow rotation.

### Before implementation (Technique 5)

| Source | Gather |
|---|---|
| **Conversation** | Target output: Next.js page, Shopify section, or standalone demo. Do they have a GLB model or need the TorusKnot fallback? Preferred fluid colour and curl intensity. |
| **Codebase** | If Next.js: ensure `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@whatisjery/react-fluid-distortion`, and `three` are installed (`npm install three @react-three/fiber @react-three/drei @react-three/postprocessing @whatisjery/react-fluid-distortion`). |
| **MCP research** | Use `context7 resolve-library-id` for `three`, `@react-three/fiber`, and `react-fluid-distortion` to get latest versions. |

### Workflow (Technique 5)

#### 1. Choose output target

- **Standalone site**: serve `assets/fluid-distortion/standalone/`.
  Edit the accent colour and fluid parameters in `app.js` and heading
  text in `index.html`.
- **Shopify section**: copy
  `assets/fluid-distortion/shopify/sections/fluid-distortion.liquid`
  and `fluid-distortion.css` into the theme's `/sections` and `/assets`.
  Merchants set fluid colour, curl, accent colour, heading text, and
  model URL via the theme editor.
- **React/Next.js**: copy
  `assets/fluid-distortion/react/FluidDistortion.tsx` into the project's
  components directory. Pass `fluidColor`, `curl`, `modelPath`,
  `useFallback`, `showStats`, and `children` (overlay content) as props.

#### 2. Configure parameters

| Parameter | Default | Description |
|---|---|---|
| `fluidColor` | `#1b1b1b` | Colour of the fluid simulation |
| `curl` | `30` | Vorticity/curl intensity (0–100) |
| `accentColor` | `#9977ff` | Accent colour for geometry/rim light |
| `useFallback` | `false` | Use TorusKnot geometry instead of GLB model |

#### 3. Verify

- The canvas should render a 3D scene with visible fluid distortion.
- The fluid should appear as a dark, flowing overlay with organic
  movement.
- The model or geometry should rotate slowly and continuously.
- Overlay text should be sharp and readable above the WebGL canvas.
- Resize should maintain aspect ratio and full-screen coverage.
- FPS should stay above 30 on mid-range devices; use `<Stats>` prop to
  monitor.

---

## Technique 6: Pixel Image Reveal

Builds a scroll-triggered pixelation reveal effect on images. When an
image scrolls into view, a canvas overlay progressively steps through
pixel block sizes — from large chunky pixels (highly pixelated) down to
the original resolution — creating a satisfying "de-pixelation" reveal.

**Core technique**: A `<canvas>` is layered over the image. On each
animation step, the image is drawn at a fraction of its size (creating
visible pixel blocks) and then stretched back to full canvas size. The
pixel block size decreases through a configurable step array, e.g.
`[2, 5, 6, 8, 100]` (where 100 = original resolution). GSAP ScrollTrigger
kicks off the animation when the element enters the viewport.

**Dependencies**: GSAP (with ScrollTrigger plugin) + Lenis for smooth
scrolling. Lenis integrates with GSAP via `gsap.ticker`.

### How it works

1. **Container** — a `position: relative; overflow: hidden` div wraps
   the image and canvas. It starts with `opacity: 0`.
2. **Hidden image** — the original `<img>` is cloned with a
   `data-pixel-src` attribute and hidden (`opacity: 0`).
3. **Canvas** — a `<canvas>` is positioned absolutely over the container.
4. **Render loop** — on each step, the canvas draws the image at a small
   scale (e.g. 2% of its size) then stretches it back to full dimensions,
   creating a pixelated appearance. As the step index increases, the
   pixel blocks shrink until the image is clear.
5. **ScrollTrigger** — two triggers are created per container:
   - The first triggers when the container reaches `top+=20% bottom`
     (the container's top is 20% past the viewport bottom) and starts
     the pixel animation.
   - The second sets `opacity: 1` when the container enters from the
     bottom, so it's visible before the animation starts.
6. **Resize** — the canvas re-renders on window resize to maintain the
   correct aspect ratio.

### Before implementation (Technique 6)

| Source | Gather |
|---|---|
| **Conversation** | Target output: standalone site, Shopify section, or both. Number of images/layout. Preferred pixel step array and animation speed. |
| **Codebase** | If Next.js: ensure `gsap` and `lenis` are installed (`npm install gsap lenis`). Add `LenisSmoothScroll` component to the root layout. |
| **MCP research** | Use `context7 resolve-library-id` for `gsap` and `lenis` to get latest versions. |

### Workflow (Technique 6)

#### 1. Choose output target

- **Standalone site**: serve `assets/pixel-image/standalone/`.
  Edit the images and labels in `index.html` and adjust pixel steps,
  speed, or delay in `app.js`.
- **Shopify section**: copy
  `assets/pixel-image/shopify/sections/pixel-image.liquid` and
  `pixel-image.css` into the theme's `/sections` and `/assets`.
  Merchants add rows, pick images, set labels and offsets via blocks.
- **React/Next.js**: copy
  `assets/pixel-image/react/PixelImage.tsx` into the project's
  components directory. Pass `pxSteps`, `triggerStart`, `speed`,
  `initialDelay`, `className`, and `style` as props. Wrap each image
  with `<PixelImage>`.

#### 2. Configure parameters

| Parameter | Default | Description |
|---|---|---|
| `pxSteps` | `[2, 5, 6, 8, 100]` | Pixel block sizes (1–100, higher = clearer) |
| `triggerStart` | `top+=20% bottom` | ScrollTrigger start position |
| `speed` | `80` | Milliseconds between pixel steps |
| `initialDelay` | `300` | Delay before the first pixel step |

#### 3. Verify

- On page load, images should be hidden (set to `opacity: 0`).
- Scrolling down should reveal each image with the pixelation effect.
- The effect should run from chunky pixels → clear image progressively.
- The animation should only run once per image (ScrollTrigger `once: true`).
- Resize should re-render the canvas to maintain aspect ratio.
- Smooth scrolling (Lenis) should not conflict with the pixel animation.

---

## Technique 8: Falling Text Animation

Builds a scroll-triggered text reveal where colored boxes appear over
each word and then fall away with random trajectories — like paint chips
flaking off the letters. The underlying text remains perfectly in place,
creating a layered reveal effect. This animation won Site of the Day on
GSAP and received an Honorable Mention on Awwwards.

**Core technique**: SplitText breaks the text into individual words. A
colored overlay `div` ("color box") is created for each word, sized to
match the word's bounding rect (1.1× width, 0.9× height), positioned
absolutely on top. A GSAP ScrollTrigger timeline animates all color
boxes with random `y` (1200–1600px), `x` (–150 to 150px), and `rotation`
(–360° to 360°) values, using `power2.in` easing and 0.02s stagger.

**Dependencies**: GSAP (with ScrollTrigger and SplitText plugins) +
Lenis for smooth scrolling.

### How it works

1. **Wrap text** — a `<Fall>` component wraps any heading/paragraph.
   The child text is rendered inside a nested div for SplitText access.
2. **SplitText** — breaks the text into word-level elements, each set
   to `display: inline-block; position: relative`.
3. **Color boxes** — for each word, a `div` is created with the word's
   dimensions, the configured color, rounded corners, and `pointer-events:
   none`. It's appended to the word element.
4. **ScrollTrigger** — when the container hits `top 80%` scrolling down,
   the timeline fires. All color boxes animate out with random
   trajectories (big downward y, moderate x, full rotation).
5. **Cleanup** — `onComplete` hides all color boxes (`display: none`).
6. **GSAP Context** — the entire animation is scoped to the element ref,
   and `ctx.revert()` on unmount cleans up all listeners and DOM changes.

### Before implementation (Technique 8)

| Source | Gather |
|---|---|
| **Conversation** | Target output: standalone site, Shopify section, or both. Text content, color box color, delay. Does the project already use GSAP SplitText? |
| **Codebase** | If Next.js: ensure `gsap` and `lenis` are installed (`npm install gsap lenis`). SplitText is a GSAP Membership plugin — verify the license includes it. |
| **MCP research** | Use `context7 resolve-library-id` for `gsap` to confirm SplitText availability. |

### Workflow (Technique 8)

#### 1. Choose output target

- **Standalone site**: serve `assets/fall-text/standalone/`. Edit text
  content and color values in `index.html`. Adjust delay and trigger
  points via `data-` attributes. ⚠️ SplitText not on CDN — manual word
  splitting is used instead.
- **Shopify section**: copy `assets/fall-text/shopify/sections/` into
  the theme. Add hero/text blocks and configure colors and timing via
  the theme editor. ⚠️ Same CDN limitation applies.
- **React/Next.js**: copy `assets/fall-text/react/FallText.tsx` into
  the project. Wrap text with `<FallText color="#005E53" delay={200}>`.
  Requires `gsap/SplitText` (Membership plugin).

#### 2. Configure parameters

| Parameter | Default | Description |
|---|---|---|
| `color` | `#ededed` | Color of the falling boxes |
| `delay` | `0` | Delay in ms before animation starts |
| `triggerStart` | `top 80%` | ScrollTrigger start position |
| `triggerEnd` | `bottom 30%` | ScrollTrigger end position |
| `stagger` | `0.02` | Seconds between each box's animation |
| `duration` | `1` | Duration of the fall animation |
| `fallRangeY` | `1200–1600` | Random vertical fall distance |
| `fallRangeX` | `–150 to 150` | Random horizontal shift |
| `fallRotation` | `–360° to 360°` | Random rotation range |

#### 3. Verify

- On page load, text should be fully visible with no color boxes.
- Scrolling to `top 80%` should trigger the animation (with delay if
  configured).
- Color boxes should appear on each word and then fall downward with
  varying trajectories and rotation.
- The underlying text should remain stationary throughout.
- On complete, color boxes should be hidden (not flickering or
  re-appearing).
- Lenis smooth scrolling should not conflict with the animation.

---

## Technique 9: Character Scatter Animation

Builds a scroll-triggered character scatter animation inspired by
[maxmilkin.com](https://maxmilkin.com). Text is broken into individual
characters that scatter into four groups — a vertical line on the left,
a vertical line on the right, and two random boxes in between — then
animate back to their original positions as the user scrolls. The effect
creates a dramatic "character explosion" reveal driven entirely by
scroll position.

**Core technique**: SplitText breaks text into characters. Characters
are randomly assigned to 4 groups (30% left line, 30% right line, 20%
left box, 20% right box). GSAP ScrollTrigger with `scrub: 1` pins the
wrapper and animates all characters from scattered positions back to
their original `offsetLeft`/`offsetTop` positions over `+=300%` scroll
distance. Lenis provides smooth scrolling. Stagger delays create a
cascading effect — line characters animate first (top-down), then box
characters follow.

**Dependencies**: GSAP (with ScrollTrigger and SplitText plugins) +
Lenis for smooth scrolling. The standalone version uses manual character
splitting since SplitText is a Membership plugin not available on CDN.

### How it works

1. **SplitText** — breaks the text into individual `<span>` characters,
   each with `display: inline-block` so they have measurable positions.
2. **Position capture** — each character's `offsetLeft` and `offsetTop`
   is recorded as the "home" position.
3. **Random group assignment** — indices are shuffled, then assigned:
   - **Left line** (first 30%): stacked vertically at 30% wrapper width
   - **Right line** (next 30%): stacked vertically at 70% wrapper width
   - **Left box** (half of remainder): random positions in a box by the left line
   - **Right box** (rest): random positions in a box by the right line
4. **Stagger delays** — `-lineIndex * 0.01` for line chars (top-down
   order), `-(charsPerLine * 0.01) + randomIndex * 0.01` for box chars.
5. **GSAP ScrollTrigger** — a timeline with `scrub: 1` and `pin: true`
   animates each character from its scattered `(left, top)` back to its
   captured `positions[i]` coordinates over the scroll range.
6. **Lenis** — smooth scrolling with `duration: 1.2` and exponential
   easing, synced with GSAP ticker.

### Before implementation (Technique 9)

| Source | Gather |
|---|---|
| **Conversation** | Target output: standalone site, Shopify section, or both. Text content to animate. Does the project already use GSAP SplitText (Membership plugin required)? |
| **Codebase** | If Next.js: ensure `gsap` and `lenis` are installed (`npm install gsap lenis`). SplitText is a GSAP Membership plugin — verify the license includes it. For standalone: GSAP and Lenis load from CDN; manual char splitting is used. |
| **MCP research** | Use `context7 resolve-library-id` for `gsap` and `lenis` to get latest versions. |

### Workflow (Technique 9)

#### 1. Choose output target

- **Standalone site**: serve `assets/scatter-text/standalone/`. Edit text
  content in `index.html`. Adjust animation timing in `app.js`.
  ⚠️ SplitText not on CDN — manual character splitting is used instead.
- **Shopify section**: copy `assets/scatter-text/shopify/sections/scatter-text.liquid`
  into the theme's `/sections`. Merchants edit text, colors, font size,
  and text width via the theme editor. ⚠️ Same CDN limitation — manual
  char splitting.
- **React/Next.js**: copy `assets/scatter-text/react/ScatterText.tsx` into
  the project. Pass `text` prop with the string to animate. Requires
  `gsap/SplitText` (Membership plugin) for proper char splitting.

#### 2. Configure parameters

| Parameter | Default | Description |
|---|---|---|
| `text` | (required) | The text string to scatter-animate |
| `lineHeight` | `15` | Pixel spacing between characters in line groups |
| `line1Fraction` | `0.3` | Left line X position as fraction of wrapper width |
| `line2Fraction` | `0.7` | Right line X position as fraction of wrapper width |
| `charsPerLineFraction` | `0.3` | Fraction of chars assigned to each line group |
| `scrubEnd` | `+=300%` | Scroll distance for the animation |
| `staggerFactor` | `0.01` | Delay multiplier for cascading effect |

#### 3. Verify

- On page load, characters should appear scattered (not in their
  original positions).
- Scrolling should bring characters smoothly back to their original
  positions with a cascading effect.
- The wrapper should be pinned during the scroll range.
- Lenis smooth scrolling should not conflict with the animation.
- Resize should recalculate positions (ScrollTrigger refresh handles
  this by re-running `init`).
- On complete, the text should be fully readable in its original layout.

---

## Technique 12: SVG Page Transition

Builds a premium page transition effect using SVG path drawing animated
by GSAP. When navigating between routes, a full-screen SVG path draws
across the screen while expanding in stroke width (leave), then redraws
while returning to normal stroke width (enter), creating a fluid,
cinematic page transition. Popularised by Awwwards-winning agency
portfolios.

**Core technique**: `next-transition-router` provides `leave` and `enter`
hooks. On leave, a GSAP timeline fades in the overlay and animates the
SVG path from `drawSVG: "0%"` to `"100%"` while growing `strokeWidth`
from 2 to 300. On enter, the path animates to `"100% 100%"` (retaining
the drawn state), stroke shrinks back to 2, overlay fades out, and the
path is reset to `"0%"` for the next transition.

**Dependencies**: `next-transition-router`, GSAP + DrawSVGPlugin (GSAP
Membership plugin required for DrawSVG).

### How it works

1. **TransitionRouter** — `next-transition-router` wraps the app and
   provides `leave` and `enter` callback hooks that fire on route change.
2. **Overlay container** — a fixed full-screen div with `opacity: 0` and
   `pointer-events: none` contains the SVG. The SVG is scaled `1.3×` to
   fill the screen regardless of viewport aspect ratio.
3. **SVG path** — a single cubic/quadratic bezier `<path>` with a long,
   winding curve. DrawSVGPlugin controls how much of the path is visible.
4. **Leave animation** — overlay fades to `opacity: 1` (0.5s), then the
   path draws from 0% to 100% while stroke expands from 2px to 300px
   (1.5s). Both animations start simultaneously. `next()` is called after
   the timeline completes, triggering the actual route change.
5. **Enter animation** — the path redraws from the start (`100% 100%`
   means "from beginning to end"), stroke shrinks back to 2px (1.5s),
   then overlay fades to `opacity: 0` (0.5s). After enter, the path is
   reset to `drawSVG: "0%"` so it's hidden for the next leave event.
6. **Cleanup** — each hook returns `() => tl.kill()` to prevent stale
   timelines if the component unmounts mid-transition.

### Before implementation (Technique 12)

| Source | Gather |
|---|---|
| **Conversation** | Target output: standalone site, Shopify section, or both. Do they use Next.js App Router? Custom SVG path or the default curly line? Preferred stroke color? |
| **Codebase** | Ensure `next-transition-router`, `gsap` are installed (`npm install next-transition-router gsap`). DrawSVGPlugin is a GSAP Membership plugin — verify the license includes it. |
| **MCP research** | Use `context7 resolve-library-id` for `gsap` and `next-transition-router`. |

### Workflow (Technique 12)

#### 1. Choose output target

- **Standalone site**: serve `assets/svg-page-transition/standalone/`.
  Edit the SVG path `d` attribute in `index.html` for a custom curve.
  ⚠️ Uses native `stroke-dashoffset` animation (no DrawSVG on CDN).
- **Shopify section**: copy
  `assets/svg-page-transition/shopify/sections/svg-page-transition.liquid`
  into the theme's `/sections`. Merchants set the stroke color via theme
  editor. ⚠️ CSS transition-based approach since GSAP is not available.
- **React/Next.js**: copy
  `assets/svg-page-transition/react/SVGPageTransition.tsx` into the
  project's components directory. Wrap the root layout with
  `<SVGPageTransition>`. Requires `gsap/DrawSVGPlugin` (Membership).

#### 2. Configure parameters

| Parameter | Default | Description |
|---|---|---|
| `strokeColor` | `#82A0FF` | Color of the SVG path stroke |
| `leaveDuration` | `1.5` | Duration of the leave (draw + expand) animation |
| `enterDuration` | `1.5` | Duration of the enter (redraw + shrink) animation |
| `maxStrokeWidth` | `300` | Maximum stroke width during leave expansion |
| `overlayClassName` | `''` | Additional classes for the overlay container |

#### 3. Verify

- Navigating between pages should trigger the SVG draw animation.
- On leave: overlay fades in, SVG path draws from one end, stroke expands.
- On enter: path redraws, stroke returns to normal, overlay fades out.
- The path should be reset after enter so it's not visible between pages.
- Rapid navigation should not cause overlapping timelines (returning
  `tl.kill()` prevents this).
- On refresh, the initial page should have no visible overlay.

---

## Technique 13: Overlapping Slider

Builds a fluid, draggable card slider where sliding cards overlap with
rotation, scale, and translate transforms — creating a unique 3D-like
stacking effect. Unlike traditional carousels, cards that slide past the
left edge rotate, shrink, and shift sideways, while cards in view remain
flat. Includes momentum physics for a polished feel.

**Core technique**: The `smooothy` library provides a lightweight,
lerp-based custom slider engine. Cards are rendered in a horizontal flex
row with `variableWidth: true` and `snap: false`. On each update frame,
cards past the left edge get a `transform` with `translateX`, `rotate`
(up to -15°), and `scale` (down to 0.6) based on how far they've moved.
A custom momentum system applies `slider.speed * multiplier` on drag
release, decaying by 0.96 each frame.

**Dependencies**: `smooothy` npm package for the slider engine. The
standalone version implements a lightweight custom slider from scratch.

### How it works

1. **Layout** — a 50/50 split: left side has title/description, right
   side has an `overflow: hidden` container with the horizontal card track.
2. **Card data** — each card has `text`, `username`, and `color`.
   Cards are `30vw × 40vw` with 2vw gap, rendered in a flex row.
3. **Slider engine** — `smooothy` creates a lerp-smoothed slider with
   `current` and `target` values. `lerpFactor: 0.02` controls smoothing.
   `setOffset` calculates end-stop so the last card aligns properly.
4. **On update** — in the `onUpdate` callback, each card's `offsetLeft +
   current` position is checked. If past the left edge (and not the last
   card), a `ratio` is calculated (`Math.min(1, |slideLeft| / width)`),
   and CSS transforms are applied: `translateX(current + |slideLeft| +
   ratio * 10vw)`, `rotate(-15° * ratio)`, `scale(1 - ratio * 0.4)`.
5. **Momentum** — on drag release, `slider.speed * 10` is captured as
   momentum, then decayed by 0.96 per frame. If momentum exceeds 0.5,
   it's added to `slider.target` each frame until it drops below threshold.
6. **Prevent select** — `user-select: none` and `selectstart` prevention
   stops text selection during drag. `touch-action: pan-y` allows vertical
   scroll while preventing horizontal touch interference.

### Before implementation (Technique 13)

| Source | Gather |
|---|---|
| **Conversation** | Target output: standalone site, Shopify section, or both. Slide content (text + username + color). Custom card dimensions or default 30vw×40vw? |
| **Codebase** | Ensure `smooothy` is installed (`npm install smooothy`). The standalone version is self-contained (no dependencies). |
| **MCP research** | Use `context7 resolve-library-id` for `smooothy` to get latest version. |

### Workflow (Technique 13)

#### 1. Choose output target

- **Standalone site**: serve `assets/overlapping-slider/standalone/`.
  Edit the `slidesData` array in `app.js` with your content and colors.
  No dependencies — lightweight custom slider built from scratch.
- **Shopify section**: copy
  `assets/overlapping-slider/shopify/sections/overlapping-slider.liquid`
  into the theme's `/sections`. Merchants add slide blocks with text,
  username, and background color via the theme editor.
- **React/Next.js**: copy
  `assets/overlapping-slider/react/OverlappingSlider.tsx` into the
  project's components directory. Import and use `<OverlappingSlider>`.
  Requires `smooothy` (`npm install smooothy`).

#### 2. Configure parameters

| Parameter | Default | Description |
|---|---|---|
| `slides` | (10 default quotes) | Array of `{ text, username, color }` objects |
| `cardWidth` | `30vw` | Width of each card |
| `cardHeight` | `40vw` | Height of each card |
| `gap` | `0.02` | Gap between cards as fraction of viewport width |
| `lerpFactor` | `0.02` | Smoothing factor (lower = smoother) |
| `speedDecay` | `0.97` | Speed decay factor for slider physics |
| `momentumMultiplier` | `10` | Multiplier for drag-release momentum |
| `title` | `"Star<br/>Inspired"` | Left panel title (HTML allowed) |
| `description` | `"A collection..."` | Left panel description text |

#### 3. Verify

- Cards should render in a horizontal row within the right panel.
- Dragging left should reveal more cards; the leftmost cards should
  rotate (-15° max), scale down (0.6 min), and shift sideways.
- On drag release, momentum should carry the slider smoothly.
- The slider should stop cleanly at the last card (no overscroll).
- Text selection should be disabled during drag.
- Touch should work on mobile with `touch-action: pan-y`.

---

## Choosing between techniques

| Factor | Frame-sequence | Shader dissolve | Card convergence | Shader loader | Fluid distortion | Pixel image | Fella nav | Fall text | Scatter text | Model scroll | Mask box reveal | SVG page transition | Overlapping slider |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Source** | Video (MP4) → WebP frames | Two images | 4–8 card images | Single shader overlay | 3D model (GLB) or procedural geometry | Single image per container | Navigation links | Text content | Text content | GLB 3D model | Full-screen video | SVG path | Card data (text + color) |
| **Dependencies** | None (vanilla JS) | Three.js + Lenis | GSAP + ScrollTrigger | Three.js + GSAP | R3F + drei + postprocessing + react-fluid-distortion | GSAP + Lenis | GSAP + ScrollTrigger | GSAP + ScrollTrigger + SplitText | GSAP + ScrollTrigger + SplitText + Lenis | R3F + drei + Lenis + three | None (vanilla JS) | next-transition-router + GSAP + DrawSVGPlugin | smooothy |
| **Performance** | Excellent (still images) | GPU-accelerated (shaders) | Excellent (DOM transform) | GPU-accelerated (shader) | GPU-accelerated (fluid sim) | Excellent (Canvas 2D) | Excellent (DOM) | Excellent (DOM transform) | Excellent (DOM transform) | GPU-accelerated (WebGL) | Excellent (Canvas 2D) | Excellent (DOM + SVG) | Excellent (DOM transform) |
| **Visual effect** | 3D product transform | Dissolve + edge glow | Scatter-to-center | Pixelation + noise + glow reveal | Fluid distortion + bloom + 3D model | Progressive pixelation reveal | Clip-path nav reveal | Falling color blocks | Character scatter return | 3D model Y-rotation | Video clip-through masks | SVG path draw with expanding stroke | Overlapping card transforms |
| **Build step** | ffmpeg only | npm install + bundler | None (CDN) or npm install | None (CDN) or npm install | npm install (R3F ecosystem) | npm install or None (CDN) | None (CDN) or npm install | None (CDN) or npm install | None (CDN) or npm install | npm install (R3F ecosystem) | None | npm install (next-transition-router, gsap) | npm install smooothy |
| **Customisation** | Frame timing, overlay copy | Shader params, centre point | Card count, offsets, rotation range | Glow colour, prompt text, duration | Fluid colour, curl, model path | Pixel steps, speed, trigger point | Link labels, colours | Text, colour, delay, fall range | Text, line positions, stagger timing | Model path, scale, env preset | Mask size, position, borders | SVG path, stroke colour, duration | Slides, colors, card size, momentum |
| **Fallback** | Static first frame | Static bottom image | Static card positions | Static black screen | TorusKnot geometry | Static image | Regular nav list | Raw text without overlays | Raw text without splitting | TorusKnot fallback mesh | Static video frame | No transition | Static card list |

---

## What this skill does NOT do

- Does not generate product images/video via AI — assume that asset already
  exists or is produced separately.
- Does not use Canva, CapCut, or any other GUI video editor — all video
  processing goes through `scripts/*.sh` (ffmpeg).
- Does not bundle GSAP or any scroll-animation library by default for
  Technique 1. Technique 2 uses Lenis by design. Technique 3 uses GSAP
  ScrollTrigger by design. Technique 4 uses GSAP by design for the
  transition animation and Three.js for the shader rendering.
  Technique 5 uses the R3F ecosystem (fiber, drei, postprocessing,
  react-fluid-distortion) for fluid simulation. Technique 6 uses GSAP
  ScrollTrigger for the pixelation reveal and Lenis for smooth
  scrolling.

## Reference files

| File | Read when |
|---|---|
| `references/perf-and-frame-budget.md` | Technique 1 — deciding frame count/resolution, preloading strategy |
| `references/browser-scroll-apis.md` | Technique 1 — frames-vs-video mode, CSS scroll-timeline vs JS |
| `references/shopify-section-schema.md` | Any Shopify section work — schema fields, blocks, conventions |

## Scripts

| Script | Purpose |
|---|---|
| `scripts/build-loop.sh` | Merge forward+reverse clips into a seamless loop video |
| `scripts/extract-frames.sh` | Convert a video into a DPR-aware WebP frame sequence |

Both require `ffmpeg`/`ffprobe` on PATH and print an install hint if missing.

## Asset files

### Technique 1 (frame-sequence scrubbing)

| File | Use when |
|---|---|
| `assets/frame-sequence/standalone/scroll-story.js` | Vanilla JS engine for both standalone and Shopify |
| `assets/frame-sequence/standalone/scroll-story.css` | Shared styles |
| `assets/frame-sequence/standalone/index.html` | Standalone site demo |
| `assets/frame-sequence/react/ScrollStory.tsx` | React/Next.js client component |
| `assets/frame-sequence/shopify/sections/scroll-story.liquid` | Shopify Online Store 2.0 section |

### Technique 2 (shader dissolve)

| File | Use when |
|---|---|
| `assets/shader-dissolve/standalone/app.js` | Three.js + Lenis app with shaders |
| `assets/shader-dissolve/standalone/style.css` | Layout and container styles |
| `assets/shader-dissolve/standalone/index.html` | Standalone site with CDN imports |
| `assets/shader-dissolve/react/ShaderDissolve.tsx` | React/Next.js client component |
| `assets/shader-dissolve/shopify/sections/shader-dissolve.liquid` | Shopify Online Store 2.0 section |

### Technique 3 (card convergence)

| File | Use when |
|---|---|
| `assets/card-convergence/standalone/app.js` | GSAP ScrollTrigger logic with Lenis smooth scrolling |
| `assets/card-convergence/standalone/style.css` | Layout and card styles |
| `assets/card-convergence/standalone/index.html` | Standalone site demo |
| `assets/card-convergence/react/CardConvergence.tsx` | React/Next.js client component |
| `assets/card-convergence/shopify/sections/card-convergence.liquid` | Shopify Online Store 2.0 section |

### Technique 4 (shader loader)

| File | Use when |
|---|---|
| `assets/shader-loader/standalone/app.js` | Three.js + GSAP loader with full shader logic |
| `assets/shader-loader/standalone/style.css` | Loader overlay and hero section styles |
| `assets/shader-loader/standalone/index.html` | Standalone site demo |
| `assets/shader-loader/react/ShaderLoader.tsx` | React/Next.js client component |
| `assets/shader-loader/shopify/sections/shader-loader.liquid` | Shopify Online Store 2.0 section |

### Technique 5 (fluid distortion)

| File | Use when |
|---|---|
| `assets/fluid-distortion/standalone/app.js` | Three.js scene with orbit controls and rotating geometry |
| `assets/fluid-distortion/standalone/style.css` | Hero overlay and typography styles |
| `assets/fluid-distortion/standalone/index.html` | Standalone site demo |
| `assets/fluid-distortion/react/FluidDistortion.tsx` | React/Next.js client component with R3F and fluid effect |
| `assets/fluid-distortion/shopify/sections/fluid-distortion.liquid` | Shopify Online Store 2.0 section |
| `assets/fluid-distortion/shopify/sections/fluid-distortion.css` | Shopify section styles |

### Technique 8 (fall text)

| File | Use when |
|---|---|
| `assets/fall-text/standalone/index.html` | Standalone site demo |
| `assets/fall-text/standalone/style.css` | Layout and container styles |
| `assets/fall-text/standalone/app.js` | Pure JS animation logic with manual word splitting |
| `assets/fall-text/react/FallText.tsx` | React/Next.js client component |
| `assets/fall-text/shopify/sections/fall-text.liquid` | Shopify Online Store 2.0 section |

### Technique 9 (scatter text)

| File | Use when |
|---|---|
| `assets/scatter-text/standalone/index.html` | Standalone site demo |
| `assets/scatter-text/standalone/style.css` | Layout and container styles |
| `assets/scatter-text/standalone/app.js` | Pure JS animation logic with manual char splitting |
| `assets/scatter-text/react/ScatterText.tsx` | React/Next.js client component |
| `assets/scatter-text/shopify/sections/scatter-text.liquid` | Shopify Online Store 2.0 section |

### Technique 10 (model scroll)

| File | Use when |
|---|---|
| `assets/model-scroll/standalone/index.html` | Standalone site demo with Three.js CDN |
| `assets/model-scroll/standalone/style.css` | Layout with fixed model and scrolling content |
| `assets/model-scroll/standalone/app.js` | Three.js GLB loader + scroll-based Y rotation |
| `assets/model-scroll/react/ModelScroll.tsx` | R3F component with useLenis scroll progress |
| `assets/model-scroll/shopify/sections/model-scroll.liquid` | Shopify section using `<model-viewer>` web component |
| `assets/model-scroll/shopify/assets/model-scroll.css` | Shopify section styles |

### Technique 11 (mask box reveal)

| File | Use when |
|---|---|
| `assets/mask-box-reveal/standalone/index.html` | Standalone site demo with Tailwind CDN |
| `assets/mask-box-reveal/standalone/style.css` | Mask box and canvas styles |
| `assets/mask-box-reveal/standalone/app.js` | Video clipping + drag logic |
| `assets/mask-box-reveal/react/MaskBoxReveal.tsx` | React/Next.js client component with Canvas 2D |
| `assets/mask-box-reveal/shopify/sections/mask-box-reveal.liquid` | Shopify Online Store 2.0 section |
| `assets/mask-box-reveal/shopify/assets/mask-box-reveal.css` | Shopify section styles |

### Technique 12 (svg page transition)

| File | Use when |
|---|---|
| `assets/svg-page-transition/standalone/index.html` | Standalone site demo |
| `assets/svg-page-transition/standalone/style.css` | Overlay and SVG styles |
| `assets/svg-page-transition/standalone/app.js` | stroke-dashoffset animation + page swap logic |
| `assets/svg-page-transition/react/SVGPageTransition.tsx` | React/Next.js component with next-transition-router |
| `assets/svg-page-transition/shopify/sections/svg-page-transition.liquid` | Shopify section using CSS transitions |
| `assets/svg-page-transition/shopify/assets/svg-page-transition.css` | Shopify section styles |

### Technique 13 (overlapping slider)

| File | Use when |
|---|---|
| `assets/overlapping-slider/standalone/index.html` | Standalone site demo |
| `assets/overlapping-slider/standalone/style.css` | Split panel layout and card transform styles |
| `assets/overlapping-slider/standalone/app.js` | Custom slider engine with momentum physics |
| `assets/overlapping-slider/react/OverlappingSlider.tsx` | React/Next.js client component using `smooothy` |
| `assets/overlapping-slider/shopify/sections/overlapping-slider.liquid` | Shopify Online Store 2.0 section |
| `assets/overlapping-slider/shopify/assets/overlapping-slider.css` | Shopify section styles |

### Technique 14 (char-reveal heading)

Scroll-triggered character-by-character reveal animation for headings. Characters start translated down and transparent, then animate up into position with staggered timing on scroll. Supports optional highlight words that animate to an accent color. Reusable component pattern.

| File | Use when |
|---|---|
| `assets/char-reveal-heading/react/CharRevealHeading.tsx` | React/Next.js reusable heading component |
