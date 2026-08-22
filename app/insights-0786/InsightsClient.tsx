"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Search,
  Bot,
  MousePointerClick,
  XCircle,
  Trophy,
  SlidersHorizontal,
  Flame,
  Clock,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface PostAnalytics {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  _createdAt: string;
  views: number;
  likes: number;
  dislikes: number;
  netLikes: number;
  sentimentRatio: number;
  ageInDays: number;
  engagementScore: number;
  velocity: number;
  categories?: { title: string }[];
  author?: { name: string };
}

interface AnalyticsData {
  summary: {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    totalDislikes: number;
    avgViewsPerPost: number;
    overallSentiment: number;
  };
  posts: PostAnalytics[];
  topPerformers: PostAnalytics[];
  topLatest: PostAnalytics[];
  decreasingNeedsAttention: PostAnalytics[];
  promoAnalytics: {
    bannerActive: boolean;
    bannerMode: string;
    totalImpressions: number;
    totalClicks: number;
    totalDismissals: number;
    totalCtr: number;
    totalDismissRate: number;
    winner: string;
    variantA: {
      name: string;
      impressions: number;
      clicks: number;
      dismissals: number;
      ctr: number;
      dismissRate: number;
    };
    variantB: {
      name: string;
      impressions: number;
      clicks: number;
      dismissals: number;
      ctr: number;
      dismissRate: number;
    };
    lastUpdated: string;
  };
}

