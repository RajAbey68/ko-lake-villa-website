import { test, expect } from '@playwright/test';


test('A/B Test: Category Filter Button Functionality', async ({ page }) => {
  await page.goto('/admin/gallery');
  const categoryButton = page.locator('button', { hasText: 'Family Suite' });
  await categoryButton.click();
  const images = page.locator('.gallery-image');
  await expect(images).toHaveCountGreaterThan(0);
});



test('A/B Test: Video Support in Gallery', async ({ page }) => {
  await page.goto('/admin/gallery');
  const videoElements = await page.locator('video');
  await expect(videoElements.first()).toBeVisible();
});



test('A/B Test: AI Suggestion Button Visibility', async ({ page }) => {
  await page.goto('/admin/gallery');
  const aiButton = page.locator('button', { hasText: 'Suggest Tags' });
  await expect(aiButton).toBeVisible();
});



test('A/B Test: Display Message for Empty Category Filter', async ({ page }) => {
  await page.goto('/admin/gallery');
  await page.click('button', { hasText: 'Events' }); // Assuming no media in this category
  const message = page.locator('text=No items found');
  await expect(message).toBeVisible();
});



test('A/B Test: Editable Tag Input', async ({ page }) => {
  await page.goto('/admin/gallery');
  await page.click('button', { hasText: 'Edit' });
  const tagInput = page.locator('input[placeholder="Additional Tags"]');
  await tagInput.fill('new-tag');
  await expect(tagInput).toHaveValue('new-tag');
});


