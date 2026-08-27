import React from "react";
import { StoreCardSkeleton } from "./StoreCardSkeleton";

export const StoreProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Cover Banner Skeleton */}
      <div className="w-full h-48 sm:h-64 md:h-72 rounded-3xl bg-muted/60" />

      {/* Main Header & Overview Card */}
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/80">
          <div className="flex items-start gap-4 md:gap-6">
            {/* Logo placeholder */}
            <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 rounded-2xl bg-muted" />

            <div className="space-y-3">
              {/* Badge */}
              <div className="h-5 w-24 rounded-md bg-muted/80" />
              {/* Title */}
              <div className="h-8 w-48 sm:w-64 rounded-lg bg-muted" />
              {/* Tagline */}
              <div className="h-4 w-72 max-w-full rounded bg-muted/70" />
              {/* Tags */}
              <div className="flex items-center gap-2 pt-1">
                <div className="h-4 w-24 rounded bg-muted/60" />
                <div className="h-4 w-20 rounded bg-muted/60" />
                <div className="h-4 w-16 rounded bg-muted/60" />
              </div>
            </div>
          </div>

          {/* Action button skeleton */}
          <div className="h-10 w-32 rounded-xl bg-muted shrink-0" />
        </div>

        {/* Description & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-5 w-36 rounded bg-muted" />
            <div className="space-y-2.5 pt-2">
              <div className="h-4 w-full rounded bg-muted/80" />
              <div className="h-4 w-full rounded bg-muted/80" />
              <div className="h-4 w-5/6 rounded bg-muted/80" />
              <div className="h-4 w-4/5 rounded bg-muted/70" />
            </div>
          </div>

          {/* Quick info box skeleton */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-4">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="space-y-3 pt-1">
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-muted/70" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-muted/70" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-20 rounded bg-muted/70" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-24 rounded bg-muted/70" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar stores grid skeleton */}
      <div className="space-y-6 pt-4 border-t border-border/60">
        <div className="space-y-2">
          <div className="h-6 w-56 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted/60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StoreCardSkeleton />
          <StoreCardSkeleton />
          <StoreCardSkeleton />
        </div>
      </div>
    </div>
  );
};
