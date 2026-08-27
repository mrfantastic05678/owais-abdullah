import React from "react";
import Link from "next/link";
import { SubmitForm } from "@/components/stores/SubmitForm";
import { PlusCircle, ChevronRight, Home, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Submit Your Store | Pakistani E-commerce Store Directory",
  description:
    "Submit your Pakistani Shopify or e-commerce store to be featured on the directory. Boost discovery and backlinks.",
};

export default function SubmitStorePage() {
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
        <span className="text-foreground font-medium">Submit Store</span>
      </nav>

      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Inbound Submission</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Submit Your E-Commerce Store
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Get your brand discovered by shoppers across Pakistan. We review and list active Shopify & e-commerce stores for free.
        </p>
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-border bg-muted/40 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">Operating in Pakistan</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">Working SSL & Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">Reviewed within 48h</span>
        </div>
      </div>

      {/* Submit Form Component */}
      <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
        <SubmitForm />
      </div>
    </div>
  );
}
