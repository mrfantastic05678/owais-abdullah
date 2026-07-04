# PWA Core Concepts

## What is a PWA?
A Progressive Web App delivers native-like experiences through web technologies — installable, offline-capable, and performant. Three pillars: **Web App Manifest**, **Service Worker**, **HTTPS**.

## Service Worker
- JavaScript file running in a **separate thread** from the main app
- Acts as a **network proxy** — intercepts all `fetch` events within its scope
- Cannot access DOM, `window`, or synchronous APIs
- Lifecycle: `parsed → installing → installed → waiting → activating → activated → redundant`
- Only **activated** workers handle fetch events; waiting workers queue behind the current active worker

## Web App Manifest (`manifest.json`)
JSON file telling the browser how to display the app when installed:
- `name`, `short_name`, `description`
- `start_url`, `scope`, `display: "standalone"`
- `icons` (192x192 and 512x512 required; include `maskable` purpose)
- `theme_color`, `background_color`
- `screenshots` for rich install prompts (Android)

## Installability Criteria
- Valid web app manifest with `name`, `icons`, `start_url`, `display`
- Service worker registered
- Served over HTTPS (except localhost)
- Chrome/Edge 2025+: manifest alone suffices for install prompt (SW no longer required)

## Browser Support (2026)

| Capability | Chrome/Edge | Safari/iOS | Firefox |
|------------|-------------|------------|---------|
| Installable | Full | Full (17.4+) | Desktop only |
| Push Notifications | Full | Full (iOS 16.4+) | Full |
| Offline Support | Full | Full | Full |
| Background Sync | Full | No | No |
| Navigation Preload | Full | No | No |

### Key Notes
- **iOS Safari**: Clears SW cache after 7 days of inactivity (home-screen PWAs exempt)
- **Firefox 143+**: Supports PWA installation on Windows only
- **Storage limits**: Chrome ~80% disk; Safari ~1GB/origin; Firefox ~2GB/origin
