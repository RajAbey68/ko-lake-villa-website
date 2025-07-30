"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MessageCircle, Calendar, Users, Home, Star } from "lucide-react"
import Link from "next/link"
import useSWR from 'swr'
import axios from 'axios'
import GlobalHeader from "@/components/navigation/global-header"

const fetcher = (url: string) => axios.get(url).then(res => res.data)

interface Room {
  id: string;
  name: string;
  subtitle: string;
  airbnbPrice: number;
  directPrice: number;
  savings: number;
  discount: string;
  lastMinuteDiscount: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  gallery: string[];
  features: string[];
  amenities: string[];
}

function BookingContent() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    checkinDate: "",
    checkoutDate: "",
    guestCount: "",
    roomType: "",
    specialRequests: "",
  })

  useEffect(() => {
    const roomId = searchParams.get('room');
    if (roomId) {
      handleInputChange('roomType', roomId);
    }
  }, [searchParams]);

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: rooms, isLoading: loadingRooms, error: errorRooms } = useSWR<Room[]>('/api/rooms', fetcher)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await axios.post('/api/booking', formData)
      if (response.status === 200) {
        setSubmitted(true)
      } else {
        setSubmitError(response.data.error || 'An unexpected error occurred.')
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.error || 'Failed to submit booking request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingRooms) {
    return <div className="min-h-screen flex items-center justify-center">Loading booking options...</div>
  }

  if (errorRooms) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Failed to load booking options. Please try again later.</div>
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <GlobalHeader />

        {/* Success Message */}
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-3xl text-green-600">Booking Request Received!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg text-gray-600">Thank you for your booking request, {formData.guestName}!</p>
              <p className="text-gray-600">
                We've received your request for{" "}
                <strong>{rooms?.find((r) => r.id === formData.roomType)?.name}</strong> from {formData.checkinDate}{" "}
                to {formData.checkoutDate}.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-left text-sm text-blue-800 space-y-2">
                  <li>• We'll confirm availability within 2 hours</li>
                  <li>• You'll receive a detailed booking confirmation via email</li>
                  <li>• Our team will contact you to arrange payment and check-in details</li>
                  <li>• We'll send you a welcome guide with local recommendations</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
                                  <Button className="border border-gray-300 hover:bg-gray-50" onClick={() => window.open("https://wa.me/94711730345", "_blank")}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <GlobalHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
            Book Your Stay
          </h1>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto mb-8">
            Reserve your perfect getaway at Ko Lake Villa. Experience luxury, comfort, 
            and the serene beauty of Koggala Lake.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              Instant Confirmation
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Best Rate Guarantee
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
              <Phone className="w-4 h-4 mr-2" />
              24/7 Support
            </Badge>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Guest Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Guest Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="guestName">Full Name *</Label>
                          <Input
                            id="guestName"
                            value={formData.guestName}
                            onChange={(e) => handleInputChange("guestName", e.target.value)}
                            required
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="guestEmail">Email Address *</Label>
                          <Input
                            id="guestEmail"
                            type="email"
                            value={formData.guestEmail}
                            onChange={(e) => handleInputChange("guestEmail", e.target.value)}
                            required
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="guestPhone">Phone Number *</Label>
                        <Input
                          id="guestPhone"
                          type="tel"
                          value={formData.guestPhone}
                          onChange={(e) => handleInputChange("guestPhone", e.target.value)}
                          required
                          placeholder="+94711730345"
                        />
                      </div>
                    </div>

                    {/* Stay Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Stay Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="checkinDate">Check-in Date *</Label>
                          <Input
                            id="checkinDate"
                            type="date"
                            value={formData.checkinDate}
                            onChange={(e) => handleInputChange("checkinDate", e.target.value)}
                            required
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor="checkoutDate">Check-out Date *</Label>
                          <Input
                            id="checkoutDate"
                            type="date"
                            value={formData.checkoutDate}
                            onChange={(e) => handleInputChange("checkoutDate", e.target.value)}
                            required
                            min={formData.checkinDate || new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="roomType">Room Type *</Label>
                          <Select
                            value={formData.roomType}
                            onValueChange={(value: string) => handleInputChange("roomType", value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                            <SelectContent>
                              {rooms?.map((room) => (
                                <SelectItem key={room.id} value={room.id}>
                                  {room.name} - ${room.directPrice}/night ({room.guests} guests)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="guestCount">Number of Guests *</Label>
                          <Input
                            id="guestCount"
                            type="number"
                            value={formData.guestCount}
                            onChange={(e) => handleInputChange("guestCount", e.target.value)}
                            required
                            min="1"
                            placeholder="e.g. 2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                        placeholder="Any special requests or requirements? (early check-in, dietary restrictions, etc.)"
                        rows={4}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                    </Button>

                    {submitError && (
                      <p className="text-red-600 text-sm text-center">{submitError}</p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Call Us</div>
                      <div className="text-sm text-gray-600">+94711730345</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-sm text-gray-600">Quick responses</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a href="mailto:contact@KoLakeHouse.com" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">
                        contact@KoLakeHouse.com
                      </a>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.open("https://wa.me/94711730345", "_blank")}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </CardContent>
              </Card>

              {/* Why Book Direct */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Why Book Direct?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Save 10-15%</div>
                      <div className="text-sm text-gray-600">Lower rates than booking platforms</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Personal Service</div>
                      <div className="text-sm text-gray-600">Direct contact with our team</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Flexible Terms</div>
                      <div className="text-sm text-gray-600">Better cancellation policies</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Best Rate Guarantee</div>
                      <div className="text-sm text-gray-600">We'll match any lower rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}
