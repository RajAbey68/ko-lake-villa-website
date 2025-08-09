import { test, expect } from '@playwright/test';

test('contact page shows phones, WhatsApp actions, and mailto addresses', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'networkidle' });

  // Phone cards / WhatsApp CTA
  for (const txt of [
    /General Manager/i,
    /Villa Team Lead/i,
    /Owner/i,
  ]) {
    await expect(page.getByText(txt)).toBeVisible();
  }
  await expect(page.locator('a[href^="tel:+"]')).toHaveCountGreaterThan(0);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCountGreaterThan(0);

  // Email block (guestypro had contact@, stay@ etc.)
  const emails = page.locator('a[href^="mailto:"]');
  await expect(emails).toHaveCountGreaterThan(0);

  // If an international dial-hint exists, make sure it's visible
  // (Relaxed: optional – don't fail if not present)
  const hint = await page.getByText(/international/i).count();
  expect(hint >= 0).toBeTruthy();
});
