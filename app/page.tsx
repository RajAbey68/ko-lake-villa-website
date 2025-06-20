import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Star, MessageCircle, ArrowRight, Users, Bed, Waves } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 tracking-wide">KO LAKE VILLA</div>
                <div className="text-xs text-gray-500 tracking-widest">KOGGALA LAKE • SRI LANKA</div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/accommodation" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                Accommodation
              </Link>
              <Link href="/experiences" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                Experiences
              </Link>
              <Link href="/gallery" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                Gallery
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" className="hidden md:flex border-amber-600 text-amber-600 hover:bg-amber-50">
                Enquire
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6">Book Direct</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920&text=Ko Lake Villa - Award-winning lakeside architecture"
            alt="Ko Lake Villa - Award-winning luxury lakeside retreat"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
        </div>

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              Award-Winning Architecture
            </Badge>
          </div>

          <h1 className="text-6xl md:text-8xl font-light mb-8 leading-tight tracking-wide">
            Unforgettable
            <br />
            <span className="font-serif italic">Lake Experiences</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-3xl mx-auto leading-relaxed font-light">
            An owner-operated luxury retreat where contemporary design meets the timeless beauty of Koggala Lake.
            <br />
            <span className="text-amber-200">Create everlasting memories in Sri Lanka's south.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/accommodation">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium">
                Discover Our Spaces
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/gallery">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium"
              >
                View Gallery
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-px h-12 bg-white/30"></div>
            <span className="text-xs tracking-widest">SCROLL</span>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Recognition & Awards</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Featured in leading architectural and travel publications for our commitment to design excellence and
              guest experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-3xl font-light text-amber-600">4.9</div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-gray-600 text-sm">Guest Rating</div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-light text-amber-600">2019</div>
              <div className="text-gray-600 text-sm">
                Featured in
                <br />
                Architectural Digest
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-light text-amber-600">100%</div>
              <div className="text-gray-600 text-sm">
                Direct Booking
                <br />
                Satisfaction
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-light text-amber-600">Est.</div>
              <div className="text-gray-600 text-sm">
                Owner Operated
                <br />
                Since 2018
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Showcase */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              Luxury Accommodation
              <br />
              <span className="font-serif italic text-amber-600">by Koggala Lake</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our thoughtfully designed spaces, each offering a unique perspective of Sri Lanka's natural
              beauty and contemporary luxury.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 bg-amber-100 text-amber-800 border-0">Signature Experience</Badge>
              <h3 className="text-3xl font-light text-gray-900 mb-4">
                The Complete Villa
                <br />
                <span className="font-serif italic">Experience</span>
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Exclusive access to our entire lakeside retreat. Seven beautifully appointed bedrooms, expansive living
                spaces, and private amenities create the perfect setting for celebrations, retreats, and unforgettable
                gatherings.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Users className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-light text-gray-900">18</div>
                  <div className="text-sm text-gray-600">Guests</div>
                </div>
                <div className="text-center">
                  <Bed className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-light text-gray-900">7</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Waves className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-light text-gray-900">∞</div>
                  <div className="text-sm text-gray-600">Lake Views</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl font-light text-gray-900">$388</div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 line-through">Airbnb: $431</div>
                  <div className="text-sm text-green-600 font-medium">Save $43 booking direct</div>
                </div>
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">Reserve Complete Villa</Button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=480&text=Complete Villa Experience"
                  alt="Ko Lake Villa - Complete villa experience"
                  width={480}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Individual Suites */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400&text=Master Family Suite"
                  alt="Master Family Suite"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">Master Family Suite</h3>
                    <p className="text-gray-600 text-sm">6+ guests • Lakeside views</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-light text-amber-600">$107</div>
                    <div className="text-xs text-gray-500">per night</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Spacious suite with panoramic lake views, perfect for families seeking elegance and comfort.
                </p>
                <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50">
                  View Suite Details
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400&text=Group Accommodation"
                  alt="Group Accommodation"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">Group Accommodation</h3>
                    <p className="text-gray-600 text-sm">Multiple configurations available</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-light text-amber-600">From $63</div>
                    <div className="text-xs text-gray-500">per night</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Flexible room configurations for groups, couples, and individual travelers.
                </p>
                <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50">
                  Explore Options
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Preview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              Curated
              <br />
              <span className="font-serif italic text-amber-600">Local Experiences</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the authentic beauty of Sri Lanka's southern coast through our carefully selected experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Koggala Lake Safari",
                description: "Private boat tours through pristine mangrove islands",
                image: "/placeholder.svg?height=300&width=400&text=Lake Safari",
              },
              {
                title: "Whale Watching",
                description: "Encounter majestic blue whales in Mirissa waters",
                image: "/placeholder.svg?height=300&width=400&text=Whale Watching",
              },
              {
                title: "Cultural Immersion",
                description: "Traditional stilt fishing and local artisan visits",
                image: "/placeholder.svg?height=300&width=400&text=Cultural Experience",
              },
            ].map((experience, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <Image
                    src={experience.image || "/placeholder.svg"}
                    alt={experience.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-light text-gray-900 mb-2">{experience.title}</h3>
                  <p className="text-gray-600 text-sm">{experience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/experiences">
              <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3">
                View All Experiences
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Owner Message */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=80&width=80&text=Owner"
                  alt="Villa Owner"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-2">A Personal Welcome</h3>
              <p className="text-gray-600">From the Villa Owners</p>
            </div>
            <blockquote className="text-xl text-gray-700 leading-relaxed italic mb-8">
              "We created Ko Lake Villa as a sanctuary where contemporary design harmonizes with Sri Lanka's natural
              beauty. Every detail has been thoughtfully considered to ensure your stay becomes a cherished memory.
              Welcome to our home by the lake."
            </blockquote>
            <div className="text-gray-600">— The Ko Lake Villa Family</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold tracking-wide">KO LAKE VILLA</div>
                  <div className="text-xs text-gray-400 tracking-widest">KOGGALA LAKE • SRI LANKA</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                An award-winning luxury lakeside retreat where contemporary design meets the timeless beauty of Sri
                Lanka's southern coast.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+94 123 456 789</li>
                <li>hello@kolakevilla.com</li>
                <li>Ahangama, Koggala Lake</li>
                <li>Southern Province, Sri Lanka</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Recognition</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Featured in Architectural Digest</li>
                <li>Travel + Leisure Recommended</li>
                <li>4.9★ Guest Rating</li>
                <li>Owner Operated Since 2018</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ko Lake Villa. All rights reserved. | Direct booking saves you 10%</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl">
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
