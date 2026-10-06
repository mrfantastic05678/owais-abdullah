import React from "react";
import Link from "next/link";
import { DirectoryCity } from "@/schema/directory";
import { MapPin, ArrowUpRight, Building2 } from "lucide-react";

interface CityCardProps {
  city: DirectoryCity;
}

export const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const { name, slug, storeCount } = city;

  return (
    <Link
      href={`/stores/city/${slug}`}
      className="group relative flex items-center justify-between rounded-2xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] text-card-foreground p-4 shadow-xs transition-all duration-300 hover:border-teal-500/50 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3.5">
        <div className="rounded-xl border border-slate-200 dark:border-[#10343A] bg-slate-50 dark:bg-[#05181b] p-2.5 text-teal-600 dark:text-teal-400 transition-colors group-hover:bg-teal-500/10 shadow-xs">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {name}
          </h4>
          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-teal-600 dark:text-teal-400" /> Pakistan
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-[#05181b] px-2.5 py-1 rounded-full border border-slate-200 dark:border-[#10343A]">
          {storeCount || 0}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
      </div>
    </Link>
  );
};
