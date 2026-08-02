"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Forces dark mode on all pages except /blog/* routes.
 * On blog pages, next-themes handles the theme normally.
 * On all other pages, this overrides whatever is in localStorage.
 */
export function ThemeEnforcer() {
  const pathname = usePathname();

  useEffect(() => {
    const isBlogPage = pathname === "/blog" || pathname?.startsWith("/blog/");

    if (!isBlogPage) {
      // Force dark on non-blog pages
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, [pathname]);

  return null;
}
