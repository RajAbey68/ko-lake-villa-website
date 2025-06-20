// Universal API client that works everywhere
class UniversalApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = this.detectApiUrl()
  }

  private detectApiUrl(): string {
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async getGalleryImages(category?: string) {
    const endpoint = category ? `/gallery?category=${category}` : "/gallery"
    return this.request<any[]>(endpoint)
  }

  async getGalleryCategories() {
    return this.request<any[]>("/gallery/categories")
  }

  async submitBooking(bookingData: any) {
    return this.request("/booking", {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
  }

  async submitContact(contactData: any) {
    return this.request("/contact", {
      method: "POST",
      body: JSON.stringify(contactData),
    })
  }

  async getRooms() {
    return this.request<any>("/rooms")
  }

  async healthCheck() {
    try {
      await this.request("/health")
      return true
    } catch {
      return false
    }
  }
}

export const apiClient = new UniversalApiClient()
