"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import useSWR from 'swr'
import axios from 'axios'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

// Helper to format category names
const formatCategoryName = (name: string) => {
  return name.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Fetch categories and images from API
  const { data: categories = [], isLoading: loadingCategories, error: errorCategories } = useSWR<string[]>('/api/gallery/categories', fetcher)
  const { data: galleryData, isLoading: loadingImages, error: errorImages } = useSWR<Record<string, string[]>>('/api/gallery', fetcher)

  // Flatten images for 'all' view and add title
  const allImages = galleryData
    ? Object.entries(galleryData).flatMap(([category, images]) => 
        images.map(src => ({ 
          category, 
          src,
          title: formatCategoryName(src.split('/').pop()?.split('.')[0] ?? 'Gallery Image') 
        }))
      )
    : []

  const filteredImages =
    selectedCategory === "all"
      ? allImages
      : allImages.filter(img => img.category === selectedCategory)

  // Loading and error states
  if (loadingCategories || loadingImages) {
    return <div className="min-h-screen flex items-center justify-center">Loading gallery...</div>
  }
  if (errorCategories || errorImages) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Failed to load gallery. Please try again later.</div>
  }

  const openLightbox = (imageSrc: string, index: number) => {
    setLightboxImage(imageSrc)
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % filteredImages.length
    setLightboxIndex(nextIndex)
    setLightboxImage(filteredImages[nextIndex].src)
  }

  const prevImage = () => {
    const prevIndex = lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1
    setLightboxIndex(prevIndex)
    setLightboxImage(filteredImages[prevIndex].src)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-amber-800">
              Ko Lake Villa
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-amber-700 hover:text-orange-500">
                Home
              </Link>
              <Link href="/accommodation" className="text-amber-700 hover:text-orange-500">
                Accommodation
              </Link>
              <Link href="/dining" className="text-amber-700 hover:text-orange-500">
                Dining
              </Link>
              <Link href="/experiences" className="text-amber-700 hover:text-orange-500">
                Experiences
              </Link>
              <Link href="/gallery" className="text-orange-500 font-medium">
                Gallery
              </Link>
              <Link href="/contact" className="text-amber-700 hover:text-orange-500">
                Contact
              </Link>
            </div>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-amber-900 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Explore the beauty of Ko Lake Villa through our comprehensive photo gallery. From luxurious interiors to
            stunning lake views, see what makes us special.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Filter className="w-6 h-6 mr-2" />
              Filter Photos
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredImages.length} of {allImages.length} photos
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              key="all"
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              All Photos
            </Button>
            {categories?.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {formatCategoryName(category)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.src}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(image.src, index)}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No images found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <Image
              src={lightboxImage || "/placeholder.svg"}
              alt={filteredImages[lightboxIndex]?.title || "Gallery image"}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <h3 className="font-semibold mb-2">{filteredImages[lightboxIndex]?.title}</h3>
              <p className="text-sm opacity-90">
                {lightboxIndex + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience This Paradise?</h2>
          <p className="text-xl mb-8">Book your stay at Ko Lake Villa and create your own unforgettable memories.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50" asChild>
              <Link href="/booking">Book Your Stay</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-amber-900"
              asChild
            >
              <Link href="/accommodation">View Room Options</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
