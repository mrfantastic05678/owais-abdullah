# Owais Abdullah — AI Agent Architect & Full-Stack Engineer

> Building autonomous AI employees (Digital FTEs), high-scale Next.js SaaS platforms, and production-grade intelligent workflow systems.

**Live:** [owaisabdullah.dev](https://owaisabdullah.dev) | **GitHub:** [MrOwaisAbdullah](https://github.com/MrOwaisAbdullah) | **LinkedIn:** [mrowaisabdullah](https://linkedin.com/in/mrowaisabdullah) | **X:** [@mrowaisabdullah](https://x.com/mrowaisabdullah)

---

## ⚡ What I Build

I am a Forward Deployed Engineer (FDE) and AI Systems Architect. I design and ship AI Workers — Digital FTEs that operate autonomously 24/7 with persistent memory vaults, tool execution, and human-in-the-loop gating — alongside full-stack SaaS applications, headless commerce systems, and distributed APIs.

| Focus Area | Engineering Capability |
| :--- | :--- |
| **Autonomous Digital FTEs** | Multi-agent swarms powered by Claude Code & OpenAI Agents SDK with persistent Obsidian memory vaults, MCP tools, and Python execution harnesses. |
| **Full-Stack SaaS Platforms** | Production web applications built with Next.js (App Router), TypeScript, Tailwind CSS, and Server Actions (e.g. Octively, RentParlo, TeamFlow). |
| **Real-Time Multimodal Voice** | Low-latency bidirectional voice assistants using Google Gemini Live API via WebSockets, AudioWorklet PCM streaming, and interruption barge-in. |
| **Database & Directory Systems** | High-scale relational data modeling with Neon Serverless Postgres, Drizzle ORM, and pgvector for RAG retrieval. |
| **Spec-First Engineering** | Rigorous verification, zero AI vibe-coding, strict Zod runtime contracts, sliding-window rate limits, and prompt-injection guardrails. |

---

## 🛠️ Production Tech Stack

### 1. AI Agents & Intelligence
- **Agent Runtimes:** Claude Code, OpenAI Agents SDK, Claude Agent SDK, LangChain / LangGraph
- **Tool Protocol:** Model Context Protocol (MCP) servers, Python automation harnesses
- **Real-Time Voice:** Google Gemini Multimodal Live API (`gemini-2.5-flash`), WebSockets, AudioWorklet (16kHz PCM capture, 24kHz gapless playback)
- **Model Routing:** OpenRouter, Google AI Studio, DeepSeek
- **Memory & Context:** Git-versioned Obsidian markdown vaults, vector embeddings (`pgvector`)

### 2. Frontend & Interaction Design
- **Framework:** Next.js (App Router, Server Components, Server Actions, On-Demand ISR)
- **Language:** TypeScript (Strict Mode)
- **Design System:** Architectural Obsidian palette (`#020D10`), subtle hairline borders (`rgba(255, 255, 255, 0.08)`), authentic frosted glassmorphism (`backdrop-filter: blur(20px)`), dual-pitch dot lattices
- **Styling:** Tailwind CSS, CSS Custom Properties
- **Motion & Physics:** Framer Motion, GSAP ScrollTrigger (60FPS/120FPS GPU layer compositing, native mobile touch preservation)
- **Typography:** Clash Display (Display/Headings), Satoshi (Body Text)

### 3. Backend, Database & Storage
- **Database:** Neon Serverless PostgreSQL with connection pooling
- **ORM:** Drizzle ORM (type-safe schema definitions and push migrations)
- **Content Engine:** Sanity Headless CMS with real-time GROQ queries and on-demand webhooks
- **Authentication:** Unified administrative single sign-on with HMAC-SHA256 signed magic access links and persistent database credential storage
- **Email Delivery:** Resend transactional email API with verified domain delivery

### 4. Security & Guardrails
- **Input Validation:** Strict Zod schema verification on all chat, session, and administrative endpoints
- **Rate Limiting:** In-memory sliding-window IP rate limiting (15 req/min on AI chat, 6 sessions/10 min on live voice)
- **AI Safety:** Pre-LLM prompt-injection deflection heuristics, system instruction defense rules, and contact lead marker sanitization
- **Zero-Trust Recovery:** Passwordless email magic links with 30-minute expirations for administrative access and credential rotation

---

## 🚀 Key Architectural Features

### 🎙️ Real-Time Gemini Live Voice Assistant ("Otto AI")
- **Bidirectional WebSocket Streaming:** The browser connects directly to Google's edge via WebSockets using short-lived, server-minted ephemeral tokens (`POST /api/live-token`), eliminating server audio bandwidth bottlenecks.
- **AudioWorklet Resampling:** Native 44.1kHz/48kHz microphone audio is downsampled off-the-main-thread to 16kHz mono 16-bit linear PCM with zero UI jank.
- **Gapless 24kHz Playback:** Audio chunks from Gemini are scheduled with microsecond-precision audio cursors.
- **True Interruption (Barge-In):** When `serverContent.interrupted === true` is received, queued audio sources halt immediately, enabling natural conversational interruptions.
- **Client Tool Calling:** Otto AI can trigger client UI actions directly over voice (e.g. `navigate_to_section`, `open_lead_drawer`).

### 📦 12-Column Balanced Bento Services Grid
- Asymmetric layout designed with zero orphaned cards:
  - **Row 1:** 7 columns (Digital FTE Flagship) + 5 columns (Multi-Model Agent Swarms) = 12 cols.
  - **Row 2:** 3 + 3 + 3 + 3 = 12 cols (SaaS Engineering, Headless Commerce, Spec Audit, Distributed APIs).
- Domain-specific architectural badges (`AUTONOMOUS FTE`, `MULTI-MODEL SWARMS`, `FULL-STACK SAAS`, `HEADLESS COMMERCE`, `SPEC-FIRST AUDIT`, `DISTRIBUTED APIS`).
- Smooth, non-popping hairline hover transitions.

### 🔐 Zero-Trust Administrative Security & Magic Reset
- **Email-Based Magic Links:** Secure 1-click vault access and password set/reset tokens signed with HMAC-SHA256.
- **Database Persistence:** Custom administrative credentials persist permanently in Neon Postgres (`admin_settings` table) across serverless deploys.
- **Zero Route Disclosure:** Route structures and endpoints are protected against reconnaissance scanning.

### 📈 SEO, Performance & Telemetry
- **Google Preferred Sources:** Implements Google's official user-controlled SEO ranking signal with direct-add modal popup fallback.
- **Instant Indexing:** Automated IndexNow broadcasting to Bing and Yandex upon Sanity content publishing.
- **Edge Audience Telemetry:** Real-time visitor country, city, device, and referrer tracking without invasive cookies.
- **Smooth 60FPS Performance:** Zero main-thread scroll hijacking, isolated touch momentum, and hardware layer promotion.

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   ├── admin/                 # Admin verify, reset, and overview routes
│   │   ├── analytics/             # Telemetry & metrics aggregation
│   │   ├── chat/                  # Zod-validated Gemini AI chat endpoint
│   │   ├── live-token/            # Ephemeral token minting for Gemini Live Voice
│   │   ├── revalidate/            # On-demand ISR webhook & IndexNow pinging
│   │   └── ...                    # Directory, comments, like endpoints
│   ├── blog/                      # Sanity-powered editorial articles with ISR
│   ├── stores/                    # Pakistan E-Commerce Directory (Postgres + Drizzle)
│   ├── layout.tsx                 # Root layout, theme provider, and analytics
│   ├── page.tsx                   # Homepage (Hero, Bento Services, Projects, Stats)
│   └── globals.css                # Obsidian tokens, dual-pitch lattice, glassmorphism
├── components/
│   ├── Hero.tsx                   # Symmetrical hero, CTA buttons, and Otto AI pill
│   ├── ServicesGrid.tsx           # 12-column balanced Bento layout with split-flap labels
│   ├── StatsBand.tsx              # Single-row mobile & 4-col desktop telemetry counters
│   ├── ui/
│   │   ├── ChatBot.tsx            # Otto AI dual-mode Text & Live Voice widget
│   │   └── VoiceVisualizer.tsx    # Audio frequency canvas & pulse visualizer
│   └── admin/                     # Admin Dashboard Shell & mission control views
├── hooks/
│   ├── useChat.ts                 # Chat stream management with guardrail error handling
│   └── useLiveVoice.ts            # WebSockets, AudioWorklet capture, and LiveAudioPlayer
├── lib/
│   ├── admin-token.ts             # HMAC-SHA256 tokens and persistent DB settings
│   ├── chat-security.ts           # Zod schemas, injection detection & rate limiting
│   ├── db.ts                      # Neon Postgres serverless client initialization
│   └── voice/audio-player.ts      # Gapless 24kHz PCM audio queue & barge-in handler
├── public/
│   └── worklets/pcm-processor.js  # AudioWorklet processor for 16kHz PCM streaming
├── schema/
│   └── directory.ts               # Drizzle ORM schema (stores, claims, admin_settings)
└── .agents/skills/                # Packaged agent skills (gemini-live-voice-agent, etc.)
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js** v20+ and npm
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))
- **Neon Postgres Database** (from [Neon](https://neon.tech/))
- **Sanity CMS Project** (from [Sanity.io](https://sanity.io/))
- **Resend Account** (from [Resend](https://resend.com/))

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/MrOwaisAbdullah/Owais-Abdullah.git
cd Owais-Abdullah

# Install dependencies
npm install

# Initialize environment configuration
cp .env.example .env.local
```

### 3. Configure Environment Variables

Edit `.env.local` with your private credentials. See [`.env.example`](./.env.example) for detailed documentation of all variables:

```env
# Administrative Security
ADMIN_EMAIL=your_admin_email@domain.com
ADMIN_PASSWORD=your_secure_password_here

# AI & Live Voice
GEMINI_API_KEY=your_gemini_api_key_here
LIVE_VOICE_ENABLED=true

# Database (Neon Serverless Postgres)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.region.neon.tech/neondb?sslmode=require"

# Headless CMS (Sanity)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
SANITY_REVALIDATE_SECRET=your_webhook_secret

# Email Delivery (Resend)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL="Owais Abdullah <contact@yourdomain.com>"
CONTACT_TO_EMAIL=your_inbox@domain.com

# Analytics & Indexing
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
INDEXNOW_KEY=your_indexnow_key_here
```

### 4. Push Database Schema

```bash
# Synchronize Postgres schema with Neon
npm run db:push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your local deployment.

---

## 🧠 Packaged Skills & Agent Customizations

This repository contains production-ready skills located in `.agents/skills/`:

| Skill | Description | Location |
| :--- | :--- | :--- |
| **`gemini-live-voice-agent`** | Full guide, protocol reference, and templates for building real-time WebSockets/WebRTC voice agents using Google Gemini Live API. | [`.agents/skills/gemini-live-voice-agent`](./.agents/skills/gemini-live-voice-agent/) |
| **`google-preferred-sources`** | Implementation patterns for Google's official Preferred Sources user-controlled SEO ranking signal with direct-add modals. | [`.agents/skills/google-preferred-sources`](./.agents/skills/google-preferred-sources/) |
| **`smooth-ui-performance`** | Production guidelines for 60FPS/120FPS smooth UI rendering, GPU compositing layers, and native touch isolation. | [`.agents/skills/smooth-ui-performance`](./.agents/skills/smooth-ui-performance/) |

---

## 📬 Contact & Connect

- **Portfolio:** [owaisabdullah.dev](https://owaisabdullah.dev)
- **LinkedIn:** [linkedin.com/in/mrowaisabdullah](https://linkedin.com/in/mrowaisabdullah)
- **GitHub:** [github.com/MrOwaisAbdullah](https://github.com/MrOwaisAbdullah)
- **X:** [x.com/mrowaisabdullah](https://x.com/mrowaisabdullah)

---

Built with Next.js 15, TypeScript, Tailwind CSS, Neon Postgres, and Google Gemini AI.
