"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, MessageCircle, Clock, Star } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-amber-800">
              Ko Lake Villa
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-amber-700 hover:text-orange-500">
                Home
              </Link>
              <Link href="/accommodation" className="text-amber-700 hover:text-orange-500">
                Accommodation
              </Link>
              <Link href="/dining" className="text-amber-700 hover:text-orange-500">
                Dining
              </Link>
              <Link href="/experiences" className="text-amber-700 hover:text-orange-500">
                Experiences
              </Link>
              <Link href="/gallery" className="text-amber-700 hover:text-orange-500">
                Gallery
              </Link>
              <Link href="/contact" className="text-orange-500 font-medium">
                Contact
              </Link>
            </div>
            <Button asChild>
              <Link href="/contact">Book Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-amber-900 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Get in touch with our friendly team. We're here to help you plan the perfect stay at Ko Lake Villa.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-green-600 mb-2">Message Sent!</h3>
                      <p className="text-gray-600 mb-4">Thank you for contacting us. We'll respond within 24 hours.</p>
                      <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+94711730345"
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          required
                          placeholder="What can we help you with?"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          required
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Sending Message..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">+94711730345</p>
                      <p className="text-sm text-gray-500">Available 8 AM - 10 PM daily</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                      <p className="text-gray-600">+94711730345</p>
                      <p className="text-sm text-gray-500">Quick responses, 24/7</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-green-600 hover:bg-green-700"
                        onClick={() => window.open("https://wa.me/94711730345", "_blank")}
                      >
                        Chat Now
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">contact@KoLakeHouse.com</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">Kathaluwa West</p>
                      <p className="text-gray-600">Koggala Lake, Galle District</p>
                      <p className="text-sm text-gray-500">2 hours from Colombo Airport</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in</span>
                      <span className="font-medium">2:00 PM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out</span>
                      <span className="font-medium">11:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reception</span>
                      <span className="font-medium">8:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">WhatsApp Support</span>
                      <span className="font-medium">24/7</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Early check-in or late check-out?</strong> Contact us to arrange special timing.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Snippet */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">What Our Guests Say</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">Sarah M.</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        "Absolutely stunning location with incredible lake views. The team was so responsive and
                        helpful!"
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">David L.</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        "Booking direct saved us money and the personal service was exceptional. Highly recommend!"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-xl text-gray-600">Located on the beautiful Koggala Lake in Sri Lanka's southern coast</p>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-lg h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.6662481293687!2d80.32421547535898!3d5.968364194074179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae173bb6932fccf%3A0x4a35b903f9c64c9e!2sKoggala%20Lake!5e0!3m2!1sen!2slk!4v1704747600000!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ko Lake Villa Location - Koggala Lake, Sri Lanka"
            ></iframe>
          </div>
          
          {/* Map Info & Directions */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Exact Location</h3>
                <p className="text-gray-600 text-sm">Kathaluwa West, Koggala Lake</p>
                <p className="text-gray-600 text-sm">Galle District, Sri Lanka</p>
                <p className="text-xs text-amber-600 font-mono">📍 wifely.rebuff.vented</p>
                <div className="space-y-2">
                  <Button 
                    className="mt-3 w-full" 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open("https://maps.google.com/maps?q=Koggala+Lake,+Sri+Lanka", "_blank")}
                  >
                    Google Maps
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open("https://what3words.com/wifely.rebuff.vented", "_blank")}
                  >
                    what3words
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Travel Time</h3>
                <p className="text-gray-600 text-sm">2 hours from Colombo Airport</p>
                <p className="text-gray-600 text-sm">30 minutes from Galle</p>
                <p className="text-gray-600 text-sm">15 minutes from Ahangama</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 text-sm">Call us for directions</p>
                <p className="text-gray-600 text-sm">WhatsApp location sharing</p>
                <Button 
                  className="mt-3 bg-green-600 hover:bg-green-700" 
                  size="sm"
                  onClick={() => window.open("https://wa.me/94711730345?text=Hi! Can you help me with directions to Ko Lake Villa?", "_blank")}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-xl mb-8">
            Don't wait - secure your dates at Ko Lake Villa today and save with our direct booking rates.
          </p>
          <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50" asChild>
            <Link href="/contact">Book Your Stay</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
