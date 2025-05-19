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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  useEffect(() => {
    // Reset states when source changes
    setLoading(true);
    setError(false);
    
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }
    
    // Function to generate proper image URL with cache-busting
    const generateImageUrl = () => {
      if (src.includes('zyrosite.com') || src.includes('assets.zyro')) {
        // Use an image proxy service to bypass CORS
        return `https://images.weserv.nl/?url=${encodeURIComponent(src)}`;
      } else if (src.startsWith('/uploads/')) {
        // For local uploaded files, ensure we use proper cache prevention
        const timestamp = new Date().getTime();
        return `${src}?nocache=${timestamp}`;
      } else {
        // Direct use for other URLs
        return src;
      }
    };
    
    // Set initial image source
    setImgSrc(generateImageUrl());
    
    // Setup automatic retry mechanism for uploaded images
    let retryTimer: number | undefined;
    
    if (src.startsWith('/uploads/')) {
      retryTimer = window.setTimeout(() => {
        if (retryCount < maxRetries) {
          console.log(`Auto-refreshing image (attempt ${retryCount + 1}): ${src}`);
          setRetryCount(c => c + 1);
          setImgSrc(generateImageUrl());
        }
      }, 2000); // Try again after 2 seconds
    }
    
    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [src, retryCount]);
  
  const handleImageLoad = () => {
    setLoading(false);
  };
  
  const handleImageError = () => {
    // For local uploads, implement a robust fallback strategy
    if (imgSrc && imgSrc.startsWith('/uploads/')) {
      // Extract the base path without any query parameters
      const basePath = imgSrc.split('?')[0];
      
      if (!imgSrc.includes('direct=true')) {
        // First fallback: Try with direct mode
        console.log(`Local image failed to load: ${imgSrc}, trying with direct mode`);
        const timestamp = new Date().getTime();
        setImgSrc(`${basePath}?direct=true&t=${timestamp}`);
        return;
      } else if (!imgSrc.includes('image-proxy')) {
        // Second fallback: Try with image proxy API endpoint
        console.log(`Direct mode failed, trying with image proxy`);
        setImgSrc(`/api/image-proxy?url=${encodeURIComponent(basePath)}&t=${Date.now()}`);
        return;
      } else if (retryCount < 3) {
        // Third fallback: Try again with increased retry count (triggers useEffect)
        console.log(`Image proxy failed, trying again automatically`);
        setRetryCount(count => count + 1);
        return;
      }
    }
    
    // If all attempts failed, show the error state
    console.error(`All image loading attempts failed for: ${imgSrc}`);
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