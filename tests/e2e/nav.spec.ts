import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/accommodation', '/gallery', '/contact', '/admin'];

test.describe('Top navigation works', () => {
  for (const r of ROUTES) {
    test(\`route \${r} loads\`, async ({ page }) => {
      await page.goto(r);
      await expect(page).toHaveURL(new RegExp(\`\${r === '/' ? '/?$' : r + '$'}\`));
      // No full-screen overlay intercepting clicks at top
      const top = await page.evaluate(() => {
        const el = document.elementFromPoint(10, 10) as HTMLElement | null;
        return el ? (el.tagName + ':' + el.className) : 'NULL';
      });
      expect(top).not.toMatch(/overlay|backdrop|modal|drawer/i);
    });
  }
});

test('menu links navigate', async ({ page }) => {
  await page.goto('/');
  const labels = [/Home/i, /Accommodation/i, /Gallery/i, /Contact/i];
  for (const re of labels) {
    await page.getByRole('link', { name: re }).first().click();
    await expect(page).toHaveURL(/(\/$|\/accommodation$|\/gallery$|\/contact$)/);
  }
});

test('mobile menu toggles', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button').first().click();
  await page.getByRole('link', { name: /Gallery/i }).click();
  await expect(page).toHaveURL(/\/gallery$/);
});