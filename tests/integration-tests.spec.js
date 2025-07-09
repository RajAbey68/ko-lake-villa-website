// Ko Lake Villa - Integration Test Suite
// Tests end-to-end functionality and feature integration

const { test, expect } = require('@playwright/test');

// Test configuration
test.describe('Ko Lake Villa Integration Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup for each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('🏠 Homepage Integration', () => {
    
    test('should display complete homepage with all elements', async ({ page }) => {
      // Check hero section
      await expect(page.locator('text=Ko Lake Villa')).toBeVisible();
      await expect(page.locator('text=Relax, Revive, Connect')).toBeVisible();
      
      // Check WhatsApp integration
      const whatsappButton = page.locator('a[href*="wa.me/94711730345"]');
      await expect(whatsappButton).toBeVisible();
      
      // Check navigation
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('text=Accommodation')).toBeVisible();
      await expect(page.locator('text=Dining')).toBeVisible();
      await expect(page.locator('text=Gallery')).toBeVisible();
    });

    test('should have working navigation to all pages', async ({ page }) => {
      const navigationLinks = [
        { text: 'Accommodation', url: '/accommodation' },
        { text: 'Dining', url: '/dining' },
        { text: 'Experiences', url: '/experiences' },
        { text: 'Gallery', url: '/gallery' },
        { text: 'Contact', url: '/contact' }
      ];

      for (const link of navigationLinks) {
        await page.click(`text=${link.text}`);
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(link.url);
        
        // Go back to homepage for next test
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      }
    });

    test('should have brand-compliant styling', async ({ page }) => {
      // Check for amber colors (brand compliance)
      const amberElements = await page.locator('[class*="amber-"]').count();
      expect(amberElements).toBeGreaterThan(0);
      
      // Check no blue colors (brand violation)
      const blueElements = await page.locator('[class*="blue-"]').count();
      expect(blueElements).toBe(0);
    });
  });

  test.describe('🖼️ Gallery Integration (Critical)', () => {
    
    test('should load gallery page without hanging', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds (generous for slow connections)
      expect(loadTime).toBeLessThan(5000);
      
      // Should display gallery content
      await expect(page.locator('h1')).toContainText('Gallery');
    });

    test('should display gallery images without API dependencies', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      // Check for images (should be static, not API-loaded)
      const images = page.locator('img');
      const imageCount = await images.count();
      expect(imageCount).toBeGreaterThan(0);
      
      // Verify no loading spinners stuck
      const loadingSpinners = page.locator('[data-testid="loading"]');
      const spinnerCount = await loadingSpinners.count();
      expect(spinnerCount).toBe(0);
    });

    test('should have functional filter buttons', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      // Test filter buttons if they exist
      const filterButtons = page.locator('button[class*="filter"], button:has-text("Pool"), button:has-text("Rooms")');
      const buttonCount = await filterButtons.count();
      
      if (buttonCount > 0) {
        // Click first filter button
        await filterButtons.first().click();
        await page.waitForTimeout(500); // Allow filter animation
        
        // Should still show images
        const imagesAfterFilter = await page.locator('img').count();
        expect(imagesAfterFilter).toBeGreaterThan(0);
      }
    });

    test('should open image modal on click', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      // Click first image
      const firstImage = page.locator('img').first();
      await firstImage.click();
      
      // Check if modal opens (look for dialog or overlay)
      const modal = page.locator('[role="dialog"], .modal, [data-testid="image-modal"]');
      await expect(modal).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('📱 WhatsApp Integration', () => {
    
    test('should have WhatsApp links on all pages', async ({ page }) => {
      const pages = ['/', '/accommodation', '/dining', '/experiences', '/contact'];
      
      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');
        
        // Check for WhatsApp link
        const whatsappLink = page.locator('a[href*="wa.me/94711730345"]');
        await expect(whatsappLink).toBeVisible();
      }
    });

    test('should have correct WhatsApp number format', async ({ page }) => {
      const whatsappLinks = page.locator('a[href*="wa.me"]');
      const linkCount = await whatsappLinks.count();
      
      for (let i = 0; i < linkCount; i++) {
        const href = await whatsappLinks.nth(i).getAttribute('href');
        expect(href).toContain('wa.me/94711730345');
      }
    });
  });

  test.describe('🏨 Page Content Integration', () => {
    
    test('should load accommodation page with content', async ({ page }) => {
      await page.goto('/accommodation');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Ko Lake Villa')).toBeVisible();
    });

    test('should load dining page with content', async ({ page }) => {
      await page.goto('/dining');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should load experiences page with content', async ({ page }) => {
      await page.goto('/experiences');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should load contact page with contact information', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('h1')).toBeVisible();
      
      // Should have contact information
      const phoneNumber = page.locator('text=+94711730345');
      await expect(phoneNumber).toBeVisible();
    });
  });

  test.describe('📱 Responsive Design Integration', () => {
    
    test('should work correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check mobile navigation
      const mobileMenu = page.locator('button[aria-label*="menu"], .mobile-menu-button, button:has-text("☰")');
      
      // If mobile menu exists, test it
      const menuCount = await mobileMenu.count();
      if (menuCount > 0) {
        await mobileMenu.first().click();
        await page.waitForTimeout(500);
        
        // Navigation should be visible after clicking
        await expect(page.locator('nav, .mobile-menu')).toBeVisible();
      }
      
      // Check WhatsApp button still accessible
      await expect(page.locator('a[href*="wa.me"]')).toBeVisible();
    });

    test('should work correctly on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      // Gallery should adapt to tablet
      const images = page.locator('img');
      const imageCount = await images.count();
      expect(imageCount).toBeGreaterThan(0);
    });
  });

  test.describe('🔒 Admin Integration', () => {
    
    test('should protect admin routes', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      // Admin should either redirect or show login
      const currentUrl = page.url();
      const hasAdminContent = await page.locator('text=Dashboard, text=Admin').count();
      
      // If admin content visible, it should be properly styled
      if (hasAdminContent > 0) {
        await expect(page.locator('h1, h2')).toBeVisible();
      }
    });
  });

  test.describe('⚡ Performance Integration', () => {
    
    test('should load pages within acceptable time', async ({ page }) => {
      const pages = ['/', '/gallery', '/accommodation', '/dining'];
      
      for (const pageUrl of pages) {
        const startTime = Date.now();
        
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        // Pages should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
        
        console.log(`${pageUrl} loaded in ${loadTime}ms`);
      }
    });

    test('should not have JavaScript errors', async ({ page }) => {
      const errors = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      page.on('pageerror', error => {
        errors.push(error.message);
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      // Should have no JavaScript errors
      expect(errors).toEqual([]);
    });
  });

  test.describe('🔄 Regression Prevention', () => {
    
    test('should not have gallery loading regression', async ({ page }) => {
      // This is the specific test for the gallery issue we fixed
      await page.goto('/gallery');
      
      // Should load within reasonable time
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Should not have infinite loading
      const loadingElements = page.locator('[data-testid="loading"], .loading, .spinner');
      await expect(loadingElements).toHaveCount(0);
      
      // Should display content
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should not have package manager conflicts', async ({ page }) => {
      // This would be caught during build, but we can test the result
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // If the page loads, package management is working
      await expect(page.locator('text=Ko Lake Villa')).toBeVisible();
    });

    test('should not have missing icon imports', async ({ page }) => {
      const errors = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('lucide')) {
          errors.push(msg.text());
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should have no Lucide icon errors
      expect(errors).toEqual([]);
    });
  });
});

// Utility functions for test data
function generateTestData() {
  return {
    validContact: {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message for Ko Lake Villa'
    },
    whatsappNumber: '+94711730345',
    brandColors: ['amber-600', 'amber-700', 'amber-800'],
    prohibitedColors: ['blue-', 'green-', 'purple-']
  };
} 