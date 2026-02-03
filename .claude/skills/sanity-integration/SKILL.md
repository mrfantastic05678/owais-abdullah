---
name: sanity-integration
description: Build production Sanity CMS integrations with Next.js, SEO optimization, and MCP tools. Use when adding Sanity CMS for products, blogs, services, events, portfolios, or any content-managed features to websites. Handles schema design, API routes, SEO, image optimization, Live Content API, and reusable component patterns.
allowed-tools: Read, Write, Glob, Grep, Edit, mcp__context7__*, mcp__tavily__*
category: fullstack
version: 1.2.0
---

# Sanity CMS Integration

Build production-grade Sanity CMS integrations with Next.js, featuring SEO optimization, ISR caching, image optimization, and MCP-powered documentation lookup.

## Proficiency Progression Path

This skill follows a structured progression from A2 (Elementary) to B2 (Advanced Independent):

```
[A2] Setup → [A2] Images → [B1] Schema → [B1] Queries → [B1] API → [B2] ISR → [B2] SEO → [B2] Live
```

**Time Estimate**: 8-12 hours to complete all phases (A2→B2)

---

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing Next.js version, current CMS (if any), routing patterns, styling approach |
| **Conversation** | Content types needed (blog, products, services, etc.), user's specific requirements |
| **Skill References** | Sanity patterns, schema templates, SEO best practices |
| **MCP Tools** | Use Context7 for latest Sanity/Next.js docs, Tavily for SEO/best practices research |

**STOP.** Before writing code, use MCP tools:
- **Context7 MCP**: `resolve-library-id` → `query-docs` for Sanity (`/sanity/sanity`), Next.js (`/vercel/next.js`)
- **Tavily MCP**: Search "Sanity CMS best practices 2025", "Next.js ISR caching patterns"

---

## Phase 1: Sanity Setup & Configuration [A2]

**Prerequisites**: None
**Estimated Time**: 30 minutes
**Cognitive Load**: Low (2-3 concepts)

### Learning Objective
Set up a Sanity project with proper configuration for Next.js integration.

### Success Criteria
- [ ] `npm install next-sanity @sanity/image-url` completes without errors
- [ ] `sanity/env.ts` created with `projectId`, `dataset`, `apiVersion` exports
- [ ] `sanity/lib/client.ts` created with `createClient` export
- [ ] Environment variables configured in `.env.local`
- [ ] Sanity Studio accessible at `/studio` route

### Implementation Steps

1. **Install Dependencies**
   ```bash
   npm install next-sanity @sanity/image-url
   npm install -D sanity
   ```

2. **Create Sanity Project** (if new)
   ```bash
   npx sanity@latest init
   ```
   - Choose schema path: `sanity/schemaTypes`
   - Choose project structure: Can use existing `sanity/` folder

3. **Environment Configuration** (`sanity/env.ts`)
   ```typescript
   export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
   export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
   export const apiVersion = '2024-01-01'
   ```

4. **Create Client** (`sanity/lib/client.ts`)

   **v8+ Stega Configuration (Recommended):**
   ```typescript
   import { createClient } from 'next-sanity'
   import { apiVersion, dataset, projectId } from '../env'

   export const client = createClient({
     projectId,
     dataset,
     apiVersion: '2024-01-01',
     useCdn: false, // Disable for ISR
     stega: {
       enabled: process.env.NODE_ENV === 'development',
       studioUrl: '/studio',
       filter: (props) => {
         if (props.sourcePath.at(-1) === 'url') return false
         return props.filterDefault(props)
       },
     },
   })
   ```

### Assessment
Verify by:
```bash
# Test client import
node -e "console.log('client configured')"

# Check studio access
curl http://localhost:3000/studio
```

---

## Phase 2: Image Optimization [A2]

**Prerequisites**: Phase 1 complete
**Estimated Time**: 20 minutes
**Cognitive Load**: Low (2 concepts)

### Learning Objective
Set up Sanity image URL builder for optimized image rendering.

### Success Criteria
- [ ] `@sanity/image-url` package installed
- [ ] `sanity/lib/image.ts` created with `urlFor` export
- [ ] Can generate optimized image URLs from Sanity asset references
- [ ] Images can be resized/cropped using builder methods

