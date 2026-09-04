---
name: google-preferred-sources
description: >-
  Implement and optimize Google's official Preferred Sources user-controlled SEO
  signal, enabling visitors to prioritize a website or publisher in Google Search,
  Google Discover, Top Stories, and AI Overviews. Includes direct-add modal popup fallback,
  high-converting placement patterns, and edge audience telemetry tracking.
---

# Google Preferred Sources SEO & Audience Telemetry

This skill guides you through implementing Google's official **Preferred Sources** user-controlled SEO ranking signal alongside edge audience telemetry.

Preferred Sources allows readers to designate a domain as a preferred publisher in their personal Google account. Once added, Google's ranking systems uprank that publication for the user across **Google Search**, **Top Stories**, **Google Discover**, **AI Overviews**, and **AI Mode**.

---

## 1. Google Endpoints & Specifications

Google has two distinct interfaces for Preferred Sources. It is vital to use the **Direct-Add Modal Endpoint**:

| Purpose | Endpoint | User Experience |
| :--- | :--- | :--- |
| **Direct-Add Modal** (Recommended) | `https://news.google.com/swg/ui/v1/addpreferredsource?_=${Date.now()}&hl=en&source=${encodeURIComponent("https://YOUR_DOMAIN")}` | **Small Modal (Image 2)**: Displays site logo, publisher name, description, and a single blue **`[+ Add]`** action button. |
| **Search Settings Page** (Settings only) | `https://www.google.com/preferences/source?q=YOUR_DOMAIN` | **Settings Dashboard (Image 1)**: Full-page list with a search bar and unchecked checkboxes requiring manual user search and selection. |

* **Official Publisher SDK**:
  ```html
  <script>window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || [];</script>
  <script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
  ```
* **Native Button Attribute**:
  Adding `<div google-add-preferred-source-btn data-theme="dark"></div>` allows Google's SDK to inject its official native button automatically.

---

## 2. Architecture: Direct-Add Modal & Zero-Drop Fallback

Navigating visitors away to the general preferences page or via standard full-page link causes friction. Always implement the **Direct-Add Popup Pattern**:

```text
User Clicks "Add to Google Preferred Sources"
  │
  ├─ 1. Send Telemetry Beacon (`navigator.sendBeacon('/api/promo-tracking', ...)`)
  │
  ├─ 2. Try Google SDK Native Invocation:
  │      if (window.preferredSource?.addPreferredSource) {
  │        window.preferredSource.addPreferredSource();
  │      } else if (window.PREFERRED_SOURCE?.push) {
  │        window.PREFERRED_SOURCE.push(api => api.addPreferredSource());
  │      }
  │
  └─ 3. Direct Modal Fallback (Opens instantly in 500x630 centered window):
         window.open(
           `https://news.google.com/swg/ui/v1/addpreferredsource?_=${Date.now()}&hl=en&source=${encodeURIComponent(domainUrl)}`,
           'GoogleSourcePreferences',
           'width=500,height=630,left=...,top=...,scrollbars=yes,resizable=yes'
         );
```

### Why this matches Google's native flow:
1. **One-Click Experience**: Directly renders the blue **`[+ Add]`** button for the publisher.
2. **Branded Lockup**: Shows the publisher's favicon/logo and verified site title.
3. **No Site Abandonment**: Stays in a compact centered modal without leaving your page.

---

## 3. High-Converting Placement Patterns

| Placement Key | Recommended Variant | Location & Trigger | Microcopy Prompt |
| :--- | :--- | :--- | :--- |
| `blog_post_end` | **Card** (Featured) | Immediately after article content, before author bio. Reader just experienced high value. | *"Enjoyed this deep-dive? Never miss our future articles in your Google Search, Top Stories, and Google Discover feed."* |
| `blog_archive_hero` | **Pill** (Compact) | Top of blog archive / search page near RSS feed & category filter tags. | *"Follow on Google Discover"* |
| `footer` | **Pill / Icon** | Brand column or utility links next to RSS & social links. | *"Add to Google Preferred Sources"* |

---

## 4. Reusable React / Next.js Component

### `components/GooglePreferredSourceButton.tsx`
```tsx
"use client";

import React, { useState } from "react";

interface GooglePreferredSourceButtonProps {
  domain?: string;
  placement?: "blog_post_end" | "blog_archive_hero" | "footer" | "navbar" | "custom";
  variant?: "card" | "pill" | "compact";
  className?: string;
}

declare global {
  interface Window {
    preferredSource?: {
      addPreferredSource: () => void;
    };
    PREFERRED_SOURCE?: Array<(sdk: any) => void>;
  }
}

