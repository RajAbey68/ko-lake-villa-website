import { inLateWindow, lastSunday, priceFromWeekly } from '@/lib/pricing-rules';

test('late window is Sun..Wed inclusive', () => {
  const anySun = new Date('2025-08-10T12:00:00Z'); // a Sunday UTC
  const sun = new Date(lastSunday(anySun));
  const mon = new Date(sun); mon.setDate(sun.getDate()+1);
  const wed = new Date(sun); wed.setDate(sun.getDate()+3);
  const thu = new Date(sun); thu.setDate(sun.getDate()+4);

  expect(inLateWindow(sun)).toBe(true);
  expect(inLateWindow(mon)).toBe(true);
  expect(inLateWindow(wed)).toBe(true);
  expect(inLateWindow(thu)).toBe(false);
});

test('pricing applies 10% direct and 15% late when in window', () => {
  const sun = new Date('2025-08-10T12:00:00Z');
  const p = priceFromWeekly({ weeklyAirbnb: 700, now: sun });
  // nightly=100 → total 25% off → 75
  expect(p.nightlyAirbnb).toBe(100);
  expect(p.final).toBe(75);
});
