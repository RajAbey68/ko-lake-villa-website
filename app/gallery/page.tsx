"use client"

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Image as ImageIcon, Video, X, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

// Define the type for a single gallery image
interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  mediaType: 'image' | 'video';
  tags?: string;
  alt?: string;
}

// --- Gallery Modal Component ---
interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: GalleryImage;
  images: GalleryImage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const GalleryModal = ({ isOpen, onClose, image, images, currentIndex, onNavigate }: GalleryModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
      else if (e.key === 'ArrowRight') onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen) return null;

  const isVideo = image.mediaType === 'video';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col animate-fadeIn">
      <div className="flex justify-between items-center p-4 text-white bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold">{image.title}</h3>
          <Badge variant="secondary" className="bg-[#FF914D] text-white capitalize">{image.category.replace('-', ' ')}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">{currentIndex + 1} of {images.length}</span>
          <Button variant="outline" size="icon" onClick={onClose} className="bg-transparent text-white border-white hover:bg-white hover:text-black">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        {isVideo ? (
          <video src={image.imageUrl} controls autoPlay muted playsInline className="max-w-full max-h-full object-contain" />
        ) : (
          <Image src={image.imageUrl} alt={image.alt || image.title} width={1920} height={1080} className="max-w-full max-h-full object-contain" />
        )}
      </div>

      <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white p-4">
        <div className="flex justify-between items-center gap-4">
          <Button onClick={() => onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1)} className="text-white border-white hover:bg-white hover:text-black" variant="outline">Previous</Button>
          <div className="text-center flex-1 mx-4">
            <p className="text-sm mb-2">{image.description}</p>
            {image.tags && <div className="flex flex-wrap justify-center gap-1">{image.tags.split(',').map((tag, index) => <Badge key={index} variant="outline" className="text-xs">{tag.trim()}</Badge>)}</div>}
          </div>
          <Button onClick={() => onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0)} className="text-white border-white hover:bg-white hover:text-black" variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
};


// --- Main Gallery Page Component ---
export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; index: number }>({ isOpen: false, index: 0 });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [imagesRes, categoriesRes] = await Promise.all([
          fetch('/api/gallery'),
          fetch('/api/gallery/categories'),
        ]);
        if (!imagesRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch gallery data.');
        
        const imagesData = await imagesRes.json();
        const categoriesData = await categoriesRes.json();

        setGalleryImages(imagesData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized filtering logic
  const filteredImages = useMemo(() => {
    return galleryImages.filter(image => {
      const categoryMatch = !selectedCategory || image.category === selectedCategory;
      const mediaTypeMatch = !selectedMediaType || image.mediaType === selectedMediaType;
      return categoryMatch && mediaTypeMatch;
    });
  }, [galleryImages, selectedCategory, selectedMediaType]);

  const openModal = (index: number) => setModalState({ isOpen: true, index });
  const closeModal = () => setModalState({ isOpen: false, index: 0 });
  const navigateModal = (index: number) => setModalState({ isOpen: true, index });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF914D] animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading Gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Gallery</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8B5E3C] mb-4">Ko Lake Villa Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore our beautiful villa, stunning lake views, and memorable moments that promise to help you relax, revive, and reconnect.</p>
        </div>

        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <Button size="sm" onClick={() => setSelectedCategory(null)} variant={!selectedCategory ? 'default' : 'outline'} className={!selectedCategory ? "bg-[#FF914D] text-white" : ""}>All</Button>
              {categories.map(cat => (
                <Button key={cat} size="sm" onClick={() => setSelectedCategory(cat)} variant={selectedCategory === cat ? 'default' : 'outline'} className={`${selectedCategory === cat ? "bg-[#FF914D] text-white" : ""} capitalize`}>{cat.replace('-', ' ')}</Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <Button size="sm" onClick={() => setSelectedMediaType(null)} variant={!selectedMediaType ? 'default' : 'outline'} className={!selectedMediaType ? "bg-[#FF914D] text-white" : ""}>All</Button>
              <Button size="sm" onClick={() => setSelectedMediaType('image')} variant={selectedMediaType === 'image' ? 'default' : 'outline'} className={selectedMediaType === 'image' ? "bg-[#FF914D] text-white" : ""}>
                <ImageIcon className="w-4 h-4 mr-2" />Images
              </Button>
              <Button size="sm" onClick={() => setSelectedMediaType('video')} variant={selectedMediaType === 'video' ? 'default' : 'outline'} className={selectedMediaType === 'video' ? "bg-[#FF914D] text-white" : ""}>
                <Video className="w-4 h-4 mr-2" />Videos
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mb-8 text-gray-600">
          Showing {filteredImages.length} items
        </div>

        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div key={image.id} onClick={() => openModal(index)} className="group cursor-pointer block bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                <div className="relative w-full h-56">
                  <Image src={image.imageUrl} alt={image.alt || image.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">{image.title}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{image.title}</h3>
                  <p className="text-gray-600 text-sm truncate">{image.description}</p>
                  <Badge variant="secondary" className="mt-2 capitalize">{image.category.replace('-', ' ')}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No items match your selected filters.</p>
          </div>
        )}
      </div>

      {modalState.isOpen && filteredImages.length > 0 && (
        <GalleryModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          image={filteredImages[modalState.index]}
          images={filteredImages}
          currentIndex={modalState.index}
          onNavigate={navigateModal}
        />
      )}
    </div>
  );
}
