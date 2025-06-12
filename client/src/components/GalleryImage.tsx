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
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E"
}: GalleryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // For accommodation pages and critical images, load immediately
  const shouldLoadImmediately = className?.includes('accommodation') || className?.includes('hero') || !src.includes('/uploads/');
  const imageSrc = (shouldLoadImmediately || isInView) ? src : placeholder;

  // Debug logging for accommodation images
  if (className?.includes('accommodation')) {
    console.log('Accommodation image loading:', { src, imageSrc, shouldLoadImmediately, isInView });
  }

  return (
    <img 
      ref={imgRef}
      src={imageSrc}
      alt={alt} 
      className={`${className} ${isLoaded && !hasError ? 'opacity-100' : 'opacity-90'} transition-opacity duration-200`}
      loading={shouldLoadImmediately ? "eager" : "lazy"}
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