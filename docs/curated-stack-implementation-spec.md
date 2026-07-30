# Curated Stack — Implementation Spec
# owaisabdullah.dev/stack
# A trust-first toolkit page, not a scraped directory

---

## 1. Sanity Schema

Add this to your Sanity studio schemas:

```typescript
// schemas/toolReview.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'toolReview',
  title: 'Tool Review',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tool Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Stack Layer',
      type: 'string',
      options: {
        list: [
          { title: 'Agent Framework', value: 'agent-framework' },
          { title: 'MCP Server', value: 'mcp' },
          { title: 'Router / Gateway', value: 'router' },
          { title: 'Memory / Storage', value: 'memory' },
          { title: 'Infrastructure', value: 'infra' },
          { title: 'Dev Tool', value: 'dev-tool' },
          { title: 'Observability', value: 'observability' },
          { title: 'Auth / Security', value: 'auth' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'One-Line Description',
      type: 'string',
      description: 'What it does in one sentence.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'myRating',
      title: 'My Rating',
      type: 'number',
      options: {
        list: [
          { title: '1 — Avoid', value: 1 },
          { title: '2 — Meh', value: 2 },
          { title: '3 — Solid', value: 3 },
          { title: '4 — Great', value: 4 },
          { title: '5 — Essential', value: 5 },
        ],
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'useCase',
      title: 'Why I Use It',
      type: 'text',
      rows: 3,
      description: 'Personal, specific. No marketing copy.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stackLayer',
      title: 'Where It Fits',
      type: 'string',
      description: 'e.g. "Router Layer", "Memory Layer", "Agent Orchestration"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientFit',
      title: 'When I Recommend It',
      type: 'text',
      rows: 2,
      description: 'Qualifies your leads.',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'docsUrl',
      title: 'Documentation URL',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'dateAdded',
      title: 'Date Added',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'projectsUsingIt',
      title: 'Projects Using This Tool',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. ["ShopMate", "Octively", "Digital FTE"]',
    }),
    defineField({
      name: 'body',
      title: 'Full Review',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'logo',
    },
  },
})
```

Register it in your schema config:

```typescript
// sanity.config.ts or schemas/index.ts
import toolReview from './toolReview'

export const schemaTypes = [
  // ... your existing schemas
  toolReview,
]
```

---

## 2. TypeScript Types

```typescript
// types/stack.ts
export interface ToolReview {
  _id: string
  name: string
  slug: { current: string }
  category:
    | 'agent-framework'
    | 'mcp'
    | 'router'
    | 'memory'
    | 'infra'
    | 'dev-tool'
    | 'observability'
    | 'auth'
  tagline: string
  myRating: number
  useCase: string
  stackLayer: string
  clientFit?: string
  websiteUrl: string
  githubUrl?: string
  docsUrl?: string
  logo?: {
    asset: {
      url: string
    }
  }
  featured: boolean
  dateAdded: string
  projectsUsingIt?: string[]
  body?: any[] // Portable Text
}

export type StackLayer =
  | 'Agent Framework'
  | 'MCP Server'
  | 'Router / Gateway'
  | 'Memory / Storage'
  | 'Infrastructure'
  | 'Dev Tool'
  | 'Observability'
  | 'Auth / Security'
```

---

## 3. Sanity GROQ Queries

```typescript
// lib/sanity/queries.ts
import { groq } from 'next-sanity'

export const allToolReviewsQuery = groq`
  *[_type == "toolReview"] | order(myRating desc, dateAdded desc) {
    _id,
    name,
    slug,
    category,
    tagline,
    myRating,
    stackLayer,
    logo,
    featured,
    projectsUsingIt
  }
`

export const featuredToolReviewsQuery = groq`
  *[_type == "toolReview" && featured == true] | order(myRating desc) {
    _id,
    name,
    slug,
    category,
    tagline,
    myRating,
    stackLayer,
    logo,
    projectsUsingIt
  }
