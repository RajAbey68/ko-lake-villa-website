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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [actualSrc, setActualSrc] = useState<string>('');
  const retryCount = useRef(0);
  const maxRetries = 3;
  
  const loadImage = async () => {
    if (!src) {
      setIsError(true);
      return;
    }

    // Strong cache busting with timestamp and random
    const cacheBuster = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    let imageUrl = '';
    
    if (retryCount.current === 0) {
      // First attempt: Direct URL with cache buster
      imageUrl = `${src}?v=${cacheBuster}`;
    } else if (retryCount.current === 1) {
      // Second attempt: Force refresh headers
      imageUrl = `${src}?nocache=${cacheBuster}&refresh=true`;
    } else {
      // Final attempt: Different cache buster pattern
      imageUrl = `${src}?t=${cacheBuster}&force=true`;
    }

    try {
      // Test image loading
      const img = new Image();
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          setActualSrc(imageUrl);
          setIsLoaded(true);
          setIsError(false);
          resolve();
        };
        
        img.onerror = () => {
          reject(new Error(`Failed to load: ${imageUrl}`));
        };
        
        // Set timeout for slow loading
        setTimeout(() => {
          reject(new Error('Image load timeout'));
        }, 10000);
      });

      img.src = imageUrl;
      await loadPromise;
      
    } catch (error) {
      console.warn(`Image load attempt ${retryCount.current + 1} failed for ${src}:`, error);
      
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        // Wait a moment before retrying
        setTimeout(() => loadImage(), 500 * retryCount.current);
      } else {
        console.error(`All ${maxRetries + 1} attempts failed for image: ${src}`);
        setIsError(true);
      }
    }
  };
  
  useEffect(() => {
    // Reset everything when src changes
    setIsLoaded(false);
    setIsError(false);
    setActualSrc('');
    retryCount.current = 0;
    
    loadImage();
  }, [src]);
  
  if (isError) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center min-h-[200px]`}>
        <svg className="mb-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <p className="text-sm text-gray-500 font-medium">{alt || "Image unavailable"}</p>
        <p className="text-xs text-gray-400 mt-1">Failed to load after {maxRetries + 1} attempts</p>
      </div>
    );
  }
  
  return (
    <div className={`${className} relative overflow-hidden`}>
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 text-[#8B5E3C] animate-spin">
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
        </div>
      )}
      
      {/* Actual image */}
      {actualSrc && (
        <img
          src={actualSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => {
            setIsLoaded(true);
          }}
          onError={(e) => {
            console.error(`Final image load error for: ${src}`);
            setIsError(true);
          }}
          loading="eager"
          decoding="sync"
        />
      )}
    </div>
  );
};

export default GalleryImageLoader;