### Implementation

Create image builder (`sanity/lib/image.ts`):

```typescript
import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: any) => {
  return builder.image(source)
}
```

### Usage Examples

```typescript
// Basic URL
urlFor(post.mainImage).url()

// With dimensions
urlFor(post.mainImage).width(800).height(450).url()

// With crop and fit
urlFor(post.mainImage).width(1200).height(630).fit('crop').url()

// With quality
urlFor(post.mainImage).quality(80).url()
```

### Assessment
Create test image URL:
```typescript
const testUrl = urlFor({
  _type: 'image',
  asset: { _ref: 'image-test-ref' }
}).width(400).url()
```

---

## Phase 3: Schema Design Basics [B1]

**Prerequisites**: Phase 1 complete, TypeScript basics
**Estimated Time**: 60 minutes
**Cognitive Load**: Medium (4 concepts)

### Learning Objective
Create Sanity document schemas with validation, references, and previews.

### Success Criteria
- [ ] Create document type with `defineType` and `defineField`
- [ ] Add 5+ field types: string, slug, text, image, reference
- [ ] Implement field validation rules
- [ ] Add image with `alt` text requirement
- [ ] Configure preview for Studio list view
- [ ] Schema appears in Sanity Studio

### Core Concepts

**1. Document vs Object Types**
- **Document**: Standalone content with unique ID (`type: "document"`)
- **Object**: Reusable component within documents (`type: "object"`)

**2. Field Types**
- `string`, `text`, `slug`, `datetime`
- `image`, `file`
- `reference` (relationships)
- `array`, `object` (nested content)

### Template Pattern

```typescript
import { defineType, defineField } from "sanity"
import { DocumentIcon } from "@sanity/icons"

export const postType = defineType({
  name: "post",  // singular, not "posts"
  title: "Post",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // 1. Required identifier
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // 2. URL generation
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    // 3. Rich content
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
    }),

    // 4. Image with accessibility
    defineField({
      name: "mainImage",
      type: "image",
      options: { hotspot: true },
      fields: [{
        name: "alt",
        type: "string",
        title: "Alternative text",
        validation: (Rule) => Rule.required(),
      }],
    }),

    // 5. Relationship
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),

    // 6. Portable Text
    defineField({
      name: "content",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
  },
})
```

### Validation Patterns

```typescript
// Required with custom message
validation: (Rule) => Rule.required().error("Title is required")

// Length constraints
validation: (Rule) => Rule.min(10).max(60)

// Email format
validation: (Rule) => Rule.email()

// Custom async validation
validation: (Rule) => Rule.custom(async (value, context) => {
  const existing = await context.client.fetch(
    `*[_type == "post" && slug.current == $slug]`,
    { slug: value }
  )
  return existing.length > 0 ? "Slug already exists" : true
})
```

### Assessment Checklist
- [ ] Schema exports correctly
- [ ] All fields show in Studio
- [ ] Validation errors trigger appropriately
- [ ] Preview shows in list view
- [ ] Can create and save new document

---

## Phase 4: Portable Text Configuration [B1]

**Prerequisites**: Phase 3 complete
**Estimated Time**: 45 minutes
**Cognitive Load**: Medium (4 concepts)

### Learning Objective
Configure reusable Portable Text block content with custom styles and marks.

### Success Criteria
- [ ] Create `blockContentType` schema
- [ ] Configure heading styles (H1, H2, H3)
- [ ] Add list types (bullet, numbered)
- [ ] Add decorator marks (strong, em, code)
- [ ] Add annotation marks (links)
- [ ] Enable inline images in Portable Text

### Implementation

Create `sanity/schemaTypes/blockContentType.ts`:

```typescript
import { defineType, defineArrayMember } from "sanity"
import { ImageIcon } from "@sanity/icons"

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    // Text blocks with rich formatting
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 1", value: "h1" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Link", value: "link" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [{
              title: "URL",
              name: "href",
              type: "url",
            }],
          },
        ],
      },
    }),
    // Inline images
    defineArrayMember({
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [{
        name: "alt",
        type: "string",
        title: "Alternative Text",
      }],
    }),
  ],
})
```

