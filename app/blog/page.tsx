import React from "react";
import BlogSection from "@/components/BlogSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Owais Abdullah - Spec-Driven Development & AI Insights",
  description:
    "Get the latest insights on spec-driven development, AI agents, SaaS architecture, and Next.js best practices. Sharing practical tips on AI-driven engineering and production-ready web development.",
  keywords: [
    "Owais Abdullah Blog",
    "Spec-Driven Development Blog",
    "AI Agent Development Blog",
    "AI-Driven Engineering Blog",
    "Next.js SaaS Blog",
    "OpenAI Agents SDK Blog",
    "TypeScript Development Blog",
    "SaaS Architecture Blog",
    "AI Automation Blog",
    "Full Stack Development Blog",
    "Technology Tips",
    "AI Tools",
    "Web Development Best Practices",
  ],
  openGraph: {
    title: "Blog | Owais Abdullah - Spec-Driven Developer & AI Engineer",
    description:
      "Get the latest insights on spec-driven development, AI agents, SaaS architecture, and Next.js best practices. Sharing practical tips on AI-driven engineering and production-ready web development.",
    url: "https://owaisabdullah.dev/blog",
    siteName: "Owais Abdullah Portfolio",
    type: "website",
    images: [
      {
        url: "/assets/Owais Abdullah (2).png",
        width: 1200,
        height: 630,
        alt: "Blog by Owais Abdullah - Spec-Driven Developer & AI Engineer",
      },
    ],
  },
  twitter: {
    title: "Blog | Owais Abdullah - Spec-Driven Developer & AI Engineer",
    description:
      "Get the latest insights on spec-driven development, AI agents, SaaS architecture, and Next.js best practices. Sharing practical tips on AI-driven engineering and production-ready web development.",
    card: "summary_large_image",
    images: ["/assets/Owais Abdullah (2).png"],
  },
  alternates: {
    canonical: "https://owaisabdullah.dev/blog",
  },
};

const page = () => {
  return (
    <div className="min-h-screen mt-2 mb-20 ">
      <BlogSection />
    </div>
  );
};

export default page;
