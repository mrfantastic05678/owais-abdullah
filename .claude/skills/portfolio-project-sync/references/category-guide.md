# Category Guide

Value-based categories for portfolio projects. Use these instead of tech-based categories.

## Category Definitions

| Category | Definition | Examples |
|----------|-----------|----------|
| **AI Tool** | AI-powered utilities, chatbots, agents, RAG systems, content generators | Octively, ContentSpark AI, Calculator Agent |
| **Marketplace** | Multi-vendor platforms, rental systems, P2P marketplaces | FurnitureMart.pk, RentParlo |
| **Tool** | Single-purpose utilities, converters, builders, CLI apps | Resume Builder, Password Strength Meter |
| **Dashboard** | Admin panels, analytics dashboards, management UIs | FurnitureMart Admin, Agency CRM |
| **Platform** | SaaS products, agency sites, multi-sided platforms | TeamFlow, Visati, Hashtag Tech |
| **Personal** | Portfolio sites, personal websites, blogs | owaisabdullah.dev |
| **WordPress** | WordPress-based sites (any type) | Landscape, Coffee Cafe, Marriage Bureau |
| **Institution** | Educational, organizational, religious, government sites | Voice of Holy Quran, Online Quran Academy |
| **Ecommerce** | Online stores, shopping sites with product catalogs | Al-Rehman, Home Improvement Store |

## Decision Tree

```
Is it AI-powered?
├── Yes → AI Tool
├── No ↓
Is it a marketplace/multi-vendor?
├── Yes → Marketplace
├── No ↓
Is it a store with products?
├── Yes → Ecommerce
├── No ↓
Is it an admin/analytics panel?
├── Yes → Dashboard
├── No ↓
Is it a SaaS or multi-user platform?
├── Yes → Platform
├── No ↓
Is it a single-purpose utility?
├── Yes → Tool
├── No ↓
Is it built with WordPress?
├── Yes → WordPress
├── No ↓
Is it educational/institutional?
├── Yes → Institution
├── No ↓
Is it your own portfolio/personal site?
├── Yes → Personal
└── No → Ask user
```

## Common Mistakes

| Wrong | Right | Why |
|-------|-------|-----|
| `category: "Next.js"` | `category: "Platform"` | Tech ≠ category |
| `category: "Python"` | `category: "AI Tool"` | Language ≠ category |
| `category: "WordPress"` for a SaaS | `category: "Platform"` | Platform built on WP is still Platform |
| `category: "HTML & CSS"` | `category: "Tool"` | Markup ≠ category |

## Tag Guidelines

Tags are for tech stack details. Keep them relevant and concise.

```typescript
// Good: 3-5 specific tags
tags: ["Next.js", "AI", "RAG", "Chatbot", "SaaS"]

// Bad: too many or too generic
tags: ["Web", "Frontend", "Technology", "Modern", "Code", "Dev"]
```