### Usage in Schema

```typescript
defineField({
  name: "content",
  type: "array",
  of: [{ type: "blockContent" }],  // Reference the type
})
```

### Assessment
- [ ] Can select text and apply styles
- [ ] Can create bullet and numbered lists
- [ ] Can add links to text
- [ ] Can insert inline images
- [ ] All formatting renders correctly

---

## Phase 5: GROQ Query Fundamentals [B1]

**Prerequisites**: Phase 3 complete (understand schema structure)
**Estimated Time**: 60 minutes
**Cognitive Load**: Medium (4 concepts)

### Learning Objective
Write GROQ queries to fetch content with projections, filtering, and dereferencing.

### Success Criteria
- [ ] Fetch all documents of a type
- [ ] Project specific fields (not entire document)
- [ ] Filter by field values
- [ ] Dereference relationships (`->` operator)
- [ ] Order results
- [ ] Limit/paginate results

### Core Query Patterns

**1. Fetch with Projection (Always Use!)**

```groq
*[_type == "post"]{
  title,
  "slug": slug.current,
  summary,
  mainImage{asset->{url}, alt}
}
```

**2. Filter by Conditions**

```groq
*[_type == "post" && status == "published"]
*[_type == "post" && featured == true]
*[_type == "post" && publishedAt > "2024-01-01"]
```

**3. Dereference Relationships**

```groq
*[_type == "post"]{
  title,
  author->{name, slug}  // Single reference
}

*[_type == "post"]{
  title,
  categories[]->{title, slug}  // Array of references
}
```

**4. Ordering and Pagination**

```groq
*[_type == "post"] | order(publishedAt desc)[0...10]
```

**5. Single Document by Slug**

```groq
*[_type == "post" && slug.current == $slug]{title, content}[0]
```

### Performance Rules

❌ **Never do this:**
```groq
*[_type == "post"]  // Fetches ALL data
```

✅ **Always project:**
```groq
*[_type == "post"]{title, slug, summary}
```

### Assessment
Write queries to:
1. [ ] Fetch 5 most recent posts with title and slug
2. [ ] Fetch single post by slug with author name
3. [ ] Fetch posts in "design" category
4. [ ] Count total posts

---

## Phase 6: API Routes with Caching [B1]

**Prerequisites**: Phase 5 complete (GROQ queries)
**Estimated Time**: 45 minutes
**Cognitive Load**: Medium (3 concepts)

### Learning Objective
Create Next.js API routes with proper caching headers for ISR.

### Success Criteria
- [ ] Create API route at `app/api/[content]/route.ts`
- [ ] Set `export const dynamic = "force-static"`
- [ ] Add `Cache-Control` headers with `s-maxage` and `stale-while-revalidate`
- [ ] Handle errors gracefully
- [ ] Return proper JSON responses

### Template Pattern

```typescript
import { client } from "@/sanity/lib/client"
import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  try {
    const query = `*[_type == "post"] | order(_createdAt desc){
      title,
      slug,
      mainImage{asset->{url}, alt},
      summary,
      _createdAt
    }`

    const posts = await client.fetch(query)

    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
```

### Cache Strategy Table

| Content Type | s-maxage | stale-while-revalidate |
|--------------|----------|------------------------|
| Static pages | 86400 (1 day) | 86400 |
| Blog listing | 60 (1 min) | 300 (5 min) |
| Single post | 60 | 300 |
| Products | 300 (5 min) | 3600 (1 hour) |

### Assessment
- [ ] API returns JSON data
- [ ] Response includes `Cache-Control` header
- [ ] Errors return 500 status
- [ ] Query projections are minimal
- [ ] Test with `curl` or browser

---

## Phase 7: Dynamic Routes with ISR [B2]

**Prerequisites**: Phase 6 complete (API routes)
**Estimated Time**: 90 minutes
**Cognitive Load**: High (5-6 concepts)

### Learning Objective
Implement dynamic routes with ISR, `generateStaticParams`, and `generateMetadata`.

