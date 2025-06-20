"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Percent, Gift, Star } from "lucide-react"

export default function DealsPage() {
  const deals = [
    {
      id: 1,
      title: "Book Direct - Save 10%",
      description: "Skip the booking fees and save when you book directly with us",
      discount: "10%",
      validUntil: "2024-12-31",
      terms: "Valid for all room types, minimum 2 nights stay",
      featured: true,
    },
    {
      id: 2,
      title: "Extended Stay Discount",
      description: "Stay 7+ nights and enjoy significant savings",
      discount: "15%",
      validUntil: "2024-12-31",
      terms: "Valid for stays of 7 nights or longer",
      featured: false,
    },
    {
      id: 3,
      title: "Early Bird Special",
      description: "Book 30 days in advance for exclusive rates",
      discount: "12%",
      validUntil: "2024-12-31",
      terms: "Must book at least 30 days before check-in",
      featured: false,
    },
    {
      id: 4,
      title: "Group Booking Offer",
      description: "Perfect for family reunions and celebrations",
      discount: "20%",
      validUntil: "2024-12-31",
      terms: "Valid for entire villa bookings, minimum 10 guests",
      featured: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Special Deals & Offers</h1>
          <p className="text-xl text-gray-600">Save more on your Ko Lake Villa experience with our exclusive offers</p>
        </div>

        {/* Featured Deal */}
        <div className="mb-12">
          {deals
            .filter((deal) => deal.featured)
            .map((deal) => (
              <Card key={deal.id} className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-amber-600 text-white">Featured Offer</Badge>
                    <div className="flex items-center text-amber-600">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span className="text-sm font-semibold">Most Popular</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{deal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2">
                      <p className="text-gray-700 mb-4">{deal.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Valid until {new Date(deal.validUntil).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Limited time
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{deal.terms}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-amber-600 mb-2">{deal.discount}</div>
                      <div className="text-sm text-gray-600 mb-4">OFF</div>
                      <Button className="bg-amber-600 hover:bg-amber-700 w-full">Book Now & Save</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Other Deals */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals
            .filter((deal) => !deal.featured)
            .map((deal) => (
              <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      <Percent className="w-3 h-3 mr-1" />
                      {deal.discount} OFF
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{deal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{deal.description}</p>
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Valid until {new Date(deal.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{deal.terms}</p>
                  <Button
                    variant="outline"
                    className="w-full bg-white text-amber-600 border-amber-600 hover:bg-amber-50"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Claim Offer
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* How to Book Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>How to Claim Your Discount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-amber-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Choose Your Dates</h3>
                  <p className="text-gray-600 text-sm">Select your preferred check-in and check-out dates</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-amber-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Book Direct</h3>
                  <p className="text-gray-600 text-sm">Make your reservation directly through our website</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-amber-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Save Automatically</h3>
                  <p className="text-gray-600 text-sm">Your discount will be applied automatically at checkout</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
