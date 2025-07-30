"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, LogIn, LogOut, Settings, Shield, Phone, Mail, User } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface UserInterface {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "staff" | "collaborator"
}

export default function GlobalHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserInterface | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Don't show GlobalHeader on admin pages - let admin layout handle navigation
  if (pathname.startsWith('/admin')) {
    return null
  }

  const navigationItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "accommodation", label: "Accommodation", href: "/accommodation" },
    { id: "dining", label: "Dining", href: "/dining" },
    { id: "experiences", label: "Experiences", href: "/experiences" },
    { id: "gallery", label: "Gallery", href: "/gallery" },
    { id: "contact", label: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    // Check for existing authentication
    const authData = localStorage.getItem("userAuth")
    if (authData) {
      try {
        const userData = JSON.parse(authData)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing auth data:", error)
        localStorage.removeItem("userAuth")
      }
    }
  }, [])

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    // Simulate Google OAuth flow
    try {
      // In production, this would integrate with Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockUser: UserInterface = {
        id: "google_123",
        name: "John Doe",
        email: "john@kolakevilla.com",
        avatar: "/placeholder.svg?height=40&width=40&text=JD",
        role: "staff",
      }

      setUser(mockUser)
      localStorage.setItem("userAuth", JSON.stringify(mockUser))

      // Redirect based on role
      if (mockUser.role === "admin") {
        router.push("/admin/dashboard")
      }
    } catch (error) {
      console.error("Google login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = () => {
    router.push("/admin")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("userAuth")
    localStorage.removeItem("adminAuth")
    router.push("/")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "staff":
        return "bg-blue-100 text-blue-800"
      case "collaborator":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <header className="nav-header">
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            <h1 className="nav-logo-text">Ko Lake Villa</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <div className="nav-menu">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`nav-link ${
                    pathname === item.href || (item.href === "/" && pathname === "/")
                      ? "nav-link-active"
                      : "nav-link-inactive"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Side - Auth & Actions */}
          <div className="nav-actions">
            {/* Contact Info (Desktop) */}
            <div className="nav-contact-info">
              <a href="tel:+94711730345" className="nav-contact-link">
                <Phone className="w-4 h-4" />
                <span>+94711730345</span>
              </a>
              <a href="mailto:contact@KoLakeHouse.com" className="nav-contact-link">
                <Mail className="w-4 h-4" />
                <span>contact@KoLakeHouse.com</span>
              </a>
            </div>

            {/* Book Now Button */}
            <Button
              onClick={() => window.open("https://www.guesty.com/ko-lake-villa", "_blank")}
              className="nav-book-button"
            >
              Book Now
            </Button>

            {/* Authentication */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-amber-100 text-amber-800">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex flex-col space-y-2 p-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Badge className={`${getRoleColor(user.role)} text-xs w-fit`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                  <DropdownMenuSeparator />

                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="nav-staff-login hidden sm:flex"
                    disabled={isLoading}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {isLoading ? "Signing in..." : "Staff Login"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">Staff & Collaborator Access</p>
                    <p className="text-xs text-gray-500 mb-3">Sign in to access admin tools and management features</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleGoogleLogin} disabled={isLoading}>
                    <div className="flex items-center space-x-2 w-full">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span>Continue with Google</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEmailLogin}>
                    <Mail className="mr-2 h-4 w-4" />
                    Sign in with Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="nav-mobile-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="nav-mobile">
            <nav className="nav-mobile-menu">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-mobile-link ${
                    pathname === item.href || (item.href === "/" && pathname === "/")
                      ? "nav-mobile-link-active"
                      : "nav-mobile-link-inactive"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Contact Info */}
              <div className="nav-mobile-contact">
                <a href="tel:+94711730345" className="nav-mobile-contact-link">
                  <Phone className="w-4 h-4" />
                  <span>+94711730345</span>
                </a>
                <a href="mailto:contact@KoLakeHouse.com" className="nav-mobile-contact-link">
                  <Mail className="w-4 h-4" />
                  <span>contact@KoLakeHouse.com</span>
                </a>
              </div>

              {/* Mobile Book Now */}
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  window.open("https://www.guesty.com/ko-lake-villa", "_blank")
                }}
                className="nav-mobile-book"
              >
                Book Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
