import { useState, useEffect } from 'react';

/**
 * Custom hook for progressive image loading and WebP support
 */
export function useImageOptimization(src: string, priority: boolean = false) {
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    // Check if browser supports WebP
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    const loadOptimizedImage = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        // Try WebP version first if supported
        if (supportsWebP() && !src.includes('.webp')) {
          const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          
          const webpImage = new Image();
          webpImage.onload = () => {
            setOptimizedSrc(webpSrc);
            setIsLoading(false);
          };
          webpImage.onerror = () => {
            // Fallback to original format
            const originalImage = new Image();
            originalImage.onload = () => {
              setOptimizedSrc(src);
              setIsLoading(false);
            };
            originalImage.onerror = () => {
              setHasError(true);
              setIsLoading(false);
            };
            originalImage.src = src;
          };
          webpImage.src = webpSrc;
        } else {
          // Load original image
          const image = new Image();
          image.onload = () => {
            setOptimizedSrc(src);
            setIsLoading(false);
          };
          image.onerror = () => {
            setHasError(true);
            setIsLoading(false);
          };
          image.src = src;
        }
      } catch (error) {
        setHasError(true);
        setIsLoading(false);
      }
    };

    if (priority) {
      // Load immediately for above-the-fold images
      loadOptimizedImage();
    } else {
      // Use Intersection Observer for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadOptimizedImage();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      // Create a temporary element to observe
      const tempElement = document.createElement('div');
      observer.observe(tempElement);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [src, priority]);

  return {
    src: optimizedSrc,
    isLoading,
    hasError,
    loadingAttribute: priority ? 'eager' : 'lazy'
  };
}