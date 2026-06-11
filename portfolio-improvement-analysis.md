# Portfolio Improvement Analysis — owaisabdullah.dev

> Audit date: 2026-06-11
> Scope: code review (profile API, Hero, About, Services, Contact, Experience, ProjectsTab, BlogSection, layout, globals.css), live screenshots, UX-evaluator framework, and Vercel Web Interface Guidelines.

## Implementation status (2026-06-12)

**Done:**
- ✅ P1.1 Projects & blog server-rendered — data extracted to `data/profile.ts`, blog fetched via `lib/blogs.ts` server component; homepage/blog use ISR (30 min)
- ✅ P1.2 Cache-busting removed (image `?v=` params, `no-store` fetches)
- ✅ P1.3 Experience timeline driven from shared data; LionUp + AA Marketing confirmed concurrent; OneKlick ended 2024; Burraq Digits added; year text de-emphasized, spacing tightened
- ✅ P1.4 Blog heading → "From the Blog / Latest Articles"; red empty state neutralized
- ✅ P1.5 Dead "#" links → "Private client work" label instead of broken CTA
- ✅ P1.7 "full-time digital solutions" copy fixed everywhere → "Digital FTEs (AI employees)"; hero badge → "Available for SaaS & AI Agent Projects"
- ✅ P1.8 Skills deduplicated
- ✅ P2.10 Hero hardcoded grays → theme tokens (light mode fixed)
- ✅ P2.11 Fonts: Clash Display + Satoshi via next/font/local (~116 KB total); Google Fonts @import removed
- ✅ P2.12 Eyebrow `<h3>`→`<p>` across all sections; Contact labels fixed
- ✅ P2.13 Hero: `<Link><button>` nesting fixed, image optimization enabled, aria-labels added
- ✅ P2.15 Skill slider: real brand icons (react-icons/si); `prefers-reduced-motion` honored
- ✅ P2.16 Contact: autocomplete attrs, phone formatted, label semantics
- ✅ P3: tab refetch bug, 800ms fake delay, twitter image, theme-color, footer aria-labels + dynamic year

**Also done (second pass):**
- ✅ P3 `public/llms.txt` added for AI crawlers
- ✅ P3 Project tab state deep-links via `?tab=` (history.replaceState, keeps static rendering)

**Still open (decisions needed or larger work):**
- ⬜ P1.6 Trim learning projects / value-based categories (content decision)
- ⬜ P2.9 Color identity pass (mono-accent vs. defined accent set)
- ⬜ P2.13 Static hero headline vs. typewriter (design decision)

**Keeping as-is (owner decision, 2026-06-12):**
- P2.14 Dual navbar (header + floating pill)
- P2.16 Contact form Formspree redirect
- P1.4 Current blog thumbnails

## TL;DR

The portfolio is solid structurally — good section flow, working dark theme, strong SEO metadata, JSON-LD, and a clear "AI + Next.js" positioning. The three things holding it back most:

1. **Projects and blog content are invisible to crawlers** — fetched client-side, so Google and AI models see only skeletons.
2. **Data inconsistencies** (overlapping "Present" jobs, duplicate skills, "Our Blog Posts" on a personal site) that undermine the "spec-driven, production-ready" claim.
3. **Diluted visual identity** — one blue accent fighting with rainbow service icons, 3 font families, and hardcoded grays that break light mode.

---

## P1 — Hurts credibility or conversion

### 1. Projects & blog are client-side only — invisible to Google and AI crawlers
- `components/ProjectsTab.tsx:60` fetches `/api/profile?ts=${Date.now()}` with `cache: "no-store"` from a `useEffect`; `components/BlogSection.tsx:51` does the same for blogs.
- The homepage is `force-static`, so the HTML crawlers see contains only skeletons — none of the 40+ projects or blog posts.
- Given the stated focus on AI-era SEO (being citable by AI models), this is the single biggest issue.
- **Fix:** The project data lives in the same repo (`app/api/profile/route.ts`) — extract it into a shared data module imported by a **server component**. Also kills the skeleton-flash on every visit.

