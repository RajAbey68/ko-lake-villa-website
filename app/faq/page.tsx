"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import GlobalHeader from "@/components/navigation/global-header"

export default function FAQPage() {
  const faqCategories = [
    {
      category: "Booking & Reservations",
      questions: [
        {
          question: "How do I make a reservation?",
          answer:
            "You can make a reservation by clicking the 'Book Now' button on any page, calling us directly, or sending a WhatsApp message. We'll confirm availability and send you booking details within 24 hours.",
        },
        {
          question: "What is your cancellation policy?",
          answer:
            "Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a 50% charge. No-shows will be charged the full amount.",
        },
        {
          question: "Do you offer direct booking discounts?",
          answer:
            "Yes! Book directly with us and save 10-15% compared to third-party booking sites. You'll also get complimentary breakfast and room upgrades when available.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, bank transfers, and cash payments. A 50% deposit is required to secure your booking, with the balance due upon arrival.",
        },
      ],
    },
    {
      category: "Accommodation",
      questions: [
        {
          question: "What types of rooms do you offer?",
          answer:
            "We offer the entire villa (up to 18 guests), Master Family Suite (6+ guests), Triple/Twin rooms (3+ guests), and Group rooms (6+ guests). All rooms feature lake views and modern amenities.",
        },
        {
          question: "Are meals included in the stay?",
          answer:
            "Breakfast is included with direct bookings. We also offer lunch and dinner options featuring authentic Sri Lankan cuisine and fresh seafood from the lake.",
        },
        {
          question: "Do you provide airport transfers?",
          answer:
            "Yes, we can arrange airport transfers from Colombo (3 hours) or Mattala (1.5 hours) airports. Please request this service when making your booking.",
        },
        {
          question: "Is WiFi available throughout the property?",
          answer:
            "Yes, complimentary high-speed WiFi is available throughout the villa, including all rooms, common areas, and outdoor spaces.",
        },
      ],
    },
    {
      category: "Activities & Experiences",
      questions: [
        {
          question: "What activities are available at the lake?",
          answer:
            "We offer boat safaris, fishing experiences, bird watching, visits to cinnamon island, and traditional stilt fishing demonstrations. All activities can be arranged through our concierge.",
        },
        {
          question: "Can you arrange tours to nearby attractions?",
          answer:
            "We can arrange tours to Galle Fort (30 minutes), whale watching in Mirissa (45 minutes), temple visits, cooking classes, and cultural experiences.",
        },
        {
          question: "Is the lake safe for swimming?",
          answer:
            "While the lake is generally safe, we recommend enjoying water activities from our boats or the villa's private pool for the best experience.",
        },
        {
          question: "Do you provide equipment for water activities?",
          answer:
            "Yes, we provide life jackets, fishing equipment, and safety gear for all water-based activities. Professional guides accompany all lake excursions.",
        },
      ],
    },
    {
      category: "Facilities & Services",
      questions: [
        {
          question: "Do you have a swimming pool?",
          answer:
            "Yes, we have a beautiful infinity pool overlooking Koggala Lake, perfect for relaxation while enjoying the stunning views.",
        },
        {
          question: "Is parking available?",
          answer:
            "Yes, we provide free parking for all guests. The parking area is secure and can accommodate multiple vehicles.",
        },
        {
          question: "Do you allow pets?",
          answer:
            "We welcome well-behaved pets with prior arrangement. Please inform us during booking so we can prepare accordingly. Additional cleaning fees may apply.",
        },
        {
          question: "Is the property suitable for events?",
          answer:
            "Yes, Ko Lake Villa is perfect for small weddings, family gatherings, and corporate retreats. We can arrange catering, decorations, and entertainment.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/placeholder.svg?height=400&width=1200&text=FAQ"
            alt="Ko Lake Villa FAQ"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 tracking-tight">FAQ</h1>
          <p className="text-xl lg:text-2xl font-light tracking-wide">
            Find answers to commonly asked questions about your stay
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Ko Lake Villa and your stay with us
            </p>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-orange-600 mb-4 border-b border-orange-100 pb-2">
                  {category.category}
                </h3>

                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-orange-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12 bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our friendly team is here to help you plan the perfect stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-orange-400 hover:bg-orange-500 text-white px-8">Contact Us</Button>
              </Link>
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8">
                WhatsApp Us
              </Button>
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
