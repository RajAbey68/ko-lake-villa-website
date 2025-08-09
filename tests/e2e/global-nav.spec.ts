import { test, expect } from '@playwright/test';
test('nav works (desktop & mobile)', async ({ page }) => {
  await page.goto('/');
  for (const link of ['Home','Accommodation','Gallery','Contact','Admin']) {
    await expect(page.getByRole('link', { name: link })).toBeVisible();
  }
});