`

export const toolReviewBySlugQuery = groq`
  *[_type == "toolReview" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    category,
    tagline,
    myRating,
    useCase,
    stackLayer,
    clientFit,
    websiteUrl,
    githubUrl,
    docsUrl,
    logo,
    featured,
    dateAdded,
    projectsUsingIt,
    body
  }
`

export const toolsByCategoryQuery = groq`
  *[_type == "toolReview" && category == $category] | order(myRating desc) {
    _id,
    name,
    slug,
    tagline,
    myRating,
    stackLayer,
    logo,
    projectsUsingIt
  }
`
```

---

## 4. Next.js App Router Structure

```
app/
  stack/
    page.tsx              # /stack — main toolkit page
    [slug]/
      page.tsx            # /stack/liteLLM — individual review
    layout.tsx            # Shared layout for stack section
  api/
    stack/
      route.ts            # Optional: API route for filtering
```

---

## 5. Main Stack Page (/stack)

```tsx
// app/stack/page.tsx
import { client } from '@/lib/sanity/client'
import { allToolReviewsQuery, featuredToolReviewsQuery } from '@/lib/sanity/queries'
import { ToolReview } from '@/types/stack'
import { StackCard } from '@/components/stack/StackCard'
import { StackFilter } from '@/components/stack/StackFilter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Agent Stack — Tools I Use to Build Digital FTEs | Owais Abdullah',
  description:
    'A curated, opinionated toolkit of AI frameworks, MCP servers, and infrastructure I use to build autonomous AI employees in production. No affiliate links. No scraped lists.',
  openGraph: {
    title: 'The Agent Stack — Owais Abdullah',
    description: 'The exact tools behind my Digital FTEs and AI agent systems.',
    type: 'website',
  },
}

export default async function StackPage() {
  const allTools: ToolReview[] = await client.fetch(allToolReviewsQuery)
  const featured: ToolReview[] = await client.fetch(featuredToolReviewsQuery)

  const categories = Array.from(new Set(allTools.map((t) => t.category)))

  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      {/* Hero */}
      <section className="mb-16">
        <p className="text-sm font-mono text-neutral-500 mb-3">THE AGENT STACK</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Tools I use to build AI employees that never clock out.
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
          This is not a scraped directory. These are the exact frameworks, MCP servers,
          and infrastructure I run in production for Digital FTEs, ShopMate, and Octively.
          Every entry includes when I recommend it to a client — and when I don&apos;t.
        </p>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6">Essential Layer</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {featured.map((tool) => (
              <StackCard key={tool._id} tool={tool} featured />
            ))}
          </div>
        </section>
      )}

      {/* Filterable Grid */}
      <section>
        <StackFilter categories={categories} tools={allTools} />
      </section>

      {/* CTA */}
      <section className="mt-20 p-8 border border-neutral-800 rounded-xl bg-neutral-900/50">
        <h3 className="text-xl font-semibold mb-3">
          Want an AI employee built on this exact stack?
        </h3>
        <p className="text-neutral-400 mb-6">
          I design, build, and operate autonomous agent systems for agencies and SaaS teams.
          Every system starts with a written spec.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition"
        >
          Book a Spec Call
        </a>
      </section>
    </main>
  )
}
```

---

## 6. Stack Card Component

