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

  return (
    <header 
      className={cn(
        "fixed w-full bg-[#FDF6EE] z-50 transition-all duration-300 header-shadow",
        isScrolled ? "py-2" : "py-4"
      )}
    >
      {/* Top section with logo and book now button */}
      <div className="container mx-auto px-4 flex items-center justify-between border-b border-[#A0B985] pb-2 mb-2">
        <Link href="/" className="flex items-center">
          <h1 className="text-[#8B5E3C] font-display text-2xl md:text-3xl font-bold whitespace-nowrap">Ko Lake Villa</h1>
        </Link>

        {/* Mobile Menu Button */}
        <div className="flex items-center">
          <Link 
            href="/booking" 
            className="hidden md:block bg-[#FF914D] text-white px-6 py-2 rounded hover:bg-[#8B5E3C] transition-colors font-medium mr-2"
          >
            Book Now
          </Link>

          {isAdmin && (
            <Link 
              href="/admin" 
              className="hidden md:block text-[#8B5E3C] text-xs border border-[#8B5E3C] px-3 py-1 rounded hover:bg-[#8B5E3C] hover:text-white transition-colors font-medium mr-2"
            >
              Admin
            </Link>
          )}

          <button 
            className="md:hidden text-[#8B5E3C] focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Bottom section with navigation */}
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8">
          <Link 
            href="/" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/' && "text-[#FF914D]"
            )}
          >
            Home
          </Link>
          <Link 
            href="/deals" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/deals' && "text-[#FF914D]"
            )}
          >
            Deals
          </Link>
          <Link 
            href="/accommodation" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/accommodation' && "text-[#FF914D]"
            )}
          >
            Accommodation
          </Link>
          <Link 
            href="/dining" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/dining' && "text-[#FF914D]"
            )}
          >
            Dining
          </Link>
          <Link 
            href="/experiences" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/experiences' && "text-[#FF914D]"
            )}
          >
            Experiences
          </Link>
          <Link 
            href="/gallery" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/gallery' && "text-[#FF914D]"
            )}
          >
            Gallery
          </Link>
          <Link 
            href="/faq" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/faq' && "text-[#FF914D]"
            )}
          >
            FAQ
          </Link>
          <Link 
            href="/contact" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/contact' && "text-[#FF914D]"
            )}
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={cn(
          "md:hidden bg-[#FDF6EE] absolute w-full left-0 top-20 shadow-md transition-all duration-300",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link 
            href="/" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link 
            href="/deals" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/deals' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            Deals
          </Link>
          <Link 
            href="/accommodation" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/accommodation' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            Accommodation
          </Link>
          <Link 
            href="/dining" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/dining' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            Dining
          </Link>
          <Link 
            href="/experiences" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/experiences' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            Experiences
          </Link>
          <Link 
            href="/gallery" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/gallery' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            Gallery
          </Link>
          <Link 
            href="/faq" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/faq' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            FAQ
          </Link>
          <Link 
            href="/contact" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/contact' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            Contact
          </Link>
          <Link 
            href="/booking" 
            className="bg-[#FF914D] text-white px-6 py-3 rounded text-center hover:bg-[#8B5E3C] transition-colors font-medium"
            onClick={closeMobileMenu}
          >
            Book Now
          </Link>

          {isAdmin && (
            <Link 
              href="/admin" 
              className="text-[#8B5E3C] text-sm border border-[#8B5E3C] px-4 py-2 rounded text-center hover:bg-[#8B5E3C] hover:text-white transition-colors mt-2"
              onClick={closeMobileMenu}
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;