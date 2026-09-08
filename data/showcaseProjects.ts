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
  category: "AI Tool" | "Platform" | "Marketplace" | "Ecommerce" | "Institution";
  licenseType: string;
  licenseDetails: string;
  githubUrl: string;
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
    tagline: "Autonomous AI Content Employee (Digital FTE) for Multi-Platform SEO Publishing",
    description:
      "ContentFTE is an autonomous multi-agent Digital FTE that researches search queries, structures comprehensive content briefs, writes 15–17 in-depth SEO articles daily, generates AI featured visuals, and publishes directly to Sanity CMS with pluggable adapters for WordPress, Shopify, Wix, and Headless CMS.",
    category: "AI Tool",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, educational, and research use with mandatory credit to Owais Abdullah. Direct commercial sale, packaging into paid client deliverables, or commercial licensing is strictly prohibited without written consent.",
    githubUrl: "https://github.com/MrOwaisAbdullah/ContentFTE",
    image: "/assets/placeholder.png",
    alternativeTo: ["Jasper AI", "SurferSEO", "Copy.ai", "Byword.ai", "Frase"],
    pricingComparison: {
      traditionalTool: "Jasper AI / SurferSEO + Content Writers",
      traditionalCost: "$1,500 - $3,000 / month",
      thisProjectCost: "Free for Personal Use (Self-Hosted / Open APIs)",
      savings: "Save $18,000+/year on content marketing production"
    },
    techStack: [
      "Python 3.12+",
      "OpenAI Agents SDK",
      "Google Gemini 2.5 Flash",
      "OpenRouter",
      "Sanity CMS",
      "Cloudflare Workers AI",
      "Tavily Search API",
      "uv"
    ],
    keywords: [
      "Free Jasper AI alternative",
      "Open source SurferSEO alternative",
      "Autonomous SEO Agent",
      "AI Blog Generator",
      "Digital FTE",
      "Free Byword alternative",
      "Sanity CMS auto publish",
      "WordPress blog automation",
      "OpenAI Agents SDK Python",
      "Automated SEO publishing pipeline"
    ],
    painPoints: [
      {
        problem: "Manual SEO blogging requires 4–6 hours per article, making consistent daily publishing financially unsustainable ($2,000–$5,000/month for freelance writers).",
        solution: "ContentFTE orchestrates autonomous researcher and writer agents producing 15–17 high-authority, well-structured articles every day on autopilot."
      },
      {
        problem: "Generic AI content outputs lack real-time web citations, current facts, and semantic keyword coverage, leading to Google indexing penalties.",
        solution: "Integrated Tavily & SerpAPI search intent extraction ensures every brief is grounded in live ranking competitor data, user search queries, and real citations."
      },
      {
        problem: "Most automated tools only dump raw markdown into local folders, leaving tedious manual formatting, image uploads, and CMS data entry.",
        solution: "Built-in adapters automatically upload generated images, format portable text, configure canonical slugs, and publish straight to Sanity, WordPress, or Shopify."
      },
      {
        problem: "Autonomous agents running blindly risk publishing hallucinations or off-brand content with zero visibility.",
        solution: "Integrated Discord, Telegram, and WhatsApp alert gateways send real-time draft summaries and preview links for instant human oversight."
      }
    ],
    keyFeatures: [
      "Multi-Agent Orchestration: Specialized Triage, Research, Content Brief, Writer, and Publisher agents",
      "Live Search Intent Grounding: Powered by Tavily API and Google search scraping",
      "Multi-Platform Publishing Adapters: Native Sanity CMS publishing with adapters for WordPress REST API, Shopify Admin API, and Wix",
      "Free AI Visual Generation: Uses Cloudflare Workers AI (10,000 free neurons/day) with Pexels stock photo fallbacks",
      "Omnichannel Notification Gateways: Rich embeds and approval triggers via Discord, Telegram, and WhatsApp",
      "Resilient LLM Routing: Primary execution via Gemini with automatic failover to OpenRouter and OpenAI models"
    ],
    architectureOverview:
      "Built with Python 3.12 and the OpenAI Agents SDK. A central scheduler invokes the Triage Agent to discover trending keywords from Google Sheets. The Research Agent queries Tavily API to gather competitor outlines and citations, passing structured findings to the Brief Agent. The Writer Agent produces section-by-section markdown with schema markup, while the Image Agent calls Cloudflare Workers AI for banner art. Finally, the Publisher Adapter uploads assets and posts to Sanity CMS, firing webhook notifications to Discord.",
    setupGuide: {
      prerequisites: [
        "Python 3.12 or newer installed",
        "uv package manager (pip install uv or curl -LsSf https://astral.sh/uv/install.sh | sh)",
        "Google Gemini API Key or OpenRouter API Key",
        "Sanity.io project credentials with write permissions"
      ],
      envVars: [
        { key: "GEMINI_API_KEY", description: "Primary LLM key for agent reasoning", example: "AIzaSy..." },
        { key: "TAVILY_API_KEY", description: "Search engine API key for live web research", example: "tvly-..." },
        { key: "SANITY_PROJECT_ID", description: "Target Sanity CMS project identifier", example: "abc123xyz" },
        { key: "SANITY_API_TOKEN", description: "Sanity token with editor/write permission", example: "sk..." },
        { key: "CLOUDFLARE_ACCOUNT_ID", description: "Cloudflare Workers AI account ID for free image generation", example: "a1b2c3..." }
      ],
      steps: [
        {
          step: "Clone the repository",
          command: "git clone https://github.com/MrOwaisAbdullah/ContentFTE.git\ncd ContentFTE"
        },
        {
          step: "Install dependencies using uv",
          command: "uv sync",
          note: "This automatically creates and manages a virtual environment from pyproject.toml."
        },
        {
          step: "Configure environment variables",
          command: "cp .env.example .env",
          note: "Fill in your API keys (Gemini, Tavily, Sanity) in the .env file."
        },
        {
          step: "Run the agent workflow",
          command: "uv run python main.py",
          note: "To run on a continuous schedule, deploy via cron or Docker container."
        }
      ]
    },
    roadmap: [
      {
        milestone: "YouTube-to-Article Pipeline",
        description: "Extract video transcripts and timestamps to repurpose video content into formatted SEO blog posts.",
        status: "in-progress"
      },
      {
        milestone: "Internal Link Knowledge Graph",
        description: "Automatically scan existing site articles to inject relevant contextual internal links into new posts.",
        status: "planned"
      },
      {
        milestone: "Multi-Language Auto-Localization",
        description: "Translate and culturally adapt generated articles into Spanish, Arabic, and German.",
        status: "planned"
      }
    ]
  },
  {
    slug: "socialfte",
    title: "SocialFTE",
    tagline: "Autonomous AI Social Media Employee (Digital FTE) with Video Rendering & Human-in-the-Loop",
    description:
      "SocialFTE is an end-to-end autonomous social media employee for brands. It writes brand-voice captions without robotic AI cliches, renders graphics and Remotion MP4 video shorts, presents interactive approval cards in Discord, and publishes across Facebook, Instagram, YouTube Shorts, and TikTok.",
    category: "AI Tool",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, educational, and showcase use with mandatory credit to Owais Abdullah. Commercial deployment for clients or SaaS resale requires a separate license.",
    githubUrl: "https://github.com/MrOwaisAbdullah/socialfte",
    image: "/assets/placeholder.png",
    alternativeTo: ["Hootsuite", "Buffer", "Opus Clip", "Predis.ai", "Lately AI"],
    pricingComparison: {
      traditionalTool: "Hootsuite Enterprise + Opus Clip + Video Editor",
      traditionalCost: "$600 - $1,500 / month",
      thisProjectCost: "Free for Personal Use (Self-Hosted Architecture)",
      savings: "Save $10,000+/year on social media management tools"
    },
    techStack: [
      "Next.js 16",
      "Python 3.12+",
      "Remotion (TSX)",
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
        problem: "Managing consistent daily social media posts across 4 platforms requires 2–3 dedicated employees (copywriter, video editor, and community manager).",
        solution: "SocialFTE handles the full lifecycle autonomously: writing captions, generating graphics, rendering MP4 video shorts, and scheduling posts."
      },
      {
        problem: "Automated social bots post generic AI sludge with em dashes, robotic hype, and off-brand phrasing that harms customer trust.",
        solution: "Enforces strict brand guidelines (real prices upfront, no em dashes, conversational tone) with zero tolerance for generic AI fluff."
      },
      {
        problem: "Fully autonomous posting is risky; a single hallucinated post or incorrect price can spark public relations issues.",
        solution: "Rigid human-in-the-loop governance: posts MUST be approved via Discord interactive button cards before touching live platform APIs."
      },
      {
        problem: "Creating video content programmatically is historically difficult and brittle with legacy video stitching scripts.",
        solution: "Leverages Remotion (React/TypeScript) to render pixel-perfect, typography-driven animated vertical videos and YouTube shorts on demand."
      }
    ],
    keyFeatures: [
      "Dual Architecture: High-performance Next.js 16 Dashboard UI + Python background AI worker",
      "Remotion Video Pipeline: Renders programmatic MP4 videos with dynamic captions, audio mixing, and motion graphics",
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
        { key: "OPENROUTER_API_KEY", description: "LLM API key for caption drafting", example: "sk-or-v1-..." },
        { key: "DISCORD_BOT_TOKEN", description: "Bot token for sending approval cards", example: "MTIz..." },
        { key: "DISCORD_CHANNEL_ID", description: "Channel ID where drafts are routed", example: "1234567890" },
        { key: "DATABASE_URL", description: "PostgreSQL connection string (Neon pgvector)", example: "postgresql://..." },
        { key: "R2_ACCESS_KEY_ID", description: "Cloudflare R2 access key for media storage", example: "cf_key_..." }
      ],
      steps: [
        {
          step: "Clone repository",
          command: "git clone https://github.com/MrOwaisAbdullah/socialfte.git\ncd socialfte"
        },
        {
          step: "Install frontend & Remotion dependencies",
          command: "npm install"
        },
        {
          step: "Install Python worker dependencies",
          command: "cd apps/worker && uv sync && cd ../.."
        },
        {
          step: "Launch with Docker Compose or locally",
          command: "docker compose up -d",
          note: "Starts the dashboard on http://localhost:3000 and the background worker daemon."
        }
      ]
    },
    roadmap: [
      {
        milestone: "ElevenLabs Voiceover Auto-Sync",
        description: "Integrate synthetic voiceover generation aligned word-for-word with Remotion kinetic typography.",
        status: "in-progress"
      },
      {
        milestone: "Direct TikTok API Audit",
        description: "Graduate TikTok integration from draft-only mode to full automated publishing upon developer review.",
        status: "in-progress"
      },
      {
        milestone: "Engagement Analytics Feedback Loop",
        description: "Fetch view, like, and comment metrics to train agent prompts on top-performing post angles.",
        status: "planned"
      }
    ]
  },
  {
    slug: "digital-fte",
    title: "Digital FTE",
    tagline: "Autonomous AI Employee Architecture, Shared Memory Vault & Tiered Blueprints",
    description:
      "Digital FTE is a comprehensive architectural framework for building proactive, autonomous AI employees that execute real work 24/7. Includes structured blueprints spanning Bronze, Silver, Gold, and Platinum tiers with Obsidian memory vaults and MCP tool integrations.",
    category: "AI Tool",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, research, and non-commercial educational use with mandatory attribution to Owais Abdullah. Commercial consulting or white-labeling requires explicit licensing.",
    githubUrl: "https://github.com/MrOwaisAbdullah/Digital-FTE",
    image: "/assets/projects/digital-fte.svg",
    alternativeTo: ["Devin AI", "AutoGPT", "Adept AI", "BabyAGI", "Custom Automation Agencies"],
    pricingComparison: {
      traditionalTool: "Proprietary AI Agents / Enterprise Automation Retainers",
      traditionalCost: "$5,000 - $15,000+ setup",
      thisProjectCost: "Free for Personal & Educational Use",
      savings: "Full transparent ownership of autonomous agent architecture"
    },
    techStack: [
      "Claude Code",
      "Model Context Protocol (MCP)",
      "Obsidian Git Vault",
      "Python 3.12+",
      "OpenAI Agents SDK",
      "Markdown Memory"
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
    tagline: "Autonomous AI E-Commerce Operations Employee (Digital FTE) for Shopify Stores",
    description:
      "ShopMate is a dedicated digital employee built for Shopify e-commerce brands. It autonomously resolves order tracking inquiries, answers technical product questions, captures high-intent customer leads, and assists shoppers in completing checkout 24/7.",
    category: "AI Tool",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, learning, and non-commercial testing with mandatory credit to Owais Abdullah. Commercial store deployment requires licensing.",
    githubUrl: "https://github.com/MrOwaisAbdullah/Shopmate-fte",
    liveUrl: "https://shopmate.octively.com",
    image: "/assets/placeholder.png",
    alternativeTo: ["Gorgias", "Tidio AI", "Intercom for Shopify", "Zendesk AI", "Re:amaze"],
    pricingComparison: {
      traditionalTool: "Gorgias / Intercom Shopify Helpdesk",
      traditionalCost: "$300 - $900 / month",
      thisProjectCost: "Free for Personal Use (Self-Hosted Architecture)",
      savings: "Eliminate recurring customer support per-ticket fees"
    },
    techStack: [
      "Python 3.12+",
      "Shopify Admin API",
      "OpenAI Agents SDK",
      "FastAPI",
      "Webhooks",
      "PostgreSQL"
    ],
    keywords: [
      "Free Gorgias alternative",
      "Open source Tidio alternative",
      "Shopify AI Employee",
      "E-commerce Digital FTE",
      "Shopify Customer Support Bot",
      "Automated Order Tracking",
      "Shopify Sales Agent"
    ],
    painPoints: [
      {
        problem: "Up to 60% of e-commerce customer inquiries are repetitive 'Where is my order?' (WISMO) questions that burn support staff hours.",
        solution: "ShopMate securely connects to the Shopify Admin API to fetch live fulfillment and tracking links in seconds, resolving WISMO tickets automatically."
      },
      {
        problem: "Online shoppers abandon carts when their specific sizing, material, or compatibility questions go unanswered during off-hours.",
        solution: "Equipped with comprehensive store catalog embeddings to provide instant, precise product recommendations and sizing advice."
      },
      {
        problem: "Hiring offshore 24/7 support teams is costly and often leads to inconsistent responses and delayed replies.",
        solution: "Operates 24 hours a day with sub-second response times, consistent brand tone, and automated escalation to human managers when necessary."
      }
    ],
    keyFeatures: [
      "Live Shopify Order Tracking: Resolves shipping status and tracking numbers directly via customer order number or email",
      "Product Catalog RAG: Answers detailed questions regarding specifications, inventory levels, and variants",
      "Abandoned Cart Recovery: Engages indecisive shoppers with helpful answers and personalized discount recommendations",
      "Human Escalation: Seamlessly tags support tickets for human review when sentiment analysis detects customer frustration",
      "Secure Webhook Architecture: Listens to fulfillment and checkout events in real time"
    ],
    architectureOverview:
      "Built with Python and FastAPI. Communicates with Shopify stores via official REST and GraphQL APIs. When a customer sends a message through the store chat widget, ShopMate's intent classifier detects whether the query requires order tracking, product lookup, or general FAQs. Live database queries retrieve order states, and streaming responses are delivered to the storefront.",
    setupGuide: {
      prerequisites: [
        "Python 3.12+",
        "Shopify Partner account or Custom App Access Token",
        "PostgreSQL database"
      ],
      envVars: [
        { key: "SHOPIFY_SHOP_NAME", description: "Your Shopify store subdomain", example: "my-store.myshopify.com" },
        { key: "SHOPIFY_ACCESS_TOKEN", description: "Custom app access token with read_orders and read_products scope", example: "shpat_..." },
        { key: "OPENAI_API_KEY", description: "LLM key for conversational reasoning", example: "sk-proj-..." }
      ],
      steps: [
        {
          step: "Clone repository",
          command: "git clone https://github.com/MrOwaisAbdullah/Shopmate-fte.git\ncd Shopmate-fte"
        },
        {
          step: "Install dependencies",
          command: "uv sync"
        },
        {
          step: "Configure environment",
          command: "cp .env.example .env"
        },
        {
          step: "Run application server",
          command: "uv run uvicorn main:app --reload --port 8000"
        }
      ]
    },
    roadmap: [
      {
        milestone: "WhatsApp Direct Order Lookup",
        description: "Allow customers to text order tracking requests directly via WhatsApp Business API.",
        status: "in-progress"
      },
      {
        milestone: "Multi-Store Centralized Helpdesk",
        description: "Unified admin portal managing customer conversations across multiple Shopify brands.",
        status: "planned"
      }
    ]
  },
  {
    slug: "owflex-chatbot-saas",
    title: "OwFlex",
    tagline: "Full-Stack Multi-Tenant AI Chatbot SaaS with Embeddable Web Widget & RAG",
    description:
      "OwFlex is a production-ready, multi-tenant AI Chatbot SaaS platform built with Next.js 15, Drizzle ORM, and Sanity CMS. It enables businesses to upload knowledge bases, customize AI chatbots, and embed them onto any website using a single line of code.",
    category: "Platform",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, learning, and portfolio examination with mandatory credit to Owais Abdullah. Commercial hosting, white-labeling, or paid access requires a commercial agreement.",
    githubUrl: "https://github.com/MrOwaisAbdullah/Owflex-Chatbot-Saas",
    image: "/assets/placeholder.png",
    alternativeTo: ["Chatbase", "FastBots", "Dante AI", "SiteGPT", "Voiceflow"],
    pricingComparison: {
      traditionalTool: "Chatbase / SiteGPT Monthly Subscriptions",
      traditionalCost: "$99 - $399 / month",
      thisProjectCost: "Free for Personal Use (Self-Hosted SaaS)",
      savings: "Save $2,500+/year and retain 100% data privacy"
    },
    techStack: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Drizzle ORM",
      "PostgreSQL (Neon)",
      "Sanity CMS",
      "Stripe Billing",
      "Docker"
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
        problem: "Building a production multi-tenant AI chatbot platform with authentication, usage limits, and document indexing takes 3–6 months from scratch.",
        solution: "OwFlex provides a complete, battle-tested codebase with multi-tenancy, vector search, billing, and embed scripts ready to deploy."
      },
      {
        problem: "Embedding chatbots onto third-party client websites often breaks due to CSS conflicts, large bundle sizes, and slow load times.",
        solution: "Includes a standalone, zero-dependency lightweight embed script that injects an isolated iframe widget compatible with any website or CMS."
      },
      {
        problem: "Managing tenant documents and website FAQs requires expensive specialized vector database hosting.",
        solution: "Utilizes PostgreSQL pgvector with Drizzle ORM, offering cost-effective vector search directly in the primary application database."
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
        { key: "NEXT_PUBLIC_SANITY_PROJECT_ID", description: "Sanity Project ID", example: "xyz..." },
        { key: "STRIPE_SECRET_KEY", description: "Stripe API secret key", example: "sk_live_..." },
        { key: "OPENAI_API_KEY", description: "API key for embeddings and completions", example: "sk-..." }
      ],
      steps: [
        {
          step: "Clone the repository",
          command: "git clone https://github.com/MrOwaisAbdullah/Owflex-Chatbot-Saas.git\ncd Owflex-Chatbot-Saas"
        },
        {
          step: "Install dependencies",
          command: "npm install"
        },
        {
          step: "Run database migrations with Drizzle",
          command: "npx drizzle-kit push"
        },
        {
          step: "Start the development server",
          command: "npm run dev"
        }
      ]
    },
    roadmap: [
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
      "Voice of Holy Quran is an online education and academy platform connecting global students of all ages with qualified, certified male and female Quran teachers. Features course catalogs, flexible time-zone scheduling, free trial booking, and accessible audio streaming.",
    category: "Institution",
    licenseType: "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)",
    licenseDetails:
      "Free for personal, community, and educational use with mandatory credit to Owais Abdullah. Cannot be sold or repackaged as a commercial software product without permission.",
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
      "Streaming Recitation Portal: High-fidelity audio streaming of Holy Quran recitations with responsive Arabic typography",
      "Free Trial Booking System: Simple 2-step onboarding form connecting parents with academic coordinators"
    ],
    architectureOverview:
      "Built with modern Next.js App Router and TypeScript. Focuses on ultra-fast page load speeds, high search engine visibility for educational queries, mobile accessibility, and direct WhatsApp / form scheduling integrations.",
    setupGuide: {
      prerequisites: [
        "Node.js 18+ and npm"
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
      "High-Res Visual Gallery: Real workshop photography showing timber grain, joints, and finish details"
    ],
    architectureOverview:
      "Built with Next.js App Router for blazing performance and instant page loads. Tailwind CSS ensures clean, luxury-feel responsiveness across mobile and desktop. Dynamic product metadata enables high search rankings for local furniture queries.",
    setupGuide: {
      prerequisites: [
        "Node.js 18+ and npm"
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
