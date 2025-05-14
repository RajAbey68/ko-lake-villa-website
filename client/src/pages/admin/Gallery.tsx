import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useToast } from '../../hooks/use-toast';
import { 
  HomeIcon, 
  ArrowLeftIcon,
  ImageIcon, 
  PlusIcon,
  TrashIcon,
  RefreshCwIcon
} from 'lucide-react';

// Simple GalleryImage type
type GalleryImage = {
  id: number;
  imageUrl: string;
  alt: string;
  description?: string;
  category: string;
  featured: boolean;
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
      setImages(data);
      
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
  
  // Add a sample image
  const addSampleImage = async () => {
    try {
      setLoading(true);
      
      // Sample image data
      const sampleImage = {
        uploadMethod: "url",
        imageUrl: `https://images.unsplash.com/photo-1544957992-6ef475c58fb1?timestamp=${Date.now()}`,
        alt: "Sample Image " + new Date().toLocaleTimeString(),
        description: "Sample image added on " + new Date().toLocaleString(),
        category: "family-suite",
        tags: "sample",
        featured: false,
        sortOrder: 0,
        mediaType: "image"
      };
      
      // Send API request
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleImage),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add image: ${response.status}`);
      }
      
      // Show success message
      toast({
        title: "Success!",
        description: "Sample image added to gallery",
      });
      
      // Refresh the image list
      fetchImages();
      
    } catch (err) {
      console.error("Error adding sample image:", err);
      toast({
        title: "Error",
        description: "Failed to add sample image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            <Button
              onClick={addSampleImage}
              className="bg-[#FF914D] hover:bg-[#e67e3d]"
              disabled={loading}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Sample Image
            </Button>
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
        
        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group overflow-hidden rounded-lg border">
                <img 
                  src={image.imageUrl} 
                  alt={image.alt}
                  className="w-full h-48 object-cover transition-all duration-300 group-hover:opacity-75"
                  onError={(e) => {
                    // On error, show placeholder
                    e.currentTarget.src = "https://via.placeholder.com/300x200?text=Image+Error";
                  }}
                />
                <div className="p-3">
                  <h3 className="font-medium truncate">{image.alt}</h3>
                  <p className="text-sm text-gray-500 truncate">{image.category}</p>
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
    </Card>
  );
}