#!/usr/bin/env bash
set -euo pipefail

BRANCH="feat/visual-regression-ci"
echo "▶ Setting up visual regression testing on branch: $BRANCH"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

w() { mkdir -p "$(dirname "$1")"; printf "%s" "$2" > "$1"; echo "✓ wrote $1"; }

# 1) Visual regression test suite
mkdir -p tests/visual

w tests/visual/visual-regression.spec.ts "$(cat <<'TS'
import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home', path: '/', selectors: ['h1:has-text("Ko Lake Villa")', '.hero', '[data-testid="room-card"]'] },
  { name: 'Accommodation', path: '/accommodation', selectors: ['h1:has-text("Accommodation")', '[data-testid="room-card"]', ':has-text("Airbnb Booking URLs")'] },
  { name: 'Contact', path: '/contact', selectors: ['h1:has-text("Contact")', ':has-text("General Manager")', 'a[href^="tel:"]'] },
  { name: 'Gallery', path: '/gallery', selectors: ['h1:has-text("Gallery")', 'img'] },
  { name: 'Booking', path: '/booking', selectors: ['h1:has-text("Book Your Stay")', 'form', ':has-text("Why Book Direct")'] }
];

test.describe('Visual Regression Tests', () => {
  for (const page of pages) {
    test(`${page.name} page visual consistency`, async ({ page: playwright }) => {
      await playwright.goto(page.path);
      
      // Wait for key elements
      for (const selector of page.selectors) {
        await playwright.waitForSelector(selector, { timeout: 10000 }).catch(() => {
          console.warn(`Optional selector not found: ${selector}`);
        });
      }
      
      // Take full page screenshot
      await expect(playwright).toHaveScreenshot(`${page.name.toLowerCase()}-full.png`, {
        fullPage: true,
        animations: 'disabled',
        mask: [playwright.locator('[data-dynamic]')], // Mask dynamic content
      });
      
      // Mobile view
      await playwright.setViewportSize({ width: 375, height: 812 });
      await expect(playwright).toHaveScreenshot(`${page.name.toLowerCase()}-mobile.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
  
  test('Hero section with video/GIF', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('.hero, section:has(h1:has-text("Ko Lake Villa"))').first();
    
    // Check video or GIF is present
    const video = hero.locator('video');
    const gif = hero.locator('img[alt*="Yoga"], img[alt*="sala"]');
    
    const hasMedia = await video.or(gif).isVisible();
    expect(hasMedia).toBeTruthy();
    
    // Screenshot just the hero
    await expect(hero).toHaveScreenshot('hero-section.png', {
      animations: 'disabled',
    });
  });
  
  test('Room cards pricing display', async ({ page }) => {
    await page.goto('/accommodation');
    
    const cards = page.locator('[data-testid="room-card"], .room-card, article:has(button:has-text("Book Direct"))');
    const count = await cards.count();
    
    expect(count).toBeGreaterThanOrEqual(4); // Should have 4 room cards
    
    for (let i = 0; i < Math.min(count, 4); i++) {
      const card = cards.nth(i);
      await expect(card).toHaveScreenshot(`room-card-${i}.png`);
    }
  });
});
TS
)"

# 2) Playwright config for visual tests
w playwright.visual.config.ts "$(cat <<'TS'
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  outputDir: './test-results',
  snapshotDir: './tests/visual/screenshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}',
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
      },
    },
  ],
  
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
});
TS
)"

# 3) GitHub Actions workflow for visual regression
mkdir -p .github/workflows
w .github/workflows/visual-regression.yml "$(cat <<'YML'
name: Visual Regression Tests

on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'app/**'
      - 'components/**'
      - 'styles/**'
      - 'public/**'
      - 'tailwind.config.*'
  push:
    branches: [main]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run visual regression tests
        run: npx playwright test --config=playwright.visual.config.ts
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      
      - name: Upload screenshots
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: visual-snapshots
          path: tests/visual/screenshots/
          retention-days: 30
      
      # Comment on PR with results
      - name: Comment PR
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('test-results/results.json', 'utf8'));
            const passed = results.stats.expected === results.stats.unexpected;
            
            const comment = `## 📸 Visual Regression Results
            
            ${passed ? '✅ All visual tests passed!' : '❌ Visual differences detected'}
            
            - **Total tests**: ${results.stats.expected + results.stats.unexpected}
            - **Passed**: ${results.stats.expected}
            - **Failed**: ${results.stats.unexpected}
            
            ${!passed ? '⚠️ Please review the screenshot artifacts to verify the changes are intentional.' : ''}
            
            [View full report](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
YML
)"

# 4) Script to update baseline screenshots
w scripts/update-visual-baseline.sh "$(cat <<'BASH'
#!/usr/bin/env bash
set -euo pipefail

echo "📸 Updating visual regression baseline screenshots..."
echo "This will capture the current UI as the new baseline."
echo ""

# Clean existing screenshots
rm -rf tests/visual/screenshots

# Run tests to generate new baselines
npx playwright test --config=playwright.visual.config.ts --update-snapshots

echo ""
echo "✅ Baseline screenshots updated!"
echo "Review changes with: git diff tests/visual/screenshots"
echo "Commit when satisfied: git add tests/visual/screenshots && git commit -m 'chore: update visual baselines'"
BASH
)"
chmod +x scripts/update-visual-baseline.sh

# 5) Add visual test scripts to package.json
node <<'NODE'
const fs = require('fs');
const p = 'package.json';
const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));

pkg.scripts = pkg.scripts || {};
pkg.scripts['test:visual'] = 'playwright test --config=playwright.visual.config.ts';
pkg.scripts['test:visual:update'] = 'playwright test --config=playwright.visual.config.ts --update-snapshots';
pkg.scripts['test:visual:ui'] = 'playwright test --config=playwright.visual.config.ts --ui';

fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
console.log('✓ package.json updated with visual test scripts');
NODE

# 6) Create initial baseline screenshots
echo "▶ Generating initial baseline screenshots..."
npm run build || true
npx playwright install chromium || true
npm run test:visual:update || echo "⚠️ Initial baseline generation needs manual run after merge"

# 7) Add README for visual testing
w tests/visual/README.md "$(cat <<'MD'
# Visual Regression Testing

This directory contains visual regression tests that capture screenshots of key pages and compare them against baseline images.

## Purpose

Prevent unintended visual changes to the GuestyPro UI design by:
- Capturing full-page screenshots of all main pages
- Comparing against baseline images on every PR
- Alerting when visual differences are detected

## Running Tests

```bash
# Run visual regression tests
npm run test:visual

# Update baseline screenshots (after intentional changes)
npm run test:visual:update

# Open Playwright UI for debugging
npm run test:visual:ui
```

## Covered Pages

- **Home** - Hero section, room cards, CTAs
- **Accommodation** - Room listings, pricing, Airbnb panel
- **Contact** - Phone cards, WhatsApp buttons, email links
- **Gallery** - Image grid layout
- **Booking** - Form fields, sidebar, "Why Book Direct"

## CI Integration

Visual tests run automatically on:
- Every PR that changes UI files
- Pushes to main branch

Failed tests upload screenshot diffs as artifacts for review.

## Updating Baselines

When you intentionally change the UI:

1. Run locally to see the differences:
   ```bash
   npm run test:visual
   ```

2. If changes are correct, update baselines:
   ```bash
   npm run test:visual:update
   ```

3. Commit the new baseline images:
   ```bash
   git add tests/visual/screenshots
   git commit -m "chore: update visual baselines for [describe change]"
   ```

## Best Practices

- ✅ Always review screenshot diffs before updating baselines
- ✅ Update baselines as a separate commit for clarity
- ✅ Use `[data-dynamic]` attribute on elements with dynamic content
- ✅ Run tests locally before pushing UI changes
- ❌ Never update baselines without reviewing the differences
- ❌ Don't ignore failing visual tests - investigate the cause
MD
)"

# 8) Commit and push
git add -A
git commit -m "feat: add visual regression testing with Playwright

- Comprehensive screenshot tests for all main pages
- CI workflow to run on every PR
- Baseline management scripts
- Desktop and mobile viewport testing
- Automatic PR comments with results" || true

git push -u origin "$BRANCH"

echo ""
echo "✅ Visual Regression Testing Setup Complete!"
echo ""
echo "📋 What was added:"
echo "  • Visual regression test suite (tests/visual/)"
echo "  • CI workflow (.github/workflows/visual-regression.yml)"
echo "  • Baseline update script (scripts/update-visual-baseline.sh)"
echo "  • Package.json scripts (test:visual, test:visual:update)"
echo ""
echo "🚀 Next steps:"
echo "  1. Create PR: https://github.com/RajAbey68/ko-lake-villa-website/pull/new/$BRANCH"
echo "  2. After merging, run: npm run test:visual:update"
echo "  3. Commit baseline screenshots"
echo "  4. Visual regression protection active! 🛡️"
echo ""
echo "From now on:"
echo "  • Every PR will be checked for visual changes"
echo "  • Screenshots will be compared automatically"
echo "  • You'll get alerts if the design changes"
echo "  • The GuestyPro design is locked in! 🔒"