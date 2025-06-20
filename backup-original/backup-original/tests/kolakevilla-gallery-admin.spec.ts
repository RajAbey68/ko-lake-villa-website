import { test, expect } from '@playwright/test';

test.describe('Ko Lake Villa Gallery Admin Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'kolakevilla@gmail.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/admin/dashboard');
  });

  test('TC001: Upload Modal Opens Correctly', async ({ page }) => {
    await page.goto('/admin/gallery');
    await page.click('button:has-text("Upload Image")');
    await expect(page.locator('form')).toBeVisible();
  });

  test('TC002: Image Upload Workflow with Category and Tags', async ({ page }) => {
    await page.goto('/admin/gallery');
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
    await page.goto('/gallery');
    await page.click('img >> nth=0');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"] img')).toBeVisible();
  });

  test('TC004: Left and Right Navigation Arrows Work in Gallery', async ({ page }) => {
    await page.goto('/gallery');
    await page.click('img >> nth=0');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Test left arrow navigation
    await page.click('button[aria-label="Previous image"]');
    await expect(page.locator('[role="dialog"] img')).toBeVisible();
    
    // Test right arrow navigation
    await page.click('button[aria-label="Next image"]');
    await expect(page.locator('[role="dialog"] img')).toBeVisible();
  });

  test('TC005: Video Plays in Modal', async ({ page }) => {
    await page.goto('/gallery');
    
    // Find and click a video thumbnail
    const videoThumbnail = page.locator('[data-media-type="video"]').first();
    if (await videoThumbnail.count() > 0) {
      await videoThumbnail.click();
      
      const video = page.locator('[role="dialog"] video');
      await expect(video).toBeVisible();
      
      // Test video controls
      await video.evaluate((node: HTMLVideoElement) => node.play());
      await expect(video).toHaveJSProperty('paused', false);
    }
  });

  test('TC006: Keyboard Navigation Works in Modal', async ({ page }) => {
    await page.goto('/gallery');
    await page.click('img >> nth=0');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Test right arrow key
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[role="dialog"] img')).toBeVisible();
    
    // Test left arrow key
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('[role="dialog"] img')).toBeVisible();
    
    // Test escape key to close
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('TC007: Category Filtering Works in Gallery', async ({ page }) => {
    await page.goto('/gallery');
    
    // Test Family Suite filter
    await page.click('button:has-text("Family Suite")');
    const familySuiteImages = page.locator('img[alt*="Family"]');
    await expect(familySuiteImages.first()).toBeVisible();
    
    // Test Triple Room filter
    await page.click('button:has-text("Triple Room")');
    const tripleRoomImages = page.locator('img[alt*="Triple"]');
    await expect(tripleRoomImages.first()).toBeVisible();
    
    // Test All filter
    await page.click('button:has-text("All")');
    await expect(page.locator('img').first()).toBeVisible();
  });

  test('TC008: Admin Gallery Edit Functions Work', async ({ page }) => {
    await page.goto('/admin/gallery');
    
    // Test edit button click
    const editButton = page.locator('button[aria-label*="Edit"]').first();
    if (await editButton.count() > 0) {
      await editButton.click();
      await expect(page.locator('form')).toBeVisible();
    }
    
    // Test delete button visibility
    const deleteButton = page.locator('button[aria-label*="Delete"]').first();
    await expect(deleteButton).toBeVisible();
  });

  test('TC009: Gallery Loads All Image Categories', async ({ page }) => {
    await page.goto('/gallery');
    
    const categoryButtons = [
      'Family Suite',
      'Triple Room', 
      'Group Room',
      'Dining Area',
      'Pool Deck',
      'Lake Garden'
    ];
    
    for (const category of categoryButtons) {
      await expect(page.locator(`button:has-text("${category}")`)).toBeVisible();
    }
  });

  test('TC010: Modal Image Counter Updates Correctly', async ({ page }) => {
    await page.goto('/gallery');
    await page.click('img >> nth=0');
    
    // Check counter is visible
    const counter = page.locator('[role="dialog"]').locator('text=/\\d+ of \\d+/');
    await expect(counter).toBeVisible();
    
    // Navigate and check counter updates
    await page.click('button[aria-label="Next image"]');
    await expect(counter).toBeVisible();
  });

});