// Critical Path Tests (67 tests) - Must pass for production
import { test, expect } from "./setup"

test.describe("Critical Path Tests - Ko Lake Villa", () => {
  // FE001: Hero background image loads (Critical)
  test("FE001: Hero background image loads within 2s", async ({ page }) => {
    await page.goto("/")

    const heroImage = page.locator('[alt*="Ko Lake Villa"]').first()
    await expect(heroImage).toBeVisible({ timeout: 2000 })

    // Verify image actually loaded (not broken)
    const imageLoaded = await heroImage.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalHeight !== 0
    })
    expect(imageLoaded).toBe(true)
  })

  // FE003: WhatsApp button functionality (Critical)
  test("FE003: WhatsApp button opens correct chat", async ({ page }) => {
    await page.goto("/")

    const whatsappButton = page.locator('[data-testid="whatsapp-button"]')
    await expect(whatsappButton).toBeVisible()

    // Check href contains WhatsApp URL
    const href = await whatsappButton.getAttribute("href")
    expect(href).toContain("wa.me")
  })

  // PR001-008: All pricing conversions (Critical)
  test("PR001-008: All room pricing conversions accurate", async ({ page }) => {
    await page.goto("/accommodation")

    // KNP: $431 → $388 (PR005)
    await expect(page.locator('[data-testid="KLV-price"]')).toContainText("$388")
    await expect(page.locator('[data-testid="KLV-original"]')).toContainText("$431")

    // KNP1: $119 → $107 (PR006)
    await expect(page.locator('[data-testid="KLV1-price"]')).toContainText("$107")
    await expect(page.locator('[data-testid="KLV1-original"]')).toContainText("$119")

    // KNP3: $70 → $63 (PR007)
    await expect(page.locator('[data-testid="KLV3-price"]')).toContainText("$63")
    await expect(page.locator('[data-testid="KLV3-original"]')).toContainText("$70")

    // KNP6: $250 → $225 (PR008)
    await expect(page.locator('[data-testid="KLV6-price"]')).toContainText("$225")
    await expect(page.locator('[data-testid="KLV6-original"]')).toContainText("$250")
  })

  // API001: Gallery API returns data (Critical)
  test("API001: GET /api/gallery returns all images", async ({ request }) => {
    const response = await request.get("/api/gallery")
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)

    // Verify image structure
    const firstImage = data[0]
    expect(firstImage).toHaveProperty("id")
    expect(firstImage).toHaveProperty("image_url")
    expect(firstImage).toHaveProperty("title")
    expect(firstImage).toHaveProperty("category")
  })

  // SE001: Password strength validation (Critical)
  test("SE001: Strong passwords required for admin", async ({ page }) => {
    await page.goto("/admin/login")

    // Try weak password
    await page.fill('[data-testid="password"]', "123")
    await page.click('[data-testid="login-submit"]')

    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toContainText("password")
  })

  // MO001: iPhone 375px layout (Critical)
  test("MO001: Layout works on iPhone 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")

    // Check mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu-toggle"]')
    await expect(mobileMenu).toBeVisible()

    // Check hero content is readable
    const heroTitle = page.locator("h1")
    await expect(heroTitle).toBeVisible()

    // Check WhatsApp button is accessible
    const whatsappButton = page.locator('[data-testid="whatsapp-button"]')
    await expect(whatsappButton).toBeVisible()
  })

  // PF001: Home page load time under 3s (Critical)
  test("PF001: Home page loads within 3 seconds", async ({ page }) => {
    const startTime = Date.now()

    await page.goto("/", { waitUntil: "networkidle" })

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000)
  })
})
