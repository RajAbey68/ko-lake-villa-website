"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Star, MapPin, Phone, Mail, Calendar, Users, Utensils, Camera, Waves } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  const handleViewGallery = () => {
    router.push("/gallery")
  }

  const handleRequestInfo = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleBookDirect = () => {
    window.open("https://www.guesty.com/ko-lake-villa", "_blank")
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi! I'm interested in booking Ko Lake Villa. Can you help me?")
    window.open(`https://wa.me/94711730345?text=${message}`, "_blank")
  }

  const handleAccommodation = () => {
    router.push("/accommodation")
  }

  const handleDining = () => {
    router.push("/dining")
  }

  const handleExperiences = () => {
    router.push("/experiences")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-4rem)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-pool.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">Ko Lake Villa</h1>
            <p className="text-2xl md:text-3xl mb-4 text-white/95 drop-shadow-md font-light tracking-wide">
              Relax, Revive, Connect
            </p>
            <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow-sm max-w-2xl mx-auto">
              By Koggala Lake in Ahangama, Sri Lanka
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-testid="hero-cta">
              <Button
                onClick={handleViewGallery}
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-amber-800 transition-all duration-300"
              >
                <Camera className="h-4 w-4 mr-2" />
                View Gallery
              </Button>
              <Button
                onClick={handleRequestInfo}
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-amber-800 transition-all duration-300"
              >
                Request Info
              </Button>
              <Button
                onClick={handleBookDirect}
                className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Direct - Save 10%
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="accommodation" className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-800 mb-6">Experience Paradise</h2>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto leading-relaxed">
              Discover the perfect blend of luxury and tranquility at Ko Lake Villa, where every moment becomes a
              cherished memory. Relax by our infinity pool, revive your spirit in nature, and connect with what matters
              most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card 
              className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={handleAccommodation}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-semibold text-amber-800 mb-4">Luxury Accommodation</h3>
                <p className="text-amber-600 leading-relaxed">
                  Spacious 4-bedroom villa with stunning lake views, modern amenities, and that perfect infinity pool
                  for the ultimate getaway.
                </p>
              </CardContent>
            </Card>

            <Card 
              className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={handleDining}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Utensils className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-semibold text-amber-800 mb-4">Exquisite Dining</h3>
                <p className="text-amber-600 leading-relaxed">
                  Savor authentic Sri Lankan cuisine and international dishes prepared by our expert chefs in the
                  comfort of your villa.
                </p>
              </CardContent>
            </Card>

            <Card 
              className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={handleExperiences}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-semibold text-amber-800 mb-4">Unique Experiences</h3>
                <p className="text-amber-600 leading-relaxed">
                  From lake activities to cultural tours, surf adventures to wellness retreats - create unforgettable
                  memories.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h2>
            <p className="text-lg text-gray-600 mb-8">Explore our stunning spaces and beautiful surroundings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                onClick={handleViewGallery}
              >
                <img
                  src={`/placeholder.svg?height=300&width=400&text=Gallery+Image+${i}`}
                  alt={`Ko Lake Villa Gallery Image ${i}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handleViewGallery}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-amber-800 mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="text-lg text-amber-700">
                    <div>Madolduwa Road</div>
                    <div>Kathaluwa West</div>
                    <div>Ahangama 80650</div>
                    <div className="mt-2">
                      <a 
                        href="https://maps.app.goo.gl/ufFwKEXH65Rh7Anv8" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 underline text-sm"
                      >
                        View on Google Maps
                      </a>
                    </div>
                    <div>
                      <a 
                        href="https://what3words.com/wifely.rebuff.vented" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 underline text-sm"
                      >
                        what3words: wifely.rebuff.vented
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="text-lg text-amber-700">
                    <div>WhatsApp: +94711730345</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-orange-500" />
                  </div>
                  <span className="text-lg text-amber-700">contact@KoLakeHouse.com</span>
                </div>
              </div>
            </div>

            <div>
              <Card className="bg-white shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-amber-800 mb-6">Quick Booking</h3>
                  <form
                    data-testid="booking-form"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleBookDirect()
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-amber-700 mb-2">Check-in</label>
                        <input
                          type="date"
                          required
                          className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-amber-700 mb-2">Check-out</label>
                        <input
                          type="date"
                          required
                          className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-2">Guests</label>
                      <select
                        required
                        className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      >
                        <option value="">Select number of guests</option>
                        <option value="2">2 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="6">6 Guests</option>
                        <option value="8">8+ Guests</option>
                      </select>
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg">
                      Check Availability
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Ko Lake Villa</h3>
              <p className="text-amber-200 mb-4">Relax, Revive, Connect</p>
              <p className="text-amber-300 text-sm">Your gateway to paradise by Koggala Lake in Ahangama, Sri Lanka</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-100">Contact Info</h4>
              <div className="space-y-2 text-amber-200 text-sm">
                <div>Madolduwa Road, Kathaluwa West</div>
                <div>Ahangama 80650, Sri Lanka</div>
                <div>WhatsApp: +94711730345</div>
                <div>Email: contact@KoLakeHouse.com</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-100">Quick Links</h4>
              <div className="space-y-2 text-amber-200 text-sm">
                <div><a href="/accommodation" className="hover:text-white transition-colors">Accommodation</a></div>
                <div><a href="/dining" className="hover:text-white transition-colors">Dining</a></div>
                <div><a href="/experiences" className="hover:text-white transition-colors">Experiences</a></div>
                <div><a href="/gallery" className="hover:text-white transition-colors">Gallery</a></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-amber-700 text-center">
            <div className="flex justify-center space-x-8 mb-4">
              <Badge variant="secondary" className="bg-orange-500 text-white px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                5.0 Rating
              </Badge>
              <Badge variant="secondary" className="bg-orange-500 text-white px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                Book Direct & Save
              </Badge>
            </div>
            <p className="text-amber-300 text-sm">© 2024 Ko Lake Villa. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleWhatsApp}
          size="lg"
          className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
