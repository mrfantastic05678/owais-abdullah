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
  Globe,
  MapPin,
  Laptop,
  Smartphone,
  Tablet,
  Compass,
  Radio,
  Activity,
  Users,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import { GoogleGIcon } from "@/components/GooglePreferredSourceButton";

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

interface AudienceTelemetry {
  totalEvents: number;
  countries: Array<{
    code: string;
    name: string;
    flag: string;
    count: number;
    percentage: number;
  }>;
  cities: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  devices: {
    desktop: { count: number; percentage: number };
    mobile: { count: number; percentage: number };
    tablet: { count: number; percentage: number };
  };
  browsers: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  operatingSystems: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  referrers: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  googlePreferredSources?: {
    totalClicks: number;
    placements: Record<string, number>;
  };
  recentActivity: Array<{
    _key?: string;
    eventType: string;
    path: string;
    country: string;
    countryCode: string;
    city: string;
    device: string;
    browser: string;
    os: string;
    referrerDomain: string;
    timestamp: string;
  }>;
  lastUpdated: string;
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
  audienceTelemetry?: AudienceTelemetry;
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
  const [geoSourceTab, setGeoSourceTab] = useState<"cities" | "sources">("cities");

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
              Enter your master key to view real-time blog metrics, audience geography, clicks, views, and campaign conversion telemetry.
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
  const audience = data?.audienceTelemetry;

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
          SECTION A: AUDIENCE GEOGRAPHY & CLIENT TELEMETRY (NEW)
      ===================================================================== */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-signal-500/15 border border-signal-500/30 text-signal-500 flex items-center justify-center">
              <Globe size={14} />
            </div>
            <h2 className="text-lg font-bold font-sans text-foreground">
              Audience Geography & Traffic Telemetry
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Total Events:</span>
            <span className="px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-bold text-[11px]">
              {audience?.totalEvents ?? 0} Recorded
            </span>
          </div>
        </div>

        {/* 5 Geo / Device / Signal Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Top Country */}
          <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>TOP COUNTRY</span>
              <Globe size={14} className="text-signal-500" />
            </div>
            <div className="flex items-center gap-3 my-1">
              <div className="w-10 h-10 rounded-xl bg-signal-500/10 border border-signal-500/25 flex items-center justify-center font-mono font-black text-xs text-signal-500 tracking-wider shrink-0 shadow-inner">
                {audience?.countries?.[0]?.code || "GL"}
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-bold font-sans text-foreground leading-tight truncate">
                  {audience?.countries?.[0]?.name || "Tracking..."}
                </div>
                <span className="text-[11px] font-mono text-muted-foreground block truncate">
                  {audience?.countries?.[0]?.count ?? 0} views ({audience?.countries?.[0]?.percentage ?? 0}%)
                </span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">Primary audience market</p>
          </div>

