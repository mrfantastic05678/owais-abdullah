import React from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import CharRevealHeading from "@/components/CharRevealHeading";
import StatusDot from "@/components/ui/StatusDot";

const COMPARISON = [
  { label: "Hours", human: "9–5, weekends off", fte: "24 / 7" },
  { label: "Ramp-up", human: "Weeks of onboarding", fte: "Deployed with your SOPs" },
  { label: "Cost", human: "Salary + benefits + overhead", fte: "Fixed subscription, no overhead" },
  { label: "Scaling", human: "Hire again", fte: "Clone the agent" },
  { label: "Consistency", human: "Varies by day", fte: "Same output, every run" },
  { label: "Supervision", human: "Needs active management", fte: "Self-operating, exception-only" },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative text-muted-foreground overflow-hidden py-24 border-y border-border bg-card/20">
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
          {/* Comparison table — the section's exhibit, now leading (mirrors hero) */}
          <aside data-cursor="live" data-cursor-label="LIVE" className="order-2 lg:order-1 rounded-xl bg-card overflow-hidden border border-border shadow-[0_12px_30px_rgba(0,0,0,0.35)] w-full">
            <header className="px-4 py-2.5 border-b border-border flex justify-between items-center bg-background text-[0.72rem] tracking-[0.08em] text-muted-foreground">
              <span className="font-mono uppercase">agent-status</span>
              <span className="inline-flex items-center gap-2 text-signal-500 font-mono uppercase font-bold">
                <StatusDot size={6} />
                ONLINE
              </span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-[0.85rem] border-collapse text-left min-w-[540px]">
                <thead>
                  <tr>
                    <th className="px-4 py-3.5 border-b border-border font-medium text-muted-foreground w-1/4"></th>
                    <th className="px-4 py-3.5 border-b border-border font-semibold text-foreground w-[37.5%]">Human hire</th>
                    <th className="px-4 py-3.5 border-b border-border font-semibold text-accent w-[37.5%]">Digital FTE</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(({ label, human, fte }, i) => {
                    const isLast = i === COMPARISON.length - 1;
                    const cell = `px-4 py-3.5 ${isLast ? "" : "border-b border-border/50"}`;
                    return (
                      <tr key={label}>
                        <th className={`${cell} font-normal text-muted-foreground`}>{label}</th>
                        <td className={cell}>{human}</td>
                        <td className={`${cell} font-semibold text-signal-500`}>{fte}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </aside>

          {/* Text column — now trailing, left-aligned */}
          <div className="order-1 lg:order-2 text-left">
            <span className="text-accent font-mono text-xs tracking-widest uppercase mb-3 block">
              What I do
            </span>
            <CharRevealHeading
              as="h2"
              className="text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.15] mb-5 font-heading font-semibold text-foreground"
              highlightWords={["AI", "employees"]}
            >
              I build AI employees that never clock out.
            </CharRevealHeading>
            <p className="mb-4 leading-[1.7] text-muted-foreground">
              Digital FTEs, agent systems, and automations that own real work — built and operated
              by the founder of Octively, not outsourced to a deck.
            </p>
            <p className="mb-6 leading-[1.7] text-muted-foreground">
              An AI employee gets your SOPs, your tools, and a defined output. The table is the
              honest version of what that means.
            </p>
            <Link
              href="#story"
              className="link-bracket group inline-flex items-center gap-1 text-accent hover:text-signal-500 font-medium font-mono transition-colors"
            >
              <span className="bracket bracket-l" aria-hidden="true">[</span>
              See how an agent takes a job
              <span className="bracket bracket-r" aria-hidden="true">]</span>
              <FaChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
