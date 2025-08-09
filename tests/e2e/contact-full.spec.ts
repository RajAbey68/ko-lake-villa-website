import { test, expect } from '@playwright/test';
test('contact cards, WhatsApp & mails', async ({ page }) => {
  await page.goto('/contact');
  for (const t of [
    'General Manager', '\\+94 71 776 5780',
    'Villa Team Lead', '\\+94 77 315 0602',
    'Owner', '\\+94 71 173 0345'
  ]) await expect(page.getByText(new RegExp(t))).toBeVisible();

  await expect(page.locator('a[href^="tel:"]')).toHaveCount(3);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(3);
  for (const m of ['stay@kolakevilla.com','bookings@kolakevilla.com','events@kolakevilla.com','info@kolakevilla.com']) {
    await expect(page.locator(`a[href="mailto:${m}"]`)).toBeVisible();
  }
  await expect(page.getByText(/international/i)).toBeVisible();
});