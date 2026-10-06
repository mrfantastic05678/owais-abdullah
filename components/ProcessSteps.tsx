"use client";

import React from "react";

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

interface ProcessStepsProps {
  eyebrow?: string;
  heading: React.ReactNode;
  headingHighlight?: string[];
  description: string;
  steps: ProcessStep[];
}

export default function ProcessSteps({
  eyebrow = "HOW I WORK · METHODOLOGY",
  heading,
  description,
  steps,
}: ProcessStepsProps) {
  return (
    <section className="max-w-7xl mx-auto px-5 pb-16 sm:pb-20 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest shrink-0">
          {eyebrow}
        </span>
        <div className="h-px bg-border flex-1" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div
            key={step.num}
            className="clean-glass-card p-5 space-y-2.5 border-l-4 border-l-teal-600 dark:border-l-teal-400 hover:-translate-y-1 transition-all"
          >
            <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 block">
              {step.num}
            </span>
            <h4 className="font-bold text-sm text-foreground">
              {step.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
