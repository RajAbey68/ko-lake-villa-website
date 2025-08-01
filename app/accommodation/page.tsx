"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  Star, 
  Clock, 
  Users, 
  Bed,
  Bath,
  Wifi,
  Car,
  Utensils,
  MapPin,
  Shield,
  DollarSign,
  Calendar,
  Heart,
  Gift
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import GlobalHeader from "@/components/navigation/global-header"

interface AccommodationType {
  id: string
  name: string
  subtitle: string
  description: string
  airbnbPrice: number
  specialPrice: number
  savings: number
  discountPercentage: number
  guests: number
  bedrooms: number
  bathrooms: number
  image: string
  gallery: string[]
  features: string[]
  amenities: string[]
  airbnbLink: string
  popularChoice?: boolean
}

export default function AccommodationPage() {
  const [currentDate] = useState(new Date())
  const [nextFiveDays] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 5)
    return date.toLocaleDateString('en-GB')
  })

  const accommodations: AccommodationType[] = [
    {
      id: "entire-villa",
      name: "Entire Villa Exclusive",
      subtitle: "Perfect for Large Groups & Special Occasions",
      description: "Experience ultimate luxury with exclusive access to our entire lakefront villa. Full villa with 7 air-conditioned ensuite bedrooms, sleeps maximum 23 guests on beds. Ideal for families, celebrations, and group getaways with complete privacy and premium amenities.",
      airbnbPrice: 431,
      specialPrice: 366,
      savings: 65,
      discountPercentage: 15,
      guests: 23,
      bedrooms: 7,
      bathrooms: 7,
      image: "/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg",
      gallery: [
        "/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg",
        "/uploads/gallery/lake-garden/KoggalaNinePeaks_lake-garden_0.jpg",
        "/uploads/gallery/front-garden/KoggalaNinePeaks_front-garden_0.jpg"
      ],
      features: [
        "7 air-conditioned ensuite bedrooms",
        "Sleeps maximum 23 guests on beds",
        "Exclusive use of entire property",
        "Private infinity pool with lake views",
        "Chef & full kitchen facilities",
        "Multiple living and dining areas",
        "Private boat dock access",
        "Dedicated parking for 4 cars",
        "Garden and terrace spaces"
      ],
      amenities: ["Private Pool", "Lake Access", "Full Kitchen", "Free Parking", "WiFi", "AC", "Chef Service"],
      airbnbLink: "https://airbnb.co.uk/h/eklv",
      popularChoice: true
    },
    {
      id: "master-family-suite",
      name: "Master Family Suite",
      subtitle: "Luxury Suite with Stunning Lake Views",
      description: "Our premium family suite offers the perfect blend of comfort and elegance with breathtaking lake views, private balcony, and luxury amenities for up to 4 guests.",
      airbnbPrice: 119,
      specialPrice: 101,
      savings: 18,
      discountPercentage: 15,
      guests: 4,
      bedrooms: 1,
      bathrooms: 1,
      image: "/uploads/gallery/family-suite/KoggalaNinePeaks_family-suite_0.png",
      gallery: [
        "/uploads/gallery/family-suite/KoggalaNinePeaks_family-suite_0.png",
        "/uploads/gallery/family-suite/KoggalaNinePeaks_family-suite_1.png"
      ],
      features: [
        "Spacious king-size bedroom",
        "Private balcony with lake views",
        "Luxury en-suite bathroom",
        "Sitting area with lake views",
        "Premium bedding and linens",
        "Mini-fridge and coffee station",
        "Direct lake access",
        "Shared pool and garden access"
      ],
      amenities: ["Lake View", "Private Balcony", "En-suite Bath", "Pool Access", "WiFi", "AC", "Mini Fridge"],
      airbnbLink: "https://airbnb.co.uk/h/klv6"
    },
    {
      id: "triple-twin-rooms",
      name: "Triple/Twin Rooms",
      subtitle: "Comfortable Accommodation for Small Groups",
      description: "Flexible and budget-friendly accommodation perfect for backpackers, small groups, or solo travelers seeking comfort without compromising on the Ko Lake Villa experience.",
      airbnbPrice: 70,
      specialPrice: 60,
      savings: 10,
      discountPercentage: 15,
      guests: 3,
      bedrooms: 1,
      bathrooms: 1,
      image: "/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg",
      gallery: [
        "/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg",
        "/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_1.jpg"
      ],
      features: [
        "Flexible twin or triple bed setup",
        "Garden and partial lake views",
        "Shared bathroom facilities",
        "Access to common areas",
        "Shared kitchen facilities",
        "Pool and garden access",
        "Budget-friendly option",
        "Perfect for backpackers"
      ],
      amenities: ["Garden View", "Shared Kitchen", "Pool Access", "WiFi", "AC", "Parking"],
      airbnbLink: "https://airbnb.co.uk/h/klv2or3"
    }
  ]

  const handleWhatsAppBooking = (roomName: string) => {
    const message = `Hi! I'm interested in booking the ${roomName} for a stay within the next 5 days to get the 15% direct booking discount. Can you please provide me with a quote?`
    const whatsappUrl = `https://wa.me/94717765780?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handlePhoneBooking = (roomName: string) => {
    window.location.href = "tel:+94717765780"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
              Accommodation & Booking
            </h1>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto mb-8">
              Choose from our luxury accommodation options and save up to 15% when you book direct for stays within the next 5 days.
            </p>
            
            {/* Special Offer Banner */}
            <Alert className="max-w-4xl mx-auto border-green-200 bg-green-50">
              <Gift className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 font-medium">
                <strong>🎉 Special Direct Booking Offer:</strong> Book directly with us for a stay within the next 5 days and save 15% below current Airbnb prices! 
                <strong> Valid until {nextFiveDays}</strong>
              </AlertDescription>
            </Alert>
            
            {/* Airbnb URLs Summary - Plain Text Copy & Paste */}
            <div className="max-w-4xl mx-auto mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 text-center">
                📋 Airbnb Booking URLs (Copy & Paste)
              </h3>
              <div className="accommodation-listing space-y-3">
                <div className="bg-white p-3 rounded border border-blue-200">
                  <strong className="text-blue-800">Entire Villa:</strong>{" "}
                  <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded select-all">
                    airbnb.co.uk/h/eklv
                  </span>
                  <div className="mt-2 text-sm">
                    <em className="text-blue-700 font-medium">
                      7 air-conditioned ensuite bedrooms, sleeps max 23 on beds
                    </em>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <strong className="text-blue-800">Master Family Suite:</strong>{" "}
                  <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded select-all">
                    airbnb.co.uk/h/klv6
                  </span>
                </div>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <strong className="text-blue-800">Triple/Twin Rooms:</strong>{" "}
                  <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded select-all">
                    airbnb.co.uk/h/klv2or3
                  </span>
                </div>
              </div>
              <p className="text-sm text-blue-700 text-center mt-3">
                Click on any URL to select all text, then copy and paste into your browser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {accommodations.map((room, index) => (
              <Card key={room.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {room.popularChoice && (
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2">
                    <span className="font-bold flex items-center justify-center">
                      <Star className="w-4 h-4 mr-2 fill-current" />
                      MOST POPULAR CHOICE
                      <Star className="w-4 h-4 ml-2 fill-current" />
                    </span>
                  </div>
                )}
                
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                  {/* Image Section */}
                  <div className={`relative ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <Image
                      src={room.image}
                      alt={room.name}
                      width={600}
                      height={500}
                      className="w-full h-96 lg:h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className="bg-red-500 text-white px-3 py-1">
                        Save £{room.savings}/night
                      </Badge>
                      <Badge className="bg-green-500 text-white px-3 py-1">
                        {room.discountPercentage}% OFF Airbnb Price
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-white/90 text-gray-800 px-3 py-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Next 5 days only
                      </Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className={`p-8 flex flex-col justify-between ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-3xl font-bold text-gray-900">{room.name}</h2>
                        {room.popularChoice && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            <Heart className="w-3 h-3 mr-1 fill-current" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg text-amber-600 font-medium mb-2">{room.subtitle}</p>
                      <p className="text-gray-600 mb-6">{room.description}</p>

                      {/* Room Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 rounded-lg p-4">
                        <div className="text-center">
                          <Users className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                          <div className="text-sm text-gray-600">Up to</div>
                          <div className="font-bold text-lg">{room.guests} guests</div>
                        </div>
                        <div className="text-center">
                          <Bed className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                          <div className="text-sm text-gray-600">Bedrooms</div>
                          <div className="font-bold text-lg">{room.bedrooms}</div>
                        </div>
                        <div className="text-center">
                          <Bath className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                          <div className="text-sm text-gray-600">Bathrooms</div>
                          <div className="font-bold text-lg">{room.bathrooms}</div>
                        </div>
                      </div>

                      {/* Pricing Comparison */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Pricing Comparison</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Airbnb Price */}
                          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-500 mb-1">Airbnb Price</div>
                            <div className="text-2xl font-bold text-gray-400 line-through">
                              £{room.airbnbPrice}
                            </div>
                            <div className="text-sm text-gray-500">/night</div>
                          </div>

                          {/* Direct Price */}
                          <div className="text-center p-4 bg-green-500 text-white rounded-lg border-2 border-green-600 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 transform rotate-12 translate-x-1 -translate-y-1">
                              BEST DEAL
                            </div>
                            <div className="text-sm mb-1">Book Direct & Save</div>
                            <div className="text-3xl font-bold">
                              £{room.specialPrice}
                            </div>
                            <div className="text-sm">
                              /night • Save £{room.savings}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 text-center">
                          <p className="text-sm text-green-700 font-medium">
                            ⏰ <strong>Book direct for a stay within the next 5 days to unlock this discount!</strong>
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            *Contact us for live pricing and your special quoted rate
                          </p>
                        </div>
                      </div>

                      {/* Features Grid */}
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <Star className="w-4 h-4 mr-2 text-amber-500" />
                          Key Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {room.features.slice(0, 6).map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 flex-shrink-0"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-amber-200 text-amber-700">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Booking Actions */}
                    <div className="border-t pt-6 space-y-4">
                      <div className="text-center mb-4">
                        <h4 className="font-bold text-lg text-gray-900 mb-2">Choose Your Booking Option</h4>
                      </div>

                      {/* Direct Booking - Primary CTA */}
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white">
                        <div className="text-center mb-3">
                          <h5 className="font-bold text-lg">🎯 BOOK DIRECT: Special Offer</h5>
                          <p className="text-sm text-green-100">Save 15% below Airbnb price • Valid for next 5 days</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button 
                            className="w-full bg-white text-green-600 hover:bg-green-50 font-bold"
                            onClick={() => handleWhatsAppBooking(room.name)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            WhatsApp Quote
                          </Button>
                          <Button 
                            className="w-full bg-green-700 hover:bg-green-800 font-bold"
                            onClick={() => handlePhoneBooking(room.name)}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Manager
                          </Button>
                        </div>
                        <p className="text-xs text-center text-green-100 mt-2">
                          📞 +94 71 776 5780 • Contact us for a quote and your discount!
                        </p>
                      </div>

                      {/* Airbnb Booking */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-center mb-3">
                          <h5 className="font-bold text-gray-800">Standard Airbnb Booking</h5>
                          <p className="text-sm text-gray-600">Book through Airbnb at regular price</p>
                        </div>
                        
                        {/* Plain Text Airbnb URL - Copy & Pastable */}
                        <div className="bg-white border border-gray-300 rounded-md p-3 mb-3">
                          <div className="text-sm text-gray-700 mb-1">
                            <strong>Airbnb URL (Copy & Paste):</strong>
                          </div>
                          <div className="font-mono text-sm text-blue-600 bg-gray-50 p-2 rounded border select-all">
                            {room.airbnbLink.replace('https://', '')}
                          </div>
                          {room.id === "entire-villa" && (
                            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                              <div className="text-sm text-amber-800 font-medium">
                                <strong>Villa Details:</strong> 7 air-conditioned ensuite bedrooms, sleeps max 23 on beds
                              </div>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            Click to select all • Copy and paste this URL into your browser
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold"
                          asChild
                        >
                          <a href={room.airbnbLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Book on Airbnb - £{room.airbnbPrice}/night
                          </a>
                        </Button>
                      </div>

                      {/* Gallery Link */}
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/gallery?category=${room.id}`}>
                          <MapPin className="w-4 h-4 mr-2" />
                          View Photo Gallery
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Details */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Special Direct Booking Benefits</h2>
                              <p className="text-xl text-gray-600">Why book directly with Ko Lake Villa?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">15% OFF</h3>
              <h4 className="font-bold text-gray-900 mb-2">Lower Rates</h4>
              <p className="text-sm text-gray-600">Save significantly compared to booking platforms for next 5 days</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">24/7</h3>
              <h4 className="font-bold text-gray-900 mb-2">Personal Service</h4>
              <p className="text-sm text-gray-600">Direct WhatsApp and phone contact with our team</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">Flexible</h3>
              <h4 className="font-bold text-gray-900 mb-2">Booking Terms</h4>
              <p className="text-sm text-gray-600">More flexible cancellation and modification policies</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-amber-600 mb-2">Best</h3>
              <h4 className="font-bold text-gray-900 mb-2">Price Guarantee</h4>
              <p className="text-sm text-gray-600">We'll match any legitimate lower rate you find</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Book Your Perfect Stay?</h2>
          
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-4">Get Your 15% Discount Quote Now!</h3>
            <p className="text-lg mb-6">
              Contact us directly for stays within the next 5 days and save below Airbnb prices
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h4 className="font-bold mb-2">General Manager</h4>
                <p className="mb-3">+94 71 776 5780</p>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open("https://wa.me/94717765780", "_blank")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Now
                </Button>
              </div>
              
              <div className="text-center">
                <h4 className="font-bold mb-2">Direct Phone</h4>
                <p className="mb-3">Available 7:00 AM - 10:30 PM</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = "tel:+94717765780"}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>

          <Alert className="border-amber-200 bg-amber-50">
            <Clock className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Limited Time Offer:</strong> 15% discount valid for bookings made for stays within the next 5 days only. 
              Contact us now for availability and your special quote!
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </div>
  )
}
