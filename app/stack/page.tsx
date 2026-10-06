// app/stack/page.tsx
import { client } from '@/sanity/lib/client'
import { allToolReviewsQuery, featuredToolReviewsQuery } from '@/lib/sanity/queries'
import { ToolReview } from '@/types/stack'
import { StackCard } from '@/components/stack/StackCard'
import { StackFilter } from '@/components/stack/StackFilter'
import { Metadata } from 'next'
import Link from 'next/link'
import SplitFlapLabel from '@/components/ui/SplitFlapLabel'

export const metadata: Metadata = {
  title: 'The Agent Stack — Tools I Use to Build Digital FTEs | Owais Abdullah',
  description:
    'A curated, opinionated toolkit of AI frameworks, MCP servers, and infrastructure I use to build autonomous AI employees in production. No affiliate links. No scraped lists.',
  openGraph: {
    title: 'The Agent Stack — Owais Abdullah',
    description: 'The exact tools behind my Digital FTEs and AI agent systems.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://owaisabdullah.dev/stack',
  },
}

export default async function StackPage() {
  const allTools: ToolReview[] = await client.fetch(allToolReviewsQuery)
  const featured: ToolReview[] = await client.fetch(featuredToolReviewsQuery)

  const categories = Array.from(new Set(allTools.map((t) => t.category)))

  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      {/* Hero */}
      <section className="mb-16">
        <p className="text-xs font-mono text-accent mb-3 tracking-wider">THE AGENT STACK</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Tools I use to build AI employees that never clock out.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          This is not a scraped directory. These are the exact frameworks, MCP servers,
          and infrastructure I run in production for Digital FTEs, ShopMate, and Octively.
          Every entry includes when I recommend it to a client — and when I don&apos;t.
        </p>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-sm font-semibold tracking-wide text-foreground">ESSENTIAL LAYER</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {featured.map((tool) => (
              <StackCard key={tool._id} tool={tool} featured />
            ))}
          </div>
        </section>
      )}

      {/* Filterable Grid */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-sm font-semibold tracking-wide text-foreground">ALL TOOLS</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <StackFilter categories={categories} tools={allTools} />
      </section>

      {/* CTA */}
      <section className="relative rounded-2xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative p-8">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            Want an AI employee built on this exact stack?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl leading-relaxed">
            I design, build, and operate autonomous agent systems for agencies and SaaS teams.
            Every system starts with a written spec.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white rounded-xl font-medium text-sm transition shadow-md hover:opacity-95"
          >
            <SplitFlapLabel primary="Book a Spec Call" secondary="Schedule 30m" />
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="mt-16 pt-10 border-t border-border/60">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Why This Stack Wins</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] shadow-xs">
            <h3 className="text-red-500 dark:text-red-400 font-semibold mb-3 text-xs tracking-wider uppercase font-mono">WHAT OTHERS DO</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-500/80 mt-0.5">×</span>
                Scrape 500 tools into a table
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500/80 mt-0.5">×</span>
                Generic descriptions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500/80 mt-0.5">×</span>
                No opinion or ratings
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500/80 mt-0.5">×</span>
                Affiliate links everywhere
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] shadow-xs">
            <h3 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-3 text-xs tracking-wider uppercase font-mono">WHAT I DO</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600/80 mt-0.5">✓</span>
                Curate tools I actually use
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600/80 mt-0.5">✓</span>
                Personal use cases with real projects
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600/80 mt-0.5">✓</span>
                Honest ratings (3/5 when deserved)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600/80 mt-0.5">✓</span>
                Zero affiliates. Trust only.
              </li>
            </ul>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] shadow-xs">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">The Stack as Proof:</strong> This page isn&apos;t a product — it&apos;s proof of work.
            When I recommend OpenAI Agents SDK or LiteLLM, it&apos;s because I run them in production for ShopMate,
            Octively, and Digital FTEs. Every tool here pays rent.
          </p>
        </div>
      </section>
    </main>
  )
}
