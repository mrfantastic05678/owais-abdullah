"use client";
import React from "react";
import { motion } from "framer-motion";

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group h-full flex flex-col border border-border p-6 rounded-xl hover:border-accent hover:shadow-[0_12px_30px_rgba(61,123,255,0.12)] transition-all duration-300 bg-card"
    >
      <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center group-hover:border-accent transition-colors duration-300 mb-4">
        <div className="text-xl text-accent">{Icon}</div>
      </div>
      <h3 className="text-lg text-foreground font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default SkillCard;
