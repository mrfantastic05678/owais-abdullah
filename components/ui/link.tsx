"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Define the image types
export type PrefetchImage = {
  src: string;
  alt?: string;
};

// Super simplified Link component that doesn't rely on an API route
export function SimplePrefetchLink({
  children,
  href,
  prefetch = true,
  imagesToPrefetch = [],
  ...props
}: React.ComponentProps<typeof NextLink> & { 
  imagesToPrefetch?: PrefetchImage[]
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const [prefetched, setPrefetched] = useState(false);
  
  // Prefetch images when the link is visible
  useEffect(() => {
    if (!prefetch || prefetched || imagesToPrefetch.length === 0) return;
    
    const linkElement = linkRef.current;
    if (!linkElement) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Prefetch the Next.js page
          router.prefetch(String(href));
          
          // Prefetch the images
          for (const image of imagesToPrefetch) {
            const img = new Image();
            img.src = image.src;
            img.alt = image.alt || "";
          }
          
          setPrefetched(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(linkElement);
    
    return () => {
      observer.disconnect();
    };
  }, [href, prefetch, imagesToPrefetch, prefetched, router]);
  
  return (
    <NextLink
      ref={linkRef}
      href={href}
      prefetch={false}
      onMouseEnter={() => {
        if (!prefetched) {
          router.prefetch(String(href));
          for (const image of imagesToPrefetch) {
            const img = new Image();
            img.src = image.src;
          }
          setPrefetched(true);
        }
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
}