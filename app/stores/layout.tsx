import React from "react";
import Link from "next/link";
import { Store, Plus, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: {
    template: "%s | Pakistani E-commerce Store Directory",
    default: "Pakistani E-commerce Store Directory | Discover Verified Online Shops",
  },
  description:
    "Curated directory of Pakistan's top online stores across Fashion, Beauty, and Home & Living. Discover verified direct-to-consumer brands from Karachi, Lahore, and Islamabad.",
};

export default function StoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-foreground selection:bg-primary/20 selection:text-primary pt-28 md:pt-32 pb-16">
      {/* Directory Secondary Subnav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8">
        <div className="rounded-2xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar text-xs md:text-sm shadow-sm">
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Link
              href="/stores"
              className="inline-flex items-center gap-1.5 font-bold text-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors pr-2 sm:pr-4 border-r border-slate-200 dark:border-[#10343A]"
            >
              <Store className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>Directory</span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/stores/category/fashion"
                className="px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-teal-950/40 transition-colors"
              >
                Fashion
              </Link>
              <Link
                href="/stores/category/beauty"
                className="px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-teal-950/40 transition-colors"
              >
                Beauty
              </Link>
              <Link
                href="/stores/category/home-living"
                className="px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-teal-950/40 transition-colors"
              >
                Home & Living
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/stores/claim"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#10343A] bg-slate-50 dark:bg-[#05181b] px-3 py-1 text-xs font-medium text-foreground hover:border-teal-500 hover:text-teal-600 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Claim Listing</span>
            </Link>
            <Link
              href="/stores/submit"
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 px-3.5 py-1 text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-opacity"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Submit Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
