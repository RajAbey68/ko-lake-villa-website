"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Send, Upload } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "General Inquiry",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 30 * 1024 * 1024) { // 30MB limit
        alert("File is too large. Please select a file under 30MB.")
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Using FormData to handle file uploads
    const submissionData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value)
    })
    if (file) {
      submissionData.append("attachment", file)
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: submissionData,
      })

      if (response.ok) {
        alert("Thank you for your message! We will get back to you shortly.")
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          inquiryType: "General Inquiry",
        })
        setFile(null)
      } else {
        const errorData = await response.json()
        alert(`Submission failed: ${errorData.message || "Please try again."}`)
      }
    } catch (error) {
      console.error("Contact form submission error:", error)
      alert("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-24">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">Get In Touch</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We're here to help with any questions you have about booking, our amenities, or planning your stay. Reach out to us, and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-3xl font-light text-gray-800 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div>
                                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                                    <Select value={formData.inquiryType} onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                            <SelectItem value="Booking Question">Booking Question</SelectItem>
                                            <SelectItem value="Amenities & Services">Amenities & Services</SelectItem>
                                            <SelectItem value="Events & Celebrations">Events & Celebrations</SelectItem>
                                            <SelectItem value="Social Media">Social Media</SelectItem>
                                            <SelectItem value="Online Travel Agency">Online Travel Agency</SelectItem>
                                            <SelectItem value="Complaint">Complaint</SelectItem>
                                            <SelectItem value="Review">Review</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                            </div>

                            <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Please provide details about your inquiry..." rows={5} required />
                            </div>
                            
                            <div>
                                <Label htmlFor="attachment">Attach File (Optional)</Label>
                                <Input id="attachment" type="file" onChange={handleFileChange} className="pt-2" />
                                <p className="text-xs text-gray-500 mt-1">Photo or video, max 30MB.</p>
                                {file && <p className="text-sm text-green-600 mt-2">File selected: {file.name}</p>}
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-stone-800 hover:bg-stone-900 text-base py-3">
                                <Send className="w-5 h-5 mr-2" />
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                           <h3 className="text-2xl font-light text-gray-800 mb-4">Contact Details</h3>
                            <div className="space-y-4">
                                <a href="tel:+940711730345" className="flex items-center space-x-4 group">
                                    <Phone className="w-6 h-6 text-stone-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800 group-hover:text-stone-700">Phone / WhatsApp</p>
                                        <p className="text-gray-600 group-hover:text-stone-700">+94 (0) 71 173 0345</p>
                                    </div>
                                </a>
                                <a href="mailto:kolakevilla@gmail.com" className="flex items-center space-x-4 group">
                                    <Mail className="w-6 h-6 text-stone-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800 group-hover:text-stone-700">Email</p>
                                        <p className="text-gray-600 group-hover:text-stone-700">kolakevilla@gmail.com</p>
                                    </div>
                                </a>
                                <div className="flex items-center space-x-4">
                                    <MapPin className="w-6 h-6 text-stone-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Address</p>
                                        <p className="text-gray-600">Ahangama, Koggala Lake, Sri Lanka</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                           <h3 className="text-2xl font-light text-gray-800 mb-4">Find Us</h3>
                           {/* Replace with an actual map embed later */}
                           <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                               <p className="text-gray-500">Map will be loaded here.</p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
