"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Bed, Bath, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import useSWR from 'swr'
import axios from 'axios'

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

export default function AccommodationPage() {
  const { data: rooms, isLoading, error } = useSWR<Room[]>('/api/rooms', fetcher)

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading rooms...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Failed to load rooms. Please try again later.</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-amber-800">
              Ko Lake Villa
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-amber-700 hover:text-orange-500">
                Home
              </Link>
              <Link href="/accommodation" className="text-orange-500 font-medium">
                Accommodation
              </Link>
              <Link href="/dining" className="text-amber-700 hover:text-orange-500">
                Dining
              </Link>
              <Link href="/experiences" className="text-amber-700 hover:text-orange-500">
                Experiences
              </Link>
              <Link href="/gallery" className="text-amber-700 hover:text-orange-500">
                Gallery
              </Link>
              <Link href="/contact" className="text-amber-700 hover:text-orange-500">
                Contact
              </Link>
            </div>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-amber-900 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Accommodation</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Choose from our range of luxury accommodation options, each offering unique experiences with significant
            savings when you book direct.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">Book Direct & Save</h3>
            <p className="text-lg">Save 10-15% compared to Airbnb rates + enjoy exclusive perks</p>
          </div>
        </div>
      </section>

      {/* Room Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {rooms?.map((room, index) => (
              <Card key={room.id} className="overflow-hidden shadow-lg">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                  {/* Image Section */}
                  <div className={`relative ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <Image
                      src={room.image || "/placeholder.svg"}
                      alt={room.name}
                      width={600}
                      height={400}
                      className="w-full h-96 lg:h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-red-500">Save {room.discount}</Badge>
                      <Badge className="bg-green-500">≤3 days: {room.lastMinuteDiscount}</Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent
                    className={`p-8 flex flex-col justify-between ${index % 2 === 1 ? "lg:col-start-1" : ""}`}
                  >
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h2>
                      <p className="text-lg text-gray-600 mb-6">{room.subtitle}</p>

                      {/* Room Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <Users className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                          <div className="text-sm text-gray-600">Up to</div>
                          <div className="font-semibold">{room.guests} guests</div>
                        </div>
                        <div className="text-center">
                          <Bed className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                          <div className="text-sm text-gray-600">Bedrooms</div>
                          <div className="font-semibold">{room.bedrooms}</div>
                        </div>
                        <div className="text-center">
                          <Bath className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                          <div className="text-sm text-gray-600">Bathrooms</div>
                          <div className="font-semibold">{room.bathrooms}</div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg text-gray-500 line-through">Airbnb: ${room.airbnbPrice}/night</span>
                          <span className="text-lg text-green-600 font-semibold">You Save: ${room.savings}</span>
                        </div>
                        <div className="text-3xl font-bold text-amber-800">
                          ${room.directPrice}
                          <span className="text-lg font-normal text-gray-500">/night direct</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">Book ≤3 days in advance for additional 5% off</div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {room.features.slice(0, 6).map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1" asChild>
                        <Link href={`/booking?room=${room.id}`}>Book Direct & Save</Link>
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/gallery?category=${room.id}`}>View Photos</Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Book Direct */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Why Book Direct with Ko Lake Villa?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10-15%</div>
              <div className="font-semibold mb-2">Lower Rates</div>
              <div className="text-sm text-gray-600">Save compared to booking platforms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="font-semibold mb-2">Personal Service</div>
              <div className="text-sm text-gray-600">Direct contact with our team</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">Free</div>
              <div className="font-semibold mb-2">Cancellation</div>
              <div className="text-sm text-gray-600">Flexible booking terms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">Best</div>
              <div className="font-semibold mb-2">Rate Guarantee</div>
              <div className="text-sm text-gray-600">We'll match any lower rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Book Your Perfect Stay?</h2>
          <p className="text-xl mb-8">
            Choose your ideal accommodation and start planning your Ko Lake Villa experience.
          </p>
          <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50" asChild>
            <Link href="/booking">Book Your Stay Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
