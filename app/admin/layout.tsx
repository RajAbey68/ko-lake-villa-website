"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Image, Users, Settings, LogOut, Home, Calendar, FileText } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth")
      const userAuth = localStorage.getItem("userAuth")
      
      const authenticated = adminAuth === "true" || !!userAuth
      if (!authenticated && pathname !== "/admin/login") {
        router.push("/admin/login")
        return
      }
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  const logout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("userAuth")
    
    // Clear auth cookie
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    
    router.push("/admin/login")
  }

  // Don't show admin navigation on login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const navigationItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3, id: "dashboard" },
    { href: "/admin/gallery", label: "Gallery Manager", icon: Image, id: "gallery" },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, id: "analytics" },
    { href: "/admin/content", label: "Content", icon: FileText, id: "content" },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar, id: "bookings" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">KL</span>
                </div>
                <span className="font-semibold text-gray-900">Ko Lake Villa Admin</span>
              </Link>
              
              <nav className="hidden lg:flex space-x-6">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href === "/admin/dashboard" && pathname === "/admin")
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-amber-100 text-amber-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Home className="w-4 h-4" />
                <span>View Site</span>
              </Link>
              
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  )
} 