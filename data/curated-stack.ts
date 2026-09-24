import { STACK_CATEGORIES, StackCategory } from "@/types/stack";

export interface CuratedToolItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  myRating: number;
  stackLayer: string;
  useCase: string;
  clientFit?: string | null;
  websiteUrl: string;
  githubUrl?: string | null;
  docsUrl?: string | null;
  logoUrl?: string | null;
  featured: boolean;
  projectsUsingIt?: string[];
  dateAdded: string;
  reviewUrl?: string;
}

export interface StackLayerSummary {
  layer: string;
  category: string;
  primaryTools: string[];
  role: string;
}

export interface CuratedStackProfile {
  title: string;
  tagline: string;
  url: string;
  description: string;
  methodology: {
    title: string;
    description: string;
    points: string[];
  };
  categories: StackCategory[];
  layers: StackLayerSummary[];
  totalTools: number;
  essentialTools: CuratedToolItem[];
  tools: CuratedToolItem[];
  byCategory: Record<string, CuratedToolItem[]>;
}

export const curatedStackLayers: StackLayerSummary[] = [
  {
    layer: "Agent Orchestration",
    category: "agent-framework",
    primaryTools: ["OpenAI Agents SDK", "Claude Agent SDK", "Claude Code"],
    role: "Autonomous reasoning, multi-agent workflows, tool execution, and self-correcting agent loops.",
  },
  {
    layer: "Model Context Protocol (MCP)",
    category: "mcp",
    primaryTools: ["Custom Python MCPs", "SQLite MCP", "Git MCP", "Playwright MCP"],
    role: "Standardized tool calling, external API connectors, and execution environments.",
  },
  {
    layer: "Router & Gateway",
    category: "router",
    primaryTools: ["LiteLLM", "OpenRouter"],
    role: "Unified routing across models (Claude, GPT, DeepSeek, Gemini) with automatic fallbacks and latency optimization.",
  },
  {
    layer: "Memory & Storage",
    category: "memory",
    primaryTools: ["Neon Postgres", "pgvector", "Qdrant", "Obsidian"],
    role: "Persistent memory, semantic vector search, knowledge retrieval, and session state.",
  },
  {
    layer: "Database & ORM",
    category: "infra",
    primaryTools: ["Neon Postgres", "Drizzle ORM", "Supabase", "Prisma ORM"],
    role: "Type-safe database migrations, relational modeling, and serverless connection pooling.",
  },
  {
    layer: "Infrastructure & Compute",
    category: "infra",
    primaryTools: ["FastAPI", "Upstash Redis", "Dokploy", "Cloudflare R2", "Docker"],
    role: "Low-latency APIs, distributed queuing, caching, asset storage, and container deployment.",
  },
  {
    layer: "Auth & Identity",
    category: "auth",
    primaryTools: ["Better Auth", "Clerk"],
    role: "Modern session management, multi-tenant authentication, and OAuth.",
  },
  {
    layer: "Dev Tools & Automation",
    category: "dev-tool",
    primaryTools: ["Claude Code", "Playwright", "Inngest", "Sanity CMS", "Tavily API"],
    role: "Agent development loops, web scraping/testing, background cron jobs, and CMS operations.",
  },
];

