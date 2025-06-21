
// Ko Lake Villa - Booking Flow Integration Tests
const { test, expect } = require('@playwright/test');

test.describe('Booking Flow Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Complete booking journey - happy path', async ({ page }) => {
    // Navigate to booking page
    await page.click('text=Book Now');
    await expect(page).toHaveURL('/booking');

    // Fill out guest information
    await page.fill('[data-testid="guest-name"]', 'John Doe');
    await page.fill('[data-testid="guest-email"]', 'john@example.com');
    await page.fill('[data-testid="guest-phone"]', '+1234567890');

    // Select dates
    await page.click('[data-testid="checkin-date"]');
    await page.click('[data-testid="date-next-month"]');
    await page.click('[data-testid="date-15"]');
    
    await page.click('[data-testid="checkout-date"]');
    await page.click('[data-testid="date-18"]');

    // Select number of guests
    await page.selectOption('[data-testid="guest-count"]', '4');

    // Add special requests
    await page.fill('[data-testid="special-requests"]', 'Early check-in requested');

    // Submit booking form
    await page.click('[data-testid="submit-booking"]');

    // Verify confirmation page
    await expect(page).toHaveURL('/booking/confirmation');
    await expect(page.locator('[data-testid="booking-confirmation"]')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('Booking validation - invalid email', async ({ page }) => {
    await page.goto('/booking');
    
    await page.fill('[data-testid="guest-name"]', 'John Doe');
    await page.fill('[data-testid="guest-email"]', 'invalid-email');
    await page.click('[data-testid="submit-booking"]');

    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toContainText('valid email');
  });

  test('Date validation - past dates', async ({ page }) => {
    await page.goto('/booking');
    
    await page.fill('[data-testid="guest-name"]', 'John Doe');
    await page.fill('[data-testid="guest-email"]', 'john@example.com');
    
    // Try to select a past date
    await page.click('[data-testid="checkin-date"]');
    await page.click('[data-testid="date-prev-month"]');
    await page.click('[data-testid="date-15"]');

    await expect(page.locator('[data-testid="date-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="date-error"]')).toContainText('future date');
  });

  test('Pricing calculation', async ({ page }) => {
    await page.goto('/booking');
    
    // Select 3 nights
    await page.click('[data-testid="checkin-date"]');
    await page.click('[data-testid="date-next-month"]');
    await page.click('[data-testid="date-15"]');
    
    await page.click('[data-testid="checkout-date"]');
    await page.click('[data-testid="date-18"]');

    // Verify pricing calculation
    await expect(page.locator('[data-testid="nights-count"]')).toContainText('3 nights');
    
    const basePrice = await page.locator('[data-testid="base-price"]').textContent();
    const totalPrice = await page.locator('[data-testid="total-price"]').textContent();
    
    expect(basePrice).toMatch(/\$\d+/);
    expect(totalPrice).toMatch(/\$\d+/);
  });
});

test.describe('Booking API Integration', () => {
  test('Create booking via API', async ({ request }) => {
    const bookingData = {
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      guestPhone: '+1234567890',
      checkinDate: '2024-06-15',
      checkoutDate: '2024-06-18',
      guestCount: 4,
      specialRequests: 'Early check-in'
    };

    const response = await request.post('/api/booking', {
      data: bookingData
    });

    expect(response.status()).toBe(201);
    
    const responseData = await response.json();
    expect(responseData.bookingId).toBeDefined();
    expect(responseData.status).toBe('confirmed');
  });

  test('Get booking details via API', async ({ request }) => {
    // First create a booking
    const bookingData = {
      guestName: 'Jane Smith',
      guestEmail: 'jane@example.com',
      checkinDate: '2024-07-01',
      checkoutDate: '2024-07-03',
      guestCount: 2
    };

    const createResponse = await request.post('/api/booking', {
      data: bookingData
    });

    const { bookingId } = await createResponse.json();

    // Then retrieve it
    const getResponse = await request.get(`/api/booking/${bookingId}`);
    expect(getResponse.status()).toBe(200);

    const booking = await getResponse.json();
    expect(booking.guestName).toBe('Jane Smith');
    expect(booking.guestEmail).toBe('jane@example.com');
  });

  test('Update booking via API', async ({ request }) => {
    // Create booking
    const bookingData = {
      guestName: 'Bob Wilson',
      guestEmail: 'bob@example.com',
      checkinDate: '2024-08-01',
      checkoutDate: '2024-08-03',
      guestCount: 3
    };

    const createResponse = await request.post('/api/booking', {
      data: bookingData
    });

    const { bookingId } = await createResponse.json();

    // Update booking
    const updateData = {
      guestCount: 4,
      specialRequests: 'Late checkout requested'
    };

    const updateResponse = await request.patch(`/api/booking/${bookingId}`, {
      data: updateData
    });

    expect(updateResponse.status()).toBe(200);

    const updatedBooking = await updateResponse.json();
    expect(updatedBooking.guestCount).toBe(4);
    expect(updatedBooking.specialRequests).toBe('Late checkout requested');
  });
});