### 2. Cache-busting is actively harming performance
- `?v=${Date.now()}` on every project image (`ProjectsTab.tsx:49-55`) plus `no-store` means every visitor re-downloads every screenshot on every visit.
- **Fix:** Rename changed image files instead and let the CDN cache.

### 3. Experience timeline contradicts the profile API and reads oddly
- `components/Experience.tsx` shows **two overlapping "Present" roles** (LionUp 2025–Present, AA Marketing 2024–Present) — recruiters notice this.
- The API (`app/api/profile/route.ts:576-625`) disagrees: it says OneKlick is 2023–Present and includes Burraq Digits, which the timeline omits.
- **Fix:** One source of truth, clearly resolved dates.
- Visual weight is inverted: the *years* are huge display text while the role title is small, with enormous empty vertical space per entry. The role/company should dominate.

### 4. "Our Blog Posts" / "Latest News" on a personal site
- `components/BlogSection.tsx:82-88` — "Our" breaks the personal brand. Use "From My Blog" or just "Blog".
- The AI-fantasy-art thumbnails clash with the professional dev positioning — consistent branded thumbnails (title + accent color) would look far more intentional.

### 5. Dead and confusing links
- Many projects have `link: "#"` or `repoUrl: "#"` (`app/api/profile/route.ts:141, 236, 256, 263-266`, …).
- Clicking "View Project" and going nowhere is worse than no link — omit the CTA or label it "Private client work".

### 6. Learning projects dilute the portfolio
- "First Practice Portfolio Website", "Assignment Projects", "Calculator Agent", "Next.js First App" sit beside FurnitureMart and TeamFlow. For client/employer conversion, 15 strong projects beat 40 mixed ones.
- Tabs are tech-named ("Next.js", "WordPress", "HTML & CSS") while CLAUDE.md itself defines value-based categories (AI Tool, Marketplace, SaaS, E-commerce) — value categories sell better than stack names.

### 7. "Full-time digital solutions" copy bug
- The API summary, page metadata, and Hero all say "full-time digital solutions/products" — a garbled version of "Digital FTE (full-time equivalent employee)". As written it's meaningless to visitors.
- **Fix:** Either spell out the concept ("AI employees that work like full-time staff") or drop it. "FTE" in the hero badge ("Available for FTE & SaaS Projects") is jargon most clients won't parse.

### 8. Skills list has duplicates
- `app/api/profile/route.ts:626-675`: "Next.js" ×2, "Shopify" ×2, "WooCommerce" ×2, and both "OpenAI Agents SDK" and "Open AI Agents SDK".
- This API is exactly what AI models will read about you — it should be clean.

---

## P2 — Design system & look-and-feel

### 9. Color identity is fragmented
- Base palette (dark `#212428` + blue `#3a69ff`) is fine but generic; the Services grid then introduces cyan, magenta, orange, green, and purple icon accents, blog tags are red, and skill-slider icons add 30 more hues. No memorable brand color story.
- **Fix (pick one):** strict mono-accent (everything blue/neutral, very "engineer" feel) **or** define 2–3 deliberate accents in `globals.css` and use only those.
- Bugs: `--accent` and `--primary` are identical; `--text: #fff` in the *light* theme is wrong.

### 10. Light mode is broken in places
- Hero hardcodes `bg-gray-900`, `text-gray-400`, and `#1c1f22/#16161f` gradients (`components/Hero.tsx:90, 63`) — tiles stay dark and gray body text fails contrast on the light background.
- CLAUDE.md's own rule: never hardcode colors, use the CSS variables.

### 11. Triple font load + render-blocking import
- `app/globals.css:1` has a Google Fonts `@import` (render-blocking) for Poppins/Montserrat that are *already* loaded via `next/font` in `lib/fonts`. **Delete the import.**
- Consider dropping to 2 families (e.g., Montserrat for headings, Inter for body) — three sans-serifs add weight without adding character.

