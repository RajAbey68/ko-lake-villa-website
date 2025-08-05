"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react"
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
  { code: "+86", country: "China", flag: "��🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
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
      const fullPhone = formData.phone ? `${formData.countryCode} ${formData.phone}` : ""
      const submissionData = {
        ...formData,
        fullPhone,
        submittedAt: new Date().toISOString()
      }
      
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
                      <h3 className="font-semibold text-gray-900">Location & Travel Times</h3>
                      <p className="text-gray-600 font-medium">Kathaluwa West, Koggala Lake</p>
                      <p className="text-gray-600">Galle District, Sri Lanka</p>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500">
                        <div>🛬 Colombo Airport: 2.5hrs</div>
                        <div>🏛️ Colombo City: 2hrs</div>
                        <div>🏰 Galle: 30min</div>
                        <div>🏖️ Ahangama: 15min</div>
                        <div>🦁 Yala National Park: 2.5hrs</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
