"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X } from "lucide-react";

interface StoreFilterBarProps {
  type: "city" | "category";
  options: { name: string; slug: string }[];
  currentFilter?: string;
  totalCount: number;
}

export const StoreFilterBar: React.FC<StoreFilterBarProps> = ({
  type,
  options,
  currentFilter,
  totalCount,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set(type === "city" ? "city" : "category", val);
    } else {
      params.delete(type === "city" ? "city" : "category");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeValue = searchParams.get(type === "city" ? "city" : "category") || currentFilter || "";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card text-card-foreground p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4 text-primary" />
        <span>
          Showing <strong className="text-foreground">{totalCount}</strong> verified stores
        </span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <label htmlFor="filter-select" className="text-xs font-semibold text-muted-foreground shrink-0">
          Filter by {type === "city" ? "City" : "Category"}:
        </label>
        <select
          id="filter-select"
          value={activeValue}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48"
        >
          <option value="">All {type === "city" ? "Cities" : "Categories"}</option>
          {options.map((opt) => (
            <option key={opt.slug} value={opt.name}>
              {opt.name}
            </option>
          ))}
        </select>

        {activeValue && (
          <button
            onClick={() => handleFilterChange("")}
            className="p-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/80 flex items-center gap-1"
            title="Clear filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
