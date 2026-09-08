import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  showcaseProjects,
  getShowcaseProject,
  getAllShowcaseSlugs
} from "@/data/showcaseProjects";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaCode, FaRocket, FaShieldAlt } from "react-icons/fa";
import PixelTextButton from "@/components/ui/PixelTextButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = getAllShowcaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getShowcaseProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | Owais Abdullah",
      description: "The requested project could not be found."
    };
  }

  const title = `${project.title} — ${project.tagline} | Owais Abdullah`;
  const description = `${project.description.slice(0, 155)}... Free alternative to ${project.alternativeTo.slice(0, 3).join(", ")}.`;

  return {
    title,
    description,
    keywords: [
      ...project.keywords,
      "Owais Abdullah",
      "Digital FTE",
      "AI Employee",
      "Open Source Alternative",
      "Free Alternative"
    ],
    authors: [{ name: "Owais Abdullah", url: "https://owaisabdullah.dev" }],
    openGraph: {
      title,
      description,
      url: `https://owaisabdullah.dev/projects/${project.slug}`,
      siteName: "Owais Abdullah Portfolio",
      type: "article",
      images: [
        {
          url: project.image || "/assets/owais-abdullah-og.png",
          width: 1200,
          height: 630,
          alt: project.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.image || "/assets/owais-abdullah-og.png"]
    },
    alternates: {
      canonical: `https://owaisabdullah.dev/projects/${project.slug}`
    }
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getShowcaseProject(slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    headline: project.tagline,
    description: project.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    author: {
      "@type": "Person",
      name: "Owais Abdullah",
      url: "https://owaisabdullah.dev"
    },
    codeRepository: project.githubUrl,
    keywords: project.keywords.join(", ")
  };

  return (
    <article className="max-w-5xl mx-auto px-5 py-24 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{project.title}</span>
      </nav>

      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors mb-6 group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to all projects
      </Link>

      {/* Hero Header */}
      <header className="border border-border/80 bg-card/60 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-xl mb-12">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-accent/10 border border-accent/30 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {project.category}
          </span>
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
            Free for Personal Use
          </span>
          <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
            Attribution Required
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
          {project.title}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
          {project.tagline}
        </p>

        {/* Alternative To Pill Strip */}
        {project.alternativeTo && project.alternativeTo.length > 0 && (
          <div className="bg-muted/40 border border-border/60 rounded-xl p-4 mb-6">
            <p className="text-xs uppercase tracking-wider font-semibold text-accent mb-2">
              Free &amp; Open Architecture Alternative To:
            </p>
            <div className="flex flex-wrap gap-2">
              {project.alternativeTo.map((alt, i) => (
                <span
                  key={i}
                  className="bg-card border border-border text-foreground text-xs font-medium px-2.5 py-1 rounded-md"
                >
                  ⚡ {alt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background font-medium px-5 py-2.5 rounded-lg hover:bg-foreground/90 transition-all shadow-md text-sm"
            >
              <FaGithub className="w-4 h-4" />
              View Source on GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-accent text-accent font-medium px-5 py-2.5 rounded-lg hover:bg-accent/10 transition-all text-sm"
            >
              <FaExternalLinkAlt className="w-3.5 h-3.5" />
              Launch Live App
            </a>
          )}
          <a
            href="#setup"
            className="text-muted-foreground hover:text-foreground text-sm font-medium px-3 py-2 transition-colors"
          >
            How to Setup ↓
          </a>
        </div>
      </header>

      {/* Cost & Savings Comparison Card */}
      {project.pricingComparison && (
        <section className="mb-12 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-emerald-500">💰</span> Value &amp; Cost Savings Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-card/70 border border-border/70 rounded-xl p-4">
              <p className="text-muted-foreground text-xs uppercase font-medium mb-1">Traditional Industry Solution</p>
              <p className="font-semibold text-foreground text-base mb-1">{project.pricingComparison.traditionalTool}</p>
              <p className="text-red-500 font-mono font-medium">{project.pricingComparison.traditionalCost}</p>
            </div>
            <div className="bg-card/70 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-emerald-600 dark:text-emerald-400 text-xs uppercase font-medium mb-1">This Project (By Owais Abdullah)</p>
              <p className="font-semibold text-foreground text-base mb-1">{project.pricingComparison.thisProjectCost}</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{project.pricingComparison.savings}</p>
            </div>
          </div>
        </section>
      )}

      {/* Pain Points Solved Section */}
      <section className="mb-14">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span>🎯</span> Pain Points Solved
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Why this project was built and the operational friction it eliminates:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {project.painPoints.map((item, idx) => (
            <div
              key={idx}
              className="border border-border/80 bg-card/60 rounded-xl p-5 shadow-sm hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start gap-2.5 mb-3">
                <FaExclamationTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-semibold text-amber-600 dark:text-amber-400 tracking-wider">The Problem</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.problem}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-3 border-t border-border/40">
                <FaCheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider">The Solution</p>
                  <p className="text-sm text-foreground font-medium mt-1">{item.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features */}
      <section className="mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span>⚡</span> Core Capabilities &amp; Architecture
        </h2>
        <div className="border border-border/80 bg-card/40 rounded-2xl p-6 sm:p-8 mb-6">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
            {project.architectureOverview}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {project.keyFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-accent font-bold mt-0.5">✔</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Built With:</span>
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="bg-muted text-muted-foreground font-mono text-xs px-2.5 py-1 rounded-md border border-border/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Step-by-Step Setup Guide */}
      <section id="setup" className="mb-14 scroll-mt-20">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span>🛠️</span> How to Setup &amp; Run Locally
          </h2>
          <p className="text-muted-foreground text-sm">
            Quick-start guide to clone, configure, and execute this project in your own environment:
          </p>
        </div>

        <div className="border border-border/80 bg-card/60 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Prerequisites */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <FaCode className="w-4 h-4 text-accent" /> Prerequisites
            </h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
              {project.setupGuide.prerequisites.map((pre, i) => (
                <li key={i}>{pre}</li>
              ))}
            </ul>
          </div>

          {/* Environment Variables Table if present */}
          {project.setupGuide.envVars && project.setupGuide.envVars.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <h3 className="text-base font-semibold text-foreground mb-3">Key Environment Variables</h3>
              <table className="w-full text-left text-xs border border-border rounded-lg overflow-hidden">
                <thead className="bg-muted text-muted-foreground uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">Variable</th>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {project.setupGuide.envVars.map((v, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="p-2.5 font-mono text-accent font-semibold">{v.key}</td>
                      <td className="p-2.5 text-muted-foreground">{v.description}</td>
                      <td className="p-2.5 font-mono text-foreground/80">{v.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">Execution Steps</h3>
            {project.setupGuide.steps.map((s, idx) => (
              <div key={idx} className="bg-background/80 border border-border/60 rounded-xl p-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  <span className="text-accent font-bold mr-2">{idx + 1}.</span>
                  {s.step}
                </p>
                {s.command && (
                  <pre className="bg-muted/60 border border-border/40 p-3 rounded-lg overflow-x-auto text-xs font-mono text-foreground mb-2">
                    <code>{s.command}</code>
                  </pre>
                )}
                {s.note && <p className="text-xs text-muted-foreground italic pl-1">{s.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="mb-14">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span>🗺️</span> Project Roadmap &amp; Planned Improvements
          </h2>
          <p className="text-muted-foreground text-sm">
            Current release progress and planned future enhancements:
          </p>
        </div>

        <div className="space-y-3.5">
          {project.roadmap.map((item, idx) => {
            const statusConfig = {
              completed: { badge: "Completed", class: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
              "in-progress": { badge: "In Progress", class: "bg-amber-500/10 text-amber-500 border-amber-500/30" },
              planned: { badge: "Planned", class: "bg-muted text-muted-foreground border-border/60" }
            }[item.status];

            return (
              <div
                key={idx}
                className="border border-border/70 bg-card/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{item.milestone}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-medium self-start sm:self-center shrink-0 ${statusConfig.class}`}>
                  {statusConfig.badge}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* License & Attribution Notice Box */}
      <section className="mb-14 border border-border/80 bg-muted/20 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <FaShieldAlt className="text-accent" /> License, Fair Use &amp; Attribution Terms
        </h2>
        <p className="text-xs text-accent font-semibold mb-2">{project.licenseType}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {project.licenseDetails}
        </p>
        <div className="bg-card border border-border/60 rounded-xl p-3 text-xs text-foreground/90 font-mono">
          Required Attribution Notice: &quot;Built by Owais Abdullah (https://github.com/MrOwaisAbdullah)&quot;
        </div>
      </section>

      {/* Call to Action: Hire / Collaborate */}
      <footer className="border border-accent/30 bg-accent/5 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Need a Custom AI Employee or Production Implementation?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6">
          I design and deploy custom Digital FTEs, multi-agent pipelines, and spec-driven SaaS architectures tailored for agencies, e-commerce brands, and startups.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors text-sm shadow-md"
          >
            Hire Owais for Your Project →
          </Link>
          <Link
            href="/services/digital-fte"
            className="border border-border bg-card text-foreground font-medium px-6 py-3 rounded-lg hover:bg-muted transition-colors text-sm"
          >
            Explore Digital FTE Services
          </Link>
        </div>
      </footer>
    </article>
  );
}
