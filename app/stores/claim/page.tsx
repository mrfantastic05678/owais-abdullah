import React from "react";
import Link from "next/link";
import { getUnclaimedStores } from "@/lib/directory/queries";
import { ClaimForm } from "@/components/stores/ClaimForm";
import { ShieldCheck, ChevronRight, Home, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Claim Your Store Listing | Pakistani E-commerce Directory",
  description:
    "Are you the founder or manager of a listed Pakistani e-commerce store? Claim your profile free to update information and add verified badges.",
};

interface ClaimPageProps {
  searchParams: Promise<{ store?: string }>;
}

export default async function ClaimStorePage({ searchParams }: ClaimPageProps) {
  const { store: prefilledSlug } = await searchParams;
  const unclaimedStores = await getUnclaimedStores();

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Breadcrumbs */}
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
        <span className="text-foreground font-medium">Claim Listing</span>
      </nav>

      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Merchant Verification</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Claim Your Store Profile
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Verify your ownership to manage your brand details, receive the Blue Verified badge, and boost search visibility.
        </p>
      </div>

      {/* 3 Verification Methods Callout */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          3 Ways We Authorize & Verify Store Ownership:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-border/80 bg-background/80 p-4 space-y-1.5 shadow-sm">
            <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary text-[10px]">
              Fastest (Instant)
            </span>
            <h3 className="font-semibold text-foreground">1. Domain Email</h3>
            <p className="text-muted-foreground leading-relaxed">
              Submitting with your brand email (e.g. <code className="text-foreground">owner@yourstore.pk</code>) grants fast-track verification.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/80 p-4 space-y-1.5 shadow-sm">
            <span className="inline-block rounded-full bg-blue-500/10 px-2 py-0.5 font-bold text-blue-500 text-[10px]">
              Direct Contact
            </span>
            <h3 className="font-semibold text-foreground">2. Official WhatsApp</h3>
            <p className="text-muted-foreground leading-relaxed">
              We cross-check your <code className="text-foreground">+92</code> WhatsApp with the phone on your website or Instagram bio.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/80 p-4 space-y-1.5 shadow-sm">
            <span className="inline-block rounded-full bg-pink-500/10 px-2 py-0.5 font-bold text-pink-500 text-[10px]">
              Social Proof
            </span>
            <h3 className="font-semibold text-foreground">3. Instagram DM</h3>
            <p className="text-muted-foreground leading-relaxed">
              Using a personal Gmail? Simply send a 1-word confirmation DM from your official store handle (<code className="text-foreground">@store</code>).
            </p>
          </div>
        </div>
      </div>

      {/* Claim Benefits Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-border bg-muted/40 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">Custom Logo & Bio</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">Verified Badge</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">DoFollow Backlink</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">Owner Edit Portal</span>
        </div>
      </div>

      {/* Claim Form Component */}
      <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
        <ClaimForm
          unclaimedStores={unclaimedStores}
          prefilledSlug={prefilledSlug}
        />
      </div>
    </div>
  );
}
