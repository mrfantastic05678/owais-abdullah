import AboutSection from "@/components/AboutSection";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import ProjectsTab from "@/components/ProjectsTab";
import JsonLdSchema from "@/components/JsonLdSchema";
import type { Metadata } from "next";
import SkillSlider from "@/components/SkillSlider";
import BlogSection from "@/components/BlogSection";
import Services from "@/components/Services";
import FTEStory from "@/components/FTEStory";
import StatsBand from "@/components/StatsBand";
import IndustriesStrip from "@/components/IndustriesStrip";
import HomeFaq from "@/components/HomeFaq";
import DotRail from "@/components/DotRail";
import { projectsByCategory, allProjects } from "@/data/profile";

// ISR: prerendered HTML (projects + blog posts crawlable), refreshed every 24h
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Owais Abdullah | AI Automation Agency & Custom Agent Development",
  description:
    "AI automation agency and custom agent development services by Owais Abdullah. Autonomous Digital FTEs, Next.js SaaS, and OpenAI Agents SDK. Hire an AI dev.",
  keywords: [
    "AI Automation Agency",
    "AI Agent Development Services",
    "Hire AI Agent Developer",
    "AI Chatbot Developer",
    "AI Workflow Automation",
    "Digital FTE Development",
    "Spec-Driven Developer",
    "AI Agent Engineer",
    "Next.js SaaS Developer",
    "OpenAI Agents SDK",
    "TypeScript Developer",
    "Full Stack Developer",
    "SaaS Architecture",
    "Owais Abdullah",
  ],
  openGraph: {
    title: "Owais Abdullah | AI Automation Agency & Custom Agent Development",
    description:
      "AI automation agency and custom agent development services by Owais Abdullah. Autonomous Digital FTEs, Next.js SaaS, and OpenAI Agents SDK. Hire an AI dev.",
    url: "https://owaisabdullah.dev",
    siteName: "Owais Abdullah Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/owais-abdullah-og.png",
        width: 1200,
        height: 630,
        alt: "Owais Abdullah - AI Automation Agency & Custom Agent Development",
      },
    ],
  },
  twitter: {
    title: "Owais Abdullah | AI Automation Agency & Custom Agent Development",
    description:
      "AI automation agency and custom agent development services by Owais Abdullah. Autonomous Digital FTEs, Next.js SaaS, and OpenAI Agents SDK. Hire an AI dev.",
    card: "summary_large_image",
    images: ["/assets/owais-abdullah-og.png"],
  },
  alternates: {
    canonical: "https://owaisabdullah.dev/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Home() {
  return (
    <>
      <JsonLdSchema type="home" pageUrl="https://owaisabdullah.dev" />
      <DotRail />
      <Hero />
      <SkillSlider />
      <AboutSection />
      <StatsBand />
      <Services />
      <IndustriesStrip />
      <FTEStory />
      <ProjectsTab projectsByCategory={projectsByCategory} allProjects={allProjects} />
      <BlogSection limit={12} showViewAll />
      <Experience />
      <HomeFaq />
      <Contact />
    </>
  );
}
