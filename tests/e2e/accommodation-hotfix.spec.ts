import { test, expect } from '@playwright/test';

test('Airbnb panel + save badge visible', async ({ page }) => {
  await page.goto('/accommodation');
  await expect(page.getByText(/Airbnb Booking URLs/i)).toBeVisible();
  await expect(page.getByText(/airbnb\.co\.uk\/h\/eklv/i)).toBeVisible();
  // Save badge text exists
  await expect(page.getByText(/Save 10%|Save \d+%/i).first()).toBeVisible();
});