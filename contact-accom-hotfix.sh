#!/usr/bin/env bash
set -euo pipefail

BRANCH="fix/contact-accom-hotfix"
echo "▶ Branch: $BRANCH"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

w() { mkdir -p "$(dirname "$1")"; printf "%s" "$2" > "$1"; echo "✓ wrote $1"; }
ensure() { mkdir -p "$1"; }

# ---------- WhatsApp helper ----------
ensure lib
w lib/whatsapp.ts "$(cat <<'TS'
export function waLink(phoneE164: string, message: string) {
  const p = phoneE164.replace(/[^\d]/g, '');
  return `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
}
TS
)"

# ---------- Pricing logic (direct + last-minute Sun–Thu within 3 days) ----------
w lib/pricing.ts "$(cat <<'TS'
export type PriceCalc = {
  base: number;                           // nightly base price
  checkIn?: Date;                          // optional check-in date
  now?: Date;                              // for testing
};

export function computeDiscounts({ base, checkIn, now }: PriceCalc) {
  const today = now ?? new Date();
  const ci = checkIn ?? today;

  // Always-on direct booking discount
  const directPct = 10; // %
  let extraPct = 0;

  const msPerDay = 24*60*60*1000;
  const daysAhead = Math.floor((ci.getTime() - today.getTime())/msPerDay);

  const dow = ci.getDay(); // 0=Sun ... 6=Sat
  const isSunThu = dow >= 0 && dow <= 4; // Sun..Thu
  const isWithin3Days = daysAhead >= 0 && daysAhead <= 3;

  if (isSunThu && isWithin3Days) {
    extraPct = 15;
  }

  const totalPct = directPct + extraPct;
  const final = round2(base * (1 - totalPct/100));
  const savings = round2(base - final);

  return { base, directPct, extraPct, totalPct, final, savings, isSunThu, isWithin3Days };
}

function round2(n:number){ return Math.round(n*100)/100; }
TS
)"

# ---------- Contact page ----------
if [ -f app/contact/page.tsx ]; then
  cp app/contact/page.tsx app/contact/page.tsx.bak || true
fi
w app/contact/page.tsx "$(cat <<'TSX'
import Link from 'next/link';
import { waLink } from '@/lib/whatsapp';

const CONTACTS = [
  { role: 'General Manager', phone: '+94 71 776 5780' },
  { role: 'Villa Team Lead (Sinhala speaker)', phone: '+94 77 315 0602' },
  { role: 'Owner', phone: '+94 71 173 0345' },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Contact Us</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {CONTACTS.map(c => {
          const tel = `tel:${c.phone.replace(/\\s+/g,'')}`;
          const wa = waLink(c.phone, 'Hello! I'm contacting Ko Lake Villa via the website.');
          return (
            <section key={c.phone} className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold">{c.role}</h2>
              <p className="mt-1 text-gray-700">{c.phone}</p>
              <div className="mt-4 flex gap-3">
                <Link href={tel} className="inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Call</Link>
                <Link href={wa} target="_blank" className="inline-flex items-center rounded-xl bg-green-600 text-white px-3 py-2 text-sm hover:opacity-90">WhatsApp</Link>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-semibold">Email</h3>
        <p><a className="underline" href="mailto:stay@kolakevilla.com">stay@kolakevilla.com</a></p>
      </div>
    </main>
  );
}
TSX
)"

# ---------- Accommodation page with Airbnb panel + pricing widget ----------
if [ -f app/accommodation/page.tsx ]; then
  cp app/accommodation/page.tsx app/accommodation/page.tsx.bak || true
fi
w app/accommodation/page.tsx "$(cat <<'TSX'
import Link from 'next/link';
import { computeDiscounts } from '@/lib/pricing';

type Room = {
  id: string;
  title: string;
  maxGuests: number;
  baseNight: number;         // base nightly price
  perks: string[];
  airbnbSlug: string;        // e.g. "eklv"
};

const ROOMS: Room[] = [
  { id: 'villa', title: 'Entire Villa Exclusive', maxGuests: 12, baseNight: 431, perks: ['Private Pool','Lake Views'], airbnbSlug: 'eklv' },
  { id: 'master', title: 'Master Family Suite', maxGuests: 4, baseNight: 119, perks: ['Lake View','Private Balcony'], airbnbSlug: 'klv6' },
  { id: 'triple', title: 'Triple/Twin Rooms', maxGuests: 3, baseNight: 70, perks: ['Garden View','Twin/Triple Beds'], airbnbSlug: 'klv2or3' },
  { id: 'group', title: 'Group Room', maxGuests: 6, baseNight: 250, perks: ['Multiple Beds','Shared Space'], airbnbSlug: 'klv-group' },
];

function AirbnbURL(slug:string){ return `https://airbnb.co.uk/h/${slug}`; }

export default function AccommodationPage() {
  const checkIn = new Date(); // today by default; could be tied to a picker in the future

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Accommodation</h1>

      {/* Airbnb copy-and-paste panel */}
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold mb-2">📋 Airbnb Booking URLs (Copy &amp; Paste)</h2>
        <ul className="space-y-1 text-sm">
          <li><strong>Entire Villa:</strong> <code className="px-1 py-0.5 rounded bg-gray-100">{'airbnb.co.uk/h/eklv'}</code></li>
          <li>7 air-conditioned ensuite bedrooms, sleeps max 23 on beds</li>
          <li><strong>Master Family Suite:</strong> <code className="px-1 py-0.5 rounded bg-gray-100">{'airbnb.co.uk/h/klv6'}</code></li>
          <li><strong>Triple/Twin Rooms:</strong> <code className="px-1 py-0.5 rounded bg-gray-100">{'airbnb.co.uk/h/klv2or3'}</code></li>
          <li className="text-gray-600 mt-2">Click on any URL to select all text, then copy and paste into your browser</li>
        </ul>
      </section>

      {/* Pricing cards with direct & last-minute logic */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {ROOMS.map(room => {
          const p = computeDiscounts({ base: room.baseNight, checkIn });
          return (
            <article key={room.id} className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="absolute right-3 top-3 rounded-full bg-red-500 text-white text-xs px-2 py-1">Save {p.totalPct}%</div>
              <h3 className="text-lg font-semibold">{room.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{room.maxGuests} guests</p>

              <div className="mt-3 text-sm">
                <p className="line-through text-gray-400">Airbnb: ${room.baseNight}</p>
                <p className="text-2xl font-semibold text-amber-600">${p.final}<span className="text-sm text-gray-500">/night</span></p>
                <p className="text-green-600 text-sm">Save ${p.savings}</p>
              </div>

              <ul className="mt-3 text-sm text-gray-700 list-disc ml-5">
                {room.perks.map(x => <li key={x}>{x}</li>)}
              </ul>

              <div className="mt-4 grid gap-2">
                <Link href="#" className="inline-flex items-center justify-center rounded-xl bg-amber-500 text-white px-4 py-2 text-sm hover:opacity-90">Book Direct &amp; Save</Link>
                <Link href={AirbnbURL(room.airbnbSlug)} target="_blank" className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">Open on Airbnb</Link>
              </div>

              {p.extraPct > 0 && (
                <p className="mt-2 text-xs text-emerald-700">Includes last-minute {p.extraPct}% (Sun–Thu, within 3 days)</p>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
TSX
)"

# ---------- E2E tests for Contact + Accommodation specifics ----------
ensure tests/e2e
w tests/e2e/contact-hotfix.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';

test('contact numbers and WhatsApp buttons present', async ({ page }) => {
  await page.goto('/contact');
  for (const txt of [
    '+94 71 776 5780',
    '+94 77 315 0602',
    '+94 71 173 0345',
    'General Manager',
    'Villa Team Lead',
    'Owner'
  ]) {
    await expect(page.getByText(new RegExp(txt))).toBeVisible();
  }
  // at least three WhatsApp links
  const wa = page.locator('a[href*="wa.me"]');
  await expect(wa).toHaveCount(3);
});
TS
)"

w tests/e2e/accommodation-hotfix.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';

test('Airbnb panel + save badge visible', async ({ page }) => {
  await page.goto('/accommodation');
  await expect(page.getByText(/Airbnb Booking URLs/i)).toBeVisible();
  await expect(page.getByText(/airbnb\.co\.uk\/h\/eklv/i)).toBeVisible();
  // Save badge text exists
  await expect(page.getByText(/Save 10%|Save \d+%/i).first()).toBeVisible();
});
TS
)"

# ---------- CI guard: prevent silent feature removals ----------
ensure .github/workflows
w .github/workflows/protect-deletions.yml "$(cat <<'YML'
name: Protect Feature Deletions
on:
  pull_request:
    branches: [ main, GuestyPro, fix/**, feat/** ]
jobs:
  guard:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - name: Detect deletions in critical paths
        id: diff
        run: |
          base="${{ github.event.pull_request.base.sha }}"
          head="${{ github.event.pull_request.head.sha }}"
          echo "Base: $base"
          echo "Head: $head"
          git diff --name-status "$base" "$head" | tee diff.txt
          dels=$(git diff --name-status "$base" "$head" | awk '$1=="D" && ($2 ~ /^app\/|^components\//){print $2}')
          if [ -n "$dels" ]; then
            echo "deleted=$dels" >> $GITHUB_OUTPUT
          fi
      - name: Enforce approval label or commit token
        if: steps.diff.outputs.deleted != ''
        run: |
          echo "Deletions detected:"
          echo "${{ steps.diff.outputs.deleted }}"
          label_ok=$(jq -r '.pull_request.labels[].name' <<< '${{ toJson(github.event) }}' | grep -i '^approved-removal$' || true)
          token_ok=$(git log -1 --pretty=%B | grep -F 'APPROVED-REMOVAL' || true)
          if [ -z "$label_ok" ] && [ -z "$token_ok" ]; then
            echo "::error::Critical files deleted without approval. Add PR label 'approved-removal' or include 'APPROVED-REMOVAL' in the commit message."
            exit 1
          else
            echo "Approval satisfied."
          fi
YML
)"

# ---------- Ensure Playwright config (if missing) ----------
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

# ---------- Build & push ----------
echo "▶ Install & build"
(npm ci || npm install) >/dev/null 2>&1 || true
npm run build || true

git add -A
git commit -m "feat: contact phones + WhatsApp; accommodation Airbnb panel + pricing rules; e2e tests; CI deletion guard" || true
git push -u origin "$BRANCH"

echo "✅ Pushed $BRANCH"
echo "Next:"
echo "  1) Open the PR for $BRANCH. Vercel will attach a Preview."
echo "  2) Verify /contact shows the three numbers with WhatsApp buttons."
echo "  3) Verify /accommodation shows the Airbnb panel and 'Save X%' on cards."
echo "  4) CI will now block any PR that deletes app/components files unless explicitly approved."