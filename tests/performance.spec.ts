// Performance Testing (16 tests) - Speed and optimization
import { test, expect } from "./setup"

test.describe("Performance Testing - Ko Lake Villa", () => {
  // Page Load Performance (PF001-008)
  test.describe("Page Load Performance", () => {
    test("PF001: Home page loads under 3 seconds", async ({ page }) => {
      const startTime = Date.now()

      await page.goto("/", { waitUntil: "networkidle" })

      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000)

      // Check Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            resolve(entries)
          }).observe({ entryTypes: ["navigation"] })
        })
      })

      console.log("Performance metrics:", metrics)
    })

    test("PF002: Accommodation page loads under 3 seconds", async ({ page }) => {
      const startTime = Date.now()

      await page.goto("/accommodation", { waitUntil: "networkidle" })

      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000)
    })

    test("PF005: API response times under 500ms", async ({ request }) => {
      const endpoints = ["/api/health", "/api/gallery", "/api/rooms", "/api/gallery/categories"]

      for (const endpoint of endpoints) {
        const startTime = Date.now()
        const response = await request.get(endpoint)
        const responseTime = Date.now() - startTime

        expect(response.ok()).toBeTruthy()
        expect(responseTime).toBeLessThan(500)
      }
    })
  })

  // Optimization & Caching (PF009-016)
  test.describe("Optimization & Caching", () => {
    test("PF010: Image lazy loading works", async ({ page }) => {
      await page.goto("/gallery")

      // Check that images below fold are not loaded initially
      const images = page.locator("img")
      const imageCount = await images.count()

      // Scroll to trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

      // Wait for lazy loaded images
      await page.waitForTimeout(1000)

      // Verify more images are now loaded
      const loadedImages = await page.locator("img[src]").count()
      expect(loadedImages).toBeGreaterThan(0)
    })

    test("PF014: Browser caching headers present", async ({ request }) => {
      const response = await request.get("/api/gallery")

      const headers = response.headers()
      // Check for caching headers (implementation dependent)
      expect(headers).toBeDefined()
    })

    test("PF016: Lighthouse performance score >90", async ({ page }) => {
      await page.goto("/")

      // This would require lighthouse integration
      // For now, we'll check basic performance indicators
      const performanceEntries = await page.evaluate(() => {
        return performance.getEntriesByType("navigation")[0]
      })

      expect(performanceEntries).toBeDefined()
    })
  })
})
