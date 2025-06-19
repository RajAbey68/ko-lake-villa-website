import React, { useState, useRef, useEffect } from 'react';

interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export default function GalleryImage({ 
  src, 
  alt, 
  className, 
  placeholder = ""
}: GalleryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // For critical pages, load images immediately without lazy loading
  const isAccommodationPage = className?.includes('accommodation');
  const isHeroImage = className?.includes('hero');
  const shouldLoadImmediately = isAccommodationPage || isHeroImage;
  
  // Always use actual image source - no placeholders that degrade quality
  const imageSrc = src;

  // Debug logging for accommodation images
  if (className?.includes('accommodation')) {
    console.log('Accommodation image loading:', { src, imageSrc, shouldLoadImmediately });
  }

  return (
    <img 
      ref={imgRef}
      src={imageSrc}
      alt={alt} 
      className={`${className} ${isLoaded && !hasError ? 'opacity-100' : 'opacity-100'}`}
      loading={shouldLoadImmediately ? "eager" : "lazy"}
      decoding="async"
      style={{
        imageRendering: 'high-quality',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        filter: 'none',
        WebkitFilter: 'none'
      }}
      onLoad={() => {
        setIsLoaded(true);
        setHasError(false);
      }}
      onError={(e) => {
        console.error(`Failed to load image: ${src}`, e);
        setHasError(true);
        const target = e.currentTarget;
        
        // Try loading without cache first
        if (!target.src.includes('?nocache=')) {
          console.log('Retrying image with cache bust:', src);
          target.src = `${src}?nocache=${Date.now()}`;
        } else if (src !== '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg') {
          // If not already using default, try default image
          console.log('Falling back to default image');
          target.src = '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
        } else {
          // Final fallback to placeholder
          console.log('Using placeholder as final fallback');
          target.src = placeholder;
        }
      }}
    />
  );
}