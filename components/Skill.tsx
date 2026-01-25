"use client";

import type React from "react";
import { motion } from "framer-motion";
import SkillCard from "../components/ui/SkillCard";
import { FaReact, FaWordpress, FaNodeJs } from "react-icons/fa";
import { BiLogoTypescript, BiLogoPython } from "react-icons/bi";
import { SiNextdotjs, SiOpenai, SiSanity, SiTailwindcss, SiSqlite, SiPrisma, SiPostgresql } from "react-icons/si";

const skills = [
  // Frontend & AI Skills
  {
    icon: <SiOpenai />,
    title: "OpenAI Agents SDK",
    description: "Developing Powerful AI Agents with Open AI Agents SDK.",
    progress: 75,
  },
  {
    icon: <SiNextdotjs />,
    title: "Next.js",
    description: "Building fast, dynamic, and SEO-friendly web applications.",
    progress: 85,
  },
  {
    icon: <FaReact />,
    title: "React.js",
    description: "Developing interactive UIs with component-based architecture.",
    progress: 85,
  },
  {
    icon: <BiLogoTypescript />,
    title: "TypeScript",
    description: "Ensuring type safety and scalability in web applications.",
    progress: 80,
  },
  {
    icon: <SiTailwindcss />,
    title: "Tailwind CSS",
    description: "Crafting modern and responsive UI with utility-first styling.",
    progress: 90,
  },

  // Backend & Database
  {
    icon: <FaNodeJs />,
    title: "Node.js",
    description: "Creating backend logic and API services.",
    progress: 75,
  },
  {
    icon: <SiPostgresql />,
    title: "PostgreSQL",
    description: "Relational database management for robust data handling.",
    progress: 80,
  },
  {
    icon: <SiSqlite />,
    title: "SQLite",
    description: "Lightweight database management for structured data storage.",
    progress: 75,
  },
  {
    icon: <SiPrisma />,
    title: "Prisma ORM",
    description: "Handling database interactions efficiently with TypeScript.",
    progress: 70,
  },
  {
    icon: <SiSanity />,
    title: "Sanity CMS",
    description: "Managing content dynamically using a headless CMS.",
    progress: 80,
  },

  // AI & Automation
  {
    icon: <BiLogoPython />,
    title: "Python & AI Integration",
    description: "Implementing AI features & automation in applications.",
    progress: 75,
  },

  // CMS & No-Code
  {
    icon: <FaWordpress />,
    title: "WordPress",
    description: "Developing custom themes & optimizing WordPress websites.",
    progress: 85,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const Skill: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-base text-accent font-medium sm:text-lg mb-2">
            Expertise
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Skills & Technologies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            A comprehensive toolkit for building modern web applications, AI-powered solutions, and scalable digital products. From frontend frameworks to backend infrastructure and intelligent automation.
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
            <motion.div key={index} variants={itemVariants}>
              <SkillCard
                icon={skill.icon}
                title={skill.title}
                description={skill.description}
                progress={skill.progress}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Skill;
