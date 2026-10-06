import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Experience from "@/components/Experience";
import CharRevealHeading from "@/components/CharRevealHeading";
import StatusDot from "@/components/ui/StatusDot";
import MagneticButton from "@/components/ui/MagneticButton";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";
import JsonLdSchema from "@/components/JsonLdSchema";
import { ArrowRight, Compass, Calendar, Award } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Career Journey & Timeline | Owais Abdullah",
  description:
    "Follow Owais Abdullah's journey from full-stack web developer to AI Agent Architect and Digital FTE creator. Interactive timeline of milestones from 2018 to 2026.",
  keywords: [
    "Owais Abdullah Journey",
    "Developer Career Timeline",
    "AI Agent Architect Experience",
    "Spec-Driven Development Journey",
    "Software Engineer Career",
    "AI Automation Founder",
  ],
  openGraph: {
    title: "Career Journey & Timeline | Owais Abdullah",
    description:
      "Interactive timeline of milestones from 2018 to 2026. From full-stack web development to autonomous AI employees.",
    url: "https://owaisabdullah.dev/journey",
    siteName: "Owais Abdullah Portfolio",
    type: "website",
    images: [
      {
        url: "/assets/owais-abdullah-og.png",
        width: 1200,
        height: 630,
        alt: "Owais Abdullah Career Journey & Timeline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Journey & Timeline | Owais Abdullah",
    description:
      "Interactive timeline of milestones from 2018 to 2026. From full-stack web development to autonomous AI employees.",
    images: ["/assets/owais-abdullah-og.png"],
  },
  alternates: {
    canonical: "https://owaisabdullah.dev/journey",
  },
};

export default function JourneyPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": "https://owaisabdullah.dev/journey#profilepage",
      url: "https://owaisabdullah.dev/journey",
      name: "Career Journey & Timeline of Owais Abdullah",
      description: "Milestones and career progression of AI Agent Architect Owais Abdullah from 2018 to 2026.",
      mainEntity: {
        "@id": "https://owaisabdullah.dev/#person",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://owaisabdullah.dev",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Journey",
          item: "https://owaisabdullah.dev/journey",
        },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="min-h-screen pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 px-5 overflow-hidden">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[70%] h-64 pointer-events-none blur-[80px] opacity-35 dark:opacity-20"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Breadcrumb Navigation */}
            <nav className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <span className="text-teal-600 dark:text-teal-400 font-semibold">Journey</span>
            </nav>

            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide text-muted-foreground border border-border bg-card/60 backdrop-blur-sm">
                <StatusDot size={7} />
                2018 — Present · 8 Years in Software &amp; AI
              </span>
            </div>

            <CharRevealHeading
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-foreground mb-6 tracking-tight"
              highlightWords={["Journey", "Evolution"]}
            >
              The Engineering Journey
            </CharRevealHeading>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              From building responsive web apps with vanilla JavaScript to architecting autonomous Digital FTEs and multi-agent systems with Next.js and Python.
            </p>

            <div className="flex flex-wrap justify-center gap-3.5">
              <MagneticButton>
                <Link
                  href="/projects"
                  className="group inline-flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md"
                >
                  <SplitFlapLabel primary="View Shipped Projects" secondary="Explore 65+ Repos" className="min-w-[9rem]" />
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
              <Link
                href="/about"
                className="group inline-flex items-center justify-center px-6 py-3 text-foreground bg-card hover:bg-teal-500/10 border border-border hover:border-teal-500 rounded-xl font-medium text-xs sm:text-sm transition-colors duration-200"
              >
                <SplitFlapLabel primary="About Philosophy" secondary="Read Bio & Skills" className="min-w-[8.5rem]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="px-4 sm:px-6 max-w-5xl mx-auto border-t border-border/40 pt-12">
          <Experience />
        </section>

        {/* CTA Footer */}
        <section className="mt-20 px-5 text-center">
          <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-3">Want to collaborate?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Let&apos;s build an autonomous AI agent, custom SaaS, or streamline your engineering team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-sm"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
