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
            >
              <Link
                href="/services"
                className="inline-flex items-center text-muted-foreground hover:text-accent mb-6 transition-colors"
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                Back to Services
              </Link>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-accent font-medium mb-4"
            >
              {tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              {longDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="#contact">
                <button className="group inline-flex items-center px-8 py-3 text-white bg-gradient-to-br from-blue-900 via-accent to-blue-700 hover:from-blue-950 rounded-full font-medium transition-all">
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#pricing">
                <button className="inline-flex items-center px-8 py-3 text-foreground bg-card hover:bg-accent hover:text-white border-2 border-border hover:border-accent rounded-full font-medium transition-all">
                  View Pricing
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
