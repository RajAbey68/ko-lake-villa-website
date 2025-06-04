import { useState } from 'react';
import { X, Play, Eye, MapPin } from 'lucide-react';
import VirtualTour from './VirtualTour';

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomData: {
    id: string;
    name: string;
    description: string;
    panoramaUrl: string;
    thumbnailUrl: string;
    features: string[];
  };
}

export default function VirtualTourModal({ isOpen, onClose, roomData }: VirtualTourModalProps) {
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  if (!isOpen) return null;

  const handleStartTour = () => {
    setShowVirtualTour(true);
  };

  const handleCloseTour = () => {
    setShowVirtualTour(false);
  };

  return (
    <>
      {/* Preview Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="relative">
            <img 
              src={roomData.thumbnailUrl} 
              alt={roomData.name}
              className="w-full h-64 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl font-bold mb-1">{roomData.name}</h2>
              <p className="text-gray-200 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ko Lake Villa, Ahangama
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-4">{roomData.description}</p>
            
            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Room Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {roomData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Start Tour Button */}
            <button
              onClick={handleStartTour}
              className="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 font-semibold"
            >
              <Eye className="w-5 h-5" />
              Start 360° Virtual Tour
              <Play className="w-4 h-4" />
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              Click and drag to explore • Use mouse wheel to zoom
            </p>
          </div>
        </div>
      </div>

      {/* Virtual Tour Component */}
      {showVirtualTour && (
        <VirtualTour
          roomId={roomData.id}
          roomName={roomData.name}
          panoramaUrl={roomData.panoramaUrl}
          isOpen={showVirtualTour}
          onClose={handleCloseTour}
        />
      )}
    </>
  );
}