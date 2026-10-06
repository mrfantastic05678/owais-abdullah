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

const badgeMap: Record<string, string> = {
  "digital-fte": "CORE INNOVATION",
  "custom-ai-agents": "SWARMS",
  "saas-development": "PRODUCTION",
  "ecommerce-cms": "E-COMMERCE",
  "ai-consulting": "SPEC-FIRST",
  "api-integrations": "PIPELINES",
};

export default function ServicesGrid() {
  const servicesList = Object.values(services);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {servicesList.map((service) => {
        const Icon = iconMap[service.icon] || Lightbulb;
        const badge = badgeMap[service.slug] || "PRODUCTION";

        return (
          <div
            key={service.slug}
            className="clean-glass-card rounded-xl group p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
          >
            {/* Top row: Icon + Pill Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-[#072428] border border-teal-200/80 dark:border-teal-700/50 flex items-center justify-center text-teal-700 dark:text-teal-300 group-hover:scale-105 transition-transform shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-700/60 bg-teal-50 text-teal-800 dark:bg-[#042024] dark:text-teal-300 shadow-xs">
                  {badge}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-2">
                  {service.description}
                </p>
              </div>

              {/* Feature Bullets */}
              <ul className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                {service.features.slice(0, 3).map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shrink-0" />
                    <span className="line-clamp-1">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom: Tech Stack Pills & Learn More Link */}
            <div className="pt-4 mt-4 border-t border-border/70 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {service.techStack.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#072428] text-slate-700 dark:text-teal-200 border border-slate-200/60 dark:border-teal-800/40 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 inline-flex items-center gap-1.5 group/link cursor-pointer"
                >
                  <SplitFlapLabel primary="Learn More" secondary="View Specs" />
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
