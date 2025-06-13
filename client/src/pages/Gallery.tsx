import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GalleryImage as GalleryImageType } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, Image as ImageIcon, Video, X, Play, ZoomIn } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="max-w-6xl max-h-full w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 text-white">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold">{image.title}</h3>
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

        {/* Media Content */}
        <div className="flex-1 flex items-center justify-center">
          {isVideo ? (
            <video
              src={image.imageUrl}
              controls
              className="max-w-full max-h-full"
              autoPlay
            />
          ) : (
            <img
              src={image.imageUrl}
              alt={image.alt || image.title}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-4">
          <Button 
            variant="outline"
            onClick={() => {
              const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
              onNavigate(prevIndex);
            }}
            className="text-white border-white hover:bg-white hover:text-black"
          >
            Previous
          </Button>

          <div className="text-center text-white flex-1 mx-4">
            {image.description && (
              <p className="text-sm">{image.description}</p>
            )}
            {image.tags && (
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {image.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag.trim()}
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
            className="text-white border-white hover:bg-white hover:text-black"
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

  // Fetch gallery images
  const { data: galleryImages, isLoading, error } = useQuery<GalleryImageType[]>({
    queryKey: ['/api/gallery'],
    staleTime: 5 * 60 * 1000,
  });

  // Filter images based on selected filters
  const filteredImages = galleryImages?.filter(image => {
    const categoryMatch = !selectedCategory || image.category === selectedCategory;
    const mediaTypeMatch = !selectedMediaType || 
      (selectedMediaType === 'image' && image.mediaType === 'image') ||
      (selectedMediaType === 'video' && (image.mediaType === 'video' || image.imageUrl?.includes('.mp4') || image.imageUrl?.includes('.mov')));
    
    return categoryMatch && mediaTypeMatch;
  }) || [];

  // Get unique categories
  const categories = [...new Set(galleryImages?.map(img => img.category).filter(Boolean))] as string[];

  const openModal = (image: GalleryImageType, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const navigateModal = (index: number) => {
    setCurrentImageIndex(index);
    setSelectedImage(filteredImages[index]);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => {
              const isVideo = image.mediaType === 'video' || image.imageUrl?.includes('.mp4') || image.imageUrl?.includes('.mov');
              
              return (
                <Card 
                  key={image.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                  onClick={() => openModal(image, index)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      {isVideo ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                          <video
                            src={image.imageUrl}
                            className="w-full h-full object-contain"
                            muted
                            poster=""
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                          <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                            <Video className="w-3 h-3 mr-1" />
                            Video
                          </Badge>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={image.imageUrl}
                            alt={image.alt || image.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {image.title}
                      </h3>
                      {image.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {image.description}
                        </p>
                      )}
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
                              {tag.trim()}
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
  );
};

export default Gallery;