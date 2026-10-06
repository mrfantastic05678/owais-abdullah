import React, { Suspense } from "react";
import { Metadata } from "next";
import SearchClient, { SearchResultItem } from "./SearchClient";
import { getBlogPosts } from "@/lib/blogs";
import { allProjects } from "@/data/profile";
import { services } from "@/data/services";
import { initialCuratedStack } from "@/data/curated-stack";

export const revalidate = 3600; // 1 hour ISR

export const metadata: Metadata = {
  title: "Search | Owais Abdullah — Engineering, AI Agents & Architecture",
  description:
    "Search articles, AI agent services, showcase projects, and developer tools across Owais Abdullah's portfolio.",
  robots: {
    index: false, // Standard SEO practice: prevent search result crawling loops
    follow: true,
  },
  alternates: {
    canonical: "https://owaisabdullah.dev/search",
  },
};

export default async function SearchPage() {
  const blogs = await getBlogPosts();

  const blogItems: SearchResultItem[] = blogs.map((b) => ({
    id: `blog-${b.slug.current}`,
    type: "article",
    title: b.title,
    description: b.summary || "Technical article on AI agents and SaaS engineering.",
    url: `/blog/${b.slug.current}`,
    badge: b.categories?.[0]?.title || "Article",
    metadata: b._createdAt ? new Date(b._createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
  }));

  const projectItems: SearchResultItem[] = allProjects.map((p) => ({
    id: `proj-${p.slug || p.title.toLowerCase().replace(/\s+/g, "-")}`,
    type: "project",
    title: p.title,
    description: p.description,
    url: p.slug ? `/projects/${p.slug}` : p.link,
    badge: p.category || "Project",
    metadata: p.techStack?.slice(0, 3).join(" · "),
  }));

  const serviceItems: SearchResultItem[] = Object.values(services).map((s) => ({
    id: `svc-${s.slug}`,
    type: "service",
    title: s.title,
    description: s.description,
    url: `/services/${s.slug}`,
    badge: "Service",
    metadata: s.tagline,
  }));

  const stackItems: SearchResultItem[] = (initialCuratedStack?.tools || []).map((t) => ({
    id: `stack-${t.slug}`,
    type: "stack",
    title: t.name,
    description: t.tagline || t.useCase,
    url: `/stack/${t.slug}`,
    badge: t.stackLayer || "Tool",
    metadata: t.category,
  }));

  const allItems = [...serviceItems, ...blogItems, ...projectItems, ...stackItems];

  return (
    <div className="min-h-screen pt-20 pb-24">
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted-foreground animate-pulse">
            Loading search index...
          </div>
        }
      >
        <SearchClient initialItems={allItems} />
      </Suspense>
    </div>
  );
}
