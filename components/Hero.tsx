"use client";
import React from "react";
import owais from "../public/assets/Owais Abdullah.png";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { RiNextjsLine, RiWordpressLine } from "react-icons/ri";
import { TbBrandTypescript } from "react-icons/tb";
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
    <section className="relative text-gray-600 overflow-hidden z-0 -mt-20">
      <HeroHighlight>
        <div className="max-w-7xl mx-auto flex px-5 pt-40 py-10 md:flex-row flex-col items-center">
          <div className="sm:entrance-left lg:flex-grow md:w-1/2 lg:pr-16 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center lg:w-3/5">
            <h2 className="title-font sm:text-lg text-base mb-4 font-montserrat text-text">
              WELCOME TO MY WORLD
            </h2>
            <div className="min-h-60 xs:min-h-44 md:min-h-0">
              <h1 className="sm:text-5xl text-4xl mb-4 font-montserrat font-bold text-text ">
                Hi, I&apos;m <span className="text-accent">Owais Abdullah</span>
                <br />
                {"a "}
                <span className="">
                  <Typewriter
                    words={[
                      "Web Developer.",
                      "AI Agent Developer.",
                      "Full Stack Dev.",
                      "AI Architect.",
                      "Next.js Specialist.",
                      "Python Enthusiast.",
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
            <p className="mb-8 leading-relaxed font-poppins text-gray-400">
              I craft high-performing websites, optimize them for search
              engines, and develop data-driven digital marketing strategies -
              all powered by my passion for AI. Let&apos;s discuss how I can
              help your business flourish online!
            </p>
            <div className="flex justify-center">
              <Link href="#about" className="scroll-smooth duration-300">
                <button className="group flex items-center text-white bg-gradient-to-br from-blue-900 via-accent to-blue-700 hover:from-blue-950 py-2 hover:bg-blue-500 hover:bg-gradient-to-tr rounded-full font-medium text-lg px-8">
                  About Me
                  <FaChevronRight className="ml-3 group-hover:mt-2 group-hover:rotate-90 duration-300" />
                </button>
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
              <div>
                <p className="mt-8 mb-2 font-bold md:ml-4">BEST SKILL ON:</p>
                <div className="container flex flex-row items-center gap-3 justify-center md:justify-start ">
                  <AnimatedTooltip
                    tooltipTitle="Wordpress"
                    tooltipDescription="CMS / Blog"
                  >
                    <div
                      title="Wordpress"
                      className=" shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-gray-900 p-3 text-2xl text-text  hover:bg-gray-950 bg-gradient-to-br to-[#1c1f22] from-[#16161f]"
                    >
                      <RiWordpressLine />
                    </div>
                  </AnimatedTooltip>
                  <AnimatedTooltip
                    tooltipTitle="TypeScript"
                    tooltipDescription="Programming Language"
                  >
                    <div
                      title="TypeScript"
                      className=" shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-gray-900 p-3 text-2xl text-text hover:bg-gray-950 bg-gradient-to-br to-[#1c1f22] from-[#16161f]"
                    >
                      <TbBrandTypescript />
                    </div>
                  </AnimatedTooltip>
                  <AnimatedTooltip
                    tooltipTitle="Next JS"
                    tooltipDescription="Framework"
                  >
                    <div
                      title="Next JS"
                      className=" shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-gray-900 p-3 text-2xl text-text hover:bg-gray-950 bg-gradient-to-br to-[#1c1f22] from-[#16161f]"
                    >
                      <RiNextjsLine />
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
                    >
                      <div                       className="shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-gray-900 p-3 text-2xl text-text  hover:bg-gray-950 bg-gradient-to-br to-[#1c1f22] from-[#16161f]"
                      >
                        
                      <Linkedin />
                      </div>
                    </Link>
                  </AnimatedTooltip>
                  <AnimatedTooltip
                    tooltipTitle="Github"
                    tooltipDescription="Connect with me on Github"
                  >
                    <Link
                      href={"https://github.com/MrOwaisAbdullah"}
                      target="_blank"
                    >
                      <div                       className="shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-gray-900 p-3 text-2xl text-text  hover:bg-gray-950 bg-gradient-to-br to-[#1c1f22] from-[#16161f]"
                      >

                      <Github />
                      </div>
                    </Link>
                  </AnimatedTooltip>
                  <AnimatedTooltip
                    tooltipTitle="Email"
                    tooltipDescription="Connect with me on Email"
                  >
                    <Link
                      href={"mailto:mrowaisabdullah@gmail.com"}
                      target="_blank"
                    >
                      <div                       className="shadow-sm opacity-50 hover:opacity-100 shadow-slate-700 rounded-lg bg-gray-900 p-3 text-2xl text-text  hover:bg-gray-950 bg-gradient-to-br to-[#1c1f22] from-[#16161f]"
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
            <div className="-mt-56 -mr-[155px] w-11/12 h-[75%] shadow-xl opacity-30 shadow-slate-500 rounded-xl absolute bottom-0 right-40 z-0 bg-black md:w-11/12 md:h-[75%] md:-mr-28 md:bottom-0 xs:h-[75%] xs:bottom-0 sm:bottom-0 sm:-mr-40 sm:w-10/12 lg:w-11/12 lg:-mr-40 xl:w-10/12 xl:-mr-30 xl:h-[75%] xl:bottom-0 bg-gradient-to-br to-[#1c1f22] from-[#16161f]"></div>
            <AnimatedTooltip
              tooltipTitle="Owais Abdullah"
              tooltipDescription="AI & Web Engineer"
            >
              <Image
                src={owais}
                className="relative object-cover object-center -mt-16 xs:-mt-14 z-10 md:mt-32 md:-ml-10 sm:-mt-9 sm:ml-12 lg:ml-2 lg:mt-6 xl:ml-16 xl:mt-8"
                width={400}
                height={100}
                priority
                alt="Owais Abdullah"
              />
            </AnimatedTooltip>
          </div>
        </div>
        <div className="h-px bg-gray-950 opacity-80 justify-center flex m-auto mt-10"></div>
      </HeroHighlight>
    </section>
  );
};

export default Hero;
