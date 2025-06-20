"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Waves,
  TreePine,
  Coffee,
  Utensils,
  Wind,
  Shield,
  Star,
  ArrowRight,
  MapPin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AccommodationPage() {
  const accommodations = [
    {
      id: "complete-villa",
      name: "The Complete Villa Experience",
      subtitle: "Exclusive lakeside sanctuary",
      description:
        "Reserve our entire property for the ultimate in privacy and luxury. Seven beautifully appointed bedrooms, expansive living spaces, and exclusive access to all amenities create the perfect setting for celebrations, corporate retreats, and unforgettable gatherings.",
      price: 388,
      originalPrice: 431,
      savings: 43,
      guests: 18,
      bedrooms: 7,
      bathrooms: 6,
      size: "450 sqm",
      featured: true,
      images: [
        "/placeholder.svg?height=600&width=800&text=Complete Villa - Main View",
        "/placeholder.svg?height=400&width=600&text=Complete Villa - Living Area",
        "/placeholder.svg?height=400&width=600&text=Complete Villa - Pool Deck",
      ],
      amenities: [
        "Private pool & deck",
        "Lakeside gardens",
        "Full kitchen access",
        "Dedicated parking",
        "24/7 concierge",
        "Complimentary WiFi",
      ],
      highlights: [
        "Exclusive property access",
        "Perfect for celebrations",
        "Professional event support",
        "Custom dining arrangements",
      ],
    },
    {
      id: "master-suite",
      name: "Master Family Suite",
      subtitle: "Panoramic lake views",
      description:
        "Our signature suite offers unparalleled comfort with sweeping views of Koggala Lake. Thoughtfully designed for families and couples seeking elegance, featuring a private terrace and luxurious amenities.",
      price: 107,
      originalPrice: 119,
      savings: 12,
      guests: 6,
      bedrooms: 2,
      bathrooms: 2,
      size: "85 sqm",
      featured: true,
      images: [
        "/placeholder.svg?height=600&width=800&text=Master Suite - Lake View",
        "/placeholder.svg?height=400&width=600&text=Master Suite - Bedroom",
        "/placeholder.svg?height=400&width=600&text=Master Suite - Terrace",
      ],
      amenities: [
        "Private lake terrace",
        "King & twin beds",
        "En-suite bathrooms",
        "Mini refrigerator",
        "Air conditioning",
        "Premium linens",
      ],
      highlights: ["Best lake views", "Private terrace", "Family-friendly layout", "Premium location"],
    },
    {
      id: "group-rooms",
      name: "Group Accommodation",
      subtitle: "Flexible configurations",
      description:
        "Versatile accommodation options perfect for groups, friends, and extended families. Choose from triple rooms, twin configurations, or interconnected spaces to suit your party's needs.",
      price: 63,
      originalPrice: 70,
      savings: 7,
      guests: 3,
      bedrooms: 1,
      bathrooms: 1,
      size: "35 sqm",
      featured: false,
      images: [
        "/placeholder.svg?height=600&width=800&text=Group Room - Triple Configuration",
        "/placeholder.svg?height=400&width=600&text=Group Room - Twin Setup",
        "/placeholder.svg?height=400&width=600&text=Group Room - Garden View",
      ],
      amenities: [
        "Flexible bed configurations",
        "Garden or lake views",
        "Shared common areas",
        "Individual climate control",
        "Storage solutions",
        "Work desk",
      ],
      highlights: [
        "Multiple configurations",
        "Great value for groups",
        "Interconnecting options",
        "Shared amenities access",
      ],
    },
  ]

  const sharedAmenities = [
    { icon: Waves, name: "Infinity Pool", description: "Overlooking Koggala Lake" },
    { icon: TreePine, name: "Tropical Gardens", description: "Landscaped lakeside grounds" },
    { icon: Coffee, name: "Common Areas", description: "Elegant living & dining spaces" },
    { icon: Utensils, name: "Dining Services", description: "Private chef available" },
    { icon: Wifi, name: "High-Speed WiFi", description: "Throughout the property" },
    { icon: Car, name: "Secure Parking", description: "Complimentary for all guests" },
    { icon: Wind, name: "Climate Control", description: "Air conditioning & fans" },
    { icon: Shield, name: "24/7 Security", description: "Professional on-site team" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-amber-100 text-amber-800 border-0">Award-Winning Design</Badge>
            <h1 className="text-5xl font-light text-gray-900 mb-6">
              Luxury Accommodation
              <br />
              <span className="font-serif italic text-amber-600">by Koggala Lake</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Choose from our thoughtfully designed spaces, each offering a unique perspective of Sri Lanka's natural
              beauty and contemporary luxury. Every accommodation features premium amenities and personalized service.
            </p>
          </div>
        </div>
      </div>

      {/* Accommodation Options */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-24">
          {accommodations.map((accommodation, index) => (
            <div
              key={accommodation.id}
              className={`${index % 2 === 1 ? "lg:flex-row-reverse" : ""} lg:flex gap-12 items-center`}
            >
              {/* Images */}
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={accommodation.images[0] || "/placeholder.svg"}
                      alt={`${accommodation.name} - Main view`}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={accommodation.images[1] || "/placeholder.svg"}
                      alt={`${accommodation.name} - Interior`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={accommodation.images[2] || "/placeholder.svg"}
                      alt={`${accommodation.name} - Amenity`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2">
                <div className="max-w-lg">
                  {accommodation.featured && (
                    <Badge className="mb-4 bg-amber-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Signature Experience
                    </Badge>
                  )}

                  <h2 className="text-3xl font-light text-gray-900 mb-2">{accommodation.name}</h2>
                  <p className="text-amber-600 font-medium mb-4">{accommodation.subtitle}</p>

                  <p className="text-gray-600 leading-relaxed mb-6">{accommodation.description}</p>

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-amber-600" />
                      <span className="text-gray-700">{accommodation.guests} guests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="w-5 h-5 text-amber-600" />
                      <span className="text-gray-700">{accommodation.bedrooms} bedrooms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bath className="w-5 h-5 text-amber-600" />
                      <span className="text-gray-700">{accommodation.bathrooms} bathrooms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      <span className="text-gray-700">{accommodation.size}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-3xl font-light text-gray-900">${accommodation.price}</div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 line-through">Airbnb: ${accommodation.originalPrice}</div>
                        <div className="text-sm text-green-600 font-medium">Save ${accommodation.savings} direct</div>
                      </div>
                    </div>
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {accommodation.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                          <span className="text-gray-600">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/booking" className="flex-1">
                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                        Reserve Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Amenities */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              Shared
              <br />
              <span className="font-serif italic text-amber-600">Villa Amenities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All guests enjoy access to our carefully curated amenities and services, designed to enhance your lakeside
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sharedAmenities.map((amenity, index) => {
              const IconComponent = amenity.icon
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{amenity.name}</h3>
                    <p className="text-gray-600 text-sm">{amenity.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                Ready to Experience
                <br />
                <span className="font-serif italic text-amber-600">Ko Lake Villa?</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Book directly with us and save 10% while enjoying personalized service from our dedicated team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
                    Book Your Stay
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3"
                  >
                    Speak with Our Team
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
