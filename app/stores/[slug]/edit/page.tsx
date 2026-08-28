import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/directory/queries";
import { EditStoreForm } from "@/components/stores/EditStoreForm";
import { OwnerAuthGate } from "@/components/stores/OwnerAuthGate";
import { ChevronRight, Home, Settings } from "lucide-react";
import { Metadata } from "next";

interface EditStorePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: EditStorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    return {
      title: "Store Not Found | Store Directory",
    };
  }

  return {
    title: `Edit ${store.name} Profile | Store Directory Settings`,
    description: `Manage and update verified brand information for ${store.name}.`,
    robots: {
      index: false, // Don't index owner edit pages in search engines
      follow: false,
    },
  };
}

export default async function EditStorePage({ params, searchParams }: EditStorePageProps) {
  const { slug } = await params;
  const { token } = await searchParams;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  // Security Verification: Check if the token provided in the URL matches the store's edit token
  const isAuthenticated = Boolean(
    store.editToken && token && token.trim() === store.editToken.trim()
  );

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
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
        <Link href={`/stores/${store.slug}`} className="hover:text-foreground">
          {store.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">
          {isAuthenticated ? "Edit Profile" : "Owner Verification"}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Settings className="h-3.5 w-3.5" />
          <span>Owner Management Portal</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {isAuthenticated ? `Edit ${store.name}` : `Manage ${store.name}`}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          {isAuthenticated
            ? "Update your store's live directory listing, brand description, product count, and social links."
            : "Authenticate with your secret Owner Token to unlock editing and brand customization."}
        </p>
      </div>

      {/* Content: Authenticated Editor OR Owner Gate */}
      {isAuthenticated ? (
        <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
          <EditStoreForm store={store} providedToken={token} />
        </div>
      ) : (
        <OwnerAuthGate
          slug={store.slug}
          storeName={store.name}
          isInvalidToken={Boolean(token && token !== store.editToken)}
        />
      )}
    </div>
  );
}
