"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BarChart3, FileText, Users, Home, Image, Settings, LogOut, Save, Edit, Eye, Phone, Mail, MapPin, Bed, Camera, Utensils, Car } from "lucide-react"
import Link from "next/link"

export default function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const router = useRouter()

  // Mock content data - in real app this would come from a database
  const [content, setContent] = useState({
    homepage: {
      title: "Ko Lake Villa",
      subtitle: "Luxury Lake House Experience in Sri Lanka",
      description: "Experience the perfect blend of luxury and nature at Ko Lake Villa. Our stunning lake house offers breathtaking views, modern amenities, and authentic Sri Lankan hospitality.",
      heroText: "Escape to Paradise"
    },
    accommodation: {
      title: "Luxury Accommodation",
      description: "Choose from our beautifully appointed rooms, each offering unique lake views and modern comfort.",
      familySuite: "Spacious family suite with panoramic lake views, perfect for families seeking comfort and luxury.",
      tripleRoom: "Elegant triple room with modern amenities and stunning lake vistas.",
      groupRoom: "Large group accommodation ideal for gatherings and events."
    },
    dining: {
      title: "Authentic Sri Lankan Cuisine",
      description: "Savor the flavors of Sri Lanka with our expertly prepared traditional dishes using fresh local ingredients.",
      experience: "Our skilled chefs create authentic Sri Lankan culinary experiences that celebrate local flavors and traditions."
    },
    experiences: {
      title: "Unforgettable Experiences",
      description: "Discover the beauty of Sri Lanka through our curated experiences and excursions.",
      activities: "From lake adventures to cultural tours, we offer a range of activities to make your stay memorable."
    },
    contact: {
      phone: "+94711730345",
      email: "contact@KoLakeHouse.com",
      address: "Kathaluwa West, Koggala Lake, Galle District, Sri Lanka",
      description: "Contact us to plan your perfect getaway at Ko Lake Villa."
    }
  })

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth")
    const userAuth = localStorage.getItem("userAuth")
    
    if (adminAuth === "true" || userAuth) {
      setIsAuthenticated(true)
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("userAuth")
    
    // Clear auth cookie
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    
    router.push("/admin/login")
  }

  const handleSave = (section: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
    setIsEditing(null)
    // In real app, this would save to database
    console.log("Saved:", section, field, value)
  }

  const EditableField = ({ 
    section, 
    field, 
    value, 
    type = "text",
    rows = 3 
  }: { 
    section: string
    field: string
    value: string
    type?: "text" | "textarea"
    rows?: number
  }) => {
    const [editValue, setEditValue] = useState(value)
    const isEditable = isEditing === `${section}-${field}`

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</Label>
          <Button
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => setIsEditing(isEditable ? null : `${section}-${field}`)}
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
        
        {isEditable ? (
          <div className="space-y-2">
            {type === "textarea" ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={rows}
                className="w-full"
              />
            ) : (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full"
              />
            )}
            <div className="flex space-x-2">
              <Button
                onClick={() => handleSave(section, field, editValue)}
                className="h-8 px-3 bg-amber-600 hover:bg-amber-700 text-white text-sm"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
              <Button
                onClick={() => {
                  setEditValue(value)
                  setIsEditing(null)
                }}
                className="h-8 px-3 border border-gray-300 hover:bg-gray-50 text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 p-3 bg-gray-50 rounded-md min-h-[2.5rem] flex items-center">
            {value}
          </p>
        )}
      </div>
    )
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Edit website content, descriptions, and text</p>
        </div>

        {/* Content Management Tabs */}
        <Tabs defaultValue="homepage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="homepage" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Homepage</span>
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="flex items-center space-x-2">
              <Bed className="w-4 h-4" />
              <span>Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="dining" className="flex items-center space-x-2">
              <Utensils className="w-4 h-4" />
              <span>Dining</span>
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center space-x-2">
              <Car className="w-4 h-4" />
              <span>Experiences</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </TabsTrigger>
          </TabsList>

          {/* Homepage Content */}
          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>Homepage Content</span>
                </CardTitle>
                <CardDescription>
                  Manage the main content displayed on your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <EditableField 
                  section="homepage" 
                  field="title" 
                  value={content.homepage.title} 
                />
                <EditableField 
                  section="homepage" 
                  field="subtitle" 
                  value={content.homepage.subtitle} 
                />
                <EditableField 
                  section="homepage" 
                  field="description" 
                  value={content.homepage.description} 
                  type="textarea"
                  rows={4}
                />
                <EditableField 
                  section="homepage" 
                  field="heroText" 
                  value={content.homepage.heroText} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accommodation Content */}
          <TabsContent value="accommodation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bed className="w-5 h-5" />
                  <span>Accommodation Content</span>
                </CardTitle>
                <CardDescription>
                  Edit room descriptions and accommodation details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <EditableField 
                  section="accommodation" 
                  field="title" 
                  value={content.accommodation.title} 
                />
                <EditableField 
                  section="accommodation" 
                  field="description" 
                  value={content.accommodation.description} 
                  type="textarea"
                  rows={3}
                />
                <EditableField 
                  section="accommodation" 
                  field="familySuite" 
                  value={content.accommodation.familySuite} 
                  type="textarea"
                  rows={2}
                />
                <EditableField 
                  section="accommodation" 
                  field="tripleRoom" 
                  value={content.accommodation.tripleRoom} 
                  type="textarea"
                  rows={2}
                />
                <EditableField 
                  section="accommodation" 
                  field="groupRoom" 
                  value={content.accommodation.groupRoom} 
                  type="textarea"
                  rows={2}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dining Content */}
          <TabsContent value="dining" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="w-5 h-5" />
                  <span>Dining Content</span>
                </CardTitle>
                <CardDescription>
                  Manage dining and cuisine descriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <EditableField 
                  section="dining" 
                  field="title" 
                  value={content.dining.title} 
                />
                <EditableField 
                  section="dining" 
                  field="description" 
                  value={content.dining.description} 
                  type="textarea"
                  rows={3}
                />
                <EditableField 
                  section="dining" 
                  field="experience" 
                  value={content.dining.experience} 
                  type="textarea"
                  rows={3}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experiences Content */}
          <TabsContent value="experiences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="w-5 h-5" />
                  <span>Experiences Content</span>
                </CardTitle>
                <CardDescription>
                  Edit activities and experience descriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <EditableField 
                  section="experiences" 
                  field="title" 
                  value={content.experiences.title} 
                />
                <EditableField 
                  section="experiences" 
                  field="description" 
                  value={content.experiences.description} 
                  type="textarea"
                  rows={3}
                />
                <EditableField 
                  section="experiences" 
                  field="activities" 
                  value={content.experiences.activities} 
                  type="textarea"
                  rows={3}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Content */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Contact Information</span>
                </CardTitle>
                <CardDescription>
                  Update contact details and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <EditableField 
                  section="contact" 
                  field="phone" 
                  value={content.contact.phone} 
                />
                <EditableField 
                  section="contact" 
                  field="email" 
                  value={content.contact.email} 
                />
                <EditableField 
                  section="contact" 
                  field="address" 
                  value={content.contact.address} 
                  type="textarea"
                  rows={2}
                />
                <EditableField 
                  section="contact" 
                  field="description" 
                  value={content.contact.description} 
                  type="textarea"
                  rows={2}
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your Ko Lake Villa website content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Link href="/">
                    <Button className="border border-gray-300 hover:bg-gray-50">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Site
                    </Button>
                  </Link>
                  <Link href="/admin/gallery">
                    <Button className="border border-gray-300 hover:bg-gray-50">
                      <Camera className="w-4 h-4 mr-2" />
                      Manage Gallery
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 