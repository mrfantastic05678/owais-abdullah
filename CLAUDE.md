# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 15 personal portfolio website** using the App Router architecture. It combines modern web technologies with AI integration and a headless CMS for a dynamic, feature-rich portfolio experience.

**Tech Stack:**
- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS with shadcn/ui components
- Sanity CMS (headless CMS at `/studio` route)
- Gemini AI API for portfolio chatbot

## Development Commands

```bash
npm install           # Install dependencies
npm run dev           # Start development server (localhost:3000)
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
```

## Available Tools & Integrations

### MCP Servers (Model Context Protocol)

This project has access to several MCP servers. Use them appropriately:

| MCP | Purpose | When to Use |
|-----|---------|-------------|
| **tavily-mcp** | Web search, research, content extraction | Researching best practices, tutorials, troubleshooting, latest trends |
| **context7** | Library documentation | Getting up-to-date docs for any library/framework (React, Next.js, etc.) |
| **github** | GitHub operations | Creating PRs, issues, managing repositories, code review |
| **shadcn** | UI component management | Adding/updating shadcn/ui components (`@shadcn/*`) |
| **motion** | Animation utilities | CSS spring animations, bounce easing, motion.dev patterns |
| **chrome-devtools** | Browser automation | Testing, debugging, screenshot capture |
| **zai-mcp-server** | Image/video analysis | OCR, UI analysis, error diagnosis from screenshots |
| **web-reader** | Web content fetching | Reading web pages as markdown/text |

### Skills (Located in `.claude/skills/`)

Skills are reusable agent capabilities. Use them before implementing from scratch:

| Skill | Use When |
|-------|----------|
| **frontend-designer** | ANY frontend/UI work - UI/UX design, component creation, animations |
| **agent-browser** | Browser automation, testing, form filling, screenshots |
| **building-nextjs-apps** | Next.js patterns, API routes, server components |
| **deployment-engineer** | CI/CD, Docker, deployment configuration |
| **chatbot-widget-creator** | Embeddable chat widgets, AI chat interfaces |
| **theme-factory** | Theme creation, styling systems |
| **ux-evaluator** | UX evaluation, design feedback |
| **skill-creator-pro** | Creating new reusable skills |

### Sub-Agents (Located in `.claude/agents/`)

Specialized agents for specific tasks:
- **frontend-designer** - Frontend architecture and component design
- **deployment-engineer** - Deployment and infrastructure
- **content-writer** - Documentation and content creation
- **nextjs-frontend-architect** - Next.js specific patterns
- **openai-agents-sdk-specialist** - AI agents and MCP integration

## Development Guidelines

### 1. Code Quality Principles

