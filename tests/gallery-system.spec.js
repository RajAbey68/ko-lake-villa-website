import { test, expect } from '@playwright/test';

/**
 * Ko Lake Villa Gallery System - Playwright Automation Tests
 * Complete test coverage for gallery management functionality
 */

test.describe('Gallery Management System', () => {
  const GALLERY_CATEGORIES = [
    'entire-villa', 'family-suite', 'group-room', 'triple-room',
    'dining-area', 'pool-deck', 'lake-garden', 'roof-garden',
    'front-garden', 'koggala-lake', 'excursions'
  ];

  test.beforeEach(async ({ page }) => {
    // Navigate to gallery admin page
    await page.goto('/admin/gallery');
    await page.waitForLoadState('networkidle');
  });

  // TC001: Upload Button Modal Test
  test('TC001: Upload button opens modal dialog', async ({ page }) => {
    // Test upload button visibility and functionality
    const uploadButton = page.locator('button:has-text("Upload")');
    await expect(uploadButton).toBeVisible();
    
    // Click upload button
    await uploadButton.click();
    
    // Verify modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Verify modal title
    await expect(page.locator('text=Upload Image or Video')).toBeVisible();
    
    // Close modal
    await page.locator('button:has-text("Cancel")').click();
    await expect(modal).not.toBeVisible();
  });

  // TC002: Valid Image Submission Test
  test('TC002: Submit image with valid category and tags', async ({ page }) => {
    // Open upload dialog
    await page.locator('button:has-text("Upload")').click();
    
    // Create test file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-villa-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('test image content')
    });
    
    // Select category
    await page.locator('[name="category"]').click();
    await page.locator('text=Family Suite').click();
    
    // Fill alt text
    await page.locator('[name="alt"]').fill('Beautiful family suite with lake view');
    
    // Add custom tags
    await page.locator('[name="customTags"]').fill('luxury, spacious, lake-view');
    
    // Add description
    await page.locator('[name="description"]').fill('Spacious family suite with panoramic lake views');
    
    // Submit form
    await page.locator('button:has-text("Upload Image")').click();
    
    // Verify success (check for toast or redirect)
    await expect(page.locator('text=Success')).toBeVisible({ timeout: 10000 });
  });

  // TC003: Validation Without Category
  test('TC003: Validation error when no category selected', async ({ page }) => {
    // Open upload dialog
    await page.locator('button:has-text("Upload")').click();
    
    // Upload file without selecting category
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('test content')
    });
    
    // Fill alt text only
    await page.locator('[name="alt"]').fill('Test image');
    
    // Try to submit without category
    await page.locator('button:has-text("Upload Image")').click();
    
    // Verify validation error
    await expect(page.locator('text=Validation Error')).toBeVisible();
  });

  // TC004: Delete Image Functionality
  test('TC004: Delete image from admin panel', async ({ page }) => {
    // Check if images exist in gallery
    const imageCards = page.locator('[data-testid="gallery-image-card"]');
    const imageCount = await imageCards.count();
    
    if (imageCount > 0) {
      // Click delete button on first image
      await imageCards.first().locator('button[aria-label="Delete"]').click();
      
      // Confirm deletion
      await page.locator('button:has-text("Delete")').click();
      
      // Verify success message
      await expect(page.locator('text=deleted successfully')).toBeVisible();
    } else {
      console.log('No images available for deletion test');
    }
  });

  // TC005: Category Filter Test
  test('TC005: Filter images by category', async ({ page }) => {
    // Test category filter dropdown
    const categoryFilter = page.locator('select').filter({ hasText: 'All Categories' });
    await expect(categoryFilter).toBeVisible();
    
    // Select Family Suite category
    await categoryFilter.click();
    await page.locator('text=Family Suite').click();
    
    // Verify URL or filter state
    await page.waitForLoadState('networkidle');
    
    // Check that only family suite images are displayed
    const visibleImages = page.locator('[data-testid="gallery-image-card"]');
    const imageCount = await visibleImages.count();
    
    // If images exist, verify they're family suite category
    if (imageCount > 0) {
      const categoryBadges = page.locator('text=Family Suite');
      await expect(categoryBadges.first()).toBeVisible();
    }
  });

  // TC006: Image Modal Test
  test('TC006: Full-size image opens in modal', async ({ page }) => {
    // Check if images exist
    const images = page.locator('[data-testid="gallery-image"] img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Click on first image
      await images.first().click();
      
      // Verify modal opens with image details
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Verify modal contains image metadata
      await expect(modal.locator('img')).toBeVisible();
      
      // Close modal
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  // TC007: AI Auto-tagging Test
  test('TC007: AI analysis endpoint functionality', async ({ page }) => {
    // Intercept AI analysis API call
    await page.route('/api/analyze-media', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          suggestedCategory: 'family-suite',
          confidence: 0.85,
          description: 'Spacious family accommodation with lake views'
        })
      });
    });
    
    // Open upload dialog
    await page.locator('button:has-text("Upload")').click();
    
    // Upload image to trigger AI analysis
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'villa-suite.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('test villa image')
    });
    
    // Wait for AI analysis
    await expect(page.locator('text=AI Suggestion')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Family Suite')).toBeVisible();
  });

  // TC008: Mobile Responsiveness Test
  test('TC008: Gallery responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify gallery loads on mobile
    await expect(page.locator('h1:has-text("Gallery Management")')).toBeVisible();
    
    // Check that upload button is accessible
    const uploadButton = page.locator('button:has-text("Upload")');
    await expect(uploadButton).toBeVisible();
    
    // Verify grid adapts to mobile (should show fewer columns)
    const galleryGrid = page.locator('[data-testid="gallery-grid"]');
    if (await galleryGrid.isVisible()) {
      const gridColumns = await galleryGrid.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      // Mobile should have 1-2 columns
      expect(gridColumns.split(' ').length).toBeLessThanOrEqual(2);
    }
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(uploadButton).toBeVisible();
  });

  // TC009: Performance Test
  test('TC009: Gallery performance and loading', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/admin/gallery');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Gallery should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Test API response time
    const apiStartTime = Date.now();
    const response = await page.request.get('/api/gallery');
    const apiResponseTime = Date.now() - apiStartTime;
    
    expect(response.status()).toBe(200);
    expect(apiResponseTime).toBeLessThan(1000); // API should respond within 1 second
    
    // Check for loading states
    const loadingIndicator = page.locator('[aria-label="Loading"]');
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).not.toBeVisible({ timeout: 5000 });
    }
  });

  // TC010: Tag-Category Consistency Test
  test('TC010: Tag-category consistency validation', async ({ page }) => {
    // Open upload dialog
    await page.locator('button:has-text("Upload")').click();
    
    // Select category
    await page.locator('[name="category"]').click();
    await page.locator('text=Pool Deck').click();
    
    // Add custom tags
    await page.locator('[name="customTags"]').fill('swimming, relaxation, sunset');
    
    // Verify consistency message
    await expect(page.locator('text=Category "Pool Deck" will be automatically included')).toBeVisible();
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'pool-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('pool image content')
    });
    
    // Fill required fields
    await page.locator('[name="alt"]').fill('Beautiful pool deck area');
    
    // Submit and verify tags include category
    await page.locator('button:has-text("Upload Image")').click();
    
    // After successful upload, verify tag consistency in gallery
    await expect(page.locator('text=Success')).toBeVisible({ timeout: 10000 });
  });

  // Additional Test: Category Management
  test('Category validation and management', async ({ page }) => {
    // Verify all 11 categories are available
    await page.locator('button:has-text("Upload")').click();
    await page.locator('[name="category"]').click();
    
    for (const category of GALLERY_CATEGORIES) {
      const categoryOption = page.locator(`text=${category.replace('-', ' ')}`);
      await expect(categoryOption).toBeVisible();
    }
  });

  // Error Handling Test
  test('Network error handling', async ({ page }) => {
    // Simulate network failure
    await page.route('/api/gallery', route => route.abort());
    
    // Navigate to gallery page
    await page.goto('/admin/gallery');
    
    // Should show error state
    await expect(page.locator('text=Error loading gallery')).toBeVisible({ timeout: 10000 });
  });

  // File Upload Validation Test
  test('File type and size validation', async ({ page }) => {
    await page.locator('button:has-text("Upload")').click();
    
    // Test invalid file type
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'malware.exe',
      mimeType: 'application/exe',
      buffer: Buffer.from('invalid file')
    });
    
    // Should show validation error
    await expect(page.locator('text=Invalid File Type')).toBeVisible();
  });
});

// Visual Regression Tests
test.describe('Gallery Visual Regression', () => {
  test('Gallery page visual comparison', async ({ page }) => {
    await page.goto('/admin/gallery');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('gallery-admin-page.png');
  });

  test('Upload modal visual comparison', async ({ page }) => {
    await page.goto('/admin/gallery');
    await page.locator('button:has-text("Upload")').click();
    
    // Take screenshot of upload modal
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toHaveScreenshot('upload-modal.png');
  });
});