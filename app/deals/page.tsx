import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DealsPage() {
  const deals = [
    {
      id: 1,
      title: "Book Direct - Save 15%",
      description: "Skip the booking fees and save when you book directly with us",
      discount: "15% OFF",
      validUntil: "Valid until Dec 31, 2024",
      image: "/placeholder.svg?height=300&width=400&text=Direct+Booking+Deal",
      features: ["Free WiFi", "Complimentary Breakfast", "Late Checkout"],
      originalPrice: 450,
      dealPrice: 383,
    },
    {
      id: 2,
      title: "Extended Stay Special",
      description: "Stay 7 nights or more and enjoy significant savings",
      discount: "20% OFF",
      validUntil: "Valid for stays 7+ nights",
      image: "/placeholder.svg?height=300&width=400&text=Extended+Stay",
      features: ["Weekly Housekeeping", "Laundry Service", "Kitchen Access"],
      originalPrice: 450,
      dealPrice: 360,
    },
    {
      id: 3,
      title: "Early Bird Offer",
      description: "Book 30 days in advance and save on your lakefront getaway",
      discount: "12% OFF",
      validUntil: "Book 30 days ahead",
      image: "/placeholder.svg?height=300&width=400&text=Early+Bird",
      features: ["Free Airport Transfer", "Welcome Drink", "Room Upgrade"],
      originalPrice: 450,
      dealPrice: 396,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold text-amber-900 tracking-tight">
            Ko Lake Villa
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/deals"
              className="text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors duration-200"
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
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/placeholder.svg?height=400&width=1200&text=Special+Deals"
            alt="Ko Lake Villa Special Deals"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 tracking-tight">Special Deals</h1>
          <p className="text-xl lg:text-2xl font-light tracking-wide">
            Exclusive offers for your perfect lakefront getaway
          </p>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Current Offers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take advantage of these limited-time offers and save on your stay at Ko Lake Villa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white">
                    {deal.discount}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{deal.title}</CardTitle>
                  <CardDescription className="text-gray-600">{deal.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-orange-500">${deal.dealPrice}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${deal.originalPrice}</span>
                      </div>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>

                    <div className="text-sm text-orange-600 font-medium">{deal.validUntil}</div>

                    <ul className="space-y-1">
                      {deal.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white" asChild>
                      <Link href="/contact">Book This Deal</Link>
                    </Button>
                  </div>
                </CardContent>
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
