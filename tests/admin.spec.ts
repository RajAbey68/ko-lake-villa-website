import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

test.describe('Admin console', () => {
  test('loads /admin (login OR dashboard)', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' });
    const hasLogin = await page.getByRole('heading', { name: /login|sign ?in/i }).first().isVisible().catch(() => false);
    const maybeDashboard = await page.getByRole('heading', { name: /admin|dashboard|analytics/i }).first().isVisible().catch(() => false);
    expect(hasLogin || maybeDashboard).toBeTruthy();
  });

  test('no invisible overlay blocks header clicks on admin routes', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' });
    for (const [x, y] of [[10, 10], [150, 10], [300, 10]]) {
      const topTag = await page.evaluate(([xx, yy]) => {
        const el = document.elementFromPoint(xx, yy);
        return el ? (el as HTMLElement).tagName + ':' + (el as HTMLElement).className : 'NULL';
      }, [x, y]);
      expect(topTag).not.toMatch(/overlay|backdrop|modal|drawer/i);
    }
  });

  test.describe('with credentials', () => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'ADMIN_EMAIL/ADMIN_PASSWORD not provided');
    
    test('login succeeds', async ({ page }) => {
      await page.goto('/admin', { waitUntil: 'networkidle' });
      const email = page.getByLabel(/email/i).first().or(page.getByPlaceholder(/email/i));
      const pass = page.getByLabel(/password/i).first().or(page.getByPlaceholder(/password/i));
      await email.fill(ADMIN_EMAIL);
      await pass.fill(ADMIN_PASSWORD);
      const btn = page.getByRole('button', { name: /sign ?in|log ?in|continue/i }).first();
      await btn.click();
      await expect(page).toHaveURL(/\/admin(\/dashboard)?/);
      await expect(page.locator('h1, h2')).toContainText(/admin|dashboard|analytics/i, { timeout: 10000 });
    });
    
    test('admin nav is clickable', async ({ page }) => {
      await page.goto('/admin', { waitUntil: 'networkidle' });
      const target = page.getByRole('link', { name: /gallery|content|bookings|messages/i }).first();
      await target.click();
      await expect(page).toHaveURL(/\/admin\/(gallery|content|bookings|messages)/);
    });
  });
});