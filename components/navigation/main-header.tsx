"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type PageKey = "home" | "accommodation" | "dining" | "experiences" | "gallery" | "contact"

export default function MainHeader({ currentPage }: { currentPage?: PageKey }) {
  const pathname = usePathname()

  const items = [
    { href: "/", label: "Home", id: "home" },
    { href: "/accommodation", label: "Accommodation", id: "accommodation" },
    { href: "/dining", label: "Dining", id: "dining" },
    { href: "/experiences", label: "Experiences", id: "experiences" },
    { href: "/gallery", label: "Gallery", id: "gallery" },
    { href: "/contact", label: "Contact", id: "contact" },
  ] as const

  const isActive = (href: string, id: PageKey | undefined) => {
    if (id && currentPage === id) return true
    return pathname === href
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-amber-800">Ko Lake Villa</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={
                  isActive(item.href, item.id as PageKey)
                    ? "text-orange-500 font-medium"
                    : "text-amber-700 hover:text-orange-500 transition-colors"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

// (Removed duplicate component and logo image to prevent runtime errors)
