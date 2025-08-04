"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, MessageCircle, Users, Bed, Bath, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function KoLakeVilla() {
  const [currentPage, setCurrentPage] = useState("home")

  // Use static room data to prevent loading issues
  const roomTypes = [
    {
      id: "entire-villa",
      name: "Entire Villa",
      airbnbPrice: 431,
      directPrice: 388,
      savings: 43,
      discount: "10%",
      guests: 23,
      bedrooms: 7,
      bathrooms: 7,
      image: "/placeholder.svg?height=300&width=400&text=Entire+Villa",
      features: ["7 ensuite bedrooms", "Air conditioning", "Private pool", "Lake views"],
      url: "https://airbnb.co.uk/h/eklv"
    },
    {
      id: "master-family-suite",
      name: "Master Family Suite",
      airbnbPrice: 119,
      directPrice: 107,
      savings: 12,
      discount: "10%",
      guests: 6,
      bedrooms: 1,
      bathrooms: 1,
      image: "/placeholder.svg?height=300&width=400&text=Master+Suite",
      features: ["Lake views", "Master bedroom", "Private terrace", "Pool access"],
      url: "https://airbnb.co.uk/h/klv6"
    },
    {
      id: "triple-twin-rooms",
      name: "Triple/Twin Rooms",
      airbnbPrice: 70,
      directPrice: 63,
      savings: 7,
      discount: "10%",
      guests: 3,
      bedrooms: 1,
      bathrooms: 1,
      image: "/placeholder.svg?height=300&width=400&text=Twin+Room",
      features: ["Flexible bedding", "Air conditioning", "Garden views", "Shared facilities"],
      url: "https://airbnb.co.uk/h/klv2or3"
    }
  ]

  const galleryImages = [
    { src: "/placeholder.svg?height=300&width=400&text=Villa+Exterior", title: "Villa Exterior" },
    { src: "/placeholder.svg?height=300&width=400&text=Pool+Area", title: "Pool Area" },
    { src: "/placeholder.svg?height=300&width=400&text=Lake+View", title: "Lake View" },
    { src: "/placeholder.svg?height=300&width=400&text=Master+Bedroom", title: "Master Bedroom" },
    { src: "/placeholder.svg?height=300&width=400&text=Living+Room", title: "Living Room" },
    { src: "/placeholder.svg?height=300&width=400&text=Dining+Area", title: "Dining Area" },
  ]

  // Render main content immediately without loading state
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation section */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-amber-900">Ko Lake Villa</h1>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-amber-900">Home</Link>
              <Link href="/accommodation" className="text-gray-600 hover:text-amber-900">Accommodation</Link>
              <Link href="/gallery" className="text-gray-600 hover:text-amber-900">Gallery</Link>
              <Link href="/contact" className="text-gray-600 hover:text-amber-900">Contact</Link>
            </div>
            <div className="flex items-center">
              <Button
                size="sm"
                className="bg-amber-900 hover:bg-amber-800 text-white"
                onClick={() => setCurrentPage("booking")}
              >
                Book Now
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-r from-amber-900 to-orange-700 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-pool.jpg"
            alt="Ko Lake Villa Pool and Lake View"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full text-center bg-black bg-opacity-30">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Ko Lake Villa</h1>
            <p className="text-xl md:text-2xl mb-2">Luxury Lakefront Accommodation in Sri Lanka</p>
            <p className="text-lg md:text-xl mb-4 font-light italic">Relax, Revive, Connect</p>
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">Koggala Lake, Galle District</span>
            </div>
            <div className="flex items-center justify-center mb-8 space-x-6">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <a href="tel:+94711730345" className="text-lg hover:text-amber-200">+94711730345</a>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                <a href="https://wa.me/94711730345" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-amber-200">WhatsApp</a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/accommodation">
                <Button
                  size="lg"
                  className="bg-white text-amber-900 hover:bg-amber-50 hover:text-amber-900 w-full"
                >
                  View Rooms & Rates
                </Button>
              </a>
              <a href="/gallery">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-amber-900 w-full"
                >
                  Explore Gallery
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">
                {Math.max(...roomTypes.map(r => r.guests))}
              </div>
              <div className="text-gray-600">Max Guests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">
                {Math.max(...roomTypes.map(r => r.bedrooms))}
              </div>
              <div className="text-gray-600">Bedrooms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">4.9</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                Rating
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">15%</div>
              <div className="text-gray-600">Save Direct</div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Preview - Accommodation Section */}
      <section id="accommodation" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Stay</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From intimate suites to the entire villa, we offer flexible accommodation options with significant savings
              when you book direct.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomTypes.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={room.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-red-500">Save {room.discount}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-4">{room.guests} guests max</p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 line-through">Airbnb: ${room.airbnbPrice}</span>
                      <span className="text-sm text-green-600 font-medium">Save ${room.savings}</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-800">
                      ${room.directPrice}
                      <span className="text-sm font-normal text-gray-500">/night</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {room.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {feature}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600" 
                      asChild
                    >
                      <Link href="/contact">Book Direct & Save</Link>
                    </Button>
                    <a 
                      href={room.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full text-sm"
                      >
                        Compare on Airbnb
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dining Section */}
      <section id="dining" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Exceptional Dining</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Savor authentic Sri Lankan cuisine and international dishes with breathtaking lake views
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=200&width=300&text=Chef+Service"
                alt="Private Chef Service"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Private Chef Service</h3>
                <p className="text-gray-600 mb-4">
                  Enjoy personalized dining with our expert chef who specializes in authentic Sri Lankan cuisine and international dishes.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Fresh seafood from local fishermen</li>
                  <li>• Organic vegetables from local farms</li>
                  <li>• Custom dietary accommodations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=200&width=300&text=Lake+Dining"
                alt="Lakeside Dining"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Lakeside Dining</h3>
                <p className="text-gray-600 mb-4">
                  Dine al fresco on our lakeside terrace while enjoying stunning sunset views over Koggala Lake.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sunset dinner experiences</li>
                  <li>• Romantic candlelit meals</li>
                  <li>• Traditional Sri Lankan BBQ</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <Image
                src="/placeholder.svg?height=200&width=300&text=Cooking+Classes"
                alt="Cooking Classes"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Cooking Classes</h3>
                <p className="text-gray-600 mb-4">
                  Learn to prepare authentic Sri Lankan dishes with hands-on cooking classes using traditional methods.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Spice garden tours</li>
                  <li>• Traditional curry preparation</li>
                  <li>• Rice and coconut dishes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to experience Ko Lake Villa? Contact our friendly team to plan your perfect getaway.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <a href="tel:+94711730345" className="text-gray-600 hover:text-orange-600">+94711730345</a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">WhatsApp</div>
                        <a href="https://wa.me/94711730345" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
                          Quick responses, 24/7
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-amber-600" />
                      <div>
                        <div className="font-medium">Email</div>
                        <a href="mailto:contact@KoLakeHouse.com" className="text-gray-600 hover:text-amber-600">contact@KoLakeHouse.com</a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-gray-600">Kathaluwa West, Koggala Lake, Galle District</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => window.open("https://wa.me/94711730345", "_blank")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open("tel:+94711730345")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>

            {/* Quick Contact Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Inquiry</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                      placeholder="Tell us about your planned stay..."
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
