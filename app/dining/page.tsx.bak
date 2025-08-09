import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DiningPage() {
  const diningOptions = [
    {
      id: 1,
      name: "Lakeside Dining Area",
      description: "Enjoy meals with panoramic views of Koggala Lake in our open-air dining pavilion",
      image: "/placeholder.svg?height=300&width=500&text=Lakeside+Dining",
      features: ["Lake Views", "Open Air", "Breakfast Included", "Local Cuisine", "Fresh Seafood"],
      hours: "7:00 AM - 10:00 PM",
    },
    {
      id: 2,
      name: "Private Villa Kitchen",
      description: "Fully equipped kitchen for guests who prefer to prepare their own meals",
      image: "/placeholder.svg?height=300&width=500&text=Villa+Kitchen",
      features: ["Full Kitchen", "Modern Appliances", "Dining Table", "Cookware Provided", "Refrigerator"],
      hours: "24/7 Access",
    },
    {
      id: 3,
      name: "BBQ & Grill Area",
      description: "Perfect for evening gatherings with friends and family by the pool",
      image: "/placeholder.svg?height=300&width=500&text=BBQ+Area",
      features: ["Outdoor Grill", "Pool Side", "Evening Ambiance", "Group Dining", "Fresh Ingredients"],
      hours: "5:00 PM - 11:00 PM",
    },
  ]

  const menuHighlights = [
    {
      category: "Sri Lankan Specialties",
      items: [
        { name: "Rice & Curry", description: "Traditional Sri Lankan rice with assorted curries", price: "$12" },
        { name: "Kottu Roti", description: "Chopped roti with vegetables and your choice of meat", price: "$10" },
        { name: "Fish Ambul Thiyal", description: "Sour fish curry, a southern Sri Lankan delicacy", price: "$15" },
      ],
    },
    {
      category: "Fresh Seafood",
      items: [
        { name: "Grilled Fish", description: "Fresh catch from Koggala Lake, grilled to perfection", price: "$18" },
        { name: "Prawn Curry", description: "Coconut-based curry with fresh prawns", price: "$20" },
        { name: "Crab Curry", description: "Spicy crab curry with traditional spices", price: "$25" },
      ],
    },
    {
      category: "International Cuisine",
      items: [
        { name: "Pasta Primavera", description: "Fresh vegetables with pasta in cream sauce", price: "$14" },
        { name: "Grilled Chicken", description: "Herb-marinated chicken with seasonal vegetables", price: "$16" },
        { name: "Vegetarian Platter", description: "Assorted vegetarian dishes with rice", price: "$12" },
      ],
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
              className="text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors duration-200"
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
            src="/placeholder.svg?height=400&width=1200&text=Dining+Experience"
            alt="Ko Lake Villa Dining"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 tracking-tight">Dining</h1>
          <p className="text-xl lg:text-2xl font-light tracking-wide">
            Savor authentic Sri Lankan flavors with stunning lake views
          </p>
        </div>
      </section>

      {/* Dining Options */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Dining Experiences</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From lakeside dining to private kitchen facilities, enjoy delicious meals in beautiful settings
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {diningOptions.map((option) => (
              <Card key={option.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={option.image || "/placeholder.svg"}
                  alt={option.name}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />

                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{option.name}</CardTitle>
                  <CardDescription className="text-gray-600">{option.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-orange-600">Hours: {option.hours}</div>

                    <div className="grid grid-cols-1 gap-1">
                      {option.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Menu Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Menu Highlights</h3>

            <div className="grid md:grid-cols-3 gap-8">
              {menuHighlights.map((category, index) => (
                <div key={index}>
                  <h4 className="text-lg font-semibold text-orange-600 mb-4 border-b border-orange-100 pb-2">
                    {category.category}
                  </h4>

                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <span className="font-semibold text-orange-500">{item.price}</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button className="bg-orange-400 hover:bg-orange-500 text-white px-8">Request Full Menu</Button>
            </div>
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
