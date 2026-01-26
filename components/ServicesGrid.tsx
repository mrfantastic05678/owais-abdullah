"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import { ArrowRight } from "lucide-react";
import {
  Bot,
  Zap,
  Rocket,
  ShoppingCart,
  Lightbulb,
  Cpu,
} from "lucide-react";

// Icon mapping with explicit string keys to match service data
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Bot": Bot,
  "Zap": Zap,
  "Rocket": Rocket,
  "ShoppingCart": ShoppingCart,
  "Lightbulb": Lightbulb,
  "Cpu": Cpu,
};

// Gradient colors mapping
const gradientColors: Record<string, { from: string; to: string }> = {
  "from-blue-500 to-cyan-500": { from: "#3b82f6", to: "#06b6d4" },
  "from-purple-500 to-pink-500": { from: "#a855f7", to: "#ec4899" },
  "from-orange-500 to-red-500": { from: "#f97316", to: "#ef4444" },
  "from-green-500 to-emerald-500": { from: "#22c55e", to: "#10b981" },
  "from-yellow-500 to-orange-500": { from: "#eab308", to: "#f97316" },
  "from-indigo-500 to-purple-500": { from: "#6366f1", to: "#a855f7" },
};

// Helper function to get gradient CSS
function getGradient(gradientClass: string): string {
  const colors = gradientColors[gradientClass];
  if (colors) {
    return `linear-gradient(to bottom right, ${colors.from}, ${colors.to})`;
  }
  // Fallback gradient
  return `linear-gradient(to bottom right, #6366f1, #a855f7)`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const ServicesGrid = () => {
  const servicesList = Object.values(services);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {servicesList.map((service) => {
        const Icon = iconMap[service.icon] || Lightbulb;
        return (
          <motion.div
            key={service.slug}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <Link href={`/services/${service.slug}`}>
              <div className="scroll-smooth border border-border rounded-xl overflow-hidden shadow-lg bg-card h-full hover:shadow-xl transition-all duration-300">
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Icon section */}
                <div className="relative p-6">
                  <div
                    className="relative w-16 h-16 rounded-xl mb-4"
                    style={{
                      background: getGradient(service.gradient),
                      padding: "3px"
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full rounded-xl bg-card flex items-center justify-center"
                    >
                      <Icon className="w-8 h-8 text-accent" />
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center text-xs text-muted-foreground"
                      >
                        <div className="w-1 h-1 rounded-full bg-accent mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Learn more link */}
                  <div className="flex items-center text-accent text-sm font-medium">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ServicesGrid;
