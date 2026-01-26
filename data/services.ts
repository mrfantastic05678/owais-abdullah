export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string;
  gradient: string;
  features: string[];
  techStack: string[];
  process: ProcessStep[];
  pricing?: PricingTier[];
  faqs: FAQ[];
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const services: Record<string, Service> = {
  "digital-fte": {
    slug: "digital-fte",
    title: "Digital FTE (AI Employee) Development",
    tagline: "Your Business on Autopilot",
    description:
      "Autonomous AI agents that handle business operations 24/7. Transform how you work with AI employees that never sleep.",
    longDescription:
      "Imagine having a senior employee who works 24/7, manages your emails, handles customer support, audits your finances, and prepares Monday morning briefings—all without breaks. That's the power of Digital FTE (Full-Time Equivalent) development. I build autonomous AI agents using General Agents framework that proactively manage personal and business affairs, turning the AI from a chatbot into a proactive business partner.",
    icon: "Bot",
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "Autonomous AI Employees that work 24/7",
      "Monday Morning CEO Briefing with financial audits",
      "Email management and automated responses",
      "Customer support automation",
      "Task and project management oversight",
      "Local-first, privacy-focused architecture",
      "General Agents framework implementation",
      "Multi-channel monitoring (Gmail, WhatsApp, etc.)",
    ],
    techStack: [
      "Claude Code / OpenAI Agents SDK",
      "General Agents Framework",
      "Python Watchers",
      "Model Context Protocol (MCP)",
      "Obsidian (Local Dashboard)",
      "n8n (Workflow Automation)",
      "REST APIs & Webhooks",
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Planning",
        description:
          "We identify repetitive tasks and business processes that can be automated. Define scope, KPIs, and success metrics for your AI employee.",
      },
      {
        step: 2,
        title: "Architecture Design",
        description:
          "Design local-first architecture with proper data isolation. Plan watcher scripts, MCP servers, and agent capabilities.",
      },
      {
        step: 3,
        title: "Agent Development",
        description:
          "Build and train your AI employee using General Agents framework. Implement Ralph Wiggum Stop hook for continuous iteration until task completion.",
      },
      {
        step: 4,
        title: "Integration & Testing",
        description:
          "Connect to your existing tools (Gmail, WhatsApp, CRM). Test automation workflows and refine agent behavior based on real scenarios.",
      },
      {
        step: 5,
        title: "Deployment & Training",
        description:
          "Deploy your AI employee with monitoring dashboards. Train your team on how to interact with and oversee the AI agent.",
      },
    ],
    pricing: [
      {
        name: "Starter",
        price: "$800",
        period: "project",
        features: [
          "Single AI Employee Agent",
          "Basic task automation",
          "Email monitoring",
          "Weekly summary reports",
          "Local deployment",
          "1 month support",
        ],
      },
      {
        name: "Professional",
        price: "$1,500",
        period: "project",
        highlighted: true,
        features: [
          "Multiple AI Employees",
          "Monday Morning CEO Briefing",
          "Multi-channel monitoring",
          "Custom workflows",
          "Dashboard integration",
          "3 months support",
          "Priority maintenance",
        ],
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: [
          "Unlimited AI Employees",
          "Custom agent architecture",
          "Full business automation",
          "On-premise deployment",
          "Dedicated infrastructure",
          "12 months support",
          "Custom SLA",
        ],
      },
    ],
    faqs: [
      {
        question: "What is a Digital FTE?",
        answer:
          "A Digital FTE (Full-Time Equivalent) is an AI agent that acts like a real employee—working 24/7, handling tasks autonomously, and proactively managing operations. Unlike chatbots that wait for input, Digital FTEs actively monitor and execute tasks.",
      },
      {
        question: "Is my data secure with Digital FTEs?",
        answer:
          "Yes. I build local-first Digital FTEs where your data stays on your infrastructure. No data leaves your environment unless explicitly configured. Privacy and security are built into the architecture.",
      },
      {
        question: "How long does it take to build a Digital FTE?",
        answer:
          "Simple single-purpose agents can be built in 1-2 weeks. Complex multi-agent systems with CEO Briefing capabilities typically take 4-8 weeks depending on integration complexity.",
      },
      {
        question: "Can a Digital FTE replace real employees?",
        answer:
          "Digital FTEs are designed to augment human teams, not replace them. They handle repetitive tasks, data processing, and monitoring—freeing up your team to focus on strategic work that requires human judgment.",
      },
    ],
  },

  "ai-agents": {
    slug: "ai-agents",
    title: "Custom AI Agents & Automations",
    tagline: "Intelligent Automation at Scale",
    description:
      "Custom AI agents powered by OpenAI Agents SDK and n8n. Build intelligent workflows that automate repetitive tasks.",
    longDescription:
      "Automation is no longer about simple if-then rules. Modern automation uses AI agents that can understand context, make decisions, and handle complex workflows. I specialize in building custom AI agents using the OpenAI Agents SDK and n8n workflow automation—creating intelligent systems that integrate seamlessly with your existing tools and processes.",
    icon: "Zap",
    gradient: "from-purple-500 to-pink-500",
    features: [
      "OpenAI Agents SDK development",
      "n8n workflow automation",
      "Custom General Agents",
      "AI-powered decision making",
      "Multi-step workflow automation",
      "Third-party service integrations",
      "Webhook & API integrations",
      "Process optimization",
    ],
    techStack: [
      "OpenAI Agents SDK",
      "n8n Workflow Automation",
      "General Agents Framework",
      "Python & Node.js",
      "REST APIs & GraphQL",
      "Webhooks",
      "PostgreSQL & SQLite",
      "Docker (optional)",
    ],
    process: [
      {
        step: 1,
        title: "Process Analysis",
        description:
          "Analyze your current workflows to identify automation opportunities. Document manual processes and calculate ROI potential.",
      },
      {
        step: 2,
        title: "Agent Design",
        description:
          "Design AI agents with specific capabilities. Define decision trees, integration points, and error handling strategies.",
      },
      {
        step: 3,
        title: "Workflow Development",
        description:
          "Build n8n workflows and custom AI agents using OpenAI Agents SDK. Connect to your existing tools and APIs.",
      },
      {
        step: 4,
        title: "Testing & Refinement",
        description:
          "Test automation workflows with real data. Refine agent behavior, optimize response times, and handle edge cases.",
      },
      {
        step: 5,
        title: "Deployment & Monitoring",
        description:
          "Deploy automation workflows with monitoring dashboards. Set up alerts and create documentation for your team.",
      },
    ],
    pricing: [
      {
        name: "Starter",
        price: "$500",
        period: "project",
        features: [
          "Single automation workflow",
          "Basic AI agent",
          "Up to 3 integrations",
          "n8n setup",
          "2 weeks support",
        ],
      },
      {
        name: "Professional",
        price: "$1,200",
        period: "project",
        highlighted: true,
        features: [
          "Multiple automation workflows",
          "Custom AI agents",
          "Unlimited integrations",
          "Advanced n8n workflows",
          "Custom API endpoints",
          "2 months support",
        ],
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: [
          "Full automation platform",
          "Custom agent architecture",
          "On-premise deployment",
          "Team training",
          "Dedicated support",
        ],
      },
    ],
    faqs: [
      {
        question: "What's the difference between n8n and custom agents?",
        answer:
          "n8n is excellent for workflow automation and connecting services. Custom AI agents add intelligence—decision-making, context understanding, and dynamic responses. I combine both for maximum effectiveness.",
      },
      {
        question: "Can you automate my existing workflow?",
        answer:
          "Most likely. During the discovery phase, I analyze your current processes and identify automation opportunities. If a process is repetitive and rule-based, it's a great candidate for AI automation.",
      },
      {
        question: "What integrations do you support?",
        answer:
          "I can integrate with any service that offers REST APIs, GraphQL, or webhooks. This includes Gmail, Slack, CRM systems, payment processors, project management tools, and hundreds more.",
      },
    ],
  },

  "saas-development": {
    slug: "saas-development",
    title: "Next.js SaaS Development",
    tagline: "Build Scalable SaaS Products",
    description:
      "Full-stack SaaS products built with spec-driven development. From MVP to production-ready scaling with Next.js 15.",
    longDescription:
      "Building a SaaS product requires more than just coding—it needs clear specifications, scalable architecture, and a path from MVP to production. I specialize in spec-driven SaaS development using Next.js 15, TypeScript, and modern AI integrations. Every feature is specified before coding, ensuring you get exactly what you need with minimal rework.",
    icon: "Rocket",
    gradient: "from-orange-500 to-red-500",
    features: [
      "Next.js 15 with App Router",
      "TypeScript for type safety",
      "Spec-driven development process",
      "AI-powered features",
      "Authentication & authorization",
      "Payment integration (Stripe, LemonSqueezy)",
      "Database design (PostgreSQL, Prisma)",
      "SEO optimization",
      "Performance optimization",
      "Deployment & DevOps",
    ],
    techStack: [
      "Next.js 15 (App Router)",
      "TypeScript",
      "Tailwind CSS & shadcn/ui",
      "Prisma ORM",
      "PostgreSQL / SQLite",
      "Clerk Auth / NextAuth",
      "Stripe / LemonSqueezy",
      "OpenAI Agents SDK",
      "Vercel / Railway",
    ],
    process: [
      {
        step: 1,
        title: "Specification",
        description:
          "Write detailed feature specifications before any code. Define user stories, acceptance criteria, and technical requirements.",
      },
      {
        step: 2,
        title: "Architecture Design",
        description:
          "Design scalable system architecture, database schema, and API structure. Plan for growth from day one.",
      },
      {
        step: 3,
        title: "MVP Development",
        description:
          "Build core features rapidly using Next.js 15. Focus on delivering value quickly with clean, maintainable code.",
      },
      {
        step: 4,
        title: "Testing & Refinement",
        description:
          "Comprehensive testing including unit tests, integration tests, and user acceptance testing. Refine based on feedback.",
      },
      {
        step: 5,
        title: "Launch & Scale",
        description:
          "Deploy to production with monitoring. Plan scaling strategies and iterate based on user feedback.",
      },
    ],
    pricing: [
      {
        name: "MVP",
        price: "$1,500",
        period: "starting at",
        features: [
          "Core feature set",
          "Next.js 15 + TypeScript",
          "Basic authentication",
          "Payment integration",
          "Responsive design",
          "SEO basics",
          "Deployment",
          "1 month support",
        ],
      },
      {
        name: "Production",
        price: "$4,000",
        period: "starting at",
        highlighted: true,
        features: [
          "Full feature set",
          "Advanced authentication",
          "Admin dashboard",
          "AI features",
          "Analytics integration",
          "Performance optimization",
          "Testing suite",
          "3 months support",
        ],
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: [
          "Custom architecture",
          "Multi-tenant support",
          "Advanced AI features",
          "Custom integrations",
          "On-premise option",
          "SLA",
          "12 months support",
        ],
      },
    ],
    faqs: [
      {
        question: "Why spec-driven development?",
        answer:
          "Spec-driven development prevents scope creep, reduces rework, and ensures everyone agrees on what's being built. It saves time and money by catching issues before coding begins.",
      },
      {
        question: "How long does it take to build a SaaS MVP?",
        answer:
          "A typical SaaS MVP takes 4-8 weeks depending on complexity. Spec-driven development actually speeds up the process by reducing decision-making during coding.",
      },
      {
        question: "Can you add AI features to my SaaS?",
        answer:
          "Absolutely. I specialize in integrating AI features like chatbots, content generation, intelligent search, and automation. AI can be a key differentiator for your SaaS.",
      },
    ],
  },

  "cms-ecommerce": {
    slug: "cms-ecommerce",
    title: "CMS & E-commerce Development",
    tagline: "Content & Commerce Solutions",
    description:
      "WordPress, Shopify, and Headless CMS solutions. Custom themes, apps, and integrations tailored to your business.",
    longDescription:
      "Whether you need a flexible content management system, a powerful e-commerce store, or a headless setup for maximum performance—I have you covered. With expertise in WordPress, Shopify, and Sanity CMS, I build solutions that fit your specific needs. From custom themes and plugins to complex integrations and headless architectures.",
    icon: "ShoppingCart",
    gradient: "from-green-500 to-emerald-500",
    features: [
      "WordPress custom theme development",
      "WordPress plugin development",
      "Shopify custom themes",
      "Shopify app development",
      "Headless CMS (Sanity)",
      "Content modeling",
      "API-driven content delivery",
      "E-commerce optimization",
      "Payment gateway integration",
      "Performance optimization",
    ],
    techStack: [
      "WordPress (PHP, JS)",
      "Shopify (Liquid, React)",
      "Sanity CMS",
      "Next.js (for headless)",
      "React & TypeScript",
      "Node.js",
      "Stripe API",
      "REST APIs & GraphQL",
    ],
    process: [
      {
        step: 1,
        title: "Requirements Gathering",
        description:
          "Understand your content and commerce needs. Choose the right platform (WordPress, Shopify, or Headless) for your goals.",
      },
      {
        step: 2,
        title: "Design & Planning",
        description:
          "Create custom designs or work with your brand. Plan content models, product catalogs, and integration requirements.",
      },
      {
        step: 3,
        title: "Development",
        description:
          "Build custom themes, plugins, or apps. Set up headless CMS with Next.js frontend if needed. Integrate payment gateways.",
      },
      {
        step: 4,
        title: "Content & Product Setup",
        description:
          "Migrate existing content or set up new content structure. Configure products, pricing, and shipping options.",
      },
      {
        step: 5,
        title: "Launch & Optimization",
        description:
          "Deploy to production with performance optimization. Set up analytics, monitoring, and provide training.",
      },
    ],
    pricing: [
      {
        name: "WordPress",
        price: "$600",
        period: "starting at",
        features: [
          "Custom theme",
          "Plugin customization",
          "Basic integrations",
          "SEO setup",
          "Performance optimization",
          "1 month support",
        ],
      },
      {
        name: "WordPress + WooCommerce",
        price: "$1,000",
        period: "starting at",
        features: [
          "Custom WordPress theme",
          "WooCommerce setup",
          "Product catalog configuration",
          "Payment gateway integration",
          "Shipping & tax setup",
          "E-commerce optimization",
          "2 months support",
        ],
      },
      {
        name: "Shopify",
        price: "$700",
        period: "starting at",
        features: [
          "Custom theme",
          "App development",
          "Payment setup",
          "Product optimization",
          "Conversion optimization",
          "2 months support",
        ],
      },
      {
        name: "Headless CMS",
        price: "$1,500",
        period: "starting at",
        highlighted: true,
        features: [
          "Sanity CMS setup",
          "Next.js frontend",
          "Custom content models",
          "API integrations",
          "Static generation",
          "3 months support",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I use WordPress, Shopify, or Headless?",
        answer:
          "It depends on your needs. WordPress for content-heavy sites with flexibility. Shopify for pure e-commerce. Headless CMS (Sanity + Next.js) for maximum performance and developer experience. I'll help you choose.",
      },
      {
        question: "Can you migrate my existing site?",
        answer:
          "Yes. I handle migrations from WordPress to Shopify, traditional CMS to headless, and almost any other migration scenario.",
      },
      {
        question: "Do you offer ongoing maintenance?",
        answer:
          "Yes. I offer maintenance packages for all platforms including updates, security monitoring, performance optimization, and content updates.",
      },
    ],
  },

  "consulting-mvp": {
    slug: "consulting-mvp",
    title: "Technical Consulting & MVP Development",
    tagline: "From Idea to Working Product",
    description:
      "Technical consulting with spec-driven development. AI strategy, rapid MVP prototyping, and architecture reviews.",
    longDescription:
      "Great products start with great specifications and solid architecture. I offer technical consulting that combines spec-driven development methodology with rapid MVP prototyping. Whether you need AI strategy, architecture reviews, or a working MVP to validate your idea—I help you make informed technical decisions and build products the right way from day one.",
    icon: "Lightbulb",
    gradient: "from-yellow-500 to-orange-500",
    features: [
      "Spec-driven development consulting",
      "AI implementation strategy",
      "Architecture design reviews",
      "Tech stack recommendations",
      "Rapid MVP prototyping",
      "Idea validation",
      "Technical due diligence",
      "Team training & mentorship",
      "Code review & optimization",
      "Startup CTO advisory",
    ],
    techStack: [
      "Strategic Planning",
      "System Design",
      "Next.js ecosystem",
      "AI/ML technologies",
      "Cloud architecture",
      "Best practices & patterns",
    ],
    process: [
      {
        step: 1,
        title: "Discovery Call",
        description:
          "Understand your vision, goals, and constraints. Discuss technical options and potential approaches.",
      },
      {
        step: 2,
        title: "Strategy & Planning",
        description:
          "Create technical specifications, architecture diagrams, and implementation roadmap. Define success metrics.",
      },
      {
        step: 3,
        title: "Advisory & Guidance",
        description:
          "Provide ongoing technical guidance. Review code, architecture decisions, and help your team execute effectively.",
      },
      {
        step: 4,
        title: "MVP Development (Optional)",
        description:
          "Build a working MVP rapidly to validate assumptions. Test with real users and iterate based on feedback.",
      },
      {
        step: 5,
        title: "Handoff & Next Steps",
        description:
          "Document everything for your team. Provide recommendations for scaling and next development phases.",
      },
    ],
    pricing: [
      {
        name: "Strategy Session",
        price: "$200",
        period: "one-time",
        features: [
          "1 hour consultation",
          "Technical recommendations",
          "Architecture review",
          "Tech stack guidance",
          "Follow-up summary",
        ],
      },
      {
        name: "MVP Package",
        price: "$1,000",
        period: "starting at",
        highlighted: true,
        features: [
          "Full specifications",
          "Architecture design",
          "Working MVP",
          "Deployment",
          "2 weeks support",
        ],
      },
      {
        name: "Advisory Retainer",
        price: "$800",
        period: "/month",
        features: [
          "Ongoing technical guidance",
          "Weekly calls",
          "Code reviews",
          "Architecture reviews",
          "Slack access",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need a technical background?",
        answer:
          "Not necessarily. I work with both technical and non-technical founders. I translate technical concepts and help you make informed decisions.",
      },
      {
        question: "How fast can you build an MVP?",
        answer:
          "Simple MVPs can be built in 2-3 weeks. More complex products typically take 4-6 weeks. Speed comes from the spec-driven approach—less rework means faster delivery.",
      },
      {
        question: "Can you help me hire developers?",
        answer:
          "Yes. I can help you write job descriptions, interview candidates, and evaluate technical skills. I can also create technical specifications for your team to execute.",
      },
    ],
  },

  "api-development": {
    slug: "api-development",
    title: "API Development & Integration",
    tagline: "Connect Everything Seamlessly",
    description:
      "RESTful & GraphQL API design and development. Third-party integrations, webhooks, and real-time features.",
    longDescription:
      "Modern applications need to talk to each other seamlessly. Whether you need a robust API for your product, integrations with third-party services, or real-time features—API development is foundational to scalable software. I design and build RESTful and GraphQL APIs, create custom integrations, implement webhooks, and enable real-time communication.",
    icon: "Cpu",
    gradient: "from-indigo-500 to-purple-500",
    features: [
      "RESTful API design & development",
      "GraphQL API development",
      "API documentation (OpenAPI/Swagger)",
      "Third-party service integrations",
      "Webhook implementations",
      "Real-time features (WebSockets, SSE)",
      "Custom middleware development",
      "API authentication & authorization",
      "Rate limiting & caching",
      "API versioning",
    ],
    techStack: [
      "Node.js & Express",
      "Next.js API Routes",
      "GraphQL (Apollo, Yoga)",
      "PostgreSQL & Prisma",
      "Redis (caching)",
      "WebSockets (Socket.io)",
      "OpenAPI/Swagger",
      "Postman & Insomnia",
    ],
    process: [
      {
        step: 1,
        title: "API Design",
        description:
          "Design API endpoints, data models, and authentication strategy. Create API documentation and integration guidelines.",
      },
      {
        step: 2,
        title: "Development",
        description:
          "Build RESTful or GraphQL APIs with proper error handling, validation, and security. Implement rate limiting and caching.",
      },
      {
        step: 3,
        title: "Integration",
        description:
          "Integrate with third-party services. Implement webhooks for real-time data sync. Handle authentication and authorization.",
      },
      {
        step: 4,
        title: "Testing & Documentation",
        description:
          "Write comprehensive tests. Document all endpoints with examples. Create integration guides for developers.",
      },
      {
        step: 5,
        title: "Deployment & Monitoring",
        description:
          "Deploy APIs with monitoring and alerting. Set up logging and analytics. Provide ongoing maintenance.",
      },
    ],
    pricing: [
      {
        name: "Single Integration",
        price: "$200",
        period: "starting at",
        features: [
          "One third-party integration",
          "Webhook setup",
          "Basic documentation",
          "Testing",
          "1 week support",
        ],
      },
      {
        name: "Custom API",
        price: "$800",
        period: "starting at",
        highlighted: true,
        features: [
          "Full API design",
          "REST or GraphQL",
          "Authentication",
          "Documentation",
          "Testing suite",
          "1 month support",
        ],
      },
      {
        name: "Enterprise API",
        price: "Custom",
        features: [
          "Complex architecture",
          "Multiple integrations",
          "Real-time features",
          "Custom middleware",
          "SLA",
          "Dedicated support",
        ],
      },
    ],
    faqs: [
      {
        question: "REST or GraphQL—which should I choose?",
        answer:
          "REST is simpler and widely adopted. GraphQL is better for complex data requirements and mobile apps where bandwidth matters. I'll recommend based on your specific use case.",
      },
      {
        question: "Can you integrate with any service?",
        answer:
          "Any service with a documented API or webhook system. I've integrated with hundreds of services including Stripe, Gmail, Slack, CRM systems, payment gateways, and more.",
      },
      {
        question: "Do you provide API documentation?",
        answer:
          "Yes. Comprehensive documentation is part of every API project. I use OpenAPI/Swagger for REST and schema documentation for GraphQL.",
      },
    ],
  },
};
