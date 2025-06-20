"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Waves,
  Compass,
  TreePine,
  Sunrise,
  Car,
  MapPin,
  Clock,
  Users,
  Star,
  TelescopeIcon as Binoculars,
} from "lucide-react"
import Image from "next/image"

export default function ExperiencesPage() {
  const experiences = [
    {
      id: 1,
      name: "Koggala Lake Safari",
      description: "Explore the pristine waters and mangrove islands of Koggala Lake",
      duration: "2-3 hours",
      price: "From $25 per person",
      capacity: "Up to 8 guests per boat",
      highlights: ["Cinnamon Island visit", "Bird watching", "Traditional fishing", "Sunset views"],
      image: "/placeholder.svg?height=300&width=400&text=Lake Safari",
      category: "Water Activities",
      featured: true,
    },
    {
      id: 2,
      name: "Galle Fort Heritage Tour",
      description: "Discover the UNESCO World Heritage site of Galle Fort",
      duration: "4-5 hours",
      price: "From $35 per person",
      capacity: "Up to 15 guests",
      highlights: ["Dutch colonial architecture", "Lighthouse visit", "Local markets", "Historical sites"],
      image: "/placeholder.svg?height=300&width=400&text=Galle Fort",
      category: "Cultural",
      featured: false,
    },
    {
      id: 3,
      name: "Whale Watching Mirissa",
      description: "Witness majestic blue whales and dolphins in their natural habitat",
      duration: "6-7 hours",
      price: "From $45 per person",
      capacity: "Up to 12 guests",
      highlights: ["Blue whale sightings", "Dolphin encounters", "Professional guide", "Breakfast included"],
      image: "/placeholder.svg?height=300&width=400&text=Whale Watching",
      category: "Wildlife",
      featured: true,
    },
    {
      id: 4,
      name: "Stilt Fishing Experience",
      description: "Learn the traditional art of stilt fishing with local fishermen",
      duration: "2-3 hours",
      price: "From $20 per person",
      capacity: "Up to 6 guests",
      highlights: ["Traditional technique", "Local fishermen guides", "Photo opportunities", "Cultural insight"],
      image: "/placeholder.svg?height=300&width=400&text=Stilt Fishing",
      category: "Cultural",
      featured: false,
    },
    {
      id: 5,
      name: "Sinharaja Rainforest Trek",
      description: "Explore Sri Lanka's last remaining rainforest",
      duration: "Full day (8-10 hours)",
      price: "From $65 per person",
      capacity: "Up to 10 guests",
      highlights: ["Endemic species", "Guided nature walk", "Waterfall visits", "Packed lunch"],
      image: "/placeholder.svg?height=300&width=400&text=Rainforest Trek",
      category: "Nature",
      featured: false,
    },
    {
      id: 6,
      name: "Sunrise Yoga by the Lake",
      description: "Start your day with peaceful yoga overlooking Koggala Lake",
      duration: "1.5 hours",
      price: "From $15 per person",
      capacity: "Up to 12 guests",
      highlights: ["Professional instructor", "Lakeside setting", "All levels welcome", "Meditation included"],
      image: "/placeholder.svg?height=300&width=400&text=Sunrise Yoga",
      category: "Wellness",
      featured: false,
    },
  ]

  const categories = [
    { name: "Water Activities", icon: Waves, color: "bg-blue-100 text-blue-600" },
    { name: "Cultural", icon: Compass, color: "bg-purple-100 text-purple-600" },
    { name: "Wildlife", icon: Binoculars, color: "bg-green-100 text-green-600" },
    { name: "Nature", icon: TreePine, color: "bg-emerald-100 text-emerald-600" },
    { name: "Wellness", icon: Sunrise, color: "bg-orange-100 text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Experiences & Activities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the natural beauty and rich culture of Sri Lanka's southern coast with our curated experiences
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Badge key={category.name} variant="outline" className={`${category.color} border-0 px-4 py-2`}>
                <IconComponent className="w-4 h-4 mr-2" />
                {category.name}
              </Badge>
            )
          })}
        </div>

        {/* Featured Experiences */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Experiences</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {experiences
              .filter((exp) => exp.featured)
              .map((experience) => (
                <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video">
                    <Image
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-amber-600 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                      <Badge variant="outline">{experience.category}</Badge>
                    </div>
                    <CardTitle className="text-xl">{experience.name}</CardTitle>
                    <p className="text-gray-600">{experience.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {experience.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {experience.capacity}
                      </div>
                      <div className="text-lg font-bold text-amber-600">{experience.price}</div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Highlights:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {experience.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full bg-amber-600 hover:bg-amber-700">Book Experience</Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* All Experiences */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Experiences</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences
              .filter((exp) => !exp.featured)
              .map((experience) => (
                <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video">
                    <Image
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{experience.category}</Badge>
                      <div className="text-lg font-bold text-amber-600">{experience.price}</div>
                    </div>
                    <CardTitle className="text-lg">{experience.name}</CardTitle>
                    <p className="text-gray-600 text-sm">{experience.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {experience.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {experience.capacity.split(" ")[0]} {experience.capacity.split(" ")[1]}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-white text-amber-600 border-amber-600 hover:bg-amber-50"
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Transportation & Booking Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="w-5 h-5 mr-2 text-amber-600" />
                Transportation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We arrange comfortable transportation for all experiences. Pickup and drop-off at Ko Lake Villa
                included.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                  Air-conditioned vehicles
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                  Professional drivers
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                  Flexible scheduling
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Book your experiences in advance to secure your preferred dates and times.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                  24-hour advance booking required
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                  Weather-dependent activities
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                  Group discounts available
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
