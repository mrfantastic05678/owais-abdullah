"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Terminal, Sparkles } from "lucide-react";
import AboutSection from "@/components/AboutSection";
import Skill from "@/components/Skill";
import StatusDot from "@/components/ui/StatusDot";
import MagneticButton from "@/components/ui/MagneticButton";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";
import CharRevealHeading from "@/components/CharRevealHeading";

const AboutPageContent = () => {
  return (
    <div className="pt-24 pb-20">
      {/* Personal Bio Hero */}
      <section className="relative px-5 max-w-5xl mx-auto pt-6 pb-12">
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[70%] h-64 pointer-events-none blur-[90px] opacity-35 dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-teal-600 dark:text-teal-400 font-semibold">About</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Avatar / Portrait Column */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-teal-500/25 to-emerald-400/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border border-teal-500/30 dark:border-[#10343A] bg-[#031518] shadow-2xl">
                <Image
                  src="/assets/owais-abdullah.webp"
                  alt="Owais Abdullah - AI Agent Architect & Spec-Driven Developer"
                  fill
                  sizes="(max-width: 768px) 240px, 260px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="absolute -bottom-3 -right-3 px-3 py-1 rounded-full bg-white dark:bg-[#081B1E] border border-teal-500/30 shadow-md flex items-center gap-1.5 text-[11px] font-mono font-semibold text-teal-700 dark:text-teal-300">
                <StatusDot size={6} />
                <span>Available</span>
              </div>
            </div>
          </div>

          {/* Bio Story Column */}
          <div className="lg:col-span-8 space-y-5 text-left">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300">
                <Terminal className="w-3.5 h-3.5" />
                <span>ABOUT OWAIS ABDULLAH</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-muted-foreground border border-border">
                <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>Pakistan 🇵🇰 · Worldwide Clients</span>
              </span>
            </div>

            <CharRevealHeading
              as="h1"
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-foreground tracking-tight"
              highlightWords={["Owais", "Architect"]}
            >
              Engineering Autonomous Systems.
            </CharRevealHeading>

            {/* The Short Bio Paragraph */}
            <p className="text-base sm:text-lg text-foreground/90 leading-relaxed font-normal">
              I&apos;m a spec-driven developer, AI agent engineer, and the founder of{" "}
              <Link href="https://octively.com" target="_blank" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                Octively
              </Link>
              . Over the past 8 years in tech, I&apos;ve designed and delivered 65+ web platforms, SaaS products, and intelligent automations. Today, I build production-ready <strong className="font-semibold text-foreground">Digital FTEs (autonomous AI employees)</strong> using Next.js, Python, Claude Code, and the OpenAI Agents SDK. Every engagement begins with a deterministic technical brief—delivering clean architecture, zero guesswork, and predictable results for modern founders.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <MagneticButton>
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md"
                >
                  <SplitFlapLabel primary="Work With Me" secondary="Send Spec Brief" className="min-w-[7.5rem]" />
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
              <Link
                href="/journey"
                className="group inline-flex items-center justify-center px-6 py-3 text-foreground bg-card hover:bg-teal-500/10 border border-border hover:border-teal-500 rounded-xl font-medium text-xs sm:text-sm transition-colors duration-200"
              >
                <SplitFlapLabel primary="Career Journey" secondary="Explore Timeline" className="min-w-[8rem]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Philosophy Pillars & Matrix */}
      <AboutSection />

      {/* Skills Matrix */}
      <div className="border-t border-border/40 pt-16">
        <Skill />
      </div>

      {/* Bottom CTA Card */}
      <section className="mt-20 px-5 max-w-4xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-3xl border border-teal-500/35 bg-gradient-to-br from-[#062429] via-[#031518] to-[#01090B] p-8 sm:p-12 shadow-2xl text-white">
          <div className="absolute top-0 right-1/4 w-60 h-60 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-teal-500/15 border border-teal-500/30 text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>START A COLLABORATION</span>
            </span>

            <CharRevealHeading
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-white tracking-tight"
              highlightWords={["Autonomous", "Future"]}
            >
              Ready to Build Your Autonomous Systems?
            </CharRevealHeading>

            <p className="text-sm sm:text-base text-teal-100/80 leading-relaxed font-sans max-w-xl mx-auto pt-1">
              Whether you need to deploy an autonomous Digital FTE, build a production Next.js SaaS, or automate business pipelines with zero friction—let&apos;s turn your vision into shipped code.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <MagneticButton>
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center px-7 py-3.5 text-[#021316] bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 hover:brightness-110 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-teal-500/30"
                >
                  <SplitFlapLabel primary="Start a Project" secondary="Book Spec Call" className="min-w-[7.5rem]" />
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
              <Link
                href="/services"
                className="group inline-flex items-center justify-center px-6 py-3.5 text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl font-semibold text-xs sm:text-sm transition-colors duration-200"
              >
                <SplitFlapLabel primary="Explore Services" secondary="View All 6" className="min-w-[8rem]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPageContent;
