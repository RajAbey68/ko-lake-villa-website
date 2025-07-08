
import { useState, useEffect } from 'react';

interface GalleryImage {
  id: number;
  imageUrl: string;
  alt: string;
  category: string;
  mediaType: string;
}

export default function SimpleGalleryView() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Images' },
    { value: 'family-suite', label: 'Family Suite' },
    { value: 'group-room', label: 'Group Room' },
    { value: 'triple-room', label: 'Triple Room' },
    { value: 'dining-area', label: 'Dining Area' },
    { value: 'pool-deck', label: 'Pool Deck' },
    { value: 'lake-garden', label: 'Lake Garden' }
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm('Delete this image?')) return;
    
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  if (loading) return <div className="text-center py-8">Loading gallery...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#8B5E3C]">Gallery</h2>
      
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {image.mediaType === 'video' ? (
              <video 
                src={image.imageUrl} 
                className="w-full h-48 object-cover"
                controls
              />
            ) : (
              <img 
                src={image.imageUrl} 
                alt={image.alt}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold">{image.alt}</h3>
              <p className="text-sm text-gray-600">{image.category}</p>
              <button
                onClick={() => deleteImage(image.id)}
                className="mt-2 text-red-600 text-sm hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No images found in this category
        </div>
      )}
    </div>
  );
}
