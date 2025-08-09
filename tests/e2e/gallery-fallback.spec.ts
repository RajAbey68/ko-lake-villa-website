import { test, expect } from '@playwright/test';

test('Gallery renders with static fallback', async ({ page }) => {
  await page.goto('/gallery', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /gallery/i })).toBeVisible();
  // Expect at least one image
  const imgs = page.locator('img');
  await expect(imgs).toHaveCountGreaterThan(0);
});