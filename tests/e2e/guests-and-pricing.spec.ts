import { test, expect } from '@playwright/test';

test('Home shows correct guests labels and a Save badge', async ({ page }) => {
  await page.goto('/');
  for (const label of ['16–24 guests','6 guests','3–4 guests']) {
    await expect(page.getByText(label)).toBeVisible();
  }
  await expect(page.getByText(/Save \d+%/).first()).toBeVisible();
});
