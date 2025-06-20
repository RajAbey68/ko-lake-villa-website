"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Clock, Users, Utensils, Coffee, Wine, Leaf, Star } from "lucide-react"
import Image from "next/image"

export default function DiningPage() {
  const diningOptions = [
    {
      id: 1,
      name: "Private Chef Service",
      description: "Enjoy authentic Sri Lankan cuisine prepared by our experienced local chef",
      price: "From $45 per person",
      duration: "2-3 hours",
      capacity: "Up to 18 guests",
      features: [
        "Traditional Sri Lankan dishes",
        "Fresh local ingredients",
        "Customizable menu",
        "Dietary accommodations",
      ],
      image: "/placeholder.svg?height=300&width=400&text=Private Chef Service",
    },
    {
      id: 2,
      name: "BBQ by the Lake",
      description: "Sunset barbecue experience with stunning lake views",
      price: "From $35 per person",
      duration: "3-4 hours",
      capacity: "Up to 15 guests",
      features: ["Fresh seafood & meats", "Lakeside setting", "Sunset timing", "Drinks included"],
      image: "/placeholder.svg?height=300&width=400&text=BBQ by the Lake",
    },
    {
      id: 3,
      name: "Traditional Rice & Curry",
      description: "Authentic Sri Lankan rice and curry feast",
      price: "From $25 per person",
      duration: "1-2 hours",
      capacity: "Up to 18 guests",
      features: ["Multiple curry varieties", "Fresh coconut sambol", "Traditional preparation", "Vegetarian options"],
      image: "/placeholder.svg?height=300&width=400&text=Rice and Curry",
    },
  ]

  const beverageOptions = [
    {
      name: "Fresh King Coconut",
      description: "Straight from the tree",
      price: "$3",
    },
    {
      name: "Ceylon Tea Selection",
      description: "Premium local teas",
      price: "$5",
    },
    {
      name: "Fresh Fruit Juices",
      description: "Tropical fruit selection",
      price: "$4",
    },
    {
      name: "Local Beer & Wine",
      description: "Curated selection",
      price: "From $6",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dining at Ko Lake Villa</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Savor authentic Sri Lankan flavors and international cuisine in the comfort of your lakeside retreat
          </p>
        </div>

        {/* Featured Dining Experience */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Lakeside Dining Experience"
                  alt="Lakeside dining at Ko Lake Villa"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-amber-600 text-white">
                  <Star className="w-4 h-4 mr-1" />
                  Signature Experience
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Lakeside Fine Dining</h2>
                <p className="text-gray-600 mb-6">
                  Experience our premium dining service with a carefully curated menu featuring the best of Sri Lankan
                  and international cuisine, served with breathtaking views of Koggala Lake.
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Up to 18 guests
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    3-4 hours
                  </div>
                  <div className="flex items-center">
                    <ChefHat className="w-4 h-4 mr-1" />
                    Professional chef
                  </div>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700 w-fit">Request Custom Menu</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Dining Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Dining Experiences</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diningOptions.map((option) => (
              <Card key={option.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video">
                  <Image
                    src={option.image || "/placeholder.svg"}
                    alt={option.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{option.name}</CardTitle>
                  <p className="text-gray-600">{option.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-amber-600">{option.price}</div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {option.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {option.capacity}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Includes:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-amber-600 hover:bg-amber-700">Book This Experience</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Beverages Section */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Coffee className="w-6 h-6 mr-2 text-amber-600" />
                Beverages & Refreshments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {beverageOptions.map((beverage, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2">{beverage.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{beverage.description}</p>
                    <div className="text-lg font-bold text-amber-600">{beverage.price}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Special Dietary Requirements */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Leaf className="w-6 h-6 mr-2 text-green-600" />
                Special Dietary Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Vegetarian & Vegan</h3>
                  <p className="text-gray-600 text-sm">
                    Extensive plant-based options using fresh local vegetables and fruits
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Gluten-Free</h3>
                  <p className="text-gray-600 text-sm">Carefully prepared meals accommodating gluten sensitivities</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wine className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Custom Requests</h3>
                  <p className="text-gray-600 text-sm">Let us know your specific dietary needs and we'll accommodate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Information */}
        <div className="text-center">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Book Your Dining Experience?</h2>
              <p className="text-gray-600 mb-6">
                All dining experiences require advance booking. Contact us to discuss your preferences and dietary
                requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Book Dining Experience
                </Button>
                <Button variant="outline" className="bg-white text-amber-600 border-amber-600 hover:bg-amber-50">
                  View Sample Menus
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
