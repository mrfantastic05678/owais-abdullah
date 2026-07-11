"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { RiNextjsLine, RiWordpressLine } from "react-icons/ri";
import { TbBrandTypescript, TbBrandPython } from "react-icons/tb";
import { Github, Linkedin, Mail } from "lucide-react";
import dynamic from "next/dynamic";
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip";
import HeroFluid from "@/components/HeroFluid";
import AskAIButton from "@/components/ui/AskAIButton";
import MagneticButton from "@/components/ui/MagneticButton";
import StatusDot from "@/components/ui/StatusDot";
import TiltCard from "@/components/ui/TiltCard";

const Typewriter = dynamic(
  () => import("nextjs-simple-typewriter").then((mod) => mod.Typewriter),
  {
    ssr: false,
    loading: () => <span>AI Agent Developer</span>,
  }
);

const tileClass =
  "shadow-sm hover:scale-110 shadow-slate-700/20 rounded-lg bg-card p-3 text-2xl text-foreground hover:bg-muted border border-border transition-transform";

const Hero = () => {
  return (
    <section id="hero" className="relative flex items-center min-h-[100vh] -mt-24 pt-[150px] pb-[60px] bg-background overflow-hidden">
      {/* WebGL fluid trail — desktop, motion-allowed, post-idle only */}
      <HeroFluid />

      <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center relative z-10">
        <div className="flex flex-col items-start text-left mb-16 lg:mb-0">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide text-muted-foreground border border-border">
              <StatusDot size={8} />
              Available for AI Agent & SaaS projects
            </span>
          </div>

          <h1 className="text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[1.08] mb-6 font-heading font-semibold text-foreground">
            Hi, I&apos;m{" "}
            <span className="text-highlight">Owais Abdullah</span>
            <br />
            {/* Reserves 2 lines at the h1's line-height so the longest
                rotating phrase (which wraps) never shifts content below */}
            <span className="block min-h-[2.16em]">
              <Typewriter
                words={[
                  "a Spec-Driven Developer.",
                  "an AI Agent Developer.",
                  "an AI-Driven Engineer.",
                  "a Next.js & SaaS Architect.",
                  "a Full Stack Digital FTE.",
                  "a TypeScript Specialist.",
                  "a WordPress & CMS Expert.",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
          </h1>
          <p className="mb-8 leading-[1.6] text-[clamp(1rem,2vw,1.1rem)] text-muted-foreground max-w-[48ch]">
            I build production-ready web applications and AI agents using{" "}
            <span className="text-accent font-semibold">spec-driven development</span> — Next.js SaaS
            products, Digital FTEs, and automation. Founder of Octively.
          </p>

          <div className="flex gap-4 flex-wrap">
            <MagneticButton>
              <Link
                href="#contact"
                className="group flex items-center text-accent-foreground bg-accent hover:bg-accent-hover py-3 rounded-md font-medium text-[0.95rem] px-6 transition-colors duration-200"
              >
                Start a project <FaChevronRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>
            <Link
              href="#story"
              className="btn-progress-drain group flex items-center text-foreground bg-transparent border border-border hover:border-transparent py-3 rounded-md font-medium text-[0.95rem] px-6 transition-colors duration-200"
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <rect x="1" y="1" width="98" height="98" rx="4" />
              </svg>
              How a Digital FTE works
            </Link>
          </div>

          <AskAIButton />

          <div className="flex flex-col lg:flex-row gap-4 items-start mt-6">
            <div>
              <p className="mb-2 font-bold font-mono text-xs tracking-widest uppercase text-muted-foreground">Tech Stack</p>
              <div className="flex flex-row items-center gap-3 flex-wrap">
                <AnimatedTooltip tooltipTitle="Next.js" tooltipDescription="SaaS & Full-Stack">
                  <div className={tileClass}><RiNextjsLine /></div>
                </AnimatedTooltip>
                <AnimatedTooltip tooltipTitle="TypeScript" tooltipDescription="Type-Safe Development">
                  <div className={tileClass}><TbBrandTypescript /></div>
                </AnimatedTooltip>
                <AnimatedTooltip tooltipTitle="Python" tooltipDescription="AI Agents & Automation">
                  <div className={tileClass}><TbBrandPython /></div>
                </AnimatedTooltip>
                <AnimatedTooltip tooltipTitle="WordPress" tooltipDescription="CMS & E-commerce">
                  <div className={tileClass}><RiWordpressLine /></div>
                </AnimatedTooltip>
              </div>
            </div>

            <div>
              <p className="mb-2 font-bold font-mono text-xs tracking-widest uppercase text-muted-foreground lg:ml-4">Connect</p>
              <div className="flex flex-row items-center gap-3 lg:ml-4">
                <AnimatedTooltip tooltipTitle="Linkedin" tooltipDescription="Connect with me on Linkedin">
                  <Link href={"https://www.linkedin.com/in/mrowaisabdullah/"} target="_blank" aria-label="Connect with me on LinkedIn">
                    <div className={tileClass}><Linkedin /></div>
                  </Link>
                </AnimatedTooltip>
                <AnimatedTooltip tooltipTitle="Github" tooltipDescription="View my repositories on Github">
                  <Link href={"https://github.com/MrOwaisAbdullah"} target="_blank" aria-label="View my repositories on GitHub">
                    <div className={tileClass}><Github /></div>
                  </Link>
                </AnimatedTooltip>
                <AnimatedTooltip tooltipTitle="Email" tooltipDescription="Send me an email">
                  <Link href={"mailto:mrowaisabdullah@gmail.com"} target="_blank" aria-label="Send me an email">
                    <div className={tileClass}><Mail /></div>
                  </Link>
                </AnimatedTooltip>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center w-full">
          <TiltCard className="relative w-[350px] h-[450px] md:w-[400px] md:h-[520px]">
            <div data-tilt-layer className="hidden md:block absolute -left-4 -top-4 w-[90%] h-[90%] bg-ink-900/80 rounded-xl -rotate-6 z-0"></div>
            <div data-tilt-layer className="hidden md:block absolute -right-2 top-2 w-[90%] h-[90%] bg-muted/30 rounded-xl rotate-3 z-0"></div>
            <div className="relative z-10 bg-card rounded-xl overflow-hidden shadow-2xl h-[450px] md:h-[520px]">
              <Image
                src="/assets/owais-abdullah.webp"
                className="object-cover object-top w-full h-full"
                width={400}
                height={520}
                priority
                alt="Owais Abdullah - Spec-Driven Developer & AI Engineer"
              />
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 motion-safe:animate-bounce" />
      </a>
    </section>
  );
};

export default Hero;
