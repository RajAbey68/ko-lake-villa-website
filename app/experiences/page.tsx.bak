import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ExperiencesPage() {
  const experiences = [
    {
      id: 1,
      name: "Lake Boat Safari",
      duration: "2-3 hours",
      price: "$45",
      difficulty: "Easy",
      image: "/placeholder.svg?height=300&width=500&text=Boat+Safari",
      description:
        "Explore the pristine waters of Koggala Lake, spot exotic birds, and visit the famous cinnamon island.",
      highlights: ["Bird Watching", "Cinnamon Island", "Mangrove Exploration", "Local Wildlife", "Sunset Views"],
    },
    {
      id: 2,
      name: "Stilt Fishing Experience",
      duration: "1-2 hours",
      price: "$25",
      difficulty: "Easy",
      image: "/placeholder.svg?height=300&width=500&text=Stilt+Fishing",
      description:
        "Learn the traditional art of stilt fishing, a unique Sri Lankan fishing method practiced for generations.",
      highlights: [
        "Traditional Technique",
        "Cultural Heritage",
        "Photo Opportunities",
        "Local Fishermen",
        "Authentic Experience",
      ],
    },
    {
      id: 3,
      name: "Galle Fort Tour",
      duration: "Half Day",
      price: "$60",
      difficulty: "Easy",
      image: "/placeholder.svg?height=300&width=500&text=Galle+Fort",
      description:
        "Discover the UNESCO World Heritage site of Galle Fort with its colonial architecture and rich history.",
      highlights: ["UNESCO Site", "Colonial Architecture", "Historical Sites", "Local Markets", "Ocean Views"],
    },
    {
      id: 4,
      name: "Whale Watching",
      duration: "Full Day",
      price: "$85",
      difficulty: "Moderate",
      image: "/placeholder.svg?height=300&width=500&text=Whale+Watching",
      description:
        "Embark on an unforgettable whale watching adventure from Mirissa, one of the world's best whale watching destinations.",
      highlights: ["Blue Whales", "Sperm Whales", "Dolphins", "Ocean Adventure", "Professional Guide"],
    },
    {
      id: 5,
      name: "Cooking Class",
      duration: "3-4 hours",
      price: "$40",
      difficulty: "Easy",
      image: "/placeholder.svg?height=300&width=500&text=Cooking+Class",
      description:
        "Learn to prepare authentic Sri Lankan dishes using fresh local ingredients and traditional cooking methods.",
      highlights: [
        "Local Ingredients",
        "Traditional Recipes",
        "Hands-on Learning",
        "Cultural Experience",
        "Take Recipes Home",
      ],
    },
    {
      id: 6,
      name: "Temple & Cultural Tour",
      duration: "Half Day",
      price: "$50",
      difficulty: "Easy",
      image: "/placeholder.svg?height=300&width=500&text=Temple+Tour",
      description:
        "Visit ancient Buddhist temples and learn about Sri Lankan culture, traditions, and spiritual practices.",
      highlights: [
        "Ancient Temples",
        "Buddhist Culture",
        "Local Traditions",
        "Spiritual Experience",
        "Historical Insights",
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
              className="text-gray-700 font-medium text-sm hover:text-orange-500 transition-colors duration-200"
            >
              Dining
            </Link>
            <Link
              href="/experiences"
              className="text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors duration-200"
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
            src="/placeholder.svg?height=400&width=1200&text=Experiences"
            alt="Ko Lake Villa Experiences"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 tracking-tight">Experiences</h1>
          <p className="text-xl lg:text-2xl font-light tracking-wide">
            Discover the beauty and culture of Sri Lanka's southern coast
          </p>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Unforgettable Adventures</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From lake safaris to cultural tours, create lasting memories with our curated experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={experience.image || "/placeholder.svg"}
                    alt={experience.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white">{experience.duration}</Badge>
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      {experience.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 hover:bg-green-700 text-white text-lg font-bold">
                      {experience.price}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{experience.name}</CardTitle>
                  <CardDescription className="text-gray-600">{experience.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Experience Highlights:</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {experience.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white">Book Experience</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Experiences</h3>
              <p className="text-gray-600 mb-6">
                Looking for something specific? We can arrange custom tours and experiences tailored to your interests
                and preferences.
              </p>
              <Button className="bg-orange-400 hover:bg-orange-500 text-white px-8">Plan Custom Experience</Button>
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
