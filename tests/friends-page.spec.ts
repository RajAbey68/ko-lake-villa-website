import { test, expect } from '@playwright/test';

test.describe('Friends & Crew Page', () => {
  test('should load Friends & Crew page successfully', async ({ page }) => {
    await page.goto('/friends');
    
    // Check that page loads without errors
    await expect(page.locator('h1')).toContainText('Friends & Crew');
    
    // Verify page description is present
    const description = page.locator('p').filter({ 
      hasText: /amazing team.*family.*local partners/i 
    });
    await expect(description).toBeVisible();
  });

  test('should display page content when friends images exist', async ({ page }) => {
    // Mock API response with friends images
    await page.route('/api/gallery', async route => {
      const json = [
        {
          id: 1,
          imageUrl: '/test-friend-image.jpg',
          alt: 'Team Member',
          category: 'friends-and-crew',
          description: 'Our amazing staff member',
          tags: 'friends-and-crew,staff',
          featured: true
        }
      ];
      await route.fulfill({ json });
    });

    await page.goto('/friends');
    
    // Check that friend image card is displayed
    const imageCard = page.locator('img[alt="Team Member"]');
    await expect(imageCard).toBeVisible();
    
    // Check for featured badge
    const featuredBadge = page.locator('text=Featured');
    await expect(featuredBadge).toBeVisible();
    
    // Check for description
    const description = page.locator('text=Our amazing staff member');
    await expect(description).toBeVisible();
  });

  test('should display placeholder content when no friends images exist', async ({ page }) => {
    // Mock API response with no friends images
    await page.route('/api/gallery', async route => {
      const json = [
        {
          id: 1,
          imageUrl: '/test-image.jpg',
          alt: 'Villa Image',
          category: 'triple-room',
          description: 'Regular villa image',
          tags: 'triple-room,room'
        }
      ];
      await route.fulfill({ json });
    });

    await page.goto('/friends');
    
    // Check for placeholder content
    const placeholder = page.locator('text=Our Friends Gallery Coming Soon');
    await expect(placeholder).toBeVisible();
    
    // Check for explanation text
    const explanation = page.locator('text=currently building our friends');
    await expect(explanation).toBeVisible();
    
    // Check for what you'll find list
    const staffItem = page.locator('text=dedicated villa staff');
    await expect(staffItem).toBeVisible();
  });

  test('should display team information sections', async ({ page }) => {
    await page.goto('/friends');
    
    // Check for "The Ko Lake Villa Family" section
    const familySection = page.locator('h2:has-text("Ko Lake Villa Family")');
    await expect(familySection).toBeVisible();
    
    // Check for team categories
    const villaTeam = page.locator('h3:has-text("Villa Team")');
    await expect(villaTeam).toBeVisible();
    
    const localPartners = page.locator('h3:has-text("Local Partners")');
    await expect(localPartners).toBeVisible();
    
    const extendedFamily = page.locator('h3:has-text("Extended Family")');
    await expect(extendedFamily).toBeVisible();
  });

  test('should handle loading state correctly', async ({ page }) => {
    // Delay API response to test loading state
    await page.route('/api/gallery', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({ json: [] });
    });

    await page.goto('/friends');
    
    // Check for loading spinner
    const loadingSpinner = page.locator('.animate-spin');
    await expect(loadingSpinner).toBeVisible();
    
    // Wait for loading to complete
    await expect(loadingSpinner).not.toBeVisible({ timeout: 2000 });
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/friends');
    
    // Check that content is visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that team sections are properly stacked
    const teamGrid = page.locator('.grid').filter({ hasText: /Villa Team/ });
    await expect(teamGrid).toBeVisible();
  });

  test('should handle image loading errors gracefully', async ({ page }) => {
    // Mock API with broken image URL
    await page.route('/api/gallery', async route => {
      const json = [
        {
          id: 1,
          imageUrl: '/broken-image.jpg',
          alt: 'Broken Image',
          category: 'friends-and-crew',
          description: 'Test image',
          tags: 'friends-and-crew'
        }
      ];
      await route.fulfill({ json });
    });

    await page.goto('/friends');
    
    // Image should still be present (will show placeholder on error)
    const imageCard = page.locator('img[alt="Broken Image"]');
    await expect(imageCard).toBeVisible();
  });

  test('should navigate back from friends page', async ({ page }) => {
    await page.goto('/friends');
    
    // Navigate to home via logo/navigation
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    
    // Navigate back to friends
    await page.goBack();
    await expect(page).toHaveURL('/friends');
    await expect(page.locator('h1')).toContainText('Friends & Crew');
  });
});