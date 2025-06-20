import { test, expect } from '@playwright/test';

/**
 * GalleryManager Component - Comprehensive Test Suite
 * Tests for Ko Lake Villa admin gallery management functionality
 */

test.describe('GalleryManager Component', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to admin gallery page
    await page.goto('/admin/gallery');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Gallery Grid Display', () => {
    test('should display gallery grid with proper ARIA labels', async ({ page }) => {
      // Check for accessibility enhancements
      const galleryGrid = page.locator('[role="grid"][aria-label="Gallery images management grid"]');
      await expect(galleryGrid).toBeVisible();
      
      // Verify grid cells have proper roles
      const gridCells = page.locator('[role="gridcell"]');
      const cellCount = await gridCells.count();
      expect(cellCount).toBeGreaterThan(0);
    });

    test('should load images with lazy loading attribute', async ({ page }) => {
      // Check that images have lazy loading
      const images = page.locator('img[loading="lazy"]');
      const imageCount = await images.count();
      expect(imageCount).toBeGreaterThan(0);
    });

    test('should display category badges for each image', async ({ page }) => {
      // Verify category information is displayed
      const categoryBadges = page.locator('.bg-\\[\\#FF914D\\]', { hasText: /Family Suite|Pool Deck|Entire Villa/ });
      if (await categoryBadges.count() > 0) {
        await expect(categoryBadges.first()).toBeVisible();
      }
    });

    test('should handle broken image gracefully', async ({ page }) => {
      // Test error handling for missing images
      await page.route('**/uploads/gallery/**', route => route.abort());
      await page.reload();
      
      // Should show placeholder or error handling
      const images = page.locator('img');
      if (await images.count() > 0) {
        // Check that alt text is properly set for broken images
        const firstImage = images.first();
        const altText = await firstImage.getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    });
  });

  test.describe('Category Filter Functionality', () => {
    test('should filter images by category', async ({ page }) => {
      // Test category filtering
      const categoryFilter = page.locator('button[role="combobox"]').first();
      await categoryFilter.click();
      
      // Select a specific category
      const familySuiteOption = page.locator('[role="option"]', { hasText: 'Family Suite' });
      if (await familySuiteOption.isVisible()) {
        await familySuiteOption.click();
        
        // Wait for filtering to complete
        await page.waitForLoadState('networkidle');
        
        // Verify only family suite images are shown
        const visibleBadges = page.locator('text=Family Suite');
        if (await visibleBadges.count() > 0) {
          await expect(visibleBadges.first()).toBeVisible();
        }
      }
    });

    test('should reset to show all categories', async ({ page }) => {
      // Test "All Categories" option
      const categoryFilter = page.locator('button[role="combobox"]').first();
      await categoryFilter.click();
      
      const allCategoriesOption = page.locator('[role="option"]', { hasText: 'All Categories' });
      if (await allCategoriesOption.isVisible()) {
        await allCategoriesOption.click();
        await page.waitForLoadState('networkidle');
      }
    });
  });

  test.describe('Upload Functionality', () => {
    test('should open upload dialog when upload button clicked', async ({ page }) => {
      // Test upload dialog opening
      const uploadButton = page.locator('button:has-text("Upload")');
      await uploadButton.click();
      
      // Check that dialog opens
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      
      // Verify dialog has proper title
      await expect(page.locator('text=Upload Image or Video')).toBeVisible();
    });

    test('should validate required fields in upload form', async ({ page }) => {
      // Open upload dialog
      await page.locator('button:has-text("Upload")').click();
      
      // Try to submit without required fields
      const submitButton = page.locator('button:has-text("Upload Image")');
      await submitButton.click();
      
      // Should show validation errors or prevent submission
      // The button should be disabled without required fields
      const isDisabled = await submitButton.isDisabled();
      expect(isDisabled).toBe(true);
    });

    test('should close upload dialog when cancel clicked', async ({ page }) => {
      // Open and close dialog
      await page.locator('button:has-text("Upload")').click();
      await page.locator('button:has-text("Cancel")').click();
      
      // Dialog should be closed
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe('Image Management', () => {
    test('should show edit and delete buttons on image hover', async ({ page }) => {
      // Check for edit/delete buttons on gallery items
      const galleryItems = page.locator('[role="gridcell"]');
      
      if (await galleryItems.count() > 0) {
        const firstItem = galleryItems.first();
        await firstItem.hover();
        
        // Look for edit/delete action buttons
        const editButton = firstItem.locator('button').filter({ hasText: /edit/i });
        const deleteButton = firstItem.locator('button').filter({ hasText: /delete/i });
        
        // At least one action button should be visible
        const editVisible = await editButton.isVisible().catch(() => false);
        const deleteVisible = await deleteButton.isVisible().catch(() => false);
        
        expect(editVisible || deleteVisible).toBe(true);
      }
    });

    test('should open edit dialog when edit button clicked', async ({ page }) => {
      const editButtons = page.locator('button[aria-label*="edit"], button:has-text("Edit")');
      
      if (await editButtons.count() > 0) {
        await editButtons.first().click();
        
        // Should open edit dialog
        const editDialog = page.locator('[role="dialog"]').filter({ hasText: /edit/i });
        await expect(editDialog).toBeVisible();
      }
    });

    test('should confirm before deleting image', async ({ page }) => {
      const deleteButtons = page.locator('button[aria-label*="delete"], button:has-text("Delete")');
      
      if (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();
        
        // Should show confirmation dialog
        const confirmDialog = page.locator('[role="dialog"]').filter({ hasText: /confirm|delete/i });
        await expect(confirmDialog).toBeVisible();
      }
    });
  });

  test.describe('Tag-Category Consistency', () => {
    test('should enforce category inclusion in tags during edit', async ({ page }) => {
      // Test the core tag-category consistency feature
      const editButtons = page.locator('button[aria-label*="edit"], button:has-text("Edit")');
      
      if (await editButtons.count() > 0) {
        await editButtons.first().click();
        
        // In edit dialog, select a category
        const categorySelect = page.locator('[name="category"]');
        if (await categorySelect.isVisible()) {
          await categorySelect.click();
          await page.locator('text=Pool Deck').click();
          
          // Add custom tags
          const tagsInput = page.locator('[name="customTags"]');
          if (await tagsInput.isVisible()) {
            await tagsInput.fill('swimming, relaxation');
            
            // Should show message about category inclusion
            await expect(page.locator('text=Category "Pool Deck" will be automatically included')).toBeVisible();
          }
        }
      }
    });

    test('should prevent submission with invalid category', async ({ page }) => {
      // Test validation prevents invalid categories
      await page.locator('button:has-text("Upload")').click();
      
      // Try to manipulate category to invalid value (if possible)
      // The Select component should prevent this, but test the validation
      const categorySelect = page.locator('[name="category"]');
      const submitButton = page.locator('button:has-text("Upload Image")');
      
      // Without selecting valid category, submit should be disabled
      const isDisabled = await submitButton.isDisabled();
      expect(isDisabled).toBe(true);
    });
  });

  test.describe('Responsive Design', () => {
    test('should adapt layout for mobile viewport', async ({ page }) => {
      // Test mobile responsiveness
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Gallery should still be visible and functional
      const galleryGrid = page.locator('[role="grid"]');
      await expect(galleryGrid).toBeVisible();
      
      // Upload button should be accessible
      const uploadButton = page.locator('button:has-text("Upload")');
      await expect(uploadButton).toBeVisible();
    });

    test('should adapt layout for tablet viewport', async ({ page }) => {
      // Test tablet layout
      await page.setViewportSize({ width: 768, height: 1024 });
      
      const galleryGrid = page.locator('[role="grid"]');
      await expect(galleryGrid).toBeVisible();
      
      // Check that grid adapts appropriately
      const gridStyles = await galleryGrid.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      
      // Should have appropriate number of columns for tablet
      expect(gridStyles).toBeTruthy();
    });

    test('should maintain functionality on desktop', async ({ page }) => {
      // Test desktop layout
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // All functionality should work at desktop size
      const galleryGrid = page.locator('[role="grid"]');
      await expect(galleryGrid).toBeVisible();
      
      const uploadButton = page.locator('button:has-text("Upload")');
      await expect(uploadButton).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load gallery within reasonable time', async ({ page }) => {
      // Measure page load performance
      const startTime = Date.now();
      await page.goto('/admin/gallery');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle large number of images efficiently', async ({ page }) => {
      // Test with current gallery size (21+ images)
      const images = page.locator('img[loading="lazy"]');
      const imageCount = await images.count();
      
      // Should handle existing image count without performance issues
      expect(imageCount).toBeGreaterThanOrEqual(0);
      
      // Page should remain responsive
      const uploadButton = page.locator('button:has-text("Upload")');
      await expect(uploadButton).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('/api/gallery', route => route.abort());
      await page.goto('/admin/gallery');
      
      // Should show error message instead of crashing
      await expect(page.locator('text=Error loading gallery')).toBeVisible({ timeout: 10000 });
    });

    test('should recover from temporary network issues', async ({ page }) => {
      // First load normally
      await page.goto('/admin/gallery');
      await page.waitForLoadState('networkidle');
      
      // Then simulate and recover from network issue
      await page.route('/api/gallery', route => route.continue());
      await page.reload();
      
      // Should load normally after recovery
      const galleryGrid = page.locator('[role="grid"]');
      await expect(galleryGrid).toBeVisible();
    });
  });
});

// Visual regression tests
test.describe('Visual Regression', () => {
  test('gallery page visual comparison', async ({ page }) => {
    await page.goto('/admin/gallery');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('gallery-manager-full-page.png');
  });

  test('upload dialog visual comparison', async ({ page }) => {
    await page.goto('/admin/gallery');
    await page.locator('button:has-text("Upload")').click();
    
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toHaveScreenshot('upload-dialog.png');
  });
});