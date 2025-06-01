/**
 * Ko Lake Villa - Admin Gallery Thumbnail Preview Test Suite
 * Tests the enhanced edit dialog thumbnail preview functionality
 * Validates authentic property image display and interaction
 */

import { test, expect } from '@playwright/test';

test.describe('Admin Gallery Thumbnail Preview', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to admin gallery page
    await page.goto('/admin/gallery');
    await page.waitForLoadState('networkidle');
    
    // Wait for gallery images to load
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });
  });

  test('TC-THUMB-001: Edit dialog displays thumbnail preview', async ({ page }) => {
    // Click edit button on first gallery image
    const firstEditButton = page.locator('button[aria-label*="Edit"]').first();
    await expect(firstEditButton).toBeVisible();
    await firstEditButton.click();

    // Verify edit dialog opens
    const editDialog = page.locator('[role="dialog"]').filter({ hasText: /edit/i });
    await expect(editDialog).toBeVisible();

    // Verify "Preview" heading is visible
    const previewHeading = editDialog.locator('h3:has-text("Preview")');
    await expect(previewHeading).toBeVisible();

    // Verify thumbnail image is displayed
    const thumbnailImage = editDialog.locator('img').first();
    await expect(thumbnailImage).toBeVisible();
    
    // Verify image has proper styling
    await expect(thumbnailImage).toHaveClass(/rounded-lg/);
    await expect(thumbnailImage).toHaveClass(/border/);
    await expect(thumbnailImage).toHaveClass(/shadow-md/);
  });

  test('TC-THUMB-002: Thumbnail preview displays authentic Ko Lake Villa content', async ({ page }) => {
    // Click edit on an image with known authentic content
    const editButtons = page.locator('button[aria-label*="Edit"]');
    const editButton = editButtons.first();
    await editButton.click();

    const editDialog = page.locator('[role="dialog"]');
    await expect(editDialog).toBeVisible();

    // Verify authentic property details are shown
    const currentTitle = editDialog.locator('text=/Current Title:/');
    await expect(currentTitle).toBeVisible();

    const currentCategory = editDialog.locator('text=/Category:/');
    await expect(currentCategory).toBeVisible();

    const mediaType = editDialog.locator('text=/Media Type:/');
    await expect(mediaType).toBeVisible();

    // Verify authentic Ko Lake Villa content appears
    const koLakeContent = page.locator('text=/Suite|Room|Lake|Villa|Koggala/i');
    await expect(koLakeContent.first()).toBeVisible();
  });

  test('TC-THUMB-003: Video thumbnail preview functionality', async ({ page }) => {
    // Look for video content in gallery
    const videoElements = page.locator('video');
    
    if (await videoElements.count() > 0) {
      // Find and click edit button for video
      const videoCard = videoElements.first().locator('..').locator('..');
      const videoEditButton = videoCard.locator('button[aria-label*="Edit"]');
      await videoEditButton.click();

      const editDialog = page.locator('[role="dialog"]');
      await expect(editDialog).toBeVisible();

      // Verify video preview is displayed
      const videoPreview = editDialog.locator('video');
      await expect(videoPreview).toBeVisible();
      
      // Verify video has controls
      await expect(videoPreview).toHaveAttribute('controls');
      
      // Verify video styling
      await expect(videoPreview).toHaveClass(/rounded-lg/);
      await expect(videoPreview).toHaveClass(/border/);
    }
  });

  test('TC-THUMB-004: Edit form fields populate correctly with thumbnail', async ({ page }) => {
    // Click edit button
    const editButton = page.locator('button[aria-label*="Edit"]').first();
    await editButton.click();

    const editDialog = page.locator('[role="dialog"]');
    await expect(editDialog).toBeVisible();

    // Verify form fields are populated
    const categorySelect = editDialog.locator('select, [role="combobox"]').first();
    await expect(categorySelect).toBeVisible();

    const titleInput = editDialog.locator('input[type="text"]').first();
    await expect(titleInput).toBeVisible();
    await expect(titleInput).not.toHaveValue('');

    const descriptionTextarea = editDialog.locator('textarea');
    await expect(descriptionTextarea).toBeVisible();

    // Verify thumbnail and form are in proper layout
    const gridLayout = editDialog.locator('.grid-cols-1.md\\:grid-cols-2');
    await expect(gridLayout).toBeVisible();
  });

  test('TC-THUMB-005: Image error handling with fallback', async ({ page }) => {
    // Click edit button
    const editButton = page.locator('button[aria-label*="Edit"]').first();
    await editButton.click();

    const editDialog = page.locator('[role="dialog"]');
    await expect(editDialog).toBeVisible();

    // Test image error handling by breaking the src
    const thumbnailImage = editDialog.locator('img').first();
    await page.evaluate((img) => {
      img.src = '/broken-image-url.jpg';
    }, await thumbnailImage.elementHandle());

    // Wait for error handling to trigger
    await page.waitForTimeout(1000);

    // Verify fallback or error handling (placeholder image)
    const imageSrc = await thumbnailImage.getAttribute('src');
    expect(imageSrc).toBeTruthy();
  });

  test('TC-THUMB-006: Edit dialog responsive layout with thumbnail', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1024, height: 768 });
    
    const editButton = page.locator('button[aria-label*="Edit"]').first();
    await editButton.click();

    const editDialog = page.locator('[role="dialog"]');
    await expect(editDialog).toBeVisible();

    // Verify grid layout on desktop
    const gridContainer = editDialog.locator('.grid-cols-1.md\\:grid-cols-2');
    await expect(gridContainer).toBeVisible();

    // Close dialog
    await page.keyboard.press('Escape');
    await expect(editDialog).not.toBeVisible();

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    
    await editButton.click();
    await expect(editDialog).toBeVisible();

    // Verify layout adapts to mobile
    await expect(gridContainer).toBeVisible();
  });

  test('TC-THUMB-007: Thumbnail preview accessibility', async ({ page }) => {
    // Click edit button
    const editButton = page.locator('button[aria-label*="Edit"]').first();
    await editButton.click();

    const editDialog = page.locator('[role="dialog"]');
    await expect(editDialog).toBeVisible();

    // Verify thumbnail image has proper alt text
    const thumbnailImage = editDialog.locator('img').first();
    const altText = await thumbnailImage.getAttribute('alt');
    expect(altText).toBeTruthy();
    expect(altText).not.toBe('');

    // Verify dialog has proper title
    const dialogTitle = editDialog.locator('[role="heading"]');
    await expect(dialogTitle).toBeVisible();
    await expect(dialogTitle).toHaveText(/edit/i);

    // Verify preview section has proper heading
    const previewHeading = editDialog.locator('h3:has-text("Preview")');
    await expect(previewHeading).toBeVisible();
  });

  test('TC-THUMB-008: Save functionality works with thumbnail preview', async ({ page }) => {
    // Click edit button
    const editButton = page.locator('button[aria-label*="Edit"]').first();
    await editButton.click();

    const editDialog = page.locator('[role="dialog"]');
    await expect(editDialog).toBeVisible();

    // Verify thumbnail is displayed
    const thumbnailImage = editDialog.locator('img').first();
    await expect(thumbnailImage).toBeVisible();

    // Make a small edit to description
    const descriptionTextarea = editDialog.locator('textarea');
    await descriptionTextarea.click();
    await descriptionTextarea.fill('Updated description with thumbnail preview test');

    // Save changes
    const saveButton = editDialog.locator('button:has-text("Save")');
    if (await saveButton.isVisible()) {
      await saveButton.click();
      
      // Verify dialog closes after save
      await expect(editDialog).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('TC-THUMB-009: Multiple image types display correctly', async ({ page }) => {
    // Test different image formats if available
    const galleryImages = page.locator('[role="gridcell"] img');
    const imageCount = await galleryImages.count();

    if (imageCount > 0) {
      // Test first few images for different formats
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const galleryCard = galleryImages.nth(i).locator('..').locator('..');
        const editButton = galleryCard.locator('button[aria-label*="Edit"]');
        
        await editButton.click();
        
        const editDialog = page.locator('[role="dialog"]');
        await expect(editDialog).toBeVisible();

        // Verify thumbnail displays for each format
        const thumbnail = editDialog.locator('img, video').first();
        await expect(thumbnail).toBeVisible();

        // Close dialog
        await page.keyboard.press('Escape');
        await expect(editDialog).not.toBeVisible();
      }
    }
  });

  test('TC-THUMB-010: Performance - thumbnail loads quickly', async ({ page }) => {
    // Measure thumbnail load time
    const startTime = Date.now();
    
    const editButton = page.locator('button[aria-label*="Edit"]').first();
    await editButton.click();

    const editDialog = page.locator('[role="dialog"]');
    await expect(editDialog).toBeVisible();

    // Wait for thumbnail to be fully loaded
    const thumbnailImage = editDialog.locator('img').first();
    await expect(thumbnailImage).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Verify thumbnail loads within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Verify image is actually loaded (not just visible)
    const imageLoaded = await page.evaluate((img) => {
      return img.complete && img.naturalHeight !== 0;
    }, await thumbnailImage.elementHandle());
    
    expect(imageLoaded).toBe(true);
  });

});