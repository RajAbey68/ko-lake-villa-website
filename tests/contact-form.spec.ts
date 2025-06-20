import { test, expect } from "@playwright/test"

test.describe("Contact Form", () => {
  test("should validate required fields", async ({ page }) => {
    await page.goto("/contact")

    // Try to submit empty form
    await page.click('[data-testid="submit-contact"]')

    // Verify validation errors
    await expect(page.locator('[data-testid="name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  })

  test("should submit contact form successfully", async ({ page }) => {
    await page.goto("/contact")

    // Fill form
    await page.fill('[data-testid="contact-name"]', "Jane Smith")
    await page.fill('[data-testid="contact-email"]', "jane@example.com")
    await page.fill('[data-testid="contact-subject"]', "Booking Inquiry")
    await page.fill('[data-testid="contact-message"]', "I would like to book the villa.")

    // Submit
    await page.click('[data-testid="submit-contact"]')

    // Verify success
    await expect(page.locator('[data-testid="contact-success"]')).toBeVisible()
  })
})
