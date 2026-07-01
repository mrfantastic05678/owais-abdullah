# Cloudflare + SSL Configuration

## SSL mode: Full (Strict) — this is non-negotiable with Traefik

Dokploy uses **Traefik** as the reverse proxy. Traefik automatically redirects HTTP → HTTPS.
Cloudflare's **Flexible** mode sends HTTP from Cloudflare to the origin, which Traefik
immediately redirects back to HTTPS, creating an infinite redirect loop
(`ERR_TOO_MANY_REDIRECTS`).

Many generic "VPS + Cloudflare" tutorials use Flexible successfully — because those tutorials
run plain Nginx, which does not force HTTPS on the origin. With Traefik, **Flexible kills
your app**.

**Fix:** Cloudflare dashboard → SSL/TLS → Overview → set **Full (Strict)**.

## DNS records

| Record | Type | Target | Proxy status after cert issuance |
|---|---|---|---|
| `@` (root domain) | A | VPS IP | Orange (Proxied) |
| `admin` | A | VPS IP | Orange |
| `app` | A | VPS IP | Orange |
| `deploy` | A | VPS IP | Orange (or grey if using Tunnel) |
| MX / DKIM / SPF / DMARC | various | mail provider | **Grey ALWAYS** (never proxy email) |

## The Let's Encrypt HTTP-01 gotcha (why you must grey-cloud first)

Traefik gets its TLS cert from Let's Encrypt via the **HTTP-01 challenge**: ACME makes an
HTTP request to `http://yourdomain.com/.well-known/acme-challenge/<token>`. When a DNS
record is **orange-clouded**, Cloudflare intercepts that request and auto-redirects it to
HTTPS — so the ACME server gets a redirect, not the challenge token, and the validation
**fails**. No cert is issued.

### Fix: grey-cloud during issuance, then orange-cloud

1. Set the DNS record to **DNS only** (grey cloud) in Cloudflare.
2. Add the domain in Dokploy → Domains → let Traefik issue the cert. Wait until Dokploy
   shows the cert as valid (HTTPS green).
3. Switch the record to **Proxied** (orange cloud) in Cloudflare.

Do this per-domain. Order: `deploy.` first (panel cert), then the app domains.

### Durable renewals: Cloudflare Config Rule

Let's Encrypt renews every ~60 days. With the proxy on, future HTTP-01 challenges will hit
the same wall. Add a Cloudflare **Configuration Rule**:

- Matches: `http://yourdomain.com/.well-known/acme-challenge/*` (wildcard)
- Settings: disable "Automatic HTTPS Rewrites", set "Cache" to bypass
- This lets renewal challenges pass through over HTTP without orange-clouding each time.

### Alternative: Cloudflare Origin CA cert (15-year, no ACME)

- Issue a 15-year cert in Cloudflare → SSL/TLS → Origin Server → Create Certificate.
- Install in Dokploy instead of Let's Encrypt.
- Trusted **only by Cloudflare** (not by Node.js/browsers directly).
- Problem: any server-side fetch from Next.js to your own HTTPS domain would fail cert
  validation in Node. Avoid unless you are sure you have no SSR fetches to your own origin.

### Alternative: Cloudflare Tunnel

- Install `cloudflared` on the VPS; create a tunnel.
- No open 80/443 to the internet; Cloudflare edge handles TLS.
- Strongest security posture; adds a `cloudflared` dependency.
- Configure in Dokploy's "Cloudflare" service type instead of standard domains.

## Cache rules (critical for Next.js)

| Rule | Behaviour | Why |
|---|---|---|
| `yourdomain.com/api/*` | **Cache: Bypass** | SSE streaming chat must not be buffered or cached |
| `yourdomain.com/embed.js` | **Cache: Cache Everything** + long TTL | Static widget file; heavy caching is good |
| `yourdomain.com/*` | Default | Next.js cache-control headers drive it |

Without bypassing `/api/*`, Cloudflare caches the first SSE frame and hangs the chat stream.

## Cloudflare summary checklist

```
SSL/TLS mode   □ Full (Strict) — NOT Flexible, NOT Full
DNS            □ Each record grey-cloud during cert issuance → orange after
Renewals       □ Config Rule for /.well-known/acme-challenge/* → bypass HTTP redirect
Cache          □ Bypass /api/* □ Cache /embed.js
Email records  □ MX/DKIM/SPF/DMARC = grey ALWAYS
```
