---
name: pwa-setup
description: |
  Set up Progressive Web Apps in Next.js projects: service workers, offline support, caching strategies, install prompts, manifest optimization, and Lighthouse audit compliance.
  This skill should be used when users ask to add PWA support, enable offline mode, create service workers, optimize for installability, fix PWA Lighthouse audits, or configure caching strategies in Next.js applications.
---

# PWA Setup

Full PWA implementation for Next.js — service workers, offline support, caching, install prompts, and Lighthouse compliance.

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing manifest.json, icons, layout.tsx meta tags, next.config.ts, package.json |
| **Conversation** | User's specific offline requirements, caching needs, install prompt preferences |
| **Skill References** | PWA patterns from `references/` (caching strategies, Next.js patterns, anti-patterns) |
| **User Guidelines** | Project-specific conventions, deployment platform |

Ensure all required context is gathered before implementing. Only ask user for THEIR specific requirements (domain expertise is in this skill).

## Quick Decision: Which PWA Library?

| Scenario | Recommendation |
|----------|----------------|
| Next.js 15, App Router, Webpack | `@ducanh2912/next-pwa` |
| Next.js 16+, Turbopack | `@serwist/turbopack` |
| Need fine-grained control | `@serwist/next` |
| Minimal setup, just SW | Manual Workbox |

## Implementation Workflow

### Step 1: Audit Existing Setup

Check what already exists:

```bash
# Check manifest
cat public/manifest.json 2>/dev/null || echo "No manifest"

# Check icons
ls public/assets/*192* public/assets/*512* 2>/dev/null

# Check existing PWA deps
grep -E "next-pwa|serwist|workbox" package.json 2>/dev/null

# Check layout meta tags
grep -E "theme-color|manifest|apple-mobile" app/layout.tsx 2>/dev/null
```

### Step 2: Install PWA Library

```bash
# For Next.js 15 with Webpack (recommended)
npm install @ducanh2912/next-pwa

# For Next.js 16+ with Turbopack
npm install @serwist/next @serwist/turbopack
```

### Step 3: Configure next.config.ts

**With `@ducanh2912/next-pwa`:**

```typescript
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /\.(?:jpg|png|svg|webp|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "images",
          expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /\/api\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api",
          networkTimeoutSeconds: 3,
          expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
        },
      },
    ],
  },
});

// Wrap your Next.js config
export default withPWA({
  // your next.config options
});
```

**With `@serwist/next`:**

```typescript
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
});

export default withSerwist({
  // your next.config options
});
```

### Step 4: Create Manifest

**Option A: `public/manifest.json` (static)**

```json
{
  "name": "Your App Name",
  "short_name": "AppName",
  "description": "Your app description",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/assets/screenshot-wide.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/assets/screenshot-narrow.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

**Option B: `app/manifest.ts` (dynamic, App Router)**

```typescript
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Your App Name",
    short_name: "AppName",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

### Step 5: Create Offline Fallback Page

```tsx
// app/~offline/page.tsx
export default function OfflinePage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "system-ui, sans-serif",
      padding: "2rem",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        You&apos;re offline
      </h1>
      <p style={{ color: "#6b7280" }}>
        Check your internet connection and try again.
      </p>
    </div>
  );
}
```

### Step 6: Clean Up Layout Meta Tags

Remove duplicate meta tags from `app/layout.tsx`. The Next.js `Metadata` export handles most PWA meta tags. Only add raw `<head>` entries for things the metadata API doesn't support.

**Keep in `Metadata` export:**
```typescript
export const metadata: Metadata = {
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/assets/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/assets/logo-180.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Your App Name",
  },
  other: {
    "theme-color": "#000000",
  },
};
```

**Remove from raw `<head>` JSX** (redundant):
- `<meta name="theme-color">`
- `<meta name="apple-mobile-web-app-capable">`
- `<meta name="apple-mobile-web-app-status-bar-style">`
- `<meta name="apple-mobile-web-app-title">`
- `<meta name="application-name">`
- `<meta name="mobile-web-app-capable">`
- `<link rel="manifest">`

### Step 7: Update .gitignore

Add generated SW files:
```
sw.js
workbox-*.js
sw.map
workbox.map
```

### Step 8: Build and Test

```bash
rm -rf .next && npm run build
npm run start
```

**Test offline:**
1. Open Chrome DevTools → Application → Service Workers
2. Check "Offline" checkbox
3. Reload page — should show offline fallback
4. Navigate to cached pages — should load from cache

**Test install:**
1. Chrome DevTools → Application → Manifest
2. Check "installability" section
3. Look for install icon in address bar

## Caching Strategy Reference

| Resource | Strategy | TTL |
|----------|----------|-----|
| Hashed JS/CSS | Cache-First | Forever |
| HTML pages | Network-First | 3s timeout |
| Images | Cache-First | 30 days |
| Fonts | Cache-First | 365 days |
| API (read) | Stale-While-Revalidate | 5 min |
| API (write) | Network-Only | N/A |

See `references/caching-strategies.md` for detailed Workbox implementation.

## Anti-Patterns

- Never use single global caching strategy for all resources
- Never cache-first on API responses (stale data)
- Never skip `event.waitUntil()` in SW
- Never use `cache.addAll` (use `Promise.allSettled`)
- Never deploy without offline fallback page
- Never ignore Safari 7-day storage limit

See `references/anti-patterns.md` for full list.

## Validation

Run the validation script:
```bash
bash .claude/skills/pwa-setup/scripts/validate-pwa.sh
```

Or manually check:
- [ ] Manifest valid JSON with required fields
- [ ] Icons: 192x192 and 512x512 present
- [ ] `display: standalone` in manifest
- [ ] Service worker registered
- [ ] Offline page exists
- [ ] Theme color matches meta and manifest
- [ ] No duplicate meta tags
- [ ] `.gitignore` includes SW files

## Reference Files

| File | When to Read |
|------|--------------|
| `references/pwa-core-concepts.md` | Understanding SW lifecycle, manifest, browser support |
| `references/caching-strategies.md` | Workbox implementation, strategy selection |
| `references/nextjs-patterns.md` | Next.js-specific setup, App Router patterns |
| `references/anti-patterns.md` | What to avoid, common mistakes |
| `references/lighthouse-audit.md` | Lighthouse requirements, validation checklist |
