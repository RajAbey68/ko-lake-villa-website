import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryImage } from '@/lib/galleryUtils';
import { formatCategoryLabel, formatTagsForDisplay } from '@/lib/galleryUtils';

interface GalleryModalProps {
  images: GalleryImage[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  images,
  isOpen,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const image = images[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigate('prev');
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigate('next');
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onNavigate, onClose]);

  if (!image) return null;

  const tags = formatTagsForDisplay(image.tags);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[95vh] p-0 overflow-hidden" aria-describedby="gallery-modal-description">
        <DialogTitle className="sr-only">
          {image.alt} - Ko Lake Villa Gallery
        </DialogTitle>
        <div className="relative w-full h-full bg-white rounded-lg">
          {/* Main Image - Takes up 60% of screen */}
          <div className="relative h-[60vh] bg-black flex items-center justify-center">
            <img
              src={image.imageUrl}
              alt={image.alt}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
              }}
            />
            
            {/* Navigation Arrows - Big and Bold */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white text-4xl px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white z-50 transition-all duration-200"
              onClick={() => onNavigate('prev')}
              disabled={images.length <= 1}
              aria-label="Previous image"
            >
              ←
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white text-4xl px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white z-50 transition-all duration-200"
              onClick={() => onNavigate('next')}
              disabled={images.length <= 1}
              aria-label="Next image"
            >
              →
            </button>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="lg"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} of {images.length}
            </div>
          </div>

          {/* Image Details - Below the image */}
          <div className="p-6 space-y-3 bg-white" id="gallery-modal-description">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-[#8B5E3C] mb-2">
                  {image.alt}
                </h2>
                
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="bg-[#A0B985] text-white">
                    {formatCategoryLabel(image.category)}
                  </Badge>
                  
                  {image.featured && (
                    <Badge className="bg-[#FF914D] text-white">
                      Featured
                    </Badge>
                  )}
                </div>

                {image.description && (
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {image.description}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Navigation Hints */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Use ← → arrow keys or click the arrows to navigate • Press Esc to close
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};