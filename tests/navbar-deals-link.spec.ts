import { test, expect } from '@playwright/test';

test.describe('Navigation Deals Link', () => {
  test('should display Deals link in desktop navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if Deals link exists in desktop navigation
    const dealsLink = page.locator('nav a[href="/deals"]');
    await expect(dealsLink).toBeVisible();
    await expect(dealsLink).toHaveText('Deals');
  });

  test('should display Deals link in mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    const mobileMenuButton = page.locator('button[aria-label*="menu"]').or(
      page.locator('button:has(i.fa-bars)')
    );
    await mobileMenuButton.click();
    
    // Check if Deals link exists in mobile menu
    const dealsLink = page.locator('a[href="/deals"]:has-text("Deals")');
    await expect(dealsLink).toBeVisible();
  });

  test('should navigate to Deals page when clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click the Deals link
    await page.click('a[href="/deals"]');
    
    // Verify we're on the deals page
    await expect(page).toHaveURL('/deals');
    
    // Check that deals page content loads
    await expect(page.locator('h1')).toContainText('Deals');
  });

  test('should load Deals page content correctly', async ({ page }) => {
    await page.goto('/deals');
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Exclusive Deals');
    
    // Check for Late Deals section
    const lateDealsSection = page.locator('h2:has-text("Late Deals")');
    await expect(lateDealsSection).toBeVisible();
    
    // Check for Early Bird section
    const earlyBirdSection = page.locator('h2:has-text("Early Bird")');
    await expect(earlyBirdSection).toBeVisible();
    
    // Check for deal cards
    const dealCards = page.locator('.grid').locator('.border-2');
    await expect(dealCards.first()).toBeVisible();
  });

  test('should highlight Deals link when on deals page', async ({ page }) => {
    await page.goto('/deals');
    
    // Check if Deals link has active styling
    const dealsLink = page.locator('nav a[href="/deals"]');
    await expect(dealsLink).toHaveClass(/text-\[#FF914D\]/);
  });

  test('should display deal information correctly', async ({ page }) => {
    await page.goto('/deals');
    
    // Check for discount badges
    const discountBadges = page.locator('.bg-\\[\\#FF914D\\]').filter({ hasText: /\d+% OFF/ });
    await expect(discountBadges.first()).toBeVisible();
    
    // Check for booking buttons
    const bookingButtons = page.locator('button:has-text("Book")').or(
      page.locator('button:has-text("Reserve")')
    );
    await expect(bookingButtons.first()).toBeVisible();
    
    // Check for deal conditions
    const conditionsList = page.locator('ul').filter({ hasText: /conditions/i }).or(
      page.locator('text=Valid').first()
    );
    await expect(conditionsList).toBeVisible();
  });

  test('should have responsive design on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/deals');
    
    // Check that page is responsive
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that deal cards stack properly on mobile
    const dealGrid = page.locator('.grid');
    await expect(dealGrid).toBeVisible();
  });
});