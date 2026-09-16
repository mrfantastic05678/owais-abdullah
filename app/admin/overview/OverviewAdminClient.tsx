"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Zap,
  ShieldCheck,
  Building2,
  ExternalLink,
  ArrowUpRight,
  RefreshCw,
  Globe,
  Clock,
  Eye,
  ThumbsUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function OverviewAdminClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    const pass = sessionStorage.getItem("analytics_auth_token");
    if (!pass) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/overview?token=${encodeURIComponent(pass)}`, {
        headers: { Authorization: `Bearer ${pass}` },
      });
      if (res.ok) {
        const payload = await res.json();
        setData(payload);
      }
    } catch {
      console.error("Failed to load overview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-bold">
              ADMIN MISSION CONTROL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            System Overview & Activity
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchOverview}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-primary" : ""} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/cache"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-colors"
          >
            <Zap size={13} />
            <span>Purge Cache</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
            <span>TOTAL STORES</span>
            <Building2 size={16} className="text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {data?.metrics?.totalStores ?? "—"}
          </div>
          <p className="text-[11px] text-muted-foreground">Registered in directory</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
            <span>INBOUND STORES</span>
            <ShoppingBag size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">
            {data?.metrics?.pendingStoresCount ?? "0"}
          </div>
          <p className="text-[11px] text-muted-foreground">Pending your review</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
            <span>PENDING CLAIMS</span>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
            {data?.metrics?.pendingClaimsCount ?? "0"}
          </div>
          <p className="text-[11px] text-muted-foreground">Founders requesting badge</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
            <span>DISCUSSIONS</span>
            <MessageSquare size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {data?.metrics?.recentCommentsCount ?? "0"}
          </div>
          <p className="text-[11px] text-muted-foreground">Recent blog comments</p>
        </div>
      </div>

      {/* 2-Column Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inbound Store Submissions */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-amber-500" />
              <h2 className="text-sm font-bold text-foreground">New Inbound Stores</h2>
            </div>
            <Link
              href="/admin/stores"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>Manage all</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {!data?.recentStores || data.recentStores.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No pending stores waiting.
              </div>
            ) : (
              data.recentStores.map((store: any) => (
                <div
                  key={store.id}
                  className="p-3.5 rounded-xl bg-muted/30 border border-border/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">{store.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {store.category} · {store.city} · {store.ownerName || "Merchant"}
                    </div>
                  </div>
                  <Link
                    href="/admin/stores"
                    className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground font-semibold text-[11px] shrink-0"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Store Claim Requests */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Pending Merchant Claims</h2>
            </div>
            <Link
              href="/admin/stores"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>Verify claims</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {!data?.recentClaims || data.recentClaims.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No pending claims.
              </div>
            ) : (
              data.recentClaims.map((claim: any) => (
                <div
                  key={claim.id}
                  className="p-3.5 rounded-xl bg-muted/30 border border-border/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">
                      {claim.storeName || `Store #${claim.storeId}`}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Claimed by {claim.claimantName} ({claim.claimantEmail})
                    </div>
                  </div>
                  <Link
                    href="/admin/stores"
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-semibold text-[11px] shrink-0 hover:bg-emerald-500/25"
                  >
                    Verify
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Blog Comments & Discussions */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-500" />
              <h2 className="text-sm font-bold text-foreground">Recent Blog Comments</h2>
            </div>
            <Link
              href="/admin/comments"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>Moderate all</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {!data?.recentComments || data.recentComments.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No comments submitted yet.
              </div>
            ) : (
              data.recentComments.slice(0, 5).map((comment: any) => (
                <div
                  key={comment.id}
                  className="p-3.5 rounded-xl bg-muted/30 border border-border/70 flex flex-col gap-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-foreground truncate">
                        {comment.authorName}
                      </span>
                      {comment.isAdmin && (
                        <span className="px-1.5 py-0.2 rounded bg-primary/20 text-primary text-[10px] font-mono font-bold">
                          Admin
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground font-mono truncate">
                        on /{comment.postSlug}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                        comment.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : comment.status === "hidden"
                          ? "bg-muted text-muted-foreground border border-border"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] line-clamp-2 italic">
                    "{comment.content}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Viewed Posts */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Top Viewed Articles</h2>
            </div>
            <Link
              href="/admin/comments"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>Discussions</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-2">
            {!data?.topPosts || data.topPosts.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No view metrics recorded yet.
              </div>
            ) : (
              data.topPosts.map((post: any) => (
                <div
                  key={post.slug}
                  className="p-3 rounded-xl bg-muted/30 border border-border/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="font-medium text-foreground truncate max-w-[240px]">
                    /{post.slug}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-muted-foreground font-mono text-[11px]">
                    <span className="flex items-center gap-1 text-foreground font-bold">
                      <Eye size={12} className="text-primary" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                      <ThumbsUp size={12} />
                      {post.likes}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Visitor Activity Stream */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-emerald-500" />
              <h2 className="text-sm font-bold text-foreground">Live Telemetry Stream</h2>
            </div>
            <Link
              href="/admin/insights"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>Full analytics</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {!data?.recentEvents || data.recentEvents.length === 0 ? (
              <div className="sm:col-span-2 p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                Tracking telemetry events...
              </div>
            ) : (
              data.recentEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="p-2.5 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-mono text-foreground font-semibold truncate">
                      {event.path}
                    </span>
                  </div>
                  <div className="text-muted-foreground shrink-0 text-[10px] font-mono">
                    {event.city || event.country} · {event.device}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
