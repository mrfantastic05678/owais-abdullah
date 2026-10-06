"use client";

import type React from "react";
import { motion } from "framer-motion";
import SkillCard from "../components/ui/SkillCard";
import CharRevealHeading from "@/components/CharRevealHeading";
import Link from "next/link";
import { FaNodeJs } from "react-icons/fa";
import { BiLogoTypescript, BiLogoPython } from "react-icons/bi";
import { SiNextdotjs, SiOpenai, SiTailwindcss, SiPostgresql, SiAstro, SiDocker } from "react-icons/si";
import { Bot, Layers, ArrowRight, Cpu, Sparkles } from "lucide-react";

const skills = [
  {
    icon: <SiOpenai />,
    title: "OpenAI Agents SDK & Claude Code",
    description: "Architecting autonomous AI agents, Digital FTEs, multi-agent swarms, and self-correcting execution loops.",
  },
  {
    icon: <SiNextdotjs />,
    title: "Next.js (App Router)",
    description: "Building production SaaS platforms, dynamic API routes, server actions, and high-conversion web apps.",
  },
  {
    icon: <BiLogoTypescript />,
    title: "TypeScript",
    description: "Ensuring end-to-end type safety, strict Zod schema validation, and maintainable enterprise-grade architecture.",
  },
  {
    icon: <BiLogoPython />,
    title: "Python & AI Automations",
    description: "Developing automated background processes, event-driven watchers, data scrapers, and custom LLM toolkits.",
  },
  {
    icon: <Cpu />,
    title: "Model Context Protocol (MCP)",
    description: "Standardized tool calling, external database & filesystem integration, and cross-platform agent execution.",
  },
  {
    icon: <SiPostgresql />,
    title: "PostgreSQL & pgvector",
    description: "Serverless relational data modeling with Neon, vector embeddings, and persistent semantic agent memory.",
  },
  {
    icon: <SiAstro />,
    title: "Astro",
    description: "Building ultra-fast, zero-JS content-driven websites with Island architecture for optimal SEO and performance.",
  },
  {
    icon: <SiTailwindcss />,
    title: "Tailwind CSS & Smooth UI",
    description: "60FPS responsive interface engineering, GPU layer compositing, mobile touch responsiveness, and design systems.",
  },
  {
    icon: <SiDocker />,
    title: "Docker & Cloud Infrastructure",
    description: "Containerized agent runtimes, Cloudflare R2 object storage, FastAPIs, and resilient production deployments.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Skill: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CORE EXPERTISE</span>
          </div>
          <CharRevealHeading
            as="h2"
            className="text-4xl md:text-5xl font-semibold text-foreground mb-3"
            highlightWords={["Technologies"]}
          >
            Skills & Technologies
          </CharRevealHeading>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            The core 9 capabilities behind every autonomous agent, SaaS application, and digital product I engineer.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <SkillCard icon={skill.icon} title={skill.title} description={skill.description} />
            </motion.div>
          ))}
        </motion.div>

        {/* Button to go to The Agent Stack */}
        <div className="mt-12 text-center flex items-center justify-center">
          <Link
            href="/stack"
            className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-teal-500/20 active:scale-[0.98]"
          >
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
            <span>Explore The Full Agent Stack</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default Skill;
