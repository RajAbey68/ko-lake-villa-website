import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "deals", label: "Deals", href: "/deals" },
    { id: "accommodation", label: "Accommodation", href: "/accommodation" },
    { id: "dining", label: "Dining", href: "/dining" },
    { id: "experiences", label: "Experiences", href: "/experiences" },
    { id: "gallery", label: "Gallery", href: "/gallery" },
    { id: "faq", label: "FAQ", href: "/faq" },
    { id: "contact", label: "Contact", href: "/contact" },
  ];

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
                  className={cn(
                    "nav-link",
                    location === item.href ? "nav-link-active" : "nav-link-inactive"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="nav-actions">
            {/* Book Now Button */}
            <Link 
              href="/booking" 
              className="nav-book-button"
            >
              Book Now
            </Link>

            {isAdmin && (
              <Link 
                href="/admin" 
                className="hidden sm:block text-amber-700 text-xs border border-amber-700 px-3 py-1 rounded hover:bg-amber-700 hover:text-white transition-colors font-medium"
              >
                Admin
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="nav-mobile-button" 
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="nav-mobile">
            <nav className="nav-mobile-menu">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "nav-mobile-link",
                    location === item.href ? "nav-mobile-link-active" : "nav-mobile-link-inactive"
                  )}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Book Now */}
              <Link
                href="/booking"
                className="nav-mobile-book"
                onClick={closeMobileMenu}
              >
                Book Now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;