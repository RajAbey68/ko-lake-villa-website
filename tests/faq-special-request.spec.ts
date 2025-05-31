import { test, expect } from '@playwright/test';

test.describe('FAQ Page & Special Request Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/faq');
  });

  test('should display FAQ page with house rules and common questions', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('FAQ & House Rules - Ko Lake Villa');
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
    
    // Check house rules section
    await expect(page.getByRole('heading', { name: '🏠 Rules of the House' })).toBeVisible();
    
    // Verify key house rules are displayed
    await expect(page.locator('text=Check-in: 2:00 PM | Check-out: 11:00 AM')).toBeVisible();
    await expect(page.locator('text=No smoking indoors')).toBeVisible();
    await expect(page.locator('text=Respect quiet hours after 10:00 PM')).toBeVisible();
    await expect(page.locator('text=Outside guests must be pre-approved')).toBeVisible();
    await expect(page.locator('text=Pets allowed on request')).toBeVisible();
    await expect(page.locator('text=Breakages must be reported')).toBeVisible();
    await expect(page.locator('text=Use of pool at own risk')).toBeVisible();
  });

  test('should display common questions and answers', async ({ page }) => {
    // Check common questions section
    await expect(page.getByRole('heading', { name: 'Common Questions' })).toBeVisible();
    
    // Verify some key FAQ items are present
    await expect(page.locator('text=What are the check-in and check-out times?')).toBeVisible();
    await expect(page.locator('text=Is smoking allowed on the property?')).toBeVisible();
    await expect(page.locator('text=What are the quiet hours?')).toBeVisible();
    await expect(page.locator('text=Can I bring guests who are not staying overnight?')).toBeVisible();
    await expect(page.locator('text=Are pets allowed?')).toBeVisible();
    await expect(page.locator('text=Is Wi-Fi available throughout the property?')).toBeVisible();
    await expect(page.locator('text=Can you arrange transportation from the airport?')).toBeVisible();
  });

  test('should display special request form with all required fields', async ({ page }) => {
    // Check special request form heading
    await expect(page.getByRole('heading', { name: 'Submit a Special Request' })).toBeVisible();
    
    // Check form description
    await expect(page.locator('text=Have specific needs? Let us know about dietary requirements, mobility assistance, or event setup needs.')).toBeVisible();
    
    // Check all form fields are present
    await expect(page.getByLabel('Check-in Date')).toBeVisible();
    await expect(page.getByLabel('Check-out Date')).toBeVisible();
    await expect(page.getByLabel('Number of People')).toBeVisible();
    await expect(page.getByLabel('Other Notes (Dietary / Mobility / Event setup)')).toBeVisible();
    
    // Check submit button
    await expect(page.getByRole('button', { name: 'Submit Request' })).toBeVisible();
  });

  test('should validate required fields in special request form', async ({ page }) => {
    // Try to submit form without filling required fields
    await page.getByRole('button', { name: 'Submit Request' }).click();
    
    // Check for validation messages
    await expect(page.locator('text=Check-in date is required')).toBeVisible();
    await expect(page.locator('text=Check-out date is required')).toBeVisible();
    await expect(page.locator('text=Number of people is required')).toBeVisible();
  });

  test('should accept valid dates and numbers in special request form', async ({ page }) => {
    // Fill check-in date
    await page.fill('input[name="checkin"]', '2025-08-01');
    await expect(page.getByDisplayValue('2025-08-01')).toBeVisible();
    
    // Fill check-out date
    await page.fill('input[name="checkout"]', '2025-08-05');
    await expect(page.getByDisplayValue('2025-08-05')).toBeVisible();
    
    // Fill number of people
    await page.fill('input[name="people"]', '4');
    await expect(page.getByDisplayValue('4')).toBeVisible();
    
    // Fill notes
    await page.fill('textarea[name="notes"]', 'Vegan meals, baby cot needed.');
    await expect(page.getByDisplayValue('Vegan meals, baby cot needed.')).toBeVisible();
  });

  test('should submit special request successfully with all fields', async ({ page }) => {
    // Fill complete form
    await page.fill('input[name="checkin"]', '2025-08-01');
    await page.fill('input[name="checkout"]', '2025-08-05');
    await page.fill('input[name="people"]', '4');
    await page.fill('textarea[name="notes"]', 'Vegan meals, baby cot needed.');
    
    // Mock successful API response
    await page.route('/api/special-request', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Special request submitted successfully' })
      });
    });
    
    // Submit form
    await page.getByRole('button', { name: 'Submit Request' }).click();
    
    // Check for success message
    await expect(page.locator('text=Request submitted successfully')).toBeVisible({ timeout: 5000 });
  });

  test('should reset form after successful submission', async ({ page }) => {
    // Fill form
    await page.fill('input[name="checkin"]', '2025-08-01');
    await page.fill('input[name="checkout"]', '2025-08-05');
    await page.fill('input[name="people"]', '4');
    await page.fill('textarea[name="notes"]', 'Test notes for form reset.');
    
    // Mock successful API response
    await page.route('/api/special-request', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Submit form
    await page.getByRole('button', { name: 'Submit Request' }).click();
    
    // Wait for success message
    await expect(page.locator('text=Request submitted successfully')).toBeVisible({ timeout: 5000 });
    
    // Check form is reset
    await expect(page.getByDisplayValue('2025-08-01')).not.toBeVisible();
    await expect(page.getByDisplayValue('2025-08-05')).not.toBeVisible();
    await expect(page.getByDisplayValue('4')).not.toBeVisible();
    await expect(page.getByDisplayValue('Test notes for form reset.')).not.toBeVisible();
  });

  test('should handle form submission errors gracefully', async ({ page }) => {
    // Fill form
    await page.fill('input[name="checkin"]', '2025-08-01');
    await page.fill('input[name="checkout"]', '2025-08-05');
    await page.fill('input[name="people"]', '4');
    
    // Mock error response
    await page.route('/api/special-request', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    // Submit form
    await page.getByRole('button', { name: 'Submit Request' }).click();
    
    // Check for error message
    await expect(page.locator('text=Failed to submit request')).toBeVisible({ timeout: 5000 });
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check key elements are visible on mobile
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '🏠 Rules of the House' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Submit a Special Request' })).toBeVisible();
    
    // Check form fields are accessible on mobile
    await expect(page.getByLabel('Check-in Date')).toBeVisible();
    await expect(page.getByLabel('Check-out Date')).toBeVisible();
    await expect(page.getByLabel('Number of People')).toBeVisible();
    await expect(page.getByLabel('Other Notes (Dietary / Mobility / Event setup)')).toBeVisible();
  });

  test('should have proper navigation from header', async ({ page }) => {
    // Go to home page first
    await page.goto('/');
    
    // Click FAQ link in navigation
    await page.getByRole('link', { name: 'FAQ' }).click();
    
    // Verify we're on the FAQ page
    await expect(page).toHaveURL('/faq');
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
  });
});