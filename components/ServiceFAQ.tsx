"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ServiceFAQProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const ServiceFAQ: React.FC<ServiceFAQProps> = ({ faqs }) => {
  return (
    <section className="py-20 border-t border-border/40">
      <div className="max-w-3xl mx-auto px-5">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-foreground mb-12 text-center"
        >
          Frequently Asked Questions
        </motion.h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white dark:bg-[#081B1E] rounded-2xl border border-slate-200/90 dark:border-[#10343A] px-6 shadow-xs hover:border-teal-500/50 hover:shadow-md transition-all"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default ServiceFAQ;
