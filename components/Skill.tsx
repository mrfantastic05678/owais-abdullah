"use client";

import type React from "react";
import { motion } from "framer-motion";
import SkillCard from "../components/ui/SkillCard";
import CharRevealHeading from "@/components/CharRevealHeading";
import { FaReact, FaWordpress, FaNodeJs } from "react-icons/fa";
import { BiLogoTypescript, BiLogoPython } from "react-icons/bi";
import { SiNextdotjs, SiOpenai, SiSanity, SiTailwindcss, SiSqlite, SiPrisma, SiPostgresql } from "react-icons/si";

const skills = [
  { icon: <SiOpenai />, title: "OpenAI Agents SDK", description: "Developing autonomous AI agents with the OpenAI Agents SDK." },
  { icon: <SiNextdotjs />, title: "Next.js", description: "Building fast, dynamic, and SEO-friendly web applications." },
  { icon: <FaReact />, title: "React.js", description: "Developing interactive UIs with component-based architecture." },
  { icon: <BiLogoTypescript />, title: "TypeScript", description: "Ensuring type safety and scalability in web applications." },
  { icon: <SiTailwindcss />, title: "Tailwind CSS", description: "Crafting modern and responsive UI with utility-first styling." },
  { icon: <FaNodeJs />, title: "Node.js", description: "Creating backend logic and API services." },
  { icon: <SiPostgresql />, title: "PostgreSQL", description: "Relational database management for robust data handling." },
  { icon: <SiSqlite />, title: "SQLite", description: "Lightweight database management for structured data storage." },
  { icon: <SiPrisma />, title: "Prisma ORM", description: "Handling database interactions efficiently with TypeScript." },
  { icon: <SiSanity />, title: "Sanity CMS", description: "Managing content dynamically using a headless CMS." },
  { icon: <BiLogoPython />, title: "Python & AI Integration", description: "Implementing AI features and automation in applications." },
  { icon: <FaWordpress />, title: "WordPress", description: "Developing custom themes and optimizing WordPress websites." },
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
          <p className="text-base text-accent font-medium sm:text-lg mb-2">Expertise</p>
          <CharRevealHeading
            as="h2"
            className="text-4xl md:text-5xl font-semibold text-foreground mb-3"
            highlightWords={["Technologies"]}
          >
            Skills & Technologies
          </CharRevealHeading>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            The toolkit behind the projects on this site — frontend, backend, AI agents, and content infrastructure.
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
      </div>
    </motion.section>
  );
};

export default Skill;
