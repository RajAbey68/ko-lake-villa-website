import { test, expect } from '@playwright/test';
test('booking form fields & sidebar', async ({ page }) => {
  await page.goto('/booking');
  for (const lbl of ['Full Name','Email Address','Phone Number','Check-in Date','Check-out Date','Room Type','Number of Guests']) {
    await expect(page.getByText(new RegExp(lbl))).toBeVisible();
  }
  await expect(page.getByRole('button', { name:/Submit Booking Request/i })).toBeVisible();
  for (const s of ['Call','WhatsApp','Email','Chat on WhatsApp','Save 10-15%','Personal Service','Flexible Terms','Best Rate Guarantee']) {
    await expect(page.getByText(new RegExp(s))).toBeVisible();
  }
});