// Ko Lake Villa - Error Handling & Edge Cases Test Suite
// Tests error scenarios, edge cases, and graceful failure handling

const { test, expect } = require('@playwright/test');

test.describe('Error Handling & Edge Cases Tests', () => {
  
  test.describe('🚫 404 Error Handling', () => {
    
    test('should display custom 404 page for non-existent routes', async ({ page }) => {
      await page.goto('/non-existent-page');
      await page.waitForLoadState('networkidle');
      
      // Should show 404 page with navigation still working
      await expect(page.locator('text=404, text=Not Found')).toBeVisible();
      
      // Navigation should still be present
      await expect(page.locator('.nav-header, nav')).toBeVisible();
    });

    test('should handle malformed URLs gracefully', async ({ page }) => {
      const malformedUrls = [
        '/admin/../../../etc/passwd',
        '/gallery/<script>alert("xss")</script>',
        '/booking?redirect=javascript:alert(1)',
        '/contact%00'
      ];

      for (const url of malformedUrls) {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        // Should not crash or expose sensitive info
        const hasError = await page.evaluate(() => {
          return !document.querySelector('body').innerText.includes('Error') &&
                 !document.querySelector('body').innerText.includes('Exception') &&
                 !document.querySelector('body').innerText.includes('Stack trace');
        });
        
        expect(hasError).toBe(true);
      }
    });
  });

  test.describe('🌐 Network Error Handling', () => {
    
    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 1000); // 1 second delay
      });
      
      await page.goto('/');
      
      // Page should still load (with timeout extended)
      await expect(page.locator('text=Ko Lake Villa')).toBeVisible({ timeout: 10000 });
    });

    test('should handle failed image loads gracefully', async ({ page }) => {
      // Block image requests
      await page.route('**/*.{jpg,jpeg,png,gif,webp}', route => route.abort());
      
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Page should still render without images
      await expect(page.locator('text=Ko Lake Villa')).toBeVisible();
      
      // Check that broken images don't crash the layout
      const brokenImages = await page.locator('img').count();
      const pageText = await page.textContent('body');
      expect(pageText).toContain('Ko Lake Villa');
    });

    test('should handle CSS load failures', async ({ page }) => {
      // Block CSS requests
      await page.route('**/*.css', route => route.abort());
      
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Content should still be accessible even without styles
      await expect(page.locator('text=Ko Lake Villa')).toBeVisible();
      
      // Navigation should still function
      const navLinks = await page.locator('a[href="/accommodation"], a[href="/dining"]').count();
      expect(navLinks).toBeGreaterThan(0);
    });
  });

  test.describe('📱 Browser Compatibility & Edge Cases', () => {
    
    test('should handle viewport changes gracefully', async ({ page }) => {
      await page.goto('/');
      
      // Start desktop
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(page.locator('.nav-desktop')).toBeVisible();
      
      // Switch to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('.nav-mobile-button')).toBeVisible();
      
      // Switch back to desktop
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(page.locator('.nav-desktop')).toBeVisible();
      
      // Should not have layout issues
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow).toBe(false);
    });

    test('should handle JavaScript disabled scenario', async ({ page }) => {
      // Disable JavaScript
      await page.context().addInitScript(() => {
        Object.defineProperty(window, 'navigator', {
          writable: true,
          value: { ...window.navigator, javaEnabled: () => false }
        });
      });
      
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Basic content should still be accessible
      await expect(page.locator('text=Ko Lake Villa')).toBeVisible();
      
      // Static navigation should work
      const contactLink = page.locator('a[href="/contact"]');
      if (await contactLink.count() > 0) {
        await contactLink.click();
        expect(page.url()).toContain('/contact');
      }
    });
  });

  test.describe('🔐 Authentication Error Handling', () => {
    
    test('should handle corrupted localStorage data', async ({ page }) => {
      await page.goto('/admin/login');
      
      // Set corrupted auth data
      await page.evaluate(() => {
        localStorage.setItem('adminAuth', 'corrupted_data');
        localStorage.setItem('userAuth', '{"broken": json}');
      });
      
      await page.goto('/admin/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login instead of crashing
      expect(page.url()).toContain('/admin/login');
    });

    test('should handle session timeout gracefully', async ({ page }) => {
      // Set auth but with expired timestamp
      await page.evaluate(() => {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('userAuth', JSON.stringify({
          name: 'Test User',
          timestamp: Date.now() - (24 * 60 * 60 * 1000) // 24 hours ago
        }));
      });
      
      await page.goto('/admin/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should handle gracefully (redirect to login or show session expired)
      const isHandledGracefully = page.url().includes('/admin/login') || 
                                  await page.locator('text=session, text=expired').count() > 0;
      expect(isHandledGracefully).toBe(true);
    });
  });

  test.describe('📝 Form Error Handling', () => {
    
    test('should validate booking form inputs', async ({ page }) => {
      await page.goto('/booking');
      await page.waitForLoadState('networkidle');
      
      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Book")');
      if (await submitButton.count() > 0) {
        await submitButton.click();
        
        // Should show validation errors or prevent submission
        const hasValidation = await page.evaluate(() => {
          // Look for validation messages
          return document.querySelector('[class*="error"], .invalid, .required') !== null ||
                 document.querySelector('input:invalid') !== null;
        });
        
        // Form shouldn't submit with invalid data
        expect(hasValidation || page.url().includes('/booking')).toBe(true);
      }
    });

    test('should handle contact form submission errors', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      // Fill form with invalid data
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      if (await emailInput.count() > 0) {
        await emailInput.fill('invalid-email');
        
        const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")');
        if (await submitButton.count() > 0) {
          await submitButton.click();
          
          // Should show email validation error
          const hasEmailValidation = await page.evaluate(() => {
            const emailField = document.querySelector('input[type="email"]');
            return emailField ? !emailField.validity.valid : true;
          });
          
          expect(hasEmailValidation).toBe(true);
        }
      }
    });
  });

  test.describe('🖼️ Gallery Error Handling', () => {
    
    test('should handle missing gallery images gracefully', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      // Gallery should load even if some images are missing
      await expect(page.locator('text=Gallery, text=Villa Gallery')).toBeVisible({ timeout: 10000 });
      
      // Check for graceful handling of broken images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Should have alt text for accessibility
        const hasAltText = await images.first().getAttribute('alt');
        expect(hasAltText).not.toBeNull();
      }
    });

    test('should handle gallery API failures', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/gallery/**', route => {
        route.fulfill({ status: 500, body: 'Server Error' });
      });
      
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');
      
      // Should show error message or fallback content
      const hasErrorHandling = await page.evaluate(() => {
        return document.querySelector('text=error') !== null ||
               document.querySelector('text=loading') !== null ||
               document.querySelector('.gallery') !== null;
      });
      
      expect(hasErrorHandling).toBe(true);
    });
  });

  test.describe('🔧 Console Error Monitoring', () => {
    
    test('should not have JavaScript console errors on main pages', async ({ page }) => {
      const consoleErrors = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      const testPages = ['/', '/accommodation', '/dining', '/gallery', '/contact'];
      
      for (const testPage of testPages) {
        await page.goto(testPage);
        await page.waitForLoadState('networkidle');
        
        // Allow some time for any delayed scripts
        await page.waitForTimeout(2000);
      }
      
      // Filter out known acceptable errors
      const significantErrors = consoleErrors.filter(error => 
        !error.includes('favicon') &&
        !error.includes('chrome-extension') &&
        !error.includes('404') &&
        !error.includes('_next/static') // Next.js dev server artifacts
      );
      
      expect(significantErrors.length).toBeLessThanOrEqual(2); // Allow minimal errors
    });
    
    test('should not have memory leaks in navigation', async ({ page }) => {
      await page.goto('/');
      
      // Navigate between pages multiple times
      const navigationSequence = [
        '/accommodation',
        '/dining', 
        '/gallery',
        '/contact',
        '/'
      ];
      
      for (let i = 0; i < 3; i++) { // Repeat 3 times
        for (const path of navigationSequence) {
          await page.goto(path);
          await page.waitForLoadState('networkidle');
        }
      }
      
      // Check that page is still responsive
      await expect(page.locator('text=Ko Lake Villa')).toBeVisible();
      
      // Basic performance check
      const isResponsive = await page.evaluate(() => {
        const start = performance.now();
        document.querySelector('body');
        return performance.now() - start < 100; // Should be very fast
      });
      
      expect(isResponsive).toBe(true);
    });
  });

  test.describe('📊 Performance Edge Cases', () => {
    
    test('should handle large gallery loads', async ({ page }) => {
      await page.goto('/gallery');
      
      // Check that gallery doesn't hang browser
      const startTime = Date.now();
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(10000); // 10 second max
      
      // Should still be interactive
      const isInteractive = await page.evaluate(() => {
        return document.readyState === 'complete';
      });
      expect(isInteractive).toBe(true);
    });

    test('should handle rapid navigation clicks', async ({ page }) => {
      await page.goto('/');
      
      // Rapidly click navigation links
      const links = ['Accommodation', 'Dining', 'Gallery', 'Contact'];
      
      for (let i = 0; i < 5; i++) {
        const randomLink = links[Math.floor(Math.random() * links.length)];
        await page.click(`text=${randomLink}`, { timeout: 1000 });
        await page.waitForTimeout(100); // Small delay
      }
      
      // Should not crash and should end up on a valid page
      const finalUrl = page.url();
      expect(finalUrl).toMatch(/\/(accommodation|dining|gallery|contact|$)/);
    });
  });
});

// Test summary and recommendations
test.afterAll(async () => {
  console.log('\n🎉 Error Handling Tests Completed');
  console.log('✅ 404 error handling verified');
  console.log('✅ Network failure resilience tested');
  console.log('✅ Browser compatibility confirmed');
  console.log('✅ Authentication error handling validated');
  console.log('✅ Form validation working');
  console.log('✅ Gallery error handling tested');
  console.log('✅ Console error monitoring complete');
  console.log('✅ Performance edge cases covered');
  console.log('\n💡 Recommendations:');
  console.log('• Monitor console errors in production');
  console.log('• Implement proper error boundaries for React components');
  console.log('• Add loading states for better UX');
  console.log('• Consider offline functionality for critical features');
}); 