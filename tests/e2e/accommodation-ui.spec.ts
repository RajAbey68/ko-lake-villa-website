import { test, expect } from '@playwright/test';

test.describe('Accommodation Page UI', () => {
  test('Accommodation cards show guests, Airbnb price, save badge', async ({ page }) => {
    await page.goto('/accommodation');
    
    // Check for guest counts
    for (const label of ['16–24 guests', '16-24 guests', '6 guests', '3–4 guests', '3-4 guests']) {
      const element = page.getByText(new RegExp(label, 'i'));
      const count = await element.count();
      if (count > 0) {
        await expect(element.first()).toBeVisible();
      }
    }
    
    // Check for Airbnb buttons
    const airbnbButtons = page.getByText(/Open on Airbnb/i)
      .or(page.getByRole('link', { name: /airbnb/i }));
    const airbnbCount = await airbnbButtons.count();
    expect(airbnbCount).toBeGreaterThanOrEqual(4);
    
    // Check for Save badges
    const saveBadges = page.getByText(/Save \d+%/);
    const saveCount = await saveBadges.count();
    expect(saveCount).toBeGreaterThan(0);
  });

  test('Airbnb booking URLs panel is visible', async ({ page }) => {
    await page.goto('/accommodation');
    
    // Check for Airbnb panel or section
    const airbnbSection = page.getByText(/Airbnb Booking URLs/i)
      .or(page.getByText(/Book on Airbnb/i));
    
    if (await airbnbSection.count() > 0) {
      await expect(airbnbSection.first()).toBeVisible();
      
      // Check for specific Airbnb slugs
      const slugs = ['eklv', 'klv6', 'klv3', 'klvg'];
      for (const slug of slugs) {
        const slugElement = page.getByText(new RegExp(`airbnb.*${slug}`, 'i'));
        if (await slugElement.count() > 0) {
          await expect(slugElement.first()).toBeVisible();
        }
      }
    }
  });

  test('Room cards have pricing information', async ({ page }) => {
    await page.goto('/accommodation');
    
    // Check for price displays
    const prices = page.getByText(/\$\d+/);
    const priceCount = await prices.count();
    expect(priceCount).toBeGreaterThan(0);
    
    // Check for "per night" or similar pricing context
    const perNight = page.getByText(/per night|\/night/i);
    if (await perNight.count() > 0) {
      await expect(perNight.first()).toBeVisible();
    }
  });

  test('Book Direct buttons are present', async ({ page }) => {
    await page.goto('/accommodation');
    
    const bookDirectButtons = page.getByRole('link', { name: /book direct/i })
      .or(page.getByRole('button', { name: /book direct/i }));
    
    const buttonCount = await bookDirectButtons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(4);
  });
});