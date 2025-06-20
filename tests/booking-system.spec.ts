import { test, expect } from "@playwright/test"

test.describe("Booking System", () => {
  test("should calculate pricing correctly", async ({ page }) => {
    await page.goto("/booking")

    // Select room type
    await page.selectOption('[data-testid="room-type"]', "KLV1")

    // Set dates (3 nights)
    await page.fill('[data-testid="check-in"]', "2024-02-01")
    await page.fill('[data-testid="check-out"]', "2024-02-04")

    // Verify pricing calculation
    await expect(page.locator('[data-testid="total-price"]')).toContainText("$321") // 107 * 3
    await expect(page.locator('[data-testid="savings"]')).toContainText("$36") // 12 * 3
  })

  test("should submit booking inquiry", async ({ page }) => {
    await page.goto("/booking")

    // Fill booking form
    await page.selectOption('[data-testid="room-type"]', "KLV")
    await page.fill('[data-testid="check-in"]', "2024-02-01")
    await page.fill('[data-testid="check-out"]', "2024-02-04")
    await page.fill('[data-testid="guest-name"]', "John Doe")
    await page.fill('[data-testid="email"]', "john@example.com")
    await page.fill('[data-testid="phone"]', "+1234567890")

    // Submit form
    await page.click('[data-testid="submit-booking"]')

    // Verify success message
    await expect(page.locator('[data-testid="booking-success"]')).toBeVisible()
  })
})
