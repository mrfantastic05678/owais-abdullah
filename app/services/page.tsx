import { Metadata } from "next";
import Link from "next/link";
import JsonLdSchema from "@/components/JsonLdSchema";
import { ArrowRight } from "lucide-react";
import ServicesGrid from "@/components/ServicesGrid";

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

export default function ServicesPage() {
  return (
    <>
      <JsonLdSchema type="services" pageUrl="https://owaisabdullah.dev/services" />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Services
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Transform your business with AI-driven solutions and modern web
              development. From autonomous agents that work 24/7 to scalable
              SaaS products built with spec-driven methodology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#contact">
                <button className="group inline-flex items-center px-8 py-3 text-white bg-gradient-to-br from-blue-900 via-accent to-blue-700 hover:from-blue-950 rounded-full font-medium transition-all">
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="inline-flex items-center px-8 py-3 text-foreground bg-card hover:bg-accent hover:text-white border-2 border-border hover:border-accent rounded-full font-medium transition-all">
                  Contact Me
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-5 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              What I Offer
            </h2>
            <ServicesGrid />
          </div>
        </section>

        {/* Why Choose Me Section */}
        <section className="py-20 px-5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              Why Work With Me
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Spec-Driven Approach
                </h3>
                <p className="text-muted-foreground">
                  Clear specifications before coding means fewer surprises, less
                  rework, and products that match your vision exactly.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  AI-First Development
                </h3>
                <p className="text-muted-foreground">
                  Leverage the latest AI technologies like OpenAI Agents SDK
                  and General Agents for intelligent automation.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Modern Tech Stack
                </h3>
                <p className="text-muted-foreground">
                  Next.js 15, TypeScript, Tailwind CSS, and cutting-edge tools
                  for performant, scalable applications.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Full-Stack Expertise
                </h3>
                <p className="text-muted-foreground">
                  From frontend design to backend architecture, APIs, and
                  deployment—I handle it all.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-5 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              How We Work Together
            </h2>
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description:
                    "We discuss your project, goals, and requirements. I provide technical recommendations and options.",
                },
                {
                  step: "02",
                  title: "Specification",
                  description:
                    "I write detailed specifications for your project. You review and approve before any coding begins.",
                },
                {
                  step: "03",
                  title: "Development",
                  description:
                    "I build your product using modern best practices, with regular updates and opportunities for feedback.",
                },
                {
                  step: "04",
                  title: "Delivery",
                  description:
                    "Your product is deployed, tested, and handed off with documentation and support.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent text-white font-bold text-lg flex items-center justify-center">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let&apos;s discuss how I can help bring your vision to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <button className="group inline-flex items-center px-8 py-3 text-white bg-gradient-to-br from-blue-900 via-accent to-blue-700 hover:from-blue-950 rounded-full font-medium transition-all">
                  Get In Touch
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a
                href="mailto:mrowaisabdullah@gmail.com"
                className="inline-flex items-center px-8 py-3 text-foreground bg-card hover:bg-accent hover:text-white border-2 border-border hover:border-accent rounded-full font-medium transition-all"
              >
                Email Me
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