### Success Criteria
- [ ] Create dynamic route at `app/[content]/[slug]/page.tsx`
- [ ] Implement `generateStaticParams` for build-time generation
- [ ] Set `export const revalidate` for ISR
- [ ] Implement `generateMetadata` for SEO
- [ ] Handle 404 for missing content
- [ ] Use `await params` pattern (Next.js 15)

### Template Pattern

```typescript
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { Metadata } from "next"
import { notFound } from "next/navigation"

// ISR: Revalidate every 60 seconds
export const revalidate = 60
export const dynamicParams = true

// Generate static params at build time
export async function generateStaticParams() {
  const query = `*[_type == "post"]{
    "slug": slug.current
  }`

  const posts = await client.fetch(query)
  return posts.map((post: { slug: string }) => ({ slug: post.slug }))
}

// Generate SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const query = `*[_type == "post" && slug.current == "${slug}"]{
    title,
    summary,
    mainImage,
    seoTitle,
    seoDescription
  }[0]`

  const post = await client.fetch(query)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.summary,
      url: `https://yourdomain.com/blog/${slug}`,
      images: [{
        url: urlFor(post.mainImage).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: post.title,
      }],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}

// Page component
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const query = `*[_type == "post" && slug.current == "${slug}"]{
    title,
    content,
    publishedAt,
    author->{name, bio},
    categories[]->{title}
  }[0]`

  const post = await client.fetch(query)

  if (!post) {
    notFound()
  }

  return <Article post={post} />
}
```

### Key Concepts

**1. Async Params (Next.js 15)**
```typescript
// Always await params
const { slug } = await params
```

**2. ISR Revalidation**
```typescript
export const revalidate = 60  // seconds
```

**3. Static Params Generation**
```typescript
export async function generateStaticParams() {
  // Return array of { slug: string } objects
}
```

### Assessment
- [ ] Page loads at `/blog/[slug]`
- [ ] Metadata renders in page source
- [ ] Open Graph image displays on social share
- [ ] 404 renders for invalid slug
- [ ] ISR revalidates after 60 seconds

---

## Phase 8: SEO Best Practices [B2]

**Prerequisites**: Phase 7 complete (dynamic routes)
**Estimated Time**: 60 minutes
**Cognitive Load**: High (5 concepts)

### Learning Objective
Implement comprehensive SEO with metadata, structured data, sitemaps.

### Success Criteria
- [ ] Add SEO fields to schema (seoTitle, seoDescription, focusKeyword)
- [ ] Implement JSON-LD structured data
- [ ] Generate dynamic sitemap
- [ ] Configure robots.txt
- [ ] Set canonical URLs

### SEO Schema Fields

```typescript
defineField({
  name: "seoTitle",
  title: "SEO Title",
  type: "string",
  description: "Override page title (60 chars max)",
  validation: (Rule) => Rule.max(60),
})

defineField({
  name: "seoDescription",
  title: "SEO Description",
  type: "text",
  rows: 3,
  description: "Meta description (160 chars max)",
  validation: (Rule) => Rule.max(160),
})

defineField({
  name: "noIndex",
  title: "No Index",
  type: "boolean",
  description: "Prevent search engine indexing",
  initialValue: false,
})
```

### JSON-LD Structured Data

```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.summary,
  image: urlFor(post.mainImage).url(),
  author: {
    "@type": "Person",
    name: post.author.name,
  },
  datePublished: post.publishedAt,
  dateModified: post._updatedAt,
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

