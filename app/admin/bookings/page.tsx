"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarChart3, Calendar, Users, Home, Image, Settings, LogOut, Search, Filter, Eye, Edit, Phone, Mail, MapPin, Bed, Clock, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminBookings() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
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

  // Mock bookings data - in real app this would come from a database
  const [bookings] = useState([
    {
      id: "BK-001",
      guestName: "Samantha Wilson",
      email: "samantha@email.com",
      phone: "+94 771 234 567",
      checkIn: "2025-07-15",
      checkOut: "2025-07-18",
      nights: 3,
      guests: 2,
      roomType: "Family Suite",
      totalAmount: 450,
      status: "confirmed",
      paymentStatus: "paid",
      specialRequests: "Late check-in requested",
      bookingDate: "2025-06-20"
    },
    {
      id: "BK-002", 
      guestName: "Michael Chen",
      email: "mchen@email.com",
      phone: "+1 555 987 6543",
      checkIn: "2025-07-20",
      checkOut: "2025-07-25",
      nights: 5,
      guests: 4,
      roomType: "Group Room",
      totalAmount: 750,
      status: "pending",
      paymentStatus: "pending",
      specialRequests: "Anniversary celebration",
      bookingDate: "2025-06-25"
    },
    {
      id: "BK-003",
      guestName: "Sarah Johnson",
      email: "sarah.j@email.com", 
      phone: "+44 7700 900123",
      checkIn: "2025-07-10",
      checkOut: "2025-07-12",
      nights: 2,
      guests: 2,
      roomType: "Triple Room",
      totalAmount: 300,
      status: "confirmed",
      paymentStatus: "paid",
      specialRequests: "Vegetarian meals",
      bookingDate: "2025-06-15"
    },
    {
      id: "BK-004",
      guestName: "David Kumar",
      email: "davidk@email.com",
      phone: "+94 771 456 789",
      checkIn: "2025-08-01",
      checkOut: "2025-08-05",
      nights: 4,
      guests: 3,
      roomType: "Family Suite",
      totalAmount: 600,
      status: "cancelled",
      paymentStatus: "refunded",
      specialRequests: "Airport transfer",
      bookingDate: "2025-06-30"
    },
    {
      id: "BK-005",
      guestName: "Emma Thompson",
      email: "emma.t@email.com",
      phone: "+61 404 123 456",
      checkIn: "2025-07-28",
      checkOut: "2025-08-02",
      nights: 5,
      guests: 2,
      roomType: "Triple Room",
      totalAmount: 750,
      status: "confirmed",
      paymentStatus: "deposit",
      specialRequests: "Yoga mat requested",
      bookingDate: "2025-07-01"
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "deposit": return "bg-blue-100 text-blue-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "refunded": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="w-4 h-4" />
      case "pending": return <AlertCircle className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    pending: bookings.filter(b => b.status === "pending").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    revenue: bookings.filter(b => b.status === "confirmed").reduce((sum, b) => sum + b.totalAmount, 0)
  }

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
                <Link
                  href="/admin/analytics"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
                <Link
                  href="/admin/content"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4" />
                  <span>Content</span>
                </Link>
                <span className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-amber-100 text-amber-800">
                  <Calendar className="w-4 h-4" />
                  <span>Bookings</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-2">Manage reservations and guest bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Bookings</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, booking ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-48">
                <Label htmlFor="status">Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
            <CardDescription>
              Manage all guest reservations and bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-lg">{booking.guestName}</span>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                          <DollarSign className="w-3 h-3 mr-1" />
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <div className="font-medium">Booking ID</div>
                          <div>{booking.id}</div>
                        </div>
                        <div>
                          <div className="font-medium">Check-in / Check-out</div>
                          <div>{booking.checkIn} - {booking.checkOut}</div>
                        </div>
                        <div>
                          <div className="font-medium">Room & Guests</div>
                          <div>{booking.roomType} • {booking.guests} guests</div>
                        </div>
                        <div>
                          <div className="font-medium">Total Amount</div>
                          <div>${booking.totalAmount} ({booking.nights} nights)</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{booking.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{booking.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Booking Details - {booking.id}</DialogTitle>
                            <DialogDescription>
                              Complete booking information for {booking.guestName}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedBooking && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <Label className="font-semibold">Guest Information</Label>
                                    <div className="mt-2 space-y-2">
                                      <div><span className="font-medium">Name:</span> {selectedBooking.guestName}</div>
                                      <div><span className="font-medium">Email:</span> {selectedBooking.email}</div>
                                      <div><span className="font-medium">Phone:</span> {selectedBooking.phone}</div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="font-semibold">Booking Status</Label>
                                    <div className="mt-2 space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium">Status:</span>
                                        <Badge className={getStatusColor(selectedBooking.status)}>
                                          {getStatusIcon(selectedBooking.status)}
                                          <span className="ml-1 capitalize">{selectedBooking.status}</span>
                                        </Badge>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium">Payment:</span>
                                        <Badge className={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                                          <DollarSign className="w-3 h-3 mr-1" />
                                          {selectedBooking.paymentStatus}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <Label className="font-semibold">Stay Details</Label>
                                    <div className="mt-2 space-y-2">
                                      <div><span className="font-medium">Check-in:</span> {selectedBooking.checkIn}</div>
                                      <div><span className="font-medium">Check-out:</span> {selectedBooking.checkOut}</div>
                                      <div><span className="font-medium">Nights:</span> {selectedBooking.nights}</div>
                                      <div><span className="font-medium">Guests:</span> {selectedBooking.guests}</div>
                                      <div><span className="font-medium">Room:</span> {selectedBooking.roomType}</div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="font-semibold">Financial Details</Label>
                                    <div className="mt-2 space-y-2">
                                      <div><span className="font-medium">Total Amount:</span> ${selectedBooking.totalAmount}</div>
                                      <div><span className="font-medium">Per Night:</span> ${(selectedBooking.totalAmount / selectedBooking.nights).toFixed(0)}</div>
                                      <div><span className="font-medium">Booking Date:</span> {selectedBooking.bookingDate}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {selectedBooking.specialRequests && (
                                <div>
                                  <Label className="font-semibold">Special Requests</Label>
                                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                    {selectedBooking.specialRequests}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex space-x-2 pt-4 border-t">
                                <Button className="bg-amber-600 hover:bg-amber-700">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Booking
                                </Button>
                                <Button variant="outline">
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Email
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== "all" 
                      ? "Try adjusting your search or filter criteria" 
                      : "No bookings have been made yet"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 