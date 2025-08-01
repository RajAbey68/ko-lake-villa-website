"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  BarChart3, FileText, Users, Home, Image as ImageIcon, Settings, LogOut, Save, Edit, Eye, 
  Phone, Mail, MapPin, Bed, Camera, Utensils, Car, Upload, RefreshCw, Monitor, Smartphone, 
  Tablet, X, Check, AlertCircle, Copy, Download, Trash2, Plus, Move, Search, Filter
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  category: string
  tags: string[]
  seoTitle: string
  seoDescription: string
  altText: string
  uploadDate: string
  filename: string
  size: number
  isPublished: boolean
}

interface ContentData {
  homepage: {
    title: string
    subtitle: string
    description: string
    heroText: string
    heroImage?: string
    logoImage?: string
  }
  accommodation: {
    title: string
    description: string
    familySuite: string
    tripleRoom: string
    groupRoom: string
    heroImage?: string
  }
  dining: {
    title: string
    description: string
    experience: string
    heroImage?: string
  }
  experiences: {
    title: string
    description: string
    activities: string
    heroImage?: string
  }
  contact: {
    phone?: string
    email: string
    address: string
    description: string
    managerPhone?: string
    teamLeadPhone?: string
    ownerPhone?: string
  }
  gallery: {
    title: string
    description: string
    categories?: string[]
  }
}

