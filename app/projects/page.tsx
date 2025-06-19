import React from 'react'
import ProjectsTab from '@/components/ProjectsTab'
import JsonLdSchema from '@/components/JsonLdSchema'
import type { Metadata } from "next";

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore Owais Abdullah's portfolio of projects. AI Agents Developer, Full Stack Developer, and Next.js specialist showcasing innovative web applications, AI integrations, and modern development solutions.",
  keywords: [
    "Owais Abdullah Projects",
    "AI Agents Developer Projects",
    "Full Stack Developer Projects",
    "Next.js Developer Projects",
    "React Developer Projects",
    "Web Developer Projects",
    "AI Developer Projects",
    "Software Developer Projects",
    "Portfolio Projects",
    "Web Applications",
    "AI Integration Projects",
    "Modern Web Development"
  ],
  openGraph: {
    title: "Projects | Owais Abdullah - AI Agents Developer & Full Stack Developer",
    description: "Explore Owais Abdullah's portfolio of projects. AI Agents Developer, Full Stack Developer, and Next.js specialist showcasing innovative web applications, AI integrations, and modern development solutions.",
    url: "https://owaisabdullah.dev/projects",
    images: [
      {
        url: '/assets/Owais Abdullah (2).png',
        width: 1200,
        height: 630,
        alt: 'Projects by Owais Abdullah - AI Agents Developer & Full Stack Developer',
      },
    ],
  },
  twitter: {
    title: "Projects | Owais Abdullah - AI Agents Developer & Full Stack Developer",
    description: "Explore Owais Abdullah's portfolio of projects. AI Agents Developer, Full Stack Developer, and Next.js specialist showcasing innovative web applications, AI integrations, and modern development solutions.",
  },
  alternates: {
    canonical: 'https://owaisabdullah.dev/projects',
  },
};

const projects = () => {
  return (
    <>
      <JsonLdSchema type="projects" pageUrl="https://owaisabdullah.dev/projects" />
      <ProjectsTab />
    </>
  )
}

export default projects