export default function InsightsClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);

  // Tabs & filters
  const [activeTab, setActiveTab] = useState<"top" | "latest" | "decreasing" | "all">("top");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"views" | "likes" | "dislikes" | "score" | "date">("score");

  // Check saved session auth
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("analytics_auth_token");
    if (savedPassword) {
      fetchAnalytics(savedPassword);
    }
  }, []);

  const fetchAnalytics = async (pass: string) => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });

      if (res.ok) {
        const payload = await res.json();
        setData(payload);
        setIsAuthenticated(true);
        sessionStorage.setItem("analytics_auth_token", pass);
      } else {
        const err = await res.json();
        setAuthError(err.error || "Incorrect password. Access denied.");
        sessionStorage.removeItem("analytics_auth_token");
      }
    } catch {
      setAuthError("Failed to connect to analytics server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    fetchAnalytics(passwordInput.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("analytics_auth_token");
    setIsAuthenticated(false);
    setPasswordInput("");
    setData(null);
  };

  const handleRefresh = () => {
    const pass = sessionStorage.getItem("analytics_auth_token");
    if (pass) fetchAnalytics(pass);
  };

  // Categories list
  const availableCategories = useMemo(() => {
    if (!data?.posts) return [];
    const set = new Set<string>();
    data.posts.forEach((p) => {
      p.categories?.forEach((c) => set.add(c.title));
    });
    return Array.from(set);
  }, [data?.posts]);

  // Filtered & Sorted All Posts
  const filteredAllPosts = useMemo(() => {
    if (!data?.posts) return [];
    let list = [...data.posts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      list = list.filter((p) => p.categories?.some((c) => c.title === categoryFilter));
    }

    list.sort((a, b) => {
      if (sortBy === "views") return b.views - a.views;
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "dislikes") return b.dislikes - a.dislikes;
      if (sortBy === "date") return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
      return b.engagementScore - a.engagementScore;
    });

    return list;
  }, [data?.posts, searchQuery, categoryFilter, sortBy]);

  // =========================================================================
  // 1. PASSWORD GATE SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-background text-foreground relative overflow-hidden">
        {/* Background ambient mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-card/90 border border-border rounded-2xl p-7 shadow-2xl backdrop-blur-xl relative z-10"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mb-3 shadow-inner">
              <Lock size={22} />
            </div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-accent font-bold mb-1">
              Private Access Only
            </span>
            <h1 className="text-2xl font-bold font-sans text-foreground">Analytics Vault</h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Enter your master key to view real-time blog metrics, views, like sentiment, and Octively promo A/B testing data.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <KeyRound size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle password visibility"
              >
                <Eye size={16} />
              </button>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2"
              >
                <ShieldAlert size={14} className="shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-semibold text-sm transition-all duration-200 shadow-md shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock size={15} />
                  <span>Unlock Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Route: /insights-0786</span>
            <span className="text-signal-500">noindex · secure</span>
          </div>
        </motion.div>
      </main>
    );
  }

  // =========================================================================
  // 2. AUTHENTICATED DASHBOARD SCREEN
  // =========================================================================
  const promo = data?.promoAnalytics;
  const summary = data?.summary;

  return (
    <main className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-foreground">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-signal-500/10 text-signal-500 border border-signal-500/20 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-signal-500 animate-pulse" />
              LIVE TELEMETRY
            </span>
            <span className="text-xs font-mono text-muted-foreground">/insights-0786</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-foreground">
            Internal Analytics & Growth Portal
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-accent" : ""} />
            <span>Refresh</span>
          </button>
          <a
            href="https://owaisabdullah.sanity.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 border border-border hover:border-accent text-foreground text-xs font-medium transition-colors"
          >
            <span>Sanity Studio</span>
            <ArrowUpRight size={13} />
          </a>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 text-destructive text-xs font-medium transition-colors"
          >
            <Lock size={13} />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          SECTION A: OCTIVELY PROMO BANNER A/B TEST DASHBOARD
      ===================================================================== */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
              <Bot size={14} />
            </div>
            <h2 className="text-lg font-bold font-sans text-foreground">
              Octively AI Promo Banner — A/B Test Live Performance
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Status:</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                promo?.bannerActive
                  ? "bg-signal-500/10 text-signal-500 border border-signal-500/30"
                  : "bg-destructive/10 text-destructive border border-destructive/30"
              }`}
            >
              {promo?.bannerActive ? "Active (Live on Blogs)" : "Disabled in Sanity"}
            </span>
            <span className="text-muted-foreground">Mode:</span>
            <span className="px-2 py-0.5 rounded bg-muted text-foreground border border-border text-[11px]">
              {promo?.bannerMode || "ab_test"}
            </span>
          </div>
        </div>

        {/* 4 Promo KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>TOTAL IMPRESSIONS</span>
              <Eye size={14} className="text-accent" />
            </div>
            <div className="text-2xl font-bold font-sans text-foreground">
              {promo?.totalImpressions ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Times toast was rendered</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>CLICKS / OPENS</span>
              <MousePointerClick size={14} className="text-signal-500" />
            </div>
            <div className="text-2xl font-bold font-sans text-signal-500">
              {promo?.totalClicks ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Visited octively.com</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>DISMISSALS (&quot;ANNOYED&quot;)</span>
              <XCircle size={14} className="text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-sans text-amber-500">
              {promo?.totalDismissals ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Closed toast ({promo?.totalDismissRate ?? 0}% drop-off)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>OVERALL CONVERSION (CTR)</span>
              <Sparkles size={14} className="text-accent" />
            </div>
            <div className="text-2xl font-bold font-sans text-accent">
              {promo?.totalCtr ?? 0}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Click-through efficiency</p>
          </div>
        </div>

        {/* Head-to-Head A/B Test Card */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-400" />
              <span className="text-sm font-semibold text-foreground">A/B Test Variant Comparison</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-medium">
              <span>Winner Status:</span>
              <strong className="text-foreground">{promo?.winner || "A/B Testing"}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variant A Box */}
            <div className="p-4 rounded-xl bg-background border border-border/80 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                  VARIANT A · Visual Banner
                </span>
                <span className="text-xs font-mono text-muted-foreground">50% Traffic</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Visual card with product badge, feature pills, gradient glow, and bold action button.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">VIEWS</span>
                  <strong className="text-sm text-foreground">{promo?.variantA.impressions ?? 0}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">CLICKS</span>
                  <strong className="text-sm text-signal-500">{promo?.variantA.clicks ?? 0}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">DISMISSED</span>
                  <strong className="text-sm text-amber-500">{promo?.variantA.dismissals ?? 0}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Click Rate (CTR):</span>
                <span className="font-bold font-mono text-accent text-sm">{promo?.variantA.ctr ?? 0}%</span>
              </div>
            </div>

            {/* Variant B Box */}
            <div className="p-4 rounded-xl bg-background border border-border/80 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  VARIANT B · Founder Text Card
                </span>
                <span className="text-xs font-mono text-muted-foreground">50% Traffic</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Editorial personal message from Owais with founder avatar, trust points, and direct recommendation.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">VIEWS</span>
                  <strong className="text-sm text-foreground">{promo?.variantB.impressions ?? 0}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">CLICKS</span>
                  <strong className="text-sm text-signal-500">{promo?.variantB.clicks ?? 0}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">DISMISSED</span>
                  <strong className="text-sm text-amber-500">{promo?.variantB.dismissals ?? 0}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Click Rate (CTR):</span>
                <span className="font-bold font-mono text-blue-400 text-sm">{promo?.variantB.ctr ?? 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION B: BLOG POST OVERVIEW KPIS
      ===================================================================== */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
            <Layers size={14} />
          </div>
          <h2 className="text-lg font-bold font-sans text-foreground">
            Blog Performance Overview
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Articles</span>
            <div className="text-xl font-bold font-sans text-foreground">{summary?.totalPosts ?? 0}</div>
            <span className="text-[10px] text-muted-foreground">Published</span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Total Views</span>
            <div className="text-xl font-bold font-sans text-foreground">{summary?.totalViews ?? 0}</div>
            <span className="text-[10px] text-muted-foreground">All time</span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Avg Views</span>
            <div className="text-xl font-bold font-sans text-foreground">{summary?.avgViewsPerPost ?? 0}</div>
            <span className="text-[10px] text-muted-foreground">Per post</span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Total Likes</span>
            <div className="text-xl font-bold font-sans text-signal-500">{summary?.totalLikes ?? 0}</div>
            <span className="text-[10px] text-signal-500">👍 Positive</span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Total Dislikes</span>
            <div className="text-xl font-bold font-sans text-destructive">{summary?.totalDislikes ?? 0}</div>
            <span className="text-[10px] text-destructive">👎 Negative</span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Sentiment</span>
            <div className="text-xl font-bold font-sans text-accent">{summary?.overallSentiment ?? 100}%</div>
            <span className="text-[10px] text-muted-foreground">Approval score</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION C: POST BREAKDOWN & SEGMENTED TABS
      ===================================================================== */}
      <section>
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("top")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "top"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <Trophy size={13} />
              <span>🥇 Top Performers ({data?.topPerformers.length ?? 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("latest")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "latest"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <Flame size={13} />
              <span>⚡ Top Latest & Trending ({data?.topLatest.length ?? 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("decreasing")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "decreasing"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <AlertTriangle size={13} />
              <span>⚠️ Needs Attention ({data?.decreasingNeedsAttention.length ?? 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <Layers size={13} />
              <span>📚 All Posts ({data?.posts.length ?? 0})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: TOP PERFORMERS */}
        {activeTab === "top" && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">
              Ranked by combined engagement algorithm (Views + Likes × 10 - Dislikes × 5).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.topPerformers.map((post, idx) => (
                <PostCardItem key={post._id} post={post} rank={idx + 1} badgeType="top" />
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: TOP LATEST & MOMENTUM */}
        {activeTab === "latest" && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">
              Newest articles sorted by early traction and daily velocity rate.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.topLatest.map((post, idx) => (
                <PostCardItem key={post._id} post={post} rank={idx + 1} badgeType="latest" />
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: DECREASING / NEEDS ATTENTION */}
        {activeTab === "decreasing" && (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>
                These articles have recorded dislikes, declining sentiment ratios (&lt;75%), or high traffic with zero engagement. Consider updating or refining their content.
              </span>
            </div>
            {data?.decreasingNeedsAttention.length === 0 ? (
              <div className="p-8 rounded-2xl bg-card border border-border text-center text-muted-foreground text-sm">
                <CheckCircle2 size={24} className="text-signal-500 mx-auto mb-2" />
                All articles currently have healthy sentiment and positive feedback!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.decreasingNeedsAttention.map((post, idx) => (
                  <PostCardItem key={post._id} post={post} rank={idx + 1} badgeType="attention" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: ALL POSTS WITH FILTERING & SORTING */}
        {activeTab === "all" && (
          <div className="flex flex-col gap-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex gap-2">
                {/* Category Dropdown */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none focus:border-accent text-foreground"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "views" | "likes" | "dislikes" | "score" | "date")}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none focus:border-accent text-foreground"
                >
                  <option value="score">Sort by Engagement Score</option>
                  <option value="views">Sort by Views</option>
                  <option value="likes">Sort by Likes</option>
                  <option value="dislikes">Sort by Dislikes</option>
                  <option value="date">Sort by Date Added</option>
                </select>
              </div>
            </div>

            {/* Table View of All Posts */}
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-mono text-[11px] text-muted-foreground">
                    <th className="py-3 px-4">POST TITLE</th>
                    <th className="py-3 px-3">CATEGORY</th>
                    <th className="py-3 px-3 text-center">VIEWS</th>
                    <th className="py-3 px-3 text-center">LIKES</th>
                    <th className="py-3 px-3 text-center">DISLIKES</th>
                    <th className="py-3 px-3 text-center">SENTIMENT</th>
                    <th className="py-3 px-3 text-center">SCORE</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAllPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 max-w-sm">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="font-medium text-foreground hover:text-accent line-clamp-1 flex items-center gap-1.5"
                        >
                          {post.title}
                          <ExternalLink size={11} className="opacity-60" />
                        </Link>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {new Date(post._createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-foreground border border-border">
                          {post.categories?.[0]?.title || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-foreground">
                        {post.views}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-signal-500 font-semibold">
                        +{post.likes}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-destructive font-semibold">
                        -{post.dislikes}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            post.sentimentRatio >= 80
                              ? "text-signal-500 bg-signal-500/10"
                              : post.sentimentRatio >= 50
                              ? "text-amber-400 bg-amber-400/10"
                              : "text-destructive bg-destructive/10"
                          }`}
                        >
                          {post.sentimentRatio}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-accent">
                        {post.engagementScore}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`https://owaisabdullah.sanity.studio/desk/post;${post._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-muted hover:bg-accent hover:text-accent-foreground text-[11px] transition-colors"
                        >
                          Edit <ArrowUpRight size={10} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

// Sub-component for clean Post Cards
function PostCardItem({
  post,
  rank,
  badgeType,
}: {
  post: PostAnalytics;
  rank: number;
  badgeType: "top" | "latest" | "attention";
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-all flex flex-col justify-between gap-3 shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
            #{rank} {badgeType === "top" ? "Top Performer" : badgeType === "latest" ? "Recent" : "Flagged"}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {new Date(post._createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          className="font-semibold text-sm text-foreground hover:text-accent line-clamp-2 transition-colors mb-1.5"
        >
          {post.title}
        </Link>
      </div>

      <div className="pt-3 border-t border-border flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-1.5 rounded bg-background border border-border/70">
            <span className="text-[9px] font-mono text-muted-foreground block">VIEWS</span>
            <strong className="text-xs font-mono text-foreground">{post.views}</strong>
          </div>
          <div className="p-1.5 rounded bg-background border border-border/70">
            <span className="text-[9px] font-mono text-muted-foreground block">LIKES</span>
            <strong className="text-xs font-mono text-signal-500">+{post.likes}</strong>
          </div>
          <div className="p-1.5 rounded bg-background border border-border/70">
            <span className="text-[9px] font-mono text-muted-foreground block">DISLIKES</span>
            <strong className="text-xs font-mono text-destructive">-{post.dislikes}</strong>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[11px] font-mono text-muted-foreground">Sentiment: {post.sentimentRatio}%</span>
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-accent font-medium hover:underline"
          >
            View live <ArrowUpRight size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
