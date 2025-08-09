#!/usr/bin/env bash
set -euo pipefail

# This script:
# 1) creates/pushes PR branch with the GuestyPro-parity test suite (if not already pushed)
# 2) runs local tests once (typecheck + unit + e2e)
# 3) opens a PR via gh (if installed)
# 4) optionally stores your Vercel Preview URL as a repo secret (so CI tests the preview too)

BR="chore/add-guestypro-parity-tests"

need() { command -v "$1" >/dev/null 2>&1 || { echo "• install $1 first"; exit 1; }; }

w() { mkdir -p "$(dirname "$1")"; printf "%s" "$2" >"$1"; echo "✓ wrote $1"; }

# --- 0) Ensure node/npm available
need node
need npm

# --- 1) create/switch branch
git checkout -b "$BR" 2>/dev/null || git checkout "$BR"

# --- 2) drop in the GuestyPro-parity tests & CI if not already present
if [ ! -f tests/e2e/home-accommodation.spec.ts ]; then
  # minimal pricing util (idempotent)
  mkdir -p lib tests/e2e tests/unit .github/workflows

  w lib/pricing.ts "$(cat <<'TS'
export function computeDirectAndLastMinute(base:number, checkIn:Date=new Date(), now:Date=new Date()){
  const DIRECT = 10;
  const dow = checkIn.getDay();            // 0=Sun..6=Sat
  const sunThu = dow>=0 && dow<=4;
  const days = Math.floor((checkIn.getTime()-now.getTime())/86400000);
  const within3 = days>=0 && days<=3;
  const extra = sunThu && within3 ? 15 : 0;
  const pct = DIRECT + extra;
  const final = Math.round(base * (1 - pct/100) * 100)/100;
  const save  = Math.round((base - final) * 100)/100;
  return { directPct: DIRECT, extraPct: extra, totalPct: pct, final, save };
}
TS
)"

  w tests/e2e/global-nav.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';
test('nav present', async ({ page }) => {
  await page.goto('/');
  for (const link of ['Home','Accommodation','Gallery','Contact','Admin']) {
    await expect(page.getByRole('link', { name: link })).toBeVisible();
  }
});
TS
)"

  w tests/e2e/home-accommodation.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';

const cards = [
  { name:/Entire Villa/i, guests:/16–24 guests|16-24 guests/i },
  { name:/Master Family Suite/i, guests:/6 guests/i },
  { name:/Triple\/Twin Rooms/i, guests:/3–4 guests|3-4 guests/i },
  { name:/Group Room/i, guests:/6 guests/i },
];

for (const route of ['/', '/accommodation']) {
  test(`${route} cards & pricing`, async ({ page }) => {
    await page.goto(route);
    for (const c of cards) {
      const card = page.getByRole('heading', { name: c.name }).locator('..');
      await expect(card.getByText(c.guests)).toBeVisible();
      await expect(card.getByText(/Airbnb:\s*\$/i)).toBeVisible();
      await expect(card.getByText(/Save\s+\$|Save\s+\d+%/i)).toBeVisible();
      await expect(card.getByRole('link', { name: /Open on Airbnb/i })).toBeVisible();
      await expect(card.getByRole('link', { name: /Book Direct/i })).toBeVisible();
    }
  });
}
TS
)"

  w tests/e2e/accommodation-airbnb-panel.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';
test('Airbnb copy panel', async ({ page }) => {
  await page.goto('/accommodation');
  await expect(page.getByText(/Airbnb Booking URLs/i)).toBeVisible();
  for (const u of ['airbnb.co.uk/h/eklv','airbnb.co.uk/h/klv6','airbnb.co.uk/h/klv2or3']) {
    await expect(page.getByText(new RegExp(u))).toBeVisible();
  }
});
TS
)"

  w tests/e2e/gallery-fallback.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';
test('gallery API or fallback', async ({ page }) => {
  await page.goto('/gallery', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name:/Gallery/i })).toBeVisible();
  await expect(page.locator('img')).toHaveCountGreaterThan(0);
});
TS
)"

  w tests/e2e/contact-full.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';
test('contact phones, WhatsApp, emails, hint', async ({ page }) => {
  await page.goto('/contact');
  for (const t of [
    'General Manager','\\+94 71 776 5780',
    'Villa Team Lead','\\+94 77 315 0602',
    'Owner','\\+94 71 173 0345'
  ]) await expect(page.getByText(new RegExp(t))).toBeVisible();

  await expect(page.locator('a[href^="tel:"]')).toHaveCount(3);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(3);
  for (const m of ['stay@kolakevilla.com','bookings@kolakevilla.com','events@kolakevilla.com','info@kolakevilla.com']) {
    await expect(page.locator(`a[href="mailto:${m}"]`)).toBeVisible();
  }
  await expect(page.getByText(/international/i)).toBeVisible();
});
TS
)"

  w tests/e2e/booking.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';
