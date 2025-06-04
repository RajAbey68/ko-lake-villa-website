import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
}

const VirtualTourModal = ({ isOpen, onClose, roomName }: VirtualTourModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Virtual tour data using authentic iPhone photos from Ko Lake Villa
  const virtualTours = {
    'KLV1 - Master Family Suite': {
      images: [
        '/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg',
        '/uploads/gallery/family-suite/KoggalaNinePeaks_family-suite_0.png',
        '/uploads/gallery/family-suite/family-suite-view.jpg'
      ],
      description: 'Spacious family suite with lake views and premium amenities',
      features: ['Separate living area', 'Master bedroom', 'Lake views', 'Private balcony', 'Kitchenette']
    },
    'KLV3 - Triple/Twin Room': {
      images: [
        '/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg',
        '/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_1.jpg',
        '/uploads/gallery/triple-room/triple-room-interior.jpg'
      ],
      description: 'Comfortable triple occupancy room with modern amenities and garden views',
      features: ['Three comfortable beds', 'Air conditioning', 'Private bathroom', 'Garden views', 'Free WiFi']
    },
    'KLV6 - Group Room': {
      images: [
        '/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg',
        '/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_1.jpg',
        '/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_0.jpg'
      ],
      description: 'Spacious group accommodation with access to pool deck and dining areas',
      features: ['Group accommodation', 'Pool access', 'Dining area access', 'Multiple sleeping areas', 'Shared facilities']
    },
    'KLV - Entire Villa': {
      images: [
        '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg',
        '/uploads/gallery/default/1747315800201-804896726-20250418_070740.jpg',
        '/uploads/gallery/dining-area/cake-1.jpg',
        '/uploads/gallery/lake-garden/KoLakeHouse_lake-garden_0.jpg'
      ],
      description: 'Complete Ko Lake Villa experience with all rooms and facilities',
      features: ['Entire villa access', 'All room types', 'Pool deck', 'Dining areas', 'Lake garden', 'Private grounds']
    }
  };

  const currentTour = virtualTours[roomName as keyof typeof virtualTours];

  if (!isOpen || !currentTour) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentTour.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentTour.images.length) % currentTour.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-[#1E4E5F]">Virtual Tour - {roomName}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Image Viewer */}
        <div className="relative">
          <img
            src={currentTour.images[currentImageIndex]}
            alt={`${roomName} - View ${currentImageIndex + 1}`}
            className="w-full h-96 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
            }}
          />
          
          {/* Navigation Arrows */}
          {currentTour.images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                onClick={prevImage}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={nextImage}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded">
            {currentImageIndex + 1} / {currentTour.images.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">{currentTour.description}</p>
          
          <div>
            <h3 className="font-semibold text-[#1E4E5F] mb-2">Features & Amenities:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {currentTour.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-[#C49B7C] rounded-full mr-2"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {currentTour.images.length > 1 && (
            <div className="mt-6">
              <h4 className="font-semibold text-[#1E4E5F] mb-3">View Different Angles:</h4>
              <div className="flex gap-2 overflow-x-auto">
                {currentTour.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-[#C49B7C]' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualTourModal;