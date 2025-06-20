"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Mail, HelpCircle } from "lucide-react"

export default function FAQPage() {
  const faqCategories = [
    {
      category: "Booking & Reservations",
      questions: [
        {
          question: "How do I make a reservation?",
          answer:
            "You can book directly through our website, call us at +94 123 456 789, or send us a WhatsApp message. We'll confirm availability and send you booking details within 24 hours.",
        },
        {
          question: "What's included in the booking price?",
          answer:
            "All bookings include access to the pool, gardens, WiFi, parking, and basic amenities. Meals, experiences, and additional services can be arranged separately.",
        },
        {
          question: "What's your cancellation policy?",
          answer:
            "We offer flexible cancellation up to 48 hours before check-in for a full refund. Cancellations within 48 hours are subject to a 50% charge. No-shows are charged the full amount.",
        },
        {
          question: "Do you require a deposit?",
          answer:
            "Yes, we require a 30% deposit to secure your booking. The remaining balance can be paid upon arrival or in advance via bank transfer.",
        },
        {
          question: "Can I modify my booking dates?",
          answer:
            "Yes, you can modify your booking dates subject to availability. Please contact us at least 72 hours before your original check-in date.",
        },
      ],
    },
    {
      category: "Accommodation & Amenities",
      questions: [
        {
          question: "What room types are available?",
          answer:
            "We offer the Entire Villa (up to 18 guests), Master Family Suite (6+ guests), Triple/Twin Rooms (3+ guests), and Group Rooms (6+ guests). Each option provides different levels of privacy and space.",
        },
        {
          question: "Is WiFi available throughout the property?",
          answer: "Yes, complimentary high-speed WiFi is available throughout the villa and outdoor areas.",
        },
        {
          question: "Do you provide towels and linens?",
          answer:
            "Yes, all rooms come with fresh towels, bed linens, and basic toiletries. Pool towels are also provided.",
        },
        {
          question: "Is the pool heated?",
          answer:
            "Our pool is not heated, but Sri Lanka's tropical climate keeps the water at a comfortable temperature year-round.",
        },
        {
          question: "Do you have air conditioning?",
          answer:
            "Yes, all bedrooms have air conditioning. Common areas have ceiling fans and natural ventilation for comfort.",
        },
      ],
    },
    {
      category: "Location & Transportation",
      questions: [
        {
          question: "How far is Ko Lake Villa from the airport?",
          answer:
            "We're approximately 2.5 hours drive from Colombo International Airport. We can arrange airport transfers for your convenience.",
        },
        {
          question: "What's nearby the villa?",
          answer:
            "We're 5 minutes from beautiful beaches, 15 minutes from Galle Fort, and close to restaurants, shops, and local attractions. Koggala Lake is right at our doorstep.",
        },
        {
          question: "Do you arrange transportation?",
          answer:
            "Yes, we can arrange airport transfers, local transportation, and day trip vehicles. Our team can help coordinate all your transportation needs.",
        },
        {
          question: "Is parking available?",
          answer: "Yes, we provide complimentary secure parking for all guests.",
        },
      ],
    },
    {
      category: "Dining & Services",
      questions: [
        {
          question: "Do you provide meals?",
          answer:
            "We offer various dining options including private chef service, BBQ experiences, and traditional Sri Lankan meals. All dining experiences require advance booking.",
        },
        {
          question: "Can you accommodate dietary restrictions?",
          answer:
            "We can accommodate vegetarian, vegan, gluten-free, and other dietary requirements. Please inform us when booking.",
        },
        {
          question: "Is there a kitchen for guest use?",
          answer:
            "Yes, our villa has a fully equipped kitchen that guests can use. We can also arrange grocery shopping services.",
        },
        {
          question: "Do you offer laundry services?",
          answer:
            "Yes, laundry services are available for an additional charge. Same-day service is available for most items.",
        },
      ],
    },
    {
      category: "Activities & Experiences",
      questions: [
        {
          question: "What activities can you arrange?",
          answer:
            "We can arrange lake safaris, whale watching, Galle Fort tours, stilt fishing experiences, rainforest treks, and many other activities. Most require 24-hour advance booking.",
        },
        {
          question: "Are activities suitable for children?",
          answer:
            "Many of our activities are family-friendly. We can recommend age-appropriate experiences and arrange special accommodations for families with children.",
        },
        {
          question: "What if weather affects planned activities?",
          answer:
            "We monitor weather conditions closely and will suggest alternative activities or reschedule when necessary. Safety is our top priority.",
        },
      ],
    },
    {
      category: "Policies & Guidelines",
      questions: [
        {
          question: "What are your check-in and check-out times?",
          answer:
            "Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability.",
        },
        {
          question: "Do you allow pets?",
          answer:
            "We welcome well-behaved pets with prior approval. Additional cleaning fees may apply. Please contact us to discuss your pet's needs.",
        },
        {
          question: "Is smoking allowed?",
          answer: "Smoking is not permitted inside the villa. Designated outdoor smoking areas are available.",
        },
        {
          question: "What's your policy on events and parties?",
          answer:
            "We welcome celebrations and events! Please discuss your plans with us in advance so we can ensure everything runs smoothly and neighbors are respected.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about Ko Lake Villa</p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-xl text-amber-600">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, questionIndex) => (
                    <AccordionItem key={questionIndex} value={`${categoryIndex}-${questionIndex}`}>
                      <AccordionTrigger className="text-left hover:text-amber-600">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                <HelpCircle className="w-6 h-6 mr-2 text-amber-600" />
                Still Have Questions?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-6">
                Can't find what you're looking for? Our team is here to help!
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </Button>
                <Button variant="outline" className="bg-white text-amber-600 border-amber-600 hover:bg-amber-50">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us
                </Button>
                <Button variant="outline" className="bg-white text-amber-600 border-amber-600 hover:bg-amber-50">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <div className="mt-12">
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Quick Tips for Your Stay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-700">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                    Book experiences in advance for better availability
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                    Bring sunscreen and insect repellent
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                    Pack light, comfortable clothing
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                    Inform us of dietary requirements early
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                    Download offline maps for local exploration
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2" />
                    Keep our contact details handy
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
