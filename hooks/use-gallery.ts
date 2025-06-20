"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export function useGallery(category?: string) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImages = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getGalleryImages(category)
      setImages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch images")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [category])

  return { images, loading, error, refetch: () => fetchImages() }
}
