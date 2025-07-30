"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationItem {
  id: string
  label: string
  href: string
}

interface MobileMenuProps {
  navigationItems?: NavigationItem[]
}

export function MobileMenu({ navigationItems = defaultNavigationItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="nav-mobile-button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 nav-mobile">
          <nav className="nav-mobile-menu">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`nav-mobile-link ${
                  pathname === item.href || (item.href === "/" && pathname === "/")
                    ? "nav-mobile-link-active"
                    : "nav-mobile-link-inactive"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

// Default navigation items if none provided
const defaultNavigationItems: NavigationItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "accommodation", label: "Accommodation", href: "/accommodation" },
  { id: "dining", label: "Dining", href: "/dining" },
  { id: "experiences", label: "Experiences", href: "/experiences" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "contact", label: "Contact", href: "/contact" },
]
