class ResilientApiClient {
  private baseUrl: string
  private retryAttempts = 3
  private retryDelay = 1000

  constructor() {
    this.baseUrl = this.detectApiUrl()
  }

  private detectApiUrl(): string {
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  }

  private async requestWithFallback<T>(endpoint: string, options: RequestInit = {}, fallbackData?: T): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          headers: { "Content-Type": "application/json", ...options.headers },
          ...options,
        })

        if (response.ok) {
          return await response.json()
        }

        // If it's the last attempt and we have fallback data, use it
        if (attempt === this.retryAttempts && fallbackData) {
          console.warn(`API ${endpoint} failed, using fallback data`)
          return fallbackData
        }
      } catch (error) {
        console.warn(`API attempt ${attempt} failed for ${endpoint}:`, error)

        // If it's the last attempt and we have fallback data, use it
        if (attempt === this.retryAttempts && fallbackData) {
          console.warn(`API ${endpoint} failed, using fallback data`)
          return fallbackData
        }

        // Wait before retrying
        if (attempt < this.retryAttempts) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay * attempt))
        }
      }
    }

    // If we have fallback data, use it
    if (fallbackData) {
      console.warn(`All API attempts failed for ${endpoint}, using fallback data`)
      return fallbackData
    }

    throw new Error(`API request failed after ${this.retryAttempts} attempts`)
  }

  async getGalleryImages(category?: string) {
    const fallbackData = [
      {
        id: 1,
        image_url: "/placeholder.svg?height=400&width=600&text=Villa Exterior",
        title: "Villa Exterior View",
        alt: "Beautiful exterior view of Ko Lake Villa",
        category: "entire-villa",
        featured: true,
      },
      {
        id: 2,
        image_url: "/placeholder.svg?height=400&width=600&text=Pool Deck",
        title: "Infinity Pool with Lake View",
        alt: "Stunning infinity pool overlooking Koggala Lake",
        category: "pool-deck",
        featured: true,
      },
    ]

    const endpoint = category ? `/gallery?category=${category}` : "/gallery"
    return this.requestWithFallback(endpoint, {}, fallbackData)
  }

  async getGalleryCategories() {
    const fallbackData = [
      { id: "all", name: "All Categories", count: 131 },
      { id: "entire-villa", name: "Entire Villa", count: 15 },
      { id: "family-suite", name: "Family Suite", count: 12 },
      { id: "pool-deck", name: "Pool Deck", count: 18 },
    ]

    return this.requestWithFallback("/gallery/categories", {}, fallbackData)
  }

  async getRooms() {
    const fallbackData = {
      KLV: { name: "Entire Villa", basePrice: 388, airbnbPrice: 431, savings: 43 },
      KLV1: { name: "Master Family Suite", basePrice: 107, airbnbPrice: 119, savings: 12 },
      KLV3: { name: "Triple/Twin Room", basePrice: 63, airbnbPrice: 70, savings: 7 },
      KLV6: { name: "Group Room", basePrice: 225, airbnbPrice: 250, savings: 25 },
    }

    return this.requestWithFallback("/rooms", {}, fallbackData)
  }

  async submitBooking(bookingData: any) {
    // For critical operations like booking, we don't use fallback
    // Instead, we show a maintenance message
    try {
      return await this.requestWithFallback("/booking", {
        method: "POST",
        body: JSON.stringify(bookingData),
      })
    } catch (error) {
      throw new Error("Booking system temporarily unavailable. Please contact us directly via WhatsApp or phone.")
    }
  }

  async submitContact(contactData: any) {
    try {
      return await this.requestWithFallback("/contact", {
        method: "POST",
        body: JSON.stringify(contactData),
      })
    } catch (error) {
      throw new Error("Contact form temporarily unavailable. Please contact us directly via WhatsApp or phone.")
    }
  }

  async healthCheck() {
    try {
      await fetch(`${this.baseUrl}/api/health`, { method: "GET" })
      return true
    } catch {
      return false
    }
  }
}

export const apiClient = new ResilientApiClient()
