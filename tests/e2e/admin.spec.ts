import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

test('admin route renders', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'networkidle' });
  const seen = await Promise.any([
    page.getByRole('heading', { name: /login|sign ?in/i }).first().isVisible(),
    page.getByRole('heading', { name: /admin|dashboard|analytics|content/i }).first().isVisible()
  ]).catch(() => false);
  expect(seen).toBeTruthy();
});

test.describe('admin with creds', () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'ADMIN_EMAIL/ADMIN_PASSWORD not provided');

  test('login and navigate', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' });
    const email = page.getByLabel(/email/i).first().or(page.getByPlaceholder(/email/i));
    const pass = page.getByLabel(/password/i).first().or(page.getByPlaceholder(/password/i));
    await email.fill(ADMIN_EMAIL);
    await pass.fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /sign ?in|log ?in|continue/i }).first().click();
    await expect(page).toHaveURL(/\/admin(\/dashboard)?/);

    // Try a few admin areas
    const targets = [/gallery/i, /content/i, /bookings/i, /messages/i];
    for (const t of targets) {
      const link = page.getByRole('link', { name: t }).first();
      if (await link.isVisible().catch(() => false)) {
        await link.click();
        await expect(page).toHaveURL(/\/admin\/(gallery|content|bookings|messages)/);
        break;
      }
    }
  });
});