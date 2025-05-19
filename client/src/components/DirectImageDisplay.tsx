import { useState, useEffect } from 'react';

interface DirectImageDisplayProps {
  imageUrl: string;
  alt: string;
  className?: string;
}

/**
 * A simplified component that directly displays images with cache busting
 */
const DirectImageDisplay = ({ imageUrl, alt, className = '' }: DirectImageDisplayProps) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setError(true);
      return;
    }

    // Strip any existing cache parameters to avoid multiple params
    let cleanUrl = imageUrl;
    if (cleanUrl.includes('?')) {
      cleanUrl = cleanUrl.split('?')[0];
    }

    // Add cache-busting timestamp to URL
    const bustCache = Math.floor(Math.random() * 1000000);
    setImgSrc(`${cleanUrl}?cache=${Date.now()}-${bustCache}`);
  }, [imageUrl]);

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
      src={imgSrc} 
      alt={alt}
      className={className} 
      onError={handleError}
    />
  );
};

export default DirectImageDisplay;