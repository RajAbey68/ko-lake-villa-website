import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Experiences - Ko Lake Villa',
  description: 'Discover amazing local experiences around Koggala Lake including boat safaris, cultural tours, and water activities.',
}

export default function ExperiencesPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Local Experiences
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Koggala Lake Boat Safari</h3>
              <p className="text-gray-600 mb-4">
                Explore the pristine waters of Koggala Lake and discover its rich biodiversity.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Traditional Fishing</h3>
              <p className="text-gray-600 mb-4">
                Experience authentic Sri Lankan fishing techniques with local fishermen.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Cultural Village Tour</h3>
              <p className="text-gray-600 mb-4">
                Immerse yourself in local culture and traditions of rural Sri Lanka.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}