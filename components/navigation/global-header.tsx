"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, LogOut, Settings, Shield, Phone, Mail, User } from "lucide-react"

export default function GlobalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Don't show GlobalHeader on admin pages - let admin layout handle navigation
  if (pathname?.startsWith('/admin')) {
    return null
  }

  useEffect(() => {
    const checkAuth = () => {
      const userAuth = localStorage.getItem("userAuth")
      if (userAuth) {
        try {
          const userData = JSON.parse(userAuth)
          setIsAuthenticated(true)
          setUserInfo(userData)
        } catch (error) {
          console.error("Error parsing user auth:", error)
          setIsAuthenticated(false)
          setUserInfo(null)
        }
      } else {
        setIsAuthenticated(false)
        setUserInfo(null)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    router.push('/admin/login')
  }

  const handleLogout = () => {
    localStorage.removeItem("userAuth")
    setIsAuthenticated(false)
    setUserInfo(null)
    router.push('/')
  }

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/accommodation", label: "Accommodation" },
    { href: "/gallery", label: "Gallery" },
    { href: "/experiences", label: "Experiences" },
    { href: "/dining", label: "Dining" },
    { href: "/deals", label: "Deals" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ]

  const contactItems = [
    { href: "tel:+94717765780", label: "Call Manager", icon: Phone },
    { href: "mailto:contact@KoLakeHouse.com", label: "Email", icon: Mail },
  ]

  return (
    <>
      <style jsx>{`
        .villa-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 0.5rem 1rem;
        }

        .villa-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 0.25rem;
          min-height: 46px;
          padding: 6px 0;
          flex-wrap: nowrap;
          width: 100%;
          max-width: 100%;
        }

        .villa-thumbnail {
          height: 40px;
          width: auto;
          max-width: 120px;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .villa-title {
          font-size: 1.4rem;
          font-weight: bold;
          color: #92400e; /* amber-700 to match your brand */
          margin: 0;
          line-height: 1;
          white-space: nowrap;
        }

        .villa-navbar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
        }

        .villa-nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .villa-nav-link {
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .villa-nav-link:hover {
          color: #92400e;
        }

        .villa-nav-link.active {
          color: #92400e;
          font-weight: 600;
        }

        .villa-mobile-menu {
          display: none;
        }

        .villa-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .villa-nav-links {
            display: none;
          }
          
          .villa-mobile-menu {
            display: block;
          }
          
          .villa-navbar {
            justify-content: flex-end;
          }
        }

        /* Tablet and mobile optimizations */
        @media (max-width: 768px) {
          .villa-header {
            padding: 0.4rem 0.75rem;
          }
          
          .villa-title {
            font-size: 1.1rem;
          }
          
          .villa-thumbnail {
            height: 32px;
            max-width: 80px;
          }
          
          .villa-brand {
            gap: 10px;
            margin-bottom: 0.2rem;
            min-height: 40px;
            padding: 4px 0;
          }
        }
        
        /* Small mobile phones */
        @media (max-width: 480px) {
          .villa-header {
            padding: 0.3rem 0.5rem;
          }
          
          .villa-title {
            font-size: 1rem;
          }
          
          .villa-thumbnail {
            height: 28px;
            max-width: 70px;
          }
          
          .villa-brand {
            gap: 8px;
            margin-bottom: 0.15rem;
            min-height: 36px;
            padding: 3px 0;
          }
        }
        
        /* Extra small screens */
        @media (max-width: 360px) {
          .villa-title {
            font-size: 0.9rem;
          }
          
          .villa-thumbnail {
            height: 26px;
            max-width: 60px;
          }
          
          .villa-brand {
            gap: 6px;
            min-height: 32px;
          }
        }
      `}</style>
      
      <header className="villa-header">
        <div className="villa-brand">
          <Link href="/" className="flex items-center">
            <Image
              src="/uploads/gallery/koggala-lake/KoggalaNinePeaks_koggala-lake_0.jpg"
              alt="Ko Lake Villa - Traditional Sala by the Lake" 
              width={40}
              height={40}
              className="villa-thumbnail"
              priority
              sizes="(max-width: 768px) 32px, (max-width: 480px) 28px, 40px"
            />
            <h1 className="villa-title">Ko Lake Villa</h1>
          </Link>
        </div>
        
        <nav className="villa-navbar">
          {/* Desktop Navigation Links */}
          <div className="villa-nav-links">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`villa-nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="villa-actions">
            {/* Contact Actions - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {contactItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 hover:text-amber-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Auth Actions */}
            {isAuthenticated && userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{userInfo.name || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/admin/dashboard')} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} variant="ghost" size="sm" className="hidden sm:flex">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
              className="villa-mobile-menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden w-full mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`villa-nav-link ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Contact Actions */}
              <div className="flex gap-4 pt-2 border-t border-gray-100">
                {contactItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-amber-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Mobile Auth */}
              {!isAuthenticated && (
                <Button onClick={() => { handleLogin(); setIsMenuOpen(false) }} variant="ghost" size="sm" className="justify-start">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
