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
              <div className="scroll-smooth bg-card border border-border rounded-xl overflow-hidden p-6 h-full transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_12px_30px_rgba(73,160,169,0.15)] group-hover:-translate-y-1">

                {/* Icon section */}
                <div className="relative mb-6">
                  <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center group-hover:border-accent transition-colors duration-300">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                </div>

                <h3 className="text-xl font-medium text-foreground mb-3">
                  {service.title}
                </h3>

                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-3 mb-6">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center text-xs text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Learn more link */}
                  <div className="flex items-center text-accent text-sm font-medium mt-auto pt-4 border-t border-border group-hover:border-accent/50 transition-colors">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
