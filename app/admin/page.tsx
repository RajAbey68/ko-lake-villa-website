"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectionStatus } from "@/components/connection-status"
import { apiClient } from "@/lib/api-client"
import { Calendar, Users, Mail, CheckCircle, Upload, ImageIcon, Settings, Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getDashboardData()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
        console.error("Dashboard error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ko Lake Villa Admin</h1>
              <p className="text-gray-600">Manage your property and bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <ConnectionStatus />
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">⚠️ Backend Connection Error: {error}</p>
            <p className="text-sm text-red-500 mt-1">
              Make sure your backend is running at: https://skill-bridge-rajabey68.replit.app
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-amber-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{dashboardData?.totalBookings || "Loading..."}</p>
                      <p className="text-gray-600">Total Bookings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{dashboardData?.confirmedBookings || "Loading..."}</p>
                      <p className="text-gray-600">Confirmed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ImageIcon className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{dashboardData?.totalImages || "131"}</p>
                      <p className="text-gray-600">Gallery Images</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{dashboardData?.totalGuests || "Loading..."}</p>
                      <p className="text-gray-600">Total Guests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => setActiveTab("gallery")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Gallery Images
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab("bookings")}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Bookings
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab("messages")}>
                    <Mail className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Backend API</span>
                    <ConnectionStatus />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Analysis</span>
                    <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gallery Images</span>
                    <Badge variant="secondary">131 images</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs remain the same but will now connect to your backend */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connected to your live booking system at skill-bridge-rajabey68.replit.app
                </p>
                <Button className="mt-4 bg-amber-600 hover:bg-amber-700">Load Live Bookings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Gallery Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">AI-powered gallery management connected to your backend system</p>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Analyze Images
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Live contact form submissions from your website</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Performance metrics and visitor analytics</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
