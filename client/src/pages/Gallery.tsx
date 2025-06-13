import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GalleryImage as GalleryImageType } from '@shared/schema';
import ZyrositeImage from '@/components/ZyrositeImage';
import GalleryImageLoader from '@/components/GalleryImageLoader';
import DirectImageDisplay from '@/components/DirectImageDisplay';
import { GalleryModal } from '@/components/GalleryModal';
import { FullscreenVideoModal } from '@/components/FullscreenVideoModal';

// Video Thumbnail Component
const VideoThumbnail = ({ videoUrl, className }: { videoUrl: string, className?: string }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if it's a YouTube URL and don't try to generate thumbnail
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      setError(true);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const generateThumbnail = () => {
      try {
        const context = canvas.getContext('2d');
        if (!context) return;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        setThumbnail(dataUrl);

        // Cleanup
        video.removeEventListener('loadeddata', handleVideoLoad);
        video.removeEventListener('seeked', generateThumbnail);
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        setError(true);
      }
    };

    const handleVideoLoad = () => {
      // Seek to the middle of the video for thumbnail
      if (video.duration) {
        video.currentTime = Math.min(1, video.duration / 4);
      } else {
        generateThumbnail();
      }
    };

    const handleError = () => {
      console.error('Error loading video:', videoUrl);
      setError(true);

      // Cleanup
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('seeked', generateThumbnail);
      video.removeEventListener('error', handleError);
    };

    // Set proper URL for local files
    let videoSrc = videoUrl;
    if (videoUrl.startsWith('/uploads')) {
      // Local file, use as is
      videoSrc = videoUrl;
    } else if (!videoUrl.startsWith('http')) {
      // External URL does not have protocol, add it
      videoSrc = 'https://' + videoUrl;
    }

    video.crossOrigin = 'anonymous';
    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('seeked', generateThumbnail);
    video.addEventListener('error', handleError);

    try {
      video.src = videoSrc;
      video.load();
    } catch (loadError) {
      console.error('Failed to load video:', loadError);
      setError(true);
    }

    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('seeked', generateThumbnail);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  // Determine if this is a YouTube URL
  const isYouTubeUrl = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

  if (isYouTubeUrl) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#FF0000" stroke="none">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          <span className="text-xs block mt-1">YouTube Video</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {error ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center px-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span className="text-xs text-gray-500 block mt-2">Video Preview Unavailable</span>
          </div>
        </div>
      ) : thumbnail ? (
        <img 
          src={thumbnail} 
          alt="Video thumbnail" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm text-gray-500">Loading thumbnail...</span>
        </div>
      )}
      <video 
        ref={videoRef} 
        className="hidden" 
        muted 
        preload="metadata"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);

  // Helper function to clean and format image URLs
  const getCleanImageUrl = (url: string) => {
    if (!url) {
      console.error('[Gallery] Empty image URL');
      return '/placeholder-image.jpg';
    }

    // Strip any existing query parameters
    if (url.includes('?')) {
      return url.split('?')[0];
    }

    return url;
  };

  // Fetch gallery images and process URLs
  const { data: galleryImages, isLoading, error } = useQuery<GalleryImageType[]>({
    queryKey: ['/api/gallery', selectedCategory],
    queryFn: async ({ queryKey }) => {
      const category = queryKey[1] as string | null;
      const url = category 
        ? `/api/gallery?category=${category}`
        : '/api/gallery';

      console.log('Fetching gallery images from:', url);
      const response = await fetch(url, { credentials: 'include' });

      if (!response.ok) throw new Error('Failed to fetch gallery images');

      const data = await response.json() as GalleryImageType[];
      console.log('Received gallery data:', data.length, 'images');

      // Process image URLs to use our proxy for external URLs
      return data.map((image) => ({
        ...image,
        // Store the original URL for reference
        originalImageUrl: image.imageUrl,
        // Use proxied URL for display only if needed
        imageUrl: image.imageUrl
      }));
    }
  });

  useEffect(() => {
    document.title = "Photo Gallery - Ko Lake Villa";
  }, []);

  // Category value mapping to match database values
const CATEGORY_MAPPING: Record<string, string> = {
  "All Villa": "entire-villa",
  "Family Suite": "family-suite",
  "Group Room": "group-room", 
  "Triple Room": "triple-room", 
  "Dining Area": "dining-area", 
  "Pool Deck": "pool-deck", 
  "Lake Garden": "lake-garden", 
  "Roof Garden": "roof-garden", 
  "Front Garden and Entrance": "front-garden", 
  "Koggala Lake Ahangama and Surrounding": "koggala-lake", 
  "Excursions": "excursions",
  "Events": "events",
  "Friends": "friends"
};

