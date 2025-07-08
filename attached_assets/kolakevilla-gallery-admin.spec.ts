
import { test, expect } from '@playwright/test';

test.describe('Ko Lake Villa Gallery Admin Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://your-dev-url.com/admin/login');
    await page.fill('input[type="email"]', 'kolakevilla@gmail.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/admin/dashboard');
  });

  test('TC001: Upload Modal Opens Correctly', async ({ page }) => {
    await page.goto('https://your-dev-url.com/admin/gallery');
    await page.click('button:has-text("Upload Image")');
    await expect(page.locator('form')).toBeVisible();
  });

  test('TC002: Image Upload Workflow with Category and Tags', async ({ page }) => {
    await page.goto('https://your-dev-url.com/admin/gallery');
    await page.click('button:has-text("Upload Image")');
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('input[type="file"]'),
    ]);
    await fileChooser.setFiles('tests/test-assets/villa.jpg');
    await page.selectOption('select[name="category"]', 'family-suite');
    await page.fill('input[name="alt"]', 'Beautiful family suite');
    await page.fill('textarea[name="description"]', 'Lake-facing room with 2 beds');
    await page.click('button:has-text("Upload")');
    await expect(page.locator('text=Upload complete')).toBeVisible();
  });

  test('TC003: Gallery Image Modal Displays on Click', async ({ page }) => {
    await page.goto('https://your-dev-url.com/gallery');
    await page.click('img.gallery-thumb >> nth=0');
    await expect(page.locator('.modal img')).toBeVisible();
  });

  test('TC004: Left and Right Navigation Arrows Work in Gallery', async ({ page }) => {
    await page.goto('https://your-dev-url.com/gallery');
    await page.click('img.gallery-thumb >> nth=0');
    await expect(page.locator('.modal')).toBeVisible();
    await page.click('button.left-arrow');
    await page.click('button.right-arrow');
    await expect(page.locator('.modal img')).toBeVisible();
  });

  test('TC005: Video Plays in Modal', async ({ page }) => {
    await page.goto('https://your-dev-url.com/gallery');
    await page.click('video.gallery-thumb >> nth=0');
    const video = page.locator('.modal video');
    await expect(video).toBeVisible();
    await video.evaluate(node => node.play());
    await expect(video).toHaveJSProperty('paused', false);
  });

});
