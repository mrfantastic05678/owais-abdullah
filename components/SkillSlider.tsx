import {
  SiNextdotjs,
  SiTailwindcss,
  SiPython,
  SiSanity,
  SiNodedotjs,
  SiPostgresql,
  SiSqlite,
  SiOpenai,
  SiWordpress,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiDocker,
  SiGit,
  SiAmazonwebservices,
  SiPrisma,
  SiRedis,
  SiVercel,
  SiNetlify,
  SiSupabase,
  SiRailway,
  SiRender,
  SiFramer,
  SiShadcnui,
  SiClerk,
  SiFigma,
  SiTrello,
  SiNotion,
  SiHuggingface,
} from "react-icons/si";
import { CircleDot, Layers3, Users2 } from "lucide-react";
import SkillCards from "./ui/SkillCards";

const SkillSlider = () => {
  const skills = [
    { name: "Next.js", icon: SiNextdotjs, color: "#00D9FF" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Python", icon: SiPython, color: "#FFD43B" },
    { name: "Sanity CMS", icon: SiSanity, color: "#F03E2F" },
    { name: "Node.js", icon: SiNodedotjs, color: "#68A063" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
    { name: "SQLite", icon: SiSqlite, color: "#0078D4" },
    { name: "OpenAI Agents SDK", icon: SiOpenai, color: "#10A37F" },
    { name: "WordPress", icon: SiWordpress, color: "#00749C" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
    { name: "Prisma ORM", icon: SiPrisma, color: "#0078E9" },
    { name: "Redis", icon: SiRedis, color: "#DC382D" },
    // GenAI & Automation
    { name: "Pinecone", icon: CircleDot, color: "#5AD1D1" },
    { name: "Vector DB", icon: Layers3, color: "#512DA8" },
    { name: "Crew AI", icon: Users2, color: "#6366F1" },

    // Infra & DevOps
    { name: "Vercel", icon: SiVercel, color: "#9CA3AF" },
    { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
    { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
    { name: "Railway", icon: SiRailway, color: "#8A63D2" },
    { name: "Render", icon: SiRender, color: "#46E3B7" },

    // UI & Productivity Tools
    { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
    { name: "ShadCN/UI", icon: SiShadcnui, color: "#6366F1" },
    { name: "Clerk Auth", icon: SiClerk, color: "#3D5AFE" },

    // Project Management / Misc
    { name: "Figma", icon: SiFigma, color: "#F24E1E" },
    { name: "Trello", icon: SiTrello, color: "#0079BF" },
    { name: "Notion", icon: SiNotion, color: "#9CA3AF" },

    // Bonus AI Tools
    { name: "Hugging Face", icon: SiHuggingface, color: "#FFBF00" },
  ];

  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* Fade overlays */}
      <div className="absolute left-0 top-0 w-14 lg:w-32 h-full bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-14 lg:w-32 h-full bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none"></div>

      {/* Top row - sliding right */}
      <div className="mb-8 relative">
        <div className="w-max flex flex-nowrap animate-infinite-scroll-right">
          {[...skills, ...skills].map((skill, index) => (
            <SkillCards
              key={`top-${skill.name}-${index}`}
              name={skill.name}
              icon={skill.icon}
              color={skill.color}
            />
          ))}
        </div>
      </div>

      {/* Bottom row - sliding left */}
      <div className="relative">
        <div className="w-max -ml-[5000px] lg:-ml-[500%] flex flex-nowrap animate-infinite-scroll-left flex-row-reverse">
          {[...skills, ...skills].reverse().map((skill, index) => (
            <SkillCards
              key={`bottom-${skill.name}-${index}`}
              name={skill.name}
              icon={skill.icon}
              color={skill.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillSlider;
