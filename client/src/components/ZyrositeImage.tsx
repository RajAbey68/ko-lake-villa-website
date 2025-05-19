import { useState } from 'react';

interface ZyrositeImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Special component for handling zyrosite.com images which have CORS issues
 */
const ZyrositeImage = ({ src, alt, className = '' }: ZyrositeImageProps) => {
  const [error, setError] = useState(false);
  
  // Convert zyrosite URL to image data URL with a simple base64 encoding 
  // since these images have CORS issues
  const imageUrl = src;
  
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

  // For improved loading display
  return (
    <div className={`${className} relative`}>
      <img
        src={`https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
};

export default ZyrositeImage;