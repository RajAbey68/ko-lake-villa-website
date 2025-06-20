import { useState } from 'react';

interface ExternalImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

const ExternalImage = ({ src, alt, className = '', fallbackText }: ExternalImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Try both direct and proxied image URLs
  const handleImageError = () => {
    if (!error) {
      console.log(`Image failed to load directly, trying proxy: ${src}`);
      setError(true);
    }
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${src}`);
    setIsLoaded(true);
  };

  // If we've tried both direct and proxy and still failed, show placeholder
  if (error && src.includes('/api/image-proxy')) {
    return (
      <div className={`${className} bg-gray-100 flex flex-col items-center justify-center text-gray-500 text-sm text-center p-2`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        {fallbackText || alt || "Image not available"}
      </div>
    );
  }

  // Try direct URL first, then proxy URL if that fails
  const imageUrl = error ? `/api/image-proxy?url=${encodeURIComponent(src)}` : src;

  return (
    <div className={`${className} relative`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B5E3C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default ExternalImage;