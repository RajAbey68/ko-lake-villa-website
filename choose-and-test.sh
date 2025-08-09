#!/usr/bin/env bash
set -euo pipefail

echo "▶ Ko Lake Villa — choose env, set env vars, and smoke test"

read -r -p "Test a Vercel Preview? (y/N): " USE_PREVIEW
if [[ "${USE_PREVIEW:-N}" =~ ^[Yy]$ ]]; then
  read -r -p "Paste the full Preview URL (e.g., https://ko-lake-villa-website-xxxxx.vercel.app): " PREVIEW
  PREVIEW="${PREVIEW%/}"
  BASE_URL="$PREVIEW"
  TARGET="preview"
else
  BASE_URL="http://127.0.0.1:3000"
  TARGET="local"
fi
echo "▶ Target: $TARGET → $BASE_URL"

# Write .env.local for local *and* for reference in Preview env config
cat > .env.local <<ENV
NEXT_PUBLIC_BASE_URL=${BASE_URL}
# Add your real origins here (comma-separated) when you promote to Prod:
ALLOWED_ORIGINS=${BASE_URL},https://kolakevilla.com,https://ko-lake-villa-website.vercel.app
ENV
echo "✓ wrote .env.local"

# Helper to wait for URL
wait_for() { for i in {1..90}; do curl -sk -o /dev/null "$1" && return 0; sleep 1; done; return 1; }

# If local, start the dev server and capture logs
if [[ "$TARGET" == "local" ]]; then
  echo "▶ Installing deps if needed…"; (npm ci || npm install) >/dev/null 2>&1 || true
  echo "▶ Starting dev server… (logs in LOCAL_DEV.log)"
  nohup npm run dev > LOCAL_DEV.log 2>&1 & echo $! > .dev.pid
  if ! wait_for "$BASE_URL"; then
    echo "✗ Dev server didn't come up. Last 120 log lines:"
    tail -n 120 LOCAL_DEV.log || true
    exit 1
  fi
fi

echo "▶ Probing $BASE_URL …"
code=$(curl -sk -o /dev/null -w "%{http_code}" "$BASE_URL/")
echo "• GET / → $code"
if [[ "$code" -ge 500 && "$TARGET" == "local" ]]; then
  echo "🚨 Internal error detected. Last 120 lines of LOCAL_DEV.log:"
  tail -n 120 LOCAL_DEV.log || true
fi

echo "▶ Security headers:"
curl -sI "$BASE_URL" | grep -E 'Content-Security-Policy|Strict-Transport-Security|X-Frame-Options|Referrer-Policy|X-Content-Type-Options|Permissions-Policy' || true

echo "▶ API smoke:"
echo "• /api/health:";  curl -s -i "$BASE_URL/api/health" | sed -n '1,8p' || true
echo "• /api/openapi:"; curl -s "$BASE_URL/api/openapi" | head -n 10 || true
echo "• /api/docs (HEAD):"; curl -sI "$BASE_URL/api/docs" | sed -n '1,10p' || true

echo "▶ Pages:"
for r in / /accommodation /gallery /contact /admin; do
  c=$(curl -sk -o /dev/null -w "%{http_code}" "$BASE_URL$r")
  printf "  %3s  %s\n" "$c" "$r"
done

echo "▶ Quick nav check with Playwright (if installed)…"
if npx --yes playwright --version >/dev/null 2>&1; then
  npx playwright install --with-deps >/dev/null 2>&1 || true
  tmpd="$(mktemp -d)"; cat > "$tmpd/nav.spec.ts" <<'TS'
import { test, expect } from '@playwright/test';
for (const r of ['/', '/gallery', '/contact']) {
  test(`open ${r}`, async ({ page }) => { await page.goto(r); await expect(page).toHaveURL(new RegExp(r==='/'?'/?$':r+'$')); });
}
TS
  PW_NO_SERVER=1 BASE_URL="$BASE_URL" npx playwright test "$tmpd/nav.spec.ts" --reporter=list || true
else
  echo "• Playwright not present; skipping."
fi

if [[ -f .dev.pid ]]; then kill "$(cat .dev.pid)" >/dev/null 2>&1 || true; rm .dev.pid; fi

echo "✅ Done. WHAT I TESTED: $TARGET → $BASE_URL"
echo
echo "If Preview is failing:"
echo "  • Vercel → Project ko-lake-villa-website → Deployments → click the latest for your branch (e.g., fix/blockers-now)"
echo "  • Open the deployment → Functions tab → check stack traces"
echo "  • Settings → Environment Variables (Preview): set"
echo "      ALLOWED_ORIGINS = ${BASE_URL},https://kolakevilla.com"
echo "      NEXT_PUBLIC_BASE_URL = ${BASE_URL}"
echo
echo "Tip: Production shows '1 day ago' because only 'main' auto-deploys to Prod. Your new work is in those Preview deployments."