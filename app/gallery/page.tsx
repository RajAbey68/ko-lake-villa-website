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
  tags: string[]
  seoTitle: string
  seoDescription: string
  altText: string
  uploadDate: string
  filename: string
  size: number
  isPublished: boolean
  publishedAt?: string
  unpublishedAt?: string
  publishedBy?: string
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVideoHelp, setShowVideoHelp] = useState(true)

  // State for tracking video thumbnails
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({})

  // Generate video poster URL from video URL with dynamic loading
  const getVideoPosterUrl = (videoUrl: string, title: string) => {
    // Check if we already have a thumbnail for this video
    if (videoThumbnails[videoUrl]) {
      return videoThumbnails[videoUrl]
    }
    
    // Extract filename without extension for thumbnail lookup
    const videoFilename = videoUrl.split('/').pop()?.replace(/\.[^/.]+$/, "") || ""
    
    // Try to find corresponding thumbnail image (synchronous check)
    const possibleThumbnails = [
      `/thumbnails/${videoFilename}.jpg`,
      `/thumbnails/${videoFilename}.jpeg`, 
      `/thumbnails/${videoFilename}.png`,
      `/thumbnails/${videoFilename}-thumb.jpg`,
      `/uploads/gallery/thumbnails/${videoFilename}.jpg`,
    ]
    
    // Return default while we check for better options
    const defaultThumbnail = `/thumbnails/video-default.svg`
    
    // Async check for better thumbnail (don't await, just update state when ready)
    checkVideoThumbnail(videoUrl, videoFilename)
    
    return defaultThumbnail
  }

  // Async function to check for video thumbnails
  const checkVideoThumbnail = async (videoUrl: string, videoFilename: string) => {
    try {
      const response = await fetch(`/api/video-thumbnail?videoUrl=${encodeURIComponent(videoUrl)}`)
      if (response.ok) {
        const data = await response.json()
        setVideoThumbnails(prev => ({
          ...prev,
          [videoUrl]: data.thumbnailUrl
        }))
      }
    } catch (error) {
      console.log('Could not load custom thumbnail for', videoFilename)
      // Keep using default
    }
  }

  // Load gallery items from API
  const loadGalleryItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/gallery/list')
      if (!response.ok) {
        throw new Error('Failed to load gallery items')
      }
      const items: MediaItem[] = await response.json()
      
      // Filter to only show published items
      const publishedItems = items.filter(item => item.isPublished)
      
      setMediaItems(publishedItems)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(publishedItems.map(item => item.category))]
      setCategories(uniqueCategories)
      
      console.log(`Loaded ${publishedItems.length} published images from ${uniqueCategories.length} categories`)
    } catch (error) {
      console.error('Error loading gallery items:', error)
      setError('Failed to load gallery images. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Load gallery items on component mount
  useEffect(() => {
    loadGalleryItems()
  }, [])

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

  const filteredImages = selectedCategory === "all" 
    ? mediaItems 
    : mediaItems.filter(item => item.category === selectedCategory)

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
      <div className="min-h-screen bg-gray-50">
        <GlobalHeader />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h1>
            <p className="text-lg text-gray-600">Loading gallery images...</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalHeader />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h1>
            <p className="text-lg text-red-600">{error}</p>
            <Button 
              onClick={loadGalleryItems} 
              className="mt-4 bg-amber-600 hover:bg-amber-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (mediaItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalHeader />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h1>
            <p className="text-lg text-gray-600">No published images found</p>
            <div className="mt-4 text-sm text-gray-500">
              Debug: Categories: {categories.length}, Media items: {mediaItems.length}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      
      {/* Custom CSS for video hover effects */}
      <style jsx>{`
        .video-thumbnail-container {
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
        }
        
        .video-thumbnail-container:hover .video-thumbnail {
          transform: scale(1.05);
        }
        
        .video-thumbnail {
          transition: transform 0.3s ease;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .video-play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .video-thumbnail-container:hover .video-play-overlay {
          background: rgba(0, 0, 0, 0.5);
        }
        
        .video-play-button {
          width: 3rem;
          height: 3rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .video-thumbnail-container:hover .video-play-button {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 1);
        }
        
        .video-play-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: #1f2937;
          margin-left: 2px; /* Slight offset for better visual centering */
        }
        
        @media (max-width: 640px) {
          .video-play-button {
            width: 2.5rem;
            height: 2.5rem;
          }
          
          .video-play-icon {
            width: 1.25rem;
            height: 1.25rem;
          }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-800 mb-3">Villa Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore Ko Lake Villa's stunning spaces, luxury amenities, and beautiful surroundings
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {mediaItems.length} media items across {categories.length} categories
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
      <div className="mb-6">
        {/* First Row - All Photos and Main Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            All Photos ({mediaItems.length})
          </Button>
          {categories.slice(0, 5).map((category) => {
            const categoryName = formatCategoryName(category)
            const categoryCount = mediaItems.filter(item => item.category === categoryName).length
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
        
        {/* Second Row - Additional Categories if any */}
        {categories.length > 5 && (
          <div className="flex flex-wrap justify-center gap-2">
            {categories.slice(5).map((category) => {
              const categoryName = formatCategoryName(category)
              const categoryCount = mediaItems.filter(item => item.category === categoryName).length
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
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((item) => (
          <Card 
            key={item.id} 
            className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => openLightbox(item)}
          >
            <div className="relative aspect-square">
              {item.type === 'video' ? (
                <div className="video-thumbnail-container relative w-full h-full bg-black">
                  <video 
                    className="video-thumbnail"
                    poster={getVideoPosterUrl(item.url, item.title)}
                    preload="metadata"
                    muted
                    playsInline
                    onError={(e) => {
                      console.error('Video thumbnail failed to load:', item.url)
                      // Fallback to default poster if video fails
                      const video = e.target as HTMLVideoElement
                      if (video.poster !== '/thumbnails/video-default.svg') {
                        video.poster = '/thumbnails/video-default.svg'
                      }
                    }}
                    onLoadedMetadata={(e) => {
                      // Ensure poster is displayed
                      const video = e.target as HTMLVideoElement
                      video.currentTime = 0
                    }}
                  >
                    <source src={item.url} type="video/mp4" />
                    <source src={item.url} type="video/webm" />
                    <source src={item.url} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Backup thumbnail image overlay if video poster fails */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('${getVideoPosterUrl(item.url, item.title)}')`,
                      display: 'none' // Will be shown if video poster fails
                    }}
                    id={`backup-thumb-${item.id}`}
                  />
                  
                  <div className="video-play-overlay">
                    <div className="video-play-button">
                      <Play className="video-play-icon fill-current" />
                    </div>
                  </div>
                  <Badge className="absolute top-2 left-2 bg-red-600 text-white z-10">
                    <Video className="w-3 h-3 mr-1" />
                    Video
                  </Badge>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={item.url}
                    alt={item.altText || item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.title)}`;
                    }}
                  />
                  <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    Photo
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                <span className="text-xs text-gray-500">
                  {getFileExtension(item.filename).toUpperCase()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No images found in this category</p>
        </div>
      )}
    </div>

    {/* Lightbox */}
    <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-black">
        {selectedItem && (
          <div className="relative w-full h-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
                  onClick={() => navigateLightbox("prev")}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
                  onClick={() => navigateLightbox("next")}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Media Content */}
            <div className="flex items-center justify-center w-full h-[80vh]">
              {selectedItem.type === 'video' ? (
                <video 
                  className="max-w-full max-h-full"
                  controls
                  autoPlay
                  poster={getVideoPosterUrl(selectedItem.url, selectedItem.title)}
                  preload="metadata"
                  playsInline
                  onError={(e) => {
                    console.error('Video failed to load in lightbox:', selectedItem.url)
                    // Fallback to default poster if video fails
                    const video = e.target as HTMLVideoElement
                    if (video.poster !== '/thumbnails/video-default.svg') {
                      video.poster = '/thumbnails/video-default.svg'
                    }
                  }}
                  onLoadStart={(e) => {
                    // Ensure poster is visible until video loads
                    console.log('📹 Loading video in lightbox:', selectedItem.title)
                  }}
                  onCanPlay={(e) => {
                    console.log('✅ Video ready to play:', selectedItem.title)
                  }}
                >
                  <source src={selectedItem.url} type="video/mp4" />
                  <source src={selectedItem.url} type="video/webm" />
                  <source src={selectedItem.url} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.altText || selectedItem.title}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(selectedItem.title)}`;
                  }}
                />
              )}
            </div>

            {/* Media Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
              <h3 className="text-lg font-semibold mb-1">{selectedItem.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{selectedItem.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Category: {selectedItem.category}</span>
                <span>
                  {currentIndex + 1} of {filteredImages.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Video Help Toast */}
    {showVideoHelp && (
      <div className="fixed bottom-4 right-4 bg-amber-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold mb-1">Video Gallery</h4>
            <p className="text-sm">Click on video thumbnails to play them in full screen mode.</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-amber-700 ml-2"
            onClick={() => setShowVideoHelp(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )}
  </div>
)
} 