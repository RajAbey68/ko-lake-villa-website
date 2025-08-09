"use client"

import PublicGallery from '@/components/public-gallery'

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Ko Lake Villa Gallery</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our beautiful lakefront villa, stunning views, and luxury amenities
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="py-8">
        <PublicGallery />
      </div>
    </div>
  )
} 