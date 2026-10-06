"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogImageWithSkeletonProps extends ImageProps {
  containerClassName?: string;
  showPlaceholderBadge?: boolean;
}

/**
 * Editorial Image component featuring a pulsing placeholder skeleton with
 * an ambient shimmer sweep until the image asset has fully decoded and loaded.
 */
export function BlogImageWithSkeleton({
  containerClassName,
  className,
  alt,
  showPlaceholderBadge = true,
  onLoad,
  onError,
  fill,
  ...props
}: BlogImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        fill ? "w-full h-full" : "",
        containerClassName
      )}
    >
      {/* Pulsing Placeholder Skeleton with Shimmer Sweep */}
      {!isLoaded && !hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-200 dark:bg-[#031417] animate-pulse pointer-events-none select-none overflow-hidden"
        >
          {/* Shimmer sweep gradient */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-emerald-400/10 to-transparent -translate-x-full animate-shimmer-sweep pointer-events-none" />

          {/* Blueprint/editorial asset placeholder badge */}
          {showPlaceholderBadge && (
            <div className="relative z-10 flex flex-col items-center gap-2 text-muted-foreground/50 transition-opacity">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-300/60 dark:bg-[#082226] border border-slate-300 dark:border-emerald-500/20 flex items-center justify-center shadow-xs">
                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/60 animate-pulse stroke-[1.5]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-muted-foreground/70 font-medium">
                Loading Image...
              </span>
            </div>
          )}
        </div>
      )}

      {/* Rendered Image with Smooth Decoded Crossfade */}
      <Image
        {...props}
        alt={alt}
        fill={fill}
        className={cn(
          "transition-all duration-700 ease-out",
          isLoaded
            ? "opacity-100 blur-0 scale-100"
            : "opacity-0 blur-xs scale-[1.015]",
          className
        )}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setHasError(true);
          setIsLoaded(true);
          onError?.(e);
        }}
      />
    </div>
  );
}

export default BlogImageWithSkeleton;
