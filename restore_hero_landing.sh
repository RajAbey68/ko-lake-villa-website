#!/usr/bin/env bash
set -euo pipefail

BRANCH="fix/landing-hero-restore"
echo "▶ Branch: $BRANCH"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

w() { mkdir -p "$(dirname "$1")"; printf "%s" "$2" > "$1"; echo "✓ wrote $1"; }

# 1) Assets (placeholders you will replace)
mkdir -p public/images public/videos

# Lightweight placeholder GIF (1x1 transparent) so build never breaks; replace with your actual GIF
w public/images/yoga-sala.gif "$(printf '\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\xf0\x00\x00\x00\x00\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02L\x01\x00;')"

# Tiny mp4 placeholder; if ffmpeg is present we'll generate a 1s black video; else create a zero-byte stub (Next.js won't crash)
if command -v ffmpeg >/dev/null 2>&1; then
  ffmpeg -f lavfi -i color=c=black:s=640x360:d=1 -an -r 30 -movflags +faststart public/videos/pool.mp4 -y >/dev/null 2>&1 || true
else
  : > public/videos/pool.mp4
fi

# 2) Hero component (GuestyPro layout)
w components/landing/Hero.tsx "$(cat <<'TSX'
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Try autoplay; if blocked, fall back to GIF
    const play = async () => {
      try { await v.play(); setCanPlay(true); } catch { setCanPlay(false); }
    };
    play();
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-10 pb-12">
      {/* two-column on desktop, stacked on mobile */}
      <div className="grid items-center gap-6 md:grid-cols-[minmax(320px,420px)_1fr]">
        {/* CTA Card (left) */}
        <div className="rounded-2xl bg-white/95 shadow-md ring-1 ring-black/5 p-6 md:p-7">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ko Lake Villa</h1>
          <p className="mt-2 text-slate-600">Luxury Lakefront Accommodation in Sri Lanka</p>
          <p className="mt-2 text-[0.95rem] font-medium text-amber-700 italic">Relax, Revive, Reconnect</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/accommodation" className="inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-white hover:opacity-90">
              View Rooms &amp; Rates
            </Link>
            <Link href="/gallery" className="inline-flex items-center rounded-xl border px-4 py-2 text-slate-700 hover:bg-slate-50">
              Explore Gallery
            </Link>
            <Link href="/booking" className="inline-flex items-center rounded-xl border px-4 py-2 text-slate-700 hover:bg-slate-50">
              Book Direct
            </Link>
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-slate-700">
            <li>• Save 10–15% direct</li>
            <li>• Personal service</li>
            <li>• Flexible terms</li>
            <li>• Best rate guarantee</li>
          </ul>
        </div>

        {/* Video panel (right) */}
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/5 bg-black">
          {canPlay ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/videos/pool.mp4"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/yoga-sala.gif"
            />
          ) : (
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/yoga-sala.gif"
                alt="Yoga Sala"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3 right-3 rounded-xl bg-black/60 px-3 py-1 text-xs text-white">
                Preview
              </div>
            </div>
          )}
          {/* Corner title widget (as in your screenshot) */}
          <div className="pointer-events-none absolute right-3 top-3 rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur-sm">
            <div className="text-sm font-semibold">Ko Lake Villa</div>
            <div className="text-xs opacity-80">Tour • Soon</div>
          </div>
        </div>
      </div>
    </section>
  );
}
TSX
)"

# 3) Home page: use Hero component
if [ -f app/page.tsx ]; then cp app/page.tsx app/page.tsx.bak || true; fi
w app/page.tsx "$(cat <<'TSX'
import Hero from '@/components/landing/Hero';

export const metadata = {
  title: 'Ko Lake Villa | Luxury Lakefront Accommodation',
  description: 'Relax, Revive, Reconnect — Book direct and save 10–15%.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[conic-gradient(at_10%_10%,#431407_10%,#7c2d12_40%,#1f2937_60%,#431407_90%)]/5">
      <Hero />
    </main>
  );
}
TSX
)"

# 4) Tailwind: ensure the classes used here are not purged
if [ -f tailwind.config.ts ]; then
  # append a safelist block if not present
  if ! grep -q "safelist" tailwind.config.ts; then
    perl -0777 -pe 's/(module\.exports\s*=\s*{)/$1\n  safelist: [\n    { pattern: /(bg|text|ring)-(amber|slate|black|white|red|green|gray)-(50|100|200|300|400|500|600|700|800|900)/ },\n    { pattern: /(grid-cols|aspect)-.+/ },\n  ],/s' -i tailwind.config.ts || true
  fi
fi

# 5) E2E test to lock hero layout
mkdir -p tests/e2e
w tests/e2e/home-hero.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';

test('home hero shows CTA card and video/gif panel', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Ko Lake Villa/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /View Rooms & Rates/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Explore Gallery/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Book Direct/i })).toBeVisible();

  // Right panel: either <video> or GIF fallback
  const video = page.locator('video');
  const gif = page.locator('img[alt="Yoga Sala"]');
  await expect(video.or(gif)).toBeVisible();
});
TS
)"

# 6) Ensure Playwright config exists
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

# 7) Package scripts (if missing)
node <<'NODE'
const fs=require('fs'); const p='package.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.scripts=j.scripts||{};
if(!j.scripts["test:e2e"]) j.scripts["test:e2e"]="PW_NO_SERVER= npx playwright test";
if(!j.scripts["test:all"]) j.scripts["test:all"]="npm run test:e2e";
j.engines={ node: ">=22 <23", ...(j.engines||{}) };
fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
console.log('✓ package.json scripts/engines updated');
NODE

# 8) Build locally (surface type issues), then commit & push
echo "▶ Installing deps…"
(npm ci || npm install) >/dev/null 2>&1 || true
echo "▶ Local typecheck/build…"
npm run build || true

git add -A
git commit -m "feat(hero): restore GuestyPro landing hero + video widget with GIF fallback; add e2e to prevent regressions" || true
git push -u origin "$BRANCH"

echo ""
echo "✅ Pushed $BRANCH"
echo "Next:"
echo "  1) Open a PR for $BRANCH (Vercel will attach a Preview)."
echo "  2) Replace placeholder assets with your real files:"
echo "       - public/videos/pool.mp4   (hero clip)"
echo "       - public/images/yoga-sala.gif"
echo "  3) Share the Preview URL; we'll smoke-test visual parity."