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
      className="group relative flex items-center justify-between rounded-2xl border border-border bg-card text-card-foreground p-4 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3.5">
        <div className="rounded-xl border border-border bg-muted/60 p-2.5 text-primary transition-colors group-hover:bg-primary/10 shadow-xs">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h4>
          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-primary/70" /> Pakistan
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground bg-muted/70 px-2.5 py-1 rounded-full border border-border">
          {storeCount || 0}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-primary" />
      </div>
    </Link>
  );
};
