"use client";

import React, { useActionState } from "react";
import { submitStoreAction, ActionResult } from "@/app/actions/directory";
import { PlusCircle, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const SubmitForm: React.FC = () => {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    submitStoreAction,
    null
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center backdrop-blur-md max-w-xl mx-auto space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Store Submitted for Review!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {state.message ||
              "Thanks! We will review your store within 48 hours and publish your listing once approved."}
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6 max-w-xl mx-auto">
      {state?.error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Store Name */}
      <div className="space-y-2">
        <label htmlFor="storeName" className="text-sm font-semibold text-foreground">
          Store Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="storeName"
          name="storeName"
          placeholder="e.g. Yousuf Living"
          required
          className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Website URL */}
      <div className="space-y-2">
        <label htmlFor="websiteUrl" className="text-sm font-semibold text-foreground">
          Website URL <span className="text-destructive">*</span>
        </label>
        <input
          type="url"
          id="websiteUrl"
          name="websiteUrl"
          placeholder="https://www.yourstore.pk"
          required
          className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Category & City 2-col Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue="Fashion"
            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Home & Living">Home & Living</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-semibold text-foreground">
            City <span className="text-destructive">*</span>
          </label>
          <select
            id="city"
            name="city"
            required
            defaultValue="Karachi"
            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Karachi">Karachi</option>
            <option value="Lahore">Lahore</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Faisalabad">Faisalabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
            <option value="Peshawar">Peshawar</option>
          </select>
        </div>
      </div>

      {/* Platform & Instagram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="platform" className="text-sm font-semibold text-foreground">
            E-commerce Platform <span className="text-destructive">*</span>
          </label>
          <select
            id="platform"
            name="platform"
            required
            defaultValue="Shopify"
            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Shopify">Shopify</option>
            <option value="WooCommerce">WooCommerce</option>
            <option value="Custom / Other">Custom / Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="instagramUrl" className="text-sm font-semibold text-foreground">
            Instagram URL
          </label>
          <input
            type="url"
            id="instagramUrl"
            name="instagramUrl"
            placeholder="https://instagram.com/yourstore"
            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Contact Info Header */}
      <div className="pt-2 border-t border-border/60">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Owner / Contact Information
        </h4>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="claimantName" className="text-sm font-semibold text-foreground">
              Your Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="claimantName"
              name="claimantName"
              placeholder="e.g. Ahmed Raza"
              required
              className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="claimantEmail" className="text-sm font-semibold text-foreground">
                Your Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                id="claimantEmail"
                name="claimantEmail"
                placeholder="ahmed@yourstore.pk"
                required
                className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="claimantWhatsapp" className="text-sm font-semibold text-foreground">
                WhatsApp Number <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                id="claimantWhatsapp"
                name="claimantWhatsapp"
                placeholder="+92 300 1234567"
                required
                className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description / Pitch */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-semibold text-foreground">
          Store Description & What Makes Your Brand Unique
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Briefly describe what you sell, your signature collections, and your brand style..."
          className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting Store...
          </>
        ) : (
          <>
            <PlusCircle className="h-4 w-4" />
            Submit Store for Verification
          </>
        )}
      </button>
    </form>
  );
};
