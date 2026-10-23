"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Faq } from "@/types/post";
import { HelpCircle } from "lucide-react";

interface FaqProps {
  faqs: Faq[];
}

export default function FaqSection({ faqs }: FaqProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section id="faqs" className="mt-12 pt-8 border-t border-border/80 scroll-mt-28">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-accent" />
        <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Architecture FAQs
        </h3>
      </div>
      <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            value={`item-${index}`}
            key={index}
            className="rounded-xl border border-border/80 dark:border-[#143B42] bg-white dark:bg-[#031215] px-4 sm:px-5 py-0 overflow-hidden transition-all data-[state=open]:border-accent data-[state=open]:bg-secondary/60 dark:data-[state=open]:bg-[#04171B] shadow-xs"
          >
            <AccordionTrigger className="py-4 text-xs sm:text-sm font-semibold text-left text-foreground hover:text-accent transition-colors hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 text-xs sm:text-[13px] text-muted-foreground leading-relaxed border-t border-border/60 dark:border-[#143B42]/80">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
