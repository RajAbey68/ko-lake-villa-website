import { test, expect } from '@playwright/test';

test.describe('Contact Page - Restored Features', () => {
  test('Shows all contacts, aliases, WhatsApp & form submits', async ({ page }) => {
    await page.goto('/contact');

    // Check all contact roles and phone numbers are visible
    for (const txt of [
      'General Manager', '+94 71 776 5780',
      'Villa Team Lead', '+94 77 315 0602',
      'Owner', '+94 71 173 0345'
    ]) {
      await expect(page.getByText(new RegExp(txt))).toBeVisible();
    }

    // Check all email aliases are visible
    for (const addr of ['stay@kolakevilla.com', 'bookings@kolakevilla.com', 'events@kolakevilla.com', 'info@kolakevilla.com']) {
      await expect(page.getByText(addr)).toBeVisible();
    }

    // Verify WhatsApp links exist (3 contacts)
    await expect(page.locator('a[href*="wa.me"]')).toHaveCount(3);

    // Verify tel: links with proper E.164 encoding
    const telLinks = page.locator('a[href^="tel:"]');
    await expect(telLinks).toHaveCount(3);
    const firstTel = await telLinks.first().getAttribute('href');
    expect(firstTel).toContain('tel:%2B94');

    // Verify mailto links with prefilled subjects
    const mailtoLinks = page.locator('a[href^="mailto:"]');
    await expect(mailtoLinks).toHaveCountGreaterThan(3);
    const firstMailto = await mailtoLinks.first().getAttribute('href');
    expect(firstMailto).toContain('subject=');
  });

  test('Contact form validates and submits', async ({ page }) => {
    await page.goto('/contact');

    // Try to submit empty form - should be prevented by HTML5 validation
    await page.click('button:has-text("Send")');
    
    // Check that form hasn't submitted (no status message)
    await expect(page.getByText(/Thanks|failed/i)).not.toBeVisible();

    // Fill required fields
    await page.fill('input[placeholder="Your name"]', 'Test User');
    await page.fill('input[placeholder="Email"]', 'test@example.com');
    await page.fill('textarea[placeholder="Message"]', 'This is a test message from E2E tests');

    // Fill optional fields
    await page.fill('input[placeholder*="Phone"]', '+94 71 776 5780');
    await page.fill('input[placeholder="Country"]', 'Sri Lanka');

    // Submit form
    await page.click('button:has-text("Send")');

    // Wait for response (either success or error depending on origin)
    await expect(page.getByText(/Thanks|Send failed/i)).toBeVisible({ timeout: 5000 });
  });

  test('Form shows loading state during submission', async ({ page }) => {
    await page.goto('/contact');

    // Fill form
    await page.fill('input[placeholder="Your name"]', 'Test');
    await page.fill('input[placeholder="Email"]', 'test@test.com');
    await page.fill('textarea[placeholder="Message"]', 'Test');

    // Start submission
    const submitPromise = page.click('button:has-text("Send")');

    // Check for loading state
    await expect(page.getByText('Sending…')).toBeVisible();

    await submitPromise;
  });

  test('International phone helper text is visible', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.getByText(/International callers.*WhatsApp.*\+94/i)).toBeVisible();
  });

  test('Email aliases have correct labels', async ({ page }) => {
    await page.goto('/contact');

    const expectedAliases = [
      { label: 'Stay / General', email: 'stay@kolakevilla.com' },
      { label: 'Bookings', email: 'bookings@kolakevilla.com' },
      { label: 'Events', email: 'events@kolakevilla.com' },
      { label: 'Info', email: 'info@kolakevilla.com' }
    ];

    for (const alias of expectedAliases) {
      const link = page.locator(`a[href*="${alias.email}"]`);
      await expect(link).toBeVisible();
      await expect(link).toContainText(alias.label);
    }
  });

  test('WhatsApp links have proper message parameter', async ({ page }) => {
    await page.goto('/contact');

    const waLinks = page.locator('a[href*="wa.me"]');
    const firstWaLink = await waLinks.first().getAttribute('href');
    
    expect(firstWaLink).toContain('text=');
    expect(decodeURIComponent(firstWaLink!)).toContain('Ko Lake Villa');
  });

  test('Call buttons have proper aria-labels', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByRole('link', { name: /Call General Manager/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Call Villa Team Lead/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Call Owner/i })).toBeVisible();
  });

  test('Form clears after successful submission', async ({ page }) => {
    await page.goto('/contact');

    // Fill and submit form
    await page.fill('input[placeholder="Your name"]', 'Test Clear');
    await page.fill('input[placeholder="Email"]', 'clear@test.com');
    await page.fill('textarea[placeholder="Message"]', 'Test message');
    
    // Mock successful API response
    await page.route('/api/contact', async route => {
      await route.fulfill({ status: 200, json: { ok: true } });
    });

    await page.click('button:has-text("Send")');
    
    // Wait for success message
    await expect(page.getByText(/Thanks/i)).toBeVisible();

    // Check that form fields are cleared
    await expect(page.locator('input[placeholder="Your name"]')).toHaveValue('');
    await expect(page.locator('input[placeholder="Email"]')).toHaveValue('');
    await expect(page.locator('textarea[placeholder="Message"]')).toHaveValue('');
  });
});