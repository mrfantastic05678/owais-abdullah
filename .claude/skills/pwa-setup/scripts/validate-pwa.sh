#!/bin/bash
# validate-pwa.sh — Validate PWA setup
# Usage: bash .claude/skills/pwa-setup/scripts/validate-pwa.sh

set -e

ERRORS=0
WARNINGS=0

echo "=== PWA Validation ==="
echo ""

# 1. Check manifest
echo "[1/8] Checking manifest..."
if [ -f "public/manifest.json" ]; then
  if python3 -c "import json; json.load(open('public/manifest.json'))" 2>/dev/null || python -c "import json; json.load(open('public/manifest.json'))" 2>/dev/null; then
    echo "  ✓ Valid JSON"
  else
    echo "  ✗ Invalid JSON in manifest.json"
    ERRORS=$((ERRORS + 1))
  fi

  # Check required fields
  for field in name start_url display icons; do
    if grep -q "\"$field\"" public/manifest.json; then
      echo "  ✓ Has '$field'"
    else
      echo "  ✗ Missing '$field'"
      ERRORS=$((ERRORS + 1))
    fi
  done

  # Check display value
  if grep -q '"standalone"' public/manifest.json || grep -q '"fullscreen"' public/manifest.json; then
    echo "  ✓ display: standalone/fullscreen"
  else
    echo "  ✗ display should be 'standalone' or 'fullscreen'"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "  ✗ No manifest.json found"
  ERRORS=$((ERRORS + 1))
fi

# 2. Check icons
echo ""
echo "[2/8] Checking icons..."
FOUND_192=0
FOUND_512=0
for ext in png svg webp; do
  if ls public/assets/*192*.$ext 2>/dev/null || ls public/icon*192*.$ext 2>/dev/null; then
    FOUND_192=1
  fi
  if ls public/assets/*512*.$ext 2>/dev/null || ls public/icon*512*.$ext 2>/dev/null; then
    FOUND_512=1
  fi
done
[ $FOUND_192 -eq 1 ] && echo "  ✓ 192x192 icon" || { echo "  ✗ Missing 192x192 icon"; ERRORS=$((ERRORS + 1)); }
[ $FOUND_512 -eq 1 ] && echo "  ✓ 512x512 icon" || { echo "  ✗ Missing 512x512 icon"; ERRORS=$((ERRORS + 1)); }

# 3. Check offline page
echo ""
echo "[3/8] Checking offline page..."
if [ -f "app/~offline/page.tsx" ] || [ -f "app/offline/page.tsx" ]; then
  echo "  ✓ Offline page exists"
else
  echo "  ✗ No offline page found"
  ERRORS=$((ERRORS + 1))
fi

# 4. Check PWA library
echo ""
echo "[4/8] Checking PWA library..."
if grep -q "@ducanh2912/next-pwa" package.json 2>/dev/null; then
  echo "  ✓ @ducanh2912/next-pwa installed"
elif grep -q "@serwist/next" package.json 2>/dev/null; then
  echo "  ✓ @serwist/next installed"
else
  echo "  ✗ No PWA library found in package.json"
  ERRORS=$((ERRORS + 1))
fi

# 5. Check next.config
echo ""
echo "[5/8] Checking next.config.ts..."
if grep -q "withPWA\|withSerwist\|serwist\|next-pwa" next.config.ts 2>/dev/null || grep -q "withPWA\|withSerwist\|serwist\|next-pwa" next.config.js 2>/dev/null; then
  echo "  ✓ PWA plugin configured"
else
  echo "  ✗ No PWA plugin in next.config"
  ERRORS=$((ERRORS + 1))
fi

# 6. Check theme-color
echo ""
echo "[6/8] Checking theme-color..."
if grep -q "theme-color" app/layout.tsx 2>/dev/null; then
  echo "  ✓ theme-color meta tag"
else
  echo "  ✗ No theme-color meta tag"
  WARNINGS=$((WARNINGS + 1))
fi

# 7. Check for duplicate meta tags
echo ""
echo "[7/8] Checking duplicate meta tags..."
THEME_COUNT=$(grep -c "theme-color" app/layout.tsx 2>/dev/null || echo "0")
if [ "$THEME_COUNT" -gt 2 ]; then
  echo "  ⚠ Possible duplicate theme-color tags ($THEME_COUNT occurrences)"
  WARNINGS=$((WARNINGS + 1))
else
  echo "  ✓ No excessive duplicates"
fi

# 8. Check .gitignore
echo ""
echo "[8/8] Checking .gitignore..."
if grep -q "sw.js" .gitignore 2>/dev/null; then
  echo "  ✓ sw.js in .gitignore"
else
  echo "  ⚠ sw.js not in .gitignore"
  WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo "=== Summary ==="
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo "✓ PWA setup looks valid!"
  exit 0
else
  echo "✗ Fix $ERRORS error(s) before deploying."
  exit 1
fi
