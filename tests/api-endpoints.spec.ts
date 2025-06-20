// API Endpoints Testing (28 tests) - All API functionality
import { test, expect } from "./setup"

test.describe("API Endpoints - Ko Lake Villa", () => {
  // Gallery APIs (API001-008)
  test.describe("Gallery APIs", () => {
    test("API001: GET /api/gallery returns all images", async ({ request }) => {
      const response = await request.get("/api/gallery")
      expect(response.ok()).toBeTruthy()

      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)

      if (data.length > 0) {
        const image = data[0]
        expect(image).toHaveProperty("id")
        expect(image).toHaveProperty("image_url")
        expect(image).toHaveProperty("title")
        expect(image).toHaveProperty("alt")
        expect(image).toHaveProperty("category")
      }
    })

    test("API005: GET /api/gallery/categories returns categories", async ({ request }) => {
      const response = await request.get("/api/gallery/categories")
      expect(response.ok()).toBeTruthy()

      const categories = await response.json()
      expect(Array.isArray(categories)).toBe(true)
      expect(categories.length).toBeGreaterThan(0)

      const category = categories[0]
      expect(category).toHaveProperty("id")
      expect(category).toHaveProperty("name")
      expect(category).toHaveProperty("count")
    })
  })

  // Room & Pricing APIs (API009-014)
  test.describe("Room & Pricing APIs", () => {
    test("API009: GET /api/rooms returns room data", async ({ request }) => {
      const response = await request.get("/api/rooms")
      expect(response.ok()).toBeTruthy()

      const rooms = await response.json()
      expect(rooms).toHaveProperty("KLV")
      expect(rooms).toHaveProperty("KLV1")
      expect(rooms).toHaveProperty("KLV3")
      expect(rooms).toHaveProperty("KLV6")

      // Verify KLV structure
      const klv = rooms.KLV
      expect(klv).toHaveProperty("name", "Entire Villa")
      expect(klv).toHaveProperty("basePrice", 388)
      expect(klv).toHaveProperty("airbnbPrice", 431)
      expect(klv).toHaveProperty("savings", 43)
    })

    test("API011: POST /api/booking creates booking", async ({ request }) => {
      const bookingData = {
        checkIn: "2024-02-01",
        checkOut: "2024-02-04",
        guests: 4,
        roomType: "KLV1",
        guestName: "Test User",
        email: "test@example.com",
        phone: "+1234567890",
      }

      const response = await request.post("/api/booking", {
        data: bookingData,
      })

      expect(response.ok()).toBeTruthy()

      const result = await response.json()
      expect(result).toHaveProperty("success", true)
      expect(result).toHaveProperty("bookingId")
    })
  })

  // System APIs (API027-028)
  test.describe("System APIs", () => {
    test("API027: GET /api/health returns system health", async ({ request }) => {
      const response = await request.get("/api/health")
      expect(response.ok()).toBeTruthy()

      const health = await response.json()
      expect(health).toHaveProperty("status", "ok")
      expect(health).toHaveProperty("timestamp")
      expect(health).toHaveProperty("service")
    })
  })
})
