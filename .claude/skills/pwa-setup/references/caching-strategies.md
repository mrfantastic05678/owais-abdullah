# Caching Strategies

## 5 Canonical Patterns

| Strategy | Use Case | Tradeoff |
|----------|----------|----------|
| **Cache-First** | Static assets (CSS, JS, fonts, images) | Fast, offline-ready, but stale |
| **Network-First** | HTML pages, API data | Fresh, but slow on poor networks |
| **Stale-While-Revalidate** | Frequently changing static assets | Fast AND fresh, extra bandwidth |
| **Cache-Only** | Versioned resources, precaching | Full offline, cannot update |
| **Network-Only** | Payments, auth, analytics | Always current, no offline |

## Decision Tree

```
Is the content versioned with hashes?
  → Yes → Cache-First (cache safe forever)
  → No → Does it change frequently?
    → Yes → Is freshness critical?
      → Yes → Network-First
      → No → Stale-While-Revalidate
    → No → Cache-First with TTL
```

## Strategy-to-Resource Mapping

| Resource Type | Strategy | Notes |
|---------------|----------|-------|
| Hashed JS/CSS bundles | Cache-First | Safe forever (content hash) |
| HTML pages | Network-First | With 3-5s timeout |
| API responses | Stale-While-Revalidate | Or Network-First for critical |
| Images | Cache-First | With TTL (30 days) |
| Fonts | Cache-First | With long TTL (365 days) |
| Form submissions | Network-Only + Background Sync | Queue failed POSTs |

## Workbox Implementation

```javascript
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Precache (auto-injected by build)
precacheAndRoute(self.__WB_MANIFEST);

// Hashed assets → Cache-First
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new CacheFirst({ cacheName: 'static',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })] })
);

// HTML → Network-First with timeout
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({ cacheName: 'pages', networkTimeoutSeconds: 3,
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 86400 })] })
);

// Images → Cache-First with TTL
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({ cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 2592000 })] })
);
```

## Cache Management

- Version cache names with prefix (e.g., `v1-static`, `v1-images`)
- Clean old caches in `activate` event using `clients.claim()`
- Use `Promise.allSettled` over `cache.addAll` (prevents one 404 from failing entire install)
- Set `networkTimeoutSeconds: 3-5` for network-first strategies
- Handle `QuotaExceededError` gracefully