```tsx
// components/stack/StackCard.tsx
import { ToolReview } from '@/types/stack'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  tool: ToolReview
  featured?: boolean
}

export function StackCard({ tool, featured = false }: Props) {
  return (
    <Link
      href={`/stack/${tool.slug.current}`}
      className={`group block p-6 rounded-xl border transition hover:border-blue-500/50 ${
        featured
          ? 'border-blue-500/20 bg-blue-500/5'
          : 'border-neutral-800 bg-neutral-900/30'
      }`}
    >
      <div className="flex items-start gap-4">
        {tool.logo?.asset?.url && (
          <Image
            src={tool.logo.asset.url}
            alt={tool.name}
            width={48}
            height={48}
            className="rounded-lg shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold group-hover:text-blue-400 transition">
              {tool.name}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
              {tool.stackLayer}
            </span>
          </div>
          <p className="text-sm text-neutral-400 line-clamp-2">{tool.tagline}</p>
          {tool.projectsUsingIt && tool.projectsUsingIt.length > 0 && (
            <p className="text-xs text-neutral-500 mt-2">
              Used in: {tool.projectsUsingIt.join(', ')}
            </p>
          )}
        </div>
        <div className="shrink-0">
          <span className="text-lg font-bold text-neutral-600">
            {tool.myRating}
            <span className="text-sm text-neutral-700">/5</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
```

---

## 7. Individual Review Page (/stack/[slug])

```tsx
// app/stack/[slug]/page.tsx
import { client } from '@/lib/sanity/client'
import { toolReviewBySlugQuery } from '@/lib/sanity/queries'
import { ToolReview } from '@/types/stack'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool: ToolReview = await client.fetch(toolReviewBySlugQuery, {
    slug: params.slug,
  })

  return {
    title: `${tool.name} Review — Why I Use It in Production | Owais Abdullah`,
    description: tool.useCase.slice(0, 160),
    openGraph: {
      title: `${tool.name} — ${tool.stackLayer}`,
      description: tool.tagline,
    },
  }
}

export default async function ToolReviewPage({ params }: Props) {
  const tool: ToolReview = await client.fetch(toolReviewBySlugQuery, {
    slug: params.slug,
  })

  if (!tool) return <div>Not found</div>

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-500 mb-8">
        <Link href="/stack" className="hover:text-white transition">
          The Agent Stack
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{tool.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-start gap-5 mb-6">
          {tool.logo?.asset?.url && (
            <Image
              src={tool.logo.asset.url}
              alt={tool.name}
              width={64}
              height={64}
              className="rounded-xl"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
            <p className="text-neutral-400">{tool.tagline}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300">
            {tool.stackLayer}
          </span>
          <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300">
            Rating: {tool.myRating}/5
          </span>
          {tool.projectsUsingIt?.map((project) => (
            <span
              key={project}
              className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400"
            >
              {project}
            </span>
          ))}
        </div>
      </header>

      {/* Review Body */}
      <article className="space-y-10">
        {/* Why I Use It */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-neutral-200">
            Why I Use It
          </h2>
          <p className="text-neutral-400 leading-relaxed">{tool.useCase}</p>
        </section>

        {/* Client Fit */}
        {tool.clientFit && (
          <section className="p-6 rounded-xl border border-blue-500/20 bg-blue-500/5">
            <h2 className="text-lg font-semibold mb-3 text-blue-400">
              When I Recommend It to a Client
            </h2>
            <p className="text-neutral-400 leading-relaxed">{tool.clientFit}</p>
          </section>
        )}

        {/* Full Review */}
        {tool.body && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-neutral-200">
              Full Review
            </h2>
            <div className="prose prose-invert prose-neutral max-w-none">
              <PortableText value={tool.body} />
            </div>
          </section>
        )}

        {/* Links */}
        <section className="flex flex-wrap gap-4">
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
          >
            Visit Website
          </a>
          {tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 transition"
            >
              GitHub
            </a>
          )}
          {tool.docsUrl && (
            <a
              href={tool.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 transition"
            >
              Documentation
            </a>
          )}
        </section>
      </article>

      {/* Bottom CTA */}
      <section className="mt-16 pt-10 border-t border-neutral-800">
        <p className="text-neutral-500 mb-4">
          Need help integrating {tool.name} into your agent system?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition"
        >
          Let&apos;s Talk
        </Link>
      </section>
    </main>
  )
}
```

---

## 8. JSON-LD Schema (Add to individual page)