export default function GooglePreferredSourceButton({
  domain = "https://YOUR_DOMAIN.com",
  placement = "blog_post_end",
  variant = "pill",
  className = "",
}: GooglePreferredSourceButtonProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClicked(true);

    // 1. Send Telemetry Beacon
    try {
      const payload = JSON.stringify({
        event: "google_preferred_click",
        placement,
        domain,
        path: typeof window !== "undefined" ? window.location.pathname : "",
        timestamp: new Date().toISOString(),
      });
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon("/api/promo-tracking", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/promo-tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}

    // 2. Try Google SDK
    let triggeredViaSdk = false;
    if (typeof window !== "undefined") {
      if (window.preferredSource && typeof window.preferredSource.addPreferredSource === "function") {
        try {
          window.preferredSource.addPreferredSource();
          triggeredViaSdk = true;
        } catch {}
      }
      if (!triggeredViaSdk && window.PREFERRED_SOURCE && typeof window.PREFERRED_SOURCE.push === "function") {
        try {
          window.PREFERRED_SOURCE.push((api: any) => {
            if (api && typeof api.addPreferredSource === "function") {
              api.addPreferredSource();
            }
          });
          triggeredViaSdk = true;
        } catch {}
      }
    }

    // 3. Direct-Add Centered Modal Fallback (Opens [+ Add] Dialog)
    if (!triggeredViaSdk) {
      const origin = typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : domain;
      const directAddUrl = `https://news.google.com/swg/ui/v1/addpreferredsource?_=${Date.now()}&hl=en&source=${encodeURIComponent(origin)}`;
      const width = 500;
      const height = 630;
      const left = typeof window !== "undefined" && window.screen.width ? Math.max(0, Math.round((window.screen.width - width) / 2)) : 100;
      const top = typeof window !== "undefined" && window.screen.height ? Math.max(0, Math.round((window.screen.height - height) / 2)) : 100;

      window.open(
        directAddUrl,
        "GoogleSourcePreferences",
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );
    }
  };

  // Google 4-Color SVG Icon
  const GoogleIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  );

  if (variant === "card") {
    return (
      <div className={`p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 ${className}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <GoogleIcon />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                Prioritize in Google Search & Discover
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Get our latest insights directly in your Google feed & AI Overviews.
              </p>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 shadow-sm"
          >
            <GoogleIcon />
            {clicked ? "Opened" : "Add as Preferred Source"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-blue-500 transition ${className}`}
    >
      <GoogleIcon />
      <span>{clicked ? "Opened" : "Add to Google Preferred"}</span>
    </button>
  );
}
```

---

## 5. Edge Audience Telemetry Parser

### `lib/analytics-parser.ts`
```typescript
export interface ClientTelemetry {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  flag: string;
  device: "Desktop" | "Mobile" | "Tablet";
  browser: string;
  os: string;
  referrerDomain: string;
}

export function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const upper = code.toUpperCase();
  const c1 = upper.charCodeAt(0) - 65 + 0x1f1e6;
  const c2 = upper.charCodeAt(1) - 65 + 0x1f1e6;
  return String.fromCodePoint(c1, c2);
}

export function parseEdgeTelemetry(headers: Headers, userAgentRaw?: string, referrerRaw?: string): ClientTelemetry {
  const countryCode = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "UNKNOWN";
  const city = headers.get("x-vercel-ip-city") || "Unknown City";
  const region = headers.get("x-vercel-ip-country-region") || "";
  const flag = countryCodeToFlag(countryCode);

  const ua = userAgentRaw || headers.get("user-agent") || "";
  let device: ClientTelemetry["device"] = "Desktop";
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) device = "Tablet";
  else if (/mobile|iphone|android|phone/i.test(ua)) device = "Mobile";

  let browser = "Other";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";

  let os = "Other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  let referrerDomain = "direct";
  if (referrerRaw) {
    try {
      const parsed = new URL(referrerRaw);
      referrerDomain = parsed.hostname.replace(/^www\./, "");
    } catch {}
  }

  return {
    country: countryCode,
    countryCode,
    city,
    region,
    flag,
    device,
    browser,
    os,
    referrerDomain,
  };
}
```

---

## 6. Verification Checklist

1. [ ] **Direct Endpoint Check**: Ensure the target URL is `news.google.com/swg/ui/v1/addpreferredsource?_=${Date.now()}&hl=en&source=${encodeURIComponent(origin)}` (NOT the general `google.com/preferences/source` search settings page).
2. [ ] **Modal Appearance (500x630)**: Click the button and verify it opens a small centered dialog featuring the site title, Google logo, and the blue `[+ Add]` button.
3. [ ] **SDK Readiness**: Script tag in layout uses `afterInteractive` with `window.PREFERRED_SOURCE` pre-declared.
4. [ ] **Telemetry Verification**: Verify telemetry beacon registers `google_preferred_click` with current path and placement key.
