import { test, expect } from '@playwright/test';
test('gallery renders with API or static fallback', async ({ page }) => {
  await page.goto('/gallery', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name:/Gallery/i })).toBeVisible();
  await expect(page.locator('img')).toHaveCountGreaterThan(0);
});