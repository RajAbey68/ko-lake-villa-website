"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Users, Star, Mountain, TreePine, Utensils, Calendar, Phone } from "lucide-react"
import Link from "next/link"

interface Excursion {
  id: string
  title: string
  description: string
  duration: string
  price: number
  maxGuests: number
  difficulty: "Easy" | "Moderate" | "Challenging"
  category: "Cultural" | "Adventure" | "Nature" | "Culinary" | "Wellness"
  highlights: string[]
  included: string[]
  location: string
  rating: number
  reviews: number
  image: string
  tribe: string[]
}

export default function ExcursionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null)

  const excursions: Excursion[] = [
    {
      id: "1",
      title: "Lake Bridge Cultural Walk",
      description:
        "Explore the historic bridge and local village life. Meet friendly locals, learn about traditional fishing methods, and enjoy the serene lake environment captured in our hero image.",
      duration: "3 hours",
      price: 45,
      maxGuests: 8,
      difficulty: "Easy",
      category: "Cultural",
      highlights: [
        "Historic bridge exploration",
        "Traditional fishing demonstration",
        "Village life experience",
        "Local craft workshops",
      ],
      included: ["Local guide", "Refreshments", "Cultural demonstrations", "Photo opportunities"],
      location: "Ahangama Lake & Village",
      rating: 4.9,
      reviews: 23,
      image: "/images/excursions-hero.jpg",
      tribe: ["Cultural Travelers", "Family Groups", "Eco-Conscious Guests"],
    },
    {
      id: "2",
      title: "Sunrise Surf Lesson",
      description:
        "Catch your first wave or improve your skills with our expert local instructors. Perfect for all levels, just 300 yards from the villa.",
      duration: "2 hours",
      price: 65,
      maxGuests: 4,
      difficulty: "Moderate",
      category: "Adventure",
      highlights: [
        "Professional surf instruction",
        "All equipment provided",
        "Small group sizes",
        "Perfect beginner waves",
      ],
      included: ["Surfboard rental", "Wetsuit", "Professional instructor", "Safety briefing"],
      location: "Ahangama Beach",
      rating: 4.8,
      reviews: 41,
      image: "/placeholder.svg?height=300&width=400&text=Surf+Lesson",
      tribe: ["Surf Travelers", "Adventure Seekers", "Digital Nomads"],
    },
    {
      id: "3",
      title: "Mangrove Kayaking Adventure",
      description:
        "Paddle through pristine mangrove channels, spot exotic birds and wildlife in their natural habitat. A peaceful eco-adventure.",
      duration: "4 hours",
      price: 75,
      maxGuests: 6,
      difficulty: "Easy",
      category: "Nature",
      highlights: [
        "Mangrove ecosystem exploration",
        "Bird watching opportunities",
        "Wildlife photography",
        "Peaceful waterways",
      ],
      included: ["Kayak & equipment", "Life jackets", "Waterproof bags", "Nature guide"],
      location: "Weligama Mangroves",
      rating: 4.7,
      reviews: 18,
      image: "/placeholder.svg?height=300&width=400&text=Mangrove+Kayaking",
      tribe: ["Eco-Conscious Guests", "Nature Lovers", "Wellness Seekers"],
    },
    {
      id: "4",
      title: "Traditional Cooking Class",
      description:
        "Learn to prepare authentic Sri Lankan dishes with our local chef. Shop for spices at the market and cook a feast to remember.",
      duration: "5 hours",
      price: 85,
      maxGuests: 8,
      difficulty: "Easy",
      category: "Culinary",
      highlights: ["Local market tour", "Spice garden visit", "Hands-on cooking", "Traditional recipes"],
      included: ["Market tour", "All ingredients", "Recipe cards", "Full meal"],
      location: "Local Village Kitchen",
      rating: 4.9,
      reviews: 35,
      image: "/placeholder.svg?height=300&width=400&text=Cooking+Class",
      tribe: ["Cultural Travelers", "Family Groups", "Culinary Enthusiasts"],
    },
    {
      id: "5",
      title: "Yala Safari Day Trip",
      description:
        "Full day safari to Yala National Park. Spot leopards, elephants, and exotic birds in Sri Lanka's most famous wildlife sanctuary.",
      duration: "10 hours",
      price: 150,
      maxGuests: 6,
      difficulty: "Easy",
      category: "Nature",
      highlights: [
        "Leopard spotting opportunities",
        "Elephant herds",
        "Exotic bird species",
        "Professional safari guide",
      ],
      included: ["Transport", "Park fees", "Lunch", "Professional guide", "Binoculars"],
      location: "Yala National Park",
      rating: 4.8,
      reviews: 29,
      image: "/placeholder.svg?height=300&width=400&text=Yala+Safari",
      tribe: ["Nature Lovers", "Eco-Conscious Guests", "Adventure Seekers"],
    },
    {
      id: "6",
      title: "Sunset Yoga & Meditation",
      description:
        "Find inner peace with our sunset yoga session on the villa's rooftop deck. Perfect for all levels with certified instructors.",
      duration: "1.5 hours",
      price: 35,
      maxGuests: 12,
      difficulty: "Easy",
      category: "Wellness",
      highlights: ["Rooftop yoga deck", "Sunset timing", "Meditation session", "All levels welcome"],
      included: ["Yoga mats", "Props", "Certified instructor", "Herbal tea"],
      location: "Ko Lake Villa Rooftop",
      rating: 4.9,
      reviews: 42,
      image: "/placeholder.svg?height=300&width=400&text=Sunset+Yoga",
      tribe: ["Wellness Seekers", "Yoga Enthusiasts", "Spiritual Travelers"],
    },
  ]

  const categories = ["Cultural", "Adventure", "Nature", "Culinary", "Wellness"]

  const filteredExcursions =
    selectedCategory === "all" ? excursions : excursions.filter((exc) => exc.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Challenging":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cultural":
        return TreePine
      case "Adventure":
        return Mountain
      case "Nature":
        return TreePine
      case "Culinary":
        return Utensils
      case "Wellness":
        return Star
      default:
        return MapPin
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-4rem)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/excursions-hero.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">Local Excursions</h1>
            <p className="text-xl md:text-2xl mb-4 text-white/95 drop-shadow-md">
              Relax, Revive, Connect with Sri Lankan Culture
            </p>
            <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow-sm max-w-2xl mx-auto">
              Discover authentic experiences, from historic lake bridges to pristine beaches, all curated for our Ko
              Lake Villa guests
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-amber-800"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View All Experiences
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg" asChild>
                <Link href="/contact">Book Your Adventure</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Excursions Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-800 mb-6">Choose Your Adventure</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-amber-600 hover:bg-amber-700" : ""}
              >
                All Experiences
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredExcursions.length} experiences available
            </Badge>
          </div>

          {/* Excursions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExcursions.map((excursion) => {
              const CategoryIcon = getCategoryIcon(excursion.category)

              return (
                <Card
                  key={excursion.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={excursion.image || "/placeholder.svg"}
                      alt={excursion.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-gray-800">
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {excursion.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className={getDifficultyColor(excursion.difficulty)}>{excursion.difficulty}</Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-sm font-medium">{excursion.rating}</span>
                        <span className="text-white/80 text-sm">({excursion.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-amber-800">{excursion.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excursion.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {excursion.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        Max {excursion.maxGuests} guests
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {excursion.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-amber-600">
                        ${excursion.price}
                        <span className="text-sm font-normal text-gray-500">/person</span>
                      </div>
                      <Button
                        onClick={() => setSelectedExcursion(excursion)}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Excursion Detail Modal */}
      {selectedExcursion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-transparent"
                onClick={() => setSelectedExcursion(null)}
              >
                ✕
              </Button>
              <div className="flex items-start gap-4">
                <img
                  src={selectedExcursion.image || "/placeholder.svg"}
                  alt={selectedExcursion.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <CardTitle className="text-2xl text-amber-800 mb-2">{selectedExcursion.title}</CardTitle>
                  <div className="flex gap-2 mb-3">
                    <Badge className="bg-amber-100 text-amber-800">{selectedExcursion.category}</Badge>
                    <Badge className={getDifficultyColor(selectedExcursion.difficulty)}>
                      {selectedExcursion.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedExcursion.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Max {selectedExcursion.maxGuests}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {selectedExcursion.rating} ({selectedExcursion.reviews} reviews)
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-gray-700 leading-relaxed">{selectedExcursion.description}</p>

              <Tabs defaultValue="highlights" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="highlights">Highlights</TabsTrigger>
                  <TabsTrigger value="included">What's Included</TabsTrigger>
                  <TabsTrigger value="tribes">Perfect For</TabsTrigger>
                </TabsList>

                <TabsContent value="highlights" className="space-y-3">
                  <ul className="space-y-2">
                    {selectedExcursion.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="included" className="space-y-3">
                  <ul className="space-y-2">
                    {selectedExcursion.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="tribes" className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedExcursion.tribe.map((tribe, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tribe}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-amber-600">
                      ${selectedExcursion.price}
                      <span className="text-lg font-normal text-gray-500">/person</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {selectedExcursion.location}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Check Availability
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                      <Link href="/contact">Book Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-amber-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Sri Lankan Adventure?</h2>
          <p className="text-xl text-amber-200 mb-8">
            Let us help you create unforgettable memories. Our local team knows the best experiences for every type of
            traveler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-amber-800"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Us: +94711730345
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Calendar className="w-4 h-4 mr-2" />
              Plan My Excursions
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
