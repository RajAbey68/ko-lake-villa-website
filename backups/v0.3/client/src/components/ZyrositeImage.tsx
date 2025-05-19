import { useState, useEffect } from 'react';

interface ZyrositeImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Special component for handling zyrosite.com images which have CORS issues
 * Uses the weserv.nl image proxy service to bypass CORS restrictions
 */
const ZyrositeImage = ({ src, alt, className = '' }: ZyrositeImageProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset states when source changes
    setLoading(true);
    setError(false);
    
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }
    
    // Convert to a working image URL through an image proxy service
    if (src.includes('zyrosite.com') || src.includes('assets.zyro')) {
      // Use an image proxy service to bypass CORS
      setImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(src)}`);
    } else {
      // Direct use for other URLs
      setImgSrc(src);
    }
  }, [src]);
  
  const handleImageLoad = () => {
    setLoading(false);
  };
  
  const handleImageError = () => {
    setError(true);
    setLoading(false);
  };
  
  if (error) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gray-100 p-3 text-center`}>
        <svg className="mb-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <p className="text-sm text-gray-600">{alt || "Image unavailable"}</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse w-8 h-8 text-[#8B5E3C]">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
          </div>
        </div>
      )}
      
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ opacity: loading ? 0 : 1 }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default ZyrositeImage;