"use client"

import { useState } from "react"
import { useGallery } from "@/hooks/use-gallery"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Play, Loader2 } from "lucide-react"
import Image from "next/image"

const categories = [
  { id: "all", name: "All Categories", count: 131 },
  { id: "entire-villa", name: "Entire Villa", count: 15 },
  { id: "family-suite", name: "Family Suite", count: 12 },
  { id: "group-room", name: "Group Room", count: 10 },
  { id: "triple-room", name: "Triple Room", count: 8 },
  { id: "dining-area", name: "Dining Area", count: 14 },
  { id: "pool-deck", name: "Pool Deck", count: 18 },
  { id: "lake-garden", name: "Lake Garden", count: 16 },
  { id: "roof-garden", name: "Roof Garden", count: 9 },
  { id: "front-garden", name: "Front Garden", count: 11 },
  { id: "koggala-lake", name: "Koggala Lake", count: 13 },
  { id: "excursions", name: "Excursions", count: 5 },
]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedImage, setSelectedImage] = useState<any>(null)

  // Use the custom hook to fetch data from your backend
  const { images, loading, error, refetch } = useGallery(selectedCategory === "all" ? undefined : selectedCategory)

  const filteredItems = images.filter((item: any) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading gallery: {error}</p>
          <Button onClick={refetch} className="bg-amber-600 hover:bg-amber-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ko Lake Villa Gallery</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our beautiful lakeside retreat through stunning photography and videos
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  data-testid="search-input"
                  placeholder="Search gallery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48" data-testid="category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-amber-600 hover:bg-amber-700" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredItems.length} of {images.length} images
            {selectedCategory !== "all" && <span> in "{categories.find((c) => c.id === selectedCategory)?.name}"</span>}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredItems.map((item: any) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedImage(item)}
              data-testid="gallery-item"
            >
              <div className="relative aspect-video">
                <Image src={item.image_url || "/placeholder.svg"} alt={item.alt} fill className="object-cover" />
                {item.media_type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    </div>
                  </div>
                )}
                {item.featured && <Badge className="absolute top-2 right-2 bg-amber-600">Featured</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize" data-testid="category-badge">
                    {item.category.replace("-", " ")}
                  </Badge>
                  <span className="text-sm text-gray-500 capitalize">{item.media_type}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={selectedImage.image_url || "/placeholder.svg"}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded">
                <h3 className="font-semibold mb-1">{selectedImage.title}</h3>
                <p className="text-sm opacity-90">{selectedImage.alt}</p>
              </div>
              <Button
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
