"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import {
  Bot,
  Zap,
  Rocket,
  ShoppingCart,
  Lightbulb,
  Cpu,
  LucideIcon,
} from "lucide-react";
import ServiceHeroIcon from "./ServiceHeroIcon";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

// Icon mapping inside client component
const iconMap: Record<string, LucideIcon> = {
  Bot,
  Zap,
  Rocket,
  ShoppingCart,
  Lightbulb,
  Cpu,
};

interface ServiceHeroContentProps {
  title: string;
  tagline: string;
  longDescription: string;
  iconName: string;
  gradient: string;
}

const ServiceHeroContent: React.FC<ServiceHeroContentProps> = ({
  title,
  tagline,
  longDescription,
  iconName,
  gradient,
}) => {
  const Icon = iconMap[iconName] || Lightbulb;

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient blob */}
      <div
        className={`absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-10`}
      />
      <div
        className={`absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-5`}
      />

      <div className="max-w-7xl mx-auto px-5 py-24 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <Link
                href="/services"
                className="inline-flex items-center text-xs font-mono font-medium text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 mr-1 rotate-180" />
                Back to Services
              </Link>
              <span className="text-muted-foreground/40 text-xs">/</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 text-[11px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PRODUCTION SPEC
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-teal-600 dark:text-teal-400 font-semibold mb-4"
            >
              {tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6"
            >
              {longDescription}
            </motion.p>

            {/* Micro-specs telemetry pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-2 sm:gap-2.5 mb-8 text-xs font-mono text-muted-foreground"
            >
              <span className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-teal-900/50 bg-white dark:bg-[#081B1E] text-foreground font-medium shadow-2xs">
                ✓ 100% Type-Safe
              </span>
              <span className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-teal-900/50 bg-white dark:bg-[#081B1E] text-foreground font-medium shadow-2xs">
                ✓ Written Spec Included
              </span>
              <span className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-teal-900/50 bg-white dark:bg-[#081B1E] text-emerald-600 dark:text-emerald-400 font-medium shadow-2xs">
                ✓ Production Ready
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="#contact">
                <button className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 rounded-md font-medium transition-all shadow-md cursor-pointer">
                  <SplitFlapLabel primary="Get Started" secondary="Let's Build It" className="min-w-[7.5rem]" />
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#pricing">
                <button className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-foreground bg-card hover:bg-teal-500/10 border border-border hover:border-teal-500 rounded-md font-medium transition-all cursor-pointer min-w-[10rem]">
                  <SplitFlapLabel primary="View Pricing" secondary="See Packages" className="min-w-[8rem]" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right side - Large Animated Icon */}
          <div className="order-1 md:order-2 flex justify-center">
            <ServiceHeroIcon icon={Icon} gradient={gradient} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHeroContent;
