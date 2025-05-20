import { useState } from 'react';

interface DirectImageDisplayProps {
  imageUrl: string;
  alt: string;
  className?: string;
}

/**
 * A simplified component that directly displays images
 */
const DirectImageDisplay = ({ imageUrl, alt, className = '' }: DirectImageDisplayProps) => {
  const [error, setError] = useState(false);

  // Generate a working image URL with proper cache busting
  const processedUrl = imageUrl + (imageUrl.includes('?') ? '&' : '?') + `t=${Date.now()}`;

  const handleError = () => {
    console.error(`Failed to load image: ${imageUrl}`);
    setError(true);
  };

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 p-4`}>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <p className="text-sm text-gray-500">{alt || 'Image unavailable'}</p>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={processedUrl} 
      alt={alt}
      className={className} 
      onError={handleError}
    />
  );
};

export default DirectImageDisplay;