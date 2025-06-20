// Test setup and configuration based on your comprehensive test matrix
import { test as base, expect } from "@playwright/test"

// Test configuration matching your specification
export const test = base.extend({
  // Custom test context for Ko Lake Villa
  koLakeVilla: async ({ page }, use) => {
    // Setup test environment
    await page.goto("/")
    await use(page)
  },
})

export { expect }

// Test categories from your matrix
export const TEST_CATEGORIES = {
  FRONTEND_CORE: "frontend-core",
  ADMIN_PANEL: "admin-panel",
  API_ENDPOINTS: "api-endpoints",
  PRICING_SYSTEM: "pricing-system",
  GALLERY_MANAGEMENT: "gallery-management",
  AUTHENTICATION: "authentication",
  MOBILE_RESPONSIVE: "mobile-responsive",
  PERFORMANCE: "performance",
  SECURITY: "security",
  SEO_ANALYTICS: "seo-analytics",
} as const

// Priority levels from your specification
export const PRIORITY = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const
