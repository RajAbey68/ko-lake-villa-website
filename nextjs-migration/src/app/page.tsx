import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ko Lake Villa - Luxury Accommodation by Koggala Lake, Sri Lanka',
  description: 'Experience luxury accommodation at Ko Lake Villa by serene Koggala Lake. Perfect for families and groups. Book direct for best rates.',
  keywords: 'Ko Lake Villa, Koggala Lake accommodation, Sri Lanka villa rental, luxury accommodation Sri Lanka',
  openGraph: {
    title: 'Ko Lake Villa - Luxury Accommodation by Koggala Lake',
    description: 'Experience luxury accommodation at Ko Lake Villa by serene Koggala Lake. Perfect for families and groups.',
    url: 'https://kolakevilla.com',
    siteName: 'Ko Lake Villa',
    images: [
      {
        url: 'https://kolakevilla.com/hero-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ko Lake Villa
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Luxury accommodation by the serene Koggala Lake in southern Sri Lanka
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="https://wa.me/94771234567"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300"
            >
              WhatsApp Booking
            </Link>
            <Link 
              href="mailto:info@kolakevilla.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300"
            >
              Email Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Prime Location</h3>
              <p className="text-gray-600">
                Nestled by the tranquil Koggala Lake with stunning water views
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Multiple Options</h3>
              <p className="text-gray-600">
                From entire villa to individual rooms, perfect for any group size
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Authentic Experience</h3>
              <p className="text-gray-600">
                Immerse in Sri Lankan culture with modern luxury amenities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Accommodation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Entire Villa (KLV)</h3>
                <p className="text-gray-600 mb-4">7 rooms, up to 18 guests</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">From $450</span>
                  <Link href="/accommodation" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Master Suite (KLV1)</h3>
                <p className="text-gray-600 mb-4">Perfect for families, 6+ guests</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">From $180</span>
                  <Link href="/accommodation" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Group Room (KLV6)</h3>
                <p className="text-gray-600 mb-4">Ideal for groups, 6+ guests</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">From $120</span>
                  <Link href="/accommodation" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Twin Rooms (KLV3)</h3>
                <p className="text-gray-600 mb-4">Cozy rooms for 3+ guests</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">From $80</span>
                  <Link href="/accommodation" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Ko Lake Villa?</h2>
          <p className="text-xl mb-8">Book directly for the best rates and personalized service</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="https://wa.me/94771234567"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300"
            >
              WhatsApp Us Now
            </Link>
            <Link 
              href="/contact"
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition duration-300"
            >
              Send Inquiry
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}