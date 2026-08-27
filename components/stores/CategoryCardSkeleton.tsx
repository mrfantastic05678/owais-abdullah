import React from "react";

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-12 w-12 rounded-xl bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted/80" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-5 w-28 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted/70" />
      </div>
    </div>
  );
};
