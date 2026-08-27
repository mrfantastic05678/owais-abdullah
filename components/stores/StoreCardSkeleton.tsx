import React from "react";

export const StoreCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm animate-pulse">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Box */}
            <div className="h-12 w-12 shrink-0 rounded-xl bg-muted" />

            <div className="space-y-2 min-w-0">
              {/* Title */}
              <div className="h-4 w-32 rounded-md bg-muted" />
              {/* City • Category Meta */}
              <div className="h-3 w-24 rounded-md bg-muted/80" />
            </div>
          </div>

          {/* Badges Placeholder */}
          <div className="h-5 w-16 rounded-full bg-muted/70 shrink-0" />
        </div>

        {/* Description Lines */}
        <div className="space-y-2 my-4">
          <div className="h-3 w-full rounded bg-muted/80" />
          <div className="h-3 w-5/6 rounded bg-muted/80" />
          <div className="h-3 w-3/4 rounded bg-muted/60" />
        </div>
      </div>

      {/* Footer Row */}
      <div className="pt-3.5 border-t border-border/80 flex items-center justify-between gap-2 mt-auto">
        <div className="h-5 w-16 rounded-md bg-muted" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
};
