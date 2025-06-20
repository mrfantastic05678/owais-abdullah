"use client";

import type React from "react";
import SkillCard from "../components/ui/SkillCard";
import { FaReact, FaWordpress, FaNodeJs } from "react-icons/fa";
import { BiLogoTypescript, BiLogoPython } from "react-icons/bi";
import { SiNextdotjs, SiOpenai, SiSanity, SiTailwindcss, SiSqlite, SiPrisma, SiPostgresql } from "react-icons/si";

const skills = [
  // Frontend Skills
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

const Skill: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              icon={skill.icon}
              title={skill.title}
              description={skill.description}
              progress={skill.progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skill;
