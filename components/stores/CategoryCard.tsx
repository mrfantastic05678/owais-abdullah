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
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl border border-border bg-muted/60 p-3 transition-colors group-hover:border-primary/30 group-hover:bg-primary/5 shadow-xs">
          {getCategoryIcon(slug)}
        </div>
        <span className="flex items-center text-xs font-semibold text-muted-foreground bg-muted/70 px-2.5 py-1 rounded-full border border-border">
          {storeCount || 0} {storeCount === 1 ? "store" : "stores"}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-primary" />
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
