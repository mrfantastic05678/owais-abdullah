import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreBySlug, getSimilarStores, getAllStoreSlugs } from "@/lib/directory/queries";
import { StoreProfile } from "@/components/stores/StoreProfile";
import { ChevronRight, Home } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 3600;

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllStoreSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    return {
      title: "Store Not Found | Pakistani E-commerce Store Directory",
    };
  }

  const cleanDescription = store.description?.slice(0, 155) || `Explore ${store.name}, an online ${store.category.toLowerCase()} brand based in ${store.city}, Pakistan.`;

  return {
    title: `${store.name} | ${store.category} Store in ${store.city} | Pakistani E-commerce Directory`,
    description: cleanDescription,
    openGraph: {
      title: `${store.name} - Pakistani E-commerce Store Directory`,
      description: cleanDescription,
      images: store.logoUrl ? [store.logoUrl] : [],
    },
  };
}

export default async function StoreDetailPage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const categorySlug = store.category.toLowerCase().replace(/\s+/g, "-");
  const similarStores = await getSimilarStores(store.category, store.id, 3);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/stores" className="hover:text-foreground">
          Stores
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/stores/category/${categorySlug}`} className="hover:text-foreground">
          {store.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {store.name}
        </span>
      </nav>

      {/* Main Profile Component */}
      <StoreProfile store={store} similarStores={similarStores} />
    </div>
  );
}
