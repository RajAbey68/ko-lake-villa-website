"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarChart3, Calendar, Users, Home, Image, Settings, LogOut, Search, Filter, Eye, CheckCircle, XCircle, Clock, DollarSign, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

// Mock booking data
const mockBookings = [
  {
    id: "BK001",
    guestName: "John Smith",
    email: "john@email.com",
    phone: "+1 555-0123",
    roomType: "Deluxe Suite",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    nights: 3,
    guests: 2,
    amount: 450,
    status: "confirmed" as const,
    paymentStatus: "paid" as const,
    bookingDate: "2024-01-10",
    specialRequests: "Late check-in requested"
  },
  {
    id: "BK002", 
    guestName: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "+1 555-0456",
    roomType: "Family Room",
    checkIn: "2024-01-20",
    checkOut: "2024-01-23", 
    nights: 3,
    guests: 4,
    amount: 600,
    status: "pending" as const,
    paymentStatus: "pending" as const,
    bookingDate: "2024-01-12",
    specialRequests: "Ground floor room preferred"
  },
  {
    id: "BK003",
    guestName: "Mike Wilson", 
    email: "mike@email.com",
    phone: "+1 555-0789",
    roomType: "Standard Room",
    checkIn: "2024-01-25",
    checkOut: "2024-01-27",
    nights: 2,
    guests: 2,
    amount: 300,
    status: "cancelled" as const,
    paymentStatus: "refunded" as const,
    bookingDate: "2024-01-14",
    specialRequests: "None"
  }
]

export default function AdminBookings() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bookings] = useState(mockBookings)
  const [filteredBookings, setFilteredBookings] = useState(mockBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth")
      const userAuth = localStorage.getItem("userAuth")
      
      const authenticated = adminAuth === "true" || !!userAuth
      if (!authenticated) {
        router.push("/admin/login")
        return
      }
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter])

  const logout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("userAuth")
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/admin/login")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="mt-2 text-gray-600">Manage reservations and guest information</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.filter(b => b.status === "confirmed").length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.filter(b => b.status === "pending").length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${bookings.reduce((sum, b) => sum + b.amount, 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by guest name, email, or booking ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
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

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{booking.guestName}</h3>
                          <span className="text-sm text-gray-500">#{booking.id}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{booking.roomType}</span>
                          <span>•</span>
                          <span>{booking.checkIn} to {booking.checkOut}</span>
                          <span>•</span>
                          <span>{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold">${booking.amount}</div>
                        <div className="flex items-center space-x-2">
                          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </div>
                          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            <span className="capitalize">{booking.paymentStatus}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Booking Details - {selectedBooking?.id}</DialogTitle>
                            <DialogDescription>
                              Complete information for this reservation
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedBooking && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Guest Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Users className="w-4 h-4 text-gray-400" />
                                      <span>{selectedBooking.guestName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="w-4 h-4 text-gray-400" />
                                      <span>{selectedBooking.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="w-4 h-4 text-gray-400" />
                                      <span>{selectedBooking.phone}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-3">Booking Details</h4>
                                  <div className="space-y-2">
                                    <div><strong>Room:</strong> {selectedBooking.roomType}</div>
                                    <div><strong>Check-in:</strong> {selectedBooking.checkIn}</div>
                                    <div><strong>Check-out:</strong> {selectedBooking.checkOut}</div>
                                    <div><strong>Nights:</strong> {selectedBooking.nights}</div>
                                    <div><strong>Guests:</strong> {selectedBooking.guests}</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Payment & Status</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <span><strong>Amount:</strong> ${selectedBooking.amount}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span><strong>Status:</strong></span>
                                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>
                                        {getStatusIcon(selectedBooking.status)}
                                        <span className="ml-1 capitalize">{selectedBooking.status}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span><strong>Payment:</strong></span>
                                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                                        <span className="capitalize">{selectedBooking.paymentStatus}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-3">Additional Information</h4>
                                  <div className="space-y-2">
                                    <div><strong>Booking Date:</strong> {selectedBooking.bookingDate}</div>
                                    <div><strong>Special Requests:</strong> {selectedBooking.specialRequests}</div>
                                  </div>
                                </div>
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
                <div className="text-center py-8 text-gray-500">
                  No bookings found matching your criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 