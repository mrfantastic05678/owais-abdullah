// Unified Admin Authentication Helper
// Provides cross-tab synchronization via cookies, localStorage, and sessionStorage.

export const ADMIN_COOKIE_NAME = "admin_auth_session";
export const ADMIN_STORAGE_KEY = "admin_auth_token";
export const ADMIN_LEGACY_SESSION_KEY = "analytics_auth_token";

/**
 * Retrieves the active admin auth token from cookie, localStorage, or sessionStorage.
 */
export function getAdminAuthToken(): string {
  if (typeof window === "undefined") return "";

  // 1. Check document cookie
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]*)`));
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]);
      if (decoded && decoded !== "null" && decoded !== "undefined") {
        return decoded;
      }
    }
  } catch {}

  // 2. Check localStorage (shared across all tabs on this origin)
  try {
    const local = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (local && local !== "null" && local !== "undefined") {
      return local;
    }
  } catch {}

  // 3. Check sessionStorage (legacy fallback)
  try {
    const sess = sessionStorage.getItem(ADMIN_LEGACY_SESSION_KEY);
    if (sess && sess !== "null" && sess !== "undefined") {
      return sess;
    }
  } catch {}

  return "";
}

/**
 * Sets the admin auth token across cookies, localStorage, and sessionStorage.
 * Also broadcasts an auth event to synchronize all open components.
 */
export function setAdminAuthToken(token: string): void {
  if (typeof window === "undefined" || !token) return;

  // 1. Set cookie (30 days persistence, SameSite=Lax)
  try {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`;
  } catch {}

  // 2. Set localStorage (persists across tabs)
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, token);
  } catch {}

  // 3. Set sessionStorage (legacy compatibility)
  try {
    sessionStorage.setItem(ADMIN_LEGACY_SESSION_KEY, token);
  } catch {}

  // 4. Dispatch custom event for real-time reactivity in the current tab
  try {
    window.dispatchEvent(new CustomEvent("admin_auth_change", { detail: { token, loggedIn: true } }));
  } catch {}
}

/**
 * Clears the admin auth session across cookies, localStorage, and sessionStorage.
 */
export function clearAdminAuthToken(): void {
  if (typeof window === "undefined") return;

  // 1. Clear cookie
  try {
    document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  } catch {}

  // 2. Clear localStorage
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch {}

  // 3. Clear sessionStorage
  try {
    sessionStorage.removeItem(ADMIN_LEGACY_SESSION_KEY);
  } catch {}

  // 4. Broadcast logout event
  try {
    window.dispatchEvent(new CustomEvent("admin_auth_change", { detail: { token: "", loggedIn: false } }));
  } catch {}
}

/**
 * Verifies the admin password against the server API.
 */
export async function verifyAdminPassword(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      setAdminAuthToken(password);
      return { success: true };
    }

    return { success: false, error: data.error || "Incorrect admin password. Access denied." };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error while connecting to auth server." };
  }
}
