"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import EnhancedGalleryManagement from "@/components/admin/enhanced-gallery-management"
import Link from "next/link"
import { BarChart3, Image, Users, Settings, LogOut, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EnhancedGalleryPage() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/gallery">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Standard Gallery
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Enhanced Gallery Management</h1>
                <p className="text-sm text-gray-600">Advanced gallery operations with archive and bulk management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Website
                </Button>
              </Link>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        <EnhancedGalleryManagement />
      </div>

      {/* Feature Information Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🗂️ Archive Management</h3>
              <p className="text-sm text-gray-600">
                Archive items to remove them from the public gallery while keeping them in storage. 
                Restore archived items or permanently delete them.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📦 Bulk Operations</h3>
              <p className="text-sm text-gray-600">
                Select multiple items for bulk operations. Clear entire gallery to archive 
                or permanently delete multiple archived items at once.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🗑️ Permanent Deletion</h3>
              <p className="text-sm text-gray-600">
                Completely remove files from storage including metadata. 
                Clear archive to permanently delete all archived items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 