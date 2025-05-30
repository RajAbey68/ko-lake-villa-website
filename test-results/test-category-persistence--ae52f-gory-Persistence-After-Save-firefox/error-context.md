# Test info

- Name: TC011 - Category Persistence After Save
- Location: /home/runner/workspace/tests/test-category-persistence.spec.ts:3:1

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/runner/workspace/.cache/ms-playwright/firefox-1482/firefox/firefox
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
>  3 | test('TC011 - Category Persistence After Save', async ({ page }) => {
     | ^ Error: browserType.launch: Executable doesn't exist at /home/runner/workspace/.cache/ms-playwright/firefox-1482/firefox/firefox
   4 |   // Step 1: Login
   5 |   await page.goto('/admin/login');
   6 |   await page.fill('input[name="email"]', 'rajiv.abey@gmail.com');
   7 |   await page.fill('input[name="password"]', 'admin456');
   8 |   await page.click('button[type="submit"]');
   9 |   await page.waitForURL('**/admin/dashboard');
  10 |
  11 |   // Step 2: Go to Gallery
  12 |   await page.goto('/admin/gallery');
  13 |
  14 |   // Step 3: Click Edit on the first image
  15 |   const firstEditButton = page.locator('button[aria-label="Edit Image"]').first();
  16 |   await firstEditButton.click();
  17 |
  18 |   // Step 4: Change category
  19 |   const categorySelect = page.locator('select[name="category"]');
  20 |   await categorySelect.selectOption('pool-deck');
  21 |
  22 |   // Step 5: Click Save
  23 |   await page.click('button:text("Save Tags")');
  24 |
  25 |   // Step 6: Reload the page
  26 |   await page.reload();
  27 |
  28 |   // Step 7: Confirm new category remains set
  29 |   const newCategory = await page.locator('select[name="category"]').inputValue();
  30 |   expect(newCategory).toBe('pool-deck');
  31 | });
```