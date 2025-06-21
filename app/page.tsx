"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
// TODO: Re-implement useQuery to fetch dynamic data for rooms, testimonials, and activities
// For now, using static placeholder data.
// import { useQuery } from '@tanstack/react-query'

// TODO: Replace with a valid image path from the /public directory
const heroPoolImage = "/hero-pool-image.png"

export const metadata: Metadata = {
  title: "Ko Lake Villa | Your Luxury Accommodation Catalyst",
  description: "Experience boutique lakeside luxury in Ahangama, Sri Lanka with personalized service and stunning lake views. Your luxury accommodation catalyst for unforgettable memories.",
  keywords: "Ko Lake Villa, Ahangama accommodation, Galle villa, Sri Lanka lakefront, Koggala Lake, boutique villa, family suite, group accommodation, infinity pool, direct booking, luxury villa Sri Lanka",
}

export default function HomePage() {

  // Placeholder data to match the original component's structure
  const roomsLoading = true;
  const rooms = []; 
  const testimonialsLoading = true;
  const testimonials = [];
  const activitiesLoading = true;
  const activities = [
    { id: 1, name: "Koggala Lake Safari", description: "Private boat tours through pristine mangrove islands.", imageUrl: "/placeholder.svg?height=300&width=400&text=Lake Safari" },
    { id: 2, name: "Whale Watching", description: "Encounter majestic blue whales in Mirissa waters.", imageUrl: "/placeholder.svg?height=300&width=400&text=Whale Watching" },
    { id: 3, name: "Cultural Immersion", description: "Traditional stilt fishing and local artisan visits.", imageUrl: "/placeholder.svg?height=300&width=400&text=Cultural Experience" },
  ];

  return (
    <>
      {/* SEO Head component content will be handled by Next.js Head in layout.tsx */}
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image and Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroPoolImage}
            alt="Stunning sunset pool view at Ko Lake Villa"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl text-white font-display font-light mb-3 tracking-wider">Ko Lake Villa</h1>
          <p className="text-base md:text-lg text-white mb-8 font-light opacity-90">Relax. Revive. Reconnect by the Lake in Ahangama, Sri Lanka.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/gallery" className="bg-white bg-opacity-10 backdrop-blur-sm text-white px-5 py-2 rounded-full border border-white border-opacity-30 hover:bg-opacity-20 transition-all text-sm font-light">
              View Gallery
            </Link>
            <Link href="/contact" className="bg-transparent text-white px-5 py-2 rounded-full border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10 transition-all text-sm font-light">
              Request Info
            </Link>
            <Link href="/accommodation" className="bg-white bg-opacity-15 backdrop-blur-sm text-white px-5 py-2 rounded-full border border-white border-opacity-40 hover:bg-opacity-25 transition-all text-sm font-medium">
              Book Direct – Save 10%
            </Link>
          </div>
        </div>
      </section>

      {/* Ko Lake Theme Showcase */}
      <section className="kolake-theme py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="kolake-heading text-3xl md:text-4xl font-display font-bold mb-4">Discover Tranquility</h2>
            <p className="text-lg text-gray-700 mb-8">Experience the Ko Lake Villa lifestyle on your terms</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/booking" className="kolake-btn primary">Book Direct – Save 10%</Link>
              <Link href="/experiences" className="kolake-btn accent">Explore Experiences</Link>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="kolake-card text-center">
              <i className="fas fa-leaf text-4xl mb-4" style={{color: 'var(--kolake-accent)'}}></i>
              <h3 className="kolake-heading text-xl font-bold mb-2">Tropical Paradise</h3>
              <p>Immerse yourself in the natural beauty of Ahangama's lakeside setting</p>
            </div>
            <div className="kolake-card text-center">
              <i className="fas fa-crown text-4xl mb-4" style={{color: 'var(--kolake-primary)'}}></i>
              <h3 className="kolake-heading text-xl font-bold mb-2">Luxury Experience</h3>
              <p>Indulge in premium amenities and personalized Sri Lankan hospitality</p>
            </div>
            <div className="kolake-card text-center">
              <i className="fas fa-heart text-4xl mb-4" style={{color: 'var(--kolake-secondary)'}}></i>
              <h3 className="kolake-heading text-xl font-bold mb-2">Authentic Connection</h3>
              <p>Connect with local culture and create lasting memories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-[#FDF6EE]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-6">Welcome to Lakeside Luxury</h2>
              <p className="text-[#8B5E3C] mb-6 leading-relaxed">Ko Lake Villa is a boutique accommodation nestled on the shores of a serene lake in Ahangama, Galle, offering a perfect blend of luxury, comfort, and natural beauty. Our villa provides an exclusive retreat for travelers seeking tranquility and authentic Sri Lankan elegance.</p>
              <p className="text-[#8B5E3C] mb-6 leading-relaxed">With spectacular views, personalized service, and attention to detail, we create memorable experiences for our guests - whether you're planning a family vacation, a romantic getaway, or a wellness retreat.</p>
              <div className="flex space-x-6 mt-8">
                <div className="text-center">
                  <i className="fas fa-bed text-[#FF914D] text-3xl mb-2"></i>
                  <p className="text-[#8B5E3C] font-medium">Luxurious Rooms</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-utensils text-[#FF914D] text-3xl mb-2"></i>
                  <p className="text-[#8B5E3C] font-medium">Gourmet Dining</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-swimming-pool text-[#FF914D] text-3xl mb-2"></i>
                  <p className="text-[#8B5E3C] font-medium">Lake Access</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              {/* TODO: This is an external image. It should be downloaded and served locally. */}
              <img 
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=503,h=464,fit=crop/AGB2Mlr1kBCLQG4w/4-3--min-AoPWZwGn9yH5QvLd.jpg" 
                alt="Ko Lake House interior" 
                className="rounded-lg shadow-lg w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Property Section */}
      <section className="py-20 bg-[#FDF6EE]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-4">Our Property</h2>
            <p className="text-[#8B5E3C] max-w-3xl mx-auto">Discover Ko Lake Villa - an exclusive lakefront retreat with stunning infinity pool, rooftop terraces, and panoramic views of Koggala Lake and Madol Duwa Island.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale">
               {/* TODO: Replace with local images from /public directory */}
              <img 
                src="/placeholder.svg?height=256&width=400&text=Infinity Pool"
                alt="Ko Lake Villa Infinity Pool"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-[#8B5E3C] mb-2">60-ft Infinity Pool</h3>
                <p className="text-[#8B5E3C] mb-4">Stunning lakefront infinity pool with panoramic views of Koggala Lake</p>
                <Link href="/gallery" className="text-[#8B5E3C] font-medium hover:underline">
                  View Photo Gallery →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale">
              <img 
                src="/placeholder.svg?height=256&width=400&text=Rooftop Terrace"
                alt="Ko Lake Villa Rooftop Terrace"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-[#8B5E3C] mb-2">Rooftop Terrace</h3>
                <p className="text-[#8B5E3C] mb-4">360° views of lake, paddy fields, and Madol Duwa Island</p>
                <div className="flex flex-wrap">
                  <span className="bg-[#E6D9C7] text-[#8B5E3C] px-2 py-1 rounded text-sm mr-2 mb-2">5 Triple Rooms + 2 Suites</span>
                  <span className="bg-[#E6D9C7] text-[#8B5E3C] px-2 py-1 rounded text-sm mr-2 mb-2">Lakefront</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg overflow-hidden shadow-lg border-2 border-green-200">
              <div className="p-6">
                <div className="text-center mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">SPECIAL OFFER</span>
                </div>
                <h3 className="text-xl font-display font-bold text-[#8B5E3C] mb-2 text-center">Late Booking Deals</h3>
                <p className="text-[#8B5E3C] mb-4 text-center">Book within 3 days of check-in</p>
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-green-600">15% OFF</span>
                  <p className="text-sm text-[#8B5E3C]">Instead of regular 10% discount</p>
                </div>
                <div className="space-y-2 text-sm text-[#8B5E3C]">
                  <div className="flex justify-between">
                    <span>Entire Villa:</span>
                    <span className="font-bold text-green-600">From $366</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Family Suite:</span>
                    <span className="font-bold text-green-600">From $101</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/accommodation" className="inline-block bg-[#8B5E3C] text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#7A5232] transition-colors shadow-lg">
              Book Now - Direct Booking Saves 10%
            </Link>
            <p className="text-[#8B5E3C] mt-4">No booking fees • Best rate guarantee • Direct support</p>
          </div>
        </div>
      </section>

      {/* Activities Section Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-4">Activities & Experiences</h2>
            <p className="text-[#8B5E3C] max-w-3xl mx-auto">Discover the natural beauty and cultural richness of the surrounding area with our curated activities and experiences.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activitiesLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                  <div className="w-full h-56 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : (
              activities?.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale">
                  <Image
                    src={activity.imageUrl}
                    alt={activity.name}
                    width={400}
                    height={225}
                    className="w-full h-56 object-cover" 
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-[#8B5E3C] mb-2">{activity.name}</h3>
                    <p className="text-[#8B5E3C] mb-4">{activity.description}</p>
                    <Link href="/experiences" className="text-[#FF914D] hover:text-[#8B5E3C] transition-colors font-medium">
                      Learn More <i className="fas fa-arrow-right ml-1"></i>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-[#FDF6EE]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#8B5E3C] mb-4">What Our Guests Say</h2>
            <p className="text-[#8B5E3C] max-w-3xl mx-auto">Our commitment to excellence is reflected in the words of our guests.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* // TODO: Fetch and map testimonials */}
             {testimonialsLoading ? (
                <p>Loading testimonials...</p>
             ) : (
                <p className="text-center col-span-full">Testimonials will be displayed here.</p>
             )}
          </div>
        </div>
      </section>
    </>
  )
}