export const initialCuratedTools: CuratedToolItem[] = [
  {
    "_id": "6X7ayGJgs0U64XMIw1yPJi",
    "category": "memory",
    "clientFit": "When clients need serverless or are tired of paying for idle database connections. Also great for teams that want database branching in their workflow.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://neon.tech/docs",
    "featured": true,
    "githubUrl": "https://github.com/neondatabase/neon",
    "logoUrl": null,
    "myRating": 5,
    "name": "Neon Postgres",
    "projectsUsingIt": [
      "ShopMate",
      "Octively",
      "Digital FTE"
    ],
    "slug": "neon-postgres",
    "stackLayer": "Database Layer",
    "tagline": "Serverless PostgreSQL with branching, scale-to-zero, and a generous free tier.",
    "useCase": "Neon lets me spin up database branches for testing without touching prod. It scales to zero when I'm not using it, which matters for side projects. I get full Postgres with extensions—no watered-down managed version.",
    "websiteUrl": "https://neon.tech/",
    "reviewUrl": "https://owaisabdullah.dev/stack/neon-postgres"
  },
  {
    "_id": "6X7ayGJgs0U64XMIw1yr88",
    "category": "infra",
    "clientFit": "When they need dynamic content—blogs, case studies, documentation—but want more control than WordPress offers. Also when content needs to feed multiple channels (web, mobile, APIs) from one source.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://www.sanity.io/docs",
    "featured": true,
    "githubUrl": "https://github.com/sanity-io/sanity",
    "logoUrl": null,
    "myRating": 5,
    "name": "Sanity CMS",
    "projectsUsingIt": [
      "Personal Portfolio",
      "FurnitureMart.pk",
      "Agency CRM",
      "NextLevel Marketerz"
    ],
    "slug": "sanity-cms",
    "stackLayer": "Content Layer",
    "tagline": "Headless CMS that handles structured content with real-time collaboration and CDNs built in.",
    "useCase": "Sanity powers the blog on this portfolio and several client sites. I like that content is structured as JSON rather than rendered HTML, which means I can query exactly what I need. The real-time collaboration is solid when clients need content teams working simultaneously. The hosted images with CDN optimization save me from setting up separate image handling.",
    "websiteUrl": "https://www.sanity.io/",
    "reviewUrl": "https://owaisabdullah.dev/stack/sanity-cms"
  },
  {
    "_id": "HCcsE6imGnTNXGDBy8No8e",
    "category": "dev-tool",
    "clientFit": "When they want AI that can operate on their actual codebase rather than just generating snippets. Also good for teams that want AI assistance beyond basic autocomplete.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://docs.anthropic.com/en/docs/claude-code/overview",
    "featured": true,
    "githubUrl": "https://github.com/anthropics/claude-code",
    "logoUrl": null,
    "myRating": 5,
    "name": "Claude Code",
    "projectsUsingIt": [
      "Digital FTE"
    ],
    "slug": "claude-code",
    "stackLayer": "Dev Environment",
    "tagline": "AI development environment that can run commands, edit files, and browse the web.",
    "useCase": "Claude Code can actually touch my codebase—run tests, edit files, execute terminal commands. It's not just generating code snippets; it's participating in the development loop. I've used it to debug tests, refactor code, and even set up project scaffolding.",
    "websiteUrl": "https://claude.ai/code",
    "reviewUrl": "https://owaisabdullah.dev/stack/claude-code"
  },
  {
    "_id": "TUa0Tkt6h3tM5nPXqujcRc",
    "category": "infra",
    "clientFit": "When they want type safety without Prisma's weight or when they prefer SQL-first thinking over ORM abstractions. Also good for teams that care about bundle size.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://orm.drizzle.team/docs/overview",
    "featured": false,
    "githubUrl": "https://github.com/drizzle-team/drizzle-orm",
    "logoUrl": null,
    "myRating": 5,
    "name": "Drizzle ORM",
    "projectsUsingIt": [
      "ShopMate",
      "Octively"
    ],
    "slug": "drizzle-orm",
    "stackLayer": "Database Layer",
    "tagline": "Type-safe SQL with a small runtime footprint and excellent TypeScript support.",
    "useCase": "Drizzle gives me SQL-like queries with TypeScript autocomplete. The bundle size is tiny compared to Prisma, and I don't have to deal with a generated client file. The schema-as-code approach means I can version-control my database schema in Git.",
    "websiteUrl": "https://orm.drizzle.team/",
    "reviewUrl": "https://owaisabdullah.dev/stack/drizzle-orm"
  },
  {
    "_id": "VF6nMVzH5KBV4WFWf0OtXi",
    "category": "router",
    "clientFit": "When clients are committed to vendor diversity or want cost optimization through intelligent routing. Also useful when they need A/B testing different models without code changes.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://docs.litellm.ai/",
    "featured": true,
    "githubUrl": "https://github.com/BerriAI/litellm",
    "logoUrl": null,
    "myRating": 5,
    "name": "LiteLLM",
    "projectsUsingIt": [
      "ShopMate",
      "Octively"
    ],
    "slug": "litellm",
    "stackLayer": "Router Layer",
    "tagline": "Call 100+ LLMs through a single interface without rewriting prompts or handling different API quirks.",
    "useCase": "I switch between DeepSeek, GPT-4o, and Claude depending on what I'm building—cost, speed, or capability. LiteLLM gives me one API surface for all of them, plus it handles retries, fallbacks, and load balancing. I don't have to rewrite prompts when I change models.",
    "websiteUrl": "https://www.litellm.ai/",
    "reviewUrl": "https://owaisabdullah.dev/stack/litellm"
  },
  {
    "_id": "WfWsEMMn07QrksA9qq7SDw",
    "category": "dev-tool",
    "clientFit": "When they need reliable cross-browser testing or automated visual regression. Also for scraping tasks that need JavaScript execution.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://playwright.dev/docs/intro",
    "featured": true,
    "githubUrl": "https://github.com/microsoft/playwright",
    "logoUrl": null,
    "myRating": 5,
    "name": "Playwright",
    "projectsUsingIt": [
      "All Projects"
    ],
    "slug": "playwright",
    "stackLayer": "Testing / Automation",
    "tagline": "Browser automation for testing, scraping, and screenshot generation with cross-browser support.",
    "useCase": "I use Playwright for end-to-end testing and taking screenshots of deployed sites. The API is consistent across Chrome, Firefox, and Safari—no rewriting scripts for different browsers. The screenshot and PDF capabilities are solid for generating visual assets. I've tried Selenium, but Playwright's auto-waiting reduces flaky tests significantly.",
    "websiteUrl": "https://playwright.dev/",
    "reviewUrl": "https://owaisabdullah.dev/stack/playwright"
  },
  {
    "_id": "pNIqEpEO0fiymjtJRpqSyL",
    "category": "agent-framework",
    "clientFit": "When clients need autonomous agent systems rather than single-shot completions. Also when they want something that works with their existing OpenAI API access rather than migrating to a new vendor.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://openai-agents-sdk.vercel.app/",
    "featured": true,
    "githubUrl": "https://github.com/openai/openai-agents-sdk",
    "logoUrl": null,
    "myRating": 5,
    "name": "OpenAI Agents SDK",
    "projectsUsingIt": [
      "ShopMate",
      "Octively",
      "Digital FTE"
    ],
    "slug": "openai-agents-sdk",
    "stackLayer": "Agent Orchestration",
    "tagline": "Build multi-agent systems with handoffs, memory, and tool use without writing the orchestration glue yourself.",
    "useCase": "The SDK handles the fiddly parts of agent handoffs and function calling so I don't have to. I've built agents that can route specialized tasks—web search, code execution, database queries—without writing custom state machines. The streaming responses and memory management are solid.",
    "websiteUrl": "https://github.com/openai/openai-agents-sdk",
    "reviewUrl": "https://owaisabdullah.dev/stack/openai-agents-sdk"
  },
  {
    "_id": "6X7ayGJgs0U64XMIw1yPnc",
    "category": "memory",
    "clientFit": "When their vector needs are moderate (millions of embeddings, not billions) and they want to avoid operating a separate vector database. Also when they already have Postgres in their stack.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://github.com/pgvector/pgvector#readme",
    "featured": false,
    "githubUrl": "https://github.com/pgvector/pgvector",
    "logoUrl": null,
    "myRating": 4,
    "name": "pgvector",
    "projectsUsingIt": [
      "ShopMate"
    ],
    "slug": "pgvector",
    "stackLayer": "Vector Store",
    "tagline": "Vector similarity search on Postgres without a separate vector database.",
    "useCase": "I run RAG applications and semantic search without adding another infrastructure piece. pgvector gives me cosine similarity right in Postgres, which I'm already running. Performance is fine for most workloads, and I don't have to sync data between a database and a vector store.",
    "websiteUrl": "https://github.com/pgvector/pgvector",
    "reviewUrl": "https://owaisabdullah.dev/stack/pgvector"
  },
  {
    "_id": "6X7ayGJgs0U64XMIw1ys2c",
    "category": "infra",
    "clientFit": "When they have scheduled jobs or background processing that's becoming complex to manage. Also when they need observability into async workflows—debugging distributed systems without tools is painful.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://www.inngest.com/docs",
    "featured": false,
    "githubUrl": "https://github.com/inngest/inngest",
    "logoUrl": null,
    "myRating": 4,
    "name": "Inngest",
    "projectsUsingIt": [
      "ContentSpark AI"
    ],
    "slug": "inngest",
    "stackLayer": "Workflow Layer",
    "tagline": "Workflow platform for cron jobs, scheduled tasks, and long-running background processes.",
    "useCase": "Inngest handles scheduled tasks and background jobs that need reliability. The SDK is lightweight compared to building custom worker infrastructure. It retries failures automatically, which saves me from writing that logic. I use it for things like daily content generation, periodic data syncs, and long-running tasks that might timeout in normal request/response cycles.",
    "websiteUrl": "https://www.inngest.com/",
    "reviewUrl": "https://owaisabdullah.dev/stack/inngest"
  },
  {
    "_id": "7KL78M4MELqtr9Ep6x3sk4",
    "category": "auth",
    "clientFit": "When they're using Next.js or SvelteKit and need a full auth solution without writing it from scratch. Also good when they want social logins without integrating each provider manually.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://www.better-auth.com/docs",
    "featured": false,
    "githubUrl": "https://github.com/better-auth/better-auth",
    "logoUrl": null,
    "myRating": 4,
    "name": "Better Auth",
    "projectsUsingIt": [
      "Octively"
    ],
    "slug": "better-auth",
    "stackLayer": "Auth Layer",
    "tagline": "Authentication for Next.js and SvelteKit with social logins, 2FA, and session management built in.",
    "useCase": "It handles the auth flows I'd otherwise build myself—OAuth, email verification, 2FA. The TypeScript types are solid, and it works well with Next.js App Router. I don't have to think about session cookies or CSRF tokens.",
    "websiteUrl": "https://www.better-auth.com/",
    "reviewUrl": "https://owaisabdullah.dev/stack/better-auth"
  },
  {
    "_id": "7KL78M4MELqtr9Ep6x4IIM",
    "category": "memory",
    "clientFit": "When they're building RAG applications with more than a few thousand embeddings. Also when they need metadata filtering alongside vector search—pgvector doesn't handle that as well.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://qdrant.tech/documentation/",
    "featured": false,
    "githubUrl": "https://github.com/qdrant/qdrant",
    "logoUrl": null,
    "myRating": 4,
    "name": "Qdrant",
    "projectsUsingIt": [
      "AI Humanoid Robotics Book"
    ],
    "slug": "qdrant",
    "stackLayer": "Vector Store",
    "tagline": "Vector database for RAG with filtering, payload indexing, and REST API.",
    "useCase": "I built an AI robotics book with Qdrant powering the Q&A chatbot. It handles semantic search over book chapters better than keyword search ever could. The filtering lets users narrow answers by specific chapters or topics. I tried pgvector first, but Qdrant's performance and API are better when you need to scale beyond small datasets.",
    "websiteUrl": "https://qdrant.tech/",
    "reviewUrl": "https://owaisabdullah.dev/stack/qdrant"
  },
  {
    "_id": "HCcsE6imGnTNXGDBy8NnNu",
    "category": "infra",
    "clientFit": "When they need Redis features but don't want to manage Redis servers. Also great for edge caching and rate limiting in serverless or edge environments.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://upstash.com/docs",
    "featured": false,
    "githubUrl": "https://github.com/upstash/upstash-redis",
    "logoUrl": null,
    "myRating": 4,
    "name": "Upstash Redis",
    "projectsUsingIt": [
      "Octively"
    ],
    "slug": "upstash-redis",
    "stackLayer": "Caching / Queue",
    "tagline": "Serverless Redis with edge caching and durable storage.",
    "useCase": "It's Redis without the operational overhead. I use it for rate limiting, session storage, and caching API responses. The serverless model means I don't pay for idle connections, and the durable storage option means I don't lose everything on restart.",
    "websiteUrl": "https://upstash.com/",
    "reviewUrl": "https://owaisabdullah.dev/stack/upstash-redis"
  },
  {
    "_id": "HCcsE6imGnTNXGDBy8NnvI",
    "category": "infra",
    "clientFit": "When they need a Python backend or are migrating from Flask/Django. Also great for ML teams that want to expose models via API without writing much web code.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://fastapi.tiangolo.com/",
    "featured": false,
    "githubUrl": "https://github.com/tiangolo/fastapi",
    "logoUrl": null,
    "myRating": 4,
    "name": "FastAPI",
    "projectsUsingIt": [
      "ShopMate"
    ],
    "slug": "fastapi",
    "stackLayer": "API Layer",
    "tagline": "Python web framework with async support, automatic docs, and type hints.",
    "useCase": "FastAPI makes writing Python APIs feel modern. The automatic OpenAPI docs mean I don't have to maintain separate API documentation. Async support matters when I'm calling external services or databases. It's fast, batteries-included, and the ecosystem is solid.",
    "websiteUrl": "https://fastapi.tiangolo.com/",
    "reviewUrl": "https://owaisabdullah.dev/stack/fastapi"
  },
  {
    "_id": "VF6nMVzH5KBV4WFWf0PBIO",
    "category": "infra",
    "clientFit": "When they need a complete backend quickly—auth, database, storage—without managing servers. Also when they want SQL instead of NoSQL but still need real-time features.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://supabase.com/docs",
    "featured": false,
    "githubUrl": "https://github.com/supabase/supabase",
    "logoUrl": null,
    "myRating": 4,
    "name": "Supabase",
    "projectsUsingIt": [
      "Agency CRM"
    ],
    "slug": "supabase",
    "stackLayer": "Backend Layer",
    "tagline": "Firebase alternative with PostgreSQL, auth, storage, and real-time subscriptions.",
    "useCase": "I've used Supabase for Agency CRM and client projects that need backend without building one. The PostgreSQL foundation means I can run raw SQL when ORMs get in the way. Real-time subscriptions work well for collaborative features. I chose it over Firebase because I prefer SQL to NoSQL—data migrations and debugging are easier.",
    "websiteUrl": "https://supabase.com/",
    "reviewUrl": "https://owaisabdullah.dev/stack/supabase"
  },
  {
    "_id": "VF6nMVzH5KBV4WFWf0PBS0",
    "category": "auth",
    "clientFit": "When they need comprehensive auth fast and don't want to build it themselves. Also for B2B apps that need organization management and role-based access.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://clerk.com/docs",
    "featured": false,
    "githubUrl": "https://github.com/clerkinc/clerk",
    "logoUrl": null,
    "myRating": 4,
    "name": "Clerk",
    "projectsUsingIt": [],
    "slug": "clerk",
    "stackLayer": "Auth Layer",
    "tagline": "Authentication for web apps with social logins, MFA, and organization management.",
    "useCase": "Clerk is my alternative to Better Auth when clients want a drop-in solution. The UI components are polished and work out of the box. Organization support and user management save time on B2B apps. I recommend it over Auth0 for smaller teams because the pricing is more transparent and the DX is better for Next.js.",
    "websiteUrl": "https://clerk.com/",
    "reviewUrl": "https://owaisabdullah.dev/stack/clerk"
  },
  {
    "_id": "VF6nMVzH5KBV4WFWf0PBgQ",
    "category": "infra",
    "clientFit": "When they want type-safe database access with minimal boilerplate. Also for teams that need good migration tooling and visual schema management.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://www.prisma.io/docs",
    "featured": false,
    "githubUrl": "https://github.com/prisma/prisma",
    "logoUrl": null,
    "myRating": 4,
    "name": "Prisma ORM",
    "projectsUsingIt": [
      "GigBillow"
    ],
    "slug": "prisma-orm",
    "stackLayer": "Database Layer",
    "tagline": "Type-safe database ORM with migrations, schema generation, and query building.",
    "useCase": "I use Prisma when clients want an ORM with better tooling than Drizzle. The schema-as-code approach works well for teams that want visual schema editors. The migration system is solid—automatic rollback and schema diffs prevent mistakes. I pick it over Drizzle for larger teams where the GUI and docs help onboarding.",
    "websiteUrl": "https://www.prisma.io/",
    "reviewUrl": "https://owaisabdullah.dev/stack/prisma-orm"
  },
  {
    "_id": "WfWsEMMn07QrksA9qq7S20",
    "category": "infra",
    "clientFit": "When their agents need to research or fact-check against current web content. Also when they want structured answers rather than raw search results.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://docs.tavily.com/docs/tavily-api",
    "featured": false,
    "githubUrl": null,
    "logoUrl": null,
    "myRating": 4,
    "name": "Tavily API",
    "projectsUsingIt": [
      "AI Content Generator",
      "Weather Info Agent"
    ],
    "slug": "tavily-api",
    "stackLayer": "Data Access",
    "tagline": "Web search API optimized for AI agents with extraction, context, and answers built in.",
    "useCase": "I use Tavily in research agents that need live web data. It returns structured answers instead of just raw search results, which saves me from parsing HTML. The context inclusion means my agents get relevant background without making extra calls. It's more expensive than generic search APIs, but the time saved on parsing and cleaning data is worth it.",
    "websiteUrl": "https://tavily.com/",
    "reviewUrl": "https://owaisabdullah.dev/stack/tavily-api"
  },
  {
    "_id": "pNIqEpEO0fiymjtJRpqdtb",
    "category": "infra",
    "clientFit": "When they want to self-host for cost, compliance, or control reasons. Also good for teams transitioning from manual deployments to CI/CD.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://dokploy.com/docs",
    "featured": false,
    "githubUrl": "https://github.com/Dokploy/Dokploy",
    "logoUrl": null,
    "myRating": 4,
    "name": "Dokploy",
    "projectsUsingIt": [
      "ShopMate",
      "Octively"
    ],
    "slug": "dokploy",
    "stackLayer": "Deployment",
    "tagline": "Self-hosted deployment platform with Docker support, SSL, and continuous deployment.",
    "useCase": "I deploy apps to my own servers without dealing with raw Docker Compose files. Dokploy handles SSL, reverse proxying, and GitHub-based deployments. It's like Vercel but on hardware I control. I use it for internal tools and client projects that can't be on public cloud.",
    "websiteUrl": "https://dokploy.com/",
    "reviewUrl": "https://owaisabdullah.dev/stack/dokploy"
  },
  {
    "_id": "pNIqEpEO0fiymjtJRpr3ld",
    "category": "dev-tool",
    "clientFit": "When they need AI agents with transparent reasoning—users should see what the agent is doing. Also for internal tools where teams need to monitor agent behavior.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://docs.chainlit.io/",
    "featured": false,
    "githubUrl": "https://github.com/Chainlit/chainlit",
    "logoUrl": null,
    "myRating": 4,
    "name": "Chainlit",
    "projectsUsingIt": [
      "SaaS Business Plan Agent"
    ],
    "slug": "chainlit",
    "stackLayer": "UI Framework",
    "tagline": "Python framework for AI chatbot UIs with streaming responses and tool call visualization.",
    "useCase": "I used Chainlit for a SaaS Business Plan Agent where seeing the agent's reasoning mattered. It displays tool calls, streaming responses, and conversation history in a clean interface. Building all that from scratch would take days. The built-in authentication and deployment options save time.",
    "websiteUrl": "https://chainlit.io/",
    "reviewUrl": "https://owaisabdullah.dev/stack/chainlit"
  },
  {
    "_id": "pNIqEpEO0fiymjtJRpr4D3",
    "category": "infra",
    "clientFit": "When they're serving media globally and want to avoid AWS egress fees. Also when they need S3 compatibility but better edge performance.",
    "dateAdded": "2025-01-15",
    "docsUrl": "https://developers.cloudflare.com/r2/",
    "featured": false,
    "githubUrl": null,
    "logoUrl": null,
    "myRating": 4,
    "name": "Cloudflare R2",
    "projectsUsingIt": [
      "ShopMate",
      "Octively"
    ],
    "slug": "cloudflare-r2",
    "stackLayer": "Storage Layer",
    "tagline": "S3-compatible object storage with zero egress fees and edge caching.",
    "useCase": "R2 handles images and file uploads for projects that need global distribution. No egress fees means I can serve files worldwide without surprise costs. The S3 API compatibility makes migrating from existing storage simple. I've used it for video hosting and asset delivery where Cloudflare's edge makes a noticeable difference in load times.",
    "websiteUrl": "https://www.cloudflare.com/products/zero-trust/zero-trust-network-access/r2",
    "reviewUrl": "https://owaisabdullah.dev/stack/cloudflare-r2"
  }
];

