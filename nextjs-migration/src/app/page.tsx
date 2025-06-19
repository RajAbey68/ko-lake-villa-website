import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ko Lake Villa - Luxury Accommodation by Koggala Lake',
  description: 'Discover Ko Lake Villa, a premium accommodation experience nestled by the tranquil Koggala Lake in southern Sri Lanka.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Ko Lake Villa
        </h1>
        <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto">
          Experience luxury accommodation by the serene Koggala Lake in southern Sri Lanka. 
          Our villa offers the perfect retreat for families and groups seeking comfort and tranquility.
        </p>
      </div>
    </main>
  )
}