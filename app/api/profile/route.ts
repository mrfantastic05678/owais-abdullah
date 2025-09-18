import { NextResponse } from "next/server";

export async function GET() {
  const profile = {
    name: "Owais Abdullah",
    initials: "OA",
    location: "Based in Pakistan 🇵🇰",
    locationLink: "https://www.google.com/maps/place/Pakistan",
    about: "Web Developer. AI Integrator. Automation Enthusiast.",
    summary:
      "I design and develop modern websites, web apps, and intelligent automation systems. Skilled in TypeScript, Next.js, WordPress, and AI integrations. Currently learning Agentic AI and building automation tools for creative professionals.",
    personalWebsiteUrl: "https://owaisabdullah.dev/",
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
          url: "https://github.com/mrowaisabdullah",
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
        degree: "BS Software Engineering (Enrolled)",
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
          "Working on building modern web solutions and integrating AI tools and automation workflows.",
      },
      {
        company: "Burraq Digits",
        title: "Web Developer & AI Specialist",
        start: "2025",
        end: "2025",
        description:
          "Working on building modern web solutions and integrating AI tools and automation workflows.",
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
          "Built websites using WordPress, Next.js, and Tailwind CSS. Handled SEO and social media campaigns.",
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
          "Designed social media graphics, logos, and branding materials.",
      },
    ],
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "Python",
      "SQLite",
      "PostgreSQL",
      "Prisma ORM",
      "Sanity CMS",
      "WordPress",
      "Clerk",
      "Zod",
      "AI Integrations",
      "Chatbots",
      "Automation Scripts",
      "REST APIs",
      "Git",
      "Web Design",
      "Open AI Agents SDK",
      "Chainlit",
      "Streamlit",
    ],
    projects: [
      {
        title: "FurnitureMart.pk",
        category: "Marketplace",
        description:
          "Furniture ecommerce platform built with Next.js, Sanity, and Tailwind CSS.",
        link: "https://furnituremart.pk",
      },
      {
        title: "Resume Builder",
        category: "Tool",
        description:
          "A customizable resume builder with PDF export, built using TypeScript and Next.js.",
        link: "#",
      },
      {
        title: "AI Social Post Agent",
        category: "AI Tool",
        description:
          "Generates LinkedIn posts, tweets, carousels, and captions from or without YouTube transcripts.",
        link: "#",
      },
      {
        title: "SEO Blog Agent",
        category: "AI Tool",
        description:
          "Researches, writes, and publishes SEO-optimized blogs directly to websites.",
        link: "#",
      },
      {
        title: "YT-to-Social Post Converter",
        category: "Tool",
        description:
          "Converts YouTube Shorts into ready-to-publish content for multiple social platforms.",
        link: "#",
      },
      {
        title: "PC Bottleneck Calculator",
        category: "Tool",
        description:
          "A web tool to analyze PC hardware and detect potential performance bottlenecks.",
        link: "#",
      },
      {
        title: "Instagram Video Downloader",
        category: "Tool",
        description:
          "A secure and easy-to-use web app for downloading Instagram videos.",
        link: "#",
      },
      {
        title: "Art Prompt & Ideas Platform",
        category: "Platform",
        description:
          "An AI-powered platform for generating unique art prompts and creative ideas.",
        link: "#",
      },
      {
        title: "Renting Platform",
        category: "Marketplace",
        description:
          "A platform enabling sellers to rent out their goods with ease.",
        link: "#",
      },
      {
        title: "AI Content Generator",
        category: "AI Tool",
        description:
          "A CLI tool to generate carousels, threads, and captions using OpenAI.",
        link: "#",
      },
      {
        title: "Portfolio Website",
        category: "Personal",
        description:
          "Personal portfolio built with Next.js 14 and Tailwind CSS to showcase my work and services.",
        link: "https://owais-abdullah.vercel.app/",
      },
      {
        title: "Admin Dashboards",
        category: "Dashboard",
        description:
          "Multiple interactive admin dashboards designed with React.js and Tailwind CSS.",
        link: "#",
      },
      {
        title: "Education Website",
        category: "Institution",
        description:
          "Online presence for Quran academy and LMS platforms using WordPress.",
        link: "#",
      },
      {
        title: "Food & Restaurant Websites",
        category: "WordPress",
        description:
          "Developed WordPress-based websites for cafes, coffee shops, and restaurants.",
        link: "#",
      },
      {
        title: "Landscape & Gardening Website",
        category: "WordPress",
        description:
          "A professional website for a landscape and gardening service provider.",
        link: "#",
      },
      {
        title: "One Rupee Raffle Website",
        category: "WordPress",
        description:
          "A user-friendly and trustworthy raffle website built on WordPress.",
        link: "#",
      },
      {
        title: "Furniture & Interior Design Website",
        category: "WordPress",
        description:
          "A furniture store and interior design firm website blending products with design expertise.",
        link: "#",
      },
      {
        title: "Online Quran Academy Website",
        category: "WordPress",
        description:
          "A website for an online Quran academy, showcasing courses and services.",
        link: "#",
      },
      {
        title: "Home Improvement Ecommerce Website",
        category: "WordPress",
        description:
          "User-friendly ecommerce store for homeowners to find tools and gadgets.",
        link: "#",
      },
    ],
    keyHighlights: [
      {
        title: "Experience",
        description: "3+ years in the tech industry",
        icon: "💼",
      },
      {
        title: "Projects",
        description: "30+ projects delivered",
        icon: "🚀",
      },
      {
        title: "Tech Stack",
        description:
          "React, Next.js, TypeScript, Python, WordPress, OpenAI Agents SDK",
        icon: "🛠️",
      },
      {
        title: "AI Integration",
        description: "Built tools with LLM's",
        icon: "🤖",
      },
      {
        title: "Automations",
        description:
          "Created productivity scripts for content creators & Businesses",
        icon: "⚙️",
      },
      {
        title: "AI Agents",
        description: "Built AI Agents with OpenAI Agents SDK",
        icon: "🤖",
      },
      {
        title: "Languages",
        description: "English (Professional), Urdu (Native)",
        icon: "🗣️",
      },
      {
        title: "Hobbies",
        description:
          "Exploring tech, building tools, watching documentaries, spending time with family",
        icon: "🎯",
      },
    ],
  };

  return NextResponse.json(profile);
}
