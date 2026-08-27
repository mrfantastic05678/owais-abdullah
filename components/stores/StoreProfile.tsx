"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  MapPin,
  Tag,
  ShoppingBag,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Video,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Settings,
  Clock,
  Check,
  Share2,
  Copy,
} from "lucide-react";
import { DirectoryStore } from "@/schema/directory";
import { StoreCard } from "./StoreCard";

interface StoreProfileProps {
  store: DirectoryStore;
  similarStores: DirectoryStore[];
}

export const StoreProfile: React.FC<StoreProfileProps> = ({ store, similarStores }) => {
  const [copied, setCopied] = useState(false);

  const {
    id,
    name,
    slug,
    website,
    category,
    city,
    platform,
    description,
    logoUrl,
    productCount,
    isClaimed,
    tier,
    themeColor,
    bannerPattern,
    coverUrl,
    coverMobileUrl,
    tagline,
    highlights,
    instagramUrl,
    facebookUrl,
    tiktokUrl,
    youtubeUrl,
    linkedinUrl,
    twitterUrl,
  } = store;

  const brandColor = themeColor || "#3D7BFF";
  const brandHighlights: string[] = Array.isArray(highlights) ? highlights : [];

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Schema.org Organization structured data
  const socialList = [instagramUrl, facebookUrl, tiktokUrl, youtubeUrl, linkedinUrl, twitterUrl].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: name,
    url: website,
    description: description,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "PK",
    },
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(socialList.length > 0 ? { sameAs: socialList } : {}),
  };

  return (
    <div className="space-y-12">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Responsive Cover Banner Header */}
      {(coverUrl || coverMobileUrl) && (
        <div className="relative w-full rounded-3xl overflow-hidden border border-border shadow-sm">
          {/* Desktop Banner View (sm screens and above, or fallback for all) */}
          <div className={`${coverMobileUrl ? "hidden sm:block" : "block"} relative w-full h-48 sm:h-60 md:h-72 lg:h-80`}>
            <Image
              src={coverUrl || coverMobileUrl || ""}
              alt={`${name} desktop cover banner`}
              fill
              className="object-cover"
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          </div>

          {/* Dedicated Mobile Banner View (below sm screens, if mobile cover is specified) */}
          {coverMobileUrl && (
            <div className="block sm:hidden relative w-full h-44 sm:h-52">
              <Image
                src={coverMobileUrl}
                alt={`${name} mobile cover banner`}
                fill
                className="object-cover"
                priority
                unoptimized
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            </div>
          )}
        </div>
      )}

      {/* Main Header & Overview Card */}
      <div
        className="relative overflow-hidden rounded-3xl border p-6 md:p-8 shadow-sm transition-all"
        style={{
          borderColor: `${brandColor}35`,
          backgroundColor: "var(--card)",
        }}
      >
        {/* Dynamic Pattern Background */}
        {bannerPattern === "grid" && (
          <div
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.14] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, ${brandColor} 1px, transparent 1px), linear-gradient(to bottom, ${brandColor} 1px, transparent 1px)`,
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
              backgroundImage: `radial-gradient(${brandColor} 1.5px, transparent 1.5px)`,
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
              style={{ backgroundColor: brandColor }}
            />
            <div
              className="absolute -left-12 -bottom-12 w-72 h-72 rounded-full opacity-15 dark:opacity-25 blur-3xl pointer-events-none"
              style={{ backgroundColor: brandColor }}
            />
          </>
        )}
        {bannerPattern === "minimal" && (
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
            style={{ backgroundColor: brandColor }}
          />
        )}

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/80">
            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-2xl border bg-muted/60 flex items-center justify-center shadow-xs"
                style={{ borderColor: `${brandColor}40` }}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={`${name} logo`}
                    fill
                    className="object-cover"
                    sizes="96px"
                    priority
                    unoptimized
                  />
                ) : (
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/60" />
                )}
              </div>

              <div className="space-y-2">
                {/* Badges Row above Title */}
                <div className="flex items-center gap-2 flex-wrap">
                  {tier === "gold" && (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-300">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>Featured Store</span>
                    </span>
                  )}
                  {!isClaimed && (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <span>Unclaimed Listing</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                    {name}
                  </h1>
                  {isClaimed && (
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

                {/* Brand Tagline */}
                {tagline && (
                  <p className="text-sm md:text-base font-medium text-foreground/90 italic pt-0.5">
                    "{tagline}"
                  </p>
                )}

                {/* Tags */}
                <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground flex-wrap pt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" style={{ color: brandColor }} />
                    {city}, Pakistan
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" style={{ color: brandColor }} />
                    {category}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 bg-muted/70 px-2 py-0.5 rounded border border-border font-medium text-muted-foreground">
                    {platform || "Shopify"}
                  </span>
                </div>

                {/* Value Propositions / Custom Highlights */}
                {brandHighlights.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    {brandHighlights.map((h, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs"
                        style={{
                          backgroundColor: `${brandColor}12`,
                          borderColor: `${brandColor}35`,
                          color: brandColor,
                        }}
                      >
                        <Check className="h-3 w-3" />
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Copy / Share Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted active:scale-[0.98]"
                title="Copy shareable store profile link"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span>Share Store</span>
                  </>
                )}
              </button>

              {isClaimed && (
                <Link
                  href={`/stores/${slug}/edit`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-border/80 hover:bg-muted"
                >
                  <Settings className="h-4 w-4" style={{ color: brandColor }} />
                  Edit Profile
                </Link>
              )}

              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: brandColor }}
              >
                Visit Store
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Description & Quick Info Grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold text-foreground">About the Brand</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                {description}
              </p>
            </div>

            {/* Quick Info Box */}
            <div
              className="rounded-2xl border bg-muted/30 p-5 space-y-3.5 text-sm shadow-xs"
              style={{ borderColor: `${brandColor}25` }}
            >
              <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                Store Details
              </h3>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Category</span>
                <Link
                  href={`/stores/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="font-medium text-foreground hover:underline transition-colors"
                  style={{ color: brandColor }}
                >
                  {category}
                </Link>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Location</span>
                <Link
                  href={`/stores/city/${city.toLowerCase()}`}
                  className="font-medium text-foreground hover:underline transition-colors"
                  style={{ color: brandColor }}
                >
                  {city}
                </Link>
              </div>

              {productCount && (
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Catalog Size</span>
                  <span className="font-medium text-foreground">{productCount}+ products</span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">E-commerce Platform</span>
                <span className="font-medium text-foreground">{platform || "Shopify"}</span>
              </div>

              {/* Social Links (Instagram, Facebook, TikTok, YouTube, LinkedIn, Twitter/X) */}
              {socialList.length > 0 && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Socials</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {instagramUrl && (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-pink-500 transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {facebookUrl && (
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-blue-600 transition-colors"
                        title="Facebook"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}
                    {tiktokUrl && (
                      <a
                        href={tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-foreground transition-colors"
                        title="TikTok"
                      >
                        <Video className="h-4 w-4" />
                      </a>
                    )}
                    {youtubeUrl && (
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-red-500 transition-colors"
                        title="YouTube"
                      >
                        <Youtube className="h-4 w-4" />
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-blue-500 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {twitterUrl && (
                      <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-sky-400 transition-colors"
                        title="Twitter / X"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Listing Box (Unclaimed) OR ShopMate CTA (Claimed) */}
      {!isClaimed ? (
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 md:p-8 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-500 mb-1">
                <Clock className="h-3 w-3" />
                <span>Unclaimed listing — scheduled for directory rotation in 45 days if unverified</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg md:text-xl font-bold text-foreground">
                  Own or manage {name}? Claim this listing free
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Claim your profile to customize your brand colors, cover banner image, tagline, and receive verified high-intent discovery backlinks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Custom theme color & cover banner</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Green Verified Merchant badge</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Direct SEO authority backlink</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Brand tagline & custom value badges</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href={`/stores/claim?store=${slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black shadow-md transition-all hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98]"
              >
                Claim This Store
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8 backdrop-blur-sm shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg md:text-xl font-bold text-foreground">
                  Store Owner? Automate Your E-Commerce Workflows
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tired of manual product imports, variant syncing, and CSV spreadsheets? ShopMate automates Shopify inventory, image generation, and catalog enrichment in seconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href={`/stores/${slug}/edit`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-border/80 hover:bg-muted"
              >
                <Settings className="h-4 w-4" style={{ color: brandColor }} />
                Customize Branding & Theme
              </Link>
              <a
                href="https://shopmate.octively.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-95 hover:scale-[1.02]"
                style={{ backgroundColor: brandColor }}
              >
                Explore ShopMate
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Similar Stores in Category */}
      {similarStores.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                More {category} Stores in Pakistan
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Explore other verified direct-to-consumer brands.
              </p>
            </div>

            <Link
              href={`/stores/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs md:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Browse All {category}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarStores.map((item) => (
              <StoreCard key={item.id} store={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
