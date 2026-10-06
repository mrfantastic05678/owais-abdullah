"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Bot, Layers } from "lucide-react";
import StatusDot from "@/components/ui/StatusDot";

const PILLARS = [
  {
    number: "01",
    title: "Spec-First Engineering",
    description: "Before writing code, we define database schemas, agent loops, failure modes, and tool parameters. Zero improvisation.",
    icon: Zap,
    badge: "DETERMINISTIC"
  },
  {
    number: "02",
    title: "Digital FTEs in Production",
    description: "Building autonomous AI employees backed by Claude Code, OpenAI Agents SDK, and MCP tools that run business workflows 24/7.",
    icon: Bot,
    badge: "AUTONOMOUS"
  },
  {
    number: "03",
    title: "Full-Stack SaaS Architecture",
    description: "Architecting high-performance Next.js platforms with serverless Postgres, BetterAuth, Stripe payments, and Inngest queues.",
    icon: Layers,
    badge: "PRODUCTION"
  }
];

const COMPARISON = [
  { label: "Hours", human: "9–5, weekends off", fte: "24 / 7 continuous uptime" },
  { label: "Ramp-up", human: "Weeks of onboarding", fte: "Instant, pre-configured SOPs" },
  { label: "Cost", human: "Salary + benefits + overhead", fte: "Predictable API & compute costs" },
  { label: "Scaling", human: "Hire, interview, train", fte: "Duplicate agent runtime instantly" },
  { label: "Consistency", human: "Fatigue & variability", fte: "Exact deterministic output" },
  { label: "Supervision", human: "Active human management", fte: "Self-operating, exception-only" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 relative max-w-6xl mx-auto px-5 sm:px-6 space-y-16">
      
      {/* Section Header */}
      <div className="space-y-2 text-left">
        <span className="text-xs font-mono uppercase tracking-widest font-bold text-teal-700 dark:text-teal-400">
          // ENGINEERING PHILOSOPHY
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Spec-Driven Developer. AI Agent Engineer.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Most agencies bill for hours. I engineer autonomous software systems that execute flawlessly after everyone logs off.
        </p>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="grid md:grid-cols-3 gap-6">
        {PILLARS.map((pillar) => {
          return (
            <div 
              key={pillar.title}
              className="clean-glass-card p-6 sm:p-7 space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 flex items-center justify-center font-mono font-bold text-sm">
                    {pillar.number}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-700 dark:text-teal-400">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exhibit: Human Hire vs Digital FTE Comparison Matrix */}
      <div className="clean-glass-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Human Employee vs Digital FTE (Autonomous AI Worker)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Why founders and operations teams replace repetitive manual workflows with spec-driven agents.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 self-start sm:self-auto">
            <StatusDot size={6} />
            <span>PRODUCTION ACTIVE</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs sm:text-sm border-collapse text-left min-w-[560px]">
            <thead>
              <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                <th className="py-3 px-4 w-1/4">Metric</th>
                <th className="py-3 px-4 w-3/8 text-foreground">Traditional Hire</th>
                <th className="py-3 px-4 w-3/8 text-teal-700 dark:text-teal-400 font-bold">Digital FTE (AI Agent)</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(({ label, human, fte }, i) => {
                const isLast = i === COMPARISON.length - 1;
                return (
                  <tr key={label} className={isLast ? "" : "border-b border-border/40"}>
                    <td className="py-3.5 px-4 font-medium text-foreground">{label}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{human}</td>
                    <td className="py-3.5 px-4 font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{fte}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}
