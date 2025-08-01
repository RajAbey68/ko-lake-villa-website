"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle, VisuallyHidden } from "@/components/ui/dialog"
import { ImageIcon, Video, Play, X, ChevronLeft, ChevronRight } from "lucide-react"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  category: string
  tribe?: string
}

export default function PublicGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Generate video poster URL from video URL
  const getVideoPosterUrl = (videoUrl: string, title: string) => {
    // For real implementation, you'd generate thumbnails on upload
    // For now, we'll use placeholder with video-specific styling
    const encodedTitle = encodeURIComponent(title)
    return `/placeholder.svg?height=400&width=600&text=${encodedTitle}&bg=1a1a1a&color=ffffff`
  }

  const mediaItems: MediaItem[] = [
    {
      id: "1",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Infinity+Pool",
      title: "Infinity Pool at Sunset",
      description: "Our stunning 60-foot infinity pool overlooking the tranquil lake",
      category: "Pool & Facilities",
      tribe: "Family Groups",
    },
    {
      id: "2",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Master+Bedroom",
      title: "Master Bedroom Suite",
      description: "Spacious master bedroom with lake views and ensuite bathroom",
      category: "Bedrooms",
      tribe: "Wellness & Yoga Retreats",
    },
    {
      id: "3",
      type: "video",
      url: "/placeholder.svg?height=400&width=600&text=Villa+Tour",
      title: "Complete Villa Tour",
      description: "Take a virtual tour of all our luxury amenities and spaces",
      category: "Villa Tour",
      tribe: "Digital Nomads",
    },
    {
      id: "4",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Rooftop+Yoga",
      title: "Rooftop Yoga Deck",
      description: "Perfect space for morning yoga and meditation sessions",
      category: "Outdoor Spaces",
      tribe: "Wellness & Yoga Retreats",
    },
    {
      id: "5",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Beach+Access",
      title: "Private Beach Access",
      description: "Just 300 yards to pristine beaches and surf breaks",
      category: "Local Area",
      tribe: "Surf Travellers & Beach Lovers",
    },
    {
      id: "6",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Living+Area",
      title: "Open-Air Living Space",
      description: "Spacious living area perfect for remote work and relaxation",
      category: "Living Areas",
      tribe: "Digital Nomads",
    },
  ]

  const categories = [
    "Pool & Facilities",
    "Bedrooms",
    "Living Areas",
    "Kitchen & Dining",
    "Outdoor Spaces",
    "Villa Tour",
    "Local Area",
  ]

  const filteredItems =
    selectedCategory === "all" ? mediaItems : mediaItems.filter((item) => item.category === selectedCategory)

  const openLightbox = (item: MediaItem) => {
    setSelectedItem(item)
    setCurrentIndex(filteredItems.findIndex((i) => i.id === item.id))
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
        : (currentIndex + 1) % filteredItems.length

    setCurrentIndex(newIndex)
    setSelectedItem(filteredItems[newIndex])
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
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
        
        .image-container:hover .image-content {
          transform: scale(1.05);
        }
        
        .image-content {
          transition: transform 0.3s ease;
          width: 100%;
          height: 100%;
          object-fit: cover;
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
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-amber-800 mb-4">Villa Gallery</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              Explore Ko Lake Ambalama's stunning spaces, luxury amenities, and beautiful surroundings
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          className={selectedCategory === "all" ? "bg-amber-600 hover:bg-amber-700" : ""}
        >
          All Photos
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative aspect-video bg-gray-100" onClick={() => openLightbox(item)}>
              
              {item.type === "video" ? (
                <div className="video-thumbnail-container">
                  <video 
                    className="video-thumbnail"
                    poster={getVideoPosterUrl(item.url, item.title)}
                    preload="metadata"
                    muted
                    playsInline
                  >
                    <source src={item.url} type="video/mp4" />
                    <source src={item.url} type="video/webm" />
                    <source src={item.url} type="video/ogg" />
                  </video>
                  <div className="video-play-overlay">
                    <div className="video-play-button">
                      <Play className="video-play-icon fill-current" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="image-container relative w-full h-full">
                  <img 
                    src={item.url || "/placeholder.svg"} 
                    alt={item.title} 
                    className="image-content" 
                  />
                </div>
              )}

              {/* Media Type Indicator */}
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {item.type === "image" ? <ImageIcon className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                  {item.type}
                </Badge>
              </div>

              {/* Tribe Badge */}
              {item.tribe && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-amber-600 text-white text-xs">Perfect for {item.tribe}</Badge>
                </div>
              )}

              {/* Hover Overlay for Image Info */}
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

              {/* Media Content */}
              <div className="aspect-video">
                {selectedItem.type === "image" ? (
                  <img
                    src={selectedItem.url || "/placeholder.svg"}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <video
                    src={selectedItem.url}
                    className="w-full h-full object-contain bg-black"
                    controls
                    autoPlay
                    poster={getVideoPosterUrl(selectedItem.url, selectedItem.title)}
                    preload="metadata"
                    onError={(e) => {
                      console.error('Video failed to load in lightbox:', selectedItem.url)
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const errorDiv = document.createElement('div')
                      errorDiv.className = 'flex items-center justify-center h-full text-white text-center'
                      errorDiv.innerHTML = `
                        <div>
                          <h3 class="text-xl font-semibold mb-2">Video Unavailable</h3>
                          <p class="text-gray-300">Unable to load video: ${selectedItem.title}</p>
                          <p class="text-sm text-gray-400 mt-2">Please try again later</p>
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
                      {selectedItem.tribe && (
                        <Badge className="bg-amber-100 text-amber-800">Perfect for {selectedItem.tribe}</Badge>
                      )}
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
