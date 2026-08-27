"use client";

import React, { useState, useActionState } from "react";
import { updateStoreAction, ActionResult } from "@/app/actions/directory";
import { DirectoryStore } from "@/schema/directory";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Layers,
  Tag,
  Info,
  Smartphone,
  Monitor,
  Lock,
  ShieldCheck,
  Check,
  Copy,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface EditStoreFormProps {
  store: DirectoryStore;
  providedToken?: string;
}

const PRESET_COLORS = [
  { name: "Cobalt Blue", hex: "#3D7BFF" },
  { name: "Emerald Green", hex: "#10B981" },
  { name: "Rose Pret", hex: "#EC4899" },
  { name: "Royal Violet", hex: "#8B5CF6" },
  { name: "Amber Gold", hex: "#F59E0B" },
  { name: "Ruby Crimson", hex: "#EF4444" },
  { name: "Cyan Spark", hex: "#06B6D4" },
  { name: "Onyx Slate", hex: "#64748B" },
];

export const EditStoreForm: React.FC<EditStoreFormProps> = ({ store, providedToken }) => {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    updateStoreAction,
    null
  );

  const activeToken = providedToken || store.editToken || "";
  const [tokenCopied, setTokenCopied] = useState(false);

  // Live state for interactive preview
  const [themeColor, setThemeColor] = useState<string>(store.themeColor || "#3D7BFF");
  const [bannerPattern, setBannerPattern] = useState<string>(store.bannerPattern || "gradient");
  const [coverUrl, setCoverUrl] = useState<string>(store.coverUrl || "");
  const [coverMobileUrl, setCoverMobileUrl] = useState<string>(store.coverMobileUrl || "");
  const [tagline, setTagline] = useState<string>(store.tagline || "");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [highlightsStr, setHighlightsStr] = useState<string>(
    Array.isArray(store.highlights) ? store.highlights.join(", ") : ""
  );

  const handleCopyToken = () => {
    if (activeToken && typeof window !== "undefined") {
      navigator.clipboard.writeText(activeToken);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    }
  };

  const activePreviewCover =
    previewMode === "mobile"
      ? coverMobileUrl || coverUrl
      : coverUrl;

  return (
    <form action={formAction} className="space-y-8 w-full max-w-4xl mx-auto">
      {/* Hidden Slug & Secret Edit Token */}
      <input type="hidden" name="slug" value={store.slug} />
      <input type="hidden" name="token" value={activeToken} />
      <input type="hidden" name="bannerPattern" value={bannerPattern} />

      {state?.success && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">{state.message || "Store details updated successfully!"}</p>
            <Link
              href={`/stores/${store.slug}`}
              className="text-xs underline hover:text-foreground font-medium inline-flex items-center gap-1 mt-1"
            >
              View updated live profile <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {state?.error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Secret Edit Token Access Verification (Copy-Only) */}
      <div className="rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-primary" />
            Owner Verification Token
          </label>
          <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Authenticated
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm font-mono text-foreground select-all truncate shadow-2xs">
            {activeToken || "No token assigned"}
          </div>
          <button
            type="button"
            onClick={handleCopyToken}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-muted active:scale-[0.98] shrink-0"
            title="Copy Owner Verification Token"
          >
            {tokenCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copy Token</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground">
          This is your private owner access credential. Keep it safe to edit and customize your store anytime.
        </p>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: THEME, BRANDING & HERO BANNER STUDIO */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">
            Listing Theme & Brand Styling
          </h2>
        </div>

        {/* Global Image Hosting Notice */}
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-foreground/90">
          <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Image Hosting Notice:</strong> We do not host image files on our servers. Simply copy and paste the public image URL from your Shopify CDN, store website, Cloudinary, Imgur, or official social media.
          </div>
        </div>

        {/* Brand Theme Color Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              Brand Accent Color
            </label>
            <span className="text-xs font-mono text-muted-foreground">{themeColor}</span>
          </div>

          {/* Preset Color Swatches */}
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setThemeColor(c.hex)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  themeColor.toLowerCase() === c.hex.toLowerCase()
                    ? "border-primary ring-2 ring-primary/30 shadow-xs"
                    : "border-border hover:border-border/80 bg-background"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            ))}

            {/* Custom Hex Color Picker */}
            <div className="flex items-center gap-1.5 ml-auto">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-border p-0.5 bg-background"
                title="Pick custom color"
              />
              <input
                type="text"
                name="themeColor"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-24 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Desktop Cover Banner Image URL */}
        <div className="space-y-2">
          <label htmlFor="coverUrl" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Monitor className="h-4 w-4 text-primary" />
            Desktop Cover Banner Image URL (Optional)
          </label>
          <input
            type="url"
            id="coverUrl"
            name="coverUrl"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://cdn.shopify.com/.../desktop-hero-banner.webp"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            <strong>Recommended Size:</strong> 1200 × 400 px (3:1 aspect ratio). Keep central graphics within 800 × 300 px.
          </p>
        </div>

        {/* Mobile Cover Banner Image URL (Optional) */}
        <div className="space-y-2">
          <label htmlFor="coverMobileUrl" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Smartphone className="h-4 w-4 text-primary" />
            Mobile Cover Banner Image URL (Optional)
          </label>
          <input
            type="url"
            id="coverMobileUrl"
            name="coverMobileUrl"
            value={coverMobileUrl}
            onChange={(e) => setCoverMobileUrl(e.target.value)}
            placeholder="https://cdn.shopify.com/.../mobile-hero-banner.webp"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            <strong>Recommended Size:</strong> 800 × 600 px (4:3 ratio) or 600 × 400 px. <em>If left blank, your Desktop banner will automatically be used on mobile devices.</em>
          </p>
        </div>

        {/* Background Pattern Style (when no custom cover image is used) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary" />
            Hero Background Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "gradient", label: "Ambient Aura", desc: "Radial Glow Mesh" },
              { id: "grid", label: "Tech Grid", desc: "Matrix Lattice" },
              { id: "dots", label: "Dot Canvas", desc: "Micro Matrix" },
              { id: "minimal", label: "Minimal Solid", desc: "Clean Surface" },
            ].map((p) => (
              <label
                key={p.id}
                className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${
                  bannerPattern === p.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 bg-background"
                }`}
              >
                <input
                  type="radio"
                  name="bannerPattern"
                  value={p.id}
                  checked={bannerPattern === p.id}
                  onChange={() => setBannerPattern(p.id)}
                  className="sr-only"
                />
                <div className="font-semibold text-xs text-foreground">{p.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{p.desc}</div>
              </label>
            ))}
          </div>
        </div>

        {/* Brand Tagline / Slogan */}
        <div className="space-y-1.5">
          <label htmlFor="tagline" className="text-sm font-semibold text-foreground">
            Brand Tagline / Slogan
          </label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Luxury Handcrafted Pret & Unstitched Silk Collections"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            A short 1-line punchline displayed prominently right beneath your store name.
          </p>
        </div>

        {/* Custom Highlight Badges */}
        <div className="space-y-1.5">
          <label htmlFor="highlights" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Tag className="h-4 w-4 text-primary" />
            Key Value Propositions / Highlights
          </label>
          <input
            type="text"
            id="highlights"
            name="highlights"
            value={highlightsStr}
            onChange={(e) => setHighlightsStr(e.target.value)}
            placeholder="Free Delivery Nationwide, Cash on Delivery (COD), Pure Organic, Same-Day Dispatch"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            Separate up to 4 key highlights with commas (e.g. <code className="text-foreground">Free Shipping, COD Available, 100% Authentic</code>).
          </p>
        </div>

        {/* Interactive Live Preview Box with Desktop / Mobile Switcher */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live Store Page Preview
              </span>
              <p className="text-[11px] text-muted-foreground">
                See exactly how your store listing appears to visitors across devices
              </p>
            </div>

            {/* Viewport Switcher */}
            <div className="flex items-center rounded-xl border border-border bg-muted/60 p-1 text-xs">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                  previewMode === "desktop"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                  previewMode === "mobile"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* DESKTOP PREVIEW FRAME */}
          {/* ======================================================== */}
          {previewMode === "desktop" && (
            <div className="rounded-2xl border border-border bg-muted/30 p-3 sm:p-4 space-y-4 shadow-sm transition-all">
              {/* Browser Bar */}
              <div className="flex items-center gap-2 border-b border-border/60 pb-2.5 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-card rounded-md border border-border px-3 py-1 text-[11px] font-mono text-muted-foreground truncate text-center">
                  owaisabdullah.dev/stores/{store.slug}
                </div>
              </div>

              {/* Desktop Cover Banner */}
              {activePreviewCover ? (
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-border shadow-xs">
                  <Image
                    src={activePreviewCover}
                    alt="Desktop Cover Banner Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                </div>
              ) : null}

              {/* Main Desktop Header Card */}
              <div
                className="relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all"
                style={{
                  borderColor: `${themeColor}35`,
                  backgroundColor: "var(--card)",
                }}
              >
                {/* Pattern Background */}
                {bannerPattern === "grid" && (
                  <div
                    className="absolute inset-0 opacity-[0.08] dark:opacity-[0.14] pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${themeColor} 1px, transparent 1px), linear-gradient(to bottom, ${themeColor} 1px, transparent 1px)`,
                      backgroundSize: "32px 32px",
                      maskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)",
                      WebkitMaskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)",
                    }}
                  />
                )}
                {bannerPattern === "dots" && (
                  <div
                    className="absolute inset-0 opacity-[0.09] dark:opacity-[0.16] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(${themeColor} 1.5px, transparent 1.5px)`,
                      backgroundSize: "24px 24px",
                      maskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)",
                      WebkitMaskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)",
                    }}
                  />
                )}
                {(bannerPattern === "gradient" || !bannerPattern) && (
                  <>
                    <div
                      className="absolute -right-12 -top-12 w-80 h-80 rounded-full opacity-20 dark:opacity-30 blur-3xl pointer-events-none"
                      style={{ backgroundColor: themeColor }}
                    />
                    <div
                      className="absolute -left-12 -bottom-12 w-72 h-72 rounded-full opacity-15 dark:opacity-25 blur-3xl pointer-events-none"
                      style={{ backgroundColor: themeColor }}
                    />
                  </>
                )}
                {bannerPattern === "minimal" && (
                  <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
                    style={{ backgroundColor: themeColor }}
                  />
                )}

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border/80">
                    <div className="flex items-start gap-4">
                      <div
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-muted/60 flex items-center justify-center shadow-xs"
                        style={{ borderColor: `${themeColor}40` }}
                      >
                        {store.logoUrl ? (
                          <Image
                            src={store.logoUrl}
                            alt={`${store.name} logo`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Sparkles className="h-8 w-8 text-muted-foreground/60" />
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {store.tier === "gold" && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-300">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <span>Featured Store</span>
                            </span>
                          )}
                          {!store.isClaimed && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                              Unclaimed Listing
                            </span>
                          )}
                        </div>

                        {/* Title + Green Verified Tick */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                            {store.name}
                          </h3>
                          {store.isClaimed && (
                            <span title="Verified Merchant" className="inline-flex shrink-0">
                              <svg
                                className="h-6 w-6 shrink-0 text-emerald-500 fill-emerald-500"
                                viewBox="0 0 24 24"
                                aria-label="Verified"
                              >
                                <circle cx="12" cy="12" r="10" fill="#10B981" />
                                <path
                                  d="M8.5 12.5l2.5 2.5 5-5"
                                  fill="none"
                                  stroke="#FFFFFF"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </div>

                        {/* Tagline */}
                        {tagline && (
                          <p className="text-sm font-medium text-foreground/90 italic pt-0.5">
                            "{tagline}"
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap pt-0.5">
                          <span className="inline-flex items-center gap-1">
                            <span style={{ color: themeColor }}>📍</span> {store.city}, Pakistan
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <span style={{ color: themeColor }}>🏷️</span> {store.category}
                          </span>
                          <span>•</span>
                          <span className="bg-muted/70 px-2 py-0.5 rounded border border-border font-medium text-muted-foreground">
                            {store.platform || "Shopify"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs">
                        Share Store
                      </div>
                      <div
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-md"
                        style={{ backgroundColor: themeColor }}
                      >
                        Visit Store <ExternalLink className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Highlights Badges */}
                  {highlightsStr && (
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {highlightsStr.split(",").map((h, i) =>
                        h.trim() ? (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs"
                            style={{
                              backgroundColor: `${themeColor}12`,
                              borderColor: `${themeColor}35`,
                              color: themeColor,
                            }}
                          >
                            <span>✓</span>
                            <span>{h.trim()}</span>
                          </span>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MOBILE PREVIEW FRAME (Hyper-Realistic Smartphone Mockup) */}
          {/* ======================================================== */}
          {previewMode === "mobile" && (
            <div className="relative w-[340px] sm:w-[365px] mx-auto py-2">
              {/* Hardware Side Buttons */}
              <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-slate-600 rounded-l-sm" />
              <div className="absolute -left-[3px] top-36 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
              <div className="absolute -left-[3px] top-52 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
              <div className="absolute -right-[3px] top-32 w-[3px] h-16 bg-slate-600 rounded-r-sm" />

              {/* Smartphone Chassis Outer Bezel */}
              <div className="relative rounded-[50px] bg-slate-900 p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-slate-700/60">
                {/* Inner Screen Surface */}
                <div className="relative rounded-[40px] bg-background overflow-hidden border border-slate-800 flex flex-col h-[600px] sm:h-[620px]">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-foreground shrink-0 select-none bg-background">
                    <span>9:41</span>
                    {/* Dynamic Island */}
                    <div className="h-5 w-24 bg-black rounded-full flex items-center justify-between px-2 shadow-inner">
                      <span className="w-2 h-2 rounded-full bg-slate-900 ring-1 ring-slate-800" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-foreground">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Browser Address Bar */}
                  <div className="px-3 py-1 shrink-0 bg-background border-b border-border/40">
                    <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 text-[10px] font-mono text-muted-foreground border border-border/50">
                      <div className="flex items-center gap-1 truncate">
                        <span>🔒</span>
                        <span className="truncate text-foreground/80">owaisabdullah.dev/stores/{store.slug}</span>
                      </div>
                      <span className="text-[10px] opacity-60">↻</span>
                    </div>
                  </div>

                  {/* Scrollable Viewport Content with Minimal Mobile Scrollbar */}
                  <div className="overflow-y-auto p-3 space-y-3 flex-1 [scrollbar-width:thin] [scrollbar-color:rgba(150,150,150,0.25)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                    {/* Mobile Cover Banner */}
                    {activePreviewCover ? (
                      <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-border shadow-xs shrink-0">
                        <Image
                          src={activePreviewCover}
                          alt="Mobile Cover Banner Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                      </div>
                    ) : null}

                    {/* Mobile Header Card */}
                    <div
                      className="relative overflow-hidden rounded-2xl border p-3.5 shadow-sm space-y-3"
                      style={{
                        borderColor: `${themeColor}35`,
                        backgroundColor: "var(--card)",
                      }}
                    >
                      {/* Pattern Background */}
                      {bannerPattern === "grid" && (
                        <div
                          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.14] pointer-events-none"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${themeColor} 1px, transparent 1px), linear-gradient(to bottom, ${themeColor} 1px, transparent 1px)`,
                            backgroundSize: "24px 24px",
                            maskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)",
                            WebkitMaskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)",
                          }}
                        />
                      )}
                      {bannerPattern === "dots" && (
                        <div
                          className="absolute inset-0 opacity-[0.09] dark:opacity-[0.16] pointer-events-none"
                          style={{
                            backgroundImage: `radial-gradient(${themeColor} 1.5px, transparent 1.5px)`,
                            backgroundSize: "20px 20px",
                            maskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)",
                            WebkitMaskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)",
                          }}
                        />
                      )}
                      {(bannerPattern === "gradient" || !bannerPattern) && (
                        <div
                          className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20 blur-2xl pointer-events-none"
                          style={{ backgroundColor: themeColor }}
                        />
                      )}
                      {bannerPattern === "minimal" && (
                        <div
                          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
                          style={{ backgroundColor: themeColor }}
                        />
                      )}

                      <div className="relative z-10 space-y-2.5">
                        {/* Top Row: Logo + Badges */}
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-muted/60 flex items-center justify-center shadow-xs"
                            style={{ borderColor: `${themeColor}40` }}
                          >
                            {store.logoUrl ? (
                              <Image
                                src={store.logoUrl}
                                alt={`${store.name} logo`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <Sparkles className="h-6 w-6 text-muted-foreground/60" />
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {store.tier === "gold" && (
                              <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-300">
                                <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                                Featured
                              </span>
                            )}
                            {!store.isClaimed && (
                              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                Unclaimed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Verified Tick */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-base font-bold tracking-tight text-foreground">
                              {store.name}
                            </h4>
                            {store.isClaimed && (
                              <span title="Verified Merchant" className="inline-flex shrink-0">
                                <svg
                                  className="h-4 w-4 shrink-0 text-emerald-500 fill-emerald-500"
                                  viewBox="0 0 24 24"
                                  aria-label="Verified"
                                >
                                  <circle cx="12" cy="12" r="10" fill="#10B981" />
                                  <path
                                    d="M8.5 12.5l2.5 2.5 5-5"
                                    fill="none"
                                    stroke="#FFFFFF"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            )}
                          </div>

                          {/* Tagline */}
                          {tagline && (
                            <p className="text-xs font-medium text-foreground/90 italic line-clamp-2">
                              "{tagline}"
                            </p>
                          )}
                        </div>

                        {/* Meta tags */}
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
                          <span>📍 {store.city}</span>
                          <span>•</span>
                          <span>🏷️ {store.category}</span>
                          <span>•</span>
                          <span className="bg-muted px-1.5 py-0.5 rounded text-[9px] border border-border font-medium">
                            {store.platform || "Shopify"}
                          </span>
                        </div>

                        {/* Highlights Badges */}
                        {highlightsStr && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            {highlightsStr.split(",").map((h, i) =>
                              h.trim() ? (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full border shadow-2xs"
                                  style={{
                                    backgroundColor: `${themeColor}12`,
                                    borderColor: `${themeColor}35`,
                                    color: themeColor,
                                  }}
                                >
                                  <span>✓</span>
                                  <span>{h.trim()}</span>
                                </span>
                              ) : null
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                          <div className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-xl border border-border bg-card shadow-xs">
                            Share
                          </div>
                          <div
                            className="flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs"
                            style={{ backgroundColor: themeColor }}
                          >
                            Visit Store <ExternalLink className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile About & Details Cards */}
                    <div className="rounded-2xl border border-border bg-card p-3.5 space-y-2 text-xs">
                      <h5 className="font-bold text-foreground">About the Brand</h5>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3 text-[11px]">
                        {store.description}
                      </p>
                    </div>

                    {/* Quick Store Details */}
                    <div
                      className="rounded-2xl border bg-muted/30 p-3.5 space-y-2 text-[11px]"
                      style={{ borderColor: `${themeColor}25` }}
                    >
                      <h5 className="font-bold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground">
                        Store Details
                      </h5>
                      <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium" style={{ color: themeColor }}>{store.category}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium" style={{ color: themeColor }}>{store.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Platform</span>
                        <span className="font-medium text-foreground">{store.platform || "Shopify"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Home Swipe Bar */}
                  <div className="py-2 shrink-0 flex justify-center bg-background border-t border-border/30">
                    <div className="w-28 h-1 bg-foreground/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: STORE INFO & LINKS */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 space-y-6 shadow-xs">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          General Details & URLs
        </h2>

        {/* Website URL */}
        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-semibold text-foreground">
            Website URL
          </label>
          <input
            type="url"
            id="website"
            name="website"
            defaultValue={store.website}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Logo URL & Product Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="logoUrl" className="text-sm font-semibold text-foreground">
              Logo Image URL
            </label>
            <input
              type="url"
              id="logoUrl"
              name="logoUrl"
              defaultValue={store.logoUrl || ""}
              placeholder="https://cdn.shopify.com/.../logo.png"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-[11px] text-muted-foreground">
              Paste your official store logo URL (transparent PNG or WebP recommended).
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="productCount" className="text-sm font-semibold text-foreground">
              Estimated Product Count
            </label>
            <input
              type="number"
              id="productCount"
              name="productCount"
              defaultValue={store.productCount || ""}
              placeholder="e.g. 120"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Official Social Media Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="instagramUrl" className="text-xs font-medium text-foreground">
                Instagram URL
              </label>
              <input
                type="url"
                id="instagramUrl"
                name="instagramUrl"
                defaultValue={store.instagramUrl || ""}
                placeholder="https://instagram.com/yourstore"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="facebookUrl" className="text-xs font-medium text-foreground">
                Facebook URL
              </label>
              <input
                type="url"
                id="facebookUrl"
                name="facebookUrl"
                defaultValue={store.facebookUrl || ""}
                placeholder="https://facebook.com/yourstore"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="tiktokUrl" className="text-xs font-medium text-foreground">
                TikTok URL
              </label>
              <input
                type="url"
                id="tiktokUrl"
                name="tiktokUrl"
                defaultValue={store.tiktokUrl || ""}
                placeholder="https://tiktok.com/@yourstore"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="youtubeUrl" className="text-xs font-medium text-foreground">
                YouTube Channel URL
              </label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                defaultValue={store.youtubeUrl || ""}
                placeholder="https://youtube.com/@yourstore"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="linkedinUrl" className="text-xs font-medium text-foreground">
                LinkedIn Page URL
              </label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                defaultValue={store.linkedinUrl || ""}
                placeholder="https://linkedin.com/company/yourstore"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="twitterUrl" className="text-xs font-medium text-foreground">
                Twitter / X URL
              </label>
              <input
                type="url"
                id="twitterUrl"
                name="twitterUrl"
                defaultValue={store.twitterUrl || ""}
                placeholder="https://x.com/yourstore"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold text-foreground">
            Brand Story & Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={store.description}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y leading-relaxed"
          />
          <p className="text-xs text-muted-foreground">
            Highlight what makes your store unique, signature collections, fabrics, and customer service.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
        <Link
          href={`/stores/${store.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Cancel & Back to Profile
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Store Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
};
