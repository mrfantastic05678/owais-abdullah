# Portfolio Redesign Plan — AI-First Repositioning

> Owner: Owais Abdullah · Date: 2026-07-08
> Companion file: `design.md` (3 visual directions to choose from)
> Skills used: hallmark (structure/anti-slop discipline), frontend-designer (animation choreography + token mandate), ui-ux-pro-max (palette/type logic), scroll-story-3d (animation techniques), humanizer (copy voice)

---

## 1. Why this redesign

The current site says "developer portfolio." The business has moved on: you're the founder of a launched SaaS (Octively), you build Digital FTEs professionally, and your competitor set is now AI automation agencies (bitscalebot.com), not other freelancer portfolios. The site needs to sell **outcomes for businesses first** and show developer credibility second.

**Positioning shift:**

| | Current site | New site |
|---|---|---|
| Identity | "Spec-Driven Developer & AI Engineer" | "I build AI employees and the systems around them" |
| Leads with | Skills and tech stack | Services and shipped products |
| Services order | Mixed (FTE, agents, SaaS, CMS, consulting, API) | AI first: Digital FTEs → AI Agents → Chatbots → Automation → then Web/App |
| Proof | Project count | Founder proof (Octively, live), client work, FTE systems |

**What we learned from bitscalebot.com** (and deliberately adapt, not copy):
- Hero carries a **Human vs Digital FTE comparison** — instantly explains the category. We do our own version with honest, qualitative rows.
- **"We Build, We Don't Consult"** — a stance, not a feature list. Your equivalent stance: *"I ship working systems, not slide decks."* (final copy TBD in implementation, humanizer pass required)
- Services ordered AI-first with web/mobile development **last** — signals where the value is.
- **FAQ section** — doubles as GEO/AI-search food. We don't have one; we should.
- Stats row — we only use numbers we can defend (see Honest Copy rule below).

**What we keep from the current site** (already good):
- Clash Display + Satoshi (premium, recently shipped — brand equity)
- Dark-first theme, single-accent discipline, CSS variable token system
- Server-rendered projects/blog (ISR), JSON-LD, llms.txt, sitemap
- Working sections: Projects tabs, Blog, Experience timeline, Resend contact form

---

## 2. New information architecture (homepage)

Section order, top to bottom. Each row names the scroll-story-3d technique used (if any) — see §4 for the restraint rule.

| # | Section | Content | Animation |
|---|---------|---------|-----------|
| 1 | **Nav** | Existing header; full-screen menu upgrade optional | **fella-nav** (variation-dependent) |
| 2 | **Hero** | New headline + sub + CTA pair + **Human vs Digital FTE strip** | **scatter-text** or **fall-text** on headline (per chosen variation) |
| 3 | **Founder proof bar** | One line: "Founder of Octively · Senior Dev at LionUp Digital & AA Marketing" with logos/links | none (static credibility) |
| 4 | **Services** | 6 cards, AI-first order (see §3) | **card-convergence** on scroll-in |
| 5 | **Digital FTE story** | NEW flagship section: pinned scroll story explaining what a Digital FTE is — inbox → agent → done-work, 3 acts | **frame-sequence** (needs a source video) or **model-scroll** fallback |
| 6 | **Products** (founder proof) | Octively featured large + TeamFlow, GigBillow, Visati as support | **shader-dissolve** between product shots, or **overlapping-slider** |
| 7 | **Process** | 4 steps: Spec → Build → Deploy → Operate (spec-driven story as client benefit) | simple stagger (Framer Motion, existing) |
| 8 | **Tech stack** | Existing SkillSlider, kept | existing marquee (keep) |
| 9 | **Projects** | Existing tabs section, kept | **pixel-image** reveal on card thumbnails (optional, variation-dependent) |
| 10 | **Blog** | Existing, kept | existing |
| 11 | **Experience** | Existing timeline, kept | existing |
| 12 | **FAQ** | NEW — 6–8 questions ("What is a Digital FTE?", "How long does an AI chatbot take?", pricing model, stack, handover, support) with FAQPage JSON-LD | accordion (existing shadcn) |
| 13 | **Contact** | Existing Resend form; availability card replaces stock photo (already planned) | existing |
| — | **Page transitions** | Between routes | **svg-page-transition** (variation-dependent) |

**Removed/demoted:** the About two-column section merges into the hero + founder bar (its copy was redundant with the hero paragraph). `/about` page stays for SEO.

### Hero comparison strip (the bitscale device, done honestly)

Three-column mini-table, qualitative only — no invented percentages:

| | Human hire | Digital FTE |
|---|---|---|
| Hours | 9–5, weekends off | 24/7 |
| Ramp-up | Weeks of onboarding | Deployed with your SOPs |
| Scaling | Hire again | Clone the agent |
| Consistency | Varies | Same output every run |

Rendered as a compact card in the hero's right column (replacing or sitting under the photo — variation-dependent; see `design.md`).

---

## 3. Services repositioning

New order and naming (update `data/services.ts` and `data/profile.ts` summary):

