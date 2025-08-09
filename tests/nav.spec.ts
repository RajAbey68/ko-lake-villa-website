import { test, expect } from '@playwright/test';

const routes = [
  { name: 'Home', href: '/' },
  { name: 'Accommodation', href: '/accommodation' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

test.describe('Top navigation', () => {
  for (const r of routes) {
    test(`go to ${r.href}`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: new RegExp(`^${r.name}$`, 'i') }).click();
      await expect(page).toHaveURL(new RegExp(`${r.href}$`));
    });
  }
});

test('mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button').first().click();
  await page.getByRole('link', { name: /Gallery/i }).click();
  await expect(page).toHaveURL(/\/gallery$/);
});