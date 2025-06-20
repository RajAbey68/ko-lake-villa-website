import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Users, Square, Wifi, Bath, Coffee, Car, Eye } from 'lucide-react';
import { Room } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface RoomDetailsModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (room: { name: string; price: number }) => void;
  onVirtualTour: (roomName: string) => void;
}

export function RoomDetailsModal({ room, isOpen, onClose, onBookNow, onVirtualTour }: RoomDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Map room names to gallery categories
  const getRoomCategory = (roomName: string) => {
    if (roomName.includes('KLV1') || roomName.includes('Family Suite')) return 'family-suite';
    if (roomName.includes('KLV3') || roomName.includes('Triple')) return 'triple-room';
    if (roomName.includes('KLV6') || roomName.includes('Group')) return 'group-room';
    if (roomName.includes('Villa')) return 'entire-villa';
    return 'family-suite'; // default
  };

  // Fetch gallery images for this room category - must be called before any conditional returns
  const { data: galleryImages = [] } = useQuery({
    queryKey: ['/api/gallery', getRoomCategory(room?.name || '')],
    queryFn: async () => {
      if (!room) return [];
      const category = getRoomCategory(room.name);
      const response = await fetch(`/api/gallery?category=${category}`);
      if (!response.ok) throw new Error('Failed to fetch gallery images');
      return response.json();
    },
    enabled: isOpen && !!room
  });

  // Reset image index when modal opens or room changes
  useEffect(() => {
    if (isOpen && room) {
      setCurrentImageIndex(0);
    }
  }, [room?.id, isOpen]);

  if (!isOpen || !room) return null;

  // Extract image URLs from gallery data
  const images = galleryImages
    .filter(item => item.mediaType === 'image')
    .map(item => item.imageUrl)
    .filter(url => url && !url.includes('/test/')) // Exclude test images
    .slice(0, 6); // Limit to 6 images for performance

  // Fallback to a default image if no images available
  const finalImages = images.length > 0 ? images : ['/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % finalImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + finalImages.length) % finalImages.length);
  };

  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return <Wifi className="w-4 h-4" />;
    if (lowerFeature.includes('bathroom') || lowerFeature.includes('bath')) return <Bath className="w-4 h-4" />;
    if (lowerFeature.includes('kitchenette') || lowerFeature.includes('kitchen')) return <Coffee className="w-4 h-4" />;
    if (lowerFeature.includes('parking') || lowerFeature.includes('car')) return <Car className="w-4 h-4" />;
    if (lowerFeature.includes('balcony') || lowerFeature.includes('terrace')) return <MapPin className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  const getRoomDescription = (roomName: string) => {
    if (roomName.includes('KLV1') || roomName.includes('Family Suite')) {
      return {
        title: 'Master Family Suite',
        description: 'Spacious family suite with stunning lake views, separate living area, and premium amenities. Perfect for families seeking luxury and comfort at Ko Lake Villa.',
        highlights: [
          'Panoramic lake views from private balcony',
          'Separate living and sleeping areas',
          'Premium bathroom with lake view',
          'Air conditioning and ceiling fans',
          'Complimentary WiFi throughout'
        ]
      };
    } else if (roomName.includes('KLV3') || roomName.includes('Triple')) {
      return {
        title: 'Comfortable Triple Room',
        description: 'Comfortable triple occupancy room with modern amenities and peaceful garden views. Ideal for small groups or families visiting Ko Lake Villa.',
        highlights: [
          'Triple bed configuration or twin plus single',
          'Modern en-suite bathroom',
          'Garden and partial lake views',
          'Air conditioning and natural ventilation',
          'Work desk and seating area'
        ]
      };
    } else if (roomName.includes('KLV6') || roomName.includes('Group')) {
      return {
        title: 'Spacious Group Room',
        description: 'Large group accommodation perfect for extended families or friends traveling together. Multiple sleeping arrangements with shared facilities.',
        highlights: [
          'Multiple bed configurations for up to 6 guests',
          'Shared bathroom facilities',
          'Common seating and relaxation area',
          'Lake and garden views',
          'Perfect for group bonding experiences'
        ]
      };
    } else {
      return {
        title: 'Entire Villa Experience',
        description: 'Exclusive access to the complete Ko Lake Villa property with all amenities, perfect for large groups, events, or those seeking ultimate privacy.',
        highlights: [
          'Complete villa exclusivity for up to 25 guests',
          'All bedrooms, suites, and common areas',
          '60-foot infinity pool and pool deck',
          'Multiple terraces and outdoor spaces',
          'Full kitchen facilities and dining areas'
        ]
      };
    }
  };

  const roomInfo = getRoomDescription(room.name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-[#1E4E5F]">{roomInfo.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-video bg-gray-200 flex items-center justify-center">
            <img
              src={finalImages[currentImageIndex]}
              alt={`${room.name} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              style={{ 
                objectFit: 'contain',
                objectPosition: 'center'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
              }}
            />
          </div>

          {finalImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image indicators */}
          {finalImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {finalImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Description */}
            <div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {roomInfo.description}
              </p>

              <h3 className="text-lg font-semibold text-[#1E4E5F] mb-4">Room Highlights</h3>
              <ul className="space-y-2 mb-6">
                {roomInfo.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-[#E8B87D] rounded-full mt-2"></div>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Details */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#1E4E5F] mb-4">Room Details</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-[#E8B87D]" />
                    <span className="text-gray-700">Up to {room.capacity} guests</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Square className="w-5 h-5 text-[#E8B87D]" />
                    <span className="text-gray-700">{room.size}m² floor area</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-[#E8B87D]" />
                    <span className="text-gray-700">Lakefront location</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#1E4E5F] mb-4">Amenities & Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {getFeatureIcon(feature)}
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => onVirtualTour(room.name)}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>360° Virtual Tour</span>
                </Button>

                <Button
                  onClick={() => onBookNow({ name: room.name, price: room.price })}
                  className="w-full bg-[#E8B87D] hover:bg-[#1E4E5F] text-white"
                >
                  Book This Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailsModal;