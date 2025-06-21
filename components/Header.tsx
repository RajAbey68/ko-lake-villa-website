"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
// import { useAuth } from '@/contexts/AuthContext'; // TODO: Re-integrate auth context

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // const { isAdmin } = useAuth(); // TODO: Re-integrate auth context
  const isAdmin = false; // Placeholder

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/deals', label: 'Deals' },
    { href: '/accommodation', label: 'Accommodation' },
    { href: '/dining', label: 'Dining' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className={cn(
        'fixed w-full bg-[#FDF6EE] z-50 transition-all duration-300 shadow-md',
        isScrolled ? 'py-2' : 'py-4'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="text-[#8B5E3C] font-display text-2xl md:text-3xl font-bold whitespace-nowrap">
              Ko Lake Villa
            </h1>
          </Link>
          <nav className="hidden md:flex items-center justify-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium',
                  pathname === link.href && 'text-[#FF914D]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center">
            <Link
              href="/booking"
              className="hidden md:block bg-[#FF914D] text-white px-6 py-2 rounded hover:bg-[#8B5E3C] transition-colors font-medium mr-4"
            >
              Book Now
            </Link>
            {isAdmin && (
              <Link href="/admin" className="hidden md:block text-xs border border-[#8B5E3C] px-3 py-1 rounded hover:bg-[#8B5E3C] hover:text-white transition-colors">
                Admin
              </Link>
            )}
            <button
              className="md:hidden text-[#8B5E3C] focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={cn('md:hidden overflow-hidden transition-all duration-300 ease-in-out', mobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0')}>
            <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                     <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                        'text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2',
                        pathname === link.href && 'text-[#FF914D]'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
                 <Link href="/booking" className="bg-[#FF914D] text-white px-6 py-3 rounded text-center hover:bg-[#8B5E3C] transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Book Now
                </Link>
                 {isAdmin && (
                    <Link href="/admin" className="text-sm border border-[#8B5E3C] px-4 py-2 rounded text-center hover:bg-[#8B5E3C] hover:text-white transition-colors mt-2" onClick={() => setMobileMenuOpen(false)}>
                        Admin
                    </Link>
                )}
            </nav>
        </div>
      </div>
    </header>
  )
} 