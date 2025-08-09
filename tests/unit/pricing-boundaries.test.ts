import { inLateWindow, lastSunday, priceFromWeekly, DIRECT_DISCOUNT, LATE_DISCOUNT } from '@/lib/pricing-rules';

describe('Pricing Boundaries and Edge Cases', () => {
  describe('Sunday calculation', () => {
    test('correctly identifies last Sunday from any day', () => {
      // Test from a Wednesday
      const wed = new Date('2025-01-15T12:00:00Z'); // Wednesday
      const sunday = lastSunday(wed);
      expect(sunday.getDay()).toBe(0); // Should be Sunday
      expect(sunday.getDate()).toBe(12); // Should be Jan 12
    });

    test('Sunday returns itself as last Sunday', () => {
      const sun = new Date('2025-01-12T12:00:00Z'); // Sunday
      const result = lastSunday(sun);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(12);
    });
  });

  describe('Late window boundaries', () => {
    test('Sunday 00:00 is in window', () => {
      const sun = new Date('2025-01-12T00:00:00Z');
      expect(inLateWindow(sun)).toBe(true);
    });

    test('Wednesday 23:59 is in window', () => {
      const wed = new Date('2025-01-15T23:59:59Z');
      expect(inLateWindow(wed)).toBe(true);
    });

    test('Thursday 00:00 is NOT in window', () => {
      const thu = new Date('2025-01-16T00:00:00Z');
      expect(inLateWindow(thu)).toBe(false);
    });

    test('Saturday is NOT in window', () => {
      const sat = new Date('2025-01-11T12:00:00Z');
      expect(inLateWindow(sat)).toBe(false);
    });
  });

  describe('Price calculations', () => {
    test('applies only direct discount outside window', () => {
      const friday = new Date('2025-01-17T12:00:00Z');
      const result = priceFromWeekly({ weeklyAirbnb: 700, now: friday });
      
      expect(result.directPct).toBe(DIRECT_DISCOUNT);
      expect(result.latePct).toBe(0);
      expect(result.totalPct).toBe(DIRECT_DISCOUNT);
      expect(result.final).toBe(90); // 100/night - 10% = 90
    });

    test('applies both discounts in window', () => {
      const monday = new Date('2025-01-13T12:00:00Z');
      const result = priceFromWeekly({ weeklyAirbnb: 700, now: monday });
      
      expect(result.directPct).toBe(DIRECT_DISCOUNT);
      expect(result.latePct).toBe(LATE_DISCOUNT);
      expect(result.totalPct).toBe(DIRECT_DISCOUNT + LATE_DISCOUNT);
      expect(result.final).toBe(75); // 100/night - 25% = 75
    });

    test('handles fractional weekly prices correctly', () => {
      const result = priceFromWeekly({ weeklyAirbnb: 999 }); // 142.71/night
      
      expect(result.nightlyAirbnb).toBe(142.71);
      expect(result.final).toBeLessThanOrEqual(142.71);
    });

    test('never produces negative prices', () => {
      // Even with hypothetical 100% discount
      const result = priceFromWeekly({ weeklyAirbnb: 100 });
      
      expect(result.final).toBeGreaterThanOrEqual(0);
    });

    test('savings calculation is accurate', () => {
      const result = priceFromWeekly({ weeklyAirbnb: 700 });
      
      const expectedSavings = result.nightlyAirbnb - result.final;
      expect(result.savings).toBeCloseTo(expectedSavings, 2);
    });
  });

  describe('Rounding precision', () => {
    test('prices are rounded to 2 decimal places', () => {
      const result = priceFromWeekly({ weeklyAirbnb: 333 }); // 47.57142857.../night
      
      const decimalPlaces = (result.final.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    test('savings are rounded to 2 decimal places', () => {
      const result = priceFromWeekly({ weeklyAirbnb: 333 });
      
      const decimalPlaces = (result.savings.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });
});
