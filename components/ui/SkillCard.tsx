"use client";

import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

  return (
    <div className="entrance scroll-smooth group border border-border shadow-lg p-6 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 ease-in-out bg-card">
      <div className="flex justify-between gap-3">
        {/* Icon & Details */}
        <div className="flex flex-col mb-4 max-w-[70%]">
          <div className="text-4xl text-accent group-hover:text-accent/80 mb-4">{Icon}</div>
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