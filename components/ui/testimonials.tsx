import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah & Michael Chen",
    location: "Singapore",
    rating: 5,
    text: "Ko Lake Villa exceeded every expectation. The perfect blend of luxury and tranquility with breathtaking lake views. Our family vacation was unforgettable.",
    image: "/placeholder.svg?height=60&width=60&text=SC"
  },
  {
    name: "James Wilson",
    location: "Australia", 
    rating: 5,
    text: "Absolutely stunning property. The private pool, exceptional service, and proximity to beautiful beaches made this the best accommodation of our Sri Lanka trip.",
    image: "/placeholder.svg?height=60&width=60&text=JW"
  },
  {
    name: "Priya & Raj Patel",
    location: "London",
    rating: 5,
    text: "Perfect for our wellness retreat. The peaceful lake setting and spacious villa provided the ideal environment for relaxation and rejuvenation.",
    image: "/placeholder.svg?height=60&width=60&text=PP"
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Guests Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the luxury and tranquility that has earned us outstanding reviews from guests worldwide.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 