const handleCategoryChange = (category: string | null) => {
  // Convert display name to database value
  const dbCategory = category ? CATEGORY_MAPPING[category] || category : null;
  setSelectedCategory(dbCategory);
};

  const openImageModal = (image: GalleryImageType) => {
    if (!galleryImages) return;
    
    const imageIndex = galleryImages.findIndex(img => img.id === image.id);
    setSelectedImage(image);
    setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setModalOpen(false);
  };

  const handleModalNavigate = (direction: 'prev' | 'next') => {
    if (!galleryImages) return;

    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? galleryImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === galleryImages.length - 1 ? 0 : prev + 1
      );
    }
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
                onClick={() => handleCategoryChange('All Villa')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'All Villa'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                All Villa
              </button>
              <button
                onClick={() => handleCategoryChange('Family Suite')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'Family Suite'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Family Suite
              </button>
              <button
                onClick={() => handleCategoryChange('Group Room')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'Group Room'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Group Room
              </button>
              <button
                onClick={() => handleCategoryChange('Triple Room')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'Triple Room'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Triple Room
              </button>
              <button
                onClick={() => handleCategoryChange('Dining Area')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'dining-area'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Dining Area
              </button>
              <button
                onClick={() => handleCategoryChange('Pool Deck')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'Pool Deck'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Pool Deck
              </button>
              <button
                onClick={() => handleCategoryChange('Lake Garden')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'Lake Garden'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Lake Garden
              </button>
              <button
                onClick={() => handleCategoryChange('Roof Garden')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'Roof Garden'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Roof Garden
              </button>
              <button
                onClick={() => handleCategoryChange('Front Garden and Entrance')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'Front Garden and Entrance'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Front Garden & Entrance
              </button>
              <button
                onClick={() => handleCategoryChange('Koggala Lake Ahangama and Surrounding')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'Koggala Lake Ahangama and Surrounding'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Koggala Lake & Surrounding
              </button>
              <button
                onClick={() => handleCategoryChange('Excursions')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'excursions'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Excursions
              </button>
              <button
                onClick={() => handleCategoryChange('Events')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'events'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => handleCategoryChange('Friends')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'friends'
                    ? 'bg-[#8B5E3C] text-white'
                    : 'bg-white text-[#8B5E3C] hover:bg-[#A0B985]'
                }`}
              >
                Friends & Crew
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
            // Gallery grid with dynamic sizing based on image displaySize
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {galleryImages?.map((image) => (
                <div 
                  key={image.id} 
                  className={`group overflow-hidden rounded-lg cursor-pointer bg-white p-2 shadow-md border border-[#A0B985] 
                    hover:shadow-2xl hover:shadow-[#8B5E3C]/20 hover:border-[#8B5E3C] hover:-translate-y-2 hover:scale-105
                    transform transition-all duration-500 ease-out
                    ${image.displaySize === 'big' ? 'col-span-2 row-span-2 md:col-span-3 lg:col-span-4' : ''} 
                    ${image.displaySize === 'medium' ? 'col-span-1 md:col-span-1 lg:col-span-1' : ''}
                    ${image.displaySize === 'small' ? 'col-span-1' : ''}`
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Image clicked:', image.id, image.alt);
                    console.log('🖼️ Image data:', image);
                    console.log('📋 Current modal state before:', modalOpen);
                    console.log('🎯 Current index before:', currentImageIndex);
                    console.log('📦 Gallery images length:', galleryImages?.length);
                    openImageModal(image);
                    console.log('📋 Modal state after openImageModal:', modalOpen);
                  }}
                >
                  <div className="relative overflow-hidden rounded-md">
                    {(image.mediaType === 'video' || image.imageUrl?.endsWith('.mp4') || image.imageUrl?.endsWith('.mov')) ? (
                      <div className="relative w-full h-full">
                        <video
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          loop
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                          onError={(e) => {
                            console.error('Failed to load video:', image.imageUrl);
                          }}
                        >
                          <source src={image.imageUrl} type="video/mp4" />
                          <source src={image.imageUrl} type="video/quicktime" />
                        </video>
                        <div className="absolute top-2 right-2">
                          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-40 md:h-56 relative overflow-hidden bg-gray-50">
                        <img 
                          src={image.imageUrl}
                          alt={image.title || image.alt || "Ko Lake Villa"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          loading="lazy"
                          onError={(e) => {
                            console.error(`Error loading image: ${image.imageUrl}`);
                            // Try fallback to default image
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('default')) {
                              target.src = '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg';
                            }
                          }}
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.opacity = '1';
                          }}
                          style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                      flex items-end justify-center pb-4">
                          <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                              Click to view
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {image.featured && (
                      <span className="absolute top-2 right-2 bg-[#FF914D] text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    {image.mediaType === 'video' && (
                      <span className="absolute bottom-2 left-2 bg-[#62C3D2] text-white text-xs px-2 py-1 rounded-full">
                        Video
                      </span>
                    )}
                  </div>
                  <div className="pt-2 pb-1 px-1">
                    <p className="text-[#8B5E3C] font-medium truncate">{image.title || image.alt}</p>
                    {image.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{image.description}</p>
                    )}
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

          {/* Lightbox Modal for Gallery Images */}
          {(() => {
            console.log("🎭 Modal rendering check:");
            console.log("  - galleryImages exists:", !!galleryImages);
            console.log("  - galleryImages length:", galleryImages?.length);
            console.log("  - modalOpen:", modalOpen);
            console.log("  - currentImageIndex:", currentImageIndex);
            
            if (galleryImages && galleryImages.length > 0 && modalOpen) {
              console.log("✅ All conditions met, rendering modal");
              const currentImage = galleryImages[currentImageIndex];
              console.log("📷 Current image:", currentImage);
              
              if (!currentImage) {
                console.log("❌ No current image found at index:", currentImageIndex);
                return null;
              }
              
              const isVideo = currentImage && (
                currentImage.mediaType === 'video' || 
                currentImage.imageUrl?.endsWith('.mp4') || 
                currentImage.imageUrl?.endsWith('.mov')
              );
              
              console.log("🎬 Rendering", isVideo ? 'video' : 'image', 'modal');
              
              return isVideo ? (
                <FullscreenVideoModal 
                  image={currentImage}
                  images={galleryImages}
                  isOpen={modalOpen}
                  currentIndex={currentImageIndex}
                  onClose={closeImageModal}
                  onNavigate={handleModalNavigate}
                />
              ) : (
                <GalleryModal 
                  images={galleryImages}
                  isOpen={modalOpen}
                  currentIndex={currentImageIndex}
                  onClose={closeImageModal}
                  onNavigate={handleModalNavigate}
                />
              );
            } else {
              console.log("❌ Modal conditions not met");
              return null;
            }
          })()}
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