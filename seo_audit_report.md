# Comprehensive SEO, AEO, GEO & AI Visibility Audit Report
**Target Domain:** `https://owaisabdullah.dev`  
**Date:** October 6, 2026  
**Auditor:** Antigravity AI Engineering & Technical SEO  
**Standards Applied:**  
- `.claude/skills/seo-pack` (Edward Sturm & Daniel Agrici Frameworks)  
- `Portfolio-Keyword-Report-2026-10-06.md` (Semrush Exact-Match Verified Data)  
- `AI-VISIBILITY-OPTIMIZATION.md` (AI Search Engine Citation Engine)  

---

## 1. Executive Summary & The 90+ Gate Evaluation

The site was evaluated using the **SEO-Pack 90+ Evaluation Gate Protocol** (`references/eval-gates.md`) across six discrete sub-dimensions:

### Overall Score: **88 / 100** (Before Fixes) → **96 / 100** (Projected Post-Remediation)
> [!IMPORTANT]
> **Status: CONDITIONAL PASS (88/100).**  
> The site boasts exceptional Next.js 16 architecture, pristine AI bot permissions in `robots.txt`, and high-craft editorial templates. However, it was held below 90 due to two **P0 structural bugs** (`feed.xml` date parsing failure and nonexistent `/search` SearchAction schema) and missing **markdown alternates (`.md`)**. Resolving these elevates the site into elite 96/100 compliance.

### Dimension Scorecard

| Evaluation Dimension | Score | Threshold | Status | Key Diagnosis |
|---|:---:|:---:|:---:|---|
| **Technical Crawlability** | **94 / 100** | 80 | **PASS** | 4-tier partitioned XML sitemaps, clean `robots.txt`, fast SSR/ISR builds (200 pages). Missing automated IndexNow push. |
| **On-Page & AEO Structure** | **91 / 100** | 80 | **PASS** | Editorial Ledger H1/H2 hierarchy, lead TL;DR summaries, question-format FAQs with rich schemas. |
| **GEO & Citability** | **89 / 100** | 80 | **PASS** | Standalone numbers-first stat blocks, "Free alternative to X" comparison angles on project pages. |
| **Agent Readiness** | **82 / 100** | 80 | **PASS** | `llms.txt` present with rich service mapping; missing raw markdown alternates (`.md`) for AI agents. |
| **Authority & Internal Linking** | **84 / 100** | 80 | **PASS** | All 200 pages reachable within $\le 3$ clicks; blog posts need stronger equity routing to money pages (`/services/*`). |
| **Brand Voice & Knowledge Graph** | **88 / 100** | 80 | **PASS** | Strong consistent persona ("Spec-Driven Developer"), Person `#person` anchor needs universal linkage in blog schemas. |

---

## 2. Semrush-Verified Keyword Integration Matrix

From our October 6, 2026 keyword research (`Portfolio-Keyword-Report-2026-10-06.md`), the following 8 priority keywords form our page-target strategy:

| Rank | Target Keyword | US Vol/mo | KD | CPC | Intent | Target Page | Strategy |
|:---:|---|:---:|:---:|:---:|:---:|---|---|
| **1** | `ai agent development services` | **1,600** | 28% Easy | **$25.03** | Commercial/Info | `/services/ai-agents` | Highest CPC in dataset ($25.03) = strongest buyer value. Primary service term. |
| **2** | `ai automation agency` | **2,900** | 36% Possible | **$6.54** | Commercial/Info | `/` (Homepage) | High volume head term. Core positioning for agency-grade client engagements. |
| **3** | `ai chatbot developer` | **210** | 26% Easy | **$9.06** | Commercial 100% | `/services/ai-agents` & Octively | Quickest win; low SERP competition (mostly raw GitHub repos). |
| **4** | `hire ai agent developer` | **110** | 35% Possible | **$24.32** | Commercial | `/contact` & `/services/digital-fte` | Elite transactional intent ($24.32 CPC). Direct CTA target. |
| **5** | `ai automation agency pricing` | **110** | **9% Very Easy** | **$6.52** | Informational | Blog / Service FAQ | Easiest difficulty in set (9% KD). High-converting BOFU pricing guide. |
| **6** | `ai agent development cost` | **170** | 22% Easy | **$7.75** | Informational | Blog / Service FAQ | Low KD BOFU cost guide targeting founders budgeting AI builds. |
| **7** | `ai workflow automation` | **4,400** | 70% Hard | **$17.03** | Informational | `/services/digital-fte` | Long-term target. High volume, enterprise-heavy SERP. |
| **8** | `what is a digital fte` | **~0** | n/a | — | Informational | Flagship Concept | Proprietary differentiator. Own the terminology before competitors. |

---

## 3. AI Visibility & LLM Citation Audit (ChatGPT, Perplexity, Claude, Gemini)

According to `AI-VISIBILITY-OPTIMIZATION.md`, AI assistants currently suffer from an agency vacuum:
- When prompted with *"Hire an AI automation agency"*, ChatGPT and Perplexity cite small boutique listings from directories (`aiagencyradar.com`, Zapier partner directory) and dev shops (`Brainvire`, `TangoCode`).
- When prompted with *"AI workflow automation services"*, AI engines cite tools only (`Zapier`, `Make`, `n8n`) — **zero individual agencies or developers are named**.
- When prompted with *"Hire an AI chatbot developer"*, generic marketplaces (`Upwork`, `Toptal`) dominate.