export default function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState('homepage')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([])
  const [showImageSelector, setShowImageSelector] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [content, setContent] = useState<ContentData>({
    homepage: {
      title: "Ko Lake Villa",
      subtitle: "Luxury Lakefront Accommodation in Sri Lanka", 
      description: "Experience the perfect blend of luxury and nature at Ko Lake Villa. Our stunning lake house offers breathtaking views, modern amenities, and authentic Sri Lankan hospitality.",
      heroText: "Relax, Revive, Connect",
      heroImage: "/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg",
      logoImage: "/uploads/gallery/koggala-lake/KoggalaNinePeaks_koggala-lake_0.jpg"
    },
    accommodation: {
      title: "Luxury Accommodation",
      description: "Choose from our beautifully appointed rooms, each offering unique lake views and modern comfort.",
      familySuite: "Spacious family suite with panoramic lake views, perfect for families seeking comfort and luxury.",
      tripleRoom: "Elegant triple room with modern amenities and stunning lake vistas.",
      groupRoom: "Large group accommodation ideal for gatherings and events.",
      heroImage: "/uploads/gallery/family-suite/KoggalaNinePeaks_family-suite_0.png"
    },
    dining: {
      title: "Authentic Sri Lankan Cuisine",
      description: "Savor the flavors of Sri Lanka with our expertly prepared traditional dishes using fresh local ingredients.",
      experience: "Our skilled chefs create authentic Sri Lankan culinary experiences that celebrate local flavors and traditions.",
      heroImage: "/uploads/gallery/dining-area/cake-1.jpg"
    },
    experiences: {
      title: "Unforgettable Experiences",
      description: "Discover the beauty of Sri Lanka through our curated experiences and excursions.",
      activities: "From lake adventures to cultural tours, we offer a range of activities to make your stay memorable.",
      heroImage: "/uploads/gallery/excursions/KoggalaNinePeaks_excursions_0.jpg"
    },
    contact: {
      phone: "+94 71 776 5780",
      email: "contact@KoLakeHouse.com",
      address: "Kathaluwa West, Koggala Lake, Galle District, Sri Lanka",
      description: "Contact us to plan your perfect getaway at Ko Lake Villa.",
      managerPhone: "+94 71 776 5780",
      teamLeadPhone: "+94 77 315 0602",
      ownerPhone: "+94 711730345"
    },
    gallery: {
      title: "Villa Gallery",
      description: "Explore Ko Lake Villa's stunning spaces, luxury amenities, and beautiful surroundings",
      categories: ["Pool & Facilities", "Bedrooms", "Living Areas", "Kitchen & Dining", "Garden", "Outdoor Spaces", "Local Area"]
    }
  })

  // Load gallery items
  const loadGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery/list')
      if (response.ok) {
        const items = await response.json()
        setGalleryItems(items)
      }
    } catch (error) {
      console.error('Error loading gallery items:', error)
    }
  }

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth")
    const userAuth = localStorage.getItem("userAuth")
    
    if (adminAuth === "true" || userAuth) {
      setIsAuthenticated(true)
      loadGalleryItems()
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const handleSave = async (section: keyof ContentData, field: string, value: string) => {
    setSaving(true)
    
    try {
      setContent(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }))
      
      // Here you would make an API call to save to database
      // await fetch('/api/content/update', { method: 'POST', body: JSON.stringify({section, field, value}) })
      
      setIsEditing(null)
      setSaveMessage("Content saved successfully!")
      setTimeout(() => setSaveMessage(null), 3000)
      
    } catch (error) {
      console.error('Save error:', error)
      setSaveMessage("Error saving content")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('category', 'cms-content')
    formData.append('description', `CMS uploaded image - ${file.name}`)

    try {
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        await loadGalleryItems()
        return result.url
      }
    } catch (error) {
      console.error('Upload error:', error)
    }
    return null
  }

  const selectImageForField = (imageUrl: string) => {
    if (showImageSelector) {
      const [section, field] = showImageSelector.split('-')
      handleSave(section as keyof ContentData, field, imageUrl)
      setShowImageSelector(null)
    }
  }

  const filteredGalleryItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(galleryItems.map(item => item.category))]

  const EditableField = ({ 
    section, 
    field, 
    value, 
    type = "text",
    rows = 3,
    isImage = false
  }: { 
    section: string
    field: string
    value: string
    type?: "text" | "textarea"
    rows?: number
    isImage?: boolean
  }) => {
    const [editValue, setEditValue] = useState(value)
    const isEditable = isEditing === `${section}-${field}`

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium capitalize">
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </Label>
          <div className="flex space-x-2">
            {isImage && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowImageSelector(`${section}-${field}`)}
                className="h-8 px-3"
              >
                <ImageIcon className="w-3 h-3 mr-1" />
                Select Image
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(isEditable ? null : `${section}-${field}`)}
              className="h-8 px-3"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
        
        {isImage && value && (
          <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
            <Image
              src={value}
              alt={`${field} preview`}
              fill
              className="object-cover"
            />
          </div>
        )}
        
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
                onClick={() => handleSave(section as keyof ContentData, field, editValue)}
                disabled={saving}
                className="h-8 px-3 bg-amber-600 hover:bg-amber-700 text-white text-sm"
              >
                {saving ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
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
          <div className="text-gray-700 p-3 bg-gray-50 rounded-md min-h-[2.5rem] flex items-center">
            {isImage ? (
              <span className="text-sm text-gray-500 font-mono">{value}</span>
            ) : (
              value
            )}
          </div>
        )}
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management System</h1>
              <p className="text-gray-600 mt-2">Edit website content, images, and manage all pages</p>
            </div>
            
            {/* Preview Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex bg-white rounded-lg border p-1">
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('desktop')}
                  className="px-3"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('tablet')}
                  className="px-3"
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('mobile')}
                  className="px-3"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
              
              <Link href="/" target="_blank">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Eye className="w-4 h-4 mr-2" />
                  Live Preview
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Save Message */}
          {saveMessage && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {saveMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Content Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="homepage" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Homepage</span>
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="flex items-center space-x-2">
              <Bed className="w-4 h-4" />
              <span className="hidden md:inline">Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="dining" className="flex items-center space-x-2">
              <Utensils className="w-4 h-4" />
              <span className="hidden md:inline">Dining</span>
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center space-x-2">
              <Car className="w-4 h-4" />
              <span className="hidden md:inline">Experiences</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span className="hidden md:inline">Gallery</span>
            </TabsTrigger>
          </TabsList>

          {/* Homepage Content */}
          <TabsContent value="homepage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <Card>
                <CardHeader>
                  <CardTitle>Homepage Images</CardTitle>
                  <CardDescription>
                    Manage hero image and logo for the homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                                     <EditableField 
                     section="homepage" 
                     field="heroImage" 
                     value={content.homepage.heroImage || ""} 
                     isImage={true}
                   />
                   <EditableField 
                     section="homepage" 
                     field="logoImage" 
                     value={content.homepage.logoImage || ""} 
                     isImage={true}
                   />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accommodation Content */}
          <TabsContent value="accommodation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <Card>
                <CardHeader>
                  <CardTitle>Accommodation Images</CardTitle>
                  <CardDescription>
                    Manage hero image for accommodation page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                                     <EditableField 
                     section="accommodation" 
                     field="heroImage" 
                     value={content.accommodation.heroImage || ""} 
                     isImage={true}
                   />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Dining Content */}
          <TabsContent value="dining" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <Card>
                <CardHeader>
                  <CardTitle>Dining Images</CardTitle>
                  <CardDescription>
                    Manage hero image for dining page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                                     <EditableField 
                     section="dining" 
                     field="heroImage" 
                     value={content.dining.heroImage || ""} 
                     isImage={true}
                   />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Experiences Content */}
          <TabsContent value="experiences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <Card>
                <CardHeader>
                  <CardTitle>Experiences Images</CardTitle>
                  <CardDescription>
                    Manage hero image for experiences page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                                     <EditableField 
                     section="experiences" 
                     field="heroImage" 
                     value={content.experiences.heroImage || ""} 
                     isImage={true}
                   />
                 </CardContent>
               </Card>
             </div>
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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-6">
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
                   </div>
                   <div className="space-y-6">
                     <EditableField 
                       section="contact" 
                       field="managerPhone" 
                       value={content.contact.managerPhone || ""} 
                     />
                     <EditableField 
                       section="contact" 
                       field="teamLeadPhone" 
                       value={content.contact.teamLeadPhone || ""} 
                     />
                     <EditableField 
                       section="contact" 
                       field="ownerPhone" 
                       value={content.contact.ownerPhone || ""} 
                     />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Management */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Gallery Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage gallery page content and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <EditableField 
                  section="gallery" 
                  field="title" 
                  value={content.gallery.title} 
                />
                <EditableField 
                  section="gallery" 
                  field="description" 
                  value={content.gallery.description} 
                  type="textarea"
                  rows={2}
                />
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-sm font-medium">Gallery Items</Label>
                    <p className="text-sm text-gray-600">
                      {galleryItems.length} total items • {galleryItems.filter(item => item.isPublished).length} published
                    </p>
                  </div>
                  <Link href="/admin/gallery">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Manage Gallery
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your Ko Lake Villa website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/" target="_blank">
                <Button className="w-full border border-gray-300 hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Site
                </Button>
              </Link>
              <Link href="/admin/gallery">
                <Button className="w-full border border-gray-300 hover:bg-gray-50">
                  <Camera className="w-4 h-4 mr-2" />
                  Manage Gallery
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button className="w-full border border-gray-300 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Selector Dialog */}
      <Dialog open={!!showImageSelector} onOpenChange={() => setShowImageSelector(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {filteredGalleryItems.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all"
                  onClick={() => selectImageForField(item.url)}
                >
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredGalleryItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No images found matching your criteria
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 