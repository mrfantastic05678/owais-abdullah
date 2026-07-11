"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Returns true until mounted (server + first paint render the static
 * fallback, so reduced-motion users and crawlers get correct-by-default
 * markup), then reflects the user's actual preference. Components that
 * animate should treat `true` as "render static, skip GSAP/Lenis init".
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return reduced;
}
