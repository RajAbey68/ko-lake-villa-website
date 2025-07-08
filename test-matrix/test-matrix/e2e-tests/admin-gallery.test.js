
// Ko Lake Villa - Admin Gallery E2E Tests
const { test, expect } = require('@playwright/test');

test.describe('Admin Gallery Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login');
    await page.fill('[data-testid="email"]', 'admin@kolakevilla.com');
    await page.fill('[data-testid="password"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('Upload single image with auto-categorization', async ({ page }) => {
    await page.goto('/admin/gallery');
    
    // Click upload button
    await page.click('[data-testid="upload-image-btn"]');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/bedroom-sample.jpg');
    
    // Wait for AI categorization
    await expect(page.locator('[data-testid="ai-category-loading"]')).toBeVisible();
    await expect(page.locator('[data-testid="ai-category-loading"]')).not.toBeVisible({ timeout: 10000 });
    
    // Verify auto-categorization
    const categorySelect = page.locator('[data-testid="image-category"]');
    await expect(categorySelect).toHaveValue('bedrooms');
    
    // Add description
    await page.fill('[data-testid="image-description"]', 'Master bedroom with ocean view');
    
    // Save image
    await page.click('[data-testid="save-image"]');
    
    // Verify success
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible();
    await expect(page.locator('text=Master bedroom with ocean view')).toBeVisible();
  });

  test('Bulk upload multiple images', async ({ page }) => {
    await page.goto('/admin/gallery');
    
    // Click bulk upload
    await page.click('[data-testid="bulk-upload-btn"]');
    
    // Select multiple files
    const fileInput = page.locator('input[type="file"][multiple]');
    await fileInput.setInputFiles([
      './test-assets/kitchen-1.jpg',
      './test-assets/kitchen-2.jpg',
      './test-assets/bathroom-1.jpg'
    ]);
    
    // Wait for all uploads to process
    await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible();
    await expect(page.locator('[data-testid="upload-complete"]')).toBeVisible({ timeout: 30000 });
    
    // Verify all images are categorized
    const imageCards = page.locator('[data-testid="image-card"]');
    await expect(imageCards).toHaveCount(3);
    
    // Check categories were assigned
    const kitchenImages = page.locator('[data-category="kitchen"]');
    const bathroomImages = page.locator('[data-category="bathrooms"]');
    
    await expect(kitchenImages).toHaveCount(2);
    await expect(bathroomImages).toHaveCount(1);
  });

  test('Edit image category and description', async ({ page }) => {
    await page.goto('/admin/gallery');
    
    // Find first image and click edit
    await page.click('[data-testid="image-card"]:first-child [data-testid="edit-btn"]');
    
    // Change category
    await page.selectOption('[data-testid="image-category"]', 'outdoor-spaces');
    
    // Update description
    await page.fill('[data-testid="image-description"]', 'Beautiful garden terrace');
    
    // Save changes
    await page.click('[data-testid="save-changes"]');
    
    // Verify changes
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    await expect(page.locator('text=Beautiful garden terrace')).toBeVisible();
    
    // Refresh and verify persistence
    await page.reload();
    await expect(page.locator('text=Beautiful garden terrace')).toBeVisible();
  });

  test('Delete image with confirmation', async ({ page }) => {
    await page.goto('/admin/gallery');
    
    // Count initial images
    const initialCount = await page.locator('[data-testid="image-card"]').count();
    
    // Click delete on first image
    await page.click('[data-testid="image-card"]:first-child [data-testid="delete-btn"]');
    
    // Confirm deletion
    await expect(page.locator('[data-testid="delete-confirmation"]')).toBeVisible();
    await page.click('[data-testid="confirm-delete"]');
    
    // Verify deletion
    await expect(page.locator('[data-testid="delete-success"]')).toBeVisible();
    
    // Check image count decreased
    const finalCount = await page.locator('[data-testid="image-card"]').count();
    expect(finalCount).toBe(initialCount - 1);
  });

  test('Filter images by category', async ({ page }) => {
    await page.goto('/admin/gallery');
    
    // Select bedrooms filter
    await page.click('[data-testid="filter-bedrooms"]');
    
    // Verify only bedroom images are shown
    const visibleImages = page.locator('[data-testid="image-card"]:visible');
    const imageCount = await visibleImages.count();
    
    for (let i = 0; i < imageCount; i++) {
      const category = await visibleImages.nth(i).getAttribute('data-category');
      expect(category).toBe('bedrooms');
    }
    
    // Clear filter
    await page.click('[data-testid="clear-filters"]');
    
    // Verify all images are shown again
    const allImages = page.locator('[data-testid="image-card"]:visible');
    const totalCount = await allImages.count();
    expect(totalCount).toBeGreaterThan(imageCount);
  });

  test('Export gallery to zip', async ({ page }) => {
    await page.goto('/admin/export');
    
    // Select categories to export
    await page.check('[data-testid="category-bedrooms"]');
    await page.check('[data-testid="category-bathrooms"]');
    
    // Start export
    await page.click('[data-testid="start-export"]');
    
    // Wait for export completion
    await expect(page.locator('[data-testid="export-progress"]')).toBeVisible();
    await expect(page.locator('[data-testid="export-complete"]')).toBeVisible({ timeout: 60000 });
    
    // Download should trigger automatically
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="download-zip"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('kolakehouse-media-export');
  });

  test('Search images by description', async ({ page }) => {
    await page.goto('/admin/gallery');
    
    // Search for specific term
    await page.fill('[data-testid="search-input"]', 'ocean view');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // Verify search results
    const searchResults = page.locator('[data-testid="image-card"]:visible');
    const resultCount = await searchResults.count();
    
    // Check that results contain search term
    for (let i = 0; i < resultCount; i++) {
      const description = await searchResults.nth(i).locator('[data-testid="image-description"]').textContent();
      expect(description.toLowerCase()).toContain('ocean view');
    }
  });
});

test.describe('Gallery Performance Tests', () => {
  test('Large gallery loading performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/admin/gallery');
    
    // Wait for all images to load
    await expect(page.locator('[data-testid="gallery-loaded"]')).toBeVisible({ timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    // Assert load time is reasonable (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);
  });

  test('Image upload performance', async ({ page }) => {
    await page.goto('/admin/gallery');
    
    const startTime = Date.now();
    
    // Upload a large image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/high-res-image.jpg');
    
    // Wait for processing completion
    await expect(page.locator('[data-testid="upload-complete"]')).toBeVisible({ timeout: 15000 });
    
    const processTime = Date.now() - startTime;
    
    // Assert processing time is reasonable (under 10 seconds)
    expect(processTime).toBeLessThan(10000);
  });
});
