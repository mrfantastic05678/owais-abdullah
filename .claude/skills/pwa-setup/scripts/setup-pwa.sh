#!/bin/bash
# setup-pwa.sh — Automated PWA setup for Next.js projects
# Usage: bash .claude/skills/pwa-setup/scripts/setup-pwa.sh [--library next-pwa|serwist]

set -e

LIBRARY="${1:---library}"
LIBRARY_NAME="${2:-next-pwa}"

echo "=== PWA Setup Script ==="
echo "Library: $LIBRARY_NAME"
echo ""

# Step 1: Install PWA library
echo "[1/6] Installing PWA library..."
if [ "$LIBRARY_NAME" = "next-pwa" ]; then
  npm install @ducanh2912/next-pwa
elif [ "$LIBRARY_NAME" = "serwist" ]; then
  npm install @serwist/next @serwist/turbopack
else
  echo "Unknown library: $LIBRARY_NAME. Use 'next-pwa' or 'serwist'."
  exit 1
fi

# Step 2: Check manifest exists
echo "[2/6] Checking manifest..."
if [ ! -f "public/manifest.json" ] && [ ! -f "public/manifest.webmanifest" ]; then
  echo "WARNING: No manifest.json found. Create one with name, icons, start_url, display."
else
  echo "  Manifest found."
fi

# Step 3: Check icons exist
echo "[3/6] Checking PWA icons..."
MISSING_ICONS=0
for size in 192 512; do
  FOUND=0
  for ext in png svg webp; do
    if ls public/assets/*${size}*.$ext 2>/dev/null || ls public/icon*${size}*.$ext 2>/dev/null; then
      FOUND=1
      break
    fi
  done
  if [ $FOUND -eq 0 ]; then
    echo "  WARNING: No ${size}x${size} icon found"
    MISSING_ICONS=1
  fi
done
if [ $MISSING_ICONS -eq 0 ]; then
  echo "  Icons OK."
fi

# Step 4: Create offline page if missing
echo "[4/6] Creating offline page..."
if [ ! -f "app/~offline/page.tsx" ] && [ ! -f "app/offline/page.tsx" ]; then
  mkdir -p "app/~offline"
  cat > "app/~offline/page.tsx" << 'OFFLINE_EOF'
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
OFFLINE_EOF
  echo "  Created app/~offline/page.tsx"
else
  echo "  Offline page exists."
fi

# Step 5: Update .gitignore
echo "[5/6] Updating .gitignore..."
for entry in "sw.js" "workbox-*.js" "sw.map" "workbox.map"; do
  if ! grep -q "$entry" .gitignore 2>/dev/null; then
    echo "$entry" >> .gitignore 2>/dev/null || true
  fi
done
echo "  .gitignore updated."

# Step 6: Summary
echo "[6/6] Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Configure next.config.ts with PWA plugin (see SKILL.md)"
echo "  2. Create app/manifest.ts or verify public/manifest.json"
echo "  3. Add theme-color meta tag to app/layout.tsx"
echo "  4. Run 'npm run build' and test offline in DevTools"
echo ""
echo "Done!"
