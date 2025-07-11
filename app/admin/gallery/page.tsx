"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import GalleryManagement from "@/components/admin/gallery-management"
import Link from "next/link"
import { BarChart3, Image, Users, Settings, LogOut, Home } from "lucide-react"

export default function AdminGalleryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth")
    const userAuth = localStorage.getItem("userAuth")
    
    if (adminAuth === "true" || userAuth) {
      setIsAuthenticated(true)
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("userAuth")
    
    // Clear auth cookie
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    
    router.push("/admin/login")
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <GalleryManagement />
    </div>
  )
} 