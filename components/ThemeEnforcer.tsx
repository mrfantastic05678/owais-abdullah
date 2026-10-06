"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Forces dark mode on all pages except /blog/* routes.
 * On blog pages, next-themes handles the theme normally.
 * On all other pages, this overrides whatever is in localStorage.
 */
export function ThemeEnforcer() {
  // Theme is user-controlled via next-themes across all pages
  return null;
}
