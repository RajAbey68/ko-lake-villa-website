'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header 
      className={`fixed w-full bg-white z-50 transition-all duration-300 shadow-md ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <h1 className="text-blue-600 text-2xl md:text-3xl font-bold">Ko Lake Villa</h1>
        </Link>

        <div className="flex items-center space-x-4">
          <Link 
            href="https://wa.me/94771234567" 
            className="hidden md:block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors font-medium"
          >
            Book Now
          </Link>

          <button 
            className="md:hidden text-blue-600 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav className="hidden md:flex items-center justify-center space-x-8 mt-4 border-t pt-4">
        <Link 
          href="/" 
          className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${
            pathname === '/' ? 'text-blue-600' : ''
          }`}
        >
          Home
        </Link>
        <Link 
          href="/accommodation" 
          className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${
            pathname === '/accommodation' ? 'text-blue-600' : ''
          }`}
        >
          Accommodation
        </Link>
        <Link 
          href="/gallery" 
          className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${
            pathname === '/gallery' ? 'text-blue-600' : ''
          }`}
        >
          Gallery
        </Link>
        <Link 
          href="/experiences" 
          className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${
            pathname === '/experiences' ? 'text-blue-600' : ''
          }`}
        >
          Experiences
        </Link>
        <Link 
          href="/contact" 
          className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${
            pathname === '/contact' ? 'text-blue-600' : ''
          }`}
        >
          Contact
        </Link>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute w-full left-0 top-full shadow-md border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 ${
                pathname === '/' ? 'text-blue-600' : ''
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/accommodation" 
              className={`text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 ${
                pathname === '/accommodation' ? 'text-blue-600' : ''
              }`}
              onClick={closeMobileMenu}
            >
              Accommodation
            </Link>
            <Link 
              href="/gallery" 
              className={`text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 ${
                pathname === '/gallery' ? 'text-blue-600' : ''
              }`}
              onClick={closeMobileMenu}
            >
              Gallery
            </Link>
            <Link 
              href="/experiences" 
              className={`text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 ${
                pathname === '/experiences' ? 'text-blue-600' : ''
              }`}
              onClick={closeMobileMenu}
            >
              Experiences
            </Link>
            <Link 
              href="/contact" 
              className={`text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 ${
                pathname === '/contact' ? 'text-blue-600' : ''
              }`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            <Link 
              href="https://wa.me/94771234567" 
              className="bg-green-600 text-white px-6 py-3 rounded text-center hover:bg-green-700 transition-colors font-medium"
              onClick={closeMobileMenu}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}