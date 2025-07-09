"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Camera, Eye, Clock, MapPin, Phone, Mail, LogOut, Home, Image, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminAnalytics() {
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
    return <div>Loading...</div>
  }

  // Mock data for analytics
  const analyticsData = {
    bookings: {
      total: 24,
      thisMonth: 12,
      lastMonth: 18,
      growth: -33
    },
    revenue: {
      total: 12500,
      thisMonth: 6200,
      lastMonth: 8100,
      growth: -23
    },
    occupancy: {
      current: 85,
      thisMonth: 78,
      lastMonth: 92,
      growth: -15
    },
    gallery: {
      totalImages: 156,
      newThisMonth: 23,
      views: 1240,
      viewsGrowth: 15
    }
  }

  const monthlyData = [
    { month: "Jan", bookings: 18, revenue: 8100 },
    { month: "Feb", bookings: 22, revenue: 9200 },
    { month: "Mar", bookings: 15, revenue: 6800 },
    { month: "Apr", bookings: 28, revenue: 11500 },
    { month: "May", bookings: 24, revenue: 10200 },
    { month: "Jun", bookings: 12, revenue: 6200 }
  ]

  const topPages = [
    { page: "Home", views: 2340, growth: 12 },
    { page: "Gallery", views: 1240, growth: 15 },
    { page: "Accommodation", views: 890, growth: -5 },
    { page: "Contact", views: 560, growth: 8 },
    { page: "Booking", views: 340, growth: 22 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">KL</span>
                </div>
                <span className="font-semibold text-gray-900">Ko Lake Villa Admin</span>
              </Link>
              
              <nav className="flex space-x-6">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/admin/gallery"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Image className="w-4 h-4" />
                  <span>Gallery Manager</span>
                </Link>
                <span className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-amber-100 text-amber-800">
                  <TrendingUp className="w-4 h-4" />
                  <span>Analytics</span>
                </span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your Ko Lake Villa performance and insights</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.bookings.total}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${analyticsData.bookings.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.bookings.growth >= 0 ? '+' : ''}{analyticsData.bookings.growth}% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analyticsData.revenue.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${analyticsData.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.revenue.growth >= 0 ? '+' : ''}{analyticsData.revenue.growth}% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.occupancy.current}%</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${analyticsData.occupancy.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.occupancy.growth >= 0 ? '+' : ''}{analyticsData.occupancy.growth}% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.gallery.views.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${analyticsData.gallery.viewsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.gallery.viewsGrowth >= 0 ? '+' : ''}{analyticsData.gallery.viewsGrowth}% from last month
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Bookings and revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((month) => (
                      <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{month.month}</div>
                          <div className="text-sm text-gray-600">{month.bookings} bookings</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${month.revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">revenue</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Website Pages</CardTitle>
                  <CardDescription>Most visited pages this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPages.map((page) => (
                      <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{page.page}</div>
                          <div className="text-sm text-gray-600">{page.views} views</div>
                        </div>
                        <Badge variant={page.growth >= 0 ? "default" : "destructive"}>
                          {page.growth >= 0 ? '+' : ''}{page.growth}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{analyticsData.bookings.thisMonth}</div>
                  <p className="text-gray-600">bookings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Last Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData.bookings.lastMonth}</div>
                  <p className="text-gray-600">bookings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${Math.round(analyticsData.revenue.thisMonth / analyticsData.bookings.thisMonth)}</div>
                  <p className="text-gray-600">per booking</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="website" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Page Performance</CardTitle>
                  <CardDescription>Detailed view metrics for each page</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPages.map((page) => (
                      <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">/{page.page.toLowerCase()}</div>
                          <div className="text-sm text-gray-600">{page.views} total views</div>
                        </div>
                        <div className="text-right">
                          <Badge variant={page.growth >= 0 ? "default" : "destructive"}>
                            {page.growth >= 0 ? '+' : ''}{page.growth}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Current Ko Lake Villa contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-amber-600" />
                    <span>+94711730345</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <span>contact@KoLakeHouse.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <span>Ko Lake Villa, Sri Lanka</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{analyticsData.gallery.totalImages}</div>
                  <p className="text-gray-600">in gallery</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>New This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData.gallery.newThisMonth}</div>
                  <p className="text-gray-600">images added</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Views Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">+{analyticsData.gallery.viewsGrowth}%</div>
                  <p className="text-gray-600">this month</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Gallery Management</CardTitle>
                <CardDescription>Quick access to gallery management tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Link href="/admin/gallery">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Manage Gallery
                    </Button>
                  </Link>
                  <Link href="/gallery">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Public Gallery
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 