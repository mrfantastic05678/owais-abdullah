"use client";

import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  progress: number;
}

const SkillCard: React.FC<SkillCardProps> = ({
  icon: Icon,
  title,
  description,
  progress,
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 2000; // Animation duration in milliseconds

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const nextProgress = Math.min((elapsed / duration) * progress, progress);

      setCurrentProgress(nextProgress);

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [progress]);

  // Gradient colors mapping for skill icons
  const getGradientStyle = (title: string) => {
    const gradients: Record<string, { from: string; to: string }> = {
      "OpenAI Agents SDK": { from: "#a855f7", to: "#ec4899" },
      "Next.js": { from: "#000000", to: "#ffffff" },
      "React.js": { from: "#61dafb", to: "#21a1f1" },
      "TypeScript": { from: "#3178c6", to: "#007acc" },
      "Tailwind CSS": { from: "#06b6d4", to: "#14b8a6" },
      "Node.js": { from: "#68a063", to: "#3c873a" },
      "PostgreSQL": { from: "#336791", to: "#1d4ed8" },
      "SQLite": { from: "#0078d4", to: "#004488" },
      "Prisma ORM": { from: "#0c344b", to: "#0e7490" },
      "Sanity CMS": { from: "#f03e2f", to: "#c4325f" },
      "Python & AI Integration": { from: "#ffd43b", to: "#3776ab" },
      "WordPress": { from: "#00749c", to: "#005177" },
    };

    const colors = gradients[title];
    if (colors) {
      return `linear-gradient(to bottom right, ${colors.from}, ${colors.to})`;
    }
    return `linear-gradient(to bottom right, #6366f1, #a855f7)`;
  };

  return (
    <div className="entrance scroll-smooth group border border-border shadow-lg p-6 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 ease-in-out bg-card">
      <div className="flex justify-between gap-3">
        {/* Icon & Details */}
        <div className="flex flex-col mb-4 max-w-[70%]">
          {/* Icon with gradient border */}
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative w-16 h-16 rounded-xl mb-4"
            style={{
              background: getGradientStyle(title),
              padding: "3px"
            }}
          >
            <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
              <div className="text-2xl text-accent">{Icon}</div>
            </div>
          </motion.div>

          {/* Title & Description */}
          <h3 className="text-lg text-foreground font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Progress */}
        <div className="w-20 h-20 flex items-center justify-center pt-10">
          <CircularProgressbar
            value={currentProgress}
            text={`${Math.round(currentProgress)}%`}
            styles={buildStyles({
              textSize: "22px",
              pathColor: `url(#progressGradient)`,
              textColor: "#3a69ff",
              trailColor: "#3a3a52",
            })}
          />
          {/* SVG Gradient for Progress Bar */}
          <svg style={{ width: 0, height: 0, position: "absolute" }}>
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3a69ff" />
                <stop offset="100%" stopColor="#63e6be" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
