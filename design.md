# Design Directions — 3 Variations

> Companion to `redesign-plan.md`. Pick one (or mix a palette with another's structure).
> Discipline (hallmark): these are three genuinely different *structures*, not one layout in three colours. All three keep **Clash Display + Satoshi** and the existing semantic token names, so any choice is a value swap plus the section changes noted.
> `/* pre-emit critique: P4 H4 E4 S4 R5 V5 */`

---

## Variation 1 — **Operator**

*"The engineer who runs your AI workforce." Terminal-room confidence: dark, precise, alive.*

The closest evolution of the current site — keeps the blue heritage but pushes it from "developer portfolio" to "operations console". Feels like the room where the agents run.

### Palette (primitives)

| Token | Dark (default) | Light | Role |
|---|---|---|---|
| `--ink-950` | `#0B0E13` | `#F7F8FA` | page background |
| `--ink-900` | `#11151C` | `#FFFFFF` | cards |
| `--ink-800` | `#1A2029` | `#EDEFF3` | muted surfaces |
| `--brand-500` | `#3D7BFF` | `#2B5CE6` | accent (evolved from #3a69ff — slightly more electric) |
| `--brand-400` | `#6B9AFF` | `#3D7BFF` | accent hover (dark) / links |
| `--signal-500` | `#2FD97B` | `#1FA860` | "live/running" markers only — availability dot, agent status chips |
| `--line-700` | `#232B37` | `#D8DCE3` | borders, hairlines |
| text | `#E8ECF2` / `#8A94A6` muted | `#171C26` / `#5A6372` | foreground / muted |

Signal green is **quarantined**: status and availability only, never decoration. Everything else is blue + neutrals — tightest version of the mono-accent discipline.

### Typography & texture

- Clash Display 600 for section heads (current scale kept), **JetBrains Mono** (or Satoshi small-caps if no third font wanted) for eyebrows, stat labels, and the comparison strip — the "console" voice.
- Texture: 2% noise overlay on `--ink-950`, 1px hairline grid lines in the hero background (CSS, not image). No gradients except a single radial glow behind the hero device.

### Structure & hero

Workbench/stat-led macrostructure. Hero is a **split diptych**: left = headline + CTAs; right = the Human-vs-FTE comparison rendered as a **terminal card** (mono font, green "ONLINE" row for the FTE column) — your photo moves to the founder bar below, small and round. Dense sections, tight vertical rhythm (`py-16` baseline), hairline dividers between all sections.

### Animation package

| Where | Technique |
|---|---|
| Headline | **scatter-text** (chars snap into place — mechanical, fits the mood) |
| Nav | **fella-nav** full-screen menu with indicator |
| Services | **card-convergence** |
| FTE story | **frame-sequence** (3-act: idle terminal → agents fan out → work products stack) |

### Signals / risks

**Signals:** senior, technical, "this person operates real systems." Best match for FDE positioning and a technical buyer.
**Risks:** darkest of the three; non-technical SMB clients may find it cold. The mono font is a third font (~15 KB more) unless you use Satoshi small-caps.

---

## Variation 2 — **Ember**

*"AI with a human hand on it." Warm editorial dark — charcoal and amber instead of tech blue.*

The contrarian move: every AI agency is blue or purple. Ember is warm — it says *craftsman*, not *vendor*. Strongest brand differentiation of the three.

### Palette (primitives)

| Token | Dark (default) | Light | Role |
|---|---|---|---|
| `--ink-950` | `#171310` | `#FAF7F2` (warm paper) | page background |
| `--ink-900` | `#201B16` | `#FFFFFF` | cards |
| `--ink-800` | `#2B241D` | `#F1EBE2` | muted surfaces |
| `--brand-500` | `#FF8A3D` | `#E06414` | ember orange accent |
| `--brand-400` | `#FFB07A` | `#FF8A3D` | hover / highlights |
| `--brand-600` | `#D96A1E` | `#B84E0A` | pressed / deep accent |
| `--line-700` | `#3A3128` | `#E2D9CC` | borders |
| text | `#F2EDE6` (cream) / `#A99F92` muted | `#26201A` / `#6E6355` | foreground / muted |

No secondary accent at all — ember + cream + charcoal carries everything. Blog tag reds and rainbow service icons get remapped to ember-tint monochrome (this variation **overrides** the "rainbow icons stay" decision — flag if that's a dealbreaker).

### Typography & texture

- Clash Display at **500 weight, larger sizes** — editorial masthead feel; Satoshi *italic* for pull-lines and image captions.
- Texture: heavy grain (4% noise), warm radial vignette on section edges. Cards get `1px` warm borders, no glows.

### Structure & hero

Manifesto/letter macrostructure. Hero is **statement-led**: one huge two-line headline ("Your next hire doesn't need a desk." — final copy via humanizer), sub-line, single CTA. The comparison strip becomes a **typographic ledger** below the fold — two columns of set text, no card chrome. Photo appears in the founder bar, duotone-warm treated. Generous whitespace, `py-24` rhythm, sections separated by single hairlines with small-caps running heads (editorial genre).

### Animation package

| Where | Technique |
|---|---|
| Headline | **fall-text** (words assemble from falling amber colour-blocks — literally embers settling) |
| Products | **shader-dissolve** between product screenshots (edge-glow tinted `--brand-500`) |
| Services | **card-convergence** (slower, heavier ease) |
| FTE story | **frame-sequence** (same 3 acts, warm-graded video) |

### Signals / risks

**Signals:** distinctive, confident, premium consultancy. Nobody will confuse you with another blue AI agency.
**Risks:** biggest departure — theme-color, OG images, Octively cross-branding (Octively is cool-toned; the ecosystems won't match). Orange CTAs need contrast care in light mode (AA-check `#E06414` on `#FAF7F2`).

---

## Variation 3 — **Lumen**

*"Product-grade." Light-first, Apple-ish — the site itself feels like a polished SaaS product.*

Flips the default: **light theme first**, dark as the toggle. Matches Octively's own light marketing site, so founder brand and product brand rhyme. Sells to business buyers who live in daylight-mode dashboards.

### Palette (primitives)

| Token | Light (default) | Dark | Role |
|---|---|---|---|
| `--ink-950` | `#FAFBFD` | `#0E1018` | page background |
| `--ink-900` | `#FFFFFF` | `#151827` | cards |
| `--ink-800` | `#EFF2F7` | `#1D2133` | muted surfaces |
| `--brand-500` | `#4F46E5` | `#7C74FF` | indigo-violet accent |
| `--brand-400` | `#6E66F0` | `#9A93FF` | hover |
| `--halo` | `#4F46E51A` | `#7C74FF26` | soft glow washes (component layer) |
| `--line-700` | `#E3E7EF` | `#262B42` | borders |
| text | `#151827` / `#5D6478` | `#EEF0FA` / `#9AA1B9` | foreground / muted |

Depth from **soft shadows + halo washes**, not borders: cards float on `box-shadow: 0 1px 2px, 0 8px 24px` at low alpha.

### Typography & texture

- Clash Display 600, tighter tracking at display sizes; Satoshi 400/500 body — unchanged but set on light ground (feels new for free).
- Texture: none — clean surfaces, one indigo halo gradient behind the hero device. This variation wins by omission.

### Structure & hero

Product-page macrostructure (Apple sequence). Hero is **centered device-led**: headline, sub, CTA, then a large product frame — an actual screenshot composition of your agents/Octively admin — floating on the halo. Comparison strip renders as a **segmented control** above the frame ("Human hire | Digital FTE") that swaps the frame's annotation labels. Services become a **bento grid** (2 large flagship tiles: Digital FTEs + Octively; 4 small). Roomy `py-24` rhythm.

### Animation package

| Where | Technique |
|---|---|
| Routes | **svg-page-transition** (indigo path draw — the premium tell) |
| FTE story | **frame-sequence** or **model-scroll** if a meaningful GLB exists |
| Projects | **pixel-image** thumbnail reveals |
| Services | Framer Motion bento stagger only (no GSAP here — restraint) |

### Signals / risks

**Signals:** product company, trustworthy, "this person ships polished software." Best conversion fit for SMB/agency buyers; best synergy with Octively.
**Risks:** light-first means re-shooting the OG image and re-grading project screenshots (many are dark). Your photo's dark backdrop needs re-treatment. Least "portfolio-cool", most "business."

---

## Side-by-side

| | **Operator** | **Ember** | **Lumen** |
|---|---|---|---|
| Default theme | Dark | Dark (warm) | **Light** |
| Accent | Electric blue + signal green | Ember orange | Indigo-violet |
| Mood | Ops console | Editorial craftsman | Polished product |
| Hero device | Terminal comparison card | Typographic statement | Floating product frame |
| Signature FX | scatter-text + fella-nav | fall-text + shader-dissolve | svg-page-transition + pixel-image |
| Migration cost | **Lowest** (blue heritage) | Highest (full warm regrade) | Medium (asset re-grading) |
| Differentiation | Medium | **Highest** | Medium |
| Octively synergy | Medium | Low | **Highest** |
| Best buyer | Technical founders/CTOs | Brand-conscious SMBs | Business owners/agencies |

**My recommendation:** **Operator** if the goal is FDE/technical-consulting leads this quarter (cheapest to ship, truest to you); **Lumen** if Octively growth is the priority and the site should feed the product. Ember only if you want the brand bet and accept re-grading everything.

All three inherit the same plan: IA from `redesign-plan.md` §2, services order §3, animation restraint rule §4, token layers §5, honest copy §6.
