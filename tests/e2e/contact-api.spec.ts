import { test, expect } from '@playwright/test';

test('POST /api/contact validates and rate-limits', async ({ request, baseURL }) => {
  // First call with missing fields -> 400
  const bad = await request.post('/api/contact', { data: { name: '', email: 'nope', message: '' }, headers: { Origin: baseURL! } });
  expect([400,403,429]).toContain(bad.status());

  // Good call -> 200 (or 403 if origin not whitelisted)
  const good = await request.post('/api/contact', { data: { name: 'QA', email: 'qa@kolakevilla.com', message: 'Hello' }, headers: { Origin: baseURL! } });
  expect([200,403]).toContain(good.status());

  // Burst to trigger 429 eventually (tolerate infra variance)
  let hit429 = false;
  for (let i=0; i<15; i++) {
    const r = await request.post('/api/contact', { data: { name: 'QA', email: 'qa@kolakevilla.com', message: 'Hello' }, headers: { Origin: baseURL! } });
    if (r.status() === 429) { hit429 = true; break; }
  }
  expect(hit429).toBeTruthy();
});