import { computeDirectAndLastMinute } from '@/lib/pricing';

it('always has 10% direct', () => {
  const r = computeDirectAndLastMinute(100, new Date('2025-08-04'), new Date('2025-08-01')); // Mon, >3 days
  expect(r.totalPct).toBe(10);
});

it('adds 15% last-minute Sun–Thu within 3 days', () => {
  const r = computeDirectAndLastMinute(100, new Date('2025-08-05'), new Date('2025-08-03')); // Tue, 2 days
  expect(r.totalPct).toBe(25);
});