### Key Factors Governing AI Citations:
1. **Passage Citability:** LLMs cite self-contained, 40–60 word declarative sentences.
2. **Numbers-First Formatting:** Sentences formatted as `"40+ production AI projects delivered across 3+ years..."` get lifted verbatim into AI Overviews.
3. **Structured Knowledge Graph Anchoring:** Explicit schema linking author and agency to Wikidata/Knowledge Graph profiles (`sameAs`) gives LLMs verifiable entity confidence.
4. **Markdown Availability:** Providing raw markdown endpoints allows automated scrapers to consume content without token-wasteful HTML parsing.

---

## 4. Technical Foundations & Crawlability Audit

### 4.1 Robots.txt Ingestion
- **File:** `public/robots.txt`
- **Audit Findings:** Pristine configuration. Explicitly welcomes AI and LLM user-agents: `ChatGPT-User`, `GPTBot`, `CCBot`, `ClaudeBot`, `PerplexityBot`, `Bytespider`, `Google-Extended`, and `Applebot-Extended`.
- **Recommendation:** Remove legacy `Crawl-delay: 1` as modern search engines either ignore it or throttle indexing.

### 4.2 Multi-Partition Sitemaps
- **File:** `app/sitemap.ts`
- **Audit Findings:** Partitioned into 4 sub-sitemaps:
  - `/sitemap/pages.xml`: Static core, showcase projects, and services.
  - `/sitemap/blogs.xml`: 70+ dynamic Sanity blog posts.
  - `/sitemap/stores.xml`: 50+ directory stores, categories, and cities.
  - `/sitemap/stack.xml`: Curated tools and review pages.
- **Audit Findings:** 100% compliant with `references/technical-foundations.md`.

### 4.3 P0 Bug 1: RSS Feed Date Parsing Failure
- **File:** `app/feed.xml/route.ts`
- **Diagnosis:** The GROQ query requested `order(publishedAt desc)` and executed `new Date(post.publishedAt).toUTCString()`. Because Sanity's `postType.ts` uses the system field `_createdAt` and has no `publishedAt` field, every `<pubDate>` renders as `Invalid Date`.
- **Impact:** Feed readers, Bing news ingestors, and syndication aggregators drop the feed entirely.
- **Resolution:** Change query to fetch `_createdAt` with fallback `post._createdAt || post.publishedAt`.

### 4.4 P0 Bug 2: Nonexistent `/search` SearchAction Schema
- **File:** `components/JsonLdSchema.tsx`
- **Diagnosis:** `websiteSchema` defines `potentialAction: SearchAction` targeting `https://owaisabdullah.dev/search?q={search_term_string}`. The route `/search` does not exist on the domain (404).
- **Impact:** Google Search Console flags invalid SearchAction markup.
- **Resolution:** Remove `potentialAction` from `WebSite` schema until a live search page is deployed.

---

## 5. Structured Data & Schema.org Graph

### 5.1 Author Entity Disconnection
- **File:** `components/JsonLdBlog.tsx`
- **Diagnosis:** The `BlogPosting` schema declares a loose `{ "@type": "Person", "name": blog.author.name }` instead of referencing the canonical root identity `@id: "https://owaisabdullah.dev/#person"`.
- **Resolution:** Update `JsonLdBlog.tsx` to reference `@id: "https://owaisabdullah.dev/#person"` and include publisher details linked to the portfolio entity.

### 5.2 Directory Store Schema
- **File:** `components/stores/StoreProfile.tsx`
- **Diagnosis:** Uses generic `@type: "Organization"`.
- **Resolution:** Upgrade to `@type: "OnlineStore"` or `"Store"` with `address` and `city` to maximize Google Shopping and local entity relevance.

---

## 6. Actionable Implementation Roadmap

| Priority | Action Item | Target File | Impact |
|:---:|---|---|---|
| **P0** | Fix RSS `<pubDate>` by querying `_createdAt` | `app/feed.xml/route.ts` | Fixes syndication and search feed ingestion. |
| **P0** | Remove broken `/search` SearchAction schema | `components/JsonLdSchema.tsx` | Eliminates GSC Rich Result validation errors. |
| **P1** | Connect `BlogPosting` author to `@id: "https://owaisabdullah.dev/#person"` | `components/JsonLdBlog.tsx` | Unifies entity authority in Knowledge Graph. |
| **P1** | Align Homepage metadata with Semrush keyword #2 (`AI Automation Agency`) | `app/page.tsx` & `app/layout.tsx` | Targets 2,900/mo US searches with compact meta description. |
| **P1** | Integrate Semrush keyword #1 (`AI Agent Development Services`) into services | `data/services.ts`, `app/services/page.tsx` | Targets 1,600/mo US searches with $25.03 CPC intent. |
| **P1** | Create Raw Markdown alternate route for AI crawlers (`/blog/[slug]/raw`) | `app/blog/[slug]/raw/route.ts` | Fulfills `references/agent-readiness.md` for LLMs. |
| **P1** | Update `public/llms.txt` with verified keywords and raw markdown endpoints | `public/llms.txt` | Direct citability boost for ChatGPT & Claude. |
| **P2** | Add automated IndexNow broadcast on revalidation | `app/api/revalidate/route.ts` | Instant Bing/Yandex indexing upon publishing. |
| **P2** | Contextual "Related Services" internal links on blog posts | `app/blog/[slug]/BlogPageClient.tsx` | Routes PageRank equity to money pages (`/services/*`). |
