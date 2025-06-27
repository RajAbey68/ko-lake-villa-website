import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, MapPin, Clock, Users, Wifi, Waves, Car, Utensils } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Waves,
      title: "Private Pool",
      description: "Relax in our infinity pool overlooking Koggala Lake"
    },
    {
      icon: Wifi,
      title: "Free WiFi",
      description: "High-speed internet throughout the property"
    },
    {
      icon: Car,
      title: "Free Parking",
      description: "Secure parking available for all guests"
    },
    {
      icon: Utensils,
      title: "Restaurant",
      description: "Authentic Sri Lankan cuisine with lake views"
    }
  ]

  const testimonials = [
    {
      name: "Sarah & Mike",
      location: "London, UK",
      rating: 5,
      comment: "Absolutely stunning location! The lake views are breathtaking and the staff went above and beyond."
    },
    {
      name: "The Johnson Family",
      location: "Melbourne, Australia",
      rating: 5,
      comment: "Perfect for families. Our kids loved the pool and the boat safari was unforgettable."
    },
    {
      name: "David & Emma",
      location: "Toronto, Canada",
      rating: 5,
      comment: "The best villa experience we've ever had. Highly recommend the stilt fishing experience!"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold text-amber-900 tracking-tight">
            Ko Lake Villa
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/deals"
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
            >
              Deals
            </Link>
            <Link
              href="/accommodation"
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
            >
              Accommodation
            </Link>
            <Link
              href="/dining"
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
            >
              Dining
            </Link>
            <Link
              href="/experiences"
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
            >
              Experiences
            </Link>
            <Link
              href="/gallery"
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
            >
              Gallery
            </Link>
            <Link
              href="/faq"
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          <Button className="bg-orange-400 hover:bg-orange-500 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-sm transition-all duration-200">
            Book Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/placeholder.svg?height=800&width=1920&text=Ko+Lake+Villa+Hero"
            alt="Ko Lake Villa - Luxury Lakefront Accommodation"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
            Relax. Revive. Reconnect.
          </h1>
          <p className="text-xl lg:text-2xl font-light mb-8 tracking-wide max-w-3xl mx-auto">
            Experience luxury lakefront accommodation in the heart of Ahangama, Sri Lanka. 
            Where tranquility meets adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-400 hover:bg-orange-500 text-white font-medium text-lg px-8 py-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300">
              Book Your Stay
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-medium text-lg px-8 py-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300">
              View Experiences
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">4.9</div>
              <div className="text-gray-600">Guest Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">7</div>
              <div className="text-gray-600">Room Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">18</div>
              <div className="text-gray-600">Max Guests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Ko Lake Villa?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of luxury, comfort, and authentic Sri Lankan hospitality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Ready for Your Perfect Getaway?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Book direct and save 10% on your stay. Experience the magic of Koggala Lake.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-400 hover:bg-orange-500 text-white font-medium text-lg px-8 py-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300">
              Check Availability
            </Button>
            <Button size="lg" variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-400 hover:text-white font-medium text-lg px-8 py-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
