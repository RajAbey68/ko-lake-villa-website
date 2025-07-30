"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Utensils, 
  Coffee, 
  Wine,
  ChefHat,
  Star,
  Users
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import GlobalHeader from "@/components/navigation/global-header"

const menuItems = [
  {
    id: 1,
    name: "Traditional Sri Lankan Curry",
    description: "Authentic coconut curry with fresh local fish, served with aromatic basmati rice and accompaniments",
    price: "Rs. 2,500",
    category: "Main Course",
    spiceLevel: "Medium",
    image: "/images/dining/curry.jpg",
    dietary: ["Gluten-Free", "Dairy-Free"]
  },
  {
    id: 2,
    name: "Koggala Lake Fish Grill",
    description: "Fresh catch from Koggala Lake, grilled with local herbs and served with seasonal vegetables",
    price: "Rs. 3,200",
    category: "Seafood",
    spiceLevel: "Mild",
    image: "/images/dining/fish-grill.jpg",
    dietary: ["Gluten-Free", "Dairy-Free", "Keto-Friendly"]
  },
  // Add more menu items...
]

const diningExperiences = [
  {
    id: 1,
    name: "Lakeside Dinner",
    description: "Romantic dinner by Koggala Lake with traditional Sri Lankan cuisine",
    duration: "2-3 hours",
    priceRange: "Rs. 4,500 - 6,000 per person",
    image: "/images/dining/lakeside-dinner.jpg",
    includes: ["3-course meal", "Traditional music", "Lake view seating"]
  },
  {
    id: 2,
    name: "Cooking Class Experience",
    description: "Learn to cook authentic Sri Lankan dishes with our chef",
    duration: "3-4 hours",
    priceRange: "Rs. 3,500 per person",
    image: "/images/dining/cooking-class.jpg",
    includes: ["Hands-on cooking", "Recipe cards", "Full meal", "Take-home spices"]
  },
]

export default function DiningPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeExperience, setActiveExperience] = useState<number | null>(null)

  const categories = ["All", "Main Course", "Seafood", "Vegetarian", "Desserts", "Beverages"]

  const filteredMenuItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <GlobalHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
            Authentic Sri Lankan Dining
          </h1>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto mb-8">
            Savor the rich flavors of traditional Sri Lankan cuisine, prepared with fresh local ingredients 
            and served with stunning views of Koggala Lake.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-4 py-2">
              <Utensils className="w-4 h-4 mr-2" />
              Farm-to-Table Fresh
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-4 py-2">
              <ChefHat className="w-4 h-4 mr-2" />
              Traditional Recipes
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              Lakeside Views
            </Badge>
          </div>
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
            {diningExperiences.map((experience) => (
              <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={experience.image || "/placeholder.svg"}
                  alt={experience.name}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />

                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{experience.name}</CardTitle>
                  <p className="text-gray-600">{experience.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-orange-600">Duration: {experience.duration}</div>
                    <div className="text-sm font-medium text-orange-600">Price Range: {experience.priceRange}</div>

                    <div className="grid grid-cols-1 gap-1">
                      {experience.includes.map((include, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                          {include}
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
              {menuItems.map((item, index) => (
                <div key={item.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-medium text-gray-900">{item.name}</h5>
                    <span className="font-semibold text-orange-500">{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
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
