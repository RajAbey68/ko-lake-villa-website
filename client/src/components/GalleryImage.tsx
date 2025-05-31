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

  return (
    <img 
      ref={imgRef}
      src={isInView ? src : placeholder}
      alt={alt} 
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-70'} transition-opacity duration-300`}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      onError={(e) => {
        console.error(`Failed to load image: ${src}`);
        e.currentTarget.src = placeholder;
      }}
    />
  );
}