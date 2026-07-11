import AboutSection from "@/components/AboutSection";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import ScatterText from "@/components/ScatterText";
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
import CharRevealHeading from "@/components/CharRevealHeading";
import { projectsByCategory, allProjects } from "@/data/profile";

// ISR: prerendered HTML (projects + blog posts crawlable), refreshed every 30 min
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Owais Abdullah | Spec-Driven Developer & AI Agent Engineer",
  description:
    "Spec-driven developer and AI engineer specializing in Next.js SaaS products, AI agents, and Digital FTEs (AI employees). Building production-ready web applications with TypeScript, OpenAI Agents SDK, and modern architectures.",
  keywords: [
    "Owais Abdullah Portfolio",
    "Spec-Driven Developer",
    "AI Agent Developer",
    "AI-Driven Development",
    "Next.js SaaS Developer",
    "Full Stack Digital FTE",
    "OpenAI Agents SDK Developer",
    "TypeScript Developer",
    "AI Automation Engineer",
    "SaaS Architect",
    "WordPress Developer",
    "Sanity CMS Developer",
    "Full Stack Developer",
    "React Developer",
    "Python Developer",
  ],
  openGraph: {
    title: "Owais Abdullah | Spec-Driven Developer & AI Agent Engineer",
    description:
      "Spec-driven developer and AI engineer building Next.js SaaS products, AI agents, and Digital FTEs (AI employees). Expert in TypeScript, OpenAI Agents SDK, and production-ready web architectures.",
    url: "https://owaisabdullah.dev",
    siteName: "Owais Abdullah Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/owais-abdullah-og.png",
        width: 1200,
        height: 630,
        alt: "Owais Abdullah - Spec-Driven Developer & AI Agent Engineer",
      },
    ],
  },
  twitter: {
    title: "Owais Abdullah | Spec-Driven Developer & AI Agent Engineer",
    description:
      "Spec-driven developer and AI engineer building Next.js SaaS products, AI agents, and Digital FTEs (AI employees). Expert in TypeScript, OpenAI Agents SDK, and production-ready web architectures.",
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
      <ScatterText />
      <AboutSection />
      <StatsBand />
      <Services />
      <IndustriesStrip />
      <FTEStory />
      <div className="flex flex-wrap w-full mt-10 mb-20 flex-col items-center text-center">
        <p className="text-base text-accent font-medium sm:text-lg">
          Areas of Expertise
        </p>
        <CharRevealHeading
          as="h2"
          className="text-4xl text-foreground font-semibold sm:text-5xl"
          highlightWords={["Stack"]}
        >
          Tech Stack
        </CharRevealHeading>
      </div>
      <SkillSlider />
      <ProjectsTab projectsByCategory={projectsByCategory} allProjects={allProjects} />
      <BlogSection limit={12} showViewAll />
      <Experience />
      <HomeFaq />
      <Contact />
    </>
  );
}
