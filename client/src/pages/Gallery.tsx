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
      <section className="relative pt-32 pb-20 bg-[#1E4E5F]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-6">Photo Gallery</h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Take a visual tour of Ko Lake Villa and imagine yourself in this serene lakeside retreat.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-[#1E4E5F] text-white'
                    : 'bg-white text-[#1E4E5F] hover:bg-[#E6D9C7]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleCategoryChange('exterior')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'exterior'
                    ? 'bg-[#1E4E5F] text-white'
                    : 'bg-white text-[#1E4E5F] hover:bg-[#E6D9C7]'
                }`}
              >
                Exterior
              </button>
              <button
                onClick={() => handleCategoryChange('interior')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'interior'
                    ? 'bg-[#1E4E5F] text-white'
                    : 'bg-white text-[#1E4E5F] hover:bg-[#E6D9C7]'
                }`}
              >
                Interior
              </button>
              <button
                onClick={() => handleCategoryChange('activities')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'activities'
                    ? 'bg-[#1E4E5F] text-white'
                    : 'bg-white text-[#1E4E5F] hover:bg-[#E6D9C7]'
                }`}
              >
                Activities
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages?.map((image) => (
                <div 
                  key={image.id} 
                  className="overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openImageModal(image)}
                >
                  <img 
                    src={image.imageUrl} 
                    alt={image.alt} 
                    className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Image Modal */}
          <Dialog open={!!selectedImage} onOpenChange={() => closeImageModal()}>
            <DialogContent className="max-w-6xl bg-white p-4 rounded-lg">
              {selectedImage && (
                <div className="flex flex-col items-center">
                  <img 
                    src={selectedImage.imageUrl} 
                    alt={selectedImage.alt} 
                    className="max-h-[80vh] w-auto object-contain"
                  />
                  <p className="mt-2 text-[#333333] font-medium">{selectedImage.alt}</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#E6D9C7]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-[#1E4E5F] mb-6">Experience the Beauty in Person</h2>
          <p className="text-[#333333] max-w-2xl mx-auto mb-8">Photos can only capture a glimpse of the beauty that awaits you at Ko Lake Villa. Book your stay now to experience it firsthand.</p>
          <a href="/booking" className="inline-block bg-[#1E4E5F] text-white px-8 py-4 rounded text-lg font-medium hover:bg-[#E8B87D] transition-colors">Book Your Stay</a>
        </div>
      </section>
    </>
  );
};

export default Gallery;
