"use client";

import React from "react";
import { motion } from "framer-motion";

interface ServiceTechStackProps {
  techStack: string[];
}

const ServiceTechStack: React.FC<ServiceTechStackProps> = ({
  techStack,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-foreground mb-12 text-center"
        >
          Tech Stack & Tools
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {techStack.map((tech, index) => (
            <motion.span
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 bg-muted text-foreground rounded-full text-sm font-medium border border-border hover:border-accent transition-colors cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceTechStack;
