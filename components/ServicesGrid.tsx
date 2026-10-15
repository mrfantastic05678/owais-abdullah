"use client";

import React from "react";
import Link from "next/link";
import { services } from "@/data/services";
import { ArrowRight, Bot, Zap, Rocket, ShoppingCart, Lightbulb, Cpu } from "lucide-react";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot: Bot,
  Zap: Zap,
  Rocket: Rocket,
  ShoppingCart: ShoppingCart,
  Lightbulb: Lightbulb,
  Cpu: Cpu,
};

// Purpose-driven domain badges (eliminating repetitive "PRODUCTION" slop)
const badgeConfig: Record<string, { label: string; isPrimary?: boolean }> = {
  "digital-fte": { label: "AUTONOMOUS FTE", isPrimary: true },
  "custom-ai-agents": { label: "MULTI-MODEL SWARMS", isPrimary: false },
  "saas-development": { label: "FULL-STACK SAAS", isPrimary: false },
  "ecommerce-cms": { label: "HEADLESS COMMERCE", isPrimary: false },
  "ai-consulting": { label: "SPEC-FIRST AUDIT", isPrimary: false },
  "api-integrations": { label: "DISTRIBUTED APIS", isPrimary: false },
};

// Context-rich action button labels per service (eliminating repetitive "Learn More" slop)
const actionLabels: Record<string, { primary: string; secondary: string }> = {
  "digital-fte": { primary: "Explore Digital FTEs", secondary: "System Architecture" },
  "custom-ai-agents": { primary: "View Agent Workflows", secondary: "Multi-Model Pipelines" },
  "saas-development": { primary: "Inspect SaaS Blueprint", secondary: "Next.js & TypeScript" },
  "ecommerce-cms": { primary: "View Headless Stores", secondary: "Shopify & Sanity" },
  "ai-consulting": { primary: "Read Spec Process", secondary: "Zero Vibe Coding" },
  "api-integrations": { primary: "Explore API Specs", secondary: "FastAPI & Pipelines" },
};

export default function ServicesGrid() {
  const servicesList = Object.values(services);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
      {servicesList.map((service, index) => {
        const Icon = iconMap[service.icon] || Lightbulb;
        const badge = badgeConfig[service.slug] || { label: "CAPABILITY" };
        const action = actionLabels[service.slug] || { primary: "View Service", secondary: "Read Specs" };
        const isDigitalFte = index === 0;
        const isSwarm = index === 1;

        // Balanced 12-column Bento distribution:
        // Row 1: 7 + 5 = 12 columns (100% full width)
        // Row 2: 3 + 3 + 3 + 3 = 12 columns (100% full width)
        // Zero orphan cards, zero trailing gaps on any viewport.
        const colSpanClass = isDigitalFte
          ? "md:col-span-2 lg:col-span-7"
          : isSwarm
          ? "md:col-span-2 lg:col-span-5"
          : "md:col-span-1 lg:col-span-3";

        return (
          <div
            key={service.slug}
            className={`clean-glass-card rounded-2xl group p-6 sm:p-7 flex flex-col justify-between ${colSpanClass}`}
          >
            {/* Top row: Icon + Pill Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-950/60 border border-teal-500/20 dark:border-teal-700/50 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                
                <span className={`text-[10px] font-mono tracking-wider font-semibold px-2.5 py-1 rounded-full border shadow-xs flex items-center gap-1.5 ${
                  badge.isPrimary 
                    ? "border-teal-500/40 bg-teal-500/15 text-teal-900 dark:text-teal-200 dark:bg-teal-900/50"
                    : "border-slate-200/90 dark:border-white/[0.08] bg-slate-100/80 dark:bg-white/[0.04] text-muted-foreground"
                }`}>
                  {badge.isPrimary && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span>{badge.label}</span>
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className={`font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors ${
                  isDigitalFte ? "text-xl sm:text-2xl" : isSwarm ? "text-lg sm:text-xl" : "text-base sm:text-lg"
                }`}>
                  {service.title}
                </h3>
                <p className={`text-xs text-muted-foreground leading-relaxed mt-2 ${
                  isDigitalFte ? "text-sm max-w-xl" : "line-clamp-2"
                }`}>
                  {service.description}
                </p>
              </div>

              {/* Feature Bullets */}
              <ul className={`space-y-1.5 pt-1 text-xs text-muted-foreground ${
                isDigitalFte ? "grid sm:grid-cols-2 gap-2 space-y-0 pt-2" : ""
              }`}>
                {service.features.slice(0, isDigitalFte ? 4 : 3).map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shrink-0" />
                    <span className="line-clamp-1">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom: Tech Stack Pills & Purpose-driven Action Link */}
            <div className="pt-4 mt-5 border-t border-border/70 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {service.techStack.slice(0, isDigitalFte ? 4 : 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-white/[0.04] text-muted-foreground border border-slate-200/80 dark:border-white/[0.06] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 inline-flex items-center gap-1.5 group/link cursor-pointer hover:underline"
                >
                  <SplitFlapLabel primary={action.primary} secondary={action.secondary} />
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
