import React from "react";
import About from "@/components/About";
import Skill from "@/components/Skill";
import Projects from "@/components/Projects";
import JsonLdSchema from "@/components/JsonLdSchema";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About Owais Abdullah",
  description:
    "Learn more about Owais Abdullah, his background, expertise in AI Agents Development, Full Stack Development, and passion for modern web technologies.",
  authors: [{ name: "Owais Abdullah" }],
  keywords: [
    "About Owais Abdullah",
    "Owais Abdullah Background",
    "AI Agents Developer About",
    "Full Stack Developer About",
    "Next.js Developer About",
    "React Developer About",
    "Web Developer About",
    "AI Developer About",
    "Software Developer About",
    "Developer Experience",
    "Professional Background",
  ],
  openGraph: {
    title: "About Owais Abdullah | AI Agents Developer & Full Stack Developer",
    description:
      "Learn more about Owais Abdullah - AI Agents Developer, Full Stack Developer, and Next.js specialist. Discover my background, expertise, and passion for AI integration and modern web development.",
    url: "https://owaisabdullah.dev/about",
    images: [
      {
        url: "/assets/Owais Abdullah (2).png",
        width: 1200,
        height: 630,
        alt: "About Owais Abdullah - AI Agents Developer & Full Stack Developer",
      },
    ],
  },
  twitter: {
    title: "About Owais Abdullah | AI Agents Developer & Full Stack Developer",
    description:
      "Learn more about Owais Abdullah - AI Agents Developer, Full Stack Developer, and Next.js specialist. Discover my background, expertise, and passion for AI integration and modern web development.",
  },
  alternates: {
    canonical: "https://owaisabdullah.dev/about",
  },
};

const about = () => {
  return (
    <>
      <JsonLdSchema type="about" pageUrl="https://owaisabdullah.dev/about" />
      <About />
      <Projects />
      <div className="flex flex-wrap w-full mt-10 mb-20 flex-col items-center text-center">
        <h3 className="text-base text-accent font-medium sm:text-lg">
          Areas of Expertise
        </h3>
        <h2 className="text-5xl text-foreground font-semibold sm:text-6xl">
          My Skills
        </h2>
      </div>
      <Skill />
    </>
  );
};

export default about;
