
// Playwright Visual Regression Tests
// Run with: npx playwright test visual-tests.spec.js

const { test, expect } = require('@playwright/test');


test('Visual: Homepage - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('homepage-desktop.png');
});

test('Visual: Homepage - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('homepage-mobile.png');
});

test('Visual: Accommodation - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/accommodation');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('accommodation-desktop.png');
});

test('Visual: Accommodation - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/accommodation');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('accommodation-mobile.png');
});

test('Visual: Dining - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/dining');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('dining-desktop.png');
});

test('Visual: Dining - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/dining');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('dining-mobile.png');
});

test('Visual: Experiences - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/experiences');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('experiences-desktop.png');
});

test('Visual: Experiences - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/experiences');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('experiences-mobile.png');
});

test('Visual: Gallery - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/gallery');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('gallery-desktop.png');
});

test('Visual: Gallery - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/gallery');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('gallery-mobile.png');
});

test('Visual: Admin - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('admin-desktop.png');
});

test('Visual: Admin - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('admin-mobile.png');
});

test('Visual: Contact - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/contact');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('contact-desktop.png');
});

test('Visual: Contact - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/contact');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('contact-mobile.png');
});

test('Visual: FAQ - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/faq');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('faq-desktop.png');
});

test('Visual: FAQ - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/faq');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('faq-mobile.png');
});

test('Visual: Testing Suite - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/testing');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('testing suite-desktop.png');
});

test('Visual: Testing Suite - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/testing');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('testing suite-mobile.png');
});

// Interactive Tests
test('Gallery Interaction Test', async ({ page }) => {
  await page.goto('/gallery');
  await page.waitForLoadState('networkidle');
  
  // Test filter buttons
  await page.click('button:has-text("Pool")');
  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot('gallery-pool-filter.png');
  
  // Test image modal
  await page.click('img').first();
  await page.waitForSelector('[role="dialog"]');
  await expect(page).toHaveScreenshot('gallery-modal.png');
});

test('WhatsApp Integration Test', async ({ page }) => {
  await page.goto('/');
  
  // Mock WhatsApp link
  await page.route('https://wa.me/**', route => route.fulfill({
    status: 200,
    body: 'WhatsApp integration working'
  }));
  
  await page.click('button:has-text("WhatsApp")');
  // Verify link was called (would open in new tab)
});