```tsx
// Add this inside the ToolReviewPage component, before the <main> tag

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  name: `${tool.name} Review`,
  reviewBody: tool.useCase,
  author: {
    '@type': 'Person',
    name: 'Owais Abdullah',
    url: 'https://owaisabdullah.dev',
  },
  itemReviewed: {
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: tool.stackLayer,
    url: tool.websiteUrl,
    ...(tool.githubUrl && { codeRepository: tool.githubUrl }),
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: tool.myRating,
    bestRating: 5,
  },
}

// Then in JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

---

## 9. Seed Data — First 10 Entries

Add these to Sanity studio manually (takes 20 minutes) or via a migration script.

| Name | Category | Layer | Rating | Projects |
|------|----------|-------|--------|----------|
| **OpenAI Agents SDK** | agent-framework | Agent Orchestration | 5 | ShopMate, Octively, Digital FTE |
| **LiteLLM** | router | Router Layer | 5 | ShopMate, Octively |
| **Neon Postgres** | memory | Memory / Storage | 5 | ShopMate, Octively, Digital FTE |
| **pgvector** | memory | Vector Store | 4 | ShopMate |
| **Upstash Redis** | infra | Caching / Queue | 4 | Octively |
| **Better Auth** | auth | Auth Layer | 4 | Octively |
| **Drizzle ORM** | infra | Database Layer | 5 | ShopMate, Octively |
| **Dokploy** | infra | Deployment | 4 | ShopMate, Octively |
| **FastAPI** | infra | API Layer | 4 | ShopMate |
| **Claude Code** | dev-tool | Dev Environment | 5 | Digital FTE |

---

## 10. Sitemap & Robots

```typescript
// app/sitemap.ts
import { client } from '@/lib/sanity/client'
import { allToolReviewsQuery } from '@/lib/sanity/queries'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await client.fetch(allToolReviewsQuery)

  const toolUrls = tools.map((tool) => ({
    url: `https://owaisabdullah.dev/stack/${tool.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://owaisabdullah.dev/stack',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...toolUrls,
  ]
}
```

---

## 11. Navigation Update

Add to your main nav or footer:

```tsx
<Link href="/stack" className="...">
  Stack
</Link>
```

Or if you want it more prominent, add a section on your homepage:

```tsx
<section className="py-20">
  <p className="text-sm font-mono text-neutral-500 mb-3">BEHIND THE BUILD</p>
  <h2 className="text-3xl font-bold mb-4">The Agent Stack</h2>
  <p className="text-neutral-400 max-w-xl mb-8">
    A curated toolkit of frameworks, MCP servers, and infrastructure I use
    to build autonomous AI employees in production.
  </p>
  <Link
    href="/stack"
    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
  >
    Explore the Stack <ArrowRight className="w-4 h-4" />
  </Link>
</section>
```

---

## 12.
---

## 1. Technical SEO

| Tactic | How to Apply on Portfolio |
|--------|--------------------------|
| **Static Generation (SSG)** | Pre-render `/stack` and every `/stack/[slug]` at build time. No SSR. |
| **ISR** | Revalidate every 24 hours if you update tool data frequently. |
| **URL normalization** | Force lowercase, no trailing slashes via middleware. |
| **Unique meta tags per tool** | Title: `"LiteLLM Review — Why I Use It in Production \| Owais Abdullah"` |
| **Canonical URLs** | Every tool page points to itself. No duplicate content issues. |
| **robots.txt** | Allow `/stack/**`, block `/api/**` and auth pages. |
| **XML Sitemap** | Include `/stack` and all `/stack/[slug]` pages. |
| **Core Web Vitals** | WebP logos, lazy load below-fold, font swap, LCP < 2.5s. |

---

## 2. Structured Data (JSON-LD)

| Schema Type | Where to Use |
|-------------|-------------|
| **SoftwareApplication** | Every individual tool page (`/stack/liteLLM`) |
| **Review** | Your personal review embedded in the SoftwareApplication schema |
| **AggregateRating** | Your `ourRating` field (1–5) |
| **BreadcrumbList** | `Home > Stack > LiteLLM` on every tool page |
| **Organization** | Homepage + stack homepage (`owaisabdullah.dev/#organization`) |
| **Person** | Author schema on stack page — links to your socials, Octively, etc. |
| **ItemList** | On `/stack` homepage — lists all tools in order |

---

## 3. Content Depth

| Tactic | Application |
|--------|-------------|
| **300+ words per tool** | Your use case + client fit + full review = natural word count |
| **"Last updated" date** | Show when you last verified pricing/features |
| **FAQ schema** | Add 2–3 FAQs per tool page: *"Does LiteLLM work with DeepSeek?"* |
| **Original, first-person content** | "I use this for..." — Google detects original voice vs. scraped specs |
| **Project linkage** | "Used in: ShopMate, Octively, Digital FTE" — adds context and internal links |

---

## 4. Internal Linking

| Tactic | Application |
|--------|-------------|
| **Breadcrumb navigation** | `Home > Stack > [Tool Name]` |
| **Related tools** | Link between tools in the same stack layer (Router → Memory → Agent) |
| **Project links** | Each tool page links to the projects that use it |
| **Stack homepage links** | `/stack` links to every tool + your methodology page |
| **Blog integration** | If you write about a tool, link from the stack page to the blog post |

---

## 5. Off-Page & Distribution

| Tactic | Application |
|--------|-------------|
| **Guest posting** | Write "The Stack Behind My AI Employees" for Dev.to, Indie Hackers |
| **Social posts** | One tool = one LinkedIn/X post. Tag the tool company (they reshare) |
| **Linkable asset** | Your stack page becomes a reference people link to when discussing AI agent stacks |
| **HARO** | If journalists ask "what tools do AI developers use?" — pitch your stack page |

---

## 6. What to SKIP (Not Applicable)

| From V2 Spec | Why Skip |
|-------------|----------|
| Programmatic SEO at scale | You have ~15 tools, not 500 |
| Category pages | One stack, no categories needed |
| Comparison pages | Optional, but not essential for 15 tools |
| User reviews/upvotes | Personal stack = your opinion only |
| AdSense/direct ads | Portfolio page is trust-building, not monetized |
| Newsletter archive | Only if you actually write one |
| Tool submission form | Not a public directory |

---

## 7. Quick Win: The Stack Page Title Formula

```tsx
// /stack page
title: "The Agent Stack — Tools I Use to Build AI Employees | Owais Abdullah"
description: "A curated, opinionated toolkit of AI frameworks, MCP servers, and infrastructure I run in production for Digital FTEs, ShopMate, and Octively."

// /stack/[slug] page
title: "LiteLLM Review — Why I Use It in Production | Owais Abdullah"
description: "I use LiteLLM to switch between DeepSeek, GPT-4o, and Claude without rewriting prompts. Here's why it's in my agent stack."
```

---

## 8. Sitemap Entry for Stack

```xml
<url>
  <loc>https://owaisabdullah.dev/stack</loc>
  <lastmod>2026-07-29</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://owaisabdullah.dev/stack/litellm</loc>
  <lastmod>2026-07-29</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 13. Why This Wins

| What Others Do | What You Do |
|---------------|-------------|
| Scrape 500 MCPs into a table | Curate 15 you actually use |
| Generic descriptions | Personal use cases |
| No opinion | Honest ratings (3/5 when deserved) |
| Affiliate links everywhere | Zero affiliates. Trust only. |
| SEO-first, value-second | Trust-first, SEO as side effect |
| "Directory" as the product | Stack as proof of work for services |

---

## Next Step

1. Add the Sanity schema (5 min)
2. Seed 5–10 tools you actually use (20 min)
3. Build the two pages (`/stack` and `/stack/[slug]`) (2–3 hours)
4. Deploy and share on X/LinkedIn: *"I just published the exact stack behind my AI employees. No affiliates. No scraped lists. Just what I use in production."*

Then we move to the general directory play.
