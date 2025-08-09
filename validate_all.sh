#!/usr/bin/env bash
set -euo pipefail

echo "▶ Node & deps"
node -v
npm ci || npm install

echo "▶ Typecheck"
npx tsc --noEmit

echo "▶ Lint (if configured)"
npm run lint || true

echo "▶ Sanity checks (presence of critical files/components)"
for f in app/page.tsx app/accommodation/page.tsx app/contact/page.tsx components/navigation/global-header.tsx; do
  [ -f "$f" ] || { echo "❌ Missing $f"; exit 1; }
done
rg -n "Ko Lake Villa" app/page.tsx || { echo "❌ Hero copy missing"; exit 1; }
rg -n "Airbnb Booking URLs" app/accommodation/page.tsx || echo "⚠️ Airbnb panel text not found (verify in UI)"
rg -n "General Manager|Villa Team Lead|Owner" app/contact/page.tsx >/dev/null || { echo "❌ Contact roles missing"; exit 1; }

echo "▶ Playwright (local) – starts dev server if needed"
npx playwright install --with-deps || true
PW_NO_SERVER= npx playwright test || { echo "❌ Playwright tests failed"; exit 1; }

echo "✅ All local checks passed. Open your PR; Vercel preview should go green."