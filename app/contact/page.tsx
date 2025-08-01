"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  Star, 
  Check, 
  ChevronsUpDown 
} from "lucide-react"
import Link from "next/link"
import GlobalHeader from "@/components/navigation/global-header"

interface ContactFormData {
  name: string
  email: string
  countryCode: string
  phone: string
  subject: string
  message: string
}

// Comprehensive country codes list
const countryCodesData = [
  { code: "+1", country: "United States", flag: "🇺🇸", searchTerms: "usa america united states" },
  { code: "+1", country: "Canada", flag: "🇨🇦", searchTerms: "canada" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", searchTerms: "uk britain england scotland wales" },
  { code: "+61", country: "Australia", flag: "🇦🇺", searchTerms: "australia aussie" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿", searchTerms: "new zealand nz" },
  { code: "+49", country: "Germany", flag: "🇩🇪", searchTerms: "germany deutschland" },
  { code: "+33", country: "France", flag: "🇫🇷", searchTerms: "france" },
  { code: "+39", country: "Italy", flag: "🇮🇹", searchTerms: "italy italia" },
  { code: "+34", country: "Spain", flag: "🇪🇸", searchTerms: "spain españa" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱", searchTerms: "netherlands holland" },
  { code: "+46", country: "Sweden", flag: "🇸🇪", searchTerms: "sweden sverige" },
  { code: "+47", country: "Norway", flag: "🇳🇴", searchTerms: "norway norge" },
  { code: "+45", country: "Denmark", flag: "🇩🇰", searchTerms: "denmark danmark" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭", searchTerms: "switzerland schweiz" },
  { code: "+43", country: "Austria", flag: "🇦🇹", searchTerms: "austria österreich" },
  { code: "+32", country: "Belgium", flag: "🇧🇪", searchTerms: "belgium belgique" },
  { code: "+91", country: "India", flag: "🇮🇳", searchTerms: "india bharat" },
  { code: "+86", country: "China", flag: "🇨🇳", searchTerms: "china zhongguo" },
  { code: "+81", country: "Japan", flag: "🇯🇵", searchTerms: "japan nihon" },
  { code: "+82", country: "South Korea", flag: "🇰🇷", searchTerms: "south korea korea" },
  { code: "+65", country: "Singapore", flag: "🇸🇬", searchTerms: "singapore" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", searchTerms: "malaysia" },
  { code: "+66", country: "Thailand", flag: "🇹🇭", searchTerms: "thailand siam" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳", searchTerms: "vietnam" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩", searchTerms: "indonesia" },
  { code: "+63", country: "Philippines", flag: "🇵🇭", searchTerms: "philippines" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰", searchTerms: "sri lanka ceylon" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩", searchTerms: "bangladesh" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰", searchTerms: "pakistan" },
  { code: "+977", country: "Nepal", flag: "🇳🇵", searchTerms: "nepal" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹", searchTerms: "bhutan" },
  { code: "+960", country: "Maldives", flag: "🇲🇻", searchTerms: "maldives" },
  { code: "+971", country: "UAE", flag: "🇦🇪", searchTerms: "uae emirates dubai abu dhabi" },
  { code: "+974", country: "Qatar", flag: "🇶🇦", searchTerms: "qatar" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", searchTerms: "saudi arabia" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼", searchTerms: "kuwait" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭", searchTerms: "bahrain" },
  { code: "+968", country: "Oman", flag: "🇴🇲", searchTerms: "oman" },
  { code: "+967", country: "Yemen", flag: "🇾🇪", searchTerms: "yemen" },
  { code: "+962", country: "Jordan", flag: "🇯🇴", searchTerms: "jordan" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧", searchTerms: "lebanon" },
  { code: "+963", country: "Syria", flag: "🇸🇾", searchTerms: "syria" },
  { code: "+964", country: "Iraq", flag: "🇮🇶", searchTerms: "iraq" },
  { code: "+98", country: "Iran", flag: "🇮🇷", searchTerms: "iran persia" },
  { code: "+90", country: "Turkey", flag: "🇹🇷", searchTerms: "turkey türkiye" },
  { code: "+972", country: "Israel", flag: "🇮🇱", searchTerms: "israel" },
  { code: "+20", country: "Egypt", flag: "🇪🇬", searchTerms: "egypt" },
  { code: "+27", country: "South Africa", flag: "🇿🇦", searchTerms: "south africa" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬", searchTerms: "nigeria" },
  { code: "+254", country: "Kenya", flag: "🇰🇪", searchTerms: "kenya" },
  { code: "+256", country: "Uganda", flag: "🇺🇬", searchTerms: "uganda" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿", searchTerms: "tanzania" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹", searchTerms: "ethiopia" },
  { code: "+233", country: "Ghana", flag: "🇬🇭", searchTerms: "ghana" },
  { code: "+55", country: "Brazil", flag: "🇧🇷", searchTerms: "brazil brasil" },
  { code: "+52", country: "Mexico", flag: "🇲🇽", searchTerms: "mexico" },
  { code: "+54", country: "Argentina", flag: "🇦🇷", searchTerms: "argentina" },
  { code: "+56", country: "Chile", flag: "🇨🇱", searchTerms: "chile" },
  { code: "+57", country: "Colombia", flag: "🇨🇴", searchTerms: "colombia" },
  { code: "+51", country: "Peru", flag: "🇵🇪", searchTerms: "peru" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪", searchTerms: "venezuela" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨", searchTerms: "ecuador" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴", searchTerms: "bolivia" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾", searchTerms: "paraguay" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾", searchTerms: "uruguay" },
  { code: "+7", country: "Russia", flag: "🇷🇺", searchTerms: "russia rossiya" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦", searchTerms: "ukraine" },
  { code: "+48", country: "Poland", flag: "🇵🇱", searchTerms: "poland polska" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿", searchTerms: "czech republic czechia" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰", searchTerms: "slovakia" },
  { code: "+36", country: "Hungary", flag: "🇭🇺", searchTerms: "hungary magyarország" },
  { code: "+40", country: "Romania", flag: "🇷🇴", searchTerms: "romania" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬", searchTerms: "bulgaria" },
  { code: "+30", country: "Greece", flag: "🇬🇷", searchTerms: "greece hellas" },
  { code: "+385", country: "Croatia", flag: "🇭🇷", searchTerms: "croatia" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮", searchTerms: "slovenia" },
  { code: "+381", country: "Serbia", flag: "🇷🇸", searchTerms: "serbia" },
  { code: "+382", country: "Montenegro", flag: "🇲🇪", searchTerms: "montenegro" },
  { code: "+387", country: "Bosnia", flag: "🇧🇦", searchTerms: "bosnia herzegovina" },
  { code: "+389", country: "North Macedonia", flag: "🇲🇰", searchTerms: "north macedonia" },
  { code: "+383", country: "Kosovo", flag: "🇽🇰", searchTerms: "kosovo" },
  { code: "+355", country: "Albania", flag: "🇦🇱", searchTerms: "albania" },
  { code: "+358", country: "Finland", flag: "🇫🇮", searchTerms: "finland suomi" },
  { code: "+372", country: "Estonia", flag: "🇪🇪", searchTerms: "estonia" },
  { code: "+371", country: "Latvia", flag: "🇱🇻", searchTerms: "latvia" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹", searchTerms: "lithuania" },
  { code: "+375", country: "Belarus", flag: "🇧🇾", searchTerms: "belarus" },
  { code: "+373", country: "Moldova", flag: "🇲🇩", searchTerms: "moldova" },
  { code: "+374", country: "Armenia", flag: "🇦🇲", searchTerms: "armenia" },
  { code: "+995", country: "Georgia", flag: "🇬🇪", searchTerms: "georgia" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿", searchTerms: "azerbaijan" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲", searchTerms: "turkmenistan" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯", searchTerms: "tajikistan" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬", searchTerms: "kyrgyzstan" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿", searchTerms: "uzbekistan" },
  { code: "+7", country: "Kazakhstan", flag: "🇰🇿", searchTerms: "kazakhstan" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳", searchTerms: "mongolia" },
  { code: "+850", country: "North Korea", flag: "🇰🇵", searchTerms: "north korea" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭", searchTerms: "cambodia" },
  { code: "+856", country: "Laos", flag: "🇱🇦", searchTerms: "laos" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲", searchTerms: "myanmar burma" },
  { code: "+673", country: "Brunei", flag: "🇧🇳", searchTerms: "brunei" },
  { code: "+670", country: "East Timor", flag: "🇹🇱", searchTerms: "east timor timor leste" },
].sort((a, b) => a.country.localeCompare(b.country))

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    countryCode: "+94", // Default to Sri Lanka
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [countryCodeOpen, setCountryCodeOpen] = useState(false)

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <GlobalHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-amber-700 max-w-3xl mx-auto mb-6">
            Get in touch with our team for reservations, inquiries, or any assistance you need. 
            We're here to help make your stay memorable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-4 py-2">
              <Phone className="w-4 h-4 mr-2" />
              24/7 Support
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-4 py-2">
              <MessageCircle className="w-4 h-4 mr-2" />
              Quick Response
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
              <Send className="w-4 h-4 mr-2" />
              Direct Contact
            </Badge>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        <Label htmlFor="phone">Your Phone Number</Label>
                        <div className="flex gap-2">
                          <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={countryCodeOpen}
                                className="w-48 justify-between"
                              >
                                {formData.countryCode ? (
                                  <>
                                    {countryCodesData.find((country) => country.code === formData.countryCode)?.flag}{" "}
                                    {formData.countryCode}{" "}
                                    <span className="text-xs text-gray-500 ml-1 truncate">
                                      {countryCodesData.find((country) => country.code === formData.countryCode)?.country}
                                    </span>
                                  </>
                                ) : (
                                  "Select country..."
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Command>
                                <CommandInput placeholder="Search country or type +code..." />
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {countryCodesData.map((country) => (
                                    <CommandItem
                                      key={`${country.code}-${country.country}`}
                                      value={`${country.country} ${country.code} ${country.searchTerms}`}
                                      onSelect={() => {
                                        handleInputChange("countryCode", country.code)
                                        setCountryCodeOpen(false)
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          formData.countryCode === country.code ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                      <span className="mr-2">{country.flag}</span>
                                      <span className="font-medium">{country.code}</span>
                                      <span className="ml-2 text-sm text-gray-600 truncate">{country.country}</span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="Your phone number"
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Please include your country code so we know your timezone for responding.<br />
                          <span className="text-amber-600">Tip: Search by typing country name or +code</span>
                        </p>
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
                  {/* General Manager */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">General Manager</h3>
                      <p className="text-gray-600">+94 71 776 5780</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-green-600 hover:bg-green-700 mr-2"
                        onClick={() => window.open("https://wa.me/94717765780", "_blank")}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Villa Team Lead */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Villa Team Lead</h3>
                      <p className="text-gray-600">+94 77 315 0602</p>
                      <p className="text-sm text-gray-500">Sinhala speaker</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-green-600 hover:bg-green-700 mr-2"
                        onClick={() => window.open("https://wa.me/94773150602", "_blank")}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Owner</h3>
                      <p className="text-gray-600">+94 711730345</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-green-600 hover:bg-green-700 mr-2"
                        onClick={() => window.open("https://wa.me/94711730345", "_blank")}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <a href="mailto:contact@KoLakeHouse.com" className="text-gray-600 hover:text-amber-600 transition-colors">
                        contact@KoLakeHouse.com
                      </a>
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
                      <p className="text-sm text-gray-500">2:30 hours from Colombo Airport</p>
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
                      <span className="font-medium">2:00 PM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out</span>
                      <span className="font-medium">11:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reception</span>
                      <span className="font-medium">7:00 AM - 10:30 PM</span>
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


            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Find Us</h2>
            <p className="text-lg md:text-xl text-gray-600">Located on the beautiful Koggala Lake in Sri Lanka's southern coast</p>
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
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                <p className="text-gray-600 text-sm">2:30 hours from Colombo Airport</p>
                <p className="text-gray-600 text-sm">2 hours from Colombo</p>
                <p className="text-gray-600 text-sm">30 minutes from Galle</p>
                <p className="text-gray-600 text-sm">15 minutes from Ahangama</p>
                <p className="text-gray-600 text-sm">2:30 hours from Yala</p>
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
      <section className="py-12 bg-amber-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to Book Your Stay?</h2>
          <p className="text-lg md:text-xl mb-6">
            Don't wait - secure your dates at Ko Lake Villa today and save with our direct booking rates.
          </p>
          <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50" asChild>
            <Link href="/booking">Book Your Stay</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
