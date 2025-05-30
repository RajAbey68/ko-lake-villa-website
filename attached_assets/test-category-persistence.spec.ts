
import { test, expect } from '@playwright/test';

test('TC011 - Category Persistence After Save', async ({ page }) => {
  // Step 1: Login
  await page.goto('https://skill-bridge-rajabey68.replit.app/admin/login');
  await page.fill('input[name="email"]', 'rajiv.abey@gmail.com');
  await page.fill('input[name="password"]', 'admin456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/dashboard');

  // Step 2: Go to Gallery
  await page.goto('https://skill-bridge-rajabey68.replit.app/admin/gallery');

  // Step 3: Click Edit on the first image
  const firstEditButton = page.locator('button[aria-label="Edit Image"]').first();
  await firstEditButton.click();

  // Step 4: Change category
  const categorySelect = page.locator('select[name="category"]');
  await categorySelect.selectOption('pool-deck');

  // Step 5: Click Save
  await page.click('button:text("Save Tags")');

  // Step 6: Reload the page
  await page.reload();

  // Step 7: Confirm new category remains set
  const newCategory = await page.locator('select[name="category"]').inputValue();
  expect(newCategory).toBe('pool-deck');
});
