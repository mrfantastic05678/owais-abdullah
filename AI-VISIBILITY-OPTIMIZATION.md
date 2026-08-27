# AI Visibility Optimization Guide for owaisabdullah.dev

> Audit Date: August 27, 2026  
> Current Visibility Score: **0%** (not mentioned in any of 20 AI search answers)  
> Competitors: Gun.io (8 mentions), Upwork (5), Toptal (4)

---

## Table of Contents

1. [Audit Summary](#1-audit-summary)
2. [Tools & MCPs Used for Research](#2-tools--mcps-used-for-research)
3. [How Each Tool/MCP Can Contribute](#3-how-each-toolmcp-can-contribute)
4. [Immediate Fixes (Quick Wins)](#4-immediate-fixes-quick-wins)
5. [Structured Data & Schema Markup](#5-structured-data--schema-markup)
6. [llms.txt Optimization](#6-llmstxt-optimization)
7. [Content Strategy for AI Citations](#7-content-strategy-for-ai-citations)
8. [Technical SEO for AI Crawlers](#8-technical-seo-for-ai-crawlers)
9. [Platform-Specific Strategies](#9-platform-specific-strategies)
10. [Measurement & Tracking](#10-measurement--tracking)
11. [Implementation Checklist](#11-implementation-checklist)

---

## 1. Audit Summary

### What the Report Found

| Metric | Value | Status |
|--------|-------|--------|
| Visibility Score | 0% | Low |
| Prompts Analyzed | 5 | - |
| AI Engines Tested | ChatGPT, Perplexity, Gemini, Claude | - |
| Brand Mentions | 0 out of 20 answers | Not mentioned |
| Organic Keywords | 33 | - |
| Est. Monthly Traffic | 108 | - |
| Keywords in Top 10 | 1 | - |
| Google AI Overview References | 1 | - |

### Prompts Where You Were NOT Mentioned

1. "Best AI automation development firms in 2026"
2. "Gun.io compared to Revolo for software development"
3. "What are custom AI agent automations used for?"
4. "Reputable alternatives to Toptal for freelance developers in 2026"
5. "Custom SaaS builders for businesses requiring Next.js expertise"

### Why You're Invisible to AI

- **No structured data** (JSON-LD) on your site
- **Meta description too long** (225 chars vs recommended 120-160)
- **No third-party authority signals** (not on Gun.io, Clutch, etc.)
- **No FAQ/HowTo schema** for extractable Q&A content
- **llms.txt exists but could be richer**
- **No earned media / press coverage** linking back to your site

---

## 2. Tools & MCPs Used for Research

### Tavily MCP (Web Research & Crawling)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `tavily_tavily_research` | Deep research on a topic from multiple sources | Researching best practices, industry trends, competitor analysis |
| `tavily_tavily_search` | Quick web search for current information | Checking latest SEO guidelines, AI crawler behavior |
| `tavily_tavily_extract` | Extract content from specific URLs | Reading competitor pages, analyzing top-cited sources |
| `tavily_tavily_crawl` | Crawl a website structure | Analyzing your own site for AI-readability issues |
| `tavily_tavily_map` | Map website structure | Understanding site architecture for SEO audit |

### Context7 MCP (Library Documentation)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `context7_resolve-library-id` | Find documentation for any library | Before implementing Next.js metadata, schema, or any framework feature |
| `context7_query-docs` | Query specific documentation | Getting exact implementation patterns for JSON-LD, metadata API, etc. |

### Sanity MCP (CMS Management)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `Sanity_get_schema` | Fetch deployed schema | Understanding content models for blog posts |
| `Sanity_query_documents` | Query content via GROQ | Fetching blog posts for sitemap, llms.txt updates |
| `Sanity_list_workspace_schemas` | List all schemas | Checking schema structure |

### GitHub MCP (Repository Management)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `mcp__github__search_repositories` | Find repos | Syncing projects to portfolio |
| `mcp__github__get_file_contents` | Read repo files | Getting README/package.json for project metadata |

### Chrome DevTools MCP (Browser Automation)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `mcp__chrome-devtools__take_screenshot` | Capture screenshots | Testing how AI crawlers see your pages |
| `mcp__chrome-devtools__navigate_page` | Navigate to URLs | Testing site rendering |

---

## 3. How Each Tool/MCP Can Contribute

### Tavily MCP — Content Research & Competitor Analysis

**Contribution:** Understand what AI engines are citing and why.

**Implementation:**
```
1. Use tavily_tavily_search to find what prompts mention competitors:
   Query: "best AI automation developers 2026"
   → See what content Gun.io, Upwork, Toptal have that you don't

2. Use tavily_tavily_extract to read top-cited pages:
   URLs: gun.io, revelo.com, upwork.com
   → Identify content patterns (FAQ sections, case studies, pricing pages)

3. Use tavily_tavily_crawl to audit your own site:
   URL: https://owaisabdullah.dev
   → Find missing structured data, thin content, broken links
```

### Context7 MCP — Implementation Documentation

**Contribution:** Get correct, up-to-date implementation patterns for Next.js features.

**Implementation:**
```
1. Query Next.js metadata docs:
   Library: /vercel/next.js
   Query: "metadata API generateMetadata structured data JSON-LD"
   → Get exact code patterns for your portfolio

2. Query JSON-LD implementation:
   Library: /vercel/next.js
   Query: "JSON-LD schema.org script tag dangerouslySetInnerHTML"
   → Properly implement structured data
```

### Sanity MCP — Content Management

**Contribution:** Manage blog content that AI engines cite.

**Implementation:**
```
1. Query blog posts for sitemap:
   Sanity_query_documents
   Query: *[_type == "post"]{title, slug, _updatedAt}
   → Keep sitemap fresh for AI crawlers

2. Add FAQ fields to blog schema:
   Sanity_get_schema → inspect current schema
   → Add FAQ structured data fields to blog posts
```

### GitHub MCP — Project Authority

**Contribution:** Link GitHub repos to portfolio for authority signals.

**Implementation:**
```
1. Search repos:
   mcp__github__search_repositories
   query: "user:mrowaisabdullah"
   → Sync all repos to portfolio with proper metadata

2. Add repo links to structured data:
   → SoftwareSourceCode schema for each project
```

---

## 4. Immediate Fixes (Quick Wins)

### Fix 1: Optimize Meta Description (225 → 140 chars)

**Current (225 chars):**
```
Owais Abdullah is a spec-driven developer and AI engineer specializing in Next.js SaaS products, AI agents, and Digital FTEs (AI employees). Expert in TypeScript, OpenAI Agents SDK, and building production-ready architectures with AI-driven engineering.
```

**Recommended (140 chars):**
```
Build AI agents, Digital FTEs, and Next.js SaaS with Owais Abdullah. AI automation, OpenAI Agents SDK, TypeScript. View projects & services.
```

**File:** `app/layout.tsx:19-20`

### Fix 2: Add AI Crawler Directives to robots.txt

**Current:** Missing ClaudeBot, PerplexityBot, Bytespider  
**Add:**
```
User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Google-Extended
Allow: /
```

**File:** `public/robots.txt`

---

## 5. Structured Data & Schema Markup

### 5.1 Person Schema (Homepage)

Add to `app/layout.tsx` in the `<head>` section:

```tsx
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://owaisabdullah.dev/#person",
  "name": "Owais Abdullah",
  "url": "https://owaisabdullah.dev",
  "image": "https://owaisabdullah.dev/assets/owais-abdullah-og.png",
  "jobTitle": "Spec-Driven Developer & AI Engineer",
  "description": "AI engineer specializing in Next.js SaaS products, AI agents, and Digital FTEs. Founder of Octively. 3+ years, 40+ projects delivered.",
  "sameAs": [
    "https://github.com/MrOwaisAbdullah",
    "https://www.linkedin.com/in/mrowaisabdullah/",
    "https://x.com/mrowaisabdullah",
    "https://octively.com"
  ],
  "knowsAbout": [
    "Next.js", "TypeScript", "Python", "AI Agents",
    "OpenAI Agents SDK", "Claude Code", "SaaS Architecture",
    "Digital FTE", "AI Automation"
  ],
  "worksFor": [
    {
      "@type": "Organization",
      "name": "LionUp Digital",
      "url": "https://lionupdigital.com"
    },
    {
      "@type": "Organization",
      "name": "AA Marketing",
      "url": "https://aamarktng.com"
    }
  ],
  "founder": {
    "@type": "Organization",
    "name": "Octively",
    "url": "https://octively.com"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PK"
  }
};
```

### 5.2 Organization Schema (for Octively)

```tsx
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://octively.com/#org",
  "name": "Octively",
  "url": "https://octively.com",
  "description": "AI chatbot SaaS that lets agencies add branded AI chatbots to client sites.",
  "founder": {
    "@type": "Person",
    "@id": "https://owaisabdullah.dev/#person"
  }
};
```

### 5.3 Service Schemas (for each service page)

```tsx
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Digital FTE (AI Employee) Development",
  "description": "Autonomous AI agents that handle business operations 24/7.",
  "provider": {
    "@type": "Person",
    "@id": "https://owaisabdullah.dev/#person"
  },
  "areaServed": "Worldwide",
  "serviceType": "AI Development"
};
```

### 5.4 FAQPage Schema (for service pages)

```tsx
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a Digital FTE?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Digital FTE (Full-Time Equivalent) is an AI agent that acts like a real employee—working 24/7, handling tasks autonomously, and proactively managing operations."
      }
    }
  ]
};
```

### 5.5 SoftwareSourceCode Schema (for projects)

```tsx
const projectSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "Octively",
  "description": "AI chatbot SaaS for agencies.",
  "codeRepository": "https://github.com/MrOwaisAbdullah",
  "programmingLanguage": ["TypeScript", "Python"],
  "runtimePlatform": "Next.js",
  "author": {
    "@type": "Person",
    "@id": "https://owaisabdullah.dev/#person"
  }
};
```

### Implementation in Next.js (App Router)

```tsx
// app/layout.tsx or any page component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, '\u003c'),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 6. llms.txt Optimization

### Current State

Your `public/llms.txt` exists but is basic (38 lines). It needs:
- More structured sections
- Direct answers to common queries
- FAQ-style content that AI engines extract
- Links to specific project pages with descriptions

### Recommended Updated llms.txt

```markdown
# Owais Abdullah — Spec-Driven Developer & AI Agent Engineer

> Owais Abdullah is a spec-driven developer and AI engineer based in Pakistan.
> He builds AI-native companies through Digital FTEs (autonomous AI employees),
> Next.js SaaS products, and agent orchestration systems.
> Founder of Octively (https://octively.com).
> 3+ years experience, 40+ projects delivered.

## What I Do

- **Digital FTE Development**: Build autonomous AI employees using Claude Code, OpenAI Agents SDK, and MCP that handle email, reporting, customer support, and operations 24/7
- **Custom AI Agents & Automations**: OpenAI Agents SDK + n8n workflows for intelligent automation at scale
- **Next.js SaaS Development**: Spec-driven, production-ready SaaS products with TypeScript, Tailwind, Prisma, PostgreSQL
- **CMS & E-commerce**: WordPress, Shopify, Sanity CMS, headless architectures
- **Technical Consulting**: AI strategy, MVP prototyping, architecture reviews

## Core Stack

TypeScript, Next.js, React, Tailwind CSS, Python, Claude Code, OpenAI Agents SDK,
Claude Agent SDK, MCP (Model Context Protocol), PostgreSQL, pgvector, Prisma ORM,
Sanity CMS, WordPress, Shopify, Docker, n8n, FastAPI

## Notable Projects

- **Octively** (https://octively.com) — AI chatbot SaaS. Agencies add branded AI chatbots to client sites with one embed script. Founder.
- **Digital FTE** — Autonomous AI employees powered by Claude Code. Obsidian vault for memory, MCPs for tools, Python scripts for execution.
- **TeamFlow** (https://teamflow-sigma-opal.vercel.app/) — AI-powered team management and task assignment platform for agencies.
- **Visati** (https://visati-dubai.vercel.app/) — Visa services SaaS with document uploads, payments, PDF generation.
- **ContentSpark AI** — SEO blog agent that researches, writes, and publishes 15+ optimized posts daily into Sanity CMS.
- **GigBillow** (https://gigbillow.vercel.app/) — Freelance business toolkit with AI task categorization and invoice generation.
- **FurnitureMart.pk** (https://furniture-mart-pk.vercel.app/) — Online furniture marketplace.
- **AI Humanoid Robotics Book** (https://mrowaisabdullah.github.io/ai-humanoid-robotics/) — RAG chatbot for an educational book.

## Services

- [Digital FTE Development](https://owaisabdullah.dev/services/digital-fte) — $800-$1,500+
- [Custom AI Agents & Automations](https://owaisabdullah.dev/services/ai-agents) — $500-$1,200+
- [Next.js SaaS Development](https://owaisabdullah.dev/services/saas-development) — $1,500-$4,000+
- [CMS & E-commerce](https://owaisabdullah.dev/services/cms-ecommerce) — $600-$1,500+
- [Technical Consulting & MVP](https://owaisabdullah.dev/services/consulting-mvp) — $200-$1,000+
- [API Development & Integration](https://owaisabdullah.dev/services/api-development) — $200-$800+

## FAQ

**What is a Digital FTE?**
A Digital FTE (Full-Time Equivalent) is an AI agent that acts like a real employee—working 24/7, handling tasks autonomously, and proactively managing operations. Unlike chatbots that wait for input, Digital FTEs actively monitor and execute tasks.

**How long does it take to build a SaaS MVP?**
A typical SaaS MVP takes 4-8 weeks. Spec-driven development speeds this up by reducing rework.

**What AI frameworks do you use?**
Claude Code, OpenAI Agents SDK, Claude Agent SDK, MCP (Model Context Protocol), n8n workflow automation, and General Agents Framework.

**Can you automate my existing workflow?**
Yes. Most repetitive, rule-based processes are candidates for AI automation. I analyze current processes and identify opportunities.

**Where are you based?**
Karachi, Pakistan. Working remotely worldwide.

## Pages

- [Home](https://owaisabdullah.dev/) — Overview, services, projects, experience
- [About](https://owaisabdullah.dev/about) — Background and approach
- [Projects](https://owaisabdullah.dev/projects) — Full portfolio: Next.js SaaS, WordPress, AI tools
- [Services](https://owaisabdullah.dev/services) — All service offerings with pricing
- [Blog](https://owaisabdullah.dev/blog) — Articles on AI, agents, and web development
- [Skills](https://owaisabdullah.dev/skills) — Detailed tech stack and proficiencies
- [Contact](https://owaisabdullah.dev/contact) — Project inquiries and collaboration

## Contact

- Email: mrowaisabdullah@gmail.com
- GitHub: https://github.com/MrOwaisAbdullah
- LinkedIn: https://www.linkedin.com/in/mrowaisabdullah/
- X (Twitter): https://x.com/mrowaisabdullah
```

---

## 7. Content Strategy for AI Citations

### 7.1 Create Extractable Content

AI engines cite content that is:
- **Concise** — Short paragraphs, direct answers
- **Structured** — H2/H3 headings, bullet points, tables
- **Q&A formatted** — Questions as headings, answers below
- **Fresh** — Regularly updated with timestamps
- **Cited** — Links to third-party sources

### 7.2 Blog Post Strategy

Write articles that answer the exact prompts from the audit:

| Prompt | Article to Write |
|--------|-----------------|
| "Best AI automation development firms in 2026" | "Top AI Automation Development Companies 2026" (position yourself) |
| "Custom AI agent automations used for" | "What Are Custom AI Agent Automations? A Complete Guide" |
| "Reputable alternatives to Toptal for freelance developers" | "Best Toptal Alternatives for Hiring Developers in 2026" |
| "Custom SaaS builders for businesses requiring Next.js" | "Next.js SaaS Development: How to Choose the Right Developer" |

### 7.3 FAQ Schema on Every Page

Add FAQ sections to service pages and blog posts. AI engines preferentially cite FAQ schema.

### 7.4 Internal Linking

- Link from blog posts to service pages
- Link from project pages to related blog posts
- Use descriptive anchor text (not "click here")

---

## 8. Technical SEO for AI Crawlers

### 8.1 Rendering Strategy

Your Next.js site uses **SSG/SSR** — this is correct. AI crawlers generally don't execute JavaScript, so server-rendered HTML is essential.

**Verification:**
- Pages should render HTML without client-side JS
- Test with `view-source:https://owaisabdullah.dev`

### 8.2 Core Web Vitals

AI overviews filter slow sites. Ensure:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

### 8.3 Canonical Tags

Every page should have a canonical tag:
```html
<link rel="canonical" href="https://owaisabdullah.dev/page-path" />
```

### 8.4 XML Sitemap

Your `app/sitemap.ts` is good. Ensure it's accessible at `/sitemap.xml`.

### 8.5 RSS Feed

Create an RSS feed for blog posts — AI crawlers use it for freshness signals:
```tsx
// app/feed.xml/route.ts
import { client } from "@/sanity/lib/client";

export async function GET() {
  const posts = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0...20]{
      title, slug, publishedAt, excerpt
    }`
  );

  const items = posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>https://owaisabdullah.dev/blog/${post.slug.current}</link>
      <description>${post.excerpt || ''}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>
  `).join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Owais Abdullah Blog</title>
    <link>https://owaisabdullah.dev</link>
    <description>Articles on AI agents, Next.js SaaS, and web development</description>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: { 'Content-Type': 'application/rss+xml' },
  });
}
```

---

## 9. Platform-Specific Strategies

### ChatGPT
- Relies on **Bing's index** — ensure you're indexed by Bing
- Allow GPTBot in robots.txt (already done)
- Create Bing Webmaster Tools account and submit sitemap

### Perplexity
- Favors **highly extractable content** — short direct answers
- Place JSON-LD in `<head>` for reliable processing
- FAQ/HowTo schema is heavily weighted

### Gemini
- Tightly integrated with **Google's Knowledge Graph**
- Strong Wikipedia/Wikidata signals help
- Google Search Console + Rich Results Test

### Claude
- Cites only when provided source material
- `llms.txt` is specifically designed for Claude-style crawlers
- Ensure your `llms.txt` is comprehensive and at root

---

## 10. Measurement & Tracking

### 10.1 Monitor AI Bot Traffic

Check server logs for these user agents:
```
GPTBot (OpenAI)
ChatGPT-User (OpenAI)
ClaudeBot (Anthropic)
PerplexityBot (Perplexity)
Bytespider (ByteDance)
Google-Extended (Google AI)
CCBot (Common Crawl)
```

### 10.2 Manual Prompt Testing

Monthly, test these prompts and track mentions:
1. "Best AI automation development firms"
2. "Custom AI agent automations"
3. "Next.js SaaS developer"
4. "Digital FTE AI employee"
5. "AI engineer for hire"

### 10.3 Google Search Console

- Monitor "AI Overview" impressions
- Track which queries show your site
- Submit sitemap and request indexing

### 10.4 AI Citation Tracking Tools

- **Tavily** — Search for your brand across AI engines
- **Otterly.ai** — AI search monitoring
- **Ziptie.dev** — AI visibility tracking

---

## 11. Implementation Checklist

### Phase 1: Immediate (This Week)

- [ ] **Fix meta description** in `app/layout.tsx` (225 → 140 chars)
- [ ] **Add AI crawlers to robots.txt** (ClaudeBot, PerplexityBot, Bytespider, Google-Extended)
- [ ] **Add Person JSON-LD** to `app/layout.tsx`
- [ ] **Update llms.txt** with richer content, FAQ section, and project details
- [ ] **Create Bing Webmaster Tools** account and submit sitemap

### Phase 2: Short-Term (This Month)

- [ ] **Add FAQPage schema** to service pages (`app/services/[slug]/page.tsx`)
- [ ] **Add SoftwareSourceCode schema** for each project
- [ ] **Create RSS feed** route (`app/feed.xml/route.ts`)
- [ ] **Write 2-3 blog posts** targeting audit prompts
- [ ] **Add sameAs links** to GitHub, LinkedIn, Twitter profiles

### Phase 3: Medium-Term (Next 3 Months)

- [ ] **Get listed on directories**: Clutch, Gun.io, Toptal, Arc.dev
- [ ] **Earn backlinks** through guest posts, interviews, case studies
- [ ] **Create Wikidata entry** for yourself and Octively
- [ ] **Add Organization schema** for Octively
- [ ] **Submit to AI training datasets** (Hugging Face, Common Crawl)

### Phase 4: Ongoing

- [ ] **Monthly prompt testing** — track AI visibility score
- [ ] **Weekly blog posts** — fresh content for crawlers
- [ ] **Monitor bot traffic** in server logs
- [ ] **Update llms.txt** when adding new projects/services
- [ ] **Re-run audit** quarterly to measure improvement

---

## Appendix: Key Research Sources

| Source | URL | Key Insight |
|--------|-----|-------------|
| AISO Hub | aiso-hub.com/insights/schema-markup-ai-citations | JSON-LD with sameAs strengthens entity recognition |
| UNU Guide | c3.unu.edu/blog/seo-for-the-ai-era-a-2025-quick-guide | Direct Answer Leads for AI extraction |
| Oltre.ai | oltre.ai/blog/llms-txt-ai-crawler-guidance | llms.txt must be at root, UTF-8, no auth wall |
| Similar.ai | similar.ai/guides/llms-txt | llms-full.txt provides all content in one fetch |
| Firecrawl | firecrawl.dev/blog/How-to-Create-an-llms-txt-File | Google Lighthouse now audits llms.txt |
| Vercel | vercel.com/i/structured-data-for-seo | JSON-LD implementation in Next.js with XSS prevention |
| Backlinko | backlinko.com/digital-pr-strategies | Earned media strongly increases AI citations |
| Context7 | /vercel/next.js | Next.js metadata API and JSON-LD patterns |
