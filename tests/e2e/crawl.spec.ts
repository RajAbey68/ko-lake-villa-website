import { test, expect } from '@playwright/test';

test('crawl internal links depth=2', async ({ page, context }) => {
  const visited = new Set<string>();
  const queue: string[] = ['/'];

  const isInternal = (url: string) => {
    try {
      const u = new URL(url, page.url());
      return u.origin === (process.env.BASE_URL || 'http://127.0.0.1:3000');
    } catch { return false; }
  };

  while (queue.length && visited.size < 50) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('h1, [role="heading"]')).toHaveCountGreaterThan(0);

    const links = await page.$$eval('a[href]', as => as.map(a => (a as HTMLAnchorElement).getAttribute('href') || '').filter(Boolean));
    for (const href of links) {
      if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      if (!href.startsWith('/')) continue;
      if (path.split('/').length > 3) continue; // depth guard
      if (!visited.has(href) && !queue.includes(href)) queue.push(href);
    }
  }
});