### 12. Inconsistent heading scale & semantics
- Tech Stack and Projects use `text-5xl/6xl` while Services and Blog use `text-3xl/4xl` — pick one scale for same-level sections.
- Every section renders the eyebrow as `<h3>` *before* the `<h2>`, and Contact uses `<h2>` for tiny "ADDRESS/EMAIL/PHONE" labels (`components/Contact.tsx:37-53`). Eyebrows should be `<p>`/`<span>`; the document outline currently makes no sense to screen readers or crawlers.

### 13. Hero polish
- The typewriter reserves `min-h-60`, but mid-cycle the headline reads "a Spec-Driven |" — half of visitors' first impression is an incomplete sentence. Consider a static strong headline ("I build AI agents & Next.js SaaS products") with the typewriter on a secondary line.
- Photo backdrop uses a pile of negative-margin hacks (`components/Hero.tsx:184-185`: `-mt-56 -mr-[155px] … md:-mt-52`) — fragile across breakpoints; a simple grid with one absolutely-positioned backdrop would be stable.
- `unoptimized` + `quality={100}` on the priority hero image kills LCP — let `next/image` optimize it.
- `<Link><button>` nesting (`components/Hero.tsx:67-78`) is invalid HTML — style the Link as a button.

### 14. Two competing navbars
- Top header (HOME/ABOUT/PROJECTS/BLOG/SKILLS/SERVICES/CONTACT + Hire Me) *and* a floating pill nav (HOME/ABOUT/PROJECTS/SKILLS/Hire Me) with different item sets.
- **Fix:** Pick one pattern — if keeping the floating pill on scroll, hide the header, and make the items identical.

### 15. Skill slider uses wrong generic icons
- `components/SkillSlider.tsx`: Coffee icon for JavaScript, Zap for Next.js, Palette for Tailwind…
- Real brand icons exist in `react-icons/si` (Simple Icons) — using them instantly raises perceived quality.
- The marquee never pauses on hover and ignores `prefers-reduced-motion` (no motion preferences are honored anywhere on the site — add a `motion-reduce` handling pass).

### 16. Contact section
- The stock handshake photo is the weakest visual on the page — replace with an actual photo/map/availability card.
- Format the phone: `+92 326 2283140`.
- The form posts directly to Formspree, navigating users off-site to Formspree's thank-you page — submit via fetch and show inline success.
- Add `autocomplete="name|email"` to inputs.
- The gradient on "SEND MESSAGE" differs from the hero CTA gradient — standardize one primary-button style.
- Consider showing `hello@owaisabdullah.dev` instead of the Gmail address — the custom-domain mailbox already exists and matches the brand.

---

## P3 — Code & misc polish

| Item | Where | Fix |
|---|---|---|
| Projects refetch on every tab switch | `ProjectsTab.tsx:57-85` (`selectedTab` in deps) | Fetch once, empty deps |
| Artificial 800ms "Load More" delay | `ProjectsTab.tsx:91` | Remove — fake latency is an anti-pattern |
| Tab/filter state not in URL | ProjectsTab | Query param so links deep-link |
| Twitter image is a different file with spaces in the name | `app/page.tsx:57` (`/assets/Owais Abdullah (2).png`) | Use the OG image |
| `theme-color` is accent blue | `app/layout.tsx:110,128` | Should match background (`#212428`) per guidelines |
| Icon-only social links lack `aria-label` | Hero, Footer | Add labels |
| Blog empty state in alarming red | `BlogSection.tsx:100` | Neutral styling |
| Missing `llms.txt` | — | Given the AI-SEO focus, add one + ensure projects render server-side (see P1.1) |

---

## What's already good

- Clear section narrative (hero → about → services → proof → contact)
- Working availability badge
- JSON-LD schema, sitemap, solid metadata/OG setup
- Scroll-driven entrance animations
- Consistent card language
- Services pages with real offer descriptions — more conversion infrastructure than most dev portfolios have

## Recommended starting order

1. Server-render the projects/blog (P1.1, P1.2)
2. Fix the experience data (P1.3)
3. One focused visual pass on color + typography (P2.9–11)
