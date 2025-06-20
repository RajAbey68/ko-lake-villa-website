import { test, expect } from '@playwright/test';

test('TC001 - Open Upload Dialog', async ({ page }) => {
  await page.goto('http://localhost:5000/admin/gallery');
  
  // Debug: Log page content to see actual DOM
  console.log('Page content:', await page.content());
  
  // Check if upload button exists and is clickable
  const uploadButton = page.locator('button:has-text("Upload")');
  await expect(uploadButton).toBeVisible();
  
  // Click the upload button
  await uploadButton.click();
  
  // Verify upload dialog opens
  await expect(page.locator('text=Upload Image or Video')).toBeVisible();
  await expect(page.locator('text=Click to select an image or video')).toBeVisible();
});

test('TC002 - Category Validation Required', async ({ page }) => {
  await page.goto('http://localhost:5000/admin/gallery');
  
  // Open upload dialog
  await page.click('button:has-text("Upload")');
  
  // Try to submit without selecting file or category
  const submitButton = page.locator('button:has-text("Upload Image")');
  await expect(submitButton).toBeDisabled();
});

test('TC003 - Gallery Images Display', async ({ page }) => {
  await page.goto('http://localhost:5000/admin/gallery');
  
  // Check that gallery images are loading
  const galleryGrid = page.locator('[role="grid"]');
  await expect(galleryGrid).toBeVisible();
  
  // Verify images are present
  const images = page.locator('img');
  await expect(images.first()).toBeVisible();
});

test('TC004 - Category Filter Functionality', async ({ page }) => {
  await page.goto('http://localhost:5000/admin/gallery');
  
  // Check category filter dropdown
  const categoryFilter = page.locator('select, [role="combobox"]').first();
  await expect(categoryFilter).toBeVisible();
  
  // Click to open dropdown
  await categoryFilter.click();
  
  // Verify categories are available
  await expect(page.locator('text=Pool Deck')).toBeVisible();
  await expect(page.locator('text=Family Suite')).toBeVisible();
});

test('TC005 - AI Analysis Endpoint Ready', async ({ page }) => {
  // Test that the AI analysis endpoint is available
  const response = await page.request.post('http://localhost:5000/api/analyze-media', {
    data: {}
  });
  
  // Should return 400 (missing file) not 404 (endpoint not found)
  expect(response.status()).toBe(400);
  
  const responseBody = await response.json();
  expect(responseBody.error).toContain('Image file missing');
});

test('TC006 - Tag Category Consistency Display', async ({ page }) => {
  await page.goto('http://localhost:5000/admin/gallery');
  
  // Check that the tag-category hint is displayed
  await expect(page.locator('text=Tag-Category Consistency')).toBeVisible();
  await expect(page.locator('text=automatically generated')).toBeVisible();
});

test('TC007 - Performance Test', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('http://localhost:5000/admin/gallery');
  
  // Wait for gallery to load
  await page.waitForSelector('[role="grid"]');
  
  const loadTime = Date.now() - startTime;
  
  // Should load within 3 seconds
  expect(loadTime).toBeLessThan(3000);
});

test('TC008 - Mobile Responsive Layout', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('http://localhost:5000/admin/gallery');
  
  // Check that upload button is still visible on mobile
  const uploadButton = page.locator('button:has-text("Upload")');
  await expect(uploadButton).toBeVisible();
  
  // Check that gallery grid adapts to mobile
  const galleryGrid = page.locator('[role="grid"]');
  await expect(galleryGrid).toBeVisible();
});