import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GalleryImage } from '@shared/schema';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
                    {image.mediaType === 'video' ? (
                      <div className="relative">
                        <VideoThumbnail
                          videoUrl={image.imageUrl}
                          className="w-full h-40 md:h-56"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                          <div className="w-12 h-12 rounded-full bg-white bg-opacity-70 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF914D]">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={image.imageUrl} 
                        alt={image.alt} 
                        className="w-full h-40 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Use a generic placeholder if image fails to load
                          target.src = 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80';
                          console.log(`Gallery image failed to load: ${image.imageUrl}`);
                        }}
                      />
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
                  {selectedImage.mediaType === 'video' ? (
                    <div className="relative w-full max-w-3xl">
                      {selectedImage.imageUrl.startsWith('/uploads') ? (
                        // Local video file
                        <video 
                          src={selectedImage.imageUrl} 
                          className="max-h-[80vh] w-full object-contain rounded-md shadow-md"
                          controls
                          autoPlay
                        />
                      ) : selectedImage.imageUrl.includes('youtube.com') || selectedImage.imageUrl.includes('youtu.be') ? (
                        // YouTube embed
                        <div className="aspect-video w-full border border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#FF0000" stroke="none" className="mx-auto">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                            <p className="mt-2 text-gray-600">YouTube Video</p>
                            <a 
                              href={selectedImage.imageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-3 inline-block px-4 py-2 bg-[#FF914D] text-white rounded-full text-sm hover:bg-[#8B5E3C] transition-colors"
                            >
                              Open in YouTube
                            </a>
                          </div>
                        </div>
                      ) : (
                        // Other video
                        <video 
                          src={selectedImage.imageUrl} 
                          className="max-h-[80vh] w-full object-contain rounded-md shadow-md"
                          controls
                          autoPlay
                        />
                      )}
                    </div>
                  ) : (
                    <img 
                      src={selectedImage.imageUrl} 
                      alt={selectedImage.alt} 
                      className="max-h-[80vh] w-auto object-contain rounded-md shadow-md"
                    />
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    {selectedImage.mediaType === 'video' && (
                      <span className="px-2 py-1 bg-[#62C3D2] text-white text-xs rounded-full">
                        Video
                      </span>
                    )}
                    <p className="text-[#8B5E3C] font-medium text-lg">{selectedImage.alt}</p>
                  </div>
                  
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
