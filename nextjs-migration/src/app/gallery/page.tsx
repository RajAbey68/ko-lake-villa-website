import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery - Ko Lake Villa',
  description: 'Explore our photo gallery showcasing the beauty of Ko Lake Villa and the surrounding Koggala Lake area.',
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Photo Gallery
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg">
              {/* Gallery images will be loaded here */}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}