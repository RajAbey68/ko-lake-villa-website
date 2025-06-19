'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Ko Lake Villa
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link href="/accommodation" className="text-gray-600 hover:text-gray-800">
              Accommodation
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-gray-800">
              Gallery
            </Link>
            <Link href="/experiences" className="text-gray-600 hover:text-gray-800">
              Experiences
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-800">
              Contact
            </Link>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            <div className="w-6 h-6">
              <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-600 hover:text-gray-800 py-2">
                Home
              </Link>
              <Link href="/accommodation" className="text-gray-600 hover:text-gray-800 py-2">
                Accommodation
              </Link>
              <Link href="/gallery" className="text-gray-600 hover:text-gray-800 py-2">
                Gallery
              </Link>
              <Link href="/experiences" className="text-gray-600 hover:text-gray-800 py-2">
                Experiences
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-800 py-2">
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}