"use client";

import React, { useActionState, useState } from "react";
import { submitClaimAction, ActionResult } from "@/app/actions/directory";
import { ShieldCheck, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UnclaimedStoreOption {
  id: number;
  name: string;
  slug: string;
}

interface ClaimFormProps {
  unclaimedStores: UnclaimedStoreOption[];
  prefilledSlug?: string;
}

export const ClaimForm: React.FC<ClaimFormProps> = ({ unclaimedStores, prefilledSlug }) => {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    submitClaimAction,
    null
  );

  const [selectedStore, setSelectedStore] = useState(prefilledSlug || "");

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center backdrop-blur-md max-w-xl mx-auto space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Claim Submitted!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {state.message ||
              "Thanks! We'll verify your claim within 24 hours and contact you via WhatsApp."}
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

      {/* Store Selection */}
      <div className="space-y-2">
        <label htmlFor="storeId" className="text-sm font-semibold text-foreground">
          Select Store <span className="text-destructive">*</span>
        </label>
        <select
          id="storeId"
          name="storeId"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          required
          className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">-- Choose a store from the directory --</option>
          {unclaimedStores.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Don't see your store listed?{" "}
          <Link href="/stores/submit" className="text-primary hover:underline font-medium">
            Submit a new listing instead.
          </Link>
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="claimantName" className="text-sm font-semibold text-foreground">
          Your Full Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="claimantName"
          name="claimantName"
          placeholder="e.g. Fatima Khan"
          required
          className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="claimantEmail" className="text-sm font-semibold text-foreground">
          Work or Store Email <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          id="claimantEmail"
          name="claimantEmail"
          placeholder="owner@yourstore.pk (Domain email speeds up instant verification)"
          required
          className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground">
          Tip: Using your store domain email (e.g. <code className="text-foreground">hello@store.pk</code>) enables instant approval.
        </p>
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <label htmlFor="claimantWhatsapp" className="text-sm font-semibold text-foreground">
          Official WhatsApp Number (Pakistan) <span className="text-destructive">*</span>
        </label>
        <input
          type="tel"
          id="claimantWhatsapp"
          name="claimantWhatsapp"
          placeholder="+92 300 1234567"
          required
          className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground">
          Must begin with country code <span className="font-mono text-foreground">+92</span>. We verify this against your website contact.
        </p>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label htmlFor="claimantRole" className="text-sm font-semibold text-foreground">
          Your Role with the Business
        </label>
        <select
          id="claimantRole"
          name="claimantRole"
          defaultValue="Owner / Founder"
          className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="Owner / Founder">Owner / Founder</option>
          <option value="Store Manager">Store Manager / Operations</option>
          <option value="Marketing Lead">Marketing Lead</option>
          <option value="Agency Partner">Agency Partner</option>
        </select>
      </div>

      {/* Message / Proof */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-foreground">
          Verification Proof / Instagram Handle (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="e.g. Verified via Instagram @storehandle or official business registration."
          className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
        />
        <p className="text-xs text-muted-foreground">
          If using a personal email, you can confirm via Instagram DM from your official page.
        </p>
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
            Submitting Claim...
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            Claim Listing Free
          </>
        )}
      </button>
    </form>
  );
};
