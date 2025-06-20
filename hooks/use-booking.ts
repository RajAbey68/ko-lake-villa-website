"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api-client"

export function useBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitBooking = async (bookingData: any) => {
    try {
      setLoading(true)
      setError(null)

      const result = await apiClient.submitBooking(bookingData)

      // Show success message
      alert("Booking inquiry submitted successfully!")
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit booking"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { submitBooking, loading, error }
}
