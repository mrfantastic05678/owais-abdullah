import React from "react";
import Link from "next/link";
import { DirectoryCategory } from "@/schema/directory";
import { Sparkles, Shirt, Home, ArrowUpRight, ShoppingBag } from "lucide-react";

interface CategoryCardProps {
  category: DirectoryCategory;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { name, slug, description, storeCount } = category;

  const getCategoryIcon = (slugName: string) => {
    switch (slugName.toLowerCase()) {
      case "fashion":
        return <Shirt className="h-6 w-6 text-pink-500" />;
      case "beauty":
        return <Sparkles className="h-6 w-6 text-purple-500" />;
      case "home-living":
      case "home":
        return <Home className="h-6 w-6 text-amber-500" />;
      default:
        return <ShoppingBag className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <Link
      href={`/stores/category/${slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] text-card-foreground p-6 shadow-xs transition-all duration-300 hover:border-teal-500/50 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl border border-slate-200 dark:border-[#10343A] bg-slate-50 dark:bg-[#05181b] p-3 transition-colors group-hover:border-teal-500/30 group-hover:bg-teal-500/10 shadow-xs">
          {getCategoryIcon(slug)}
        </div>
        <span className="flex items-center text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-[#05181b] px-2.5 py-1 rounded-full border border-slate-200 dark:border-[#10343A]">
          {storeCount || 0} {storeCount === 1 ? "store" : "stores"}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {name}
          </h3>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
        </div>
        {description && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
};
