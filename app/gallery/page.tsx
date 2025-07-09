"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ImageIcon, Video, Play, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  category: string
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [galleryData, setGalleryData] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper functions
  const formatCategoryName = (name: string) => {
    return name.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
  }

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  const isVideo = (filename: string) => {
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'ogg']
    return videoExtensions.includes(getFileExtension(filename))
  }

  const getFilename = (path: string) => {
    return path.split('/').pop() || ''
  }

  // Static gallery data (replacing API calls)
  useEffect(() => {
    // Simulate loading for smooth UX
    const loadStaticData = () => {
      console.log('Loading static gallery data...')
      
      // Static gallery data for Ko Lake Villa
      const staticGalleryData = {
        "pool-facilities": [
          "/images/hero-pool.jpg",
          "/placeholder.svg?height=400&width=600&text=Pool+at+Sunset",
          "/placeholder.svg?height=400&width=600&text=Pool+Side+Lounge",
          "/placeholder.svg?height=400&width=600&text=Pool+Deck"
        ],
        "accommodation": [
          "/placeholder.svg?height=400&width=600&text=Master+Bedroom",
          "/placeholder.svg?height=400&width=600&text=Lake+View+Room",
          "/placeholder.svg?height=400&width=600&text=Living+Area",
          "/placeholder.svg?height=400&width=600&text=Villa+Exterior"
        ],
        "dining": [
          "/placeholder.svg?height=400&width=600&text=Dining+Area",
          "/placeholder.svg?height=400&width=600&text=Kitchen",
          "/placeholder.svg?height=400&width=600&text=Chef+Preparation",
          "/placeholder.svg?height=400&width=600&text=Outdoor+Dining"
        ],
        "experiences": [
          "/images/excursions-hero.jpg",
          "/placeholder.svg?height=400&width=600&text=Lake+Activities",
          "/placeholder.svg?height=400&width=600&text=Local+Tours",
          "/placeholder.svg?height=400&width=600&text=Cultural+Experience"
        ],
        "lake-views": [
          "/placeholder.svg?height=400&width=600&text=Morning+Lake+View",
          "/placeholder.svg?height=400&width=600&text=Sunset+Over+Lake",
          "/placeholder.svg?height=400&width=600&text=Villa+from+Lake",
          "/placeholder.svg?height=400&width=600&text=Lake+Wildlife"
        ]
      }
      
      const staticCategories = Object.keys(staticGalleryData)
      
      console.log('Static categories:', staticCategories)
      console.log('Static gallery data keys:', Object.keys(staticGalleryData))

      setCategories(staticCategories)
      setGalleryData(staticGalleryData)
      setLoading(false)
      setError(null)
    }

    // Add small delay to show loading state briefly
    setTimeout(loadStaticData, 500)
  }, [])

  // Convert gallery data to MediaItem format
  const allImages: MediaItem[] = []
  Object.entries(galleryData).forEach(([category, images]) => {
    images.forEach((imagePath) => {
      const filename = getFilename(imagePath)
      const fileType = isVideo(filename) ? 'video' : 'image'
      
      allImages.push({
        id: imagePath,
        type: fileType,
        url: imagePath,
        title: filename.replace(/\.[^/.]+$/, "").replace(/-/g, ' ').replace(/_/g, ' '),
        description: `${formatCategoryName(category)} - ${filename}`,
        category: formatCategoryName(category)
      })
    })
  })

  const filteredImages = selectedCategory === "all" 
    ? allImages 
    : allImages.filter(item => item.category === selectedCategory)

  const openLightbox = (item: MediaItem) => {
    setSelectedItem(item)
    setCurrentIndex(filteredImages.findIndex((i) => i.id === item.id))
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
        : (currentIndex + 1) % filteredImages.length

    setCurrentIndex(newIndex)
    setSelectedItem(filteredImages[newIndex])
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h1>
          <p className="text-lg text-gray-600">Loading gallery images...</p>
          <div className="mt-4 text-sm text-gray-500">
            Debug: Fetching data from API endpoints
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h1>
          <p className="text-lg text-red-600">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (allImages.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h1>
          <p className="text-lg text-gray-600">No images found</p>
          <div className="mt-4 text-sm text-gray-500">
            Debug: Categories: {categories.length}, Gallery data keys: {Object.keys(galleryData).length}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore Ko Lake Villa's stunning spaces, luxury amenities, and beautiful surroundings
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {allImages.length} media items across {categories.length} categories
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          className={selectedCategory === "all" ? "bg-amber-600 hover:bg-amber-700" : ""}
        >
          All Photos ({allImages.length})
        </Button>
        {categories.map((category) => {
          const categoryName = formatCategoryName(category)
          const categoryCount = allImages.filter(item => item.category === categoryName).length
          return (
            <Button
              key={category}
              variant={selectedCategory === categoryName ? "default" : "outline"}
              onClick={() => setSelectedCategory(categoryName)}
              className={selectedCategory === categoryName ? "bg-amber-600 hover:bg-amber-700" : ""}
            >
              {categoryName} ({categoryCount})
            </Button>
          )
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative aspect-video bg-gray-100" onClick={() => openLightbox(item)}>
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                />
              )}

              {/* Media Type Indicator */}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {item.type === "image" ? <ImageIcon className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                  {item.type}
                </Badge>
              </div>

              {/* Play Button for Videos */}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full p-4">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-3 right-3">
                <Badge className="bg-amber-600 text-white text-xs">{item.category}</Badge>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-end">
                <div className="p-4 text-white opacity-0 hover:opacity-100 transition-opacity">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          {selectedItem && (
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Navigation Buttons */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => navigateLightbox("prev")}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => navigateLightbox("next")}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Media Content */}
              <div className="aspect-video">
                {selectedItem.type === "image" ? (
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    fill
                    className="object-contain bg-black"
                  />
                ) : (
                  <video
                    src={selectedItem.url}
                    className="w-full h-full object-contain bg-black"
                    controls
                    autoPlay
                  />
                )}
              </div>

              {/* Media Info */}
              <div className="p-6 bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-800 mb-2">{selectedItem.title}</h2>
                    <p className="text-gray-600 mb-3">{selectedItem.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">{selectedItem.category}</Badge>
                      <Badge className="bg-amber-100 text-amber-800">
                        {selectedItem.type === "image" ? "Photo" : "Video"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 