1. **Digital FTEs (AI Employees)** — flagship. Autonomous agents that own a role: inbox management, reporting, operations. Proof: Digital-FTE tier system, personal-bot.
2. **AI Agent Systems** — multi-agent orchestration, OpenAI Agents SDK, MCP tooling, memory pipelines.
3. **AI Chatbots & Conversational AI** — RAG chatbots, embeddable widgets. Proof: **Octively (founder)**.
4. **Workflow Automation & AI Integration** — n8n, content pipelines (ContentSpark AI), API glue.
5. **SaaS & Web App Development** — Next.js products end-to-end. Proof: TeamFlow, RentParlo, Visati.
6. **CMS & E-commerce** — Sanity, WordPress, Shopify (kept, last — it's real revenue but not the brand lead).

Each card: what it is (1 sentence), what you get (3 bullets), one proof link. Copy passes through humanizer — no "transform your business", no "cutting-edge", no "seamless".

**Knock-on updates:** profile API `summary`, hero sub-paragraph, llms.txt services list, `/services` page order, service JSON-LD.

---

## 4. Animation plan (scroll-story-3d skill)

**Restraint rule (hallmark):** maximum **3 signature scroll moments** on the homepage + 1 global (nav or page transition). Everything else uses the existing lightweight Framer Motion entrances. All effects require:

- `prefers-reduced-motion` fallback (static first frame / no pin) — already have the CSS kill-switch, each new component must honor it in JS too (`gsap.matchMedia`)
- Dynamic import with `ssr: false`, IntersectionObserver-gated init (no GSAP/Three on first paint)
- Mobile budget: frame-sequence ≤ ~120 WebP frames @ 720p; Three.js scenes get `dpr={[1, 1.5]}` cap

**The three signature moments (default recommendation):**

| Moment | Technique | Asset needed | Effort |
|---|---|---|---|
| Hero headline | **scatter-text** (chars scatter → assemble, scrub) | none (text) | S |
| Digital FTE story (§2 #5) | **frame-sequence** 3-act scrub | a 6–10s source video (AI-generate separately — out of skill scope) | M–L |
| Services entrance | **card-convergence** (6 cards scatter → grid) | existing card content | S–M |

**Variation-dependent extras** (each design direction in `design.md` picks at most one):
- **fella-nav** full-screen menu (Operator direction)
- **svg-page-transition** route transitions (Lumen direction)
- **shader-dissolve** product-shot crossfades in Products section (Ember direction)
- **model-scroll** 3D object rotation — only if we produce/buy a GLB that means something (a robot/agent figure); otherwise skip. Placeholder 3D for its own sake is slop.

**Explicitly not used (for now):** fluid-distortion (competes with frame-sequence hero), mask-box-reveal (needs a showreel video we don't have), shader-loader (loading screens hurt LCP on a portfolio), overlapping-slider (only if Products section outgrows a grid).

---

## 5. Brand token architecture

Three layers (design-system convention), replacing the current flat variable list in `app/globals.css`. The **semantic layer keeps the existing names** (`--background`, `--accent`, `--card`…) so every component keeps working — we swap values, not call sites.

```css
/* Layer 1 — primitives (raw scales, never used directly in components) */
:root {
  --ink-950: …;  --ink-900: …;  --ink-800: …;   /* surfaces */
  --brand-500: …; --brand-400: …; --brand-600: …; /* accent scale */
  --signal-500: …;                                 /* success/live */
  /* values come from the chosen variation in design.md */
}

/* Layer 2 — semantic (existing names, existing components untouched) */
:root { --background: var(--ink-…); --accent: var(--brand-500); … }
.dark  { … }

/* Layer 3 — component (only where a component needs its own knob) */
:root { --hero-glow: …; --card-hover-border: …; }
```

Rules (frontend-designer mandate, already project law): no hex in components; new needs become new named tokens; `--accent-hover` pattern continues; Tailwind config maps semantic layer only.

Typography stays **Clash Display + Satoshi** in all three variations (recent investment, distinctive, zero migration cost). Variations differentiate via scale, weight, case, and one optional mono accent (JetBrains Mono for the Operator direction's labels/numbers).

---

## 6. Copy direction (humanizer rules)

- First person ("I build…"), never "we" — it's a personal brand with founder proof, not a fake agency. (If you'd rather present as a studio/agency like bitscale, say so — that changes hero, footer, and legal pages.)
- Banned: *transform, empower, seamless, cutting-edge, leverage, elevate, unlock*
- Every claim is checkable: "Founder of Octively", "40+ projects", "3+ years", role titles. No invented metrics, testimonials, or logos.
- Section eyebrows stay short and concrete ("What I build", "How it works", "Questions I get").

---

## 7. Implementation phases

| Phase | Scope | Risk |
|---|---|---|
| **P1 — Brand swap** | Chosen variation's tokens into globals.css (3-layer), tailwind mapping, manifest/theme-color, OG image regen | Low — values only |
| **P2 — IA & copy** | New hero + comparison strip, founder bar, services reorder (`data/services.ts`), FAQ section + JSON-LD, About merge, llms.txt/profile summary | Medium |
| **P3 — Signature animations** | scatter-text hero → card-convergence services → FTE frame-sequence (needs video asset first) | Medium — each behind reduced-motion + dynamic import |
| **P4 — Variation extras** | fella-nav / svg-page-transition / shader-dissolve per chosen direction; pixel-image project thumbs | Low, optional |
| **P5 — Verify & ship** | tsc + build, Lighthouse (LCP/CLS budget: no regression vs current), agent-browser screenshots desktop/375px, both themes, push origin+client | — |

**Asset dependency:** the FTE frame-sequence needs a source video (AI-generated or screen-recorded product footage). P3 can ship with scatter-text + card-convergence first and add the FTE story when the video exists.

---

## 8. Decision needed from you

1. **Pick a direction** from `design.md` (Operator / Ember / Lumen) — or mix (e.g. Operator palette + Lumen's light-first stance).
2. **Personal brand vs studio brand** — "I" or a studio name? (affects all copy)
3. **FTE story video** — do you want to AI-generate one now, or ship P1–P2 first?
