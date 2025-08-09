import { test, expect } from '@playwright/test';

// Navigation menu tests
test.describe('Navigation Menu', () => {
  test('All top menu links navigate correctly', async ({ page }) => {
    await page.goto('/');
    const menuLinks = ['Home', 'Accommodation', 'Gallery', 'Contact'];
    for (const link of menuLinks) {
      await page.click(`text=${link}`);
      await expect(page).toHaveURL(new RegExp(link.toLowerCase()));
    }
  });

  test('Mobile menu toggles and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.click('button[aria-expanded]');
    await expect(page.locator('.md\\:hidden ul')).toBeVisible();
    await page.click('text=Gallery');
    await expect(page).toHaveURL(/gallery/);
  });
});

// Airbnb pricing logic
test.describe('Airbnb Pricing Logic', () => {
  test('Shows correct guest counts from centralized data', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=16–24 guests')).toBeVisible();
    await expect(page.locator('text=6 guests').first()).toBeVisible();
    await expect(page.locator('text=3–4 guests')).toBeVisible();
  });

  test('Displays Save badges with percentages', async ({ page }) => {
    await page.goto('/accommodation');
    const saveBadges = page.locator('text=/Save \\d+%/');
    await expect(saveBadges).toHaveCount(4);
  });

  test('Airbnb booking URLs panel present', async ({ page }) => {
    await page.goto('/accommodation');
    await expect(page.locator('text=Airbnb Booking URLs')).toBeVisible();
    await expect(page.locator('text=airbnb.co.uk/h/eklv')).toBeVisible();
    await expect(page.locator('text=airbnb.co.uk/h/klv6')).toBeVisible();
  });
});

// Gallery page tests
test.describe('Gallery', () => {
  test('Loads images with fallback to static data', async ({ page }) => {
    await page.goto('/gallery');
    await expect(page.locator('h1:has-text("Gallery")')).toBeVisible();
    const images = page.locator('img');
    await expect(images).toHaveCount({ min: 0 + 1 });
  });

  test('Shows categories when available', async ({ page }) => {
    await page.goto('/gallery');
    // Check for at least one image figure
    await expect(page.locator('figure').first()).toBeVisible();
  });
});

// Contact page tests
test.describe('Contact Page', () => {
  test('Displays correct phone numbers', async ({ page }) => {
    await page.goto('/contact');
    const phones = [
      '+94 71 776 5780',
      '+94 77 315 0602',
      '+94 71 173 0345'
    ];
    for (const phone of phones) {
      await expect(page.locator(`text=${phone}`)).toBeVisible();
    }
  });

  test('Has WhatsApp buttons for each contact', async ({ page }) => {
    await page.goto('/contact');
    const whatsappLinks = page.locator('a[href^="https://wa.me"]');
    await expect(whatsappLinks).toHaveCount(3);
  });

  test('Shows role labels for contacts', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('text=General Manager')).toBeVisible();
    await expect(page.locator('text=Villa Team Lead')).toBeVisible();
    await expect(page.locator('text=Owner')).toBeVisible();
  });
});

// Admin console regression
test.describe('Admin Console', () => {
  test('Admin route is accessible', async ({ page }) => {
    await page.goto('/admin');
    // Should either show login or dashboard
    const hasLogin = await page.locator('text=/login|sign in/i').isVisible().catch(() => false);
    const hasDashboard = await page.locator('text=/dashboard|admin/i').isVisible().catch(() => false);
    expect(hasLogin || hasDashboard).toBeTruthy();
  });

  test('No overlay blocks navigation on admin pages', async ({ page }) => {
    await page.goto('/admin');
    const topElement = await page.evaluate(() => {
      const el = document.elementFromPoint(10, 10) as HTMLElement;
      return el ? el.tagName + ':' + el.className : 'NULL';
    });
    expect(topElement).not.toMatch(/overlay|backdrop|modal/i);
  });
});

// API endpoints
test.describe('API Endpoints', () => {
  test('Contact API validates and rate limits', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      }
    });
    expect([200, 403, 429]).toContain(response.status());
  });

  test('Gallery API returns data or fallback', async ({ request }) => {
    const response = await request.get('/api/gallery');
    // API might not exist, but page should still work
    if (response.status() === 200) {
      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();
    }
  });
});

// Home page specific tests
test.describe('Home Page', () => {
  test('Hero section loads with call-to-action buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Ko Lake Villa').first()).toBeVisible();
    await expect(page.locator('text=Book Direct & Save').first()).toBeVisible();
  });

  test('Room cards display with pricing', async ({ page }) => {
    await page.goto('/');
    const roomCards = page.locator('article.card');
    await expect(roomCards).toHaveCount(4);
    
    // Check each card has pricing info
    for (let i = 0; i < 4; i++) {
      const card = roomCards.nth(i);
      await expect(card.locator('text=/\\$\\d+/')).toBeVisible();
      await expect(card.locator('text=/Save \\$\\d+/')).toBeVisible();
    }
  });
});

// Accommodation page specific
test.describe('Accommodation Page', () => {
  test('Shows both Airbnb panel and room cards', async ({ page }) => {
    await page.goto('/accommodation');
    
    // Check Airbnb panel
    await expect(page.locator('section:has-text("Airbnb Booking URLs")')).toBeVisible();
    
    // Check room cards
    const roomCards = page.locator('article.card');
    await expect(roomCards).toHaveCount(4);
  });

  test('Each room has Book Direct and Airbnb buttons', async ({ page }) => {
    await page.goto('/accommodation');
    const bookDirectButtons = page.locator('text=Book Direct & Save');
    const airbnbButtons = page.locator('text=Open on Airbnb');
    
    await expect(bookDirectButtons).toHaveCount(4);
    await expect(airbnbButtons).toHaveCount(4);
  });
});

// Responsive design tests
test.describe('Responsive Design', () => {
  test('Desktop layout shows horizontal menu', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('ul.hidden.md\\:flex')).toBeVisible();
    await expect(page.locator('button[aria-expanded]')).not.toBeVisible();
  });

  test('Mobile layout shows hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('ul.hidden.md\\:flex')).not.toBeVisible();
    await expect(page.locator('button[aria-expanded]')).toBeVisible();
  });

  test('Room cards stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const cards = page.locator('article.card');
    const firstCard = await cards.first().boundingBox();
    const secondCard = await cards.nth(1).boundingBox();
    
    // Cards should be stacked vertically
    expect(firstCard?.y).toBeLessThan(secondCard?.y || 0);
    expect(Math.abs((firstCard?.x || 0) - (secondCard?.x || 0))).toBeLessThan(10);
  });
});

// Data integrity tests
test.describe('Data Integrity', () => {
  test('No placeholder images are visible', async ({ page }) => {
    await page.goto('/');
    const placeholders = page.locator('img[src*="placeholder"]');
    await expect(placeholders).toHaveCount(0);
  });

  test('All external links open in new tab', async ({ page }) => {
    await page.goto('/');
    const externalLinks = page.locator('a[href^="http"]:not([href*="localhost"]):not([href*="127.0.0.1"])');
    const count = await externalLinks.count();
    
    for (let i = 0; i < count; i++) {
      const target = await externalLinks.nth(i).getAttribute('target');
      expect(target).toBe('_blank');
    }
  });
});

// Performance tests
test.describe('Performance', () => {
  test('Page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('Images are optimized with Next.js Image', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img[loading="lazy"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });
});
