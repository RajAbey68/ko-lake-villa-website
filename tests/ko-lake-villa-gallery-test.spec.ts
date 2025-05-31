import { test, expect } from '@playwright/test';

test('Gallery image upload and category-tag consistency', async ({ page }) => {
  // Navigate to login
  await page.goto('/admin/login');
  await page.fill('input[name="email"]', 'rajiv.abey@gmail.com');
  await page.fill('input[name="password"]', 'admin456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/dashboard');

  // Go to gallery admin
  await page.goto('/admin/gallery');

  // Open upload dialog
  await page.click('text=Upload Media');
  await page.setInputFiles('input[type="file"]', 'tests/sample/test-room.jpg');

  // Fill metadata
  await page.selectOption('select[name="category"]', 'family-suite');
  await page.fill('input[name="alt"]', 'Test Room Alt');
  await page.fill('textarea[name="description"]', 'Test room description.');
  await page.fill('input[name="tags"]', 'lake,view');

  // Submit form
  await page.click('button:text("Save Tags")');

  // Wait for refresh and check if image appears
  await page.waitForTimeout(2000);
  const newCard = await page.locator('text=Test Room Alt').first();
  await expect(newCard).toBeVisible();

  // Check category and tags consistency
  const tag = await page.locator('text=#family-suite').first();
  await expect(tag).toBeVisible();
});