### Dynamic Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export default async function sitemap(): MetadataRoute {
  const baseUrl = 'https://yourdomain.com'

  const posts = await client.fetch(
    `*[_type == "post"]{ "slug": slug.current, _updatedAt }`
  )

  return [
    { url: baseUrl, lastModified: new Date() },
    ...posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
    })),
  ]
}
```

### robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

### Assessment
- [ ] Metadata renders in `<head>`
- [ ] JSON-LD validates at [richresultstest.google.com](https://richresultstest.google.com)
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] robots.txt accessible at `/robots.txt`
- [ ] Canonical URLs set correctly

---

## Phase 9: Live Content API [B2]

**Prerequisites**: Phase 7 complete (ISR + dynamic routes)
**Estimated Time**: 45 minutes
**Cognitive Load**: High (4 concepts)

### Learning Objective
Implement real-time content updates using Sanity Live Content API.

### Success Criteria
- [ ] Create `sanity/lib/live.ts` with `defineLive`
- [ ] Configure `SANITY_API_READ_TOKEN` environment variable
- [ ] Use `sanityFetch` instead of `client.fetch`
- [ ] Include `<SanityLive />` component in pages
- [ ] Content updates appear without refresh

### Setup

```bash
npm install next-sanity@latest
```

### Live Client Configuration

Create `sanity/lib/live.ts`:

```typescript
import { createClient } from 'next-sanity'
import { defineLive } from 'next-sanity/live'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,  // Required for live content
  stega: { studioUrl: '/studio' },
})

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
```

### Usage in Components

```typescript
import { sanityFetch, SanityLive } from '@/sanity/lib/live'

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: post } = await sanityFetch({
    query: `*[_type == "post" && slug.current == $slug][0]{
      title,
      content,
      publishedAt
    }`,
    params: { slug },
    perspective: 'published',  // or 'previewDrafts' for drafts
  })

  return (
    <article>
      <h1>{post.title}</h1>
      <PortableText value={post.content} />
      <SanityLive /> {/* Enables real-time updates */}
    </article>
  )
}
```

### Perspective Modes

| Mode | Use When |
|------|----------|
| `published` | Production content only |
| `previewDrafts` | Include unpublished drafts |
| `raw` | Draft mode editing |

### Assessment
- [ ] Content updates appear instantly in browser
- [ ] No page refresh required
- [ ] `<SanityLive />` component renders
- [ ] Console shows live content connection
- [ ] Works in development and production

---

## Common Content Types

### Blog Posts
- Fields: title, slug, author (reference), mainImage, categories, summary, content, publishedAt
- Features: SEO metadata, author display, categories, likes/dislikes, FAQs

### Products
- Fields: title, slug, price, compareAtPrice, description, images (array), categories, inStock, variants
- Features: Price display, gallery, variant selection, stock status

### Services
- Fields: title, slug, description, icon, features, pricing, process, faqs
- Features: Pricing tiers, FAQ accordion, process steps

### Events
- Fields: title, slug, startDate, endDate, location, description, image, registrationLink
- Features: Date formatting, location display, upcoming/past filtering

---

## Common Pitfalls

| Pitfall | Cause | Solution |
|---------|--------|----------|
| Hydration mismatch | Using browser APIs in server components | Use `"use client"` for interactive components |
| Missing alt text | Images without accessibility | Add alt field to all image schemas |
| Slow queries | Not projecting specific fields | Always use GROQ projections |
| CDN serving stale content | `useCdn: true` with ISR | Set `useCdn: false` for ISR |
| Type errors | Sanity types not matching | Create proper TypeScript interfaces |
| Params not awaited | Forgetting `await params` | Next.js 15 requires async params |

---

## MCP Tool Usage

**Context7 MCP** (for library docs):
- Sanity: `/sanity-io/next-sanity` - Client config, Live Content API
- Next.js: `/vercel/next.js` - App Router, ISR, metadata
- Portable Text: Search for `@portabletext/react`

**Tavily MCP** (for research):
- "Sanity CMS best practices 2025"
- "Next.js ISR caching optimization"
- "Sanity Live Content API tutorial"

---

## Content Structure Builder

Customize Sanity Studio structure (`sanity/structure.ts`):

```typescript
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Blog Posts')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('postType').title('Posts')),
      S.listItem()
        .title('Products')
        .icon(ShoppingBagIcon)
        .child(S.documentTypeList('productType').title('Products')),
      S.divider(),
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('categoryType').title('Categories')),
    ])
