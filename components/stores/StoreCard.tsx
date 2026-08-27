"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ExternalLink, MapPin, Tag, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { DirectoryStore } from "@/schema/directory";

interface StoreCardProps {
  store: DirectoryStore;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const {
    name,
    slug,
    website,
    category,
    city,
    platform,
    description,
    logoUrl,
    isClaimed,
    tier,
  } = store;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card text-card-foreground p-5 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
      {/* Clickable full card overlay link to listing details */}
      <Link
        href={`/stores/${slug}`}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`View ${name} profile`}
      />

      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/60 flex items-center justify-center shadow-xs">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="48px"
                  unoptimized
                />
              ) : (
                <ShoppingBag className="h-6 w-6 text-muted-foreground/60" />
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors truncate">
                  {name}
                </h3>
                {isClaimed && (
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

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary/70" />
                  {city}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Tag className="h-3 w-3 text-primary/70" />
                  {category}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Badge Top Right */}
          {tier === "gold" && (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-300">
              <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3.5 border-t border-border/80 flex items-center justify-between gap-2 mt-auto relative z-20">
        <span className="inline-flex items-center text-[11px] font-semibold text-muted-foreground bg-muted/70 px-2.5 py-0.5 rounded-md border border-border">
          {platform || "Shopify"}
        </span>

        <div className="flex items-center gap-2">
          {/* External website link (Only button that navigates to store external URL) */}
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border"
            title={`Visit ${name} official website (${website})`}
            aria-label={`Visit ${name} website`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
            View Details
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
