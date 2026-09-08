export interface PainPoint {
  problem: string;
  solution: string;
}

export interface SetupStep {
  step: string;
  command?: string;
  note?: string;
}

export interface RoadmapItem {
  milestone: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
}

export interface ShowcaseProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "AI Tool" | "Platform" | "Marketplace" | "Ecommerce" | "Institution" | "Digital FTE";
  licenseType: string;
  licenseDetails: string;
  isPrivateRepo?: boolean;
  privateNotice?: string;
  targetAudience?: string; // e.g. "Store Owners & Operations Teams (Internal Admin)"
  githubUrl?: string;
  liveUrl?: string;
  image: string;
  alternativeTo: string[];
  pricingComparison: {
    traditionalTool: string;
    traditionalCost: string;
    thisProjectCost: string;
    savings: string;
  };
  techStack: string[];
  keywords: string[];
  painPoints: PainPoint[];
  keyFeatures: string[];
  architectureOverview: string;
  setupGuide: {
    prerequisites: string[];
    envVars?: { key: string; description: string; example: string }[];
    steps: SetupStep[];
  };
  roadmap: RoadmapItem[];
}

export const showcaseProjects: ShowcaseProject[] = [
  {
    slug: "contentfte",
    title: "ContentFTE",
    tagline: "Autonomous AI Content Employee (Digital FTE) with Internal Link Knowledge Graph & Sanity Publishing",
    description:
      "ContentFTE is an autonomous multi-agent Digital FTE that continuously researches search queries, extracts competitor outlines via Tavily, drafts in-depth 1500–2500 word SEO articles, renders high-converting visuals via Cloudflare Workers AI (FLUX.2 [dev]), and publishes directly to Sanity CMS with a built-in semantic Internal Link Knowledge Graph and human-in-the-loop Discord approvals.",
    category: "Digital FTE",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, educational, and non-commercial research use with mandatory attribution to Owais Abdullah. Packaging into paid agency client deliverables or commercial SaaS resale requires authorization.",
    isPrivateRepo: false,
    githubUrl: "https://github.com/MrOwaisAbdullah/ContentFTE",
    image: "/assets/placeholder.png",
    alternativeTo: ["Jasper AI", "SurferSEO", "Copy.ai", "Byword.ai", "Frase"],
    pricingComparison: {
      traditionalTool: "Jasper AI / SurferSEO + Dedicated Content Writers",
      traditionalCost: "$1,500 - $3,000 / month",
      thisProjectCost: "Free for Personal Use (Self-Hosted Open Agent Pipeline)",
      savings: "Save $18,000+/year on ongoing SEO content production"
    },
    techStack: [
      "Python 3.12+",
      "OpenAI Agents SDK",
      "Sanity CMS (GROQ)",
      "Google Sheets API",
      "Tavily Search API",
      "Cloudflare Workers AI (FLUX.2 [dev])",
      "Google Search Console API",
      "Discord Bot & Webhooks"
    ],
    keywords: [
      "Free Jasper AI alternative",
      "Open source SurferSEO alternative",
      "Autonomous SEO Content Agent",
      "Digital FTE",
      "Sanity CMS Auto Publisher",
      "Internal Link Knowledge Graph",
      "Python OpenAI Agents SDK",
      "Automated Blog Publishing"
    ],
    painPoints: [
      {
        problem: "Publishing 15+ SEO-optimized, thoroughly researched articles daily requires an entire agency team of researchers, copywriters, graphic designers, and CMS publishers.",
        solution: "ContentFTE executes the entire publishing lifecycle autonomously: keyword queue discovery, dual-stream web research, long-form writing, image generation, and CMS publishing."
      },
      {
        problem: "Automated AI content often generates dead or hallucinated links and neglects site-wide link architecture, hurting search engine crawlability.",
        solution: "Built-in Internal Link Knowledge Graph queries existing Sanity CMS articles via GROQ, matching relevant categories to inject real, contextual internal links with zero dead URLs."
      },
      {
        problem: "AI image generators on commercial plans cost \$20–\$50/month and fail when credits deplete.",
        solution: "Features an intelligent multi-tier visual engine: primary generation on Cloudflare Workers AI (10,000 free neurons/day) with automatic failover to Pexels stock photos."
      },
      {
        problem: "Publishing unreviewed AI drafts directly to production risks brand reputation and factual inaccuracies.",
        solution: "Integrated Discord bot delivers interactive approval cards to your private Discord channel, letting you review drafts and approve publishing with a single reaction."
      }
    ],
    keyFeatures: [
      "Semantic Internal Link Knowledge Graph: Actively queries Sanity via GROQ to fetch existing relevant posts and inject natural contextual hyperlinks into new drafts",
      "Multi-Agent Architecture: Autonomous pipeline coordinating Triage, Researcher, Content Brief, Writer, Evaluation, and Sanity Posting agents",
      "Google Search Console Integration: Pulls search performance analytics to prioritize underperforming URLs for automated refresh and optimization",
      "Multi-Tier Visual Engine: Generates featured and inline visuals using Cloudflare Workers AI FLUX.2 [dev] with instant fallback to Pexels stock photography",
      "Discord Human-in-the-Loop: Review generated titles, summaries, and Markdown drafts in private Discord channels with interactive ✅ reaction approvals",
      "Anti-AI-Pattern Editorial Engine: Enforces strict style guidelines eliminating em dashes, robotic transitions, and filler phrases for natural human cadence"
    ],
    architectureOverview:
      "Built with Python 3.12 and the OpenAI Agents SDK. A central GitHub Actions workflow orchestrates stages: Triage Agent selects keywords from Google Sheets (or discovers trending topics via Tavily when the queue is empty); Researcher Agent extracts live web data; Brief Agent formulates the structural outline; Writer Agent produces 1500–2500 words with schema FAQs; SanityAdapter resolves categories, injects internal links from existing CMS posts, uploads generated Cloudflare FLUX.2 [dev] visuals, and publishes the finished post to Sanity CMS.",
    setupGuide: {
      prerequisites: [
        "Python 3.12+ with uv package manager",
        "Google Cloud Service Account JSON credentials (with Google Sheets & Drive API enabled)",
        "Sanity.io Project ID, Dataset name, and Write Token",
        "Google Gemini API Key or OpenRouter API Key",
        "Tavily Search API Key for web research",
        "Discord Bot Token and Webhook URL (for approval notifications)"
      ],
      envVars: [
        { key: "GEMINI_API_KEY", description: "Primary LLM key for agent drafting and evaluation", example: "AIzaSy..." },
        { key: "OPENROUTER_API_KEY", description: "Fallback LLM router (openrouter/free & DeepSeek tiers)", example: "sk-or-v1-..." },
        { key: "GOOGLE_CREDENTIALS", description: "Single-line JSON string of Google Service Account credentials", example: "{\"type\":\"service_account\",...}" },
        { key: "TAVILY_API_KEY", description: "Search engine API key for live web and citation research", example: "tvly-dev-..." },
        { key: "SANITY_PROJECT_ID", description: "Your Sanity CMS project identifier", example: "y2wkvags" },
        { key: "SANITY_API_TOKEN", description: "Sanity API token with Editor (write) permissions", example: "skxSO..." },
        { key: "SANITY_DATASET", description: "Target Sanity dataset name", example: "production" },
        { key: "CLOUDFLARE_ACCOUNT_ID", description: "Cloudflare Account ID for free FLUX.2 [dev] image generation", example: "86a1be327..." },
        { key: "CLOUDFLARE_API_TOKEN", description: "Cloudflare API token with Workers AI:Edit permissions", example: "cfut_..." },
        { key: "DISCORD_WEBHOOK_URL", description: "Discord channel webhook for approval notifications", example: "https://discord.com/api/webhooks/..." }
      ],
      steps: [
        {
          step: "Clone the repository",
          command: "git clone https://github.com/MrOwaisAbdullah/ContentFTE.git\ncd ContentFTE"
        },
        {
          step: "Install dependencies using uv",
          command: "uv sync",
          note: "This automatically provisions and manages .venv directly from pyproject.toml."
        },
        {
          step: "Configure environment variables",
          command: "cp .env.example .env",
          note: "Populate .env with your Google Service Account JSON, Gemini/OpenRouter keys, Tavily key, and Sanity tokens."
        },
        {
          step: "Configure Google Sheets Database",
          note: "Create two spreadsheets: 'ContentSpark_Keywords' (with Keyword and Status columns) and 'ContentSpark' (with research_data, content_briefs, generated_posts, approved_unpublished, and published_posts worksheets) and share both with your service account email as Editor."
        },
        {
          step: "Run the full pipeline locally or trigger via GitHub Actions",
          command: "uv run python scripts/run_stage.py --stage all",
          note: "Can also be scheduled continuously using .github/workflows/pipeline.yml or managed via the Discord bot."
        }
      ]
    },
    roadmap: [
      {
        milestone: "Internal Link Knowledge Graph",
        description: "Live semantic article graph scanning Sanity CMS via GROQ to auto-inject relevant contextual internal links into new posts.",
        status: "completed"
      },
      {
        milestone: "YouTube-to-Article Video Pipeline",
        description: "Extract video transcripts and timestamps via AssemblyAI and YouTube APIs to repurpose video content into formatted SEO blog posts.",
        status: "in-progress"
      },
      {
        milestone: "Multi-Language Auto-Localization",
        description: "Translate and culturally adapt generated articles into Spanish, Arabic, and German with localized schema markup.",
        status: "planned"
      }
    ]
  },
  {
    slug: "socialfte",
    title: "SocialFTE",
    tagline: "Autonomous AI Social Media Employee (Digital FTE) with Remotion Video Engine & Discord Approval Gate",
    description:
      "SocialFTE is an end-to-end autonomous social media employee. It writes brand-voice captions without robotic AI cliches, renders typography-driven MP4 video shorts using Remotion, delivers interactive approval cards to Discord, and publishes directly to Facebook, Instagram, YouTube Shorts, and TikTok.",
    category: "Digital FTE",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, educational, and showcase use with mandatory credit to Owais Abdullah. Commercial deployment for clients or SaaS resale requires a separate license.",
    isPrivateRepo: false,
    githubUrl: "https://github.com/MrOwaisAbdullah/socialfte",
    image: "/assets/placeholder.png",
    alternativeTo: ["Hootsuite", "Buffer", "Opus Clip", "Predis.ai", "Lately AI"],
    pricingComparison: {
      traditionalTool: "Hootsuite Enterprise + Opus Clip + Dedicated Video Editor",
      traditionalCost: "$600 - $1,500 / month",
      thisProjectCost: "Free for Personal Use (Self-Hosted Next.js + Python Architecture)",
      savings: "Save $10,000+/year on social media scheduling and video production tools"
    },
    techStack: [
      "Next.js 16",
      "Python 3.12+",
      "Remotion (React Video Engine)",
      "OpenAI Agents SDK",
      "Cloudflare R2",
      "Discord API",
      "FFmpeg & Whisper",
      "Neon PostgreSQL"
    ],
    keywords: [
      "Free Hootsuite alternative",
      "Open source Opus Clip alternative",
      "AI Social Media Employee",
      "Digital FTE",
      "Remotion Video Automation",
      "Autonomous Shorts Generator",
      "Next.js 16 Python Worker",
      "Discord Approval Bot"
    ],
    painPoints: [
      {
        problem: "Maintaining daily multi-platform content schedules across TikTok, YouTube Shorts, Facebook, and Instagram requires 2–3 dedicated employees.",
        solution: "SocialFTE handles the full lifecycle autonomously: drafting captions, rendering dynamic motion graphics, compiling MP4 videos, and scheduling distribution."
      },
      {
        problem: "Automated social bots post generic AI sludge with em dashes, robotic hype, and off-brand phrasing that harms customer trust.",
        solution: "Enforces strict brand guidelines (real prices upfront, no em dashes, conversational human tone) with zero tolerance for generic AI fluff."
      },
      {
        problem: "Fully autonomous social posting is risky; a single hallucinated post or incorrect price can spark PR nightmares.",
        solution: "Rigid human-in-the-loop governance: posts MUST be approved via Discord interactive button cards before touching live platform APIs."
      },
      {
        problem: "Creating video content programmatically is historically brittle and requires clunky command-line video stitching.",
        solution: "Leverages Remotion (React/TypeScript) to render pixel-perfect, typography-driven animated vertical videos and YouTube shorts on demand."
      }
    ],
    keyFeatures: [
      "Dual Architecture: High-performance Next.js 16 Dashboard UI + Python background AI worker",
      "Remotion Video Engine: Programmatically compiles vertical MP4 videos with dynamic captions, audio mixing, and motion graphics",
      "Discord Interactive Approvals: Posts are delivered as rich cards with 'Approve', 'Edit', or 'Reject' buttons",
      "Multi-Platform Publishing: Direct API publishing to Facebook, Instagram, YouTube Shorts, and TikTok",
      "Vision-Scored Cover Frame Picker: Evaluates best video frames for thumbnail click-through rate optimization",
      "Audit Trail & Rescheduling: Interactive calendar with daily-cap warnings and full execution logging"
    ],
    architectureOverview:
      "Split into two primary services: apps/dashboard (Next.js 16, Tailwind CSS, Neon Postgres) providing the visual calendar and review UI, and apps/worker (Python 3.12, LiteLLM, OpenAI Agents SDK) executing background drafting, media processing, and publishing. Video compositions live in packages/remotion. Approved posts trigger GitHub Actions dispatch or local headless workers to render MP4s, upload to Cloudflare R2, and distribute via platform APIs.",
    setupGuide: {
      prerequisites: [
        "Node.js 20+ and pnpm / npm",
        "Python 3.12+ with uv",
        "FFmpeg installed on your system",
        "Discord Bot Token and Webhook URL",
        "Cloudflare R2 bucket for asset storage"
      ],
      envVars: [
        { key: "DATABASE_URL", description: "Neon PostgreSQL connection string", example: "postgresql://..." },
        { key: "OPENROUTER_API_KEY", description: "LLM API key for caption drafting and post ideation", example: "sk-or-v1-..." },
        { key: "DISCORD_BOT_TOKEN", description: "Bot token for sending interactive approval cards", example: "MTIz..." },
        { key: "DISCORD_APPROVAL_CHANNEL_ID", description: "Discord channel ID for review cards", example: "123456789..." },
        { key: "R2_ACCOUNT_ID", description: "Cloudflare R2 Account ID for media hosting", example: "a1b2c3..." },
        { key: "R2_ACCESS_KEY_ID", description: "Cloudflare R2 Access Key", example: "your_access_key" },
        { key: "R2_SECRET_ACCESS_KEY", description: "Cloudflare R2 Secret Access Key", example: "your_secret_key" },
        { key: "R2_BUCKET", description: "R2 storage bucket name", example: "socialfte-assets" },
        { key: "R2_PUBLIC_URL", description: "Public CDN URL for uploaded media", example: "https://media.example.com" }
      ],
      steps: [
        {
          step: "Clone the repository",
          command: "git clone https://github.com/MrOwaisAbdullah/socialfte.git\ncd socialfte"
        },
        {
          step: "Install web dashboard dependencies",
          command: "npm install",
          note: "Installs Next.js 16 dashboard and Remotion video rendering packages."
        },
        {
          step: "Install Python worker dependencies",
          command: "cd apps/worker && uv sync && cd ../..",
          note: "Provisions Python virtual environment for the AI generation worker."
        },
        {
          step: "Configure environment variables",
          command: "cp .env.example .env",
          note: "Set your database URL, OpenRouter key, Discord tokens, and Cloudflare R2 credentials."
        },
        {
          step: "Run the development server and worker",
          command: "npm run dev",
          note: "Launches the Next.js 16 content planner dashboard on localhost:3000."
        }
      ]
    },
    roadmap: [
      {
        milestone: "Direct TikTok Content Posting API",
        description: "Full integration with TikTok Content Posting API for direct scheduled video uploads.",
        status: "completed"
      },
      {
        milestone: "Automated Audio Ducking & Waveform Rendering",
        description: "Intelligent background music ducking when speech is detected, paired with animated audio waveforms.",
        status: "in-progress"
      },
      {
        milestone: "Multi-Brand Workspace Isolation",
        description: "Manage multiple client brands with distinct style guides and Discord channels from a single dashboard.",
        status: "planned"
      }
    ]
  },
  {
    slug: "digital-fte",
    title: "Digital FTE",
    tagline: "Standardized Autonomous AI Employee Framework with Memory Vaults & Gated Tools",
    description:
      "Digital FTE is an architectural blueprint and operating system for running autonomous AI employees. It combines persistent Git/Obsidian memory vaults, Model Context Protocol (MCP) integrations, and a 4-tier capability model (Bronze to Platinum) with human-in-the-loop approval gating.",
    category: "Digital FTE",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, educational, and research use with mandatory credit to Owais Abdullah. Commercial deployment for client organizations requires authorization.",
    isPrivateRepo: false,
    githubUrl: "https://github.com/MrOwaisAbdullah/Digital-FTE",
    image: "/assets/projects/digital-fte.svg",
    alternativeTo: ["Devin", "AutoGPT", "CrewAI Enterprise", "Multi-Agent Frameworks"],
    pricingComparison: {
      traditionalTool: "Devin / Managed Agent Platforms",
      traditionalCost: "$500 - $2,000 / month / agent",
      thisProjectCost: "Free for Personal Use (Self-Hosted Architecture)",
      savings: "Zero markup on compute — run directly on your own API keys"
    },
    techStack: [
      "Claude Code",
      "Obsidian (Markdown Vault)",
      "Model Context Protocol (MCP)",
      "Python 3.12+",
      "Git & GitHub Actions",
      "Shell Scripting"
    ],
    keywords: [
      "Free Devin alternative",
      "Open architecture AutoGPT alternative",
      "Digital FTE Architecture",
      "Autonomous AI Employees",
      "Claude Code Agents",
      "Model Context Protocol MCP",
      "Obsidian Agent Memory",
      "AI Worker Framework 2026"
    ],
    painPoints: [
      {
        problem: "Conventional AI chatbots are passive; they sit idle waiting for a prompt and lose all memory as soon as the session closes.",
        solution: "Digital FTE introduces persistent, git-versioned memory vaults (Company Handbook, Business Goals, Task Queues) that agents continuously read from and write to."
      },
      {
        problem: "Companies lack a structured path to transition from basic automation scripts to trustworthy autonomous agents.",
        solution: "Provides a standardized 4-tier blueprint (Bronze, Silver, Gold, Platinum) with clear boundaries, human-in-the-loop checkpoints, and tool access controls."
      },
      {
        problem: "Agents running in production without sandboxing can accidentally overwrite production databases or send unvetted customer emails.",
        solution: "Implements strict folder-based gating (Needs_Action/ -> Pending_Approval/ -> In_Progress/ -> Done/) preventing unsupervised side effects."
      }
    ],
    keyFeatures: [
      "Tiered Capability Model: Bronze (Automations), Silver (Reactive Tool Agents), Gold (Autonomous Task Solvers), Platinum (Multi-Agent Swarms)",
      "Git-Versioned Brain: Central knowledge repository storing operating procedures, tone guidelines, and company facts",
      "Model Context Protocol (MCP): Connects agents cleanly to databases, email servers, Slack, and file systems",
      "Human-in-the-Loop Gating: Explicit approval gates for financial, client-facing, or destructive actions",
      "Multi-Agent Handshakes: Cloud-hosted coordinator agents delegate tasks smoothly to local execution workers"
    ],
    architectureOverview:
      "The core architecture centers around the Digital FTE Shared Vault. The vault contains markdown-based operational definitions: Company Handbook, Business Goals, and task stages. Agents utilize MCP servers to interact with external services (APIs, databases, file system). When an event occurs, the coordinator evaluates the task, moves it to In_Progress, requests approval if sensitive, executes the steps, and logs output in Done.",
    setupGuide: {
      prerequisites: [
        "Git and Python 3.12+",
        "Claude Code CLI or compatible LLM agent harness",
        "Obsidian (optional, for visual vault inspection)"
      ],
      steps: [
        {
          step: "Clone the blueprint repository",
          command: "git clone https://github.com/MrOwaisAbdullah/Digital-FTE.git\ncd Digital-FTE"
        },
        {
          step: "Review Tiered Specifications",
          note: "Inspect Bronze, Silver, Gold, and Platinum tier specifications to identify the right model for your business."
        },
        {
          step: "Initialize your shared vault",
          command: "git clone https://github.com/MrOwaisAbdullah/digital-fte-vault.git my-vault",
          note: "Fill in Company_Handbook.md and Business_Goals.md with your organization's rules."
        }
      ]
    },
    roadmap: [
      {
        milestone: "Multi-Agent Consensus Protocol",
        description: "Enable two distinct agents to cross-verify work before requesting human approval.",
        status: "in-progress"
      },
      {
        milestone: "Automated KPI Scorecard Engine",
        description: "Weekly automated metric compilation evaluating digital employee output quality and ROI.",
        status: "planned"
      }
    ]
  },
  {
    slug: "shopmate-fte",
    title: "ShopMate",
    tagline: "Autonomous AI Operations Employee for Shopify Store Owners (Internal Operations & Support)",
    description:
      "ShopMate is a dedicated AI operations employee built specifically for Shopify store owners and merchant internal teams. Built on the Agent Factory architecture with portable markdown skills and Neon Postgres memory, it answers shopper questions in English, Urdu, and Roman Urdu, checks live order statuses, captures buying intent leads, and compiles daily operations digests directly in the merchant terminal.",
    category: "Digital FTE",
    licenseType: "Proprietary / Private Internal Core (Community Specs Available)",
    licenseDetails:
      "ShopMate core and hosted editions are proprietary internal software developed for managed e-commerce clients. Source code is maintained in a private repository; open community guidelines and connection specs are documented for portfolio review.",
    isPrivateRepo: true,
    privateNotice: "Private Client & Internal Operations Repository. Demonstration architecture and live store deployment available upon request.",
    targetAudience: "Shopify Store Owners, E-Commerce Managers, and Internal Support Operations",
    liveUrl: "https://shopmate.octively.com",
    image: "/assets/placeholder.png",
    alternativeTo: ["Gorgias", "Tidio AI", "Intercom for Shopify", "Zendesk AI", "Re:amaze"],
    pricingComparison: {
      traditionalTool: "Gorgias / Intercom Shopify Helpdesk per-ticket fees",
      traditionalCost: "$300 - $900 / month",
      thisProjectCost: "Internal Digital Employee (Fixed Model Compute)",
      savings: "Eliminates recurring per-ticket and per-seat support fees"
    },
    techStack: [
      "Python 3.11+",
      "Shopify Admin & Storefront API",
      "LiteLLM (DeepSeek V4 Flash / Gemini)",
      "Neon PostgreSQL + pgvector",
      "Model Context Protocol (MCP)",
      "OpenCode / Claude Code Runtime",
      "Upstash Redis"
    ],
    keywords: [
      "Free Gorgias alternative",
      "Shopify AI Employee",
      "Store Owner Operations Assistant",
      "E-commerce Digital FTE",
      "Shopify Order Tracking Bot",
      "Urdu Roman Urdu Customer Support",
      "Private E-Commerce Agent"
    ],
    painPoints: [
      {
        problem: "Shopify store owners spend hours every day answering repetitive 'Where is my order?' (WISMO) questions instead of focusing on growth and sourcing.",
        solution: "ShopMate securely connects to Shopify APIs to verify order numbers and emails, fetching live fulfillment statuses and tracking links in seconds."
      },
      {
        problem: "South Asian and diaspora e-commerce stores lose sales when support chatbots fail to understand mixed languages like Roman Urdu and Urdu phrasing.",
        solution: "Engineered with trilingual language comprehension (English, Urdu, Roman Urdu) to converse naturally with local and international shoppers."
      },
      {
        problem: "Generic support bots improvise and hallucinate inventory numbers, discounts, or return policies.",
        solution: "Enforces a strict 10-step loop: classification into explicit markdown skills, ground verification against live catalog/FAQ, and zero out-of-scope improvisation."
      },
      {
        problem: "Store owners lack visibility into after-hours customer inquiries, lost sales, and complaints.",
        solution: "Generates an automated daily digest in the owner's terminal summarizing inquiries handled, captured leads, and issues requiring personal escalation."
      }
    ],
    keyFeatures: [
      "Store Owner Operations Focus: Built exclusively for store owners and internal teams to manage customer service, lead capture, and daily summaries",
      "Trilingual Shopper Support: Smoothly answers product queries and policies in English, Urdu, and Roman Urdu",
      "Grounded Order Tracking: Verifies order number and email against live Shopify Storefront and Admin APIs before revealing fulfillment details",
      "Lead Capture Engine: Automatically records buying intent, wholesale/bulk inquiries, and unanswered questions with timestamps",
      "Runtime Agnostic Brain: Pluggable agent runtime supporting OpenCode, Qwen Code, Claude Code, and Command Code via LiteLLM",
      "Zero-Improvisation Safeguard: Escalate angry customers, legal threats, or off-policy requests to the store owner rather than hallucinating"
    ],
    architectureOverview:
      "ShopMate operates on the Agent Factory architecture: an agent brain executing portable markdown skills backed by Neon Postgres memory (pgvector embeddings for FAQ/policy RAG) and Shopify Storefront/Admin MCP tools. Messages pass through a mandatory 10-step loop: Context Loading -> Skill Classification -> Plan Cap Verification -> Role Authentication -> Catalog Grounding -> Approval Check -> Action Execution -> Ledger Recording -> Redacted Telemetry -> Grounded Response.",
    setupGuide: {
      prerequisites: [
        "Python 3.11+ with uv package manager",
        "Shopify Custom App Access Token (read_products, read_orders, read_customers)",
        "Shopify Storefront API Access Token",
        "Neon PostgreSQL database with pgvector",
        "OpenRouter API Key (for DeepSeek routine models) or Gemini API Key"
      ],
      envVars: [
        { key: "EDITION", description: "Deployment edition: community (read-only) or hosted (write/actions)", example: "community" },
        { key: "RUNTIME", description: "Agent execution runtime", example: "opencode" },
        { key: "SHOPIFY_STORE", description: "Your Shopify store domain", example: "yourstore.myshopify.com" },
        { key: "SHOPIFY_ADMIN_TOKEN", description: "Shopify Custom App Admin API token", example: "shpat_..." },
        { key: "SHOPIFY_STOREFRONT_TOKEN", description: "Shopify Storefront API access token", example: "sf_tok_..." },
        { key: "NEON_DATABASE_URL", description: "Neon PostgreSQL connection string for agent memory", example: "postgres://..." },
        { key: "OPENROUTER_API_KEY", description: "OpenRouter key for DeepSeek V4 Flash default model", example: "sk-or-v1-..." },
        { key: "GEMINI_API_KEY", description: "Direct Gemini API key for fallback routing", example: "AIzaSy..." },
        { key: "EMBEDDINGS", description: "Vector embeddings model provider", example: "openrouter:openai/text-embedding-3-small" }
      ],
      steps: [
        {
          step: "Request Repository Access or Review Community Specs",
          note: "ShopMate core is an internal proprietary project. Authorized team members clone from the private remote; open community guidelines are documented below."
        },
        {
          step: "Install dependencies using uv",
          command: "uv sync",
          note: "Provisions Python virtual environment from pyproject.toml."
        },
        {
          step: "Configure environment variables",
          command: "cp .env.example .env",
          note: "Set your SHOPIFY_STORE, SHOPIFY_ADMIN_TOKEN, SHOPIFY_STOREFRONT_TOKEN, and NEON_DATABASE_URL."
        },
        {
          step: "Verify credentials and connections",
          command: "uv run shopmate doctor",
          note: "Live-checks database connectivity, embeddings provider, and model alias routing."
        },
        {
          step: "Initialize database and start terminal employee",
          command: "uv run shopmate init && uv run shopmate serve",
          note: "Creates memory tables and begins serving customer inquiries and generating daily operations digests."
        }
      ]
    },
    roadmap: [
      {
        milestone: "Trilingual Customer Ingestion",
        description: "Fluent understanding of English, Urdu, and Roman Urdu customer inquiries grounded in live catalog data.",
        status: "completed"
      },
      {
        milestone: "WhatsApp Storefront Dispatcher",
        description: "Connect ShopMate directly to WhatsApp Business API for instant conversational order lookups.",
        status: "in-progress"
      },
      {
        milestone: "Autonomous Theme Editor with Visual Staging",
        description: "Hosted capability allowing store owners to request banner changes and promotion launches via staged previews.",
        status: "planned"
      }
    ]
  },
  {
    slug: "owflex-chatbot-saas",
    title: "OwFlex",
    tagline: "Multi-Tenant AI Chatbot SaaS Platform with Embeddable Web Widget & RAG (Private Core)",
    description:
      "OwFlex is a production-ready, multi-tenant AI Chatbot SaaS platform built with Next.js, Drizzle ORM, and Sanity CMS. It enables businesses to upload custom knowledge bases, configure branded AI assistants, and embed them onto any website using a single line of JavaScript code.",
    category: "Platform",
    licenseType: "Proprietary / Private Commercial SaaS Core",
    licenseDetails:
      "OwFlex is a commercial SaaS product developed by Owais Abdullah. The core platform repository is private. Architecture, live demo instances, and tenant integration guides are presented here for portfolio review.",
    isPrivateRepo: true,
    privateNotice: "Private Commercial SaaS Repository. Code access is restricted to authorized enterprise partners; interactive demos and client onboarding portals are available publicly.",
    targetAudience: "B2B SaaS Clients, Digital Agencies, and Website Owners seeking branded customer chatbots",
    image: "/assets/placeholder.png",
    alternativeTo: ["Chatbase", "FastBots", "Dante AI", "SiteGPT", "Voiceflow"],
    pricingComparison: {
      traditionalTool: "Chatbase / SiteGPT Monthly Subscriptions",
      traditionalCost: "$99 - $399 / month",
      thisProjectCost: "Private Multi-Tenant SaaS Platform",
      savings: "Custom branded deployment with complete data ownership"
    },
    techStack: [
      "Next.js 15 (App Router)",
      "TypeScript",
      "Tailwind CSS",
      "Drizzle ORM",
      "Neon PostgreSQL (pgvector)",
      "BetterAuth",
      "Sanity CMS",
      "Stripe Billing",
      "OpenRouter API"
    ],
    keywords: [
      "Free Chatbase alternative",
      "Open source SiteGPT alternative",
      "AI Chatbot SaaS",
      "Next.js 15 SaaS Starter",
      "Embeddable Chat Widget",
      "Drizzle ORM RAG",
      "Multi-Tenant Chatbot Platform"
    ],
    painPoints: [
      {
        problem: "Building a reliable multi-tenant chatbot SaaS with document indexing, auth, token limits, and embed scripts takes 3–6 months from scratch.",
        solution: "OwFlex provides a complete, battle-tested architecture with workspace isolation, vector search, billing, and embed scripts."
      },
      {
        problem: "Embedding chatbots onto third-party client websites often creates CSS conflicts and bloats client page bundle sizes.",
        solution: "Features a standalone, zero-dependency lightweight embed script that injects an isolated iframe widget compatible with WordPress, Shopify, and custom web apps."
      },
      {
        problem: "Specialized vector database hosting often adds unnecessary monthly costs and infrastructure complexity.",
        solution: "Utilizes PostgreSQL pgvector with Drizzle ORM, delivering sub-second vector similarity search directly inside the primary application database."
      }
    ],
    keyFeatures: [
      "1-Line Embed Script: Drop-in JavaScript tag working across WordPress, Shopify, Webflow, and custom websites",
      "Multi-Tenant Workspace Isolation: Independent organizations, team members, and role-based permissions",
      "RAG Document Ingestion: Parse PDFs, DOCX, text files, and website sitemaps into vector embeddings",
      "Visual Customization: Match chatbot colors, avatar, launcher position, and greeting messages to brand styling",
      "Stripe Subscription Integration: Tiered pricing plans with automated monthly token usage metering",
      "Sanity Headless CMS: Effortlessly manage marketing copy, help articles, and onboarding documentation"
    ],
    architectureOverview:
      "Architected with Next.js 15 App Router. The application dashboard handles authentication, tenant configuration, and document indexing. Embeddable widget assets are served via a high-speed CDN proxy. Chat queries trigger vector similarity searches in Neon PostgreSQL (pgvector) using Drizzle ORM, feeding grounded context to LLM models for streaming responses.",
    setupGuide: {
      prerequisites: [
        "Node.js 20+ and npm",
        "PostgreSQL database with pgvector extension (e.g. Neon)",
        "Sanity.io account",
        "Stripe developer account"
      ],
      envVars: [
        { key: "DATABASE_URL", description: "PostgreSQL connection string with pgvector", example: "postgresql://..." },
        { key: "BETTER_AUTH_SECRET", description: "BetterAuth encryption and session secret", example: "secret_..." },
        { key: "BETTER_AUTH_URL", description: "Base URL for authentication callbacks", example: "https://app.example.com" },
        { key: "NEXT_PUBLIC_SANITY_PROJECT_ID", description: "Sanity CMS project ID for marketing & documentation", example: "xyz..." },
        { key: "SANITY_API_WRITE_TOKEN", description: "Sanity write token for content revalidation", example: "sk_..." },
        { key: "OPENROUTER_API_KEY", description: "API key for embeddings and conversational completions", example: "sk-or-v1-..." }
      ],
      steps: [
        {
          step: "Request Private Repository Access",
          note: "OwFlex is a private commercial product. Authorized collaborators clone via private SSH key; contact Owais Abdullah for partner licensing."
        },
        {
          step: "Install dependencies",
          command: "npm install",
          note: "Installs Next.js, Drizzle ORM, and client UI components."
        },
        {
          step: "Run database migrations with Drizzle",
          command: "npx drizzle-kit push",
          note: "Sets up multi-tenant tables, organization memberships, and vector embedding columns in Postgres."
        },
        {
          step: "Start the development server",
          command: "npm run dev",
          note: "Launches the tenant management portal and embed script generator on localhost:3000."
        }
      ]
    },
    roadmap: [
      {
        milestone: "Zero-Dependency Iframe Widget",
        description: "High-performance embeddable widget script loading across any website with isolated styling.",
        status: "completed"
      },
      {
        milestone: "Voice Interaction Mode",
        description: "Allow visitors to speak with the widget using low-latency speech-to-text and audio synthesis.",
        status: "planned"
      },
      {
        milestone: "HubSpot & Salesforce Integrations",
        description: "Automatically sync collected leads and conversation transcripts directly into popular CRMs.",
        status: "planned"
      }
    ]
  },
  {
    slug: "visati",
    title: "Visati",
    tagline: "Modern UAE & Dubai Visa Application and Processing SaaS Platform",
    description:
      "Visati is a digital visa services platform that streamlines UAE and Dubai visa applications. From eligibility checks to document collection, administrative reviews, Stripe payments, and automated PDF visa generation, it replaces tedious manual agency paperwork.",
    category: "Platform",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, learning, and portfolio review with mandatory credit to Owais Abdullah. Commercial deployment for travel agencies requires authorization.",
    isPrivateRepo: false,
    githubUrl: "https://github.com/MrOwaisAbdullah/visati",
    liveUrl: "https://visati-dubai.vercel.app/",
    image: "/assets/projects/visati.png",
    alternativeTo: ["Atlys", "Sherpa", "VFS Global Portals", "Manual Agency Processing"],
    pricingComparison: {
      traditionalTool: "Custom Enterprise Travel Agency Software",
      traditionalCost: "$8,000 - $20,000 upfront development",
      thisProjectCost: "Free for Personal & Portfolio Learning",
      savings: "Complete modern production-tested architecture"
    },
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Drizzle ORM",
      "Neon Postgres",
      "BetterAuth",
      "Stripe",
      "Sanity CMS"
    ],
    keywords: [
      "Free Atlys alternative",
      "Visa Processing SaaS",
      "Dubai Visa Application Platform",
      "Next.js Stripe Checkout",
      "BetterAuth Next.js",
      "Drizzle ORM Web App",
      "Document Upload Portal"
    ],
    painPoints: [
      {
        problem: "Travel agencies process visa applications manually via WhatsApp and email, losing track of passports, payment slips, and deadlines.",
        solution: "Visati provides a structured multi-step intake flow with real-time validation for passport scans, photos, and flight reservations."
      },
      {
        problem: "Applicants are frequently confused about which UAE visa type they qualify for (30-day, 60-day, transit, or multiple entry).",
        solution: "An interactive eligibility calculator recommends the exact visa category and displays transparent pricing before checkout."
      },
      {
        problem: "International travelers face payment failures on local bank portals with high currency conversion friction.",
        solution: "Integrated global Stripe checkout supporting multi-currency payments, Apple Pay, and Google Pay with instant receipts."
      }
    ],
    keyFeatures: [
      "Guided Multi-Step Application Flow: Intuitive applicant form with document validation and image previews",
      "Admin Operations Dashboard: Staff management portal to review, approve, reject, or request document re-uploads",
      "Stripe Checkout: Secure multi-currency transaction processing with automated invoicing",
      "Automated Status Notifications: Email and SMS milestone alerts keeping applicants informed of visa approval stages",
      "Dynamic PDF Generation: Generates printable summary dossiers and official visa document packages",
      "Headless CMS: Sanity CMS powering dynamic FAQ updates, travel guidelines, and regulatory changes"
    ],
    architectureOverview:
      "Engineered using Next.js App Router and TypeScript. Relational data (users, applications, documents, payments) is modeled in Neon Postgres via Drizzle ORM. BetterAuth handles authentication. Files are uploaded to secure S3 storage. Stripe webhooks listen for confirmed payments, automatically transitioning applications to the processing queue.",
    setupGuide: {
      prerequisites: [
        "Node.js 18+ and npm",
        "Neon PostgreSQL database",
        "Stripe account",
        "Sanity project"
      ],
      envVars: [
        { key: "DATABASE_URL", description: "Postgres database URL", example: "postgresql://..." },
        { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", example: "sk_test_..." },
        { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", description: "Stripe publishable key", example: "pk_test_..." },
        { key: "BETTER_AUTH_SECRET", description: "Session security secret", example: "random_string..." }
      ],
      steps: [
        {
          step: "Clone repository",
          command: "git clone https://github.com/MrOwaisAbdullah/visati.git\ncd visati"
        },
        {
          step: "Install dependencies",
          command: "npm install"
        },
        {
          step: "Run database migrations",
          command: "npx drizzle-kit push"
        },
        {
          step: "Start local development server",
          command: "npm run dev"
        }
      ]
    },
    roadmap: [
      {
        milestone: "Automated OCR Passport Extraction",
        description: "Extract passport number, expiry date, and nationality automatically using OCR to eliminate manual entry errors.",
        status: "in-progress"
      },
      {
        milestone: "Multi-Country Visa Expansion",
        description: "Expand system modules to support Saudi Arabia Umrah visas and Qatar travel authorizations.",
        status: "planned"
      }
    ]
  },
  {
    slug: "voice-of-holy-quran",
    title: "Voice of Holy Quran",
    tagline: "Global Online Quran Education Academy Platform for 1-on-1 Certified Tutoring",
    description:
      "Voice of Holy Quran is an online education and academy platform connecting global students of all ages with qualified, certified male and female Quran teachers. Features course catalogs, flexible time-zone scheduling, free trial booking, Brevo email notification workflows, and accessible audio streaming.",
    category: "Institution",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, community, and educational use with mandatory credit to Owais Abdullah. Cannot be sold or repackaged as a commercial software product without permission.",
    isPrivateRepo: false,
    githubUrl: "https://github.com/MrOwaisAbdullah/Voice-Of-Holy-Quran",
    liveUrl: "https://voiceofholyquran.com/",
    image: "/assets/placeholder.png",
    alternativeTo: ["Qutor", "Preply (Quran Tutors)", "Tarteel Academy", "Legacy Madrasa Systems"],
    pricingComparison: {
      traditionalTool: "Proprietary EdTech Tutoring Platforms",
      traditionalCost: "20% - 35% commission on teacher earnings",
      thisProjectCost: "Direct Academy Ownership (0% platform commissions)",
      savings: "100% direct revenue retention for academy operators"
    },
    techStack: [
      "Next.js 14/15",
      "TypeScript",
      "Tailwind CSS",
      "Brevo Email API",
      "Lucide Icons",
      "Audio Streaming API",
      "Vercel Edge"
    ],
    keywords: [
      "Free Qutor alternative",
      "Online Quran Academy",
      "Quran Tutors Online",
      "1-on-1 Quran Classes",
      "Next.js Education Platform",
      "Tajweed Learning Online",
      "Voice of Holy Quran"
    ],
    painPoints: [
      {
        problem: "Muslim families living in Western countries (USA, UK, Canada, Australia) struggle to find local qualified Quran teachers with flexible schedules.",
        solution: "Voice of Holy Quran connects students with verified, certified tutors available 24/7 across every international time zone."
      },
      {
        problem: "Large group Islamic classes leave hesitant children behind without individual pronunciation and Tajweed correction.",
        solution: "Exclusively 1-on-1 interactive sessions ensuring dedicated teacher attention, personalized pacing, and tailored feedback."
      },
      {
        problem: "Parents are hesitant to commit to monthly tuition without verifying the teacher's language fluency and methodology.",
        solution: "Built-in free evaluation trial booking flow letting parents experience a class before any financial commitment."
      }
    ],
    keyFeatures: [
      "Comprehensive Course Catalog: Noorani Qaida, Quran with Tajweed, Hifz Memorization, Tafseer, and Islamic Studies",
      "Global Time-Zone Matching: Accommodates families across North America, Europe, Australia, and the Middle East",
      "Vetted Certified Instructors: Male and female scholars fluent in English, Urdu, and Arabic",
      "Brevo Automated Inquiries: Delivers instantaneous student registration confirmations and schedules teacher consultations",
      "Streaming Recitation Portal: High-fidelity audio streaming of Holy Quran recitations with responsive Arabic typography",
      "Free Trial Booking System: Simple 2-step onboarding form connecting parents with academic coordinators"
    ],
    architectureOverview:
      "Built with modern Next.js App Router and TypeScript. Focuses on ultra-fast page load speeds, high search engine visibility for educational queries, mobile accessibility, Brevo email transactional automations, and direct WhatsApp / form scheduling integrations.",
    setupGuide: {
      prerequisites: [
        "Node.js 18+ and npm",
        "Brevo (Sendinblue) Account and API Key for email notifications"
      ],
      envVars: [
        { key: "BREVO_API_KEY", description: "Brevo transactional email API key", example: "xkeysib-..." },
        { key: "BREVO_SENDER_EMAIL", description: "Verified sender email address", example: "info@voiceofholyquran.com" },
        { key: "BREVO_SENDER_NAME", description: "Display name for outbound notifications", example: "Voice of Holy Quran" },
        { key: "BREVO_RECIPIENT_EMAIL", description: "Admin inbox receiving student registration inquiries", example: "admin@voiceofholyquran.com" }
      ],
      steps: [
        {
          step: "Clone the repository",
          command: "git clone https://github.com/MrOwaisAbdullah/Voice-Of-Holy-Quran.git\ncd Voice-Of-Holy-Quran"
        },
        {
          step: "Install dependencies",
          command: "npm install"
        },
        {
          step: "Configure environment variables",
          command: "cp .env.example .env.local",
          note: "Add your BREVO_API_KEY and sender credentials."
        },
        {
          step: "Start development server",
          command: "npm run dev"
        }
      ]
    },
    roadmap: [
      {
        milestone: "Interactive Digital Whiteboard",
        description: "Embedded in-browser Quran reading room with real-time synchronized Tajweed highlighting.",
        status: "in-progress"
      },
      {
        milestone: "Student Progress Portal",
        description: "Dedicated parent dashboard tracking lessons completed, surahs memorized, and teacher remarks.",
        status: "planned"
      }
    ]
  },
  {
    slug: "teamflow",
    title: "TeamFlow",
    tagline: "Intelligent Agency CRM, Workload Balancing & Task Assignment Platform",
    description:
      "TeamFlow is an agency-focused project management and CRM platform built with Next.js and Supabase. It uses intelligent workload balancing to assign tasks fairly, track project milestones, and prevent employee burnout.",
    category: "Platform",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, learning, and non-commercial team use with mandatory credit to Owais Abdullah. Direct commercial resale or paid hosting is prohibited.",
    isPrivateRepo: false,
    githubUrl: "https://github.com/MrOwaisAbdullah/Teamflow",
    liveUrl: "https://teamflow-sigma-opal.vercel.app/",
    image: "/assets/projects/teamflow.png",
    alternativeTo: ["Monday.com", "Asana", "ClickUp", "Basecamp", "Trello"],
    pricingComparison: {
      traditionalTool: "Monday.com / ClickUp Business Tier",
      traditionalCost: "$24 - $40 / user / month ($300+/mo for teams)",
      thisProjectCost: "Free for Personal & Internal Team Use",
      savings: "Save $3,600+/year in recurring agency project management SaaS fees"
    },
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Framer Motion"
    ],
    keywords: [
      "Free Monday.com alternative",
      "Open source ClickUp alternative",
      "Agency CRM",
      "TeamFlow SaaS",
      "Workload Balancing Platform",
      "Next.js Supabase CRM",
      "Task Assignment Software"
    ],
    painPoints: [
      {
        problem: "Agency managers assign tasks blindly, overloading top performers while underutilizing junior team members, causing burnout and missed deadlines.",
        solution: "TeamFlow calculates active team member capacity in real time, recommending the best assignee based on bandwidth and skill tags."
      },
      {
        problem: "Client project communications get fragmented across WhatsApp, Slack, and email chains, leading to lost file attachments and scope creep.",
        solution: "Centralized client milestones, project discussion threads, and deliverable review stages in a unified kanban dashboard."
      }
    ],
    keyFeatures: [
      "Intelligent Workload Balancing: Visual indicators of team bandwidth preventing task bottlenecks",
      "Multi-View Project Boards: Switch between Kanban columns, chronological Gantt timelines, and list views",
      "Role-Based Access Control: Granular permissions separating Agency Admins, Team Members, and External Clients",
      "Real-Time Activity Feeds: Powered by Supabase real-time subscriptions for instantaneous updates"
    ],
    architectureOverview:
      "Constructed on Next.js with Supabase (PostgreSQL) backend. Employs Supabase Row Level Security (RLS) for multi-tenant data isolation. React Server Components optimize dashboard load speeds while client components deliver fluid drag-and-drop interactions.",
    setupGuide: {
      prerequisites: [
        "Node.js 18+ and npm",
        "Supabase project URL & Anon Key"
      ],
      envVars: [
        { key: "NEXT_PUBLIC_SUPABASE_URL", description: "Supabase project URL", example: "https://xyz.supabase.co" },
        { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", description: "Supabase anonymous public key", example: "ey..." }
      ],
      steps: [
        {
          step: "Clone repository",
          command: "git clone https://github.com/MrOwaisAbdullah/Teamflow.git\ncd Teamflow"
        },
        {
          step: "Install dependencies",
          command: "npm install"
        },
        {
          step: "Start local server",
          command: "npm run dev"
        }
      ]
    },
    roadmap: [
      {
        milestone: "AI Sprint Estimation",
        description: "Analyze historical task completion times to predict delivery dates for incoming client scopes.",
        status: "in-progress"
      },
      {
        milestone: "Automated Slack Reminders",
        description: "Send daily morning digest summaries and upcoming deadline alerts to team Slack channels.",
        status: "planned"
      }
    ]
  },
  {
    slug: "rentparlo",
    title: "RentParlo",
    tagline: "Peer-to-Peer Equipment, Vehicle & Goods Rental Marketplace Platform",
    description:
      "RentParlo is an online peer-to-peer rental marketplace built with Next.js, TypeScript, and Stripe. It facilitates secure transactions between item owners and renters, with availability scheduling, rental contracts, and dispute management.",
    category: "Marketplace",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, learning, and non-commercial portfolio use with mandatory credit to Owais Abdullah. Commercial marketplace operation requires authorization.",
    isPrivateRepo: false,
    githubUrl: "https://github.com/MrOwaisAbdullah/rentparlo",
    liveUrl: "https://rentparlo.vercel.app/",
    image: "/assets/projects/rentparlo.png",
    alternativeTo: ["Fat Llama", "ShareGrid", "Spinlister", "Rent-A-Center Online"],
    pricingComparison: {
      traditionalTool: "Fat Llama / Custom Marketplace Script",
      traditionalCost: "25% fee per transaction or $10,000+ custom build",
      thisProjectCost: "Free for Personal & Portfolio Learning",
      savings: "Complete production rental marketplace architecture"
    },
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Stripe Connect",
      "Cloudinary"
    ],
    keywords: [
      "Free Fat Llama alternative",
      "P2P Rental Marketplace",
      "Equipment Rental Platform",
      "Next.js Marketplace",
      "RentParlo Pakistan",
      "Online Rental Software"
    ],
    painPoints: [
      {
        problem: "Buying expensive specialized equipment (cameras, power tools, party gear) for temporary needs is expensive and wasteful.",
        solution: "RentParlo empowers users to rent high-value assets locally at a fraction of purchase cost."
      },
      {
        problem: "Item owners are hesitant to rent their assets to strangers due to fear of theft, damage, or payment defaults.",
        solution: "Integrates mandatory renter identity verification, security deposit authorizations, and legally binding rental agreements."
      }
    ],
    keyFeatures: [
      "Date Range Availability Calendar: Prevents double bookings and calculates pricing based on daily/weekly rates",
      "Security Deposit Escrow: Holds security deposits via Stripe Connect and releases them upon safe return",
      "Comprehensive Search & Filters: Filter by geolocation radius, category, price, and owner ratings",
      "Owner Dashboard: Manage listings, approve booking requests, track earnings, and view rental histories"
    ],
    architectureOverview:
      "Full-stack Next.js web application utilizing PostgreSQL for structured listing schemas and booking state machines. Media uploads are processed and optimized via Cloudinary. Payments utilize Stripe Connect custom accounts for marketplace splits.",
    setupGuide: {
      prerequisites: [
        "Node.js 18+ and npm",
        "PostgreSQL database",
        "Stripe API keys"
      ],
      envVars: [
        { key: "DATABASE_URL", description: "PostgreSQL connection string", example: "postgresql://..." },
        { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", example: "sk_test_..." }
      ],
      steps: [
        {
          step: "Clone repository",
          command: "git clone https://github.com/MrOwaisAbdullah/rentparlo.git\ncd rentparlo"
        },
        {
          step: "Install dependencies",
          command: "npm install"
        },
        {
          step: "Run development server",
          command: "npm run dev"
        }
      ]
    },
    roadmap: [
      {
        milestone: "Automated KYC Verification",
        description: "Integrate government ID verification and selfie checks before allowing high-value rentals.",
        status: "in-progress"
      },
      {
        milestone: "In-App Damage Reporting",
        description: "Timestamped photo inspection flow during item pickup and return for objective damage resolution.",
        status: "planned"
      }
    ]
  },
  {
    slug: "yousuf-living",
    title: "Yousuf Living",
    tagline: "Workshop-Direct E-Commerce Store for Custom Bedroom & Living Sets",
    description:
      "Yousuf Living is a modern workshop-direct furniture platform connecting homeowners directly with skilled furniture artisans in Karachi. Features custom sizing selectors, WhatsApp consultations, fair pricing calculators, and city-wide logistics tracking.",
    category: "Ecommerce",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, learning, and portfolio examination with mandatory credit to Owais Abdullah.",
    isPrivateRepo: false,
    githubUrl: "https://github.com/MrOwaisAbdullah/Furniture-Site",
    liveUrl: "https://yousufliving.vercel.app/",
    image: "/assets/projects/yousuf-living.png",
    alternativeTo: ["Retail Furniture Showrooms", "Habitt", "Interwood Online", "Generic Shopify Stores"],
    pricingComparison: {
      traditionalTool: "Commercial Retail Showrooms",
      traditionalCost: "100% - 200% markup above manufacturing",
      thisProjectCost: "Direct Workshop Pricing + Free Code Architecture",
      savings: "Saves homeowners 40% - 60% on custom furniture"
    },
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Sanity CMS",
      "Drizzle ORM",
      "Upstash Redis",
      "Cloudflare R2",
      "WhatsApp Business API",
      "Framer Motion"
    ],
    keywords: [
      "Custom Furniture Store",
      "Workshop-Direct Furniture",
      "Next.js Ecommerce",
      "Karachi Furniture Online",
      "WhatsApp Ordering Ecommerce",
      "Bespoke Bedroom Sets"
    ],
    painPoints: [
      {
        problem: "Retail furniture showrooms mark up prices by 100–200% over manufacturing costs while offering zero flexibility on dimensions.",
        solution: "Yousuf Living delivers workshop-direct pricing with made-to-order sizing for beds, wardrobes, and dressing tables."
      },
      {
        problem: "Furniture shoppers require personalized material consultation (wood polish, fabric swatches) that static checkout carts fail to provide.",
        solution: "Direct 1-click WhatsApp checkout pre-filling custom item specs and routing shoppers immediately to workshop master craftsmen."
      }
    ],
    keyFeatures: [
      "Interactive Sizing & Polish Selectors: Choose King/Queen dimensions, wood finishes, and headboard fabrics",
      "Transparent Pricing Breakdown: Upfront pricing showing savings compared to retail showroom averages",
      "1-Click WhatsApp Ordering: Smooth customer handoff pre-filling full item specs directly into WhatsApp chat",
      "Sanity Headless CMS: Dynamic catalogue and furniture collections managed in real time",
      "High-Res Visual Gallery: Real workshop photography showing timber grain, joints, and finish details"
    ],
    architectureOverview:
      "Built with Next.js App Router for blazing performance and instant page loads. Tailwind CSS ensures clean, luxury-feel responsiveness across mobile and desktop. Dynamic product metadata enables high search rankings for local furniture queries.",
    setupGuide: {
      prerequisites: [
        "Node.js 18+ and npm",
        "Sanity.io account"
      ],
      envVars: [
        { key: "NEXT_PUBLIC_SANITY_PROJECT_ID", description: "Sanity Project ID", example: "xyz..." },
        { key: "NEXT_PUBLIC_SANITY_DATASET", description: "Sanity Dataset", example: "production" },
        { key: "SANITY_API_READ_TOKEN", description: "Sanity read token for live catalogue fetching", example: "sk..." },
        { key: "DATABASE_URL", description: "Database URL for order and customer records", example: "postgres://..." }
      ],
      steps: [
        {
          step: "Clone repository",
          command: "git clone https://github.com/MrOwaisAbdullah/Furniture-Site.git\ncd Furniture-Site"
        },
        {
          step: "Install dependencies",
          command: "npm install"
        },
        {
          step: "Configure environment variables",
          command: "cp .env.example .env.local",
          note: "Set your Sanity project ID and database credentials."
        },
        {
          step: "Run development server",
          command: "npm run dev"
        }
      ]
    },
    roadmap: [
      {
        milestone: "3D WebGL Room Visualizer",
        description: "Interactive 3D model viewer allowing customers to rotate and preview furniture in virtual rooms.",
        status: "planned"
      },
      {
        milestone: "Order Production Tracking",
        description: "Real-time tracker letting customers view woodworking, polishing, and delivery stages with photo updates.",
        status: "planned"
      }
    ]
  }
];

export function getShowcaseProject(slug: string): ShowcaseProject | undefined {
  return showcaseProjects.find((p) => p.slug === slug);
}

export function getAllShowcaseSlugs(): string[] {
  return showcaseProjects.map((p) => p.slug);
}
