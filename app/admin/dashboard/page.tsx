"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, MessageSquare, Settings, Mail, Phone, MapPin, Star } from "lucide-react"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth")
    const userAuth = localStorage.getItem("userAuth")

    if (adminAuth === "true" || userAuth) {
      setIsAuthenticated(true)
    } else {
      router.push("/admin")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("userAuth")
    router.push("/")
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  const bookings = [
    { id: 1, guest: "John Smith", dates: "Dec 15-20, 2024", status: "confirmed", amount: "$1,200" },
    { id: 2, guest: "Sarah Johnson", dates: "Dec 22-25, 2024", status: "pending", amount: "$800" },
    { id: 3, guest: "Mike Wilson", dates: "Jan 5-10, 2025", status: "confirmed", amount: "$1,500" },
  ]

  const inquiries = [
    { id: 1, name: "Emma Davis", email: "emma@email.com", subject: "Wedding Venue", date: "2 hours ago" },
    { id: 2, name: "Tom Brown", email: "tom@email.com", subject: "Group Booking", date: "1 day ago" },
    { id: 3, name: "Lisa Chen", email: "lisa@email.com", subject: "Dining Options", date: "2 days ago" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-amber-800">24</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">New Inquiries</p>
                  <p className="text-3xl font-bold text-amber-800">8</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Occupancy Rate</p>
                  <p className="text-3xl font-bold text-amber-800">85%</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Revenue</p>
                  <p className="text-3xl font-bold text-amber-800">$12.5K</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-white border border-orange-100">
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="inquiries"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700"
            >
              Inquiries
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-amber-800">Recent Bookings</CardTitle>
                <CardDescription>Manage your villa bookings and reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-orange-100 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-amber-800">{booking.guest}</p>
                          <p className="text-sm text-amber-600">{booking.dates}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={booking.status === "confirmed" ? "default" : "secondary"}
                          className={
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {booking.status}
                        </Badge>
                        <p className="font-medium text-amber-800">{booking.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-amber-800">Customer Inquiries</CardTitle>
                <CardDescription>Respond to customer questions and requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="flex items-center justify-between p-4 border border-orange-100 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Mail className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium text-amber-800">{inquiry.name}</p>
                          <p className="text-sm text-amber-600">{inquiry.email}</p>
                          <p className="text-sm text-amber-700 font-medium">{inquiry.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-amber-600">{inquiry.date}</p>
                        <Button size="sm" className="mt-2 bg-orange-500 hover:bg-orange-600">
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-amber-800">Villa Information</CardTitle>
                  <CardDescription>Update your villa details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <span className="text-amber-700">Ahangama, Sri Lanka</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <span className="text-amber-700">+94 123 456 789</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <span className="text-amber-700">contact@KoLakeHouse.com</span>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Update Information</Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-amber-800">System Settings</CardTitle>
                  <CardDescription>Configure your admin preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-700">Email Notifications</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-700">Auto-Backup</span>
                    <Badge className="bg-green-100 text-green-800">Daily</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-700">Booking Confirmations</span>
                    <Badge className="bg-green-100 text-green-800">Automatic</Badge>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
