"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageIcon, Video, Play, X, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  category: string
  tags?: string[]
  filename?: string
  size?: number
  uploadDate?: string
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [images, setImages] = useState<MediaItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Load real gallery data from API
  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Loading gallery data from API...')
        
        // Fetch all published images from the API
        const response = await fetch('/api/gallery/list')
        if (!response.ok) {
          throw new Error(`Failed to fetch gallery data: ${response.statusText}`)
        }
        
        const galleryItems: MediaItem[] = await response.json()
        console.log(`Loaded ${galleryItems.length} gallery items`)
        
        // Extract categories from the loaded images
        const uniqueCategories = Array.from(
          new Set(galleryItems.map(item => item.category))
        ).sort()
        
        setImages(galleryItems)
        setCategories(uniqueCategories)
        
        console.log('Categories found:', uniqueCategories)
        
      } catch (err) {
        console.error('Error loading gallery:', err)
        setError(err instanceof Error ? err.message : 'Failed to load gallery images')
        
        // Fallback: try to load from the legacy gallery API endpoint
        try {
          console.log('Trying legacy gallery API...')
          const legacyResponse = await fetch('/api/gallery')
          if (legacyResponse.ok) {
            const legacyData = await legacyResponse.json()
            
            // Convert legacy format to MediaItem format
            const legacyItems: MediaItem[] = []
            Object.entries(legacyData).forEach(([category, urls]) => {
              if (Array.isArray(urls)) {
                urls.forEach((url: string) => {
                  const filename = url.split('/').pop() || ''
                  const isVideo = /\.(mp4|mov|avi)$/i.test(filename)
                  
                  legacyItems.push({
                    id: url,
                    type: isVideo ? 'video' : 'image',
                    url,
                    title: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                    description: `${category} - ${filename}`,
                    category: category.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    filename
                  })
                })
              }
            })
            
            const legacyCategories = Array.from(
              new Set(legacyItems.map(item => item.category))
            ).sort()
            
            setImages(legacyItems)
            setCategories(legacyCategories)
            setError(null)
            
            console.log(`Loaded ${legacyItems.length} items from legacy API`)
            
          } else {
            throw new Error('Both gallery APIs failed')
          }
        } catch (legacyErr) {
          console.error('Legacy API also failed:', legacyErr)
          setError('Failed to load gallery images from both API endpoints')
        }
      } finally {
        setLoading(false)
      }
    }

    loadGalleryData()
  }, [])

  // Filter images by category
  const filteredImages = selectedCategory === "all" 
    ? images 
    : images.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase())

  const openLightbox = (item: MediaItem) => {
    setCurrentImage(item)
    setCurrentIndex(filteredImages.findIndex(img => img.id === item.id))
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length
    setCurrentIndex(nextIndex)
    setCurrentImage(filteredImages[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    setCurrentIndex(prevIndex)
    setCurrentImage(filteredImages[prevIndex])
  }

  const downloadImage = () => {
    if (currentImage) {
      const link = document.createElement('a')
      link.href = currentImage.url
      link.download = currentImage.filename || `ko-lake-villa-${currentImage.id}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Ko Lake Villa Gallery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-red-500 bg-red-50">
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Villa Gallery</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore Ko Lake Villa's stunning spaces, luxury amenities, and beautiful surroundings
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {images.length} media items across {categories.length} categories
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          onClick={() => setSelectedCategory("all")}
          variant={selectedCategory === "all" ? "default" : "outline"}
          className={selectedCategory === "all" ? "bg-orange-600 hover:bg-orange-700" : ""}
        >
          All Photos ({images.length})
        </Button>
        
        {categories.map((category) => {
          const count = images.filter(item => item.category.toLowerCase() === category.toLowerCase()).length
          return (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category.toLowerCase())}
              variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
              className={selectedCategory === category.toLowerCase() ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {category} ({count})
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
                  onError={(e) => {
                    console.error('Image failed to load:', item.url)
                    e.currentTarget.style.display = 'none'
                  }}
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
                <Badge className="bg-orange-600">{item.category}</Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              {item.uploadDate && (
                <p className="text-gray-400 text-xs">
                  Uploaded: {new Date(item.uploadDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && !loading && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No images found</h3>
          <p className="text-gray-500">
            {selectedCategory === "all" 
              ? "No published images available at the moment." 
              : `No images found in the "${selectedCategory}" category.`
            }
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && currentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Download Button */}
            {currentImage.type === "image" && (
              <Button
                onClick={downloadImage}
                className="absolute top-4 right-16 z-10 bg-black/50 hover:bg-black/70 text-white"
                size="sm"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}

            {/* Previous Button */}
            {filteredImages.length > 1 && (
              <Button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}

            {/* Next Button */}
            {filteredImages.length > 1 && (
              <Button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {/* Media Content */}
            <div className="relative max-w-full max-h-full">
              {currentImage.type === "image" ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.title}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={currentImage.url}
                  controls
                  className="max-w-full max-h-full"
                  autoPlay
                />
              )}
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded">
              <h3 className="text-lg font-semibold mb-1">{currentImage.title}</h3>
              <p className="text-sm text-gray-300 mb-1">{currentImage.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{currentImage.category}</span>
                <span>{currentIndex + 1} of {filteredImages.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 