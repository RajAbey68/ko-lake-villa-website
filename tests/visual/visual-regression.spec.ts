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