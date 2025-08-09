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