import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Star, MessageCircle, ArrowRight, Users, Bed, Waves, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800 tracking-tight">KO LAKE VILLA</div>
                <div className="text-xs text-gray-500 tracking-wider">AHANGAMA • SRI LANKA</div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-700">
              <Link href="/" className="hover:text-stone-800 transition-colors">
                Home
              </Link>
              <Link href="/accommodation" className="hover:text-stone-800 transition-colors">
                Accommodation
              </Link>
              <Link href="/experiences" className="hover:text-stone-800 transition-colors">
                Experiences
              </Link>
              <Link href="/gallery" className="hover:text-stone-800 transition-colors">
                Gallery
              </Link>
               <Link href="/deals" className="hover:text-stone-800 transition-colors">
                Deals
              </Link>
              <Link href="/contact" className="hover:text-stone-800 transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="hidden md:flex border-stone-300 text-stone-700 hover:bg-stone-50">
                <a href="tel:+940711730345">Call Us</a>
              </Button>
              <Button asChild className="bg-stone-800 hover:bg-stone-900 text-white px-5">
                <Link href="/booking">Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920&text=Ko Lake Villa - Serene Lakeside View"
            alt="Ko Lake Villa - A luxury lakeside retreat in Ahangama, Sri Lanka"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
            Ko Lake Villa
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto font-light">
            Your Luxury Accommodation Catalyst. Experience boutique lakeside luxury in Ahangama, Sri Lanka with personalized service and stunning lake views.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-200 px-8 py-4 text-lg font-medium shadow-lg">
              <Link href="/booking">
                Book Your Stay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-medium">
              <Link href="/gallery">
                View Gallery
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-light text-gray-800 mb-4">A Lakeside Sanctuary of Modern Luxury</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ko Lake Villa is an owner-operated, award-winning architectural masterpiece offering a unique blend of contemporary design and the tranquil beauty of Koggala Lake. We provide an intimate, personalized experience, ensuring every stay is unforgettable.
            </p>
        </div>
      </section>


      {/* Property Showcase */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Our Accommodations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our versatile spaces, designed for comfort and luxury, whether you're booking the entire villa for a group retreat or an individual suite for a quiet getaway.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 bg-stone-100 text-stone-800 border-stone-200">The Ultimate Group Retreat</Badge>
              <h3 className="text-3xl font-light text-gray-900 mb-4">
                The Complete Villa
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Enjoy exclusive access to our entire lakeside property. With seven beautifully appointed bedrooms, expansive living spaces, and private amenities, it's the perfect setting for celebrations, corporate retreats, and unforgettable family gatherings.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8 text-center">
                <div>
                  <Users className="w-6 h-6 text-stone-600 mx-auto mb-2" />
                  <div className="text-2xl font-light text-gray-900">18</div>
                  <div className="text-sm text-gray-600">Max Guests</div>
                </div>
                <div>
                  <Bed className="w-6 h-6 text-stone-600 mx-auto mb-2" />
                  <div className="text-2xl font-light text-gray-900">7</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div>
                  <Waves className="w-6 h-6 text-stone-600 mx-auto mb-2" />
                  <div className="text-2xl font-light text-gray-900">Full</div>
                  <div className="text-sm text-gray-600">Lake Access</div>
                </div>
              </div>
              <Button asChild size="lg" className="bg-stone-800 hover:bg-stone-900 text-white w-full">
                <Link href="/booking?room=villa">Reserve the Villa</Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-w-4 aspect-h-5 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=480&text=The Entire Villa"
                  alt="View of the entire Ko Lake Villa from the lake"
                  width={480}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Individual Suites */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Replace with dynamic data later */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="aspect-h-2 aspect-w-3 bg-gray-200">
                <Image
                  src="/placeholder.svg?height=200&width=300&text=Family Suite"
                  alt="Family Suite"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">Family Suite</h3>
                <p className="text-gray-600 text-sm mb-4">Perfect for families or small groups, offering space and comfort.</p>
                <Button variant="outline" asChild className="w-full">
                    <Link href="/booking?room=family-suite">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="aspect-h-2 aspect-w-3 bg-gray-200">
                <Image
                  src="/placeholder.svg?height=200&width=300&text=Group Room"
                  alt="Group Room"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">Group Room</h3>
                <p className="text-gray-600 text-sm mb-4">Ideal for friends or teams, designed for a communal and lively experience.</p>
                 <Button variant="outline" asChild className="w-full">
                    <Link href="/booking?room=group-room">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="aspect-h-2 aspect-w-3 bg-gray-200">
                <Image
                  src="/placeholder.svg?height=200&width=300&text=Triple Room"
                  alt="Triple Room"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">Triple Room</h3>
                <p className="text-gray-600 text-sm mb-4">A comfortable space for three, balancing privacy and shared moments.</p>
                 <Button variant="outline" asChild className="w-full">
                    <Link href="/booking?room=triple-room">View Details</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
              <h3 className="text-2xl font-light mb-4">KO LAKE VILLA</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                  Your luxury accommodation catalyst in Ahangama, Sri Lanka.
              </p>
              <div className="flex justify-center space-x-6 mb-8">
                  <a href="mailto:kolakevilla@gmail.com" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                      <Mail className="w-5 h-5" />
                      <span>kolakevilla@gmail.com</span>
                  </a>
                   <a href="tel:+940711730345" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                      <Phone className="w-5 h-5" />
                      <span>+94 071 173 0345</span>
                  </a>
              </div>
               <div className="text-gray-500 text-sm">
                  &copy; {new Date().getFullYear()} Ko Lake Villa. All rights reserved.
              </div>
          </div>
      </footer>
    </div>
  )
}
