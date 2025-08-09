import { test, expect } from '@playwright/test';

test('booking page has all GuestyPro fields and CTAs', async ({ page }) => {
  await page.goto('/booking', { waitUntil: 'networkidle' });

  // Core fields
  await expect(page.getByLabel(/Full Name/i)).toBeVisible();
  await expect(page.getByLabel(/Email Address/i)).toBeVisible();
  await expect(page.getByLabel(/Phone Number/i)).toBeVisible();
  await expect(page.getByLabel(/Check-in Date/i)).toBeVisible();
  await expect(page.getByLabel(/Check-out Date/i)).toBeVisible();
  await expect(page.getByLabel(/Room Type/i)).toBeVisible();
  await expect(page.getByLabel(/Number of Guests/i)).toBeVisible();

  // Submit & WhatsApp
  await expect(page.getByRole('button', { name: /Submit Booking Request/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Chat on WhatsApp/i })).toBeVisible();

  // "Why book direct" block (was in GuestyPro)
  for (const bullet of [/Save 10-15%/i, /Personal Service/i, /Flexible Terms/i, /Best Rate Guarantee/i]) {
    await expect(page.getByText(bullet)).toBeVisible();
  }
});
