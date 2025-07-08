import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
// Use database schema type directly
type GalleryImageFromDB = {
  id: number;
  imageUrl: string;
  title: string;
  alt: string;
  description: string | null;
  tags: string | null;
  category: string;
  featured: boolean;
  sortOrder: number;
  mediaType: string;
  displaySize: string;
  fileSize: number | null;
};
import { formatCategoryLabel, formatTagsForDisplay } from '@/lib/galleryUtils';

interface FullscreenVideoModalProps {
  image: GalleryImageFromDB;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  currentIndex: number;
  images: GalleryImageFromDB[];
}

export const FullscreenVideoModal: React.FC<FullscreenVideoModalProps> = ({
  image,
  isOpen,
  onClose,
  onNavigate,
  currentIndex,
  images
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleKeyNav = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleKeyNav);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleKeyNav);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || !image) return null;

  const isVideo = image.mediaType === 'video' || image.imageUrl?.endsWith('.mp4') || image.imageUrl?.endsWith('.mov');
  const tags = formatTagsForDisplay(image.tags);

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Main content area */}
      <div className="relative w-full h-full flex flex-col">
        
        {/* Media display area - 85% of screen */}
        <div className="relative flex-1 flex items-center justify-center bg-black">
          {isVideo ? (
            <video
              key={image.id}
              className="max-w-full max-h-full object-contain"
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
              onDoubleClick={(e) => {
                e.preventDefault();
                const video = e.target as HTMLVideoElement;
                if (video.requestFullscreen) {
                  video.requestFullscreen().catch(console.error);
                }
              }}
            >
              <source src={image.imageUrl} type="video/mp4" />
              <source src={image.imageUrl} type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={image.imageUrl}
              alt={image.alt}
              className="max-w-full max-h-full object-contain"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '85vh',
                objectFit: 'contain',
                objectPosition: 'center',
                width: 'auto',
                height: 'auto'
              }}
              loading="eager"
            />
          )}

          {/* Navigation arrows */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white text-3xl px-4 py-3 rounded-full z-10"
            onClick={() => onNavigate('prev')}
            disabled={images.length <= 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white text-3xl px-4 py-3 rounded-full z-10"
            onClick={() => onNavigate('next')}
            disabled={images.length <= 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Close button */}
          <Button
            variant="ghost"
            size="lg"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 p-0 z-10"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Counter */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
            {currentIndex + 1} of {images.length}
          </div>

          {/* Video hint */}
          {isVideo && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
              Double-click for fullscreen
            </div>
          )}
        </div>

        {/* Info panel - 15% of screen */}
        <div className="h-[15vh] bg-black/90 text-white p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {image.title || image.alt}
                </h2>

                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-[#A0B985] text-white">
                    {formatCategoryLabel(image.category)}
                  </Badge>

                  {image.featured && (
                    <Badge className="bg-[#FF914D] text-white">
                      Featured
                    </Badge>
                  )}
                  
                  {isVideo && (
                    <Badge className="bg-purple-600 text-white">
                      Video
                    </Badge>
                  )}
                </div>

                <p className="text-gray-200 text-sm leading-relaxed">
                  {image.description || 'Experience the beauty of Ko Lake Villa'}
                </p>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};