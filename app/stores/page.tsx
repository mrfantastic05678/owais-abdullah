import React from "react";
import Link from "next/link";
import { getCategories, getCities, getFeaturedStores } from "@/lib/directory/queries";
import { CategoryCard } from "@/components/stores/CategoryCard";
import { CityCard } from "@/components/stores/CityCard";
import { StoreCard } from "@/components/stores/StoreCard";
import { Sparkles, ArrowRight, ShieldCheck, Plus, ShoppingBag, MapPin } from "lucide-react";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

import { Metadata } from "next";

export const revalidate = 86400; // 24 hours ISR (on-demand revalidated on mutations)

export const metadata: Metadata = {
  title: "Pakistani E-commerce Store Directory | Discover Online Shops",
  description:
    "Curated directory of Pakistan's best online stores. Find fashion, beauty, and home brands from Karachi, Lahore, and across Pakistan.",
  openGraph: {
    title: "Pakistani E-commerce Store Directory | Discover Online Shops",
    description:
      "Curated directory of Pakistan's best online stores. Find fashion, beauty, and home brands from Karachi, Lahore, and across Pakistan.",
    url: "https://owaisabdullah.dev/stores",
    siteName: "Owais Abdullah Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistani E-commerce Store Directory | Discover Online Shops",
    description:
      "Curated directory of Pakistan's best online stores. Find fashion, beauty, and home brands from Karachi, Lahore, and across Pakistan.",
  },
  alternates: {
    canonical: "https://owaisabdullah.dev/stores",
  },
};

export default async function StoresHomePage() {
  const [categories, cities, featuredStores] = await Promise.all([
    getCategories(),
    getCities(),
    getFeaturedStores(6),
  ]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] p-8 md:p-14 text-center shadow-lg shadow-teal-950/5 overflow-hidden">
        <div className="absolute inset-0 bg-dot-lattice opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated E-Commerce Discovery</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
          Discover Pakistan&apos;s Best E-Commerce Stores
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Browse verified direct-to-consumer brands, artisan ateliers, and boutique shops across Karachi, Lahore, Islamabad, and beyond.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/stores/category/fashion"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:opacity-95 hover:scale-[1.02]"
          >
            <SplitFlapLabel primary="Explore Fashion" secondary="Browse Brands" className="min-w-[7.5rem]" />
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/stores/submit"
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-[#10343A] bg-white dark:bg-[#081B1E] px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-teal-500 hover:bg-teal-500/10 min-w-[10rem]"
          >
            <Plus className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <SplitFlapLabel primary="Submit Your Store" secondary="Add New Brand" className="min-w-[8.5rem]" />
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Browse by Category
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Explore curated brands organized by industry
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Stores (Gold Tier) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Featured Stores
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              High-growth Shopify stores with active collections and proven track records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* Cities Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Browse by City
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Find homegrown direct-to-consumer businesses across Pakistan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-8 md:p-12 backdrop-blur-md shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold text-foreground">
              Own or Manage an E-Commerce Store in Pakistan?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get listed on the directory to gain verified discovery backlinks, showcase your catalog, and attract high-intent shoppers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/stores/claim"
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:border-primary/50 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              Claim Existing Listing
            </Link>
            <Link
              href="/stores/submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Submit New Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
