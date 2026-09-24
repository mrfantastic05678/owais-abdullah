"use client";

import React, { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle, Zap, Globe, FileText, ShoppingBag, Layers } from "lucide-react";

import { getAdminAuthToken } from "@/lib/admin-auth";

export default function CacheAdminClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; paths?: string[] } | null>(null);

  const purgeCache = async (customPath?: string) => {
    setLoading(true);
    setResult(null);

    const pass = getAdminAuthToken() || "owais-revalidate-2026";

    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": pass,
        },
        body: JSON.stringify({
          secret: pass,
          path: customPath || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.revalidated) {
        setResult({
          success: true,
          message: "Cache purged and pages successfully revalidated!",
          paths: data.paths || data.defaultPaths || ["/", "/blog", "/stores", "/sitemap.xml"],
        });
      } else {
        setResult({
          success: false,
          message: data.message || "Failed to revalidate.",
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "Network error while calling revalidate endpoint.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Cache & Webhook Manager</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Purge Next.js Incremental Static Regeneration (ISR) caches and sync Sanity CMS webhooks instantly
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
            result.success
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500"
              : "bg-destructive/10 border border-destructive/30 text-destructive"
          }`}
        >
          {result.success ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
          <div>
            <div className="font-semibold">{result.message}</div>
            {result.paths && (
              <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                Revalidated: {result.paths.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1-Click Master Purge */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Instant Global Cache Purge</h2>
            <p className="text-xs text-muted-foreground">
              Forces Next.js to immediately discard cached HTML and pull fresh data & images across all routes
            </p>
          </div>
        </div>

        <button
          onClick={() => purgeCache()}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Revalidating All Routes..." : "Purge All Caches Now"}</span>
        </button>
      </div>

      {/* Segmented Purge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <FileText size={16} className="text-primary" />
            <span>Blog & Posts</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Purges `/blog` index and newly updated post image assets.
          </p>
          <button
            onClick={() => purgeCache("/blog")}
            disabled={loading}
            className="w-full py-2 text-xs rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
          >
            Revalidate Blog
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <ShoppingBag size={16} className="text-emerald-500" />
            <span>Stores Directory</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Purges `/stores` and category/city listings after approving merchants.
          </p>
          <button
            onClick={() => purgeCache("/stores")}
            disabled={loading}
            className="w-full py-2 text-xs rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
          >
            Revalidate Stores
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <Globe size={16} className="text-amber-500" />
            <span>Sitemaps</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Refreshes all XML sitemaps for Googlebot and Bingbot discovery.
          </p>
          <button
            onClick={() => purgeCache("/sitemap.xml")}
            disabled={loading}
            className="w-full py-2 text-xs rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
          >
            Revalidate Sitemaps
          </button>
        </div>
      </div>
    </div>
  );
}
