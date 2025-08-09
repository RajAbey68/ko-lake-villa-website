import { test, expect } from '@playwright/test';

test('home hero shows CTA card and video/gif panel', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Ko Lake Villa/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /View Rooms & Rates/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Explore Gallery/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Book Direct/i })).toBeVisible();

  // Right panel: either <video> or GIF fallback
  const video = page.locator('video');
  const gif = page.locator('img[alt="Yoga Sala"]');
  await expect(video.or(gif)).toBeVisible();
});