"use client";

import React from "react";
import ServicesGrid from "@/components/ServicesGrid";
import ProcessSteps from "@/components/ProcessSteps";

const PROCESS_STEPS = [
  { 
    num: "01 / SPEC", 
    title: "Write Specification", 
    desc: "We write down exactly what the system must do before code exists. Schemas, failure states, and interfaces." 
  },
  { 
    num: "02 / BUILD", 
    title: "Architect & Code", 
    desc: "Agents, apps, or automations — built against the verified spec, not around loose vibes." 
  },
  { 
    num: "03 / DEPLOY", 
    title: "Production Launch", 
    desc: "Production infrastructure, proactive health telemetry, error budgets, and complete handover docs." 
  },
  { 
    num: "04 / OPERATE", 
    title: "Autonomous Ops", 
    desc: "The system runs reliably 24/7; you get automated reports and briefings, not midnight surprises." 
  },
];

export default function Services() {
  return (
    <>
      <section id="services" className="max-w-7xl mx-auto px-5 py-16 sm:py-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-teal-700 dark:text-teal-400">
              WHAT I OFFER
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
              What I build
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mt-1">
              AI systems and web products that hold up in production — from autonomous agents to full SaaS builds.
            </p>
          </div>
          <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-border bg-card/80 text-muted-foreground w-fit">
            6 CORE CAPABILITIES · ZERO VIBE CODING
          </div>
        </div>

        <ServicesGrid />
      </section>

      <ProcessSteps
        eyebrow="HOW I WORK · METHODOLOGY"
        heading="Spec first, then ship."
        description="Every system starts as a written spec — so you know what you're getting before a line of code exists."
        steps={PROCESS_STEPS}
      />
    </>
  );
}
