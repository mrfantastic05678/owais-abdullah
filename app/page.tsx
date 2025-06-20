import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import ProjectsTab from "@/components/ProjectsTab";
import JsonLdSchema from "@/components/JsonLdSchema";
import type { Metadata } from "next";
import SkillSlider from "@/components/SkillSlider";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Owais Abdullah | AI Agents Developer & Full Stack Developer",
  description:
    "Explore projects, skills, and experience in AI Agents Development, Full Stack Development, and modern web technologies.",
  keywords: [
    "Owais Abdullah Portfolio",
    "AI Agents Developer Portfolio",
    "Full Stack Developer Portfolio",
    "Next.js Developer Portfolio",
    "React Developer Portfolio",
    "Web Developer Portfolio",
    "AI Developer Portfolio",
    "Software Developer Portfolio",
    "Open AI Agents SDK Developer Portfolio",
    "Sanity CMS Developer",
  ],
  openGraph: {
    title: "Owais Abdullah | AI Agents & Full Stack Developer",
    description:
      "Welcome to Owais Abdullah's portfolio. AI Agents Developer, Full Stack Developer, and Next.js specialist. Explore my projects, skills, and experience in modern web development and AI integration.",
    url: "https://owaisabdullah.dev",
    images: [
      {
        url: "/assets/Owais Abdullah (2).png",
        width: 1200,
        height: 630,
        alt: "Owais Abdullah - AI Agents & Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    title: "Owais Abdullah | AI Agents & Full Stack Developer",
    description:
      "Welcome to Owais Abdullah's portfolio. AI Agents Developer, Full Stack Developer, and Next.js specialist. Explore my projects, skills, and experience in modern web development and AI integration.",
  },
  alternates: {
    canonical: "https://owaisabdullah.dev/",
  },
};

export default function Home() {
  return (
    <>
      <JsonLdSchema type="home" pageUrl="https://owaisabdullah.dev" />
      <Hero />
      <About />
      <div className="flex flex-wrap w-full mt-10 mb-20 flex-col items-center text-center">
        <h3 className="text-base text-accent font-medium sm:text-lg">
          Areas of Expertise
        </h3>
        <h2 className="text-5xl text-text font-semibold sm:text-6xl">
          Tech Stack
        </h2>
      </div>
      <SkillSlider />
      <ProjectsTab />
      <Experience />
      <Contact />
    </>
  );
}
