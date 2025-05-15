import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useToast } from '../../hooks/use-toast';
import SimpleImageUploadDialog from '../../components/SimpleImageUploadDialog';
import { 
  HomeIcon, 
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ImageIcon, 
  PlusIcon,
  TrashIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  PlayCircleIcon
} from 'lucide-react';

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string {
  try {
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  } catch (error) {
    console.error('Error extracting YouTube ID:', error);
    return '';
  }
}

// Simple GalleryImage type
type GalleryImage = {
  id: number;
  imageUrl: string;
  alt: string;
  description?: string;
  category: string;
  featured: boolean;
  mediaType?: string; // Can be "image" or "video"
  tags?: string;
  sortOrder?: number;
};

export default function AdminGallery() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#8B5E3C]">Gallery Management</h1>
          <Link href="/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <SimpleGalleryManager />
      </div>
    </ProtectedRoute>
  );
}

function SimpleGalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingImage, setAddingImage] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Load gallery images on component mount
  useEffect(() => {
    fetchImages();
  }, []);
  
  // Fetch images from the API
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/gallery');
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Sort images by sortOrder if available
      const sortedData = [...data].sort((a, b) => {
        // If sortOrder is defined for both, use it
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
          return a.sortOrder - b.sortOrder;
        }
        // If only one has sortOrder, prioritize the one with sortOrder
        if (a.sortOrder !== undefined) return -1;
        if (b.sortOrder !== undefined) return 1;
        // Otherwise keep original order
        return 0;
      });
      
      console.log("Fetched and sorted gallery images:", sortedData.slice(0, 3));
      setImages(sortedData);
      
      // Show user feedback
      toast({
        title: "Gallery loaded",
        description: `Found ${data.length} images in the gallery.`,
      });
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to load gallery images");
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Add a sample video
  const addSampleVideo = async () => {
    try {
      setLoading(true);
      setAddingImage(true);
      setAddSuccess(false);
      setError(null);
      
      // Show immediate feedback
      toast({
        title: "Adding sample video...",
        description: "Please wait while we add a sample video to your gallery.",
      });
      
      // Video data - using a popular tourism video
      const timestamp = Date.now();
      const sampleVideo = {
        uploadMethod: "url",
        imageUrl: "https://www.youtube.com/watch?v=cR-OPyeCtCQ", // Aerial view of Sri Lanka video
        alt: `Sri Lanka Tour Video ${new Date().toLocaleTimeString()}`,
        description: `Sample video added on ${new Date().toLocaleString()}`,
        category: "koggala-lake",
        tags: "video,tour,aerial,drone",
        featured: false,
        sortOrder: 0,
        mediaType: "video"
      };
      
      console.log("Adding sample video:", sampleVideo);
      
      // Send API request
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleVideo),
      });
      
      const responseText = await response.text();
      console.log("Video response from server:", response.status, responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to add video: ${response.status} - ${responseText}`);
      }
      
      // Show success message
      toast({
        title: "Video Added Successfully!",
        description: "Sample video has been added to your gallery",
        duration: 5000,
      });
      
      setAddSuccess(true);
      
      // Refresh the image list
      fetchImages();
    } catch (err: any) {
      console.error("Error adding sample video:", err);
      setError(err.message || "Failed to add sample video");
      toast({
        title: "Error",
        description: `Failed to add video: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setAddingImage(false);
    }
  };
  
  // Add a sample image
  const addSampleImage = async () => {
    try {
      setLoading(true);
      setAddingImage(true);
      setAddSuccess(false);
      setError(null);
      
      // Show immediate feedback
      toast({
        title: "Adding sample image...",
        description: "Please wait while we add a sample image to your gallery.",
      });
      
      // Sample image data with random variation to prevent duplicate detection
      const randomNum = Math.floor(Math.random() * 1000);
      const timestamp = Date.now();
      const sampleImage = {
        uploadMethod: "url",
        imageUrl: `https://images.unsplash.com/photo-1544957992-6ef475c58fb1?v=${randomNum}&t=${timestamp}`,
        alt: `Sample Image ${new Date().toLocaleTimeString()}`,
        description: `Sample image added on ${new Date().toLocaleString()} #${randomNum}`,
        category: "family-suite",
        tags: "sample,test",
        featured: false,
        sortOrder: 0,
        mediaType: "image"
      };
      
      console.log("Adding sample image:", sampleImage);
      
      // Send API request
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleImage),
      });
      
      const responseText = await response.text();
      console.log("Response from server:", response.status, responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to add image: ${response.status} - ${responseText}`);
      }
      
      // Show success message with more details
      toast({
        title: "Image Added Successfully!",
        description: (
          <div className="space-y-2">
            <p className="font-medium text-green-600 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Sample image has been added to your gallery
            </p>
            <p className="text-sm">Check below to see your updated gallery.</p>
          </div>
        ),
        duration: 5000,
      });
      
      // Mark as success
      setAddSuccess(true);
      
      // Refresh the image list
      await fetchImages();
      
    } catch (err: any) {
      console.error("Error adding sample image:", err);
      setError(`Failed to add image: ${err?.message || 'Unknown error'}`);
      
      toast({
        title: "Error Adding Image",
        description: (
          <div className="space-y-2">
            <p className="font-medium text-red-600 flex items-center">
              <AlertCircleIcon className="h-4 w-4 mr-1" />
              Failed to add sample image
            </p>
            <p className="text-sm">{err.message}</p>
          </div>
        ),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
      setAddingImage(false);
    }
  };
  
  // Delete an image
  const deleteImage = async (id: number) => {
    try {
      setLoading(true);
      
      // Send API request
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete image: ${response.status}`);
      }
      
      // Show success message
      toast({
        title: "Success!",
        description: "Image deleted from gallery",
      });
      
      // Refresh the image list
      fetchImages();
      
    } catch (err) {
      console.error("Error deleting image:", err);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Increase image priority
  const increasePriority = async (id: number) => {
    try {
      setLoading(true);
      
      // Send API request
      const response = await fetch(`/api/admin/gallery/${id}/priority/increase`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update priority: ${response.status}`);
      }
      
      // Show success message
      toast({
        title: "Success!",
        description: "Image priority increased",
      });
      
      // Refresh the image list
      fetchImages();
      
    } catch (err) {
      console.error("Error updating priority:", err);
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Decrease image priority
  const decreasePriority = async (id: number) => {
    try {
      setLoading(true);
      
      // Send API request
      const response = await fetch(`/api/admin/gallery/${id}/priority/decrease`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update priority: ${response.status}`);
      }
      
      // Show success message
      toast({
        title: "Success!",
        description: "Image priority decreased",
      });
      
      // Refresh the image list
      fetchImages();
      
    } catch (err) {
      console.error("Error updating priority:", err);
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gallery Images</CardTitle>
            <CardDescription>Manage your website gallery</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchImages}
              variant="outline"
              disabled={loading}
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setUploadDialogOpen(true)}
                className="bg-[#FF914D] hover:bg-[#e67e3d]"
                disabled={loading}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Image/Video
              </Button>
              
              <Button
                onClick={addSampleImage}
                variant="outline"
                disabled={loading}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Sample Image
              </Button>
              
              <Button
                variant="outline"
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                onClick={addSampleVideo}
              >
                <PlayCircleIcon className="h-4 w-4 mr-2" />
                Add Video
              </Button>


            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FF914D] border-r-transparent align-[-0.125em]" />
            <p className="mt-2 text-gray-600">Loading gallery...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        
        {!loading && !error && images.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No images</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new image to your gallery</p>
          </div>
        )}
        
        {/* Debug section to show image URLs for troubleshooting */}
        {!loading && !error && images.length > 0 && (
          <div className="bg-gray-100 p-4 mb-6 rounded-md">
            <h3 className="text-sm font-semibold mb-2">Debug: Latest Image</h3>
            <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(images[images.length - 1], null, 2)}
            </pre>
          </div>
        )}
        
        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group overflow-hidden rounded-lg border">
                {/* Show YouTube video embed if it's a video */}
                {image.mediaType === 'video' && image.imageUrl?.includes('youtube.com') ? (
                  <div className="aspect-video bg-gray-100">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(image.imageUrl)}`}
                      allowFullScreen
                      className="w-full h-48"
                      title={image.alt}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={image.imageUrl.startsWith('http') ? image.imageUrl : image.imageUrl} 
                      alt={image.alt}
                      className="w-full h-48 object-cover transition-all duration-300 group-hover:opacity-75"
                      onError={(e) => {
                        console.error("Image load error for URL:", image.imageUrl);
                        // On error, show placeholder
                        e.currentTarget.src = "https://via.placeholder.com/300x200?text=Image+Error";
                      }}
                    />
                    {/* Display image URL for debugging */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs overflow-hidden">
                      {image.imageUrl}
                    </div>
                  </div>
                )}
                
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    {image.mediaType === 'video' ? (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                        Video
                      </span>
                    ) : (
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded">
                        Image
                      </span>
                    )}
                    <h3 className="font-medium truncate">{image.alt}</h3>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{image.category}</p>
                  
                  {/* Tags display */}
                  {image.tags && typeof image.tags === 'string' && image.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {image.tags.split(',').map((tag, index) => {
                        const trimmedTag = tag.trim();
                        if (!trimmedTag) return null;
                        return (
                          <span key={index} className="px-2 py-0.5 bg-[#62C3D2] bg-opacity-20 text-[#62C3D2] text-xs rounded-full">
                            #{trimmedTag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Priority/Sorting controls */}
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <p className="mr-1">Priority:</p>
                    <div className="flex">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        title="Move up in priority"
                        onClick={() => increasePriority(image.id)}
                      >
                        <ArrowUpIcon className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        title="Move down in priority"
                        onClick={() => decreasePriority(image.id)}
                      >
                        <ArrowDownIcon className="h-3 w-3" />
                      </Button>
                      {image.sortOrder !== undefined && (
                        <span className="ml-2 text-xs text-gray-500">
                          {image.sortOrder}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => deleteImage(image.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Image Upload Dialog */}
      <SimpleImageUploadDialog 
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={fetchImages}
      />
    </Card>
  );
}