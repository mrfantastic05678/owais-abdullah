import React from "react";
import About from "@/components/About";
import Skill from "@/components/Skill";
import Projects from "@/components/Projects";
import JsonLdSchema from "@/components/JsonLdSchema";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About Owais Abdullah | Spec-Driven Developer & AI Engineer",
  description:
    "Learn about Owais Abdullah, a spec-driven developer and AI engineer specializing in Next.js SaaS products, AI agents, and full-time digital solutions. Discover my expertise in OpenAI Agents SDK and production-ready architectures.",
  authors: [{ name: "Owais Abdullah", url: "https://owaisabdullah.dev" }],
  keywords: [
    "About Owais Abdullah",
    "Spec-Driven Developer",
    "AI Agent Engineer",
    "AI-Driven Development",
    "Next.js SaaS Developer",
    "Full Stack Digital FTE",
    "OpenAI Agents SDK",
    "TypeScript Developer",
    "SaaS Architect",
    "AI Automation Engineer",
    "Professional Background",
    "Developer Portfolio",
  ],
  openGraph: {
    title: "About Owais Abdullah | Spec-Driven Developer & AI Engineer",
    description:
      "Discover Owais Abdullah's journey as a spec-driven developer and AI engineer. Expert in Next.js SaaS products, AI agents, OpenAI Agents SDK, and building production-ready architectures.",
    url: "https://owaisabdullah.dev/about",
    siteName: "Owais Abdullah Portfolio",
    type: "website",
    images: [
      {
        url: "/assets/Owais Abdullah (2).png",
        width: 1200,
        height: 630,
        alt: "About Owais Abdullah - Spec-Driven Developer & AI Engineer",
      },
    ],
  },
  twitter: {
    title: "About Owais Abdullah | Spec-Driven Developer & AI Engineer",
    description:
      "Discover Owais Abdullah's journey as a spec-driven developer and AI engineer. Expert in Next.js SaaS products, AI agents, OpenAI Agents SDK, and building production-ready architectures.",
    card: "summary_large_image",
    images: ["/assets/Owais Abdullah (2).png"],
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
