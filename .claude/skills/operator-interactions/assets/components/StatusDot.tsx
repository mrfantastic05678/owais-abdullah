"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface StatusDotProps {
  size?: number;
  className?: string;
}

/** The "live/online" signal-ping dot, shared by the hero badge and the
 * agent-status table so both read as the same status motif. Reduced
 * motion drops the expanding ring and keeps only the solid dot. */
export default function StatusDot({ size = 8, className = "" }: StatusDotProps) {
  const reduced = usePrefersReducedMotion();
  const px = `${size}px`;

  return (
    <span className={`relative inline-flex ${className}`} style={{ width: px, height: px }}>
      {!reduced && (
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-500 opacity-75"
          aria-hidden="true"
        />
      )}
      <span
        className="relative inline-flex h-full w-full rounded-full bg-signal-500"
        style={{ boxShadow: "0 0 8px var(--signal-500)" }}
      />
    </span>
  );
}