          {/* Top City */}
          <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>TOP METRO</span>
              <MapPin size={14} className="text-accent" />
            </div>
            <div className="my-1">
              <div className="text-base sm:text-lg font-bold font-sans text-foreground truncate leading-tight">
                {audience?.cities?.[0]?.name || "National Level"}
              </div>
              <span className="text-[11px] font-mono text-muted-foreground block truncate">
                {audience?.cities?.[0]?.count
                  ? `${audience.cities[0].count} visits (${audience.cities[0].percentage}%)`
                  : "Metro masked by edge"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Highest traffic metro</p>
          </div>

          {/* Device Breakdown */}
          <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>DEVICE TYPE</span>
              <Monitor size={14} className="text-blue-400" />
            </div>
            <div className="flex items-center justify-between gap-1 my-1">
              <div className="text-center">
                <Laptop size={14} className="mx-auto text-muted-foreground mb-0.5" />
                <span className="text-xs font-bold font-mono">{audience?.devices?.desktop?.percentage ?? 0}%</span>
                <span className="text-[9px] text-muted-foreground block font-mono">Desktop</span>
              </div>
              <div className="text-center">
                <Smartphone size={14} className="mx-auto text-muted-foreground mb-0.5" />
                <span className="text-xs font-bold font-mono">{audience?.devices?.mobile?.percentage ?? 0}%</span>
                <span className="text-[9px] text-muted-foreground block font-mono">Mobile</span>
              </div>
              <div className="text-center">
                <Tablet size={14} className="mx-auto text-muted-foreground mb-0.5" />
                <span className="text-xs font-bold font-mono">{audience?.devices?.tablet?.percentage ?? 0}%</span>
                <span className="text-[9px] text-muted-foreground block font-mono">Tablet</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">Platform distribution</p>
          </div>

          {/* Top Referrer */}
          <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>PRIMARY SOURCE</span>
              <Compass size={14} className="text-amber-400" />
            </div>
            <div className="my-1">
              <div className="text-base sm:text-lg font-bold font-sans text-foreground truncate leading-tight">
                {audience?.referrers?.[0]?.name || "Direct / Bookmark"}
              </div>
              <span className="text-[11px] font-mono text-muted-foreground block truncate">
                {audience?.referrers?.[0]?.count ?? 0} hits ({audience?.referrers?.[0]?.percentage ?? 0}%)
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Main discovery channel</p>
          </div>

          {/* Google Preferred Sources Signal */}
          <div className="p-4 rounded-xl bg-card border border-blue-500/30 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-blue-400 text-xs font-mono mb-1">
              <span className="font-bold">GOOGLE PREFERRED</span>
              <GoogleGIcon className="w-3.5 h-3.5" />
            </div>
            <div className="my-1">
              <div className="text-2xl font-bold font-sans text-foreground flex items-baseline gap-1.5">
                <span>{audience?.googlePreferredSources?.totalClicks ?? 0}</span>
                <span className="text-xs text-muted-foreground font-normal">clicks</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                Blog: {audience?.googlePreferredSources?.placements?.blog_post_end ?? 0} · Footer: {audience?.googlePreferredSources?.placements?.footer ?? 0}
              </span>
            </div>
            <p className="text-[10px] text-blue-400/80 font-medium">Search & Discover signal</p>
          </div>
        </div>

        {/* Detailed Breakdown Grid: Countries List, Cities/Sources Tabs, and Live Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Countries Breakdown */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-start min-h-[310px]">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-signal-500" />
                <h3 className="text-xs font-bold font-mono uppercase text-foreground">Top Visitor Countries</h3>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Hits (%)</span>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-72">
              {audience?.countries && audience.countries.length > 0 ? (
                audience.countries.slice(0, 8).map((c) => (
                  <div key={c.code} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium truncate">
                        <span className="w-6 h-4.5 rounded text-[10px] font-mono font-bold bg-muted/80 text-foreground border border-border/80 flex items-center justify-center shrink-0 uppercase tracking-wider">
                          {c.code}
                        </span>
                        <span className="truncate text-foreground font-medium">{c.name}</span>
                      </span>
                      <span className="font-mono text-muted-foreground shrink-0 text-[11px]">
                        <strong className="text-foreground">{c.count}</strong> ({c.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted/70 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-signal-500/80 to-signal-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(4, c.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground text-center py-10">
                  Collecting geographic telemetry...
                </div>
              )}
            </div>
          </div>

          {/* 2. Top Metros & Referrers with Tab Switcher */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-start min-h-[310px]">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-accent" />
                <div className="flex items-center rounded-lg bg-muted/70 p-0.5 border border-border text-[10px] font-mono font-medium">
                  <button
                    onClick={() => setGeoSourceTab("cities")}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      geoSourceTab === "cities" ? "bg-background text-foreground font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    CITIES
                  </button>
                  <button
                    onClick={() => setGeoSourceTab("sources")}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      geoSourceTab === "sources" ? "bg-background text-foreground font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    TRAFFIC CHANNELS
                  </button>
                </div>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Volume</span>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-1 max-h-72">
              {geoSourceTab === "cities" ? (
                audience?.cities && audience.cities.length > 0 ? (
                  audience.cities.slice(0, 7).map((city, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-muted/40 transition-colors">
                      <span className="flex items-center gap-2 text-foreground truncate">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground w-4 shrink-0">#{idx + 1}</span>
                        <span className="truncate font-medium">{city.name}</span>
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-accent font-semibold">
                          {city.count}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">({city.percentage}%)</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-10 leading-relaxed px-4">
                    Metro coordinates are currently masked by edge network proxies. Country-level telemetry is active.
                  </div>
                )
              ) : (
                audience?.referrers && audience.referrers.length > 0 ? (
                  audience.referrers.slice(0, 7).map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-muted/40 transition-colors">
                      <span className="flex items-center gap-2 text-foreground truncate">
                        <Compass size={13} className="text-amber-400 shrink-0" />
                        <span className="truncate font-medium">{ref.name}</span>
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-foreground font-semibold">
                          {ref.count}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">({ref.percentage}%)</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-10">
                    No external traffic channels recorded yet.
                  </div>
                )
              )}
            </div>
          </div>

          {/* 3. Live Activity Stream Feed */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-start min-h-[310px]">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <Radio size={15} className="text-amber-400 animate-pulse" />
                <h3 className="text-xs font-bold font-mono uppercase text-foreground">Live Telemetry Feed</h3>
              </div>
              <span className="text-[10px] font-mono text-signal-500">Real-time</span>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {audience?.recentActivity && audience.recentActivity.length > 0 ? (
                audience.recentActivity.slice(0, 10).map((evt, idx) => {
                  const isPreferred = evt.eventType === "google_preferred_click";
                  const isClick = evt.eventType.includes("click") && !isPreferred;
                  const isDismiss = evt.eventType.includes("dismiss");
                  const isImpression = evt.eventType.includes("impression");

                  let badgeStyle = "bg-accent/15 text-accent border border-accent/30";
                  let label = evt.eventType.replace(/_/g, " ");
                  if (isPreferred) {
                    badgeStyle = "bg-blue-500/15 text-blue-400 border border-blue-500/30";
                    label = "GOOGLE PREFERRED";
                  } else if (isClick) {
                    badgeStyle = "bg-signal-500/15 text-signal-500 border border-signal-500/30";
                    label = "PROMO CTA CLICK";
                  } else if (isDismiss) {
                    badgeStyle = "bg-amber-500/15 text-amber-500 border border-amber-500/30";
                    label = "TOAST DISMISSED";
                  } else if (isImpression) {
                    badgeStyle = "bg-purple-500/15 text-purple-400 border border-purple-500/30";
                    label = "TOAST SHOWN";
                  }

                  const validCity = evt.city && !/direct|unknown|unspecified/i.test(evt.city) ? `${evt.city}, ` : "";
                  const countryLabel = evt.country || evt.countryCode || "Global";

                  return (
                    <div
                      key={evt._key || idx}
                      className="p-2.5 rounded-xl bg-background/80 border border-border/80 text-[11px] flex flex-col gap-1.5 hover:border-border transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${badgeStyle}`}>
                          {label}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground text-[10px] gap-2">
                        <span className="truncate text-foreground font-medium max-w-[170px]" title={evt.path}>
                          {evt.path || "/"}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                          {validCity}{countryLabel}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-muted-foreground text-center py-10">
                  Awaiting first live visitor stream...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION B: PROMO BANNER / TOAST A/B TEST DASHBOARD
      ===================================================================== */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
              <Bot size={14} />
            </div>
            <h2 className="text-lg font-bold font-sans text-foreground">
              Promotional Toast Banner — Live A/B Conversion
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
              {promo?.bannerActive ? "Active (Live Site-Wide)" : "Disabled in Sanity"}
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
              <span>CLICKS / CONVERSIONS</span>
              <MousePointerClick size={14} className="text-signal-500" />
            </div>
            <div className="text-2xl font-bold font-sans text-signal-500">
              {promo?.totalClicks ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">CTA button clicks</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>DISMISSALS (X)</span>
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
                  VARIANT A · Visual / Offer Banner
                </span>
                <span className="text-xs font-mono text-muted-foreground">50% Traffic</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Visual card with badge, feature pills, gradient glow, and highlighted CTA button.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">VIEWS</span>
                  <strong className="text-sm text-foreground">{promo?.variantA.impressions ?? 0}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">CLICKS</span>
                  <strong className="text-sm text-signal-500">+{promo?.variantA.clicks ?? 0}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">CTR</span>
                  <strong className="text-sm text-accent">{promo?.variantA.ctr ?? 0}%</strong>
                </div>
              </div>
            </div>

            {/* Variant B Box */}
            <div className="p-4 rounded-xl bg-background border border-border/80 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  VARIANT B · Editorial / Founder Note
                </span>
                <span className="text-xs font-mono text-muted-foreground">50% Traffic</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Personal founder recommendation note with avatar, direct quote, and action button.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">VIEWS</span>
                  <strong className="text-sm text-foreground">{promo?.variantB.impressions ?? 0}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">CLICKS</span>
                  <strong className="text-sm text-signal-500">+{promo?.variantB.clicks ?? 0}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">CTR</span>
                  <strong className="text-sm text-accent">{promo?.variantB.ctr ?? 0}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION C: BLOG POSTS CONTENT & ENGAGEMENT ANALYTICS
      ===================================================================== */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-signal-500/15 border border-signal-500/30 text-signal-500 flex items-center justify-center">
            <Layers size={14} />
          </div>
          <h2 className="text-lg font-bold font-sans text-foreground">Blog Articles & Reader Sentiment</h2>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>TOTAL PUBLISHED</span>
              <Layers size={14} className="text-accent" />
            </div>
            <div className="text-2xl font-bold font-sans text-foreground">{summary?.totalPosts ?? 0}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Live articles in Sanity</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>ALL-TIME VIEWS</span>
              <Eye size={14} className="text-signal-500" />
            </div>
            <div className="text-2xl font-bold font-sans text-signal-500">{summary?.totalViews ?? 0}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Avg {summary?.avgViewsPerPost ?? 0} views / post
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>TOTAL REACTIONS</span>
              <ThumbsUp size={14} className="text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-sans text-foreground flex items-center gap-2">
              <span className="text-signal-500">+{summary?.totalLikes ?? 0}</span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-destructive text-lg">-{summary?.totalDislikes ?? 0}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Reader likes vs dislikes</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-1">
              <span>OVERALL SENTIMENT</span>
              <Sparkles size={14} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-sans text-foreground flex items-center gap-2">
              <span
                className={
                  (summary?.overallSentiment ?? 100) >= 80
                    ? "text-signal-500"
                    : (summary?.overallSentiment ?? 100) >= 60
                    ? "text-amber-400"
                    : "text-destructive"
                }
              >
                {summary?.overallSentiment ?? 100}%
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Net positive ratio</p>
          </div>
        </div>

        {/* 4 Segmented Views Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3 mb-6">
          <button
            onClick={() => setActiveTab("top")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "top"
                ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                : "bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Flame size={14} className={activeTab === "top" ? "text-accent-foreground" : "text-amber-400"} />
            <span>Top Performers ({data?.topPerformers.length ?? 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("latest")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "latest"
                ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                : "bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock size={14} className={activeTab === "latest" ? "text-accent-foreground" : "text-signal-500"} />
            <span>Top Latest ({data?.topLatest.length ?? 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("decreasing")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "decreasing"
                ? "bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20"
                : "bg-card border border-border hover:bg-muted text-muted-foreground hover:text-destructive"
            }`}
          >
            <AlertTriangle size={14} className={activeTab === "decreasing" ? "text-destructive-foreground" : "text-destructive"} />
            <span>Needs Attention ({data?.decreasingNeedsAttention.length ?? 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "all"
                ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                : "bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>All Posts Database ({data?.posts.length ?? 0})</span>
          </button>
        </div>

        {/* Tab 1: Top Performers */}
        {activeTab === "top" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.topPerformers.map((post, idx) => (
              <PostCardItem key={post._id} post={post} rank={idx + 1} badgeType="top" />
            ))}
          </div>
        )}

        {/* Tab 2: Top Latest */}
        {activeTab === "latest" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.topLatest.map((post, idx) => (
              <PostCardItem key={post._id} post={post} rank={idx + 1} badgeType="latest" />
            ))}
          </div>
        )}

        {/* Tab 3: Decreasing / Needs Attention */}
        {activeTab === "decreasing" && (
          <div>
            {data?.decreasingNeedsAttention && data.decreasingNeedsAttention.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.decreasingNeedsAttention.map((post, idx) => (
                  <PostCardItem key={post._id} post={post} rank={idx + 1} badgeType="attention" />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-card border border-border text-center flex flex-col items-center justify-center gap-2">
                <CheckCircle2 size={32} className="text-signal-500" />
                <h3 className="font-semibold text-sm">All Articles Healthy!</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  No posts currently have high dislikes, low sentiment ratios, or declining velocity.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: All Posts Database with Search & Filters */}
        {activeTab === "all" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles by title, slug, summary..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-accent"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-accent"
                >
                  <option value="score">Sort by Score</option>
                  <option value="views">Sort by Views</option>
                  <option value="likes">Sort by Likes</option>
                  <option value="dislikes">Sort by Dislikes</option>
                  <option value="date">Sort by Date</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-mono text-[11px] text-muted-foreground uppercase">
                    <th className="py-3 px-4">Article Title</th>
                    <th className="py-3 px-3 text-center">Views</th>
                    <th className="py-3 px-3 text-center">Likes</th>
                    <th className="py-3 px-3 text-center">Dislikes</th>
                    <th className="py-3 px-3 text-center">Sentiment</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAllPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-1 block"
                        >
                          {post.title}
                        </Link>
                        <span className="text-[10px] font-mono text-muted-foreground mt-0.5 block">
                          /blog/{post.slug}
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
