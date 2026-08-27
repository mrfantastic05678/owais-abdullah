import React from "react";
import { StoreCardSkeleton } from "@/components/stores/StoreCardSkeleton";
import { CategoryCardSkeleton } from "@/components/stores/CategoryCardSkeleton";

export default function StoresLoading() {
  return (
    <div className="space-y-16 animate-pulse">
      {/* Hero Header Skeleton */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="h-6 w-32 rounded-full bg-muted mx-auto" />
        <div className="h-10 md:h-12 w-3/4 max-w-lg rounded-xl bg-muted mx-auto" />
        <div className="h-4 w-full max-w-md rounded bg-muted/70 mx-auto" />

        {/* Search & Action Bar */}
        <div className="pt-6 max-w-xl mx-auto flex gap-3">
          <div className="h-12 flex-1 rounded-xl bg-muted" />
          <div className="h-12 w-28 rounded-xl bg-muted" />
        </div>
      </div>

      {/* Categories Grid Skeleton */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted/60" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCardSkeleton />
          <CategoryCardSkeleton />
          <CategoryCardSkeleton />
        </div>
      </section>

      {/* Featured Stores Grid Skeleton */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded bg-muted" />
          <div className="h-4 w-80 rounded bg-muted/60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StoreCardSkeleton />
          <StoreCardSkeleton />
          <StoreCardSkeleton />
          <StoreCardSkeleton />
          <StoreCardSkeleton />
          <StoreCardSkeleton />
        </div>
      </section>
    </div>
  );
}
