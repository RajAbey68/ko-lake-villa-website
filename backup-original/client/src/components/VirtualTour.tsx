import { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, ZoomIn, ZoomOut, Navigation, Eye } from 'lucide-react';

interface VirtualTourProps {
  roomId: string;
  roomName: string;
  panoramaUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VirtualTour({
  roomId,
  roomName,
  panoramaUrl,
  isOpen,
  onClose
}: VirtualTourProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!isOpen || !panoramaUrl) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      imageRef.current = image;
      setImageLoaded(true);
      drawPanorama();
    };
    image.src = panoramaUrl;
  }, [isOpen, panoramaUrl]);

  useEffect(() => {
    if (imageLoaded) {
      drawPanorama();
    }
  }, [rotation, zoom, imageLoaded]);

  const drawPanorama = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate image dimensions and positioning
    const imageWidth = image.width * zoom;
    const imageHeight = image.height * zoom;
    
    // Apply rotation offset (simulate 360-degree view)
    const offsetX = (rotation.y * imageWidth) / 360;
    const offsetY = (rotation.x * imageHeight) / 180;

    // Draw the panoramic image with wrapping effect
    for (let i = -1; i <= 1; i++) {
      ctx.drawImage(
        image,
        offsetX + (i * imageWidth) - (imageWidth - canvas.width) / 2,
        offsetY - (imageHeight - canvas.height) / 2,
        imageWidth,
        imageHeight
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.3)),
      y: (prev.y + deltaX * 0.3) % 360
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(3, prev * 1.2));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(0.5, prev / 1.2));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-black rounded-lg overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-semibold">{roomName}</h2>
              <p className="text-gray-300 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                360° Virtual Tour
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
            <button
              onClick={zoomOut}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <button
              onClick={resetView}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={zoomIn}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            <div className="w-px h-8 bg-white/30 mx-2" />
            
            <div className="text-white text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              <span>Drag to look around • Scroll to zoom</span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />

        {/* Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4" />
              <p>Loading virtual tour...</p>
            </div>
          </div>
        )}

        {/* Navigation Hint */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/70 text-sm">
          <div className="bg-black/60 rounded-lg p-3 max-w-xs">
            <p className="mb-2 font-medium">Navigation:</p>
            <ul className="space-y-1 text-xs">
              <li>• Click and drag to look around</li>
              <li>• Use mouse wheel to zoom</li>
              <li>• Double-click to reset view</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}