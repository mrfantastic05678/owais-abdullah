import { Metadata } from "next";
import Link from "next/link";
import JsonLdSchema from "@/components/JsonLdSchema";
import { ArrowRight } from "lucide-react";
import ServicesGrid from "@/components/ServicesGrid";
import ProcessSteps from "@/components/ProcessSteps";
import CharRevealHeading from "@/components/CharRevealHeading";
import StatusDot from "@/components/ui/StatusDot";
import MagneticButton from "@/components/ui/MagneticButton";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

export const metadata: Metadata = {
  title: "Services | Owais Abdullah - Spec-Driven Developer & AI Engineer",
  description:
    "Explore services offered by Owais Abdullah: Digital FTE Development, AI Agents & Automations, Next.js SaaS Development, CMS & E-commerce, Technical Consulting, and API Development.",
  keywords: [
    "Digital FTE Development",
    "AI Employee Development",
    "AI Agents Development",
    "OpenAI Agents SDK",
    "n8n Automation",
    "Next.js SaaS Development",
    "Spec-Driven Development",
    "WordPress Development",
    "Shopify Development",
    "Headless CMS",
    "Sanity CMS",
    "Technical Consulting",
    "MVP Development",
    "API Development",
    "GraphQL API",
    "REST API",
    "Webhooks",
    "AI Strategy",
    "Startup CTO",
  ],
  openGraph: {
    title: "Services | Owais Abdullah - Spec-Driven Developer & AI Engineer",
    description:
      "Explore services offered by Owais Abdullah: Digital FTE Development, AI Agents & Automations, Next.js SaaS Development, CMS & E-commerce, Technical Consulting, and API Development.",
    url: "https://owaisabdullah.dev/services",
    siteName: "Owais Abdullah Portfolio",
    type: "website",
  },
  alternates: {
    canonical: "https://owaisabdullah.dev/services",
  },
};

const WHY_WORK_WITH_ME = [
  {
    num: "01",
    title: "Spec-Driven Approach",
    desc: "Clear specifications before coding means fewer surprises, less rework, and a product that matches your brief.",
  },
  {
    num: "02",
    title: "AI-First Development",
    desc: "The OpenAI Agents SDK and modern automation tooling, applied where they actually save your team time.",
  },
  {
    num: "03",
    title: "Modern Tech Stack",
    desc: "Next.js, TypeScript, and Tailwind CSS — built for performance and easy to hand off to another engineer.",
  },
  {
    num: "04",
    title: "Full-Stack Expertise",
    desc: "Frontend, backend, APIs, and deployment — one person who understands the whole system, not just their slice.",
  },
];

const ENGAGEMENT_STEPS = [
  { num: "01", title: "Discovery", desc: "We discuss your project, goals, and constraints. I give you honest technical options, not a sales pitch." },
  { num: "02", title: "Specification", desc: "A written spec for your project. You review and approve it before any code exists." },
  { num: "03", title: "Development", desc: "Built against that spec, with regular check-ins so nothing drifts silently." },
  { num: "04", title: "Delivery", desc: "Deployed, tested, and handed off with documentation — so your team isn't locked to me." },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLdSchema type="services" pageUrl="https://owaisabdullah.dev/services" />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 px-5 overflow-hidden">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[70%] h-64 pointer-events-none blur-[80px] opacity-40 dark:opacity-25"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent) 0%, transparent 70%)" }}
          ></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide text-muted-foreground border border-border mb-6">
              <StatusDot size={7} />
              Available for AI Agent &amp; SaaS projects
            </span>

            <CharRevealHeading
              as="h1"
              className="text-4xl md:text-5xl font-heading font-semibold text-foreground mb-6"
              highlightWords={["Services"]}
            >
              Services
            </CharRevealHeading>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Digital FTEs, AI agent systems, and Next.js SaaS products — built spec-first,
              so you know what you&apos;re getting before a line of code exists.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Link
                  href="#contact"
                  className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 rounded-md font-medium transition-all shadow-md"
                >
                  <SplitFlapLabel primary="Start a project" secondary="Let's Build It" className="min-w-[8rem]" />
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-foreground bg-card hover:bg-teal-500/10 border border-border hover:border-teal-500 rounded-md font-medium transition-colors duration-200 min-w-[9.5rem]"
              >
                <SplitFlapLabel primary="Contact Me" secondary="Send Spec Brief" className="min-w-[7.5rem]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-5 border-t border-border/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-mono text-xs tracking-widest uppercase mb-2 block">What I offer</span>
              <CharRevealHeading as="h2" className="text-3xl md:text-4xl font-semibold text-foreground" highlightWords={["Offer"]}>
                Every Engagement, Broken Down
              </CharRevealHeading>
            </div>
            <ServicesGrid />
          </div>
        </section>

        {/* Why Work With Me */}
        <section className="py-20 px-5 border-t border-border/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-mono text-xs tracking-widest uppercase mb-2 block">Why work with me</span>
              <CharRevealHeading as="h2" className="text-3xl md:text-4xl font-semibold text-foreground" highlightWords={["Different"]}>
                What&apos;s Different
              </CharRevealHeading>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {WHY_WORK_WITH_ME.map(({ num, title, desc }) => (
                <div
                  key={title}
                  className="p-7 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] hover:border-teal-500/50 hover:shadow-lg transition-all duration-300 shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                        {num}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Engagement process */}
        <ProcessSteps
          eyebrow="How we work together"
          heading="From Spec to Shipped"
          headingHighlight={["Shipped"]}
          description="The same four steps for every engagement, so you always know what's next."
          steps={ENGAGEMENT_STEPS}
        />

        {/* CTA */}
        <section id="contact" className="py-24 px-5 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <CharRevealHeading as="h2" className="text-3xl md:text-4xl font-semibold text-foreground mb-4" highlightWords={["Project"]}>
              Ready to Start Your Project?
            </CharRevealHeading>
            <p className="text-muted-foreground text-lg mb-8">
              Let&apos;s talk about what you&apos;re building.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 rounded-md font-medium transition-all shadow-md"
                >
                  <SplitFlapLabel primary="Get In Touch" secondary="Book Spec Call" className="min-w-[7.5rem]" />
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
              <a
                href="mailto:mrowaisabdullah@gmail.com"
                className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-foreground bg-card hover:bg-teal-500/10 border border-border hover:border-teal-500 rounded-md font-medium transition-colors duration-200 min-w-[10rem]"
              >
                <SplitFlapLabel primary="Email Me" secondary="Send Direct Msg" className="min-w-[8rem]" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
