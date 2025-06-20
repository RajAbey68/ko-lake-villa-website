
import { Link } from 'wouter';
import { useEffect } from 'react';

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found - Ko Lake Villa";
    // Set proper HTTP status for SEO
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
      <div className="text-center px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-6xl font-display font-bold text-[#8B5E3C] mb-4">404</h1>
          <h2 className="text-2xl font-display font-bold text-[#1E4E5F] mb-4">Page Not Found</h2>
          <p className="text-[#8B5E3C] mb-8">
            Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or the URL was mistyped.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-display font-bold text-[#1E4E5F] mb-4">What would you like to do?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/" className="bg-[#8B5E3C] text-white px-6 py-3 rounded-lg hover:bg-[#7A5232] transition-colors">
              <i className="fas fa-home mr-2"></i>
              Go Home
            </Link>
            <Link href="/accommodation" className="bg-[#FF914D] text-white px-6 py-3 rounded-lg hover:bg-[#E8823C] transition-colors">
              <i className="fas fa-bed mr-2"></i>
              View Rooms
            </Link>
            <Link href="/gallery" className="bg-[#62C3D2] text-white px-6 py-3 rounded-lg hover:bg-[#4FB3C4] transition-colors">
              <i className="fas fa-images mr-2"></i>
              Photo Gallery
            </Link>
            <Link href="/contact" className="bg-[#A0B985] text-white px-6 py-3 rounded-lg hover:bg-[#8FA774] transition-colors">
              <i className="fas fa-envelope mr-2"></i>
              Contact Us
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-[#8B5E3C] mb-4">
            Need immediate assistance? Contact us directly:
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="tel:+940711730345" 
              className="text-[#FF914D] hover:text-[#8B5E3C] transition-colors"
            >
              <i className="fas fa-phone mr-1"></i>
              +94 071 173 0345
            </a>
            <a 
              href="mailto:contact@KoLakeHouse.com" 
              className="text-[#FF914D] hover:text-[#8B5E3C] transition-colors"
            >
              <i className="fas fa-envelope mr-1"></i>
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
