import { test, expect } from '@playwright/test';

test.describe('Homepage (GuestyPro polished)', () => {
  test('hero + room cards + CTA render', async ({ page }) => {
    await page.goto('/');
    
    // Hero section
    await expect(page.getByRole('heading', { name: /ko lake villa/i })).toBeVisible();
    
    // Book Direct CTA should be visible
    const bookButtons = page.getByRole('link', { name: /book direct/i })
      .or(page.getByRole('button', { name: /book direct/i }));
    await expect(bookButtons.first()).toBeVisible();
    
    // Room cards should be visible
    const roomCards = page.locator('[data-testid="room-card"], .room-card, article.card');
    const count = await roomCards.count();
    expect(count).toBeGreaterThanOrEqual(4);
    
    // Check for guest counts
    await expect(page.getByText(/16.?24 guests/i).first()).toBeVisible();
    await expect(page.getByText(/6 guests/i).first()).toBeVisible();
    await expect(page.getByText(/3.?4 guests/i).first()).toBeVisible();
  });

  test('pricing and save badges visible', async ({ page }) => {
    await page.goto('/');
    
    // Save badges should be visible
    const saveBadges = page.getByText(/Save \$?\d+%?/i);
    const saveCount = await saveBadges.count();
    expect(saveCount).toBeGreaterThan(0);
    
    // Prices should be visible
    const prices = page.getByText(/\$\d+/);
    const priceCount = await prices.count();
    expect(priceCount).toBeGreaterThan(0);
  });

  test('navigation header is present', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation links
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /accommodation/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /gallery/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  });
});