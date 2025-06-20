"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { WifiOff, Phone, Mail } from "lucide-react"

// Mock data for offline mode
const offlineGalleryData = [
  {
    id: 1,
    image_url: "/placeholder.svg?height=400&width=600&text=Villa Exterior",
    title: "Villa Exterior View",
    category: "entire-villa",
    featured: true,
  },
  {
    id: 2,
    image_url: "/placeholder.svg?height=400&width=600&text=Pool Deck",
    title: "Infinity Pool with Lake View",
    category: "pool-deck",
    featured: true,
  },
  {
    id: 3,
    image_url: "/placeholder.svg?height=400&width=600&text=Master Suite",
    title: "Master Family Suite",
    category: "family-suite",
    featured: true,
  },
]

const offlineRoomData = {
  KLV: { name: "Entire Villa", basePrice: 388, airbnbPrice: 431, savings: 43 },
  KLV1: { name: "Master Family Suite", basePrice: 107, airbnbPrice: 119, savings: 12 },
  KLV3: { name: "Triple/Twin Room", basePrice: 63, airbnbPrice: 70, savings: 7 },
  KLV6: { name: "Group Room", basePrice: 225, airbnbPrice: 250, savings: 25 },
}

export function OfflineMode() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 p-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800 font-medium">Offline Mode</span>
          <Badge variant="secondary">Limited functionality</Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>+94 123 456 789</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>kolakevilla@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Offline data providers
export const useOfflineGallery = () => offlineGalleryData
export const useOfflineRooms = () => offlineRoomData
