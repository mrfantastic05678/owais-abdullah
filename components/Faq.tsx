"use client";
import CharRevealHeading from "@/components/CharRevealHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Faq } from "@/types/post";

interface FaqProps {
  faqs: Faq[];
}

export default function FaqSection({ faqs }: FaqProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="my-8 sm:my-12">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-accent font-mono text-xs tracking-widest uppercase mb-2">Questions I get</h3>
        <CharRevealHeading
          as="h2"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground"
          highlightWords={["Questions"]}
        >
          Frequently Asked Questions
        </CharRevealHeading>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            value={`item-${index}`}
            key={index}
            className="border border-border rounded-lg bg-background/80 backdrop-blur-sm"
          >
            <AccordionTrigger className="p-3 sm:p-4 text-base sm:text-lg font-semibold text-left hover:text-primary transition-colors duration-300 hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="p-3 sm:p-4 pt-0 text-sm sm:text-base text-muted-foreground font-poppins">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
