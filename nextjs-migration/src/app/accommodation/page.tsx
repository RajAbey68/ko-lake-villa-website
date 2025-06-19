import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accommodation - Ko Lake Villa',
  description: 'Discover our luxury accommodations at Ko Lake Villa, offering various room options for couples, families, and groups.',
}

export default function AccommodationPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Our Accommodation
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Entire Villa (KLV)</h3>
              <p className="text-gray-600 mb-4">
                Perfect for large groups and families, accommodating up to 18 guests across 7 rooms.
              </p>
              <div className="text-lg font-bold text-blue-600">From $XXX/night</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Master Family Suite (KLV1)</h3>
              <p className="text-gray-600 mb-4">
                Spacious family suite accommodating 6+ guests with premium amenities.
              </p>
              <div className="text-lg font-bold text-blue-600">From $XXX/night</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Group Room (KLV6)</h3>
              <p className="text-gray-600 mb-4">
                Ideal for groups of 6+ guests seeking comfort and convenience.
              </p>
              <div className="text-lg font-bold text-blue-600">From $XXX/night</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}