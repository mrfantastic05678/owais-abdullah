# PWA Troubleshooting

## Issues Encountered During Setup

### 1. Large Chunk Warning During Build

**Symptom:**
```
⚠ _next/static/chunks/d8e9270f-211a25661ecaa3f0.js is 2.32 MB, and won't be precached.
Configure maximumFileSizeToCacheInBytes to change this limit.
```

**Cause:** Workbox has a default 2MB limit for precaching files. Next.js chunks can exceed this.

**Solution:** Increase `maximumFileSizeToCacheInBytes` in `next.config.ts`:
```typescript
const withPWA = withPWAInit({
  dest: "public",
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
  // ... other options
});
```

**Why 5MB:** Next.js production builds can generate chunks up to 4-5MB. Setting to 5MB ensures all assets are precached for reliable offline support.

---

### 2. Build Timeout / Slow Compilation

**Symptom:** Build hangs or times out after 2-5 minutes during PWA compilation:
```
✓ (pwa) Compiling for server...
✓ (pwa) Compiling for client (static)...
```

**Cause:** `@ducanh2912/next-pwa` adds extra compilation steps (Workbox bundling, SW generation). On slower machines or with large projects, this can push build time past default timeouts.

**Solution:**
1. Increase bash timeout to 300000ms (5 minutes)
2. Delete `.next` cache before rebuilding:
   ```bash
   rm -rf .next && npm run build
   ```
3. If still timing out, the build is likely working — just needs more time. The PWA output lines confirm success.

---

### 3. EPIPE Error at Build End

**Symptom:**
```
uncaughtException [Error: write EPIPE] { errno: -4047, code: 'EPIPE', syscall: 'write' }
```

**Cause:** The build process output pipe breaks when the shell session times out or disconnects. This is a shell/terminal issue, not a Next.js or PWA issue.

**Solution:** Ignore this error if the build output shows:
- `✓ (pwa) Service worker: public/sw.js`
- The `.next` directory was created
- The `public/sw.js` file exists

The EPIPE error occurs AFTER the build completes — it's the pipe breaking when the tool session ends, not a build failure.

**Verify build succeeded:**
```bash
ls -la public/sw.js  # Should exist and be ~15KB
ls -la .next/         # Should exist
```

---

### 4. Service Worker Not Registering in Development

**Symptom:** SW doesn't appear in DevTools → Application → Service Workers during `npm run dev`.

**Cause:** PWA is disabled in development by default (`disable: process.env.NODE_ENV === "development"`).

**Solution:** This is intentional — SW in development causes cache headaches. To test PWA:
```bash
npm run build && npm run start
```
Test on `localhost:3000` after production build.

---

### 5. Offline Page Not Loading

**Symptom:** When offline, browser shows generic error instead of custom offline page.

**Cause:** The offline page route doesn't match what Workbox precaches. `@ducanh2912/next-pwa` uses `~offline` convention, not `offline`.

**Solution:** Ensure offline page is at:
```
app/~offline/page.tsx    # NOT app/offline/page.tsx
```

Check precached routes in build output:
```
○ (pwa) This app will fallback to these precached routes:
○ (pwa)   Documents (pages): /~offline
```

---

### 6. Duplicate Meta Tags

**Symptom:** Same meta tags appear twice in page HTML (theme-color, apple-mobile-web-app, etc.).

**Cause:** Setting meta tags both in `Metadata` export AND raw `<head>` JSX in `app/layout.tsx`.

**Solution:** Remove raw `<head>` JSX entries. The Next.js `Metadata` API renders these tags automatically:
```tsx
// REMOVE this block from <html>:
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#212428" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  ...
</head>

// KEEP this in Metadata export:
export const metadata: Metadata = {
  manifest: "/manifest.json",
  other: { "theme-color": "#212428" },
  appleWebApp: { capable: true },
  // ...
};
```

---

### 7. PWA Not Installable

**Symptom:** No install icon in Chrome address bar.

**Checklist:**
1. ✅ `manifest.json` has `name`, `icons`, `start_url`, `display`
2. ✅ `display: "standalone"` or `"fullscreen"`
3. ✅ Icons: 192x192 and 512x512 present
4. ✅ Service worker registered (check DevTools → Application)
5. ✅ HTTPS (or localhost)
6. ✅ Production build (not dev mode)

**Common fix:** Run production build:
```bash
rm -rf .next && npm run build && npm run start
```

---

### 8. iOS Safari Not Showing Install Prompt

**Symptom:** iPhone doesn't show "Add to Home Screen" banner.

**Cause:** iOS requires specific meta tags and doesn't show a automatic install prompt like Android.

**Solution:** Add these to `Metadata` export:
```typescript
export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Your App Name",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};
```

Users tap Share → "Add to Home Screen" manually on iOS.

---

## Quick Diagnostic Commands

```bash
# Check if SW exists
ls -la public/sw.js

# Check manifest is valid JSON
python -c "import json; json.load(open('public/manifest.json'))"

# Check PWA library installed
grep "@ducanh2912/next-pwa" package.json

# Check PWA plugin in config
grep "withPWA\|withSerwist" next.config.ts

# Check offline page exists
ls app/~offline/page.tsx

# Run validation script
bash .claude/skills/pwa-setup/scripts/validate-pwa.sh

# Full rebuild
rm -rf .next && npm run build && npm run start
```
