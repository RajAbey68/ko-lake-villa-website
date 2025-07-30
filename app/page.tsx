"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, MessageCircle, Users, Bed, Bath } from "lucide-react"
import Image from "next/image"
import GlobalHeader from "@/components/navigation/global-header"

export default function KoLakeVilla() {
  const [currentPage, setCurrentPage] = useState("home")

  const roomTypes = [
    {
      id: "KNP",
      name: "Entire Villa Exclusive",
      airbnbPrice: 431,
      directPrice: 388,
      savings: 43,
      discount: "10%",
      guests: 12,
      bedrooms: 6,
      bathrooms: 4,
      image: "/placeholder.svg?height=300&width=400&text=Entire+Villa+View",
      features: ["Private Pool", "Lake Views", "Full Kitchen", "6 Bedrooms"],
    },
    {
      id: "KNP1",
      name: "Master Family Suite",
      airbnbPrice: 119,
      directPrice: 107,
      savings: 12,
      discount: "10%",
      guests: 4,
      bedrooms: 1,
      bathrooms: 1,
      image: "/placeholder.svg?height=300&width=400&text=Master+Suite",
      features: ["Lake View", "Private Balcony", "King Bed", "En-suite Bath"],
    },
    {
      id: "KNP3",
      name: "Triple/Twin Rooms",
      airbnbPrice: 70,
      directPrice: 63,
      savings: 7,
      discount: "10%",
      guests: 3,
      bedrooms: 1,
      bathrooms: 1,
      image: "/placeholder.svg?height=300&width=400&text=Twin+Room",
      features: ["Garden View", "Twin/Triple Beds", "Shared Facilities", "AC"],
    },
    {
      id: "KNP6",
      name: "Group Room",
      airbnbPrice: 250,
      directPrice: 225,
      savings: 25,
      discount: "10%",
      guests: 6,
      bedrooms: 2,
      bathrooms: 2,
      image: "/placeholder.svg?height=300&width=400&text=Group+Room",
      features: ["Multiple Beds", "Shared Space", "Group Friendly", "Lake Access"],
    },
  ]

  const galleryImages = [
    { src: "/placeholder.svg?height=300&width=400&text=Villa+Exterior", title: "Villa Exterior" },
    { src: "/placeholder.svg?height=300&width=400&text=Pool+Area", title: "Pool Area" },
    { src: "/placeholder.svg?height=300&width=400&text=Lake+View", title: "Lake View" },
    { src: "/placeholder.svg?height=300&width=400&text=Master+Bedroom", title: "Master Bedroom" },
    { src: "/placeholder.svg?height=300&width=400&text=Living+Room", title: "Living Room" },
    { src: "/placeholder.svg?height=300&width=400&text=Dining+Area", title: "Dining Area" },
  ]



  const renderHomePage = () => (
    <div>
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
            <p className="text-lg md:text-xl mb-8 font-light italic">Relax, Revive, Connect</p>
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
              <div className="text-3xl font-bold text-amber-800 mb-2">12</div>
              <div className="text-gray-600">Max Guests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">6</div>
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

      {/* Room Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Stay</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From intimate suites to the entire villa, we offer flexible accommodation options with significant savings
              when you book direct.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <p className="text-gray-600 mb-4">{room.guests} guests</p>

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

                  <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => setCurrentPage("booking")}>
                    Book Direct & Save
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  const renderRoomsPage = () => (
    <div>
      <section className="py-16 bg-gradient-to-r from-amber-900 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Accommodation</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Choose from our range of luxury accommodation options, each offering unique experiences with significant
            savings when you book direct.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {roomTypes.map((room, index) => (
              <Card key={room.id} className="overflow-hidden shadow-lg">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
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
                      <Badge className="bg-green-500">≤3 days: 15%</Badge>
                    </div>
                  </div>

                  <CardContent
                    className={`p-8 flex flex-col justify-between ${index % 2 === 1 ? "lg:col-start-1" : ""}`}
                  >
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h2>
                      <p className="text-lg text-gray-600 mb-6">Perfect for {room.guests} guests</p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <Users className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                          <div className="text-sm text-gray-600">Up to</div>
                          <div className="font-semibold">{room.guests} guests</div>
                        </div>
                        <div className="text-center">
                          <Bed className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                          <div className="text-sm text-gray-600">Bedrooms</div>
                          <div className="font-semibold">{room.bedrooms}</div>
                        </div>
                        <div className="text-center">
                          <Bath className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                          <div className="text-sm text-gray-600">Bathrooms</div>
                          <div className="font-semibold">{room.bathrooms}</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg text-gray-500 line-through">Airbnb: ${room.airbnbPrice}/night</span>
                          <span className="text-lg text-green-600 font-semibold">You Save: ${room.savings}</span>
                        </div>
                        <div className="text-3xl font-bold text-amber-900">
                          ${room.directPrice}
                          <span className="text-lg font-normal text-gray-500">/night direct</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {room.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => setCurrentPage("booking")}>
                      Book Direct & Save
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  const renderGalleryPage = () => (
    <div>
      <section className="py-16 bg-gradient-to-r from-amber-900 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Explore the beauty of Ko Lake Villa through our comprehensive photo gallery.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  const renderBookingPage = () => (
    <div>
      <section className="py-12 bg-gradient-to-r from-amber-900 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Book Your Stay</h1>
          <p className="text-xl">Complete the form below and we'll confirm your reservation within 2 hours</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Booking Request</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <input type="date" className="w-full p-3 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <input type="date" className="w-full p-3 border border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select className="w-full p-3 border border-gray-300 rounded-md">
                    <option>Select room type</option>
                    {roomTypes.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - ${room.directPrice}/night
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Any special requests?"
                  ></textarea>
                </div>
                <Button className="w-full" size="lg">
                  Submit Booking Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )

  const renderContactPage = () => (
    <div>
      <section className="py-16 bg-gradient-to-r from-amber-900 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Get in touch with our friendly team. We're here to help you plan the perfect stay.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" className="w-full p-3 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea className="w-full p-3 border border-gray-300 rounded-md" rows={5}></textarea>
                  </div>
                  <Button className="w-full">Send Message</Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-gray-600">+94711730345</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">WhatsApp</div>
                        <div className="text-gray-600">Quick responses, 24/7</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-gray-600">Koggala Lake, Galle District</div>
                      </div>
                    </div>
                  </div>
                  <a href="https://wa.me/94711730345" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat on WhatsApp
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />
      {currentPage === "home" && renderHomePage()}
      {currentPage === "rooms" && renderRoomsPage()}
      {currentPage === "gallery" && renderGalleryPage()}
      {currentPage === "booking" && renderBookingPage()}
      {currentPage === "contact" && renderContactPage()}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ko Lake Villa</h3>
              <p className="text-gray-400">Luxury lakefront accommodation in Sri Lanka's southern coast.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div>
                  <a href="tel:+94711730345" className="hover:text-amber-400 transition-colors">
                    +94711730345
                  </a>
                </div>
                <div>
                  <a href="mailto:contact@KoLakeHouse.com" className="hover:text-amber-400 transition-colors">
                    contact@KoLakeHouse.com
                  </a>
                </div>
                <div>Kathaluwa West, Koggala Lake</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Why Book Direct?</h4>
              <div className="space-y-2 text-gray-400">
                <div>• Save up to 15%</div>
                <div>• Best Rate Guarantee</div>
                <div>• Personalized Service</div>
                <div>• Flexible Cancellation</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="space-y-2 text-gray-400">
                <div>Facebook</div>
                <div>Instagram</div>
                <div>TripAdvisor</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ko Lake Villa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