```

---

## TypeScript Type Generation

Generate types from Sanity schemas:

```bash
npx sanity-codegen sanity/schemaTypes --output types/sanity.d.ts
```

Or create manual types:

```typescript
// types/content.ts
export interface Post {
  _id: string
  title: string
  slug: { current: string }
  summary: string
  mainImage: SanityImage
  content: PortableTextBlock[]
  _createdAt: string
  _updatedAt: string
}
```

---

## Deployment Checklist

Before deploying, verify:

- [ ] All schemas have slugs for URL generation
- [ ] Images have alt text fields (required)
- [ ] API routes have proper caching headers
- [ ] ISR revalidate is configured appropriately
- [ ] `generateMetadata` implemented for dynamic routes
- [ ] TypeScript types match schema definitions
- [ ] Portable Text components have proper styling
- [ ] CDN disabled when using ISR (`useCdn: false`)
- [ ] Environment variables configured:
  - [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_SANITY_DATASET`
  - [ ] `SANITY_API_READ_TOKEN` (if using Live Content API)
- [ ] Stega configured for visual editing (development)
- [ ] `<SanityLive />` component included (if using Live Content API)
- [ ] Sitemap generates at `/sitemap.xml`
- [ ] robots.txt configured at `/robots.txt`
- [ ] JSON-LD structured data validates
- [ ] Open Graph images are 1200x630
- [ ] Canonical URLs set correctly

---

## Reference Files

See `references/` for detailed patterns:
- `references/schema-patterns.md` - Advanced schema design
- `references/groq-cheatsheet.md` - Query examples
- `references/seo-guide.md` - SEO implementation patterns
- `references/nextjs-isr.md` - Caching strategies
- `references/blog-rendering.md` - **NEW:** Complete blog rendering guide with code blocks, TOC, FAQs, images, and more

---

## Certification Requirements (B2 Level)

To achieve B2 certification in this skill:

**Knowledge Assessment:**
- [ ] Explain difference between ISR and static generation
- [ ] Describe when to use `useCdn: false`
- [ ] Explain GROQ projection benefits

**Practical Assessment:**
- [ ] Create complete Sanity schema with references
- [ ] Implement ISR route with revalidation
- [ ] Build API route with caching headers
- [ ] Generate dynamic sitemap from Sanity content
- [ ] Implement Live Content API for real-time updates

**Production Readiness:**
- [ ] Deploy Sanity + Next.js to production
- [ ] Verify ISR revalidation works
- [ ] Confirm SEO metadata renders correctly
- [ ] Test sitemap accessibility
- [ ] Validate structured data

---

## Next.js 15 Compatibility Notes

- **Params are now Promises**: Always `await params` in async functions
- **Dynamic params**: Use `params: Promise<{ slug: string }>` type
- **Static generation**: Use `dynamicParams = true` for partial static generation
- **generateMetadata**: Also requires `await params`

---

## Caching Strategy Summary

| Strategy | Use When | Revalidate | useCdn |
|----------|----------|------------|--------|
| **force-static** | Content that rarely changes | Build time | `true` |
| **ISR (revalidate)** | Content that changes periodically | 60-3600 seconds | `false` |
| **Live Content API** | Instant updates needed | Real-time | `false` |
| **On-demand** | Content that updates immediately | Tag-based | `false` |
| **Client fetch** | Real-time or user-specific | No caching | `false` |

---

**Version**: 1.3.0
**Last Updated**: 2025-02-04
**Proficiency Framework**: CEFR + Bloom's Taxonomy + DigComp
**Progression**: A2 → A2 → B1 → B1 → B1 → B2 → B2 → B2

## What's New (v1.3.0)

- **NEW: Blog Rendering Guide** (`references/blog-rendering.md`) - Comprehensive guide for rendering blog content including:
  - Portable Text components with full styling
  - Code block syntax highlighting with `react-syntax-highlighter`
  - Image rendering with Next.js optimization
  - Table of Contents with intersection observer
  - FAQ Accordion with JSON-LD structured data
  - Related Posts component
  - Like/Dislike functionality
  - Breadcrumbs navigation
  - Share buttons
  - Reading time calculation
- **NEW: Portable Text Components Template** (`templates/components/portable-text-components.tsx`)
- **NEW: Extended Block Content Schema** (`templates/schemas/blockContentTypeExtended.ts`)
- **NEW: FAQ Accordion Template** (`templates/components/FaqAccordion.tsx`)
