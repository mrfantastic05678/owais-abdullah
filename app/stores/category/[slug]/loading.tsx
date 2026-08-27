import React from "react";
import { StoreCardSkeleton } from "@/components/stores/StoreCardSkeleton";

export default function CategoryStoresLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Breadcrumb & Header Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-9 w-64 rounded-lg bg-muted" />
        <div className="h-4 w-80 max-w-full rounded bg-muted/70" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-14 w-full rounded-2xl bg-card border border-border" />

      {/* Stores Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StoreCardSkeleton />
        <StoreCardSkeleton />
        <StoreCardSkeleton />
        <StoreCardSkeleton />
        <StoreCardSkeleton />
        <StoreCardSkeleton />
      </div>
    </div>
  );
}
