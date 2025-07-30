"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ImageIcon, Video, Play, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import GlobalHeader from "@/components/navigation/global-header"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  category: string
}

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
    "/uploads/gallery/default/1747446463517-373816080-20250420_164235.mp4",
    "/uploads/gallery/default/1747367220545-41420806-20250420_170745.mp4",
    "/placeholder.svg?height=400&width=600&text=Lake+Activities",
    "/placeholder.svg?height=400&width=600&text=Local+Tours",
    "/placeholder.svg?height=400&width=600&text=Cultural+Experience"
  ],
  "lake-views": [
    "/uploads/gallery/default/1747345835546-656953027-20250420_170537.mp4",
    "/placeholder.svg?height=400&width=600&text=Morning+Lake+View",
    "/placeholder.svg?height=400&width=600&text=Sunset+Over+Lake",
    "/placeholder.svg?height=400&width=600&text=Villa+from+Lake",
    "/placeholder.svg?height=400&width=600&text=Lake+Wildlife"
  ]
}

const staticCategories = Object.keys(staticGalleryData)

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [categories, setCategories] = useState<string[]>(staticCategories)
  const [galleryData, setGalleryData] = useState<Record<string, string[]>>(staticGalleryData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVideoHelp, setShowVideoHelp] = useState(true)

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

  // Gallery data now initialized directly in state

  // Convert gallery data to MediaItem format
  const allImages: MediaItem[] = []
  Object.entries(galleryData).forEach(([category, images]) => {
    images.forEach((imagePath) => {
      const filename = getFilename(imagePath)
      const fileType = isVideo(filename) ? 'video' : 'image'
      
      // Generate better titles for videos
      let title = filename.replace(/\.[^/.]+$/, "").replace(/-/g, ' ').replace(/_/g, ' ')
      let description = `${formatCategoryName(category)} - ${filename}`
      
      // Special handling for villa videos
      if (fileType === 'video') {
        if (imagePath.includes('164235')) {
          title = "Complete Villa Walkthrough Tour"
          description = "Comprehensive tour showcasing all villa spaces and amenities"
        } else if (imagePath.includes('170745')) {
          title = "Lake View Experience"
          description = "Beautiful views of Koggala Lake from the villa"
        } else if (imagePath.includes('170537')) {
          title = "Sunset Over Lake"
          description = "Stunning sunset views from Ko Lake Villa"
        } else {
          title = title.charAt(0).toUpperCase() + title.slice(1) + " Video"
        }
      }
      
      allImages.push({
        id: imagePath,
        type: fileType,
        url: imagePath,
        title,
        description,
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

  // Remove loading state display - go directly to content

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
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore Ko Lake Villa's stunning spaces, luxury amenities, and beautiful surroundings
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {allImages.length} media items across {categories.length} categories
        </p>
        
        {/* Video Help Instructions */}
        {showVideoHelp && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-800">
                    🎥 How to play videos: Click on thumbnails with <Play className="w-4 h-4 inline mx-1" /> play button
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Videos will open in full-screen modal with controls
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVideoHelp(false)}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
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
                  onError={(e) => {
                    console.error('Video failed to load:', item.url)
                    e.currentTarget.style.display = 'none'
                  }}
                  poster="/placeholder.svg?height=400&width=600&text=Loading+Video..."
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
                    onError={(e) => {
                      console.error('Video failed to load in lightbox:', selectedItem.url)
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const errorDiv = document.createElement('div')
                      errorDiv.className = 'flex items-center justify-center h-full text-white text-center'
                      errorDiv.innerHTML = `
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Video Unavailable</h3>
                          <p className="text-gray-300">Unable to load video: ${selectedItem.title}</p>
                          <p className="text-sm text-gray-400 mt-2">Please try again later</p>
                        </div>
                      `
                      target.parentNode?.appendChild(errorDiv)
                    }}
                    onLoadStart={() => {
                      console.log('Video loading started:', selectedItem.url)
                    }}
                    onCanPlay={() => {
                      console.log('Video can play:', selectedItem.url)
                    }}
                    poster="/placeholder.svg?height=400&width=600&text=Loading+Video..."
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
    </div>
  )
} 