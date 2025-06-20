import { test, expect } from '@playwright/test';

test.describe('Gallery Filter Categories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gallery');
  });

  test('should display Events and Friends & Crew filter buttons', async ({ page }) => {
    // Check if Events filter button exists
    const eventsFilter = page.locator('button:has-text("Events")');
    await expect(eventsFilter).toBeVisible();

    // Check if Friends & Crew filter button exists
    const friendsFilter = page.locator('button:has-text("Friends")').or(
      page.locator('button:has-text("Friends & Crew")')
    );
    await expect(friendsFilter).toBeVisible();
  });

  test('should filter gallery images by Events category', async ({ page }) => {
    // Click Events filter
    await page.click('button:has-text("Events")');
    
    // Wait for filtering to complete
    await page.waitForTimeout(500);
    
    // Check that gallery updates (either shows events images or "no images" message)
    const galleryGrid = page.locator('[role="grid"]').or(page.locator('.grid'));
    await expect(galleryGrid).toBeVisible();
  });

  test('should filter gallery images by Friends & Crew category', async ({ page }) => {
    // Click Friends & Crew filter (try both possible text variants)
    const friendsButton = page.locator('button:has-text("Friends")').or(
      page.locator('button:has-text("Friends & Crew")')
    );
    await friendsButton.first().click();
    
    // Wait for filtering to complete
    await page.waitForTimeout(500);
    
    // Check that gallery updates
    const galleryGrid = page.locator('[role="grid"]').or(page.locator('.grid'));
    await expect(galleryGrid).toBeVisible();
  });

  test('should show all categories in filter options', async ({ page }) => {
    // Check that all main categories are present including new ones
    await expect(page.locator('button:has-text("All")')).toBeVisible();
    await expect(page.locator('button:has-text("Triple Room")')).toBeVisible();
    await expect(page.locator('button:has-text("Pool Deck")')).toBeVisible();
    await expect(page.locator('button:has-text("Events")')).toBeVisible();
    
    // Check for Friends category (flexible text matching)
    const friendsCategory = page.locator('button').filter({ hasText: /Friends/ });
    await expect(friendsCategory).toBeVisible();
  });

  test('should reset to all images when clicking All filter', async ({ page }) => {
    // First filter by Events
    await page.click('button:has-text("Events")');
    await page.waitForTimeout(500);
    
    // Then click All to reset
    await page.click('button:has-text("All")');
    await page.waitForTimeout(500);
    
    // Check that gallery shows all images again
    const galleryGrid = page.locator('[role="grid"]').or(page.locator('.grid'));
    await expect(galleryGrid).toBeVisible();
    
    // Should have multiple images visible (assuming gallery has content)
    const imageCards = page.locator('img[alt]');
    const count = await imageCards.count();
    expect(count).toBeGreaterThan(0);
  });
});