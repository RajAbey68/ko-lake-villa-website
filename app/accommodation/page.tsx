import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AccommodationPage() {
  const rooms = [
    {
      id: 1,
      name: "Entire Villa",
      capacity: "Up to 18 guests",
      bedrooms: "7 bedrooms",
      bathrooms: "6 bathrooms",
      size: "450 sqm",
      price: 388,
      originalPrice: 431,
      image: "/placeholder.svg?height=300&width=500&text=Entire+Villa",
      features: ["Private Pool", "Lake View", "Full Kitchen", "Garden Access", "WiFi", "Air Conditioning"],
      description:
        "Experience the entire Ko Lake Villa with panoramic lake views, private pool, and luxurious amenities for large groups.",
    },
    {
      id: 2,
      name: "Master Family Suite",
      capacity: "6+ guests",
      bedrooms: "2 bedrooms",
      bathrooms: "2 bathrooms",
      size: "120 sqm",
      price: 107,
      originalPrice: 119,
      image: "/placeholder.svg?height=300&width=500&text=Family+Suite",
      features: ["Lake View", "Balcony", "Kitchenette", "Living Area", "WiFi", "Air Conditioning"],
      description: "Spacious family suite with stunning lake views, perfect for families seeking comfort and privacy.",
    },
    {
      id: 3,
      name: "Triple/Twin Room",
      capacity: "3+ guests",
      bedrooms: "1 bedroom",
      bathrooms: "1 bathroom",
      size: "35 sqm",
      price: 63,
      originalPrice: 70,
      image: "/placeholder.svg?height=300&width=500&text=Triple+Room",
      features: ["Garden View", "Private Bathroom", "Mini Fridge", "WiFi", "Air Conditioning", "Balcony"],
      description: "Comfortable room with flexible bedding options, ideal for small groups or families.",
    },
    {
      id: 4,
      name: "Group Room",
      capacity: "6+ guests",
      bedrooms: "1 large room",
      bathrooms: "2 bathrooms",
      size: "80 sqm",
      price: 225,
      originalPrice: 250,
      image: "/placeholder.svg?height=300&width=500&text=Group+Room",
      features: ["Multiple Beds", "Shared Space", "Lake View", "Common Area", "WiFi", "Air Conditioning"],
      description: "Perfect for groups seeking shared accommodation with modern amenities and lake access.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-semibold text-amber-900 tracking-tight">
            <Link href="/" className="text-2xl font-semibold text-amber-900 tracking-tight">
              Ko Lake Villa
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
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
              className="text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors duration-200"
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
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/placeholder.svg?height=400&width=1200&text=Accommodation"
            alt="Ko Lake Villa Accommodation"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 tracking-tight">Accommodation</h1>
          <p className="text-xl lg:text-2xl font-light tracking-wide">
            Luxury lakefront rooms and suites for every group size
          </p>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Rooms & Suites</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our selection of beautifully appointed accommodations, each offering stunning lake views and
              modern amenities
            </p>
          </div>

          <div className="space-y-8">
            {rooms.map((room, index) => (
              <Card
                key={room.id}
                className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <Image
                      src={room.image || "/placeholder.svg"}
                      alt={room.name}
                      width={500}
                      height={300}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>

                  <div className="lg:w-1/2 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>{room.capacity}</span>
                          <span>•</span>
                          <span>{room.bedrooms}</span>
                          <span>•</span>
                          <span>{room.bathrooms}</span>
                          <span>•</span>
                          <span>{room.size}</span>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                        Save ${room.originalPrice - room.price}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-6">{room.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {room.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-orange-500">${room.price}</span>
                        <span className="text-lg text-gray-500 line-through">${room.originalPrice}</span>
                        <span className="text-sm text-gray-500">/night</span>
                      </div>
                      <Button className="bg-orange-400 hover:bg-orange-500 text-white px-8">Book Now</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
