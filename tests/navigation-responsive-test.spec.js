const { test, expect } = require('@playwright/test');

test.describe('Navigation Responsive Design Tests', () => {
  // Common navigation items that should be present
  const navigationItems = [
    'Home',
    'Accommodation', 
    'Dining',
    'Experiences',
    'Gallery',
    'Contact'
  ];

  test.beforeEach(async ({ page }) => {
    // Go to the test page which has the navigation
    await page.goto('/test');
    // Wait for navigation to load
    await page.waitForSelector('header');
  });

  test('Mobile navigation (320px)', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Check that mobile menu button is visible
    const mobileMenuButton = page.locator('button[aria-label*="menu"]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Check that desktop navigation is hidden
    const desktopNav = page.locator('nav.nav-desktop');
    await expect(desktopNav).toBeHidden();
    
    // Click mobile menu button
    await mobileMenuButton.click();
    
    // Check that mobile menu items are visible
    for (const item of navigationItems) {
      const menuItem = page.locator(`nav.nav-mobile-menu a:has-text("${item}")`);
      await expect(menuItem).toBeVisible();
    }
    
    // Check logo size is appropriate for mobile
    const logo = page.locator('.nav-logo-text');
    await expect(logo).toBeVisible();
    
    // Check spacing - no overlap
    const header = page.locator('header.nav-header');
    const headerBox = await header.boundingBox();
    expect(headerBox.height).toBeLessThan(100); // Header shouldn't be too tall
  });

  test('Small mobile navigation (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenuButton = page.locator('button[aria-label*="menu"]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Check that Book Now button is hidden on small mobile
    const bookButton = page.locator('button:has-text("Book Now")');
    await expect(bookButton).toBeHidden();
    
    // Check logo and menu button don't overlap
    const logo = page.locator('.nav-logo');
    const logoBox = await logo.boundingBox();
    const buttonBox = await mobileMenuButton.boundingBox();
    
    expect(logoBox.x + logoBox.width).toBeLessThan(buttonBox.x);
  });

  test('Tablet navigation (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Desktop navigation should be visible
    const desktopNav = page.locator('nav.nav-desktop');
    await expect(desktopNav).toBeVisible();
    
    // Mobile menu button should be hidden
    const mobileMenuButton = page.locator('button[aria-label*="menu"]');
    await expect(mobileMenuButton).toBeHidden();
    
    // Check that all navigation items are visible
    for (const item of navigationItems) {
      const navItem = page.locator(`nav.nav-desktop a:has-text("${item}")`);
      await expect(navItem).toBeVisible();
    }
    
    // Book Now button should be visible
    const bookButton = page.locator('button:has-text("Book Now")');
    await expect(bookButton).toBeVisible();
    
    // Contact info should still be hidden at this size
    const contactInfo = page.locator('.nav-contact-info');
    await expect(contactInfo).toBeHidden();
  });

  test('Desktop navigation (1024px)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // All elements should be visible and properly spaced
    const desktopNav = page.locator('nav.nav-desktop');
    await expect(desktopNav).toBeVisible();
    
    const bookButton = page.locator('button:has-text("Book Now")');
    await expect(bookButton).toBeVisible();
    
    // Check navigation spacing
    const navItems = page.locator('nav.nav-menu a');
    const count = await navItems.count();
    
    for (let i = 0; i < count - 1; i++) {
      const currentItem = navItems.nth(i);
      const nextItem = navItems.nth(i + 1);
      
      const currentBox = await currentItem.boundingBox();
      const nextBox = await nextItem.boundingBox();
      
      // Items should not overlap
      expect(currentBox.x + currentBox.width).toBeLessThanOrEqual(nextBox.x);
    }
  });

  test('Large desktop navigation (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Contact info should be visible on large screens
    const contactInfo = page.locator('.nav-contact-info');
    await expect(contactInfo).toBeVisible();
    
    // Check contact links are visible
    const phoneLink = page.locator('a[href="tel:+94711730345"]');
    const emailLink = page.locator('a[href="mailto:contact@KoLakeHouse.com"]');
    
    await expect(phoneLink).toBeVisible();
    await expect(emailLink).toBeVisible();
    
    // All navigation should be properly spaced
    const header = page.locator('header.nav-header');
    const headerBox = await header.boundingBox();
    
    // Header height should be consistent
    expect(headerBox.height).toBeGreaterThanOrEqual(64); // 16 * 4 = 64px min height
    expect(headerBox.height).toBeLessThanOrEqual(80); // Not too tall
  });

  test('Navigation hover states', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Test hover state on navigation links
    const firstNavLink = page.locator('nav.nav-desktop a').first();
    
    // Get initial color
    const initialColor = await firstNavLink.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    // Hover over the link
    await firstNavLink.hover();
    
    // Color should change on hover (orange-500)
    const hoverColor = await firstNavLink.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    expect(hoverColor).not.toBe(initialColor);
  });

  test('Active navigation state', async ({ page }) => {
    // Go to a specific page to test active state
    await page.goto('/');
    
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Home link should have active styling
    const homeLink = page.locator('nav.nav-desktop a:has-text("Home")');
    
    // Check if active class is applied
    const hasActiveClass = await homeLink.evaluate(el => 
      el.className.includes('nav-link-active')
    );
    
    expect(hasActiveClass).toBe(true);
  });

  test('Mobile menu functionality', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenuButton = page.locator('button[aria-label*="menu"]');
    const mobileMenu = page.locator('.nav-mobile');
    
    // Initially mobile menu should be hidden
    await expect(mobileMenu).toBeHidden();
    
    // Click to open
    await mobileMenuButton.click();
    await expect(mobileMenu).toBeVisible();
    
    // Click a menu item to close
    const homeLink = page.locator('.nav-mobile-menu a:has-text("Home")');
    await homeLink.click();
    
    // Should navigate and close menu
    await expect(mobileMenu).toBeHidden();
  });

  test('No horizontal scroll at any breakpoint', async ({ page }) => {
    const breakpoints = [320, 375, 768, 1024, 1440];
    
    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 800 });
      
      // Check that page width doesn't exceed viewport
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(width + 5); // Allow 5px tolerance
    }
  });
}); 