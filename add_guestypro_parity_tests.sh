#!/usr/bin/env bash
set -euo pipefail

BRANCH="chore/add-guestypro-parity-tests"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

w(){ mkdir -p "$(dirname "$1")"; printf "%s" "$2" > "$1"; echo "✓ $1"; }

# --- Pricing util (idempotent) ---
mkdir -p lib
[ -f lib/pricing.ts ] || w lib/pricing.ts "$(cat <<'TS'
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

# --- E2E tests ---
mkdir -p tests/e2e tests/unit

w tests/e2e/global-nav.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';
test('nav works (desktop & mobile)', async ({ page }) => {
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
test('Airbnb copy panel exists', async ({ page }) => {
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
test('gallery renders with API or static fallback', async ({ page }) => {
  await page.goto('/gallery', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name:/Gallery/i })).toBeVisible();
  await expect(page.locator('img')).toHaveCountGreaterThan(0);
});
TS
)"

w tests/e2e/contact-full.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';
test('contact cards, WhatsApp & mails', async ({ page }) => {
  await page.goto('/contact');
  for (const t of [
    'General Manager', '\\+94 71 776 5780',
    'Villa Team Lead', '\\+94 77 315 0602',
    'Owner', '\\+94 71 173 0345'
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
test('booking form fields & sidebar', async ({ page }) => {
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

# --- Unit tests for pricing ---
w tests/unit/pricing.spec.ts "$(cat <<'TS'
import { computeDirectAndLastMinute } from '@/lib/pricing';

it('always has 10% direct', () => {
  const r = computeDirectAndLastMinute(100, new Date('2025-08-04'), new Date('2025-08-01')); // Mon, >3 days
  expect(r.totalPct).toBe(10);
});

it('adds 15% last-minute Sun–Thu within 3 days', () => {
  const r = computeDirectAndLastMinute(100, new Date('2025-08-05'), new Date('2025-08-03')); // Tue, 2 days
  expect(r.totalPct).toBe(25);
});
TS
)"

# --- Playwright config (idempotent) ---
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

# --- CI: run typecheck + unit + e2e locally and on Vercel preview ---
mkdir -p .github/workflows
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
      - name: E2E (local)
        run: |
          BASE_URL="http://127.0.0.1:3000" nohup npm run dev >/dev/null 2>&1 &
          npx wait-on http://127.0.0.1:3000
          npx playwright test
      - name: E2E (Vercel preview, if URL provided)
        if: ${{ github.event.pull_request.head.ref != '' && startsWith(github.event.pull_request.head.ref, '') }}
        env:
          BASE_URL: ${{ secrets.VERCEL_PREVIEW_URL }}
        run: |
          if [ -n "$BASE_URL" ]; then
            PW_NO_SERVER=1 npx playwright test
          else
            echo "No VERCEL_PREVIEW_URL secret set – skipping preview run."
          fi
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report
YML
)"

# --- CI guard: prevent silent feature removals ---
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

# --- package.json scripts (idempotent) ---
node <<'NODE'
const fs=require('fs'); const p='package.json'; const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.scripts=j.scripts||{};
j.scripts['test:unit']=j.scripts['test:unit']||'jest --coverage';
j.scripts['test:e2e']=j.scripts['test:e2e']||'PW_NO_SERVER= npx playwright test';
j.scripts['test:all']='npm run test:unit && npm run test:e2e';
j.engines={ node: '>=22 <23', ...(j.engines||{}) };
fs.writeFileSync(p, JSON.stringify(j,null,2));
console.log('package.json updated');
NODE

git add -A
git commit -m "test(qa): add GuestyPro-parity TDD tests + CI guards" || true
git push -u origin "$BRANCH"
echo "✅ Pushed $BRANCH. Open a PR to get a Vercel Preview; set VERCEL_PREVIEW_URL secret if you want CI to hit preview too."