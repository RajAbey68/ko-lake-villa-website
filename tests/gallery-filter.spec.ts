import { test, expect } from "@playwright/test"

test.describe("Gallery Filtering", () => {
  test("should filter by category", async ({ page }) => {
    await page.goto("/gallery")

    // Select pool-deck category
    await page.selectOption('[data-testid="category-filter"]', "pool-deck")

    // Verify only pool-deck images are shown
    const images = page.locator('[data-testid="gallery-item"]')
    await expect(images).toHaveCount(18) // Based on your category counts

    // Verify category badge
    await expect(page.locator('[data-testid="category-badge"]').first()).toContainText("Pool Deck")
  })

  test("should search gallery images", async ({ page }) => {
    await page.goto("/gallery")

    // Search for "pool"
    await page.fill('[data-testid="search-input"]', "pool")

    // Verify filtered results
    const results = page.locator('[data-testid="gallery-item"]')
    await expect(results.first()).toContainText("pool")
  })
})
