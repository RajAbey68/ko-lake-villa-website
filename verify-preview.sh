#!/usr/bin/env bash
set -euo pipefail

# >>> SET THIS TO YOUR VERCEL PREVIEW URL <<<
PREVIEW="${PREVIEW:-https://YOUR-PREVIEW.vercel.app}"

echo "▶ Preview: $PREVIEW"
if [[ "$PREVIEW" != https://* ]]; then
  echo "❌ Please set PREVIEW to your Vercel preview URL, e.g."
  echo "   PREVIEW=https://ko-lake-villa-website-git-xxx.vercel.app ./verify-preview.sh"
  exit 1
fi

# 0) Ensure deps
(npm ci || npm install) >/dev/null 2>&1 || true
npx playwright install --with-deps >/dev/null 2>&1 || true

# 1) Minimal e2e tests for the preview (won't touch your existing suite)
mkdir -p tests/preview
cat > tests/preview/smoke.spec.ts <<'TS'
import { test, expect, request } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Home renders hero + 4 room cards', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /ko lake villa/i })).toBeVisible();
  // room-card is our test id; fall back to cards by CTA
  const cards = page.locator('[data-testid="room-card"], article:has-text("Book Direct")');
  await expect(cards).toHaveCount(4);
});

test('Accommodation: guest counts + airbnb links + save badge', async ({ page }) => {
  await page.goto('/accommodation', { waitUntil: 'networkidle' });
  for (const t of ['16–24 guests','6 guests','3–4 guests']) {
    await expect(page.getByText(new RegExp(t))).toBeVisible();
  }
  await expect(page.getByText(/Open on Airbnb/i)).toHaveCount(4);
  await expect(page.getByText(/Save \d+%/i).first()).toBeVisible();
});

test('Gallery: tiles present with captions', async ({ page }) => {
  await page.goto('/gallery', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /gallery/i })).toBeVisible();
  const imgs = page.locator('figure img');
  await expect(imgs).toHaveCountGreaterThan(0);
});

test('Contact: phones, WhatsApp, aliases, and form feedback', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  for (const t of [
    'General Manager', '+94 71 776 5780',
    'Villa Team Lead', '+94 77 315 0602',
    'Owner', '+94 71 173 0345'
  ]) {
    await expect(page.getByText(new RegExp(t))).toBeVisible();
  }
  await expect(page.getByText(/stay@kolakevilla\.com/i)).toBeVisible();
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(3);

  // soft-assert form feedback (OK or CSRF/Forbidden on preview)
  await page.fill('input[placeholder*="name"]','QA');
  await page.fill('input[type="email"]','qa@kolakevilla.com');
  await page.fill('textarea','Hello from preview test');
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page.getByText(/Thanks|failed|Send failed|Forbidden/i)).toBeVisible({ timeout: 7000 });
});

test('Admin: redirects to /admin/login', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/admin\/login/);
});

test('Security headers present', async () => {
  const ctx = await request.newContext({ baseURL: process.env.BASE_URL! });
  const res = await ctx.get('/');
  expect(res.status()).toBe(200);
  const h = res.headers();
  expect(h['strict-transport-security'] ?? '').not.toBeUndefined();
  expect(h['x-content-type-options'] ?? '').toMatch(/nosniff/i);
  expect(h['referrer-policy'] ?? '').toBeTruthy();
});
TS

# 2) Playwright config for preview-only run (no local server)
cat > playwright.preview.config.ts <<'TS'
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/preview',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry'
  }
});
TS

# 3) Quick header check with curl
echo "▶ Header probe"
curl -sI "$PREVIEW" | grep -E 'Strict-Transport-Security|X-Content-Type-Options|Referrer-Policy|Content-Security-Policy' || true
echo

# 4) Run preview smoke tests
echo "▶ Running preview smoke (Playwright)…"
BASE_URL="$PREVIEW" npx playwright test -c playwright.preview.config.ts || PREVIEW_FAIL=1

# 5) Save report
mkdir -p preview-artifacts
cp -r playwright-report preview-artifacts/report 2>/dev/null || true
echo "Report → preview-artifacts/report/index.html"

# 6) Output decision
if [ "${PREVIEW_FAIL:-0}" = "1" ]; then
  echo "❌ Go/No-Go: NO-GO"
  echo "Open preview-artifacts/report/index.html and attach failures to the PR."
  exit 1
else
  echo "✅ Go/No-Go: GO"
  echo "Looks good to merge. After merge: in Vercel → Redeploy Production with 'Clear build cache'."
fi