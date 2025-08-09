import { test, expect } from '@playwright/test';
test('Airbnb copy panel exists', async ({ page }) => {
  await page.goto('/accommodation');
  await expect(page.getByText(/Airbnb Booking URLs/i)).toBeVisible();
  for (const u of ['airbnb.co.uk/h/eklv','airbnb.co.uk/h/klv6','airbnb.co.uk/h/klv2or3']) {
    await expect(page.getByText(new RegExp(u))).toBeVisible();
  }
});