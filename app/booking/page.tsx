"use client"

import type React from "react"

import { useState } from "react"
import { useBooking } from "@/hooks/use-booking"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CreditCard, MapPin, Star, Loader2 } from "lucide-react"

const roomTypes = {
  KLV: {
    name: "Entire Villa",
    capacity: "Up to 18 guests",
    rooms: "7 bedrooms",
    basePrice: 388,
    airbnbPrice: 431,
    savings: 43,
  },
  KLV1: {
    name: "Master Family Suite",
    capacity: "6+ guests",
    rooms: "Large suite",
    basePrice: 107,
    airbnbPrice: 119,
    savings: 12,
  },
  KLV3: {
    name: "Triple/Twin Room",
    capacity: "3+ guests per room",
    rooms: "Individual rooms",
    basePrice: 63,
    airbnbPrice: 70,
    savings: 7,
  },
  KLV6: {
    name: "Group Room",
    capacity: "6+ guests",
    rooms: "Large group space",
    basePrice: 225,
    airbnbPrice: 250,
    savings: 25,
  },
}

export default function BookingPage() {
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    roomType: "KLV1",
    guestName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  const [nights, setNights] = useState(0)
  const { submitBooking, loading, error } = useBooking()

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn)
      const checkOut = new Date(bookingData.checkOut)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays)
      return diffDays
    }
    return 0
  }

  const selectedRoom = roomTypes[bookingData.roomType as keyof typeof roomTypes]
  const totalPrice = selectedRoom.basePrice * calculateNights()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await submitBooking(bookingData)
      // Reset form on success
      setBookingData({
        checkIn: "",
        checkOut: "",
        guests: 2,
        roomType: "KLV1",
        guestName: "",
        email: "",
        phone: "",
        specialRequests: "",
      })
    } catch (err) {
      // Error is handled by the hook
      console.error("Booking submission failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Stay</h1>
          <p className="text-xl text-gray-600">Reserve your perfect getaway at Ko Lake Villa</p>
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-gray-600">4.9 • Exceptional lakeside experience</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                  Reservation Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Room Selection */}
                  <div>
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select
                      value={bookingData.roomType}
                      onValueChange={(value) => setBookingData({ ...bookingData, roomType: value })}
                    >
                      <SelectTrigger data-testid="room-type">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roomTypes).map(([key, room]) => (
                          <SelectItem key={key} value={key}>
                            {room.name} - ${room.basePrice}/night ({room.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn">Check-in Date</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        data-testid="check-in"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check-out Date</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        data-testid="check-out"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select
                      value={bookingData.guests.toString()}
                      onValueChange={(value) => setBookingData({ ...bookingData, guests: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(18)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} Guest{i > 0 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guest Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Guest Information</h3>

                    <div>
                      <Label htmlFor="guestName">Full Name</Label>
                      <Input
                        id="guestName"
                        data-testid="guest-name"
                        value={bookingData.guestName}
                        onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        data-testid="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        data-testid="phone"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                        placeholder="Any special requirements, dietary restrictions, or requests..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-3"
                    disabled={loading}
                    data-testid="submit-booking"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Submit Booking Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Room Details */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg">{selectedRoom.name}</h3>
                  <p className="text-gray-600">{selectedRoom.capacity}</p>
                  <p className="text-sm text-gray-500">{selectedRoom.rooms}</p>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{bookingData.checkIn || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{bookingData.checkOut || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>{nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{bookingData.guests}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>
                      ${selectedRoom.basePrice} × {nights} nights
                    </span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Direct booking discount</span>
                    <span data-testid="savings">-${selectedRoom.savings * nights}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-amber-600" data-testid="total-price">
                      ${totalPrice - selectedRoom.savings * nights}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Save ${selectedRoom.savings * nights} compared to Airbnb!</p>
                </div>

                {/* Location */}
                <div className="border-t pt-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Ahangama, Koggala Lake, Sri Lanka</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
