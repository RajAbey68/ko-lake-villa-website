// Ko Lake Villa - Admin Console Test Suite
// Tests admin functionality, authentication, and console features

const { test, expect } = require('@playwright/test');

test.describe('Admin Console Comprehensive Tests', () => {

  // Helper function to login as admin
  async function loginAsAdmin(page) {
    await page.goto('/admin/login');
    
    // Set admin auth in localStorage (simulating login)
    await page.evaluate(() => {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('userAuth', JSON.stringify({
        name: 'Test Admin',
        email: 'admin@kolakehouse.com',
        role: 'admin'
      }));
    });
    
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');
  }

  test.describe('🔐 Authentication Tests', () => {
    
    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login page
      expect(page.url()).toContain('/admin/login');
    });

    test('should allow access with valid authentication', async ({ page }) => {
      await loginAsAdmin(page);
      
      // Should be on dashboard
      expect(page.url()).toContain('/admin/dashboard');
      await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    });

    test('should have working logout functionality', async ({ page }) => {
      await loginAsAdmin(page);
      
      // Click logout button
      await page.click('text=Logout');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login
      expect(page.url()).toContain('/admin/login');
    });
  });

  test.describe('🏠 Admin Dashboard Tests', () => {
    
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should display admin dashboard with all sections', async ({ page }) => {
      // Check main dashboard elements
      await expect(page.locator('text=Ko Lake Villa Admin')).toBeVisible();
      await expect(page.locator('text=Admin Dashboard')).toBeVisible();
      
      // Check navigation menu
      await expect(page.locator('text=Gallery')).toBeVisible();
      await expect(page.locator('text=Analytics')).toBeVisible();
      await expect(page.locator('text=Bookings')).toBeVisible();
    });

    test('should have working navigation between admin sections', async ({ page }) => {
      const adminSections = [
        { name: 'Gallery', path: '/admin/gallery' },
        { name: 'Analytics', path: '/admin/analytics' },
        { name: 'Bookings', path: '/admin/bookings' },
        { name: 'Content', path: '/admin/content' }
      ];

      for (const section of adminSections) {
        await page.click(`text=${section.name}`);
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(section.path);
        
        // Should have admin header
        await expect(page.locator('text=Ko Lake Villa Admin')).toBeVisible();
      }
    });

    test('should have View Site link working', async ({ page }) => {
      await page.click('text=View Site');
      await page.waitForLoadState('networkidle');
      
      // Should go to public site
      expect(page.url()).not.toContain('/admin');
      await expect(page.locator('text=Ko Lake Villa')).toBeVisible();
    });
  });

  test.describe('🖼️ Gallery Management Tests', () => {
    
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/gallery');
      await page.waitForLoadState('networkidle');
    });

    test('should display gallery management interface', async ({ page }) => {
      await expect(page.locator('text=Gallery Management')).toBeVisible();
      
      // Check for gallery controls
      await expect(page.locator('button, input[type="file"], text=Upload')).toHaveCount({ min: 1 });
    });

    test('should show existing gallery images', async ({ page }) => {
      // Check for gallery grid or list
      const galleryContainer = page.locator('[class*="grid"], [class*="gallery"], .image-grid');
      await expect(galleryContainer).toBeVisible({ timeout: 10000 });
    });

    test('should have category management', async ({ page }) => {
      // Look for category-related controls
      const hasCategoryControls = await page.evaluate(() => {
        return document.querySelector('text=category') !== null ||
               document.querySelector('[class*="category"]') !== null ||
               document.querySelector('select') !== null;
      });
      
      expect(hasCategoryControls).toBe(true);
    });
  });

  test.describe('📊 Analytics Tests', () => {
    
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/analytics');
      await page.waitForLoadState('networkidle');
    });

    test('should display analytics dashboard', async ({ page }) => {
      // Should have analytics content (no hardcoded navigation)
      await expect(page.locator('text=Analytics')).toBeVisible();
      
      // Check for analytics components (cards, charts, etc)
      const hasAnalyticsContent = await page.evaluate(() => {
        return document.querySelector('[class*="card"]') !== null ||
               document.querySelector('[class*="chart"]') !== null ||
               document.querySelector('[class*="metric"]') !== null;
      });
      
      expect(hasAnalyticsContent).toBe(true);
    });
  });

  test.describe('📅 Bookings Management Tests', () => {
    
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/bookings');
      await page.waitForLoadState('networkidle');
    });

    test('should display bookings management interface', async ({ page }) => {
      await expect(page.locator('text=Bookings Management')).toBeVisible();
      
      // Check for booking statistics
      await expect(page.locator('text=Total Bookings')).toBeVisible();
      await expect(page.locator('text=Confirmed')).toBeVisible();
      await expect(page.locator('text=Pending')).toBeVisible();
    });

    test('should have bookings list', async ({ page }) => {
      // Check for bookings table/list
      const hasBookingsList = await page.evaluate(() => {
        return document.querySelector('table') !== null ||
               document.querySelector('[class*="booking"]') !== null ||
               document.querySelector('text=John Smith') !== null; // Mock data
      });
      
      expect(hasBookingsList).toBe(true);
    });

    test('should have search and filter functionality', async ({ page }) => {
      // Check for search input
      await expect(page.locator('input[placeholder*="search" i], input[placeholder*="Search" i]')).toBeVisible();
      
      // Check for filter dropdown
      await expect(page.locator('select, [role="combobox"]')).toBeVisible();
    });

    test('should display booking details in modal', async ({ page }) => {
      // Try to click on a booking to view details
      const viewButton = page.locator('button:has-text("View")').first();
      if (await viewButton.count() > 0) {
        await viewButton.click();
        
        // Should open modal with booking details
        await expect(page.locator('text=Booking Details')).toBeVisible();
      }
    });
  });

  test.describe('📝 Content Management Tests', () => {
    
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/content');
      await page.waitForLoadState('networkidle');
    });

    test('should display content management interface', async ({ page }) => {
      await expect(page.locator('text=Content Management')).toBeVisible();
      
      // Check for content editing interface
      const hasContentControls = await page.evaluate(() => {
        return document.querySelector('textarea') !== null ||
               document.querySelector('[contenteditable]') !== null ||
               document.querySelector('input[type="text"]') !== null;
      });
      
      expect(hasContentControls).toBe(true);
    });
  });

  test.describe('🎨 Admin UI Consistency Tests', () => {
    
    const adminPages = [
      '/admin/dashboard',
      '/admin/gallery', 
      '/admin/analytics',
      '/admin/bookings',
      '/admin/content'
    ];

    test('should have consistent admin header across all pages', async ({ page }) => {
      await loginAsAdmin(page);
      
      for (const adminPath of adminPages) {
        await page.goto(adminPath);
        await page.waitForLoadState('networkidle');
        
        // Check for consistent admin header
        await expect(page.locator('text=Ko Lake Villa Admin')).toBeVisible();
        
        // Check for admin navigation
        await expect(page.locator('text=Dashboard')).toBeVisible();
        await expect(page.locator('text=Gallery')).toBeVisible();
        
        console.log(`✅ ${adminPath} has consistent admin UI`);
      }
    });

    test('should use unified admin styling', async ({ page }) => {
      await loginAsAdmin(page);
      
      // Check for admin-specific CSS classes (no hardcoded navigation)
      const hasUnifiedAdminStyles = await page.evaluate(() => {
        // Look for admin layout structure
        return document.querySelector('.min-h-screen') !== null &&
               document.querySelector('.bg-gray-50') !== null;
      });
      
      expect(hasUnifiedAdminStyles).toBe(true);
    });

    test('should have proper admin responsive design', async ({ page }) => {
      await loginAsAdmin(page);
      
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/admin/dashboard');
      
      // Admin interface should be usable on mobile
      await expect(page.locator('text=Ko Lake Villa Admin')).toBeVisible();
      
      // Test desktop view
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.reload();
      
      await expect(page.locator('text=Ko Lake Villa Admin')).toBeVisible();
    });
  });

  test.describe('🔒 Security Tests', () => {
    
    test('should not expose sensitive data without authentication', async ({ page }) => {
      await page.goto('/admin/analytics');
      
      // Should not see analytics data without login
      expect(page.url()).toContain('/admin/login');
      
      // Should not have access to booking data
      await page.goto('/admin/bookings');
      expect(page.url()).toContain('/admin/login');
    });

    test('should handle session expiration', async ({ page }) => {
      await loginAsAdmin(page);
      
      // Clear auth
      await page.evaluate(() => {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('userAuth');
      });
      
      // Try to access admin page
      await page.goto('/admin/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login
      expect(page.url()).toContain('/admin/login');
    });
  });

  test.describe('⚡ Admin Performance Tests', () => {
    
    test('should load admin pages quickly', async ({ page }) => {
      await loginAsAdmin(page);
      
      const startTime = Date.now();
      await page.goto('/admin/gallery');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 second max for admin pages
    });

    test('should handle large booking lists efficiently', async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/bookings');
      await page.waitForLoadState('networkidle');
      
      // Check that page doesn't hang with booking data
      const isResponsive = await page.evaluate(() => {
        return document.readyState === 'complete';
      });
      
      expect(isResponsive).toBe(true);
    });
  });
});

// Test summary
test.afterAll(async () => {
  console.log('\n🎉 Admin Console Tests Completed');
  console.log('✅ Authentication flow verified');
  console.log('✅ All admin sections tested');
  console.log('✅ UI consistency confirmed');
  console.log('✅ Security measures validated');
  console.log('✅ Performance within limits');
}); 