**DRY (Don't Repeat Yourself):**
- Before writing new code, check `components/` for reusable patterns
- If a pattern appears 2+ times, extract it into a shared component
- Use existing skills and agents instead of re-implementing

**SOLID Principles:**
- **S**ingle Responsibility: Each component/function has one purpose
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Components should be substitutable
- **I**nterface Segregation: Small, focused interfaces
- **D**ependency Inversion: Depend on abstractions, not concretions

### 2. Pre-Work Checklist (MANDATORY)

Before implementing ANY feature:

```bash
# 1. Check existing components
ls components/ui/                    # Available shadcn components
ls components/                       # Custom components

# 2. Use MCPs for research
tavily search "<topic> best practices 2025"    # Web research
context7 resolve-library-id "<library>"        # Get library docs
context7 query-docs "/org/project" "<query>"  # Query library docs

# 3. Use skills for complex tasks
# For frontend work, ALWAYS use frontend-designer skill
```

### 3. Frontend Development Rules

**ALWAYS use the frontend-designer skill** for UI work. It provides:
- Animation-first design patterns
- SSR-safe component patterns (critical for Next.js)
- TypeScript strict mode compliance
- Production-grade code quality

**Common SSR Pitfalls to Avoid:**
- Never call hooks conditionally based on `mounted` state
- Always use `useEffect` for browser APIs (`window`, `localStorage`)
- Use `<AnimatePresence>` for elements leaving the DOM (Motion.dev)
- Never hardcode hex colors - use CSS variables from theme

### 4. Component Reuse

**Before creating new components:**

1. Check `components/ui/` for existing shadcn components:
   - button, card, input, tabs, accordion, avatar, scroll-area, skeleton, etc.

2. Use shadcn MCP to add new components:
   ```
   Use mcp__shadcn__get_add_command_for_items tool
   ```

3. Use motion MCP for animations:
   - `mcp__motion__generate-css-spring` for spring animations
   - `mcp__motion__generate-css-bounce-easing` for bounce effects

### 5. Browser Debugging

Use agent-browser skill or chrome-devtools MCP for:
- Testing web applications
- Taking screenshots
- Debugging responsive layouts
- Form testing
- Visual regression testing

## Architecture

### App Router Structure

The project uses Next.js 15 App Router with a file-based routing system:

- **`app/`** - Main application directory with route groups
  - **`app/api/`** - API routes (chat, like, profile endpoints)
  - **`app/blog/[slug]/`** - Dynamic blog post routes from Sanity CMS
  - **`app/studio/[[...tool]]/`** - Sanity CMS studio interface
  - **`app/layout.tsx`** - Root layout with theme provider
  - **`app/page.tsx`** - Home page
  - **`app/globals.css`** - Global styles with CSS variables for theming

### Component Organization

```
components/
├── ui/              # shadcn/ui base components (button, card, etc.)
├── ThemeProvider.tsx # next-themes wrapper for dark/light mode
├── Header.tsx       # Site navigation
├── Footer.tsx       # Site footer
├── Hero/           # Hero section components
├── About/          # About section components
├── Contact/        # Contact form and related
├── BlogSection/    # Blog listing from Sanity
└── Projects/       # Projects showcase
```

### Styling System

- **Tailwind CSS** with class-based dark mode (`dark:` prefix)
- **CSS Variables** in `globals.css` define the theme system
- **Custom animations** in `tailwind.config.ts` (scroll, accordion)
- **shadcn/ui** components use Radix UI primitives with class-variance-authority

The theme system uses CSS custom properties for colors, allowing smooth dark/light transitions. Add new theme colors to both `globals.css` and `tailwind.config.ts`.

### CMS Integration (Sanity)

Sanity CMS is configured for blog content management:
- **Schemas** in `sanity/schemaTypes/` define content models
- **Studio structure** in `sanity/structure/` defines the CMS UI
- **Access** the studio at `/studio` route in development
- **Content** fetched via `next-sanity` utilities and rendered with `@portabletext/react`

### AI Chat Integration

The portfolio includes an AI chatbot powered by Gemini AI:
- **Endpoint**: `app/api/chat/route.ts`
- **Environment**: Requires `GEMINI_API_KEY`
- **Purpose**: Contextual responses about the portfolio, redirects to contact for direct inquiries

## Configuration Files

- **`next.config.ts`** - Image optimization for Unsplash and Sanity CDNs
- **`tailwind.config.ts`** - Dark mode, custom animations, extended breakpoints (xs, xss)
- **`tsconfig.json`** - Path aliases (`@/*` maps to project root), strict mode
- **`components.json`** - shadcn/ui configuration (New York style, Lucide icons)

## Environment Variables

Required for full functionality:
- `GEMINI_API_KEY` - AI chat functionality
- `NEXT_PUBLIC_GA_ID` - Google Analytics

## Profile API - GitHub Research Process

The `app/api/profile/route.ts` endpoint provides profile information including projects. To keep projects data synchronized with actual GitHub repositories, follow this research and update process.

### GitHub Repository Research Protocol

**Goal:** Extract project information (title, description, stack, links) from GitHub repositories to update the portfolio.

#### Step 1: Repository Discovery

Use GitHub MCP to list repositories:

```typescript
// Get authenticated user info first
mcp__github__get_me

// Search for repositories
mcp__github__search_repositories
  query: "user:mrowaisabdullah"
  perPage: 30
```

#### Step 2: Repository Analysis (For Each Repo)

For each repository that should be featured in the portfolio:

1. **Fetch README** - Get project description and overview:
   ```typescript
   mcp__github__get_file_contents
     owner: "mrowaisabdullah"
     repo: "<repository-name>"
     path: "README.md"
   ```

2. **Detect Project Type & Stack** by checking:
   - `package.json` (Node.js/React/Next.js projects)
   - `pyproject.toml` or `requirements.txt` (Python projects)
   - `composer.json` (PHP projects)
   - `Gemfile` or `gems.rb` (Ruby projects)
   - `go.mod` (Go projects)

   ```typescript
   mcp__github__get_file_contents
     owner: "mrowaisabdullah"
     repo: "<repository-name>"
     path: "package.json"  // or pyproject.toml, etc.
   ```

3. **Extract Metadata** from config files:
   - **Title**: Use repository name (formatted) or package.json `name`
   - **Description**: README first paragraph or package.json `description`
   - **Category**: Derived from project type
   - **Tech Stack**: Dependencies from package.json/pyproject.toml
   - **Link**: Repository URL or deployed URL if mentioned in README

#### Step 3: Tech Stack Mapping

Map common dependencies to display names:

| Dependency | Display Name |
|------------|--------------|
| react, nextjs | React.js, Next.js |
| vue, nuxt | Vue.js, Nuxt |
| typescript | TypeScript |
| tailwindcss | Tailwind CSS |
| python, fastapi, django | Python, FastAPI, Django |
| openai, langchain | OpenAI, LangChain |
| sanity | Sanity CMS |
| prisma | Prisma ORM |

#### Step 4: Update Profile Data

Update `app/api/profile/route.ts` with extracted information:

```typescript
projects: [
  {
    title: "<Project Title>",
    category: "<Category>",  // AI Tool, Marketplace, Dashboard, Platform, etc.
    description: "<Short description from README>",
    link: "<deployed-url-or-repo-url>",
    techStack: ["<Stack1>", "<Stack2>", ...]  // Optional: add for detailed view
  }
]
```

#### Step 5: Validation Rules

**Required fields for each project:**
- `title`: Clean, formatted name
- `category`: One of: AI Tool, Marketplace, Tool, Dashboard, Platform, Personal, WordPress, Institution, Ecommerce
- `description`: Concise (1-2 sentences)
- `link`: Valid URL

**Quality checks:**
- Description should highlight value proposition, not just features
- Category should reflect primary use case
- Link should point to live demo if available, otherwise repo

### Category Classification Guide

| Category | Use For Projects That Are... |
|----------|------------------------------|
| **AI Tool** | AI-powered utilities, chatbots, agents |
| **Marketplace** | E-commerce, multi-vendor platforms |
| **Tool** | Single-purpose utilities, calculators, converters |
| **Dashboard** | Admin panels, analytics, management UIs |
| **Platform** | Multi-sided platforms, SaaS products |
| **Personal** | Portfolio, personal websites |
| **WordPress** | WordPress-based sites |
| **Institution** | Educational, organizational sites |
| **Ecommerce** | Online stores, shopping sites |

### Environment Variables

Add to `.env.local` for GitHub access:
```bash
GITHUB_TOKEN=ghp_xxx  # GitHub Personal Access Token (optional for public repos)
GITHUB_USERNAME=mrowaisabdullah
```

### Common Research Commands Reference

```bash
# List repositories
gh repo list MrOwaisAbdullah --limit 50

# Get README
gh repo view MrOwaisAbdullah/<repo> --json readme --jq .readme

# Get package.json
gh api repos/MrOwaisAbdullah/<repo>/contents/package.json

# Get latest commit
gh repo view MrOwaisAbdullah/<repo> --json pushedAt

# Search repos by topic
gh search repos --owner MrOwaisAbdullah --topic "ai"
```

### Project Screenshot Protocol

**Goal:** Capture visual screenshots of deployed websites or GitHub repositories for project cards.

#### Image Priority Order

1. **Deployed Website Screenshot** (if `deployedUrl` exists)
2. **GitHub Repository Page** (social preview or repo page)
3. **Placeholder** (gradient or icon-based fallback)

#### Using agent-browser Skill

For deployed websites, use the agent-browser skill to capture screenshots:

```bash
# Navigate to deployed site
agent-browser open https://owais-abdullah.vercel.app

# Wait for page to load
agent-browser wait --load networkidle

# Take full page screenshot
agent-browser screenshot --full public/assets/projects/portfolio.png

# Close browser
agent-browser close
```

#### Using chrome-devtools MCP

Alternative using MCP tools:

```typescript
// Navigate to page
mcp__chrome-devtools__navigate_page
  type: "url"
  url: "https://owais-abdullah.vercel.app"

// Wait for load
mcp__chrome-devtools__wait_for
  text: "Owais Abdullah"
  timeout: 10000

// Take screenshot
mcp__chrome-devtools__take_screenshot
  format: "png"
  fullPage: true
  filePath: "public/assets/projects/portfolio.png"
```

#### Screenshot Storage

Store screenshots in `public/assets/projects/` with filename pattern:
- `<repo-name>.png` for repo screenshots
- `<repo-name>-preview.png` for deployed site previews

#### Updating Project Data

After capturing screenshots, update the `image` field in `app/api/profile/route.ts`:

```typescript
{
  title: "Portfolio Website",
  repo: "next-portfolio",
  image: "/screenshots/next-portfolio.png",  // Add screenshot path
  // ... other fields
}
```

#### Batch Screenshot Script

For multiple projects, create a script:

```bash
#!/bin/bash
# screenshots.sh - Capture screenshots for all deployed projects

projects=(
  "https://owais-abdullah.vercel.app|next-portfolio"
  "https://furnituremart.pk|furnituremart"
)

for project in "${projects[@]}"; do
  IFS="|" read -r url repo <<< "$project"
  echo "Capturing $repo from $url"
  agent-browser open "$url"
  agent-browser wait --load networkidle
  agent-browser screenshot --full "public/assets/projects/$repo.png"
  agent-browser close
done
```

## SEO & Meta

- Metadata defined in `app/layout.tsx` and per-route
- Open Graph and Twitter Card support
- Dynamic sitemap at `app/sitemap.ts`
- PWA manifest in `public/manifest.json`
- robots.txt configured in `public/robots.txt`
