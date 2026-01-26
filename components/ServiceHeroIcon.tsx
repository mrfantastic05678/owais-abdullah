"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ServiceHeroIconProps {
  icon: LucideIcon;
  gradient: string;
}

const ServiceHeroIcon: React.FC<ServiceHeroIconProps> = ({ icon: Icon, gradient }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Horizontal scroll effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -15]);

  return (
    <div className="relative" ref={ref}>
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-3xl opacity-30`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Icon container with tilt effect */}
      <motion.div
        className={`relative w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br ${gradient} p-1`}
        style={{
          rotateX,
          rotateY,
        }}
        whileHover={{
          rotateX: 5,
          rotateY: 5,
          scale: 1.05,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <motion.div
          className="w-full h-full rounded-3xl bg-card flex items-center justify-center"
          whileHover={{
            scale: 1.02,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-24 h-24 md:w-32 md:h-32 text-accent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ServiceHeroIcon;
