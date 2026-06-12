"use client";
import React from "react";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { RiNextjsLine, RiWordpressLine } from "react-icons/ri";
import { TbBrandTypescript, TbBrandPython } from "react-icons/tb";
import Link from "next/link";
import { HeroHighlight } from "./ui/HeroHighlight";
import { AnimatedTooltip } from "./ui/AnimatedTooltip";
import { Github, Linkedin, Mail } from "lucide-react";
import dynamic from "next/dynamic";

const Typewriter = dynamic(
  () => import("nextjs-simple-typewriter").then((mod) => mod.Typewriter),
  {
    ssr: false,
    loading: () => <span>AI Agent Developer</span>,
  }
);

const Hero = () => {
  return (
    <section className="relative text-muted-foreground overflow-hidden z-0 -mt-20">
      <HeroHighlight>
        <div className="max-w-7xl mx-auto flex px-5 pt-40 py-10 md:flex-row flex-col items-center">
          <div className="sm:entrance-left lg:flex-grow md:w-1/2 lg:pr-16 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center lg:w-3/5">
            {/* Available Badge with Live Indicator */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground bg-muted/70 border border-border/50">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Available for SaaS & AI Agent Projects
              </span>
            </div>

            <div className="min-h-60 xs:min-h-44 md:min-h-0">
              <h1 className="sm:text-5xl text-4xl mb-4 font-heading font-semibold text-foreground ">
                Hi, I&apos;m <span className="text-accent">Owais Abdullah</span>
                <br />
                <span className="">
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
            </div>
            <p className="mb-8 leading-relaxed font-poppins text-muted-foreground">
              I build production-ready web applications and AI agents using <span className="text-accent font-semibold">spec-driven development</span> and <span className="text-accent font-semibold">AI-driven engineering</span>. Specializing in Next.js SaaS products, Digital FTEs (AI employees), and intelligent automation that scales with your business.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="#contact"
                className="group flex items-center text-white bg-gradient-to-br from-blue-900 via-accent to-blue-700 hover:from-blue-950 py-2 hover:bg-blue-500 hover:bg-gradient-to-tr rounded-full font-medium text-lg px-8 scroll-smooth duration-300"
              >
                Get In Touch
                <FaChevronRight className="ml-3 group-hover:mt-2 group-hover:rotate-90 duration-300" />
              </Link>
              <Link
                href="#projects"
                className="group flex items-center text-foreground bg-card hover:bg-accent hover:text-white border-2 border-border hover:border-accent py-2 rounded-full font-medium text-lg px-8 transition-all duration-300 scroll-smooth"
              >
                View Projects
                <FaChevronRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
              <div>
                <p className="mt-8 mb-2 font-bold md:ml-4">TECH STACK:</p>
                <div className="container flex flex-row items-center gap-3 justify-center md:justify-start flex-wrap">
                  <AnimatedTooltip
                    tooltipTitle="Next.js"
                    tooltipDescription="SaaS & Full-Stack"
                  >
                    <div
                      title="Next.js"
                      className=" shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-card p-3 text-2xl text-foreground  hover:bg-muted border border-border"
                    >
                      <RiNextjsLine />
                    </div>
                  </AnimatedTooltip>
                  <AnimatedTooltip
                    tooltipTitle="TypeScript"
                    tooltipDescription="Type-Safe Development"
                  >
                    <div
                      title="TypeScript"
                      className=" shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-card p-3 text-2xl text-foreground hover:bg-muted border border-border"
                    >
                      <TbBrandTypescript />
                    </div>
                  </AnimatedTooltip>
                  <AnimatedTooltip
                    tooltipTitle="Python"
                    tooltipDescription="AI Agents & Automation"
                  >
                    <div
                      title="Python"
                      className=" shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-card p-3 text-2xl text-foreground hover:bg-muted border border-border"
                    >
                      <TbBrandPython />
                    </div>
                  </AnimatedTooltip>
                  <AnimatedTooltip
                    tooltipTitle="WordPress"
                    tooltipDescription="CMS & E-commerce"
                  >
                    <div
                      title="WordPress"
                      className=" shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-card p-3 text-2xl text-foreground hover:bg-muted border border-border"
                    >
                      <RiWordpressLine />
                    </div>
                  </AnimatedTooltip>
                </div>
              </div>

              <div>
                <p className="mt-8 mb-2 font-bold md:ml-4">CONNECT WITH ME:</p>
                <div className="container flex flex-row items-center gap-3 justify-center md:justify-start ">
                  <AnimatedTooltip
                    tooltipTitle="Linkedin"
                    tooltipDescription="Connect with me on Linkedin"
                  >
                    <Link
                      href={"https://www.linkedin.com/in/mrowaisabdullah/"}
                      target="_blank"
                      aria-label="Connect with me on LinkedIn"
                    >
                      <div                       className="shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-card p-3 text-2xl text-foreground  hover:bg-muted border border-border"
                      >

                      <Linkedin />
                      </div>
                    </Link>
                  </AnimatedTooltip>
                  <AnimatedTooltip
                    tooltipTitle="Github"
                    tooltipDescription="View my repositories on Github"
                  >
                    <Link
                      href={"https://github.com/MrOwaisAbdullah"}
                      target="_blank"
                      aria-label="View my repositories on GitHub"
                    >
                      <div                       className="shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-card p-3 text-2xl text-foreground  hover:bg-muted border border-border"
                      >

                      <Github />
                      </div>
                    </Link>
                  </AnimatedTooltip>
                  <AnimatedTooltip
                    tooltipTitle="Email"
                    tooltipDescription="Send me an email"
                  >
                    <Link
                      href={"mailto:mrowaisabdullah@gmail.com"}
                      target="_blank"
                      aria-label="Send me an email"
                    >
                      <div                       className="shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-card p-3 text-2xl text-foreground  hover:bg-muted border border-border"
                      >

                      <Mail />
                      </div>
                    </Link>
                  </AnimatedTooltip>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:entrance-right lg:max-w-lg md:w-2/5 sm:-ml-16 sm:pt-0 relative lg:-mt-8 xl:-mt-14 md:ml-20 md:-mt-52 ">
            <div className="-mt-56 -mr-[155px] w-11/12 sm:w-[24rem] h-[70%] shadow-xl opacity-30 shadow-slate-500 rounded-xl absolute bottom-0 right-40 z-0 bg-secondary md:w-11/12 md:h-[75%] md:-mr-28 md:bottom-0 xs:h-[75%] xs:bottom-0 sm:bottom-0 sm:-mr-40 sm:w-10/12  lg:-mr-40 xl:w-10/12 xl:-mr-30 xl:h-[75%] xl:bottom-0"></div>
            <AnimatedTooltip
              tooltipTitle="Owais Abdullah"
              tooltipDescription="Spec-Driven & AI Engineer"
            >
              <Image
                src="/assets/owais-abdullah.webp"
                className="relative object-contain object-center -mt-16 xs:ml-5 xs:-mt-14 z-10 md:mt-32 md:-ml-10 sm:-mt-9 sm:ml-16 lg:ml-6 lg:mt-6 xl:ml-20 xl:mt-8"
                width={400}
                height={500}
                priority
                alt="Owais Abdullah - Spec-Driven Developer & AI Engineer"
              />
            </AnimatedTooltip>
          </div>
        </div>
        <div className="h-px bg-border opacity-80 justify-center flex m-auto mt-10"></div>
      </HeroHighlight>
    </section>
  );
};

export default Hero;
