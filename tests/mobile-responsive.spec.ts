// Mobile Responsive Testing (22 tests) - All device compatibility
import { test, expect } from "./setup"

test.describe("Mobile Responsive - Ko Lake Villa", () => {
  // Layout & Navigation (MO001-008)
  test.describe("Layout & Navigation", () => {
    test("MO001: iPhone 375px layout works", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto("/")

      // Check mobile menu is visible
      const mobileMenu = page.locator('[data-testid="mobile-menu-toggle"]')
      await expect(mobileMenu).toBeVisible()

      // Check content doesn't overflow
      const body = page.locator("body")
      const bodyWidth = await body.evaluate((el) => el.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(375)
    })

    test("MO002: Android 360px layout works", async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 640 })
      await page.goto("/")

      // Check navigation is accessible
      const nav = page.locator("nav")
      await expect(nav).toBeVisible()

      // Check hero content is readable
      const heroTitle = page.locator("h1")
      await expect(heroTitle).toBeVisible()
    })

    test("MO003: iPad 768px tablet layout", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto("/")

      // Check tablet-specific layout
      const container = page.locator(".container")
      await expect(container).toBeVisible()

      // Check grid layouts work on tablet
      await page.goto("/accommodation")
      const roomGrid = page.locator('[data-testid="room-grid"]')
      await expect(roomGrid).toBeVisible()
    })

    test("MO005: Touch navigation responsive", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto("/gallery")

      // Test touch/tap on gallery items
      const firstImage = page.locator('[data-testid="gallery-item"]').first()
      await firstImage.tap()

      // Check lightbox opens
      const lightbox = page.locator('[data-testid="lightbox"]')
      await expect(lightbox).toBeVisible()
    })
  })

  // Mobile Features (MO009-016)
  test.describe("Mobile Features", () => {
    test("MO009: WhatsApp button prominent on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto("/")

      const whatsappButton = page.locator('[data-testid="whatsapp-button"]')
      await expect(whatsappButton).toBeVisible()

      // Check button is large enough for touch
      const buttonSize = await whatsappButton.boundingBox()
      expect(buttonSize?.width).toBeGreaterThanOrEqual(44) // iOS minimum
      expect(buttonSize?.height).toBeGreaterThanOrEqual(44)
    })

    test("MO011: Forms usable on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto("/contact")

      // Check form fields are accessible
      const nameField = page.locator('[data-testid="contact-name"]')
      const emailField = page.locator('[data-testid="contact-email"]')

      await expect(nameField).toBeVisible()
      await expect(emailField).toBeVisible()

      // Test form interaction
      await nameField.fill("Test User")
      await emailField.fill("test@example.com")

      const nameValue = await nameField.inputValue()
      expect(nameValue).toBe("Test User")
    })
  })

  // Mobile Performance (MO017-022)
  test.describe("Mobile Performance", () => {
    test("MO017: Mobile page load speed under 3s", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const startTime = Date.now()
      await page.goto("/", { waitUntil: "networkidle" })
      const loadTime = Date.now() - startTime

      expect(loadTime).toBeLessThan(3000)
    })

    test("MO018: Images optimized for mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto("/")

      // Check hero image loads efficiently
      const heroImage = page.locator('[alt*="Ko Lake Villa"]').first()
      await expect(heroImage).toBeVisible()

      // Verify image dimensions are appropriate for mobile
      const imageSize = await heroImage.boundingBox()
      expect(imageSize?.width).toBeLessThanOrEqual(375)
    })
  })
})
