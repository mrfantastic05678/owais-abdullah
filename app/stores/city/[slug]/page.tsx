import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityBySlug, getStoresByCity, getCategories, getCities } from "@/lib/directory/queries";
import { StoreCard } from "@/components/stores/StoreCard";
import { StoreFilterBar } from "@/components/stores/StoreFilterBar";
import { ChevronRight, Home, Plus, MapPin } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 3600;

interface CityPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    return {
      title: "City Not Found | Pakistani E-commerce Store Directory",
    };
  }

  return {
    title: city.metaTitle || `Online Stores in ${city.name}, Pakistan | E-commerce Directory`,
    description:
      city.metaDescription ||
      `Browse e-commerce stores based in ${city.name}. Find fashion, beauty, and lifestyle brands shipping across Pakistan.`,
  };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { slug } = await params;
  const { category } = await searchParams;

  const [city, categories] = await Promise.all([
    getCityBySlug(slug),
    getCategories(),
  ]);

  if (!city) {
    notFound();
  }

  const stores = await getStoresByCity(city.name, category);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/stores" className="hover:text-foreground">
          Stores
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{city.name}</span>
      </nav>

      {/* City Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
          <MapPin className="h-3 w-3" />
          <span>City Discovery</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          E-Commerce Stores in {city.name}, Pakistan
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          Browse verified direct-to-consumer online shops, artisans, and boutiques based in {city.name}.
        </p>
      </div>

      {/* Filter Bar */}
      <StoreFilterBar
        type="category"
        options={categories.map((c) => ({ name: c.name, slug: c.slug }))}
        currentFilter={category}
        totalCount={stores.length}
      />

      {/* Stores Grid */}
      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            No stores found in {city.name} {category ? `under ${category}` : ""}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We are actively researching and onboarding top brands from {city.name}. Know or own a store here?
          </p>
          <div className="pt-2">
            <Link
              href="/stores/submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Submit a Store
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
