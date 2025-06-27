"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Video, Trash2, Edit, Eye, Sparkles, Copy } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CampaignGenerator from "@/components/admin/campaign-generator" // Declare CampaignGenerator
import MarketingAssetsGenerator from "@/components/admin/marketing-assets-generator"

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
  tribe?: string
}

export default function GalleryManagement() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: "1",
      type: "image",
      url: "/placeholder.svg?height=300&width=400&text=Pool+View",
      title: "Infinity Pool at Sunset",
      description: "Our stunning 60-foot infinity pool overlooking the tranquil lake",
      category: "Pool & Facilities",
      tags: ["pool", "sunset", "luxury", "relaxation"],
      seoTitle: "Luxury Infinity Pool Villa Sri Lanka | Ko Lake Villa Ahangama",
      seoDescription:
        "Experience our stunning 60-foot infinity pool with lake views at Ko Lake Villa. Perfect for families, wellness retreats, and luxury stays in Ahangama, Sri Lanka.",
      altText: "Infinity pool at Ko Lake Villa with sunset reflection and lake view",
      uploadDate: "2024-01-15",
      tribe: "Family Groups",
    },
    {
      id: "2",
      type: "video",
      url: "/placeholder.svg?height=300&width=400&text=Villa+Tour",
      title: "Villa Tour - Complete Walkthrough",
      description: "Take a complete tour of Ko Lake Villa's luxurious spaces and amenities",
      category: "Villa Tour",
      tags: ["tour", "rooms", "facilities", "overview"],
      seoTitle: "Ko Lake Villa Tour | Luxury Villa Rental Ahangama Sri Lanka",
      seoDescription:
        "Virtual tour of Ko Lake Villa - luxury 4-bedroom villa with pool, lake views, and modern amenities. Perfect for surf trips, family holidays, and wellness retreats.",
      altText: "Complete video tour of Ko Lake Villa showing all rooms and facilities",
      uploadDate: "2024-01-10",
      tribe: "Digital Nomads",
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    "Pool & Facilities",
    "Bedrooms",
    "Living Areas",
    "Kitchen & Dining",
    "Outdoor Spaces",
    "Villa Tour",
    "Local Area",
    "Activities",
  ]

  const targetTribes = [
    "Family Groups",
    "Wellness & Yoga Retreats",
    "Surf Travellers & Beach Lovers",
    "Digital Nomads & Remote Workers",
    "Creative & Soulful Travellers",
    "Small Celebration Groups",
    "Eco-Conscious & Nature-Loving Guests",
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    // Simulate upload process
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/")
      const newItem: MediaItem = {
        id: Date.now().toString() + Math.random(),
        type: isVideo ? "video" : "image",
        url: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
        category: categories[0],
        tags: [],
        seoTitle: "",
        seoDescription: "",
        altText: "",
        uploadDate: new Date().toISOString().split("T")[0],
      }

      setMediaItems((prev) => [...prev, newItem])
    }

    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const generateAISEO = async (item: MediaItem) => {
    setIsGeneratingAI(true)

    // Simulate AI generation
    setTimeout(() => {
      const updatedItem = {
        ...item,
        seoTitle: `${item.title} | Ko Lake Villa Luxury Accommodation Sri Lanka`,
        seoDescription: `${item.description} Perfect for ${item.tribe?.toLowerCase() || "luxury travelers"} seeking premium villa rental in Ahangama, Sri Lanka. Book direct and save 10%.`,
        altText: `${item.title} at Ko Lake Villa - luxury villa rental in Ahangama Sri Lanka`,
      }

      setMediaItems((prev) => prev.map((i) => (i.id === item.id ? updatedItem : i)))
      setSelectedItem(updatedItem)
      setIsGeneratingAI(false)
    }, 2000)
  }

  const filteredItems =
    selectedCategory === "all" ? mediaItems : mediaItems.filter((item) => item.category === selectedCategory)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-800">Gallery Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-amber-600 hover:bg-amber-700"
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Media"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="seo">SEO Optimization</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Generator</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline">{filteredItems.length} items</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  {item.type === "image" ? (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-white/90">
                      {item.type === "image" ? (
                        <ImageIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <Video className="w-3 h-3 mr-1" />
                      )}
                      {item.type}
                    </Badge>
                  </div>
                  {item.tribe && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-amber-600 text-white text-xs">{item.tribe}</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          {selectedItem ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  AI SEO Optimization - {selectedItem.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seo-title">SEO Title</Label>
                    <Input
                      id="seo-title"
                      value={selectedItem.seoTitle}
                      onChange={(e) => setSelectedItem({ ...selectedItem, seoTitle: e.target.value })}
                      placeholder="Enter SEO title"
                    />
                    <p className="text-xs text-gray-500 mt-1">{selectedItem.seoTitle.length}/60 characters</p>
                  </div>
                  <div>
                    <Label htmlFor="alt-text">Alt Text</Label>
                    <Input
                      id="alt-text"
                      value={selectedItem.altText}
                      onChange={(e) => setSelectedItem({ ...selectedItem, altText: e.target.value })}
                      placeholder="Enter alt text for accessibility"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="seo-description">SEO Description</Label>
                  <Textarea
                    id="seo-description"
                    value={selectedItem.seoDescription}
                    onChange={(e) => setSelectedItem({ ...selectedItem, seoDescription: e.target.value })}
                    placeholder="Enter SEO description"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">{selectedItem.seoDescription.length}/160 characters</p>
                </div>

                <div>
                  <Label htmlFor="target-tribe">Target Tribe</Label>
                  <Select
                    value={selectedItem.tribe || ""}
                    onValueChange={(value) => setSelectedItem({ ...selectedItem, tribe: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target tribe" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetTribes.map((tribe) => (
                        <SelectItem key={tribe} value={tribe}>
                          {tribe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => generateAISEO(selectedItem)}
                    disabled={isGeneratingAI}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGeneratingAI ? "Generating..." : "Generate AI SEO"}
                  </Button>
                  <Button variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SEO Data
                  </Button>
                </div>

                {isGeneratingAI && (
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                      AI is analyzing your content and generating optimized SEO metadata targeting{" "}
                      {selectedItem.tribe || "your audience"}...
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select Media for SEO Optimization</h3>
                <p className="text-gray-600">
                  Choose an image or video from the gallery to optimize its SEO metadata with AI.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignGenerator />
        </TabsContent>

        <TabsContent value="marketing">
          <MarketingAssetsGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
