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
    const isToggleAllowed =
      pathname === "/blog" ||
      pathname?.startsWith("/blog/") ||
      pathname === "/stack" ||
      pathname?.startsWith("/stack/") ||
      pathname === "/stores" ||
      pathname?.startsWith("/stores/");

    if (!isToggleAllowed) {
      // Force dark on non-toggle pages (home, about, services, contact)
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, [pathname]);

  return null;
}
