# Lighthouse PWA Audit

## Required PWA Checks

| Category | Requirement |
|----------|-------------|
| HTTPS | Served over secure origin |
| Service Worker | Registered and active |
| Offline Response | Responds with 200 when offline |
| Manifest | Valid web app manifest present |
| start_url | Set in manifest, responds 200 offline |
| Icons | 192x192 and 512x512 present |
| Viewport | `<meta name="viewport">` tag present |
| Theme Color | `<meta name="theme-color">` matches manifest |

## Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| FCP (First Contentful Paint) | < 1.8s |
| TTFB (Time to First Byte) | < 800ms |

## CI Quality Gates

```
Performance: score ≥ 80, LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 300ms
Accessibility: score ≥ 90
Best Practices: score ≥ 90, no mixed content, uses HTTPS
SEO: score ≥ 90, indexable, valid robots
PWA: correct viewport, offline fallback, installability passes
```

## Validation Checklist

- [ ] Manifest valid (no JSON errors)
- [ ] Icons: 192x192 and 512x512 present
- [ ] `display: standalone` in manifest
- [ ] `start_url` responds 200 offline
- [ ] Service worker registered and activated
- [ ] Offline fallback page works
- [ ] Theme color matches between meta and manifest
- [ ] No duplicate meta tags
- [ ] Apple touch icon set
- [ ] Viewport meta tag present
- [ ] HTTPS in production
- [ ] Cache versioning active
- [ ] Old caches cleaned in activate

## Testing Commands

```bash
# Build and start production server
npm run build && npm run start

# Test offline (Chrome DevTools)
# 1. Open DevTools → Application → Service Workers
# 2. Check "Offline" checkbox
# 3. Reload page — should show offline fallback

# Lighthouse CLI
npx lighthouse http://localhost:3000 --view

# Check service worker status
# Chrome DevTools → Application → Service Workers
```
