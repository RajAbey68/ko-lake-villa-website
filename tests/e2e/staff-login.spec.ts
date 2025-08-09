import { test, expect } from '@playwright/test';

test('Staff Login link routes to /admin/login', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: /Staff Login/i });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('heading', { name: /Staff Login/i })).toBeVisible();
});