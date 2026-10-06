"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";
import type { Project } from "@/data/profile";

interface ProjectsByCategory {
  [category: string]: Project[];
}

interface ProjectsTabProps {
  projectsByCategory: ProjectsByCategory;
  allProjects: Project[];
}

const PROJECTS_PER_PAGE = 9;
const ALL_TAB = "All";

const hasValidLink = (link: string) => link && link !== "#";

export default function ProjectTabs({
  projectsByCategory,
  allProjects,
}: ProjectsTabProps) {
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({});
  const rawCategories = Object.keys(projectsByCategory);
  const FTE_TAB = "Digital FTE";
  const otherCats = rawCategories.filter((c) => c !== FTE_TAB);
  const categories = rawCategories.includes(FTE_TAB)
    ? [ALL_TAB, FTE_TAB, ...otherCats]
    : [ALL_TAB, ...rawCategories];
  const [activeTab, setActiveTab] = useState(ALL_TAB);

  useEffect(() => {
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    if (tabParam && categories.includes(tabParam)) {
      setActiveTab(tabParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (category: string) => {
    setActiveTab(category);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", category);
    window.history.replaceState(null, "", url.toString());
  };

  const handleLoadMore = (category: string) => {
    const total =
      category === ALL_TAB
        ? allProjects.length
        : (projectsByCategory[category] || []).length;
    setVisibleCount((prev) => ({
      ...prev,
      [category]: Math.min(
        (prev[category] || PROJECTS_PER_PAGE) + PROJECTS_PER_PAGE,
        total
      ),
    }));
  };

  return (
    <section id="projects" className="max-w-7xl mx-auto px-5 py-16 sm:py-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-teal-700 dark:text-teal-400">
            PROVEN BUILDS
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
            Selected Projects
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mt-1">
            Shipped AI employees, Next.js SaaS platforms, and enterprise e-commerce systems built with written specs.
          </p>
        </div>
        <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-border bg-card/80 text-muted-foreground w-fit">
          {allProjects.length} REPOSITORIES &amp; APPS
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-8">
        <div className="flex justify-start overflow-x-auto pb-2.5 pt-1 theme-scrollbar">
          <TabsList className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl border border-slate-300 dark:border-teal-900/60 bg-white dark:bg-[#05181b] shadow-sm flex-nowrap shrink-0">
            {categories.map((category) => {
              const count =
                category === ALL_TAB
                  ? allProjects.length
                  : projectsByCategory[category]?.length || 0;

              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border border-slate-200/70 dark:border-teal-900/40 bg-slate-100/80 dark:bg-[#081e22] text-slate-700 dark:text-teal-200 hover:bg-slate-200 dark:hover:bg-teal-900/60 data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-700 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <span>{category}</span>
                  <span className="ml-1.5 text-[10px] font-mono opacity-80">
                    ({count})
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content Cards Grid */}
        {categories.map((category) => {
          const projects =
            category === ALL_TAB
              ? allProjects
              : projectsByCategory[category] || [];
          const currentVisible = visibleCount[category] || PROJECTS_PER_PAGE;
          const visibleProjects = projects.slice(0, currentVisible);
          const hasMore = projects.length > currentVisible;

          return (
            <TabsContent key={category} value={category} className="mt-0 space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map((project, index) => (
                  <div
                    key={`${category}-${project.title}-${index}`}
                    className="clean-glass-card rounded-xl group overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
                  >
                    <div>
                      {/* Image Preview with Category Badge */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-border/60">
                        <Image
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={project.image || "/assets/placeholder.png"}
                          alt={project.title}
                          width={600}
                          height={350}
                          loading="lazy"
                          unoptimized
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/95 text-teal-900 border border-teal-300/80 shadow-md backdrop-blur-md dark:bg-[#031518]/95 dark:text-teal-200 dark:border-teal-500/50">
                          {project.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-3">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                          {project.title}
                        </h3>

                        {/* Tech Tag Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#072428] text-slate-700 dark:text-teal-200 border border-slate-200/60 dark:border-teal-800/40 font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-5 pt-3 border-t border-border/70 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {project.slug && (
                          <Link
                            href={`/projects/${project.slug}`}
                            className="font-bold text-teal-700 dark:text-teal-400 inline-flex items-center gap-1 group/link"
                          >
                            <SplitFlapLabel primary="Case Study & Setup" secondary="Read System Spec" />
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                          </Link>
                        )}
                        {hasValidLink(project.link) && project.link !== `/projects/${project.slug}` && (
                          <Link
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-1 group/demo"
                          >
                            <SplitFlapLabel primary="Live Demo" secondary="Launch App" />
                            <ExternalLink className="w-3 h-3 group-hover/demo:translate-x-0.5 transition-transform" />
                          </Link>
                        )}
                        {!project.slug && !hasValidLink(project.link) && (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            Private build
                          </span>
                        )}
                      </div>

                      {project.repoUrl && project.repoUrl !== "#" && (
                        <Link
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          aria-label={`${project.title} GitHub repository`}
                        >
                          <FaGithub className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => handleLoadMore(category)}
                    className="group px-6 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-mono font-bold inline-flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                  >
                    <SplitFlapLabel primary="Load More Projects" secondary="Fetch Next Batch" />
                    <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
