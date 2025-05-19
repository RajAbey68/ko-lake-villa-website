import { useState, useEffect, useRef } from 'react';

interface GalleryImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * A specialized image loader component to ensure gallery images load reliably
 */
const GalleryImageLoader = ({ src, alt, className = '' }: GalleryImageLoaderProps) => {
  const [displaySrc, setDisplaySrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 5;
  
  // This function handles all the image loading strategies
  const loadImage = () => {
    // Create a cache-busting parameter
    const timestamp = Date.now();
    let imageUrl = '';
    
    // Determine the best approach based on retry count
    if (retryCount.current === 0) {
      // First try: Direct approach with cache busting
      imageUrl = `${src}?nocache=${timestamp}`;
    } else if (retryCount.current === 1) {
      // Second try: Use our image proxy endpoint
      imageUrl = `/api/image-proxy?url=${encodeURIComponent(src)}&t=${timestamp}`;
    } else {
      // Subsequent retries: Alternate between approaches with different timestamps
      imageUrl = retryCount.current % 2 === 0
        ? `${src}?attempt=${retryCount.current}&t=${timestamp}`
        : `/api/image-proxy?url=${encodeURIComponent(src)}&attempt=${retryCount.current}&t=${timestamp}`;
    }
    
    // Create a new image object to test loading
    const img = new Image();
    img.onload = () => {
      setDisplaySrc(imageUrl);
      setIsLoaded(true);
      setIsError(false);
    };
    
    img.onerror = () => {
      // If we haven't reached max retries, try again with a different strategy
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        console.log(`Retry ${retryCount.current}/${maxRetries} for image: ${src}`);
        setTimeout(loadImage, 1000); // Wait 1 second before trying again
      } else {
        // If we've exhausted all retries, show the error state
        console.error(`Failed to load image after ${maxRetries} attempts: ${src}`);
        setIsError(true);
      }
    };
    
    // Start loading the image
    img.src = imageUrl;
  };
  
  useEffect(() => {
    // Reset states when the source changes
    setIsLoaded(false);
    setIsError(false);
    retryCount.current = 0;
    
    if (src) {
      loadImage();
    } else {
      setIsError(true);
    }
    
    // Cleanup function
    return () => {
      // No cleanup needed
    };
  }, [src]);
  
  if (isError) {
    // Show error state
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
      {/* Loading placeholder */}
      {!isLoaded && (
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
      
      {/* Actual image (only shown when loaded) */}
      {displaySrc && (
        <img
          src={displaySrc}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
      )}
    </div>
  );
};

export default GalleryImageLoader;