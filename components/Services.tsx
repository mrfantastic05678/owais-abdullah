"use client";

import React from "react";
import { motion } from "framer-motion";
import ServicesGrid from "@/components/ServicesGrid";
import CharRevealHeading from "@/components/CharRevealHeading";
import ProcessSteps from "@/components/ProcessSteps";

const PROCESS_STEPS = [
  { num: "01", title: "Spec", desc: "We write down exactly what the system must do before code exists." },
  { num: "02", title: "Build", desc: "Agents, app, or automation — built against the spec, not around it." },
  { num: "03", title: "Deploy", desc: "Production infrastructure, proactive monitoring, and handover docs." },
  { num: "04", title: "Operate", desc: "The system runs reliably 24/7; you get reports, not surprises." },
];

const Services = () => {
  return (
    <>
      <section className="max-w-7xl mx-auto scroll-smooth">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center py-16 px-4"
        >
          <p className="text-base text-accent font-medium sm:text-lg mb-2">What I Offer</p>
          <CharRevealHeading
            as="h2"
            className="text-4xl md:text-5xl font-semibold text-foreground mb-3"
            highlightWords={["build"]}
          >
            What I build
          </CharRevealHeading>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            AI systems and web products that hold up in production — from
            autonomous agents to full SaaS builds.
          </p>
        </motion.div>

        <div className="px-5 pb-24">
          <ServicesGrid />
        </div>
      </section>

      <ProcessSteps
        eyebrow="How it works"
        heading="Spec first, then ship."
        headingHighlight={["Spec", "first"]}
        description="Every system starts as a written spec — so you know what you're getting before a line of code exists."
        steps={PROCESS_STEPS}
      />
    </>
  );
};

export default Services;
