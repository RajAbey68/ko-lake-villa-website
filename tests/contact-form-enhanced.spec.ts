import { test, expect } from '@playwright/test';

test.describe('Enhanced Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display all required form fields', async ({ page }) => {
    // Check original fields
    await expect(page.getByLabel('Your Name')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Subject')).toBeVisible();
    await expect(page.getByLabel('Message')).toBeVisible();

    // Check new fields
    await expect(page.getByLabel('Contact Number')).toBeVisible();
    await expect(page.getByLabel('Timezone')).toBeVisible();
    await expect(page.getByLabel('Are you familiar with this region?')).toBeVisible();
  });

  test('should have correct placeholders and default values', async ({ page }) => {
    // Check phone placeholder
    await expect(page.getByPlaceholder('+94 71 123 4567')).toBeVisible();
    
    // Check timezone default selection
    await expect(page.getByRole('combobox')).toContainText('Sri Lanka (GMT+5:30)');
    
    // Check radio buttons
    await expect(page.getByLabel('Yes')).toBeVisible();
    await expect(page.getByLabel('No')).toBeVisible();
  });

  test('should allow timezone selection', async ({ page }) => {
    // Click timezone dropdown
    await page.getByRole('combobox').click();
    
    // Check timezone options are available
    await expect(page.getByRole('option', { name: /Sri Lanka/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /London/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /New York/i })).toBeVisible();
    
    // Select a different timezone
    await page.getByRole('option', { name: /London/i }).click();
    
    // Verify selection
    await expect(page.getByRole('combobox')).toContainText('London');
  });

  test('should allow familiarity selection', async ({ page }) => {
    // Test Yes option
    await page.getByLabel('Yes').click();
    await expect(page.getByLabel('Yes')).toBeChecked();
    await expect(page.getByLabel('No')).not.toBeChecked();
    
    // Test No option
    await page.getByLabel('No').click();
    await expect(page.getByLabel('No')).toBeChecked();
    await expect(page.getByLabel('Yes')).not.toBeChecked();
  });

  test('should validate phone number field', async ({ page }) => {
    // Fill form with invalid phone
    await page.getByLabel('Your Name').fill('John Doe');
    await page.getByLabel('Email Address').fill('john@example.com');
    await page.getByLabel('Contact Number').fill('123'); // Invalid short number
    await page.getByLabel('Subject').fill('Test Subject');
    await page.getByLabel('Message').fill('This is a test message for validation.');
    await page.getByLabel('Yes').click();
    
    // Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for validation error
    await expect(page.locator('text=Please enter a valid phone number')).toBeVisible();
  });

  test('should require familiarity selection', async ({ page }) => {
    // Fill form without selecting familiarity
    await page.getByLabel('Your Name').fill('John Doe');
    await page.getByLabel('Email Address').fill('john@example.com');
    await page.getByLabel('Contact Number').fill('+94 71 123 4567');
    await page.getByLabel('Subject').fill('Test Subject');
    await page.getByLabel('Message').fill('This is a test message for validation.');
    
    // Submit form without familiarity selection
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for validation error
    await expect(page.locator('text=Please select your familiarity with the region')).toBeVisible();
  });

  test('should submit form successfully with all fields', async ({ page }) => {
    // Fill complete form
    await page.getByLabel('Your Name').fill('John Doe');
    await page.getByLabel('Email Address').fill('john@example.com');
    await page.getByLabel('Contact Number').fill('+94 71 123 4567');
    
    // Select timezone
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Sri Lanka/i }).click();
    
    // Select familiarity
    await page.getByLabel('Yes').click();
    
    await page.getByLabel('Subject').fill('Booking Inquiry');
    await page.getByLabel('Message').fill('I would like to inquire about availability for my upcoming trip to Sri Lanka.');
    
    // Mock successful API response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for success message (toast notification)
    await expect(page.locator('text=Message sent successfully')).toBeVisible({ timeout: 5000 });
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check all fields are visible and accessible on mobile
    await expect(page.getByLabel('Contact Number')).toBeVisible();
    await expect(page.getByLabel('Timezone')).toBeVisible();
    await expect(page.getByLabel('Are you familiar with this region?')).toBeVisible();
    
    // Check radio buttons are properly spaced
    const radioGroup = page.locator('[role="radiogroup"]');
    await expect(radioGroup).toBeVisible();
    
    // Test interaction on mobile
    await page.getByLabel('Yes').click();
    await expect(page.getByLabel('Yes')).toBeChecked();
  });

  test('should handle form reset correctly', async ({ page }) => {
    // Fill form
    await page.getByLabel('Your Name').fill('John Doe');
    await page.getByLabel('Contact Number').fill('+94 71 123 4567');
    await page.getByLabel('Yes').click();
    
    // Mock successful submission to trigger reset
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.getByLabel('Email Address').fill('john@example.com');
    await page.getByLabel('Subject').fill('Test');
    await page.getByLabel('Message').fill('Test message for reset functionality.');
    
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Wait for success and form reset
    await expect(page.locator('text=Message sent successfully')).toBeVisible({ timeout: 5000 });
    
    // Check form is reset
    await expect(page.getByLabel('Your Name')).toHaveValue('');
    await expect(page.getByLabel('Contact Number')).toHaveValue('');
    await expect(page.getByLabel('Yes')).not.toBeChecked();
    await expect(page.getByLabel('No')).not.toBeChecked();
  });
});