import FaqSection from "@/components/Faq";
import { JsonLdFaq } from "@/components/JsonLdFaq";

const HOME_FAQS = [
  {
    question: "What exactly is a Digital FTE?",
    answer:
      "An AI agent set up to own a specific role in your business — with your SOPs, your tools, and defined outputs — rather than a chatbot that waits to be asked. It reads the inbox, runs the workflow, and reports back on a schedule.",
  },
  {
    question: "How long does an AI chatbot take to launch?",
    answer:
      "A document-trained, embedded chatbot is typically live in days, not months. Custom agent systems depend on scope — the spec phase tells us the timeline before you commit to anything.",
  },
  {
    question: "Do you hand over the code?",
    answer:
      "Yes. You get the repository, deployment access, and documentation. No lock-in — the system is yours.",
  },
  {
    question: "What do you build with?",
    answer:
      "TypeScript and Next.js for products, Python and the OpenAI Agents SDK for agents, PostgreSQL and vector search for data, Sanity for content. Deployment on Vercel or your own infrastructure.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Fixed-scope projects are quoted after the spec phase, so the price is based on a written definition of the system — not an estimate from a call. Ongoing operation and support are separate, optional retainers.",
  },
  {
    question: "What happens after launch?",
    answer:
      "The system runs in production with monitoring in place. You get reports and a direct line to me — and if you have a team, they get a handover so they can operate it themselves.",
  },
  {
    question: "Can an agent really replace a hire?",
    answer:
      "For repetitive, rule-based roles — inbox triage, reporting, data entry, content pipelines — yes, and it works around the clock. For judgment-heavy roles, agents assist rather than replace. The spec phase is where we're honest about which one your case is.",
  },
];

export default function HomeFaq() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-5 py-24 border-b border-border">
      <JsonLdFaq faqs={HOME_FAQS} />
      <FaqSection faqs={HOME_FAQS} />
    </section>
  );
}
