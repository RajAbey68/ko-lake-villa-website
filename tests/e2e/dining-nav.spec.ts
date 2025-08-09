import { test, expect } from '@playwright/test';

test('Dining nav link exists and is clickable', async ({ page }) => {
  await page.goto('/');
  const dining = page.getByRole('link', { name: /Dining/i });
  await expect(dining).toBeVisible();
  await dining.click();
  // Accept either a dining hash, page, or same-page section
  await expect(page).toHaveURL(/dining|#dining|\/dining/i);
});