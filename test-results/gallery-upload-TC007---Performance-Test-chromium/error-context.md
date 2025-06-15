# Test info

- Name: TC007 - Performance Test
- Location: /home/runner/workspace/tests/gallery-upload.spec.ts:80:1

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/runner/workspace/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
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
   3 | test('TC001 - Open Upload Dialog', async ({ page }) => {
   4 |   await page.goto('http://localhost:5000/admin/gallery');
   5 |   
   6 |   // Debug: Log page content to see actual DOM
   7 |   console.log('Page content:', await page.content());
   8 |   
   9 |   // Check if upload button exists and is clickable
   10 |   const uploadButton = page.locator('button:has-text("Upload")');
   11 |   await expect(uploadButton).toBeVisible();
   12 |   
   13 |   // Click the upload button
   14 |   await uploadButton.click();
   15 |   
   16 |   // Verify upload dialog opens
   17 |   await expect(page.locator('text=Upload Image or Video')).toBeVisible();
   18 |   await expect(page.locator('text=Click to select an image or video')).toBeVisible();
   19 | });
   20 |
   21 | test('TC002 - Category Validation Required', async ({ page }) => {
   22 |   await page.goto('http://localhost:5000/admin/gallery');
   23 |   
   24 |   // Open upload dialog
   25 |   await page.click('button:has-text("Upload")');
   26 |   
   27 |   // Try to submit without selecting file or category
   28 |   const submitButton = page.locator('button:has-text("Upload Image")');
   29 |   await expect(submitButton).toBeDisabled();
   30 | });
   31 |
   32 | test('TC003 - Gallery Images Display', async ({ page }) => {
   33 |   await page.goto('http://localhost:5000/admin/gallery');
   34 |   
   35 |   // Check that gallery images are loading
   36 |   const galleryGrid = page.locator('[role="grid"]');
   37 |   await expect(galleryGrid).toBeVisible();
   38 |   
   39 |   // Verify images are present
   40 |   const images = page.locator('img');
   41 |   await expect(images.first()).toBeVisible();
   42 | });
   43 |
   44 | test('TC004 - Category Filter Functionality', async ({ page }) => {
   45 |   await page.goto('http://localhost:5000/admin/gallery');
   46 |   
   47 |   // Check category filter dropdown
   48 |   const categoryFilter = page.locator('select, [role="combobox"]').first();
   49 |   await expect(categoryFilter).toBeVisible();
   50 |   
   51 |   // Click to open dropdown
   52 |   await categoryFilter.click();
   53 |   
   54 |   // Verify categories are available
   55 |   await expect(page.locator('text=Pool Deck')).toBeVisible();
   56 |   await expect(page.locator('text=Family Suite')).toBeVisible();
   57 | });
   58 |
   59 | test('TC005 - AI Analysis Endpoint Ready', async ({ page }) => {
   60 |   // Test that the AI analysis endpoint is available
   61 |   const response = await page.request.post('http://localhost:5000/api/analyze-media', {
   62 |     data: {}
   63 |   });
   64 |   
   65 |   // Should return 400 (missing file) not 404 (endpoint not found)
   66 |   expect(response.status()).toBe(400);
   67 |   
   68 |   const responseBody = await response.json();
   69 |   expect(responseBody.error).toContain('Image file missing');
   70 | });
   71 |
   72 | test('TC006 - Tag Category Consistency Display', async ({ page }) => {
   73 |   await page.goto('http://localhost:5000/admin/gallery');
   74 |   
   75 |   // Check that the tag-category hint is displayed
   76 |   await expect(page.locator('text=Tag-Category Consistency')).toBeVisible();
   77 |   await expect(page.locator('text=automatically generated')).toBeVisible();
   78 | });
   79 |
>  80 | test('TC007 - Performance Test', async ({ page }) => {
      | ^ Error: browserType.launch: Executable doesn't exist at /home/runner/workspace/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
   81 |   const startTime = Date.now();
   82 |   
   83 |   await page.goto('http://localhost:5000/admin/gallery');
   84 |   
   85 |   // Wait for gallery to load
   86 |   await page.waitForSelector('[role="grid"]');
   87 |   
   88 |   const loadTime = Date.now() - startTime;
   89 |   
   90 |   // Should load within 3 seconds
   91 |   expect(loadTime).toBeLessThan(3000);
   92 | });
   93 |
   94 | test('TC008 - Mobile Responsive Layout', async ({ page }) => {
   95 |   // Set mobile viewport
   96 |   await page.setViewportSize({ width: 375, height: 667 });
   97 |   
   98 |   await page.goto('http://localhost:5000/admin/gallery');
   99 |   
  100 |   // Check that upload button is still visible on mobile
  101 |   const uploadButton = page.locator('button:has-text("Upload")');
  102 |   await expect(uploadButton).toBeVisible();
  103 |   
  104 |   // Check that gallery grid adapts to mobile
  105 |   const galleryGrid = page.locator('[role="grid"]');
  106 |   await expect(galleryGrid).toBeVisible();
  107 | });
```