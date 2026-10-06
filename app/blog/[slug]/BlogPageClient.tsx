"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { CustomComponent } from "@/components/CustomComponent";
import EditorialTableOfContents from "@/components/EditorialTableOfContents";
import BlogImageWithSkeleton from "@/components/BlogImageWithSkeleton";
import RelatedPosts from "@/components/RelatedPosts";
import BlogAuthorCard from "@/components/BlogAuthorCard";
import RecentPostsList, { RecentPost } from "@/components/RecentPostsList";
import GooglePreferredSourceButton from "@/components/GooglePreferredSourceButton";
import FaqSection from "@/components/Faq";
import { JsonLdFaq } from "@/components/JsonLdFaq";
import JsonLdBlog from "@/components/JsonLdBlog";
import BlogCommentsSection from "@/components/comments/BlogCommentsSection";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";
import { Post } from "@/types/post";
import {
  Calendar,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Check,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface BlogPageClientProps {
  blog: Post;
  slug: string;
  recentPosts: RecentPost[];
}

function estimateReadingTime(content: any[]): { words: number; minutes: number } {
  if (!Array.isArray(content)) return { words: 850, minutes: 4 };
  let wordCount = 0;
  content.forEach((block) => {
    if (block?.children && Array.isArray(block.children)) {
      block.children.forEach((child: any) => {
        if (typeof child?.text === "string") {
          wordCount += child.text.trim().split(/\s+/).filter(Boolean).length;
        }
      });
    }
  });
  if (wordCount === 0) wordCount = 850;
  const minutes = Math.max(1, Math.round(wordCount / 220));
  return { words: wordCount, minutes };
}

export default function BlogPageClient({
  blog,
  slug,
  recentPosts,
}: BlogPageClientProps) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [shareToast, setShareToast] = useState(false);

  // 1. Initial vote fetch & local sync
  useEffect(() => {
    const savedVote = localStorage.getItem(`vote_${slug}`);
    if (savedVote === "like" || savedVote === "dislike") {
      setUserVote(savedVote);
    }

    fetch(`/api/like?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.likes === "number") setLikes(data.likes);
        if (typeof data.dislikes === "number") setDislikes(data.dislikes);
      })
      .catch(() => {});

    // Session view count tracking
    const viewedKey = `viewed_post_${slug}`;
    if (!sessionStorage.getItem(viewedKey)) {
      sessionStorage.setItem(viewedKey, "true");
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      }).catch(() => {});
    }
  }, [slug]);

  // 2. Reading progress scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) {
        setReadingProgress(100);
        return;
      }
      const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)));
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Vote handler
  const handleVote = async (action: "like" | "dislike") => {
    const newAction = userVote === action ? `un${action}` : action;
    const nextVote = userVote === action ? null : action;

    setUserVote(nextVote);
    if (nextVote) {
      localStorage.setItem(`vote_${slug}`, nextVote);
    } else {
      localStorage.removeItem(`vote_${slug}`);
    }

    // Optimistic UI update
    let nextLikes = likes;
    let nextDislikes = dislikes;

    if (action === "like") {
      nextLikes = userVote === "like" ? likes - 1 : likes + 1;
      if (userVote === "dislike") nextDislikes = Math.max(0, dislikes - 1);
    } else {
      nextDislikes = userVote === "dislike" ? dislikes - 1 : dislikes + 1;
      if (userVote === "like") nextLikes = Math.max(0, likes - 1);
    }

    setLikes(Math.max(0, nextLikes));
    setDislikes(Math.max(0, nextDislikes));

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: newAction }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.likes === "number") setLikes(data.likes);
        if (typeof data.dislikes === "number") setDislikes(data.dislikes);
      }
    } catch (err) {
      console.error("Error submitting vote:", err);
    }
  };

  // 4. Share article handler
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-3xl font-bold text-destructive mb-3 font-heading">
          Post Not Found
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mb-6">
          The requested article does not exist or has been removed.
        </p>
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-accent-foreground text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <SplitFlapLabel primary="Back to Blog" secondary="View All Posts" />
        </Link>
      </div>
    );
  }

  const { words, minutes } = estimateReadingTime(blog.content);
  const formattedDate = new Date(blog._createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Insights", href: "/blog" },
    { label: blog.title, href: `/blog/${slug}` },
  ];

  return (
    <>
      <JsonLdBlog blog={blog} slug={slug} />
      {blog.faqs && blog.faqs.length > 0 && <JsonLdFaq faqs={blog.faqs} />}

      {/* 1. Bottom Reading Progress Bar (Fixed at very bottom edge) */}
      <div className="fixed bottom-0 left-0 right-0 h-[3px] bg-secondary/80 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-[width] duration-75 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 2. Top Header Container (1380px max width · Center aligned) */}
      <header className="max-w-[1380px] mx-auto px-4 sm:px-6 pt-2 sm:pt-4 text-center">
        {/* Breadcrumb Navigation */}
        <div className="flex justify-center items-center mb-5">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Category Badge Pill */}
        <div className="flex justify-center items-center gap-2 mb-4 flex-wrap">
          {!blog.categories || blog.categories.length === 0 ? (
            <span className="font-mono text-[11px] font-bold text-accent bg-accent/10 border border-accent/20 px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              ARTICLE
            </span>
          ) : (
            blog.categories.map((cat: { title: string }, i: number) => (
              <span
                key={i}
                className="font-mono text-[11px] font-bold text-accent bg-accent/10 border border-accent/20 px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                {cat.title}
              </span>
            ))
          )}
        </div>

        {/* Centered Title */}
        <h1
          className="font-heading font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-foreground tracking-tight leading-[1.18] max-w-[1100px] mx-auto text-center mb-5"
          style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
        >
          {blog.title}
        </h1>

        {/* Centered Lead Summary */}
        {blog.summary && (
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[900px] mx-auto text-center mb-7 font-normal">
            {blog.summary}
          </p>
        )}

        {/* Byline Metadata Strip */}
        <div className="border-y border-border py-3 sm:py-3.5 px-4 mb-8 max-w-[1380px] mx-auto flex items-center justify-center gap-3 sm:gap-4.5 text-xs sm:text-[13px] text-muted-foreground flex-wrap">
          {/* Author avatar & title */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/owais-profile.png"
              alt="Owais Abdullah"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full border border-accent shrink-0 object-cover"
              priority
            />
            <span>
              By <strong className="text-foreground">{blog.author?.name || "Owais Abdullah"}</strong>{" "}
              <span className="text-muted-foreground/80 hidden sm:inline">(Founder, Octively)</span>
            </span>
          </div>

          <span className="text-muted-foreground/40 hidden sm:inline">·</span>

          {/* Verified Accuracy Badge */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] shrink-0 inline-block animate-pulse" />
            <span className="font-mono text-[10.5px] sm:text-[11px] font-bold text-accent tracking-wide uppercase">
              VERIFIED ACCURACY
            </span>
          </div>

          <span className="text-muted-foreground/40 hidden sm:inline">·</span>

          {/* Published Date */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>

          <span className="text-muted-foreground/40 hidden sm:inline">·</span>

          {/* Reading Time */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{minutes} Min Read ({words} Words)</span>
          </div>
        </div>

        {/* Framed Banner Image */}
        {blog.mainImage && (
          <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-xl sm:rounded-2xl overflow-hidden border border-border bg-card shadow-sm relative mb-10">
            <BlogImageWithSkeleton
              src={urlFor(blog.mainImage).url()}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 1380px) 100vw, 1380px"
              className="object-cover"
            />
          </div>
        )}
      </header>

      {/* 3. Main Grid (Desktop: 290px Left Sticky Sidebar + Reading Canvas | Mobile: Canvas First, Sidebar Second) */}
      <main className="max-w-[1380px] mx-auto px-4 sm:px-6 mb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6 items-start">
          {/* LEFT STICKY SIDEBAR */}
          <aside className="order-2 lg:order-1 w-full lg:w-[290px] lg:sticky lg:top-28 lg:self-start flex flex-col gap-4 z-20">
            {/* 1. Article Index Card */}
            <EditorialTableOfContents
              content={blog.content}
              hasFaqs={Boolean(blog.faqs && blog.faqs.length > 0)}
              variant="sidebar"
            />

            {/* 2. Google Preferred Source Card */}
            <GooglePreferredSourceButton variant="sidebar-card" placement="blog_sticky_sidebar" />

            {/* 3. Author Dossier Card */}
            <BlogAuthorCard author={blog.author} variant="sidebar" />

            {/* 4. Recent Posts Card */}
            <RecentPostsList posts={recentPosts} variant="sidebar" />
          </aside>

          {/* RIGHT READING CANVAS */}
          <article className="order-1 lg:order-2 w-full bg-card border border-border rounded-xl sm:rounded-2xl p-5 sm:p-7 md:p-9 shadow-sm min-w-0">
            {/* Mobile Quick-Jump Bar */}
            <EditorialTableOfContents
              content={blog.content}
              hasFaqs={Boolean(blog.faqs && blog.faqs.length > 0)}
              variant="mobile-bar"
            />

            {/* Article Content via CustomComponent (handles code with copy, quotes, lists, headings) */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={blog.content} components={CustomComponent} />
            </div>

            {/* Inline Google Preferred Source Card */}
            <div className="mt-10">
              <GooglePreferredSourceButton variant="card" placement="blog_post_canvas_end" />
            </div>

            {/* FAQs Accordion */}
            {blog.faqs && blog.faqs.length > 0 && <FaqSection faqs={blog.faqs} />}

            {/* Helpful / Needs Work Rating Box */}
            <div className="mt-10 p-5 sm:p-6 rounded-xl border border-[#143B42] dark:border-[#143B42] border-slate-300/80 bg-[#031215] dark:bg-[#031215] bg-[#EEF4F2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-foreground mb-1">
                  Was this article helpful?
                </h4>
                <p className="text-xs text-muted-foreground">
                  Your feedback helps improve our future articles and tutorials.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleVote("like")}
                  className={`group flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    userVote === "like"
                      ? "bg-accent/20 border-accent text-accent"
                      : "bg-[#081B1E] dark:bg-[#081B1E] bg-white border-[#18464E] dark:border-[#18464E] border-slate-300 text-muted-foreground hover:text-foreground hover:border-accent"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <SplitFlapLabel primary="Helpful" secondary="Upvote" />
                </button>

                <button
                  type="button"
                  onClick={() => handleVote("dislike")}
                  className={`group flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    userVote === "dislike"
                      ? "bg-destructive/20 border-destructive text-destructive"
                      : "bg-[#081B1E] dark:bg-[#081B1E] bg-white border-[#18464E] dark:border-[#18464E] border-slate-300 text-muted-foreground hover:text-foreground hover:border-destructive/60"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <SplitFlapLabel primary="Needs work" secondary="Feedback" />
                </button>
              </div>
            </div>

            {/* Discussion & Comments */}
            <BlogCommentsSection postSlug={slug} />
          </article>
        </div>
      </main>

      {/* 4. Engineering Solutions & Related Posts Section */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 w-full mb-20 space-y-12">
        {/* Contextual Service Callout: Routes PageRank to Money Pages */}
        <div className="rounded-2xl border border-[#143B42] dark:border-[#143B42] border-slate-300 bg-[#031215] dark:bg-[#031215] bg-[#EEF4F2] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-accent uppercase tracking-wider block mb-1.5">
              Production AI Implementation
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-2"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Ready to Deploy Autonomous AI Employees &amp; Agents?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Move beyond manual tutorials. We architect custom AI agents, 24/7 Digital FTEs,
              and spec-driven Next.js SaaS platforms tailored to your business operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/services/ai-agents"
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent-hover transition-colors shadow-xs"
            >
              <SplitFlapLabel primary="AI Agent Services" secondary="View Pricing →" className="min-w-[7.2rem]" />
              <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/services/digital-fte"
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-border bg-card/80 text-foreground hover:border-accent/40 transition-colors"
            >
              <SplitFlapLabel primary="Digital FTEs" secondary="Learn More" className="min-w-[5.8rem]" />
            </Link>
          </div>
        </div>

        <RelatedPosts
          currentSlug={slug}
          categories={blog.categories?.map((c) => c.title) || []}
          limit={3}
        />
      </section>

      {/* 5. Floating Dynamic Island Pill (Fixed bottom center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#081B1E]/95 dark:bg-[#081B1E]/95 bg-card/95 text-foreground border border-border rounded-full shadow-2xl backdrop-blur-xl px-4 py-2 flex items-center gap-3 sm:gap-3.5 text-xs font-medium">
        {/* Reading % */}
        <div className="flex items-center gap-1.5 font-mono text-accent font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>{readingProgress}%</span>
          <span className="hidden sm:inline text-muted-foreground text-[10px]">READ</span>
        </div>

        <div className="w-px h-4 bg-border" />

        {/* Like / Helpful button */}
        <button
          type="button"
          onClick={() => handleVote("like")}
          className={`flex items-center gap-1.5 transition-colors ${
            userVote === "like" ? "text-accent font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
          title="Mark as helpful"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-border" />

        {/* Jump to Comments */}
        <a
          href="#comments"
          className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          title="Jump to discussion"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            <SplitFlapLabel primary="Discuss" secondary="Comments" />
          </span>
        </a>

        <div className="w-px h-4 bg-border" />

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="text-muted-foreground hover:text-accent transition-colors p-0.5"
          title="Share article URL"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Share Toast Notification */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-card border border-accent text-accent shadow-xl text-xs font-semibold flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Article link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
