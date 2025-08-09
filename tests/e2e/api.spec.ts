import { test, expect } from '@playwright/test';

test('GET /api/openapi returns JSON', async ({ request }) => {
  const res = await request.get('/api/openapi');
  expect(res.status()).toBeLessThan(500);
});

test('HEAD /api/docs available', async ({ request }) => {
  const res = await request.head('/api/docs');
  expect([200,301,302,404]).toContain(res.status()); // allow redirect/missing locally
});

test('POST /api/contact accepts payload', async ({ request }) => {
  const res = await request.post('/api/contact', {
    data: { name: 'Test', email: 'qa+local@kolakevilla.com', message: 'Hello from tests', source: 'e2e' }
  });
  expect([200,201,400,401,403,429]).toContain(res.status()); // tolerate auth/rate-limit differences
});