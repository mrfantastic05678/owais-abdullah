// Single source of truth for profile data.
// Consumed by the /api/profile route (chatbot + AI crawlers), the homepage
// (server-rendered projects), and the Experience timeline.

export interface Project {
  title: string;
  description: string;
  image: string | null;
  link: string;
  repoUrl?: string;
  category: string;
  tags: string[];
  techStack: string[];
  deployedUrl?: string | null;
  stars?: number;
  language?: string;
}

export interface WorkEntry {
  company: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

// Existing projects - these have images and are already on the website
const existingProjects: Project[] = [
  // Top 7 — ordered by impact
  {
    title: "Octively",
    description: "AI chatbot SaaS I founded and launched. Agencies and developers add branded AI chatbots to client sites with one embed script — each client gets their own portal for conversations, leads, and analytics.",
    image: "/assets/projects/octively.png",
    link: "https://octively.com/",
    category: "AI Tool",
    tags: ["Next.js", "AI", "RAG", "Chatbot", "SaaS", "Founder"],
    techStack: ["Next.js", "TypeScript", "Gemini AI", "Neon pgvector", "AWS S3", "Brevo"],
  },
  {
    title: "TeamFlow",
    description: "An AI-powered team management and task assignment platform designed for agencies. Features intelligent task distribution, team workload balancing, and automated project tracking.",
    image: "/assets/projects/teamflow.png",
    link: "https://teamflow-sigma-opal.vercel.app/",
    category: "Platform",
    tags: ["Next.js", "AI", "SaaS", "Team Management", "Agencies", "Task Assignment"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "AI Integration", "Supabase"],
  },
  {
    title: "Visati",
    description: "Visa services SaaS that takes applicants from eligibility check to submitted application — document uploads, payments, and PDF generation built in.",
    image: "/assets/projects/visati.png",
    link: "https://visati-dubai.vercel.app/",
    category: "Platform",
    tags: ["Next.js", "SaaS", "Visa Services", "Stripe", "Payments"],
    techStack: ["Next.js", "TypeScript", "Stripe", "Drizzle ORM", "Neon Postgres", "BetterAuth", "Sanity CMS"],
  },
  {
    title: "Yousuf Living",
    description: "Workshop-built furniture store in Karachi — bedroom sets, beds, wardrobes with custom sizing, WhatsApp ordering, and city-wide delivery.",
    image: "/assets/projects/yousuf-living.png",
    link: "https://yousufliving.vercel.app/",
    category: "Ecommerce",
    tags: ["Next.js", "E-commerce", "Furniture", "WhatsApp"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "NextLevel Marketerz",
    description: "Marketing agency site with 3D and scroll-driven animation on a Sanity-backed Next.js stack.",
    image: "/assets/projects/nextlevel-marketerz.png",
    link: "https://www.nextlevelmarketerz.com/",
    category: "Platform",
    tags: ["Next.js", "Three.js", "GSAP", "Agency"],
    techStack: ["Next.js", "TypeScript", "Three.js", "GSAP", "Sanity CMS"],
  },
  {
    title: "RentParlo",
    description: "A peer-to-peer marketplace for renting goods. Connects lenders with borrowers, featuring secure transactions, rental agreements, and item verification.",
    image: "/assets/projects/rentparlo.png",
    link: "https://rentparlo.vercel.app/",
    category: "Marketplace",
    tags: ["Next.js", "Marketplace", "Rental", "P2P", "E-commerce"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Stripe"],
  },
  {
    title: "Digital FTE",
    description: "Autonomous AI employees powered by Claude Code — an Obsidian vault for memory, MCPs for tools, Python scripts the agent can execute, and tiered agents that handle email, reporting, and day-to-day operations without supervision.",
    image: "/assets/projects/digital-fte.svg",
    link: "#",
    category: "AI Tool",
    tags: ["Claude Code", "AI Agents", "Obsidian", "MCPs", "Python", "Automation"],
    techStack: ["Claude Code", "Obsidian", "MCPs", "Python"],
  },
  // Remaining projects
  {
    title: "Personal Portfolio Website",
    description: "My personal portfolio showcasing my skills, projects, and experience, built with Next.js.",
    image: "/assets/projects/owais-portfolio.png",
    link: "https://owaisabdullah.dev",
    repoUrl: "https://github.com/MrOwaisAbdullah/Owais-Abdullah",
    category: "Personal",
    tags: ["Next.js", "Tailwind", "Portfolio"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity CMS"],
  },
  {
    title: "ContentSpark AI",
    description: "SEO blog agent that researches, writes, and publishes 15+ optimized posts a day straight into Sanity CMS.",
    image: "/assets/placeholder.png",
    link: "#",
    category: "AI Tool",
    tags: ["Python", "AI", "SEO", "Content Automation"],
    techStack: ["Python", "Sanity CMS", "Vercel"],
  },
  {
    title: "AI Humanoid Robotics Book",
    description: "AI-driven book on humanoid robotics with a RAG chatbot that answers questions from its chapters. Docusaurus front end, FastAPI and Qdrant behind it.",
    image: "/assets/projects/ai-robotics-book.png",
    link: "https://mrowaisabdullah.github.io/ai-humanoid-robotics/",
    repoUrl: "https://github.com/MrOwaisAbdullah/ai-humanoid-robotics",
    category: "AI Tool",
    tags: ["Docusaurus", "RAG", "FastAPI", "Education"],
    techStack: ["Docusaurus", "FastAPI", "Qdrant", "OpenAI API"],
  },
  {
    title: "Hashtag Tech",
    description: "Website for Hashtag Tech, an AI-focused software development agency.",
    image: "/assets/placeholder.png",
    link: "https://hashtag-tech.vercel.app/",
    repoUrl: "https://github.com/MrOwaisAbdullah/hashtag-tech",
    category: "Platform",
    tags: ["Next.js", "Agency", "AI"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Agency CRM",
    description: "CRM for agencies: client and project tracking with Supabase handling auth and data, Sanity handling content.",
    image: "/assets/placeholder.png",
    link: "https://agency-crm-ecru.vercel.app/",
    repoUrl: "https://github.com/MrOwaisAbdullah/agency-crm",
    category: "Dashboard",
    tags: ["Next.js", "CRM", "Supabase", "Sanity"],
    techStack: ["Next.js", "TypeScript", "Supabase", "Sanity CMS"],
  },
  {
    title: "FurnitureMart.pk",
    description: "Online furniture marketplace with product listings, cart, and checkout — built on Next.js and Sanity CMS.",
    image: "/assets/project-10.png",
    link: "https://furniture-mart-pk.vercel.app/",
    repoUrl: "https://github.com/MrOwaisAbdullah/Marketplace-Technical-Foundation---FurnitureMart.pk",
    category: "Marketplace",
    tags: ["Next.js", "Sanity", "E-commerce"],
    techStack: ["Next.js", "Sanity CMS", "Tailwind CSS"],
  },
  {
    title: "AA Marketing",
    description: "Marketing agency site with dynamic content management through Sanity CMS — services, portfolio, and contact.",
    image: "/assets/project-20.png",
    link: "https://aamarktng.com/",
    category: "Platform",
    tags: ["Next.js", "Typescript", "Marketing"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Blog Website",
    description: "A fully functional blog with comments, categories, and dynamic content using Sanity.",
    image: "/assets/project-12.png",
    link: "https://blog-site-green-one.vercel.app/",
    category: "Tool",
    tags: ["Next.js", "Sanity", "Blog"],
    techStack: ["Next.js", "Sanity CMS", "Tailwind CSS"],
  },
  {
    title: "FurnitureMart.pk Admin Dashboard",
    description: "Admin panel for the FurnitureMart marketplace — order management, inventory tracking, and customer data.",
    image: "/assets/project-11.png",
    link: "https://admin.oneklickdigi.com/",
    category: "Dashboard",
    tags: ["Next.js", "Sanity", "Dashboard"],
    techStack: ["Next.js", "Sanity CMS", "Tailwind CSS"],
  },
  {
    title: "Burraq Digits",
    description: "Digital marketing agency site — service pages, portfolio, and blog managed through Sanity CMS.",
    image: "/assets/project-21.png",
    link: "https://burraq-digits.vercel.app/",
    category: "Platform",
    tags: ["Next.js", "Typescript", "Digital Marketing"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Personal AI Assistant",
    description: "AI chatbot on this portfolio — visitors can ask about my skills, projects, and experience in natural language.",
    image: "/assets/project-19.png",
    link: "#",
    category: "AI Tool",
    tags: ["Next.js", "AI", "Chatbot", "Portfolio"],
    techStack: ["Next.js", "Gemini AI", "Tailwind CSS"],
  },
  {
    title: "GigBillow",
    description: "Freelance business toolkit — time tracking, invoicing, proposals, and project management in one app, with AI handling task categorization and invoice generation.",
    image: "/assets/projects/owflex.png",
    link: "https://gigbillow.vercel.app/",
    category: "Tool",
    tags: ["Next.js", "AI", "Freelance", "Time Tracking", "Invoicing"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "AI Integration", "Prisma"],
  },
  {
    title: "Voice of Holy Quran",
    description: "An interactive Quran learning platform where students can register, find qualified teachers, schedule sessions, and learn Quran online with progress tracking.",
    image: "/assets/projects/vhq.png",
    link: "https://voiceofholyquran.com/",
    category: "Institution",
    tags: ["Next.js", "Education", "E-Learning", "Teaching Platform"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Authentication", "Database"],
  },
  {
    title: "Art Prompts Pro",
    description: "An AI-powered art prompt generator and creative platform for artists, helping spark creativity with unique prompt suggestions.",
    image: "/assets/projects/art-prompt.png",
    link: "https://artpromptspro.com/",
    category: "AI Tool",
    tags: ["Next.js", "AI", "Art", "Creativity", "Prompts"],
    techStack: ["Next.js", "TypeScript", "OpenAI API", "Tailwind CSS"],
  },
  {
    title: "Al-Rehman",
    description: "A restaurant website specializing in pulao and biryani. Features online ordering, menu display, and delivery management for authentic cuisine.",
    image: "/assets/projects/al-rehman.png",
    link: "https://al-rehman.vercel.app/",
    category: "Ecommerce",
    tags: ["Next.js", "Restaurant", "Food Ordering", "Menu", "Delivery"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Payment Integration"],
  },
  // WordPress Projects
  {
    title: "Landscape & Gardening Website",
    description: "Business site for a landscaping company — service portfolio, project gallery, and contact forms.",
    image: "/assets/project.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP", "Elementor"],
  },
  {
    title: "Four M Enterprises",
    description: "Roofing material supplier website — product catalog and company information.",
    image: "/assets/project-01.png",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "IDI Overseas HR",
    description: "HR consultancy website — services, job listings, and client onboarding.",
    image: "/assets/project-04.png",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "Rukhsar Marriage Bureau",
    description: "Marriage bureau site — profile listings, inquiries, and matchmaking services.",
    image: "/assets/project-03.png",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "Next Trip & Travels",
    description: "Travel agency website — tour packages, booking, and destination guides.",
    image: "/assets/project-02.png",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "One Rupee Raffle Website",
    description: "One-rupee raffle platform with ticket purchases, draw scheduling, and winner announcements.",
    image: "/assets/project-5.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "E-commerce", "Lottery"],
    techStack: ["WordPress", "WooCommerce"],
  },
  {
    title: "Furniture & Interior Design Website",
    description: "A premium furniture store website combining stunning visuals and product catalog.",
    image: "/assets/project-2.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Interior Design", "Business"],
    techStack: ["WordPress", "WooCommerce"],
  },
  {
    title: "Coffee Cafe Website",
    description: "Coffee shop site — menu, location, and online presence for a local cafe.",
    image: "/assets/project-3.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Cafe", "Local Business"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "Online Quran Academy Website",
    description: "Quran academy site — course listings, teacher profiles, and student enrollment.",
    image: "/assets/project-4.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Education", "Online Learning"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "Home Improvement Ecommerce Website",
    description: "Online store for home improvement tools and gadgets — WooCommerce with product categories and checkout.",
    image: "/assets/project-1.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "E-commerce", "Home Improvement"],
    techStack: ["WordPress", "WooCommerce"],
  },
  // Shopify Projects
  {
    title: "JustGlow",
    description: "Premium beauty and skincare e-commerce store built on Shopify — product catalog, cart, and checkout with custom theme.",
    image: "/assets/projects/justglow.png",
    link: "https://justglow.com.pk/",
    category: "Ecommerce",
    tags: ["Shopify", "E-commerce", "Beauty", "Skincare"],
    techStack: ["Shopify", "Liquid"],
  },
  {
    title: "SweetFace",
    description: "Beauty and skincare brand store on Shopify — product listings, promotions, and secure checkout.",
    image: "/assets/projects/sweetface.png",
    link: "https://www.sweetface.com.pk/",
    category: "Ecommerce",
    tags: ["Shopify", "E-commerce", "Beauty", "Skincare"],
    techStack: ["Shopify", "Liquid"],
  },
  {
    title: "KBloom Beauty",
    description: "Beauty products e-commerce store on Shopify — curated collection with custom branding and responsive design.",
    image: "/assets/projects/kbloombeauty.png",
    link: "https://kbloombeauty.com/",
    category: "Ecommerce",
    tags: ["Shopify", "E-commerce", "Beauty"],
    techStack: ["Shopify", "Liquid"],
  },
  {
    title: "Christine",
    description: "Fashion and beauty e-commerce store on Shopify — product catalog with custom theme and checkout flow.",
    image: "/assets/projects/christine.png",
    link: "https://christine.com.pk/",
    category: "Ecommerce",
    tags: ["Shopify", "E-commerce", "Fashion", "Beauty"],
    techStack: ["Shopify", "Liquid"],
  },
  {
    title: "Onak Perfumes",
    description: "Premium perfume brand e-commerce store on Shopify — fragrance catalog with product details and secure checkout.",
    image: "/assets/projects/onakperfumes.png",
    link: "https://www.onakperfumes.com/",
    category: "Ecommerce",
    tags: ["Shopify", "E-commerce", "Perfume", "Luxury"],
    techStack: ["Shopify", "Liquid"],
  },
  // WordPress/WooCommerce Projects
  {
    title: "Speedline Logistic",
    description: "Logistics and freight company website — services, tracking, and client onboarding on WordPress.",
    image: "/assets/projects/speedlinelogistic.png",
    link: "https://speedlinelogistic.com/",
    category: "WordPress",
    tags: ["WordPress", "Logistics", "Business"],
    techStack: ["WordPress", "WooCommerce", "PHP"],
  },
  {
    title: "Soneri Care",
    description: "Healthcare and personal care brand website — product catalog and information on WordPress.",
    image: "/assets/projects/sonericare.png",
    link: "https://sonericare.com/",
    category: "WordPress",
    tags: ["WordPress", "Healthcare", "E-commerce"],
    techStack: ["WordPress", "WooCommerce", "PHP"],
  },
  {
    title: "Food Soneri Care",
    description: "Health food products e-commerce store — WooCommerce with product categories and checkout.",
    image: "/assets/projects/food-sonericare.png",
    link: "https://food.sonericare.com/",
    category: "WordPress",
    tags: ["WordPress", "WooCommerce", "Food", "Health"],
    techStack: ["WordPress", "WooCommerce"],
  },
  {
    title: "LionUp Digital",
    description: "Digital agency website — services, portfolio, and client engagement on WordPress.",
    image: "/assets/projects/lionupdigital.png",
    link: "https://lionupdigital.com/",
    category: "WordPress",
    tags: ["WordPress", "Agency", "Digital Marketing"],
    techStack: ["WordPress", "PHP"],
  },
  // Tools & Automation
  {
    title: "AI Content Generator",
    description: "Turns YouTube videos into social media posts — extracts key points and rewrites them for different platforms.",
    image: "/assets/project-16.png",
    link: "https://agentic-socials.streamlit.app/",
    category: "AI Tool",
    tags: ["Python", "Automation", "AI", "Content"],
    techStack: ["Python", "Streamlit", "OpenAI API"],
  },
  {
    title: "AI Data Alchemist",
    description: "Upload a CSV or Excel file — clean, filter, transform, and visualize your data with AI-powered suggestions.",
    image: "/assets/project-13.png",
    link: "https://ai-data-alchemist.streamlit.app/",
    category: "AI Tool",
    tags: ["Python", "AI", "Data", "Converter"],
    techStack: ["Python", "Streamlit", "Pandas", "Gemini API"],
    repoUrl: "https://github.com/MrOwaisAbdullah/Web-App-with-Streamlit",
  },
  {
    title: "Password Strength Meter",
    description: "PassGuard is a sleek, secure Streamlit-based tool designed to evaluate password strength, generate strong passwords.",
    image: "/assets/project-15.png",
    link: "https://passguard.streamlit.app/",
    category: "Tool",
    tags: ["Python", "Streamlit", "Security"],
    techStack: ["Python", "Streamlit"],
  },
  {
    title: "AI Powered Unit Converter",
    description: "Tool to convert Units and currency with real time data using AI.",
    image: "/assets/project-14.png",
    link: "https://convertiq.streamlit.app/",
    category: "Tool",
    tags: ["Python", "Streamlit", "Converter"],
    techStack: ["Python", "Streamlit"],
    repoUrl: "https://github.com/MrOwaisAbdullah/1_unit_converter",
  },
  {
    title: "Resume Builder",
    description: "A custom resume-building tool with PDF export functionality.",
    image: "/assets/project-8.png",
    link: "https://resume-builder-phi-olive.vercel.app/",
    category: "Tool",
    tags: ["HTML", "TypeScript"],
    techStack: ["HTML", "TypeScript", "CSS"],
    repoUrl: "https://github.com/MrOwaisAbdullah/Resume-Builder",
  },
];

// GitHub repository data - researched and extracted from GitHub
const githubRepositories: Project[] = [
  {
    title: "SaaS Business Plan Agent",
    category: "AI Tool",
    description:
      "A conversational SaaS Business Plan Generator using OpenAI Agents SDK and Chainlit. Generates investor-focused business plans with specialist agents for market research, product strategy, business modeling, go-to-market planning, and financial projections.",
    link: "https://github.com/MrOwaisAbdullah/Saas-Plan-Agent",
    deployedUrl: null,
    image: null,
    techStack: ["Python", "OpenAI Agents SDK", "Chainlit", "Tavily API"],
    tags: ["Python", "AI", "Agents", "Business"],
    stars: 0,
    language: "Python",
  },
  {
    title: "Weather Info Agent",
    category: "AI Tool",
    description:
      "AI agent that fetches real-time weather information via a chat interface. Built with OpenAI Agents SDK, WeatherAPI, and Chainlit. Deployable on Hugging Face Spaces.",
    link: "https://github.com/MrOwaisAbdullah/weather-Agent",
    deployedUrl: null,
    image: null,
    techStack: ["Python", "OpenAI Agents SDK", "Chainlit", "WeatherAPI", "Gemini API"],
    tags: ["Python", "AI", "Agents", "Weather"],
    stars: 0,
    language: "Python",
  },
  {
    title: "Calculator Agent",
    category: "AI Tool",
    description: "AI-powered calculator agent using Python and OpenAI Agents SDK.",
    link: "https://github.com/MrOwaisAbdullah/calculator-agent",
    deployedUrl: null,
    image: null,
    techStack: ["Python", "OpenAI Agents SDK"],
    tags: ["Python", "AI", "Agents", "Calculator"],
    stars: 0,
    language: "Python",
  },
  {
    title: "Agent with OpenRouter",
    category: "AI Tool",
    description: "AI agent integration with OpenRouter API for enhanced AI capabilities.",
    link: "https://github.com/MrOwaisAbdullah/Agent-with-Openrouter",
    deployedUrl: null,
    image: null,
    techStack: ["Python"],
    tags: ["Python", "AI", "Agents"],
    stars: 0,
    language: "Python",
  },
  {
    title: "Shopify Liquid Project",
    category: "Ecommerce",
    description: "Shopify-based development project using Liquid templating for e-commerce customization.",
    link: "https://github.com/MrOwaisAbdullah/Shopify",
    deployedUrl: null,
    image: null,
    techStack: ["Liquid", "Shopify"],
    tags: ["Shopify", "Liquid", "E-commerce"],
    stars: 0,
    language: "Liquid",
  },
  {
    title: "SEO Blog Agent (ContentSpark AI)",
    category: "AI Tool",
    description:
      "Digital FTE for content: a multi-agent SEO system that researches, writes, and publishes 15-17 optimized blog posts every day straight into Sanity CMS. Orchestrated with OpenAI Agents SDK, free-tier APIs, and automatic fallbacks.",
    link: "https://github.com/MrOwaisAbdullah/SEO-Blog-Agent",
    deployedUrl: null,
    image: null,
    techStack: ["Python", "OpenAI Agents SDK", "Sanity CMS", "Discord", "Tavily API"],
    tags: ["Python", "AI", "Agents", "SEO", "Content Automation"],
    stars: 0,
    language: "Python",
  },
  {
    title: "SocialFTE",
    category: "AI Tool",
    description:
      "Social media Digital FTE — runs a brand's social accounts end to end: drafts captions in brand voice, renders product visuals with Remotion, waits for human approval via Discord, then publishes to Facebook, Instagram, YouTube Shorts, and TikTok.",
    link: "https://github.com/MrOwaisAbdullah/socialfte",
    deployedUrl: null,
    image: null,
    techStack: ["Python", "Claude Code", "Remotion", "Cloudflare R2", "Discord", "Puppeteer"],
    tags: ["Python", "AI Agents", "Social Media", "Automation", "Remotion"],
    stars: 0,
    language: "Python",
  },
];

// Merge projects, avoiding duplicates by title
function mergeProjects(existing: Project[], github: Project[]): Project[] {
  const merged = [...existing];
  const existingTitles = new Set(existing.map((p) => p.title.toLowerCase()));

  for (const repo of github) {
    if (!existingTitles.has(repo.title.toLowerCase())) {
      merged.push({
        ...repo,
        image: repo.image || "/assets/placeholder.png",
        link: repo.deployedUrl || repo.link,
        repoUrl: repo.link,
      });
    }
  }

  return merged;
}

export const allProjects: Project[] = mergeProjects(existingProjects, githubRepositories);

export const projectsByCategory: Record<string, Project[]> = allProjects.reduce(
  (acc, project) => {
    const category = project.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  },
  {} as Record<string, Project[]>
);

// Work history. LionUp Digital and AA Marketing are concurrent, ongoing roles.
export const work: WorkEntry[] = [
  {
    company: "LionUp Digital",
    title: "Senior Developer (Web & AI)",
    start: "2025",
    end: "Present",
    description:
      "Building spec-driven SaaS products and AI-powered automation solutions. Implementing OpenAI Agents SDK for intelligent workflows and Digital FTE (AI employee) products.",
  },
  {
    company: "AA Marketing",
    title: "Senior Developer & Manager",
    start: "2024",
    end: "Present",
    description:
      "Managing digital projects and development for clients alongside my LionUp Digital role, focusing on smooth remote execution and web strategy.",
  },
  {
    company: "Burraq Digits",
    title: "Web Developer & AI Specialist",
    start: "2025",
    end: "2025",
    description:
      "Developed AI-driven web solutions using Next.js and TypeScript. Built production-ready applications with spec-first development methodology.",
  },
  {
    company: "OneKlick Digital Co.",
    title: "Web Developer & Digital Marketer",
    start: "2023",
    end: "2024",
    description:
      "Built WordPress and Next.js websites with focus on SEO and performance. Implemented marketing campaigns.",
  },
  {
    company: "Marksman Advertising",
    title: "SMM Intern",
    start: "2023",
    end: "2023",
    description:
      "Worked with Facebook Ads Manager to run ad campaigns and boost engagement.",
  },
  {
    company: "Fiverr",
    title: "Freelance Graphic Designer",
    start: "2018",
    end: "2020",
    description:
      "Designed branding materials, logos, and social media graphics for diverse clients.",
  },
];

export const education = [
  {
    school: "Virtual University of Pakistan",
    degree: "BSCS - Computer Science (Enrolled)",
    start: "2025",
    end: "Present",
  },
  {
    school: "Panaversity | GIAIC",
    degree: "Cloud Native Applied Agentic AI",
    start: "2024",
    end: "Present",
  },
];

export const skills = [
  "Spec-Driven Development",
  "AI-Driven Engineering",
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Python",
  "Claude Code",
  "OpenAI Agents SDK",
  "Claude Agent SDK",
  "MCP (Model Context Protocol)",
  "OpenRouter",
  "DeepSeek",
  "Paperclip",
  "OpenClaw",
  "Hermes",
  "AI Agents",
  "AI Automation",
  "AI Integrations",
  "Chatbots",
  "SaaS Architecture",
  "Full-Stack Development",
  "REST APIs",
  "PostgreSQL",
  "Neon Postgres",
  "pgvector",
  "SQLite",
  "Prisma ORM",
  "Clerk",
  "Better Auth",
  "Zod",
  "FastAPI",
  "WordPress",
  "WooCommerce",
  "Elementor",
  "Sanity CMS",
  "Shopify",
  "Liquid",
  "Chainlit",
  "Streamlit",
  "Gemini API",
  "WeatherAPI",
  "Tavily API",
  "Tkinter",
  "Pandas",
  "Altair",
  "Cloudflare R2",
  "AWS S3",
  "Docker",
  "Inngest",
  "Playwright",
  "Obsidian",
  "Automation Scripts",
  "Git",
  "Web Design",
  "Digital Marketing",
  "SEO",
  "Social Media Management",
];

export const profile = {
  name: "Owais Abdullah",
  initials: "OA",
  location: "Based in Pakistan 🇵🇰",
  locationLink: "https://www.google.com/maps/place/Pakistan",
  about: "Spec-Driven Developer. AI Agent Engineer. SaaS Architect.",
  summary:
    "I build AI-Native companies through Digital FTEs — autonomous AI employees powered by Claude Code, OpenAI Agents SDK, and MCP. I also build Next.js SaaS products, agent orchestration systems, and automation pipelines. Core stack: TypeScript, Next.js, Python, Claude Code, OpenAI Agents SDK, PostgreSQL, pgvector, Cloudflare R2, Docker.",
  personalWebsiteUrl: "https://owaisabdullah.dev/",
  githubUrl: "https://github.com/MrOwaisAbdullah",
  linkedInUrl: "https://www.linkedin.com/in/mrowaisabdullah/",
  contact: {
    email: "mrowaisabdullah@gmail.com",
    social: [
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/mrowaisabdullah",
      },
      {
        name: "X",
        url: "https://x.com/mrowaisabdullah",
      },
      {
        name: "GitHub",
        url: "https://github.com/MrOwaisAbdullah",
      },
      {
        name: "Instagram",
        url: "https://instagram.com/mrowaisabdullah",
      },
      {
        name: "Facebook",
        url: "https://facebook.com/mrowaisabdullah",
      },
    ],
  },
  education,
  work,
  skills,
  projects: allProjects,
  projectsByCategory,
  keyHighlights: [
    {
      title: "Experience",
      description: "3+ years in the tech industry",
      icon: "💼",
    },
    {
      title: "Projects",
      description: "50+ projects delivered",
      icon: "🚀",
    },
    {
      title: "Development",
      description: "Spec-Driven & AI-Driven Engineering",
      icon: "📋",
    },
    {
      title: "AI Agents",
      description: "Claude Code, OpenAI Agents SDK, MCP",
      icon: "🤖",
    },
    {
      title: "SaaS Solutions",
      description: "Production-ready Next.js SaaS products",
      icon: "☁️",
    },
    {
      title: "Tech Stack",
      description: "TypeScript, Next.js, Python, Claude Code",
      icon: "🛠️",
    },
    {
      title: "Languages",
      description: "English (Professional), Urdu (Native)",
      icon: "🗣️",
    },
    {
      title: "Focus",
      description: "Production-ready & scalable architectures",
      icon: "🎯",
    },
  ],
};
