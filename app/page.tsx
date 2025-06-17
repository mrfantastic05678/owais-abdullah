import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import ProjectsTab from "@/components/ProjectsTab";
import Skill from "@/components/Skill";
import JsonLdSchema from "@/components/JsonLdSchema";
import type { Metadata } from "next";

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Owais Abdullah's portfolio. AI Agents Developer, Full Stack Developer, and Next.js specialist. Explore my projects, skills, and experience in modern web development and AI integration.",
  keywords: [
    "Owais Abdullah Portfolio",
    "AI Agents Developer Portfolio",
    "Full Stack Developer Portfolio",
    "Next.js Developer Portfolio",
    "React Developer Portfolio",
    "Web Developer Portfolio",
    "AI Developer Portfolio",
    "Software Developer Portfolio"
  ],
  openGraph: {
    title: "Owais Abdullah | AI Agents Developer & Full Stack Developer",
    description: "Welcome to Owais Abdullah's portfolio. AI Agents Developer, Full Stack Developer, and Next.js specialist. Explore my projects, skills, and experience in modern web development and AI integration.",
    url: "https://owaisabdullah.dev",
    images: [
      {
        url: '/assets/Owais Abdullah (2).png',
        width: 1200,
        height: 630,
        alt: 'Owais Abdullah - AI Agents Developer & Full Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    title: "Owais Abdullah | AI Agents Developer & Full Stack Developer",
    description: "Welcome to Owais Abdullah's portfolio. AI Agents Developer, Full Stack Developer, and Next.js specialist. Explore my projects, skills, and experience in modern web development and AI integration.",
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <JsonLdSchema type="home" pageUrl="https://owaisabdullah.dev" />
      <Hero />  
      <About />
      <Skill />
      <ProjectsTab />
      <Experience />
      <Contact />
    </>
  );
}
