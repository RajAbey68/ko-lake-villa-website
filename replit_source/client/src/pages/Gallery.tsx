import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GalleryImage as GalleryImageType } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, Image as ImageIcon, Video, X, Play, ZoomIn } from 'lucide-react';
import { galleryValidator } from '@/lib/galleryValidator';
import { sanitizeHtml, sanitizeText, sanitizeImageAlt } from '@/lib/sanitizer';
import SEOHead from '@/components/SEOHead';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: GalleryImageType;
  images: GalleryImageType[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const GalleryModal = ({ isOpen, onClose, image, images, currentIndex, onNavigate }: GalleryModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        onNavigate(prevIndex);
      } else if (e.key === 'ArrowRight') {
        const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        onNavigate(nextIndex);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen) return null;

  const isVideo = image.mediaType === 'video' || image.imageUrl?.includes('.mp4') || image.imageUrl?.includes('.mov');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 text-white bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold">{sanitizeText(image.title)}</h3>
          {image.category && (
            <Badge variant="secondary" className="bg-[#FF914D] text-white">
              {image.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            {currentIndex + 1} of {images.length}
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Media Content - Full available space */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        {isVideo ? (
          <video
            src={image.imageUrl}
            controls
            className="w-full h-full object-contain"
            style={{ 
              maxWidth: 'calc(100vw - 2rem)', 
              maxHeight: 'calc(100vh - 200px)',
              objectFit: 'contain'
            }}
            autoPlay
            muted
            playsInline
          />
        ) : (
          <img
            src={image.imageUrl}
            alt={sanitizeImageAlt(image.alt || image.title || 'Gallery image')}
            className="w-full h-full object-contain"
            style={{ 
              maxWidth: 'calc(100vw - 2rem)', 
              maxHeight: 'calc(100vh - 200px)',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
            loading="eager"
          />
        )}
      </div>

      {/* Navigation and Description */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white p-4">
        <div className="flex justify-between items-start gap-4">
          <Button 
            variant="outline"
            onClick={() => {
              const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
              onNavigate(prevIndex);
            }}
            className="text-white border-white hover:bg-white hover:text-black flex-shrink-0"
          >
            Previous
          </Button>

          <div className="text-center flex-1 mx-4">
            <p className="text-sm mb-2">{sanitizeText(image.description)}</p>
            {image.tags && (
              <div className="flex flex-wrap justify-center gap-1">
                {image.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {sanitizeText(tag.trim())}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button 
            variant="outline"
            onClick={() => {
              const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
              onNavigate(nextIndex);
            }}
            className="text-white border-white hover:bg-white hover:text-black flex-shrink-0"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(12);

  // Fetch gallery images
  const { data: galleryImages, isLoading, error } = useQuery<GalleryImageType[]>({
    queryKey: ['/api/gallery'],
    staleTime: 5 * 60 * 1000,
  });

  // Apply comprehensive validation and deduplication
  const validatedImages = galleryImages ? galleryValidator.validateAndProcessImages(galleryImages) : [];
  
  // Filter by user selections
  const filteredImages = validatedImages.filter(image => {
    const categoryMatch = !selectedCategory || image.category === selectedCategory;
    const mediaTypeMatch = !selectedMediaType || 
      (selectedMediaType === 'image' && image.mediaType === 'image') ||
      (selectedMediaType === 'video' && (image.mediaType === 'video' || image.imageUrl?.includes('.mp4') || image.imageUrl?.includes('.mov')));
    
    return categoryMatch && mediaTypeMatch;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedMediaType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const paginatedImages = filteredImages.slice(startIndex, endIndex);

  // Get unique categories
  const categories = Array.from(new Set(galleryImages?.map(img => img.category).filter(Boolean))) as string[];

  const openModal = (image: GalleryImageType, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const navigateModal = (index: number) => {
    setCurrentImageIndex(index);
    setSelectedImage(filteredImages[index] as GalleryImageType);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#FF914D] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading gallery</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8B5E3C] mb-4">Ko Lake Villa Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our beautiful villa, stunning lake views, and memorable moments shared by our guests.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-[#FF914D] text-white" : ""}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-[#FF914D] text-white" : ""}
                >
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>

            {/* Media Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <Button
                variant={selectedMediaType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMediaType(null)}
                className={selectedMediaType === null ? "bg-[#FF914D] text-white" : ""}
              >
                All
              </Button>
              <Button
                variant={selectedMediaType === 'image' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMediaType('image')}
                className={selectedMediaType === 'image' ? "bg-[#FF914D] text-white" : ""}
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                Images
              </Button>
              <Button
                variant={selectedMediaType === 'video' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMediaType('video')}
                className={selectedMediaType === 'video' ? "bg-[#FF914D] text-white" : ""}
              >
                <Video className="w-4 h-4 mr-1" />
                Videos
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing {filteredImages.length} {filteredImages.length === 1 ? 'item' : 'items'}
            {selectedCategory && ` in ${selectedCategory.replace('-', ' ')}`}
            {selectedMediaType && ` (${selectedMediaType}s only)`}
          </p>
        </div>

        {/* Gallery Grid */}
        <div data-gallery-grid className="gallery-grid">
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No images found matching your filters.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory(null);
                setSelectedMediaType(null);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {paginatedImages.map((image, index) => {
              const isVideo = image.mediaType === 'video' || image.imageUrl?.includes('.mp4') || image.imageUrl?.includes('.mov');
              
              return (
                <Card 
                  key={image.id} 
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border border-gray-200 hover:border-[#FF914D]/30"
                  onClick={() => openModal(image, index)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      {isVideo ? (
                        <div className="w-full h-full relative bg-gray-900 flex items-center justify-center">
                          <video
                            src={image.imageUrl}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                            <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-gray-800" />
                            </div>
                          </div>
                          <Badge className="absolute top-3 right-3 bg-red-600 text-white text-xs">
                            Video
                          </Badge>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={image.imageUrl}
                            alt={sanitizeImageAlt(image.title)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              console.error('Image failed to load:', image.imageUrl);
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">Image not found<br/>${image.imageUrl}</div>`;
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white bg-opacity-90 rounded-full p-2">
                              <ZoomIn className="w-5 h-5 text-gray-800" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {sanitizeText(image.title)}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {sanitizeText(image.description)}
                      </p>
                      <div className="flex items-center justify-between">
                        {image.category && (
                          <Badge variant="secondary" className="text-xs">
                            {image.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        )}
                        {image.featured && (
                          <Badge className="text-xs bg-[#FF914D] text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                      {image.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {sanitizeText(tag.trim())}
                            </Badge>
                          ))}
                          {image.tags.split(',').length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{image.tags.split(',').length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 pb-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={pageNum === currentPage ? "bg-[#FF914D] text-white" : ""}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Next
            </Button>
          </div>
        )}

        {/* Modal */}
        {modalOpen && selectedImage && (
          <GalleryModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            image={selectedImage}
            images={filteredImages}
            currentIndex={currentImageIndex}
            onNavigate={navigateModal}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;