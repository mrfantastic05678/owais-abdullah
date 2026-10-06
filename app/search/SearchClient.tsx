"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  BookOpen,
  Layers,
  Briefcase,
  Wrench,
  X,
  Sparkles,
  Command,
  CornerDownLeft,
} from "lucide-react";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";
import { cn } from "@/lib/utils";

export interface SearchResultItem {
  id: string;
  type: "article" | "project" | "service" | "stack";
  title: string;
  description: string;
  url: string;
  badge: string;
  metadata?: string;
}

interface SearchClientProps {
  initialItems: SearchResultItem[];
}

const TYPE_CONFIG = {
  all: { label: "All Index", icon: Sparkles, tag: "ALL" },
  article: { label: "Articles", icon: BookOpen, tag: "BLOG" },
  project: { label: "Projects", icon: Layers, tag: "BUILD" },
  service: { label: "Services", icon: Briefcase, tag: "SOLUTIONS" },
  stack: { label: "Stack Tools", icon: Wrench, tag: "TOOLS" },
};

export default function SearchClient({ initialItems }: SearchClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<
    "all" | "article" | "project" | "service" | "stack"
  >("all");
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (currentQ !== query) {
      setQuery(currentQ);
    }
  }, [searchParams]);

  // Keyboard shortcut: Cmd+K / Ctrl+K to focus input, Esc to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && query) {
        handleQueryChange("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [query]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("q", val.trim());
    } else {
      params.delete("q");
    }
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialItems.filter((item) => {
      const matchesType = selectedType === "all" || item.type === selectedType;
      if (!matchesType) return false;
      if (!q) return true;

      const haystack = `${item.title} ${item.description} ${item.badge} ${
        item.metadata || ""
      }`.toLowerCase();
      return haystack.includes(q);
    });
  }, [initialItems, query, selectedType]);

  const counts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = q
      ? initialItems.filter((i) =>
          `${i.title} ${i.description} ${i.badge} ${
            i.metadata || ""
          }`.toLowerCase().includes(q)
        )
      : initialItems;

    return {
      all: items.length,
      article: items.filter((i) => i.type === "article").length,
      project: items.filter((i) => i.type === "project").length,
      service: items.filter((i) => i.type === "service").length,
      stack: items.filter((i) => i.type === "stack").length,
    };
  }, [initialItems, query]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="text-center mb-10 sm:mb-12">
        {/* Dossier status pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/25 bg-teal-500/10 text-teal-700 dark:text-teal-300 mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase">
            Knowledge &amp; Architecture Registry
          </span>
        </div>

        {/* Newsreader serif headline */}
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-normal text-foreground tracking-tight mb-4 leading-[1.15]"
          style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
        >
          Search Systems, Articles &amp; Tooling
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Full-index discovery across autonomous AI agents, spec-driven SaaS products,
          technical blueprints, and production infrastructure.
        </p>
      </div>

      {/* Editorial Search Command Box */}
      <div className="relative mb-6">
        <div className="relative flex items-center rounded-2xl border border-border bg-[#031215] dark:bg-[#031215] dark:border-[#143B42] shadow-sm transition-all focus-within:border-teal-500/60 focus-within:ring-2 focus-within:ring-teal-500/20">
          <Search className="absolute left-4 sm:left-5 w-5 h-5 text-teal-600 dark:text-teal-400 pointer-events-none stroke-[2]" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search AI agents, Digital FTE, Next.js, n8n, OpenAI SDK, pricing..."
            className="w-full pl-12 sm:pl-14 pr-24 py-4 sm:py-4.5 bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm sm:text-base outline-none font-normal"
            autoFocus
          />

          {/* Right Action Hint */}
          <div className="absolute right-3 sm:right-4 flex items-center gap-1.5">
            {query ? (
              <button
                onClick={() => handleQueryChange("")}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors cursor-pointer"
                aria-label="Clear search"
                title="Clear query (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/75 bg-card/80 px-2 py-0.5 rounded-md border border-border/80 shadow-xs">
                {isMac ? (
                  <>
                    <Command className="w-3 h-3" />
                    <span>K</span>
                  </>
                ) : (
                  <span>Ctrl + K</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Filter Counter Pill */}
        {query && (
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2.5 px-2">
            <span>
              Found <strong className="text-foreground">{filteredResults.length}</strong> matching entries for &ldquo;{query}&rdquo;
            </span>
            <button
              onClick={() => handleQueryChange("")}
              className="font-mono text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
            >
              Reset search
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar border-b border-border/60">
        {(["all", "article", "project", "service", "stack"] as const).map((type) => {
          const config = TYPE_CONFIG[type];
          const Icon = config.icon;
          const count = counts[type];
          const isActive = selectedType === type;

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0 cursor-pointer",
                isActive
                  ? "bg-teal-500/10 border-teal-500/40 text-teal-700 dark:text-teal-300 shadow-xs"
                  : "bg-card/70 border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="w-3.5 h-3.5 opacity-80" />
              <span>{config.label}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-mono",
                  isActive
                    ? "bg-teal-500/20 text-teal-800 dark:text-teal-200"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Feed */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-20 px-4 border border-dashed border-border rounded-2xl bg-card/40">
          <p className="text-base font-semibold text-foreground mb-1.5 font-heading">
            No index records found
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
            No entries match &ldquo;{query}&rdquo; under the {TYPE_CONFIG[selectedType].label} category.
            Try terms like &ldquo;agent&rdquo;, &ldquo;SaaS&rdquo;, &ldquo;MCP&rdquo;, or &ldquo;Octively&rdquo;.
          </p>
          {query && (
            <button
              onClick={() => handleQueryChange("")}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold underline underline-offset-4 cursor-pointer"
            >
              Clear current query filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredResults.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-teal-500/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {item.badge}
                  </span>
                  {item.metadata && (
                    <span className="text-[11px] text-muted-foreground font-mono truncate">
                      {item.metadata}
                    </span>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 shrink-0 sm:self-center">
                <SplitFlapLabel primary="View Entry" secondary="Open →" className="min-w-[6.2rem]" />
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
