"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  ArrowUpRight,
  Bot, 
  Code2, 
  Workflow, 
  GraduationCap,
  Linkedin, 
  Github, 
  Mail, 
  ChevronDown 
} from "lucide-react";
import { profile } from "@/data/profile";
import TiltCard from "@/components/ui/TiltCard";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

export default function Hero() {
  return (
    <section 
      id="hero" 
      className="relative flex items-center min-h-[85vh] pt-20 sm:pt-24 pb-14 overflow-hidden"
    >
      {/* Background Micro-Dot Lattice & Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(13, 148, 136, 0.3) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />
      <div 
        className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0D9488 0%, transparent 70%)" }}
      />
      <div 
        className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0284C7 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 w-full">
        
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Availability Status Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-teal-500/30 bg-teal-500/10 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              AVAILABLE FOR AI AGENT &amp; NEXT.JS PROJECTS
            </span>
          </div>

          {/* Master Headline: Large, Bold, Immediate 5-second clarity */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.1rem] font-extrabold tracking-tight leading-[1.08] text-foreground">
              I build{" "}
              <span className="text-teal-700 dark:text-teal-400">
                AI agents
              </span>
              <br />
              &amp; production-ready
              <br />
              <span className="text-teal-700 dark:text-teal-400">
                web apps
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg max-w-xl leading-relaxed text-muted-foreground font-normal">
              I design and ship AI agents, SaaS platforms, and intelligent workflow systems with Next.js, TypeScript, Python, and modern AI tooling.
            </p>
          </div>

          {/* Action Buttons: Primary + Secondary */}
          <div className="space-y-4 pt-1">
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="#contact"
                className="px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 shadow-lg shadow-teal-700/20 hover:scale-105 transition-all flex items-center gap-2 group"
              >
                <SplitFlapLabel primary="Start a Project" secondary="Let's Build It" />
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#projects"
                className="px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground bg-white dark:bg-[#081B1E] hover:bg-slate-50 dark:hover:bg-teal-950/40 border border-slate-200/90 dark:border-[#10343A] hover:border-teal-500 shadow-xs transition-all flex items-center gap-2 group"
              >
                <SplitFlapLabel primary="View Projects" secondary="Explore Builds" />
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
              </Link>
            </div>

            {/* Capability Indicators underneath CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" /> AI Agents
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-sans font-bold text-teal-700 dark:text-teal-400">
                ▲ Next.js
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Automation
              </span>
            </div>
          </div>

          {/* Social Connect Matrix */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase">
              Connect:
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={profile.linkedInUrl}
                target="_blank"
                className="w-9 h-9 rounded-xl bg-card border border-border/80 flex items-center justify-center text-muted-foreground hover:text-teal-700 dark:hover:text-teal-300 hover:border-teal-500/50 shadow-xs transition-all"
                title="LinkedIn"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link
                href={profile.githubUrl}
                target="_blank"
                className="w-9 h-9 rounded-xl bg-card border border-border/80 flex items-center justify-center text-muted-foreground hover:text-teal-700 dark:hover:text-teal-300 hover:border-teal-500/50 shadow-xs transition-all"
                title="GitHub"
                aria-label="View repositories on GitHub"
              >
                <Github className="w-4 h-4" />
              </Link>
              <Link
                href={`mailto:${profile.contact.email}`}
                className="w-9 h-9 rounded-xl bg-card border border-border/80 flex items-center justify-center text-muted-foreground hover:text-teal-700 dark:hover:text-teal-300 hover:border-teal-500/50 shadow-xs transition-all"
                title="Email"
                aria-label="Send email"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Profile Portrait Card with Stacked Cards, Neural Links & Neon Shadow */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <TiltCard className="relative w-full max-w-[350px] sm:max-w-[390px] group" maxTilt={10} layerDrift={14}>
            
            {/* Ambient Neon Shadow / Halo - Low Opacity, Gentle Breathe Animation */}
            <div className="absolute -inset-8 sm:-inset-12 rounded-[3rem] bg-gradient-to-tr from-teal-500/20 via-emerald-400/15 to-cyan-400/10 blur-3xl pointer-events-none opacity-30 dark:opacity-40 animate-hero-glow-breathe transition-all duration-500 -z-10" />

            {/* Layered Stacked Cards (Rendered Behind Neural Links at z-0) */}
            <div
              data-tilt-layer
              data-rotate="-4deg"
              style={{ transform: "rotate(-4deg)" }}
              className="absolute -inset-3.5 rounded-3xl bg-teal-500/5 dark:bg-teal-950/20 z-0 border border-teal-500/25 pointer-events-none transition-transform duration-300"
            />
            <div
              data-tilt-layer
              data-rotate="3deg"
              style={{ transform: "rotate(3deg)" }}
              className="absolute -inset-2 rounded-3xl bg-emerald-500/5 dark:bg-emerald-950/20 z-0 border border-emerald-500/25 pointer-events-none transition-transform duration-300"
            />

            {/* Asymmetric Dynamic Neural Constellation (Non-mirrored Organic AI Topology) */}
            <svg
              className="absolute -inset-10 sm:-inset-14 w-[calc(100%+80px)] sm:w-[calc(100%+112px)] h-[calc(100%+80px)] sm:h-[calc(100%+112px)] pointer-events-none z-10 opacity-80 dark:opacity-90 animate-hero-constellation"
              viewBox="0 0 540 540"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="heroNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Left Asymmetric Neural Branch (High-reaching upward & wide angle) */}
              <line x1="38" y1="120" x2="105" y2="70" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="105" y1="70" x2="165" y2="135" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="38" y1="120" x2="65" y2="230" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/35 dark:text-teal-400/45" />
              <line x1="65" y1="230" x2="165" y2="135" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/35 dark:text-teal-400/45" />
              <line x1="65" y1="230" x2="28" y2="310" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="28" y1="310" x2="115" y2="395" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="115" y1="395" x2="175" y2="320" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="65" y1="230" x2="175" y2="320" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/30 dark:text-teal-400/40" />

              {/* Right Asymmetric Neural Branch (Dense lower telemetry & extended lateral reach) */}
              <line x1="375" y1="105" x2="445" y2="165" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="445" y1="165" x2="522" y2="260" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="522" y1="260" x2="465" y2="365" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="465" y1="365" x2="495" y2="445" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/35 dark:text-teal-400/45" />
              <line x1="495" y1="445" x2="410" y2="425" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="410" y1="425" x2="365" y2="340" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/40 dark:text-teal-400/50" />
              <line x1="445" y1="165" x2="365" y2="340" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/30 dark:text-teal-400/40" />
              <line x1="465" y1="365" x2="365" y2="340" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/35 dark:text-teal-400/45" />

              {/* Asymmetric Transversal Bridging Connectors (Dynamic Angled Backbones) */}
              <line x1="165" y1="135" x2="375" y2="105" stroke="currentColor" strokeWidth="1.2" className="text-teal-600/35 dark:text-teal-400/45" />
              <line x1="165" y1="135" x2="375" y2="105" stroke="currentColor" strokeWidth="1.5" className="text-teal-500/50 dark:text-teal-300/60 animate-hero-stream" />
              <line x1="175" y1="320" x2="365" y2="340" stroke="currentColor" strokeWidth="1" className="text-teal-600/25 dark:text-teal-400/35" />
              <line x1="105" y1="70" x2="375" y2="105" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" className="text-teal-600/25 dark:text-teal-400/30" />

              {/* Asymmetric Glowing Vertices with Organic Sizing & Staggered Pulses */}
              {/* Left Asymmetric Nodes */}
              <circle cx="38" cy="120" r="3" fill="#14B8A6" filter="url(#heroNodeGlow)" className="animate-hero-node" style={{ animationDelay: "0.2s" }} />
              <circle cx="105" cy="70" r="4" fill="#14B8A6" filter="url(#heroNodeGlow)" className="animate-hero-node" style={{ animationDelay: "0.8s" }} />
              <circle cx="165" cy="135" r="2.5" fill="#14B8A6" className="animate-hero-node" style={{ animationDelay: "1.4s" }} />
              <circle cx="65" cy="230" r="3.2" fill="#14B8A6" filter="url(#heroNodeGlow)" className="animate-hero-node" style={{ animationDelay: "1.9s" }} />
              <circle cx="28" cy="310" r="2.5" fill="#14B8A6" className="animate-hero-node" style={{ animationDelay: "0.5s" }} />
              <circle cx="115" cy="395" r="3.5" fill="#14B8A6" filter="url(#heroNodeGlow)" className="animate-hero-node" style={{ animationDelay: "1.1s" }} />
              <circle cx="175" cy="320" r="2.8" fill="#14B8A6" className="animate-hero-node" style={{ animationDelay: "2.3s" }} />

              {/* Right Asymmetric Nodes (Distinct Coordinates, Varying Mass) */}
              <circle cx="375" cy="105" r="3.5" fill="#14B8A6" filter="url(#heroNodeGlow)" className="animate-hero-node" style={{ animationDelay: "0.4s" }} />
              <circle cx="445" cy="165" r="2.5" fill="#14B8A6" className="animate-hero-node" style={{ animationDelay: "1.2s" }} />
              <circle cx="522" cy="260" r="4.2" fill="#14B8A6" filter="url(#heroNodeGlow)" className="animate-hero-node" style={{ animationDelay: "0.1s" }} />
              <circle cx="465" cy="365" r="2.8" fill="#14B8A6" className="animate-hero-node" style={{ animationDelay: "1.7s" }} />
              <circle cx="495" cy="445" r="3.2" fill="#14B8A6" filter="url(#heroNodeGlow)" className="animate-hero-node" style={{ animationDelay: "2.1s" }} />
              <circle cx="410" cy="425" r="2.5" fill="#14B8A6" className="animate-hero-node" style={{ animationDelay: "0.9s" }} />
              <circle cx="365" cy="340" r="3" fill="#14B8A6" filter="url(#heroNodeGlow)" className="animate-hero-node" style={{ animationDelay: "1.5s" }} />
            </svg>

            {/* Main Framing Card Backdrop (z-0: Behind Neural Links & Portrait) */}
            <div className="absolute inset-0 rounded-[26px] bg-slate-50 dark:bg-[#081B1E] border border-slate-200/90 dark:border-[#10343A] shadow-xl dark:shadow-[0_0_30px_rgba(20,184,166,0.12)] z-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-2.5 sm:inset-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50" />
            </div>

            {/* Portrait Image (z-20: IN FRONT OF NEURAL LINKS, Cutout with Transparent BG) */}
            <div className="relative z-20 w-full h-[450px] sm:h-[494px] p-2.5 sm:p-3 flex items-end justify-center pointer-events-none">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/assets/owais-abdullah.webp"
                  alt="Owais Abdullah - AI Agent Architect & Web Application Engineer"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Neural Floating Badge Left (AI Bot Node - IN FRONT at z-30, Balanced at top-[36%]) */}
            <div className="absolute top-[36%] -left-5 sm:-left-7 z-30 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#081B1E]/95 border border-teal-500/30 shadow-lg shadow-teal-500/15 text-teal-600 dark:text-teal-400 backdrop-blur-sm animate-hero-float-left hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>

            {/* Neural Floating Badge Right (Code Node </> - IN FRONT at z-30, Balanced at top-[36%]) */}
            <div className="absolute top-[36%] -right-5 sm:-right-7 z-30 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#081B1E]/95 border border-teal-500/30 shadow-lg shadow-teal-500/15 text-teal-600 dark:text-teal-400 backdrop-blur-sm animate-hero-float-right hover:scale-110 transition-transform">
              <span className="font-mono font-bold text-xs sm:text-sm tracking-tighter">&lt;/&gt;</span>
            </div>

            {/* Floating Status Badge Top Right (IN FRONT at z-30) */}
            <div className="absolute -top-3.5 right-2 sm:right-4 z-30 px-3.5 py-1.5 rounded-full border bg-white/95 dark:bg-[#081B1E]/95 backdrop-blur-md shadow-lg shadow-emerald-500/10 border-teal-500/30 flex items-center gap-2 pointer-events-none animate-hero-float-top">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-teal-800 dark:text-teal-300 tracking-wider">
                AVAILABLE FOR PROJECTS
              </span>
            </div>

            {/* Floating Role Badge Bottom Left (IN FRONT at z-30, Positioned on Left Side) */}
            <div className="absolute bottom-6 -left-2 sm:-left-5 z-30 px-3.5 py-1.5 rounded-full border bg-white/95 dark:bg-[#081B1E]/95 backdrop-blur-md shadow-lg shadow-teal-500/15 border-teal-500/30 flex items-center gap-2 pointer-events-none animate-hero-float-bottom hover:scale-105 transition-transform">
              <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="text-[10px] font-mono font-bold text-teal-800 dark:text-teal-300 tracking-wider">
                AI AGENT ARCHITECT
              </span>
            </div>

          </TiltCard>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-muted-foreground hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Explore</span>
        <ChevronDown className="w-4 h-4 motion-safe:animate-bounce" />
      </a>

    </section>
  );
}
