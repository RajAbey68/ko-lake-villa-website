import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#FF914D] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ko Lake Villa</h1>
          <nav className="space-x-6">
            <Link href="#rooms" className="hover:underline">Rooms</Link>
            <Link href="#gallery" className="hover:underline">Gallery</Link>
            <Link href="#contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="/preview-image.jpg"
          alt="Ko Lake Villa pool deck at sunset"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
              Ko Lake Villa
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Your Luxury Accommodation Catalyst
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Experience boutique lakeside luxury in Ahangama, Sri Lanka with personalized service and stunning lake views.
            </p>
            <div className="space-x-4">
              <Link
                href="https://wa.me/+940711730345"
                className="bg-[#FF914D] hover:bg-[#e6822d] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Book via WhatsApp
              </Link>
              <Link
                href="mailto:info@kolakevilla.com"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Email Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ko Lake Villa</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#A0B985] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏞️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lakeside Location</h3>
              <p className="text-gray-600">Stunning views of Koggala Lake with direct access to water activities</p>
            </div>
            <div className="text-center">
              <div className="bg-[#A0B985] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Infinity Pool</h3>
              <p className="text-gray-600">Relax in our infinity pool overlooking the serene lake</p>
            </div>
            <div className="text-center">
              <div className="bg-[#A0B985] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Luxury Service</h3>
              <p className="text-gray-600">Personalized service ensuring an unforgettable stay</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-[#8B5E3C] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Experience Ko Lake Villa?</h2>
          <p className="text-xl mb-8">Contact us today for the best direct booking rates</p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <Link
              href="https://wa.me/+940711730345"
              className="bg-[#FF914D] hover:bg-[#e6822d] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              WhatsApp: +94 071 173 0345
            </Link>
            <Link
              href="mailto:info@kolakevilla.com"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#8B5E3C] px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Email: info@kolakevilla.com
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}