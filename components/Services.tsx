"use client";

import React from "react";
import { motion } from "framer-motion";
import ServicesGrid from "@/components/ServicesGrid";

const Services = () => {
  return (
    <section className="max-w-7xl mx-auto scroll-smooth">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 px-4"
      >
        <p className="text-base text-accent font-medium sm:text-lg mb-2">
          What I Offer
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-3">
          Services
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Transform your business with AI-driven solutions and modern web
          development. From autonomous agents to scalable SaaS products.
        </p>
      </motion.div>

      <div className="px-5 pb-24">
        <ServicesGrid />
      </div>
    </section>
  );
};

export default Services;
