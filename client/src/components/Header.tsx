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
          <h1 className="text-[#8B5E3C] font-display text-2xl md:text-3xl font-bold whitespace-nowrap">Ko Lake House</h1>
        </Link>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center">
          {/* Language Switcher */}
          <div className="relative mr-2">
            <button 
              className="flex items-center text-[#8B5E3C] hover:text-[#FF914D] transition-colors focus:outline-none"
              onClick={toggleLanguageMenu}
              aria-label="Change language"
            >
              {/* Current language flag */}
              <span className="mr-1 text-lg">
                {language === 'en' && '🇬🇧'}
                {language === 'si' && '🇱🇰'}
                {language === 'ta' && '🇱🇰'}
                {language === 'zh' && '🇨🇳'}
                {language === 'ru' && '🇷🇺'}
              </span>
              <span className="hidden md:inline text-sm">{language.toUpperCase()}</span>
              <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </button>
            
            {/* Language dropdown menu */}
            {languageMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
                <button 
                  className={`flex items-center w-full px-4 py-2 text-sm ${language === 'en' ? 'bg-gray-100 text-[#FF914D]' : 'text-[#8B5E3C]'} hover:bg-gray-100`}
                  onClick={() => changeLanguage('en')}
                >
                  <span className="mr-2">🇬🇧</span> English
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 text-sm ${language === 'si' ? 'bg-gray-100 text-[#FF914D]' : 'text-[#8B5E3C]'} hover:bg-gray-100`}
                  onClick={() => changeLanguage('si')}
                >
                  <span className="mr-2">🇱🇰</span> සිංහල
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 text-sm ${language === 'ta' ? 'bg-gray-100 text-[#FF914D]' : 'text-[#8B5E3C]'} hover:bg-gray-100`}
                  onClick={() => changeLanguage('ta')}
                >
                  <span className="mr-2">🇱🇰</span> தமிழ்
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 text-sm ${language === 'zh' ? 'bg-gray-100 text-[#FF914D]' : 'text-[#8B5E3C]'} hover:bg-gray-100`}
                  onClick={() => changeLanguage('zh')}
                >
                  <span className="mr-2">🇨🇳</span> 中文
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 text-sm ${language === 'ru' ? 'bg-gray-100 text-[#FF914D]' : 'text-[#8B5E3C]'} hover:bg-gray-100`}
                  onClick={() => changeLanguage('ru')}
                >
                  <span className="mr-2">🇷🇺</span> Русский
                </button>
              </div>
            )}
          </div>
          
          <Link 
            href="/booking" 
            className="hidden md:block bg-[#FF914D] text-white px-6 py-2 rounded hover:bg-[#8B5E3C] transition-colors font-medium mr-2"
          >
            {t('book_now')}
          </Link>
          
          {isAdmin && (
            <Link 
              href="/admin" 
              className="hidden md:block text-[#8B5E3C] text-xs border border-[#8B5E3C] px-3 py-1 rounded hover:bg-[#8B5E3C] hover:text-white transition-colors font-medium mr-2"
            >
              {t('admin')}
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
            {t('home')}
          </Link>
          <Link 
            href="/accommodation" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/accommodation' && "text-[#FF914D]"
            )}
          >
            {t('accommodation')}
          </Link>
          <Link 
            href="/dining" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/dining' && "text-[#FF914D]"
            )}
          >
            {t('dining')}
          </Link>
          <Link 
            href="/experiences" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/experiences' && "text-[#FF914D]"
            )}
          >
            {t('experiences')}
          </Link>
          <Link 
            href="/gallery" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/gallery' && "text-[#FF914D]"
            )}
          >
            {t('gallery')}
          </Link>
          <Link 
            href="/contact" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium",
              location === '/contact' && "text-[#FF914D]"
            )}
          >
            {t('contact')}
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
          {/* Language Switcher in Mobile Menu */}
          <div className="flex flex-wrap gap-2 py-2 border-b border-gray-200 mb-2">
            <button 
              onClick={() => changeLanguage('en')}
              className={`flex items-center px-3 py-1 rounded text-sm ${language === 'en' ? 'bg-[#A0B985] text-white' : 'bg-gray-100 text-[#8B5E3C]'}`}
            >
              <span className="mr-1">🇬🇧</span> EN
            </button>
            <button 
              onClick={() => changeLanguage('si')}
              className={`flex items-center px-3 py-1 rounded text-sm ${language === 'si' ? 'bg-[#A0B985] text-white' : 'bg-gray-100 text-[#8B5E3C]'}`}
            >
              <span className="mr-1">🇱🇰</span> SI
            </button>
            <button 
              onClick={() => changeLanguage('ta')}
              className={`flex items-center px-3 py-1 rounded text-sm ${language === 'ta' ? 'bg-[#A0B985] text-white' : 'bg-gray-100 text-[#8B5E3C]'}`}
            >
              <span className="mr-1">🇱🇰</span> TA
            </button>
            <button 
              onClick={() => changeLanguage('zh')}
              className={`flex items-center px-3 py-1 rounded text-sm ${language === 'zh' ? 'bg-[#A0B985] text-white' : 'bg-gray-100 text-[#8B5E3C]'}`}
            >
              <span className="mr-1">🇨🇳</span> ZH
            </button>
            <button 
              onClick={() => changeLanguage('ru')}
              className={`flex items-center px-3 py-1 rounded text-sm ${language === 'ru' ? 'bg-[#A0B985] text-white' : 'bg-gray-100 text-[#8B5E3C]'}`}
            >
              <span className="mr-1">🇷🇺</span> RU
            </button>
          </div>
          
          <Link 
            href="/" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            {t('home')}
          </Link>
          <Link 
            href="/accommodation" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/accommodation' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            {t('accommodation')}
          </Link>
          <Link 
            href="/dining" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/dining' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            {t('dining')}
          </Link>
          <Link 
            href="/experiences" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/experiences' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            {t('experiences')}
          </Link>
          <Link 
            href="/gallery" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/gallery' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            {t('gallery')}
          </Link>
          <Link 
            href="/contact" 
            className={cn(
              "text-[#8B5E3C] hover:text-[#FF914D] transition-colors font-medium py-2",
              location === '/contact' && "text-[#FF914D]"
            )}
            onClick={closeMobileMenu}
          >
            {t('contact')}
          </Link>
          <Link 
            href="/booking" 
            className="bg-[#FF914D] text-white px-6 py-3 rounded text-center hover:bg-[#8B5E3C] transition-colors font-medium"
            onClick={closeMobileMenu}
          >
            {t('book_now')}
          </Link>
          
          {isAdmin && (
            <Link 
              href="/admin" 
              className="text-[#8B5E3C] text-sm border border-[#8B5E3C] px-4 py-2 rounded text-center hover:bg-[#8B5E3C] hover:text-white transition-colors mt-2"
              onClick={closeMobileMenu}
            >
              {t('admin')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
