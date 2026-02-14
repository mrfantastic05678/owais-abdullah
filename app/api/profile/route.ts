import { NextResponse } from "next/server";

// Existing projects from data/projects.ts - these have images and are already on the website
const existingProjects = [
  // Next.js Projects
  {
    title: "Personal Portfolio Website",
    description: "My personal portfolio showcasing my skills, projects, and experience, built with Next.js.",
    image: "/assets/projects/owais-portfolio.png",
    link: "https://owaisabdullah.dev",
    repoUrl: "https://github.com/MrOwaisAbdullah/Owais-Abdullah",
    category: "Next.js",
    tags: ["Next.js", "Tailwind", "Portfolio"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity CMS"],
  },
  {
    title: "FurnitureMart.pk",
    description: "A fully dynamic furniture marketplace built using Next.js, Sanity, and Tailwind CSS.",
    image: "/assets/project-10.png",
    link: "https://furniture-mart-pk.vercel.app/",
    repoUrl: "https://github.com/MrOwaisAbdullah/Marketplace-Technical-Foundation---FurnitureMart.pk",
    category: "Next.js",
    tags: ["Next.js", "Sanity", "E-commerce"],
    techStack: ["Next.js", "Sanity CMS", "Tailwind CSS"],
  },
  {
    title: "AA Marketing",
    description: "A fully dynamic marketing website built using Next.js, Sanity, and Tailwind CSS.",
    image: "/assets/project-20.png",
    link: "https://aamarktng.com/",
    category: "Next.js",
    tags: ["Next.js", "Typescript", "Marketing"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Blog Website",
    description: "A fully functional blog with comments, categories, and dynamic content using Sanity.",
    image: "/assets/project-12.png",
    link: "https://blog-site-green-one.vercel.app/",
    category: "Next.js",
    tags: ["Next.js", "Sanity", "Blog"],
    techStack: ["Next.js", "Sanity CMS", "Tailwind CSS"],
  },
  {
    title: "FurnitureMart.pk Admin Dashboard",
    description: "A fully dynamic furniture marketplace dashboard built using Next.js, Sanity, and Tailwind CSS.",
    image: "/assets/project-11.png",
    link: "https://admin.oneklickdigi.com/",
    category: "Next.js",
    tags: ["Next.js", "Sanity", "Dashboard"],
    techStack: ["Next.js", "Sanity CMS", "Tailwind CSS"],
  },
  {
    title: "Burraq Digits",
    description: "A fully dynamic digital marketing agency website built using Next.js, Sanity, and Tailwind CSS.",
    image: "/assets/project-21.png",
    link: "https://burraq-digits.vercel.app/",
    category: "Next.js",
    tags: ["Next.js", "Typescript", "Digital Marketing"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Personal AI Assistant",
    description: "An AI-powered chatbot integrated into my portfolio website, allowing visitors to explore my skills, projects, and contact details effortlessly.",
    image: "/assets/project-19.png",
    link: "#",
    category: "Next.js",
    tags: ["Next.js", "AI", "Chatbot", "Portfolio"],
    techStack: ["Next.js", "Gemini AI", "Tailwind CSS"],
  },
  {
    title: "First Practice Portfolio Website",
    description: "My First Practice portfolio showcasing dummy data, projects, skills, and experience, built with Next.js.",
    image: "/assets/project-17.png",
    link: "https://portfolio-class-assignment.vercel.app/",
    category: "Next.js",
    tags: ["Next.js", "Tailwind", "Portfolio"],
    techStack: ["Next.js", "Tailwind CSS"],
  },
  {
    title: "TeamFlow",
    description: "An AI-powered team management and task assignment platform designed for agencies. Features intelligent task distribution, team workload balancing, and automated project tracking.",
    image: "/assets/projects/teamflow.png",
    link: "https://teamflow-sigma-opal.vercel.app/",
    category: "Next.js",
    tags: ["Next.js", "AI", "SaaS", "Team Management", "Agencies", "Task Assignment"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "AI Integration", "Supabase"],
  },
  {
    title: "RentParlo",
    description: "A peer-to-peer marketplace for renting goods. Connects lenders with borrowers, featuring secure transactions, rental agreements, and item verification.",
    image: "/assets/projects/rentparlo.png",
    link: "https://rentparlo.vercel.app/",
    category: "Next.js",
    tags: ["Next.js", "Marketplace", "Rental", "P2P", "E-commerce"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Stripe"],
  },
  {
    title: "OWFlex",
    description: "An all-in-one project management, time tracking, and invoice creator platform for freelancers. Uses AI for smart task categorization and automated invoice generation.",
    image: "/assets/projects/owflex.png",
    link: "https://owflex.vercel.app/",
    category: "Next.js",
    tags: ["Next.js", "AI", "Freelance", "Time Tracking", "Invoicing", "Project Management"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "AI Integration", "Prisma"],
  },
  {
    title: "Voice of Holy Quran",
    description: "An interactive Quran learning platform where students can register, find qualified teachers, schedule sessions, and learn Quran online with progress tracking.",
    image: "/assets/projects/vhq.png",
    link: "https://voiceofholyquran.com/",
    category: "Next.js",
    tags: ["Next.js", "Education", "Quran", "E-Learning", "Islamic", "Teaching Platform"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Authentication", "Database"],
  },
  {
    title: "Art Prompts Pro",
    description: "An AI-powered art prompt generator and creative platform for artists, helping spark creativity with unique prompt suggestions.",
    image: "/assets/projects/art-prompt.png",
    link: "https://artpromptspro.com/",
    category: "Next.js",
    tags: ["Next.js", "AI", "Art", "Creativity", "Prompts"],
    techStack: ["Next.js", "TypeScript", "OpenAI API", "Tailwind CSS"],
  },
  {
    title: "Al-Rehman",
    description: "A restaurant website specializing in pulao and biryani. Features online ordering, menu display, and delivery management for authentic cuisine.",
    image: "/assets/projects/al-rehman.png",
    link: "https://al-rehman.vercel.app/",
    category: "Next.js",
    tags: ["Next.js", "Restaurant", "Food Ordering", "Menu", "Delivery"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Payment Integration"],
  },
  // WordPress Projects
  {
    title: "Landscape & Gardening Website",
    description: "Created a website for a landscape and gardening service provider, showcasing their expertise.",
    image: "/assets/project.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP", "Elementor"],
  },
  {
    title: "Four M Enterprises",
    description: "Created a website for a roofing material supplier, showcasing their expertise.",
    image: "/assets/project-01.png",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "IDI Overseas HR",
    description: "Created a website for a HR consultancy service provider, showcasing their expertise.",
    image: "/assets/project-04.png",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "Rukhsar Marriage Bureau",
    description: "Created a website for a marriage bureau, showcasing their expertise.",
    image: "/assets/project-03.png",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "Next Trip & Travels",
    description: "Created a website for a travel agency, showcasing their expertise.",
    image: "/assets/project-02.png",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Business", "SEO"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "One Rupee Raffle Website",
    description: "A new and exciting one-rupee raffle website, designed for an engaging user experience.",
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
    description: "An engaging website designed for a charming coffee cafe with a unique online presence.",
    image: "/assets/project-3.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Cafe", "Local Business"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "Online Quran Academy Website",
    description: "A website for an online Quran academy to communicate their educational offerings.",
    image: "/assets/project-4.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "Education", "Online Learning"],
    techStack: ["WordPress", "PHP"],
  },
  {
    title: "Home Improvement Ecommerce Website",
    description: "A user-friendly online store for home improvement tools and gadgets.",
    image: "/assets/project-1.webp",
    link: "#",
    category: "WordPress",
    tags: ["WordPress", "E-commerce", "Home Improvement"],
    techStack: ["WordPress", "WooCommerce"],
  },
  // Tools & Automation
  {
    title: "AI Content Generator",
    description: "Tool for generating AI-powered social media content with Youtube videos.",
    image: "/assets/project-16.png",
    link: "https://agentic-socials.streamlit.app/",
    category: "Tools & Automation",
    tags: ["Python", "Automation", "AI", "Content"],
    techStack: ["Python", "Streamlit", "OpenAI API"],
    repoUrl: "#",
  },
  {
    title: "AI Data Alchemist",
    description: "Tool that helps users transform, clean, Filter, visualize data (CSV/Excel), and give AI-Powered Suggestions.",
    image: "/assets/project-13.png",
    link: "https://ai-data-alchemist.streamlit.app/",
    category: "Tools & Automation",
    tags: ["Python", "AI", "Data", "Converter"],
    techStack: ["Python", "Streamlit", "Pandas", "Gemini API"],
    repoUrl: "https://github.com/MrOwaisAbdullah/Web-App-with-Streamlit",
  },
  {
    title: "Password Strength Meter",
    description: "PassGuard is a sleek, secure Streamlit-based tool designed to evaluate password strength, generate strong passwords.",
    image: "/assets/project-15.png",
    link: "https://passguard.streamlit.app/",
    category: "Tools & Automation",
    tags: ["Python", "Streamlit", "AI", "Security"],
    techStack: ["Python", "Streamlit"],
    repoUrl: "#",
  },
  {
    title: "SEO Audit Script",
    description: "Automated script to analyze website SEO and provide optimization recommendations.",
    image: "/assets/placeholder.png",
    link: "#",
    category: "Tools & Automation",
    tags: ["SEO", "Automation", "CLI Tool"],
    techStack: ["Python"],
    repoUrl: "#",
  },
  {
    title: "AI Powered Unit Converter",
    description: "Tool to convert Units and currency with real time data using AI.",
    image: "/assets/project-14.png",
    link: "https://convertiq.streamlit.app/",
    category: "Tools & Automation",
    tags: ["Python", "Streamlit", "AI", "Converter"],
    techStack: ["Python", "Streamlit"],
    repoUrl: "https://github.com/MrOwaisAbdullah/1_unit_converter",
  },
  // HTML & CSS
  {
    title: "Resume Builder",
    description: "A custom resume-building tool with PDF export functionality.",
    image: "/assets/project-8.png",
    link: "https://resume-builder-phi-olive.vercel.app/",
    category: "HTML & CSS",
    tags: ["HTML", "TypeScript", "Tool"],
    techStack: ["HTML", "TypeScript", "CSS"],
    repoUrl: "https://github.com/MrOwaisAbdullah/Resume-Builder",
  },
  {
    title: "Inventory Management System",
    description: "A simple tool to manage inventory.",
    image: "/assets/project-7.png",
    link: "https://inventory-management-sysytem-one.vercel.app/",
    category: "HTML & CSS",
    tags: ["HTML", "TypeScript", "Tool"],
    techStack: ["HTML", "TypeScript", "CSS"],
    repoUrl: "https://github.com/MrOwaisAbdullah/Basic-Inventory-Management-Sysytem",
  },
];

// GitHub repository data - researched and extracted from GitHub
// Images: Use agent-browser to capture screenshots of deployed websites and save to /public/assets/projects/
// Fallback: Use GitHub repo screenshot or social preview image
const githubRepositories = [
  {
    title: "SaaS Business Plan Agent",
    repo: "Saas-Plan-Agent",
    category: "Tools & Automation",
    description:
      "A conversational SaaS Business Plan Generator using OpenAI Agents SDK and Chainlit. Generates investor-focused business plans with specialist agents for market research, product strategy, business modeling, go-to-market planning, and financial projections.",
    link: "https://github.com/MrOwaisAbdullah/Saas-Plan-Agent",
    deployedUrl: null,
    image: null, // TODO: Capture screenshot with agent-browser
    techStack: ["Python", "OpenAI Agents SDK", "Chainlit", "Tavily API"],
    tags: ["Python", "AI", "Agents", "Business"],
    stars: 0,
    language: "Python",
  },
  {
    title: "Weather Info Agent",
    repo: "weather-Agent",
    category: "Tools & Automation",
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
    repo: "calculator-agent",
    category: "Tools & Automation",
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
    repo: "Agent-with-Openrouter",
    category: "Tools & Automation",
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
    title: "Personal Library Manager",
    repo: "3_book_library",
    category: "Tools & Automation",
    description:
      "A simple command-line application to manage your personal book collection. Add, remove, search, and track books with statistics and reading recommendations.",
    link: "https://github.com/MrOwaisAbdullah/3_book_library",
    deployedUrl: null,
    image: null,
    techStack: ["Python"],
    tags: ["Python", "CLI", "Books", "Library"],
    stars: 0,
    language: "Python",
  },
  {
    title: "Assignment Projects",
    repo: "4_Assingnments",
    category: "Tools & Automation",
    description:
      "Python projects completed for assignment 4. Includes random Python utilities and Tkinter applications.",
    link: "https://github.com/MrOwaisAbdullah/4_Assingnments",
    deployedUrl: null,
    image: null,
    techStack: ["Python", "Tkinter"],
    tags: ["Python", "Learning", "Assignments"],
    stars: 0,
    language: "Python",
  },
  {
    title: "Secure Data Encryption",
    repo: "05_secure_data_encryption",
    category: "Tools & Automation",
    description:
      "A complete traditional OOP practice series focused on secure data encryption in Python.",
    link: "https://github.com/MrOwaisAbdullah/05_secure_data_encryption",
    deployedUrl: null,
    image: null,
    techStack: ["Python"],
    tags: ["Python", "Security", "Encryption", "OOP"],
    stars: 0,
    language: "Python",
  },
  {
    title: "Build Compose and Decorate",
    repo: "06_Build_Compose_and_Decorate_A_Complete_Traditional_OOP_Practice_Series",
    category: "Tools & Automation",
    description:
      "A complete traditional OOP practice series demonstrating build, compose, and decorate patterns in Python.",
    link: "https://github.com/MrOwaisAbdullah/06_Build_Compose_and_Decorate_A_Complete_Traditional_OOP_Practice_Series",
    deployedUrl: null,
    image: null,
    techStack: ["Python"],
    tags: ["Python", "OOP", "Design Patterns"],
    stars: 0,
    language: "Python",
  },
  {
    title: "Shopify Liquid Project",
    repo: "Shopify",
    category: "WordPress",
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
    title: "Resume Builder App",
    repo: "Resume-Builder-App",
    category: "HTML & CSS",
    description: "Resume builder with HTML, CSS, & TypeScript. Create professional resumes with export functionality.",
    link: "https://github.com/MrOwaisAbdullah/Resume-Builder-App",
    deployedUrl: null,
    image: null,
    techStack: ["HTML", "CSS", "TypeScript"],
    tags: ["HTML", "TypeScript", "Resume"],
    stars: 0,
    language: "JavaScript",
  },
  {
    title: "Next.js First App",
    repo: "next-first-app",
    category: "Next.js",
    description: "Initial Next.js application project for learning and experimentation.",
    link: "https://github.com/MrOwaisAbdullah/next-first-app",
    deployedUrl: null,
    image: null,
    techStack: ["TypeScript", "Next.js"],
    tags: ["Next.js", "Learning"],
    stars: 0,
    language: "TypeScript",
  },
  {
    title: "Next.js Portfolio CSS",
    repo: "nextjs-portfolio-css",
    category: "Next.js",
    description: "Portfolio website variant using CSS-focused approach.",
    link: "https://github.com/MrOwaisAbdullah/nextjs-portfolio-css",
    deployedUrl: null,
    image: null,
    techStack: ["CSS"],
    tags: ["Next.js", "CSS", "Portfolio"],
    stars: 0,
    language: "CSS",
  },
  {
    title: "Node.js Projects",
    repo: "Node_Projects",
    category: "Tools & Automation",
    description: "Collection of Node.js projects for backend development practice.",
    link: "https://github.com/MrOwaisAbdullah/Node_Projects",
    deployedUrl: null,
    image: null,
    techStack: ["JavaScript", "Node.js"],
    tags: ["Node.js", "JavaScript", "Backend"],
    stars: 0,
    language: "JavaScript",
  },
];

// Project type definition
interface Project {
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

// Helper function to merge projects, avoiding duplicates by title
function mergeProjects(existing: Project[], github: Project[]) {
  const merged = [...existing];
  const existingTitles = new Set(existing.map((p) => p.title.toLowerCase()));

  for (const repo of github) {
    if (!existingTitles.has(repo.title.toLowerCase())) {
      merged.push({
        title: repo.title,
        description: repo.description,
        image: repo.image || "/assets/placeholder.png",
        link: repo.deployedUrl || repo.link,
        repoUrl: repo.link,
        category: repo.category,
        tags: repo.tags || [],
        techStack: repo.techStack || [],
        stars: repo.stars,
        language: repo.language,
      });
    }
  }

  return merged;
}

export async function GET() {
  // Merge existing projects with GitHub repositories
  const allProjects = mergeProjects(existingProjects, githubRepositories);

  const profile = {
    name: "Owais Abdullah",
    initials: "OA",
    location: "Based in Pakistan 🇵🇰",
    locationLink: "https://www.google.com/maps/place/Pakistan",
    about: "Spec-Driven Developer. AI Agent Engineer. SaaS Architect.",
    summary:
      "I build production-ready web applications and AI agents using spec-driven development and AI-driven engineering. Specializing in Next.js SaaS products, full-time digital solutions, and intelligent automation that scales with businesses. Expert in TypeScript, OpenAI Agents SDK, and building robust architectures from the ground up.",
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
    education: [
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
    ],
    work: [
      {
        company: "Lionup Digital",
        title: "Senior Developer (Web & AI)",
        start: "2025",
        end: "Present",
        description:
          "Building spec-driven SaaS products and AI-powered automation solutions. Implementing OpenAI Agents SDK for intelligent workflows and full-time digital products.",
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
        company: "AA Marketing",
        title: "Senior Developer (Web)",
        start: "2024",
        end: "Present",
        description:
          "Managed digital projects and development for clients, focusing on smooth remote execution and web strategy.",
      },
      {
        company: "OneKlick Digital Co.",
        title: "Web Developer & Digital Marketer",
        start: "2023",
        end: "Present",
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
    ],
    skills: [
      "Spec-Driven Development",
      "AI-Driven Engineering",
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Next.js",
      "OpenAI Agents SDK",
      "SaaS Architecture",
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "Python",
      "SQLite",
      "AI Agents",
      "AI Automation",
      "WordPress",
      "WooCommerce",
      "Sanity CMS",
      "Shopify",
      "Full-Stack Development",
      "REST APIs",
      "PostgreSQL",
      "Prisma ORM",
      "Clerk",
      "Zod",
      "AI Integrations",
      "Chatbots",
      "Git",
      "Web Design",
      "Open AI Agents SDK",
      "Automation Scripts",
      "Chainlit",
      "Streamlit",
      "Gemini API",
      "WeatherAPI",
      "Tavily API",
      "Liquid",
      "Tkinter",
      "Pandas",
      "Altair",
      "Shopify",
      "WooCommerce",
      "Elementor",
      "Digital Marketing",
      "SEO",
      "Social Media Management",
    ],
    // Merged projects from existing data and GitHub research
    // This structure supports dynamic rendering on the website
    // Images can be captured using agent-browser skill or chrome-devtools MCP
    projects: allProjects,
    // Projects grouped by category for easy filtering
    projectsByCategory: allProjects.reduce((acc, project) => {
      const category = project.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(project);
      return acc;
    }, {} as Record<string, typeof allProjects>),
    keyHighlights: [
      {
        title: "Experience",
        description: "3+ years in the tech industry",
        icon: "💼",
      },
      {
        title: "Projects",
        description: `${allProjects.length}+ projects delivered`,
        icon: "🚀",
      },
      {
        title: "Development",
        description: "Spec-Driven & AI-Driven Engineering",
        icon: "📋",
      },
      {
        title: "AI Agents",
        description: "OpenAI Agents SDK & Automation",
        icon: "🤖",
      },
      {
        title: "SaaS Solutions",
        description: "Next.js full-time digital products",
        icon: "☁️",
      },
      {
        title: "Tech Stack",
        description: "TypeScript, Next.js, Python, WordPress",
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

  return NextResponse.json(profile);
}
