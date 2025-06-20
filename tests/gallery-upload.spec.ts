import { test, expect } from "@playwright/test"

test.describe("Gallery Upload Functionality", () => {
  test("should upload image and display in gallery", async ({ page }) => {
    // Navigate to admin gallery
    await page.goto("/admin")
    await page.click('[data-testid="gallery-tab"]')

    // Upload image
    await page.click('[data-testid="upload-button"]')
    await page.setInputFiles('[data-testid="file-input"]', "test-image.jpg")

    // Verify upload success
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible()

    // Check if image appears in gallery
    await page.goto("/gallery")
    await expect(page.locator('[alt*="test-image"]')).toBeVisible()
  })

  test("should categorize image with AI", async ({ page }) => {
    await page.goto("/admin")
    await page.click('[data-testid="gallery-tab"]')

    // Upload villa exterior image
    await page.setInputFiles('[data-testid="file-input"]', "villa-exterior.jpg")

    // Wait for AI analysis
    await expect(page.locator('[data-testid="ai-analysis-complete"]')).toBeVisible()

    // Verify category suggestion
    await expect(page.locator('[data-testid="suggested-category"]')).toContainText("entire-villa")
  })
})
