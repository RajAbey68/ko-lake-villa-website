import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryImage } from '@/lib/galleryUtils';
import { formatCategoryLabel, formatTagsForDisplay } from '@/lib/galleryUtils';

// Function to generate beautiful display titles for guests
const getDisplayTitle = (image: GalleryImage): string => {
  if (image.title) return image.title;
  
  const categoryTitles: Record<string, string> = {
    'family-suite': 'Family Suite',
    'friends': 'Friends & Fun',
    'events': 'Villa Events',
    'pool-deck': 'Pool & Deck',
    'lake-view': 'Lake Views', 
    'dining': 'Dining Experience',
    'gardens': 'Tropical Gardens',
    'exterior': 'Villa Architecture',
    'amenities': 'Villa Amenities',
    'default': 'Ko Lake Villa'
  };
  
  // Generate title based on category and media type
  const baseTitle = categoryTitles[image.category] || 'Ko Lake Villa Experience';
  
  if (image.mediaType === 'video') {
    return `${baseTitle} - Video Experience`;
  }
  
  return baseTitle;
};

// Function to generate beautiful descriptions for guests
const getDisplayDescription = (image: GalleryImage): string => {
  if (image.description) return image.description;
  
  const categoryDescriptions: Record<string, string> = {
    'family-suite': 'Spacious accommodations with stunning lake views and modern amenities for the perfect family getaway.',
    'friends': 'Create unforgettable memories with friends in our beautiful lakeside villa setting.',
    'events': 'Host your special celebrations with breathtaking lake views and elegant villa spaces.',
    'pool-deck': 'Relax by our private pool with panoramic views of Koggala Lake.',
    'lake-view': 'Wake up to stunning views of Koggala Lake from every window.',
    'dining': 'Enjoy delicious Sri Lankan cuisine and international dishes in elegant settings.',
    'gardens': 'Stroll through beautifully landscaped tropical gardens.',
    'exterior': 'Traditional Sri Lankan architecture blended with modern luxury.',
    'amenities': 'Premium amenities for an exceptional villa experience.',
    'default': 'Experience the beauty and tranquility of Ko Lake Villa.'
  };
  
  return categoryDescriptions[image.category] || 'Beautiful moments at Ko Lake Villa, your luxury lakeside retreat in Ahangama.';
};

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
      <DialogContent className="bg-black border-none" data-modal-size="fullscreen">
        <DialogTitle className="sr-only">
          {image.title || image.alt} - Ko Lake Villa Gallery
        </DialogTitle>
        <div className="relative w-full h-full bg-black">
          {/* Main Media - Takes up most of the screen */}
          <div className="relative h-[85vh] bg-black flex items-center justify-center">
            {(image.mediaType === 'video' || 
              image.imageUrl?.toLowerCase().endsWith('.mp4') || 
              image.imageUrl?.toLowerCase().endsWith('.mov') ||
              image.imageUrl?.toLowerCase().endsWith('.webm') ||
              image.imageUrl?.toLowerCase().endsWith('.avi') ||
              image.imageUrl?.toLowerCase().endsWith('.mkv') ||
              image.imageUrl?.toLowerCase().endsWith('.m4v') ||
              image.imageUrl?.toLowerCase().endsWith('.ogv')) ? (
              <video
                key={image.id}
                className="w-full h-full object-contain"
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                controlsList="nodownload"
                style={{ width: '100%', height: '100%', minHeight: '70vh' }}
                onPlay={(e) => {
                  const video = e.target as HTMLVideoElement;
                  const playPromise = video.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(error => {
                      console.warn('Video autoplay prevented:', error);
                    });
                  }
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const video = e.target as HTMLVideoElement;
                  
                  try {
                    if (video.requestFullscreen) {
                      video.requestFullscreen().catch(console.error);
                    } else if ((video as any).webkitRequestFullscreen) {
                      (video as any).webkitRequestFullscreen();
                    } else if ((video as any).mozRequestFullScreen) {
                      (video as any).mozRequestFullScreen();
                    } else if ((video as any).msRequestFullscreen) {
                      (video as any).msRequestFullscreen();
                    }
                  } catch (error) {
                    console.warn('Fullscreen not supported:', error);
                  }
                }}
                onClick={(e) => {
                  // Toggle play/pause on single click
                  const video = e.target as HTMLVideoElement;
                  if (video.paused) {
                    video.play().catch(console.error);
                  } else {
                    video.pause();
                  }
                }}
                onError={(e) => {
                  console.error('Failed to load video:', image.imageUrl);
                }}
              >
                <source src={image.imageUrl} type="video/mp4" />
                <source src={image.imageUrl} type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                key={image.id}
                src={image.imageUrl}
                alt={image.alt}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            )}

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

            {/* Video Fullscreen Hint */}
            {(image.mediaType === 'video' || image.imageUrl?.endsWith('.mp4') || image.imageUrl?.endsWith('.mov')) && (
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                Double-click for fullscreen
              </div>
            )}
          </div>

          {/* Media Details - Compact info for videos, full details for images */}
          <div className={`p-4 space-y-2 ${(image.mediaType === 'video' || image.imageUrl?.endsWith('.mp4') || image.imageUrl?.endsWith('.mov')) ? 'bg-black/80 text-white' : 'bg-white'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className={`text-xl font-semibold mb-2 ${(image.mediaType === 'video' || image.imageUrl?.endsWith('.mp4') || image.imageUrl?.endsWith('.mov')) ? 'text-white' : 'text-[#8B5E3C]'}`}>
                  {getDisplayTitle(image)}
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
                  
                  {(image.mediaType === 'video' || image.imageUrl?.endsWith('.mp4') || image.imageUrl?.endsWith('.mov')) && (
                    <Badge className="bg-purple-600 text-white">
                      Video
                    </Badge>
                  )}
                </div>

                <p className={`mb-3 leading-relaxed ${(image.mediaType === 'video' || image.imageUrl?.endsWith('.mp4') || image.imageUrl?.endsWith('.mov')) ? 'text-gray-200' : 'text-gray-700'}`}>
                  {getDisplayDescription(image)}
                </p>

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