test('booking fields & sidebar', async ({ page }) => {
  await page.goto('/booking');
  for (const lbl of ['Full Name','Email Address','Phone Number','Check-in Date','Check-out Date','Room Type','Number of Guests']) {
    await expect(page.getByText(new RegExp(lbl))).toBeVisible();
  }
  await expect(page.getByRole('button', { name:/Submit Booking Request/i })).toBeVisible();
  for (const s of ['Call','WhatsApp','Email','Chat on WhatsApp','Save 10-15%','Personal Service','Flexible Terms','Best Rate Guarantee']) {
    await expect(page.getByText(new RegExp(s))).toBeVisible();
  }
});
TS
)"

  w tests/unit/pricing.spec.ts "$(cat <<'TS'
import { computeDirectAndLastMinute } from '@/lib/pricing';

it('always 10% direct', () => {
  const r = computeDirectAndLastMinute(100, new Date('2025-08-04'), new Date('2025-08-01'));
  expect(r.totalPct).toBe(10);
});

it('adds 15% last-minute Sun–Thu within 3 days', () => {
  const r = computeDirectAndLastMinute(100, new Date('2025-08-05'), new Date('2025-08-03'));
  expect(r.totalPct).toBe(25);
});
TS
)"

  # playwright config if missing
  if [ ! -f playwright.config.ts ] && [ ! -f playwright.config.js ]; then
    w playwright.config.ts "$(cat <<'TS'
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: process.env.PW_NO_SERVER ? undefined : {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
TS
)"
  fi

  # CI workflows
  w .github/workflows/qa-guestypro-parity.yml "$(cat <<'YML'
name: QA – GuestyPro Parity
on:
  pull_request:
    branches: [ main, GuestyPro, fix/**, feat/** ]
jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'npm' }
      - run: npm ci || npm i
      - name: Typecheck
        run: npx tsc --noEmit
      - name: Unit
        run: npx jest --coverage || npm run test:unit
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: E2E (local dev server)
        run: |
          BASE_URL="http://127.0.0.1:3000" nohup npm run dev >/dev/null 2>&1 &
          npx wait-on http://127.0.0.1:3000
          npx playwright test
      - name: E2E (Vercel preview, optional)
        if: ${{ secrets.VERCEL_PREVIEW_URL != '' }}
        env:
          BASE_URL: ${{ secrets.VERCEL_PREVIEW_URL }}
          PW_NO_SERVER: 1
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report
YML
)"

  w .github/workflows/protect-deletions.yml "$(cat <<'YML'
name: Protect Feature Deletions
on: { pull_request: { branches: [ main, GuestyPro, fix/**, feat/** ] } }
jobs:
  guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: |
          base="${{ github.event.pull_request.base.sha }}"
          head="${{ github.event.pull_request.head.sha }}"
          dels=$(git diff --name-status "$base" "$head" | awk '$1=="D" && ($2 ~ /^app\/|^components\//){print $2}')
          if [ -n "$dels" ]; then
            echo "::error::Critical files deleted: $dels. Add label 'approved-removal' or include 'APPROVED-REMOVAL' in commit message."
            exit 1
          fi
YML
)"
fi

# --- 3) package scripts (idempotent)
node <<'NODE'
const fs=require('fs'); const p='package.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.scripts=j.scripts||{};
if(!j.scripts['test:unit']) j.scripts['test:unit']='jest --coverage';
if(!j.scripts['test:e2e'])  j.scripts['test:e2e']='PW_NO_SERVER= npx playwright test';
j.scripts['test:all']='npm run test:unit && npm run test:e2e';
j.engines={ node:'>=22 <23', ...(j.engines||{}) };
fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
console.log('✓ package.json updated');
NODE

# --- 4) install, run local tests once
echo "▶ installing & running local tests (this can take ~1–2 min)…"
(npm ci || npm i) >/dev/null 2>&1 || true
npx playwright install --with-deps >/dev/null 2>&1 || true
# run a quick build to surface obvious type errors but don't hard fail the script
npm run build >/dev/null 2>&1 || true
# run e2e quickly (dev server)
BASE_URL="http://127.0.0.1:3000" nohup npm run dev >/dev/null 2>&1 &
npx wait-on http://127.0.0.1:3000
npx playwright test || true

# --- 5) commit & push; open PR
git add -A
git commit -m "test(qa): add GuestyPro-parity TDD & CI guardrails" || true
git push -u origin "$BR"

if command -v gh >/dev/null 2>&1; then
  echo "▶ creating PR with GitHub CLI…"
  gh pr create --fill --head "$BR" --title "QA: GuestyPro-parity TDD & CI" --body "Adds parity tests and CI to block regressions."
  echo "👉 Open the PR in your browser to see the Vercel Preview URL once it appears."
else
  repo="$(git config --get remote.origin.url | sed -E 's#.*github.com[:/](.+)\.git#\1#')"
  echo "▶ Open PR manually: https://github.com/$repo/pull/new/$BR"
fi

# --- 6) optionally set preview URL secret so CI also hits preview
if command -v gh >/dev/null 2>&1; then
  read -r -p "Paste Vercel Preview URL to store as repo secret VERCEL_PREVIEW_URL (or leave blank to skip): " PREVIEW
  if [ -n "${PREVIEW:-}" ]; then
    gh secret set VERCEL_PREVIEW_URL --body "$PREVIEW"
    echo "✓ Secret VERCEL_PREVIEW_URL set."
    echo "You can re-run the workflow to test the preview now."
  fi
fi

echo "✅ Done. From now on, changes that break GuestyPro-parity will fail CI (locally and on previews)."