export function formatCuratedStack(toolsList: CuratedToolItem[]): CuratedStackProfile {
  const formattedTools = toolsList.map((tool) => ({
    ...tool,
    reviewUrl: tool.slug ? `https://owaisabdullah.dev/stack/${tool.slug}` : undefined,
  }));

  const byCategory = formattedTools.reduce((acc, tool) => {
    const cat = tool.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tool);
    return acc;
  }, {} as Record<string, CuratedToolItem[]>);

  const essentialTools = formattedTools.filter(
    (t) => t.featured || t.myRating === 5
  );

  return {
    title: "The Agent Stack",
    tagline: "Tools I use to build AI employees that never clock out.",
    url: "https://owaisabdullah.dev/stack",
    description:
      "A curated, opinionated toolkit of AI frameworks, MCP servers, and infrastructure used to build autonomous AI employees (Digital FTEs), Next.js SaaS products, and production agent orchestration systems. No affiliate links, no scraped lists.",
    methodology: {
      title: "Why This Stack Wins",
      description:
        "Every tool in this stack is vetted in production environments for speed, state persistence, low latency, and reliability.",
      points: [
        "Spec-driven state machines with typed schemas instead of fragile prompt chains",
        "Model Context Protocol (MCP) servers for standardized tool and API connectivity",
        "Unified model routing via LiteLLM with fallback chains and cost monitoring",
        "Dual-layer memory combining Neon Postgres for structured relational state with pgvector & Qdrant for semantic search",
      ],
    },
    categories: STACK_CATEGORIES,
    layers: curatedStackLayers,
    totalTools: formattedTools.length,
    essentialTools,
    tools: formattedTools,
    byCategory,
  };
}

export const initialCuratedStack = formatCuratedStack(initialCuratedTools);
