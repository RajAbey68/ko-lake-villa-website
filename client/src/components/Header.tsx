import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const Header = () => {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
        "fixed w-full bg-white z-50 transition-all duration-300 header-shadow",
        isScrolled ? "py-2" : "py-4"
      )}
    >
      {/* Top section with logo and book now button */}
      <div className="container mx-auto px-4 flex items-center justify-between border-b pb-2 mb-2">
        <Link href="/" className="flex items-center">
          <h1 className="text-[#1E4E5F] font-display text-2xl md:text-3xl font-bold whitespace-nowrap">Ko Lake Villa</h1>
        </Link>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center">
          <Link 
            href="/booking" 
            className="hidden md:block bg-[#E8B87D] text-white px-6 py-2 rounded hover:bg-[#1E4E5F] transition-colors font-medium mr-4"
          >
            Book Now
          </Link>
          
          <button 
            className="md:hidden text-[#1E4E5F] focus:outline-none" 
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
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium",
              location === '/' && "text-[#E8B87D]"
            )}
          >
            Home
          </Link>
          <Link 
            href="/accommodation" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium",
              location === '/accommodation' && "text-[#E8B87D]"
            )}
          >
            Accommodation
          </Link>
          <Link 
            href="/dining" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium",
              location === '/dining' && "text-[#E8B87D]"
            )}
          >
            Dining
          </Link>
          <Link 
            href="/experiences" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium",
              location === '/experiences' && "text-[#E8B87D]"
            )}
          >
            Experiences
          </Link>
          <Link 
            href="/gallery" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium",
              location === '/gallery' && "text-[#E8B87D]"
            )}
          >
            Gallery
          </Link>
          <Link 
            href="/contact" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium",
              location === '/contact' && "text-[#E8B87D]"
            )}
          >
            Contact
          </Link>
        </nav>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={cn(
          "md:hidden bg-white absolute w-full left-0 top-20 shadow-md transition-all duration-300",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link 
            href="/" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium py-2",
              location === '/' && "text-[#E8B87D]"
            )}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link 
            href="/accommodation" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium py-2",
              location === '/accommodation' && "text-[#E8B87D]"
            )}
            onClick={closeMobileMenu}
          >
            Accommodation
          </Link>
          <Link 
            href="/dining" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium py-2",
              location === '/dining' && "text-[#E8B87D]"
            )}
            onClick={closeMobileMenu}
          >
            Dining
          </Link>
          <Link 
            href="/experiences" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium py-2",
              location === '/experiences' && "text-[#E8B87D]"
            )}
            onClick={closeMobileMenu}
          >
            Experiences
          </Link>
          <Link 
            href="/gallery" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium py-2",
              location === '/gallery' && "text-[#E8B87D]"
            )}
            onClick={closeMobileMenu}
          >
            Gallery
          </Link>
          <Link 
            href="/contact" 
            className={cn(
              "text-[#1E4E5F] hover:text-[#E8B87D] transition-colors font-medium py-2",
              location === '/contact' && "text-[#E8B87D]"
            )}
            onClick={closeMobileMenu}
          >
            Contact
          </Link>
          <Link 
            href="/booking" 
            className="bg-[#E8B87D] text-white px-6 py-3 rounded text-center hover:bg-[#1E4E5F] transition-colors font-medium"
            onClick={closeMobileMenu}
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
