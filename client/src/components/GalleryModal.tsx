import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GalleryImage } from '@shared/schema';

interface GalleryModalProps {
  image: GalleryImage | null;
  onClose: () => void;
}

const GalleryModal = ({ image, onClose }: GalleryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!!image);
  }, [image]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  // Format image URL with cache busting
  const getImageUrl = (url: string) => {
    if (!url) return '';
    // Strip existing query params
    const baseUrl = url.includes('?') ? url.split('?')[0] : url;
    // Generate unique timestamp with microseconds for true uniqueness
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    console.log(`Opening modal for image: ${baseUrl} with timestamp ${timestamp}-${random}`);
    return `${baseUrl}?t=${timestamp}-${random}`;
  };

  if (!image) return null;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-6xl bg-[#FDF6EE] p-6 rounded-lg border-2 border-[#A0B985] shadow-xl">
        <div className="flex flex-col items-center">
          {image.mediaType === 'video' ? (
            <div className="relative w-full max-w-3xl">
              {image.imageUrl.startsWith('/uploads') ? (
                // Local video file
                <video 
                  src={getImageUrl(image.imageUrl)}
                  className="max-h-[80vh] w-full object-contain rounded-md shadow-md"
                  controls
                  autoPlay
                  onError={(e) => {
                    console.error(`Failed to load video: ${image.imageUrl}`);
                    const videoElement = e.target as HTMLVideoElement;
                    videoElement.onerror = null;
                  }}
                />
              ) : image.imageUrl.includes('youtube.com') || image.imageUrl.includes('youtu.be') ? (
                // YouTube embed
                <div className="aspect-video w-full border border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#FF0000" stroke="none" className="mx-auto">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    <p className="mt-2 text-gray-600">YouTube Video</p>
                    <a 
                      href={image.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-3 inline-block px-4 py-2 bg-[#FF914D] text-white rounded-full text-sm hover:bg-[#8B5E3C] transition-colors"
                    >
                      Open in YouTube
                    </a>
                  </div>
                </div>
              ) : (
                // Other video with cache-busting
                <video 
                  src={getImageUrl(image.imageUrl)}
                  className="max-h-[80vh] w-full object-contain rounded-md shadow-md"
                  controls
                  autoPlay
                  onError={(e) => {
                    console.error(`Failed to load video: ${image.imageUrl}`);
                    const videoElement = e.target as HTMLVideoElement;
                    videoElement.onerror = null;
                  }}
                />
              )}
            </div>
          ) : (
            <div className="relative">
              <img 
                src={getImageUrl(image.imageUrl)}
                alt={image.alt} 
                className="max-h-[80vh] w-auto object-contain rounded-md shadow-md"
                onError={(e) => {
                  console.error(`Failed to load modal image: ${image.imageUrl}`);
                  (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
              {/* Fallback content will appear through the onError handler if needed */}
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            {image.mediaType === 'video' && (
              <span className="px-2 py-1 bg-[#62C3D2] text-white text-xs rounded-full">
                Video
              </span>
            )}
            <p className="text-[#8B5E3C] font-medium text-lg">{image.alt}</p>
          </div>
          
          {/* Description if available */}
          {image.description && (
            <p className="mt-2 text-gray-600 text-center max-w-lg">
              {image.description}
            </p>
          )}
          
          {/* Category badge */}
          {image.category && (
            <span className="mt-3 px-3 py-1 bg-[#A0B985] text-white text-sm rounded-full">
              {image.category
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </span>
          )}
          
          {/* Tags */}
          {image.tags && image.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {image.tags.split(',').map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-[#62C3D2] bg-opacity-20 text-[#62C3D2] text-xs rounded-full"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;