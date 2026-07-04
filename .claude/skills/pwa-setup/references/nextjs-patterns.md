# Next.js PWA Patterns

## Package Options (2026)

| Package | Notes |
|---------|-------|
| `@ducanh2912/next-pwa` | Actively maintained fork, App Router compatible, Workbox-powered |
| `@serwist/next` | Webpack plugin, good TypeScript support |
| `@serwist/turbopack` | Uses Route Handler, native Turbopack support |
| `next-pwa` (original) | No-ops with warning on Next.js 16+ Turbopack |

## Setup with `@ducanh2912/next-pwa`

```typescript
// next.config.ts
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
      { urlPattern: /\.(?:jpg|png|svg|webp)$/i, handler: "CacheFirst",
        options: { cacheName: "images", expiration: { maxEntries: 64, maxAgeSeconds: 30*24*60*60 }}},
      { urlPattern: /^https:\/\/fonts\./, handler: "CacheFirst",
        options: { cacheName: "google-fonts", expiration: { maxEntries: 4, maxAgeSeconds: 365*24*60*60 }}},
      { urlPattern: /\/api\//, handler: "NetworkFirst",
        options: { cacheName: "api", networkTimeoutSeconds: 3, expiration: { maxEntries: 50, maxAgeSeconds: 5*60 }}},
    ],
  },
});

export default withPWA({ /* nextConfig */ });
```

## Manifest (App Router)

```typescript
// app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My PWA',
    short_name: 'MyPWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
```

## Offline Fallback Page

```tsx
// app/~offline/page.tsx
export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">You're offline</h1>
      <p className="text-gray-600">Check your internet connection and try again.</p>
    </div>
  );
}
```

## Key Next.js PWA Notes

- **Next.js 16+ with Turbopack**: Use `@serwist/turbopack` or `--webpack` flag
- **Test locally with HTTPS**: `next dev --experimental-https`
- **Apple support**: Add `appleWebApp: { capable: true }` in metadata + `apple-touch-icon`
- **`.gitignore`**: Generated `sw.js`, `workbox-*.js` files
- **Duplicate meta tags**: Don't set meta tags both in `Metadata` export AND raw `<head>` JSX
