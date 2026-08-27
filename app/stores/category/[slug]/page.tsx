import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getStoresByCategory, getCities, getCategories } from "@/lib/directory/queries";
import { StoreCard } from "@/components/stores/StoreCard";
import { StoreFilterBar } from "@/components/stores/StoreFilterBar";
import { ChevronRight, Home, Plus, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ city?: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | Pakistani E-commerce Store Directory",
    };
  }

  return {
    title: category.metaTitle || `Best ${category.name} E-commerce Stores in Pakistan | Owais Abdullah`,
    description:
      category.metaDescription ||
      `Discover the top ${category.name.toLowerCase()} online stores in Pakistan. Browse verified e-commerce shops from Karachi, Lahore, and across Pakistan.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { city } = await searchParams;

  const [category, cities] = await Promise.all([
    getCategoryBySlug(slug),
    getCities(),
  ]);

  if (!category) {
    notFound();
  }

  const stores = await getStoresByCategory(category.name, city);

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
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          <span>Category Discovery</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Best {category.name} E-Commerce Stores in Pakistan
        </h1>
        {category.description && (
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Filter Bar */}
      <StoreFilterBar
        type="city"
        options={cities.map((c) => ({ name: c.name, slug: c.slug }))}
        currentFilter={city}
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
            No stores found in {city ? `${city} for ${category.name}` : category.name}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We are actively researching and onboarding top brands. Know or own a store in this category?
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

      {/* Low Store Count Notice */}
      {stores.length > 0 && stores.length < 3 && (
        <div className="rounded-xl border border-border/80 bg-muted/20 p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            More {category.name.toLowerCase()} stores are currently in review.
          </p>
          <Link
            href="/stores/submit"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Submit your store to be listed next
          </Link>
        </div>
      )}
    </div>
  );
}
