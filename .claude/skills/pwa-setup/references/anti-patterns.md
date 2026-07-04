# PWA Anti-Patterns

## Caching Mistakes

1. **Single global caching strategy** — `registerRoute(/.*/, new CacheFirst())` serves stale auth tokens forever. Each resource type needs its own strategy.

2. **Cache-first on API responses** — User updates profile, SW returns stale cached version. Use network-first or SWR.

3. **Network-first without timeout** — Poor connections feel frozen. Always set `networkTimeoutSeconds: 3-5`.

4. **Using `cache.addAll`** — Fails entire install on one 404. Use `Promise.allSettled`.

## Service Worker Mistakes

5. **Forgetting `event.waitUntil()`** — SW dies before cache write completes. Network requests race with worker termination.

6. **Using `skipWaiting()` blindly** — Can cause version conflicts and race conditions. Use with explicit user prompts.

7. **No cache cleanup in `activate`** — Old caches accumulate, browser silently evicts good caches when quota hit.

8. **Not using `clients.claim()`** — Existing tabs use old SW until navigation, creating permanent version skew.

## Offline Mistakes

9. **No offline fallback page** — When network-first fails on cache miss, browser shows generic error. Pre-cache `/offline.html`.

10. **Not testing cold-cache offline** — Developers always warm cache by visiting routes online first, masking bugs.

11. **Assuming SW handles conflict resolution** — Offline writes need explicit IndexedDB persistence and merge strategy.

## Platform Mistakes

12. **Ignoring Safari's 7-day storage limit** — iOS clears SW cache after ~7 days of inactivity (exempt for home-screen PWAs).

13. **Not handling `QuotaExceededError`** — Browsers limit storage per origin; handle gracefully.

14. **Cache poisoning** — Old SW talks to new backend API. Implement automated cache invalidation on deploy.

## Security Mistakes

15. **HTTP in production** — Service workers can intercept ALL network requests including credentials. HTTP = MITM turns SW into persistent backdoor.

16. **No Content-Security-Policy** — Set `Content-Security-Policy: script-src 'self'` on SW response to prevent XSS.

17. **No kill-switch SW** — Emergency SW that does nothing, for when you need to immediately disable a malicious/buggy SW.
