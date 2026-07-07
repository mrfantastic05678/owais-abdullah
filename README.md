# Owais Abdullah — AI Agent Builder & SaaS Founder

> Building AI-Native companies through Digital FTEs, SaaS products, and production automation.

**Live:** [owaisabdullah.dev](https://owaisabdullah.dev) | **GitHub:** [MrOwaisAbdullah](https://github.com/MrOwaisAbdullah) | **LinkedIn:** [mrowaisabdullah](https://linkedin.com/in/mrowaisabdullah)

---

## What I Do

I'm a Forward Deployed Engineer (FDE) who builds AI Workers — Digital FTEs that operate like full-time employees. I also build Next.js SaaS products, agent orchestration systems, and automation pipelines.

| Service | What It Is |
|---------|------------|
| **Digital FTEs** | Autonomous AI employees handling business operations 24/7 |
| **SaaS Products** | Production web apps (Octively, RentParlo, TeamFlow) |
| **AI Agent Systems** | Multi-agent orchestration, MCP tooling, memory pipelines |
| **Technical Consulting** | Architecture, MVP development, deployment |

---

## Tech Stack

### AI & Agents

| Technology | Use |
|------------|-----|
| Claude Code | Primary general agent, spec-driven development |
| OpenAI Agents SDK | Building multi-agent systems |
| Claude Agent SDK | Agent runtime, tool orchestration |
| MCP (Model Context Protocol) | Tool interfaces, external connectors |
| Gemini AI | Chatbot, content generation |
| OpenRouter | Multi-model routing, cost optimization |
| DeepSeek | Cost-efficient inference |
| Paperclip | Agent workforce control plane |
| OpenClaw | Personal AI employees on messaging apps |
| Hermes | Memory-first personal agents |

### Frontend

| Technology | Use |
|------------|-----|
| Next.js 15 (App Router) | Web framework, SSR, ISR |
| TypeScript | Type safety, strict mode |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | UI component library (Radix UI primitives) |
| Framer Motion | UI animations, layout transitions |
| GSAP | Scroll-triggered animations, scroll effects |
| Three.js | 3D visuals, WebGL |
| Scroll Story 3D *(planned)* | Apple/Nike-style scroll-scrubbed product reveals |

### Backend & Data

| Technology | Use |
|------------|-----|
| Python (FastAPI) | API backends, agent harnesses |
| PostgreSQL / Neon | Relational database |
| pgvector | Vector search, RAG pipelines |
| Sanity CMS | Headless CMS for blog content |
| Better Auth | Authentication |
| Prisma ORM | Database ORM |
| Zod | Schema validation |

### Cloud & Infrastructure

| Technology | Use |
|------------|-----|
| Vercel | Frontend deployment, edge functions |
| Cloudflare R2 | File storage, CDN |
| AWS S3 | Object storage |
| Docker | Containerization |
| Dokploy / Coolify | VPS deployment platforms |
| Inngest | Durable execution, agent orchestration |
| Brevo | Email marketing |
| Resend | Transactional email |

### Tools & Automation

| Technology | Use |
|------------|-----|
| OpenCode | Alternative coding agent |
| Playwright | Browser automation, screenshots |
| Obsidian | Memory vault, knowledge base |
| Python Scripts | Agent-executable automation |
| Git | Version control |
| ESLint | Code quality |

---

## Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero, About, Services, Tech Stack, Projects, Blog, Experience, Contact |
| **About** | `/about` | Bio, Experience Timeline, Skills |
| **Projects** | `/projects` | Tabbed grid — 9 categories, 36+ projects |
| **Blog** | `/blog` | Sanity CMS posts with ISR (30 min revalidation) |
| **Services** | `/services` | 6 service offerings with pricing |
| **Skills** | `/skills` | 46+ skills with progress bars |
| **Contact** | `/contact` | Form with validation + Resend integration |
| **Studio** | `/studio` | Sanity CMS admin dashboard |

---

## Features

- **PWA** — Offline support, installable via `@ducanh2912/next-pwa`
- **AI Chatbot** — Gemini AI with context about my work
- **Dark/Light Theme** — System-aware, CSS custom properties
- **SEO** — JSON-LD schema, dynamic sitemap, `llms.txt` for AI crawlers
- **Responsive** — Mobile-first, works on all devices
- **Animations** — Framer Motion + GSAP ScrollTrigger
- **ISR** — Incremental Static Regeneration for blog and projects
- **Email** — Resend (transactional) + Brevo (marketing)
- **Scroll Story 3D** *(planned)* — Apple/Nike-style scroll-triggered product reveal using canvas frame sequences

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Gemini AI chat endpoint
│   │   ├── like/route.ts          # Project like counter
│   │   └── profile/route.ts       # Profile data API
│   ├── blog/[slug]/page.tsx       # Dynamic blog post pages
│   ├── studio/[[...tool]]/        # Sanity Studio
│   ├── about/page.tsx             # About page
│   ├── projects/page.tsx          # Projects page
│   ├── services/page.tsx          # Services page
│   ├── skills/page.tsx            # Skills page
│   ├── contact/page.tsx           # Contact page
│   ├── layout.tsx                 # Root layout (ThemeProvider, fonts)
│   ├── page.tsx                   # Homepage (all sections)
│   └── globals.css                # CSS variables, themes, animations
├── components/
│   ├── ui/                        # shadcn/ui base components
│   ├── Hero/                      # Hero section
│   ├── About/                     # About section
│   ├── Contact/                   # Contact form
│   ├── BlogSection/               # Blog listing
│   ├── Projects/                  # Projects showcase
│   └── SkillsSlider.tsx           # Skills marquee
├── data/
│   └── profile.ts                 # Projects, skills, experience (single source of truth)
├── lib/
│   ├── blogs.ts                   # Sanity blog queries
│   ├── sanity.ts                  # Sanity client config
│   └── fonts.ts                   # Font configuration
├── public/
│   ├── assets/                    # Images, project screenshots
│   ├── sw.js                      # Service worker (generated)
│   ├── manifest.json              # PWA manifest
│   ├── robots.txt                 # Crawler rules
│   ├── sitemap.ts                 # Dynamic sitemap
│   └── llms.txt                   # AI crawler metadata
├── sanity/
│   ├── schemaTypes/               # Sanity content schemas
│   └── structure/                 # Sanity Studio structure
├── next.config.ts                 # PWA, image optimization
├── tailwind.config.ts             # Theme, animations, breakpoints
├── tsconfig.json                  # Path aliases, strict mode
├── components.json                # shadcn/ui config
└── package.json                   # Dependencies
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **Sanity account** (for CMS)
- **Gemini API key** (for AI chatbot)
- **Resend API key** (for email)

### Installation

```bash
# Clone the repo
git clone https://github.com/MrOwaisAbdullah/next-portfolio.git
cd next-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token

# AI Chat
GEMINI_API_KEY=your_gemini_api_key

# Email
RESEND_API_KEY=your_resend_api_key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Development

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

The project is pre-configured for Vercel with:
- PWA support via `@ducanh2912/next-pwa`
- Image optimization for Unsplash and Sanity CDNs
- ISR for blog posts (30 min revalidation)

### Sanity Studio

Access the CMS at `/studio` in development. Deploy with:

```bash
npx sanity deploy
```

---

## Design System

### Color Tokens

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `#ffffff` | `#212428` |
| `--text` | `#1f2937` | `#e5e7eb` |
| `--accent` | `#3b82f6` | `#3a69ff` |
| `--muted` | `#f3f4f6` | `#2d3748` |

### Typography

- **Headings:** Clash Display (bold, modern)
- **Body:** Satoshi (clean, readable)
- Both loaded via `next/font/local` (~116 KB total)

### Animations

- **Framer Motion:** UI transitions, layout animations, entrance effects
- **GSAP ScrollTrigger:** Scroll-driven reveals, parallax effects
- **CSS:** Custom keyframes for marquee, accordion, pulse

---

## How I Work

1. **Discover** — Understand the problem, map constraints, define success
2. **Design** — Architecture, data models, API contracts, component hierarchy
3. **Develop** — Spec-driven code with AI assistance, test-driven validation
4. **Deploy** — CI/CD, monitoring, iteration based on real usage

---

## Contact

- **Email:** [mrowaisabdullah@gmail.com](mailto:mrowaisabdullah@gmail.com)
- **LinkedIn:** [linkedin.com/in/mrowaisabdullah](https://linkedin.com/in/mrowaisabdullah)
- **GitHub:** [github.com/MrOwaisAbdullah](https://github.com/MrOwaisAbdullah)
- **X:** [x.com/mrowaisabdullah](https://x.com/mrowaisabdullah)

---

Built with Next.js 15, TypeScript, Tailwind CSS, and AI.
