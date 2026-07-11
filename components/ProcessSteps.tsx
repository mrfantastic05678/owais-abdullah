"use client";

import React from "react";
import { motion } from "framer-motion";
import CharRevealHeading from "@/components/CharRevealHeading";

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

interface ProcessStepsProps {
  eyebrow: string;
  heading: React.ReactNode;
  headingHighlight?: string[];
  description: string;
  steps: ProcessStep[];
}

/**
 * The numbered "how it works" step grid, with the token-derived blob glows
 * used on the homepage's Services section. Shared so the pattern doesn't
 * fork between the homepage and the standalone /services page.
 */
export default function ProcessSteps({ eyebrow, heading, headingHighlight = [], description, steps }: ProcessStepsProps) {
  return (
    <section className="bg-card relative overflow-hidden border-b border-border">
      <div
        className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] pointer-events-none blur-[60px]"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--signal-500) 12%, transparent) 0%, transparent 60%)" }}
      ></div>
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] pointer-events-none blur-[60px]"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 60%)" }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 py-24 px-5">
        <div className="text-center mb-16">
          <span className="text-accent font-mono text-xs tracking-widest uppercase mb-2 block">{eyebrow}</span>
          <CharRevealHeading as="h2" className="text-4xl md:text-5xl font-semibold mb-4 text-foreground" highlightWords={headingHighlight}>
            {heading}
          </CharRevealHeading>
          <p className="text-muted-foreground max-w-lg mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, borderColor: "var(--accent)", boxShadow: "0 12px 30px rgba(61,123,255,0.15)" }}
              className="bg-background border border-border rounded-xl p-8 transition-colors duration-300"
            >
              <span className="font-mono text-accent text-xl font-bold block mb-4">{step.num}</span>
              <h3 className="text-foreground text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
