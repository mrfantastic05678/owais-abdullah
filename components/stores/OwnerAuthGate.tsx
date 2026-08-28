"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ArrowLeft, ShieldAlert, KeyRound } from "lucide-react";
import Link from "next/link";

interface OwnerAuthGateProps {
  slug: string;
  storeName: string;
  isInvalidToken?: boolean;
}

export const OwnerAuthGate: React.FC<OwnerAuthGateProps> = ({
  slug,
  storeName,
  isInvalidToken = false,
}) => {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState(
    isInvalidToken ? "The provided verification token is invalid or has expired." : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken) {
      setError("Please enter your owner verification token.");
      return;
    }
    setError("");
    router.push(`/stores/${slug}/edit?token=${encodeURIComponent(cleanToken)}`);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-xs">
          <Lock className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Owner Access Verification
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This listing is verified and managed by <strong className="text-foreground">{storeName}</strong>. Please enter your secret Owner Verification Token to customize brand colors, cover banners, and details.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive text-left">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-2">
            <label
              htmlFor="tokenInput"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
            >
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              Owner Verification Token
            </label>
            <input
              type="password"
              id="tokenInput"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Enter your secret token"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            Unlock Owner Portal
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-border/80">
          <p className="text-xs text-muted-foreground">
            Lost your token? Check the confirmation details provided during verification or contact directory support.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          href={`/stores/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to {storeName} Profile
        </Link>
      </div>
    </div>
  );
};
