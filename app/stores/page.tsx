import React from "react";
import Link from "next/link";
import { getCategories, getCities, getFeaturedStores } from "@/lib/directory/queries";
import { CategoryCard } from "@/components/stores/CategoryCard";
import { CityCard } from "@/components/stores/CityCard";
import { StoreCard } from "@/components/stores/StoreCard";
import { Sparkles, ArrowRight, ShieldCheck, Plus, ShoppingBag, MapPin } from "lucide-react";

export const revalidate = 3600; // 1 hour ISR

export const metadata = {
  title: "Pakistani E-commerce Store Directory | Discover Online Shops",
  description:
    "Curated directory of Pakistan's best online stores. Find fashion, beauty, and home brands from Karachi, Lahore, and across Pakistan.",
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
      <section className="relative rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 via-card/40 to-background p-8 md:p-14 text-center backdrop-blur-md shadow-sm overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated E-Commerce Discovery</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
          Discover Pakistan's Best E-Commerce Stores
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Browse verified direct-to-consumer brands, artisan ateliers, and boutique shops across Karachi, Lahore, Islamabad, and beyond.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/stores/category/fashion"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02]"
          >
            Explore Fashion
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/stores/submit"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 text-primary" />
            Submit Your Store
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
