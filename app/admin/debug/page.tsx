"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDebug() {
  const [authState, setAuthState] = useState<any>({})
  
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth")
      const userAuth = localStorage.getItem("userAuth")
      const cookies = document.cookie
      
      setAuthState({
        adminAuth,
        userAuth,
        cookies,
        isAuthenticated: adminAuth === "true" || !!userAuth,
        timestamp: new Date().toISOString()
      })
    }
    
    checkAuth()
    
    // Check every 2 seconds
    const interval = setInterval(checkAuth, 2000)
    
    return () => clearInterval(interval)
  }, [])
  
  const setAuth = () => {
    localStorage.setItem("adminAuth", "true")
    document.cookie = "authToken=admin-authenticated; path=/; max-age=86400"
  }
  
  const clearAuth = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("userAuth")
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Debug Panel</CardTitle>
            <CardDescription>Test authentication and page functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Current Auth State:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(authState, null, 2)}
              </pre>
            </div>
            
            <div className="flex space-x-4">
              <Button onClick={setAuth} className="bg-green-600 hover:bg-green-700">
                Set Auth
              </Button>
              <Button onClick={clearAuth} className="bg-red-600 hover:bg-red-700 text-white">
                Clear Auth
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Quick Links:</h3>
              <div className="flex flex-wrap gap-2">
                <a href="/admin/login" className="text-blue-600 hover:underline">Login</a>
                <a href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
                <a href="/admin/bookings" className="text-blue-600 hover:underline">Bookings</a>
                <a href="/admin/gallery" className="text-blue-600 hover:underline">Gallery</a>
                <a href="/admin/analytics" className="text-blue-600 hover:underline">Analytics</a>
                <a href="/admin/content" className="text-blue-600 hover:underline">Content</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 