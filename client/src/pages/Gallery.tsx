import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GalleryImage } from '@shared/schema';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Fetch gallery images
  const { data: galleryImages, isLoading, error } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery', selectedCategory],
    queryFn: async ({ queryKey }) => {
      const category = queryKey[1] as string | null;
      const url = category 
        ? `/api/gallery?category=${category}`
        : '/api/gallery';
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch gallery images');
      return response.json();
    }
  });

  useEffect(() => {
    document.title = "Photo Gallery - Ko Lake Villa";
  }, []);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#8B5E3C]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-6">Photo Gallery</h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Take a visual tour of Ko Lake Villa and imagine yourself in this serene lakeside retreat.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-[#FDF6EE]">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-4">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleCategoryChange('family-suite')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'family-suite'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Family Suite
              </button>
              <button
                onClick={() => handleCategoryChange('group-room')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'group-room'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Group Room
              </button>
              <button
                onClick={() => handleCategoryChange('triple-room')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'triple-room'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Triple Room
              </button>
              <button
                onClick={() => handleCategoryChange('dining-area')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'dining-area'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Dining Area
              </button>
              <button
                onClick={() => handleCategoryChange('pool-deck')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'pool-deck'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Pool Deck
              </button>
              <button
                onClick={() => handleCategoryChange('lake-garden')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'lake-garden'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Lake Garden
              </button>
              <button
                onClick={() => handleCategoryChange('roof-garden')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'roof-garden'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Roof Garden
              </button>
              <button
                onClick={() => handleCategoryChange('front-garden')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'front-garden'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Front Garden & Entrance
              </button>
              <button
                onClick={() => handleCategoryChange('koggala-lake')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'koggala-lake'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Koggala Lake & Surrounding
              </button>
              <button
                onClick={() => handleCategoryChange('excursions')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'excursions'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Excursions
              </button>
            </div>
          </div>

          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg bg-gray-300 animate-pulse h-48 md:h-64"></div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-10">
              <p className="text-red-600 mb-4">Sorry, we couldn't load the gallery images.</p>
              <p>Please try again later or contact us directly.</p>
            </div>
          ) : (
            // Gallery grid
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {galleryImages?.map((image) => (
                <div 
                  key={image.id} 
                  className="group overflow-hidden rounded-lg cursor-pointer bg-white p-2 shadow-md border border-[#A0B985] hover:shadow-lg transition-all duration-300"
                  onClick={() => openImageModal(image)}
                >
                  <div className="relative overflow-hidden rounded-md">
                    <img 
                      src={image.imageUrl} 
                      alt={image.alt} 
                      className="w-full h-40 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {image.featured && (
                      <span className="absolute top-2 right-2 bg-[#FF914D] text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="pt-2 pb-1 px-1">
                    <p className="text-[#8B5E3C] font-medium truncate">{image.alt}</p>
                    <p className="text-xs text-[#62C3D2] mt-1">
                      {image.category
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Image Modal */}
          <Dialog open={!!selectedImage} onOpenChange={() => closeImageModal()}>
            <DialogContent className="max-w-6xl bg-[#FDF6EE] p-6 rounded-lg border-2 border-[#A0B985] shadow-xl">
              {selectedImage && (
                <div className="flex flex-col items-center">
                  <img 
                    src={selectedImage.imageUrl} 
                    alt={selectedImage.alt} 
                    className="max-h-[80vh] w-auto object-contain rounded-md shadow-md"
                  />
                  <p className="mt-4 text-[#8B5E3C] font-medium text-lg">{selectedImage.alt}</p>
                  
                  {/* Description if available */}
                  {selectedImage.description && (
                    <p className="mt-2 text-gray-600 text-center max-w-lg">
                      {selectedImage.description}
                    </p>
                  )}
                  
                  {/* Category badge */}
                  {selectedImage.category && (
                    <span className="mt-3 px-3 py-1 bg-[#A0B985] text-white text-sm rounded-full">
                      {selectedImage.category
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </span>
                  )}
                  
                  {/* Tags */}
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {selectedImage.tags.split(',').map((tag, index) => (
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
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#A0B985]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-[#8B5E3C] mb-6">Experience the Beauty in Person</h2>
          <p className="text-[#333333] max-w-2xl mx-auto mb-8">Photos can only capture a glimpse of the beauty that awaits you at Ko Lake Villa. Book your stay now to experience it firsthand.</p>
          <a href="/booking" className="inline-block bg-[#FF914D] text-white px-8 py-4 rounded text-lg font-medium hover:bg-[#8B5E3C] transition-colors shadow-md">Book Your Stay</a>
        </div>
      </section>
    </>
  );
};

export default Gallery;
