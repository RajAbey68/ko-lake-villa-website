"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, MessageCircle, Clock, Star } from "lucide-react"
import Link from "next/link"

// Common country codes for international guests
const countryCodes = [
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+94",
    phone: "",
    subject: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (formData.phone && !/^\d{7,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid phone number (7-15 digits)"
    }
    
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required"
    }
    
    if (!formData.message.trim()) {
      errors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters"
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setIsSubmitting(true)
    setFormErrors({})

    try {
      // Simulate form submission with actual contact API call
      const fullPhone = formData.phone ? `${formData.countryCode} ${formData.phone}` : ""
      const submissionData = {
        ...formData,
        fullPhone,
        submittedAt: new Date().toISOString()
      }
      
      // Here you would normally send to your contact API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setIsSubmitting(false)
      setSubmitted(true)
    } catch (error) {
      setIsSubmitting(false)
      setFormErrors({ submit: "Failed to send message. Please try again." })
    }
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
                      <Button onClick={() => {
                        setSubmitted(false)
                        setFormData({
                          name: "",
                          email: "",
                          countryCode: "+94",
                          phone: "",
                          subject: "",
                          message: "",
                        })
                      }}>Send Another Message</Button>
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
                            placeholder="Your full name"
                            className={formErrors.name ? "border-red-500" : ""}
                          />
                          {formErrors.name && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="your@email.com"
                            className={formErrors.email ? "border-red-500" : ""}
                          />
                          {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex gap-2">
                          <Select 
                            value={formData.countryCode} 
                            onValueChange={(value) => handleInputChange("countryCode", value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  <div className="flex items-center gap-2">
                                    <span>{country.flag}</span>
                                    <span>{country.code}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="71 123 4567"
                            className={`flex-1 ${formErrors.phone ? "border-red-500" : ""}`}
                          />
                        </div>
                        {formErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          Selected: {formData.countryCode} {formData.phone && formData.phone}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          placeholder="What can we help you with?"
                          className={formErrors.subject ? "border-red-500" : ""}
                        />
                        {formErrors.subject && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          className={formErrors.message ? "border-red-500" : ""}
                        />
                        {formErrors.message && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                        )}
                      </div>

                      {formErrors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                          <p className="text-red-600 text-sm">{formErrors.submit}</p>
                        </div>
                      )}

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
                  {/* General Manager Contact */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">General Manager</h3>
                      <p className="text-gray-600">+94 71 776 5780</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-green-600 hover:bg-green-700"
                        onClick={() => window.open("https://wa.me/94717765780", "_blank")}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Villa Team Lead Contact */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Villa Team Lead</h3>
                      <p className="text-gray-600">+94 77 315 0602</p>
                      <p className="text-sm text-gray-500">(Sinhala speaker)</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-green-600 hover:bg-green-700"
                        onClick={() => window.open("https://wa.me/94773150602", "_blank")}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Owner Contact */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Owner</h3>
                      <p className="text-gray-600">+94 711730345</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-green-600 hover:bg-green-700"
                        onClick={() => window.open("https://wa.me/94711730345", "_blank")}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Email Contact */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">contact@KoLakeHouse.com</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>

                  {/* Reception Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Reception Hours</h3>
                      <p className="text-gray-600">The Reception is open from 7am to 10:30pm</p>
                      <p className="text-sm text-gray-500">Daily service available</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Location & Access</h3>
                      <p className="text-gray-600 font-medium">Kathaluwa West, Koggala Lake</p>
                      <p className="text-gray-600">Galle District, Sri Lanka</p>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500">
                        <div>🛬 Colombo Airport: 2.5hrs</div>
                        <div>🏛️ Colombo City: 2hrs</div>
                        <div>🏰 Galle: 30min</div>
                        <div>🏖️ Ahangama: 15min</div>
                        <div>🦁 Yala National Park: 2.5hrs</div>
                        <div>📍 GPS: 5.968°N, 80.327°E</div>
                      </div>
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
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                  <div>🛬 Colombo Airport: 2.5hrs</div>
                  <div>🏛️ Colombo City: 2hrs</div>
                  <div>🏰 Galle: 30min</div>
                  <div>🏖️ Ahangama: 15min</div>
                  <div>🦁 Yala National Park: 2.5hrs</div>
                  <div>📍 GPS: Available</div>
                </div>
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
