import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import TaggingDialog from '../../components/TaggingDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  ArrowLeft as BackIcon,
  Upload as UploadIcon,
  CheckCircle as SuccessIcon,
  AlertCircle as ErrorIcon,
  Loader as LoadingIcon,
  Home as HomeIcon,
  Image as ImageIcon,
  Trash2 as TrashIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Textarea } from "../../components/ui/textarea";

// Define the gallery categories to match your requirements
const GALLERY_CATEGORIES = [
  "Entire Villa",
  "Family Suite",
  "Group Room", 
  "Triple Room", 
  "Dining Area", 
  "Pool Deck", 
  "Lake Garden", 
  "Roof Garden", 
  "Front Garden", 
  "Koggala Lake", 
  "Excursions"
];

// Define category value mappings for URL slugs
export const CATEGORY_VALUES = {
  "Entire Villa": "entire-villa",
  "Family Suite": "family-suite",
  "Group Room": "group-room", 
  "Triple Room": "triple-room", 
  "Dining Area": "dining-area", 
  "Pool Deck": "pool-deck", 
  "Lake Garden": "lake-garden", 
  "Roof Garden": "roof-garden", 
  "Front Garden": "front-garden", 
  "Koggala Lake": "koggala-lake", 
  "Excursions": "excursions"
};

export default function GalleryUploader() {
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [category, setCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [displaySize, setDisplaySize] = useState<string>("medium");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [clearing, setClearing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{url: string; name: string; id?: number}[]>([]);
  const [showTaggingDialog, setShowTaggingDialog] = useState<boolean>(false);
  const [currentImageForTagging, setCurrentImageForTagging] = useState<{url: string; name: string; id?: number} | null>(null);
  
  // Authentication check
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/admin/login');
    }
    
    if (!isLoading && currentUser && !isAdmin) {
      navigate('/');
    }
  }, [currentUser, isLoading, isAdmin, navigate]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      // Reset any previous messages
      setMessage(null);
    }
  };
  
  const handleClearGallery = async () => {
    if (!confirm("Are you sure you want to clear ALL images from the gallery? This action cannot be undone.")) {
      return;
    }
    
    setClearing(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/gallery/clear-all', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear gallery');
      }
      
      const data = await response.json();
      setMessage({ 
        type: 'success', 
        text: `Successfully cleared gallery. Removed ${data.count} images.` 
      });
      
    } catch (error) {
      console.error('Gallery clearing error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unknown error occurred while clearing the gallery.' 
      });
    } finally {
      setClearing(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one image to upload.' });
      return;
    }
    
    setUploading(true);
    setMessage(null);
    setUploadProgress(0);
    
    try {
      const totalFiles = selectedFiles.length;
      const uploadedFiles = [];
      
      // Process files in smaller batches to avoid timeouts
      const batchSize = 3; // Process 3 files at a time
      const totalBatches = Math.ceil(totalFiles / batchSize);
      
      // Show initial status message for large uploads
      if (totalFiles > 5) {
        setMessage({
          type: 'info',
          text: `Processing ${totalFiles} files. This may take a few minutes. Please don't close this window.`
        });
      }
      
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStart = batchIndex * batchSize;
        const batchEnd = Math.min(batchStart + batchSize, totalFiles);
        const currentBatchSize = batchEnd - batchStart;
        
        // Process this batch in parallel
        const batchPromises = [];
        
        for (let j = 0; j < currentBatchSize; j++) {
          const fileIndex = batchStart + j;
          const file = selectedFiles[fileIndex];
          
          // Create a promise for each file upload
          const uploadPromise = (async () => {
            // Check file size first
            if (file.size === 0) {
              console.error(`File ${file.name} has 0 bytes size, skipping`);
              return {
                name: file.name,
                success: false,
                error: "File has 0 bytes size - invalid image file"
              };
            }
            
            // Create FormData with file
            const formData = new FormData();
            formData.append('image', file);
            formData.append('category', category);
            formData.append('description', description);
            formData.append('alt', file.name.split('.')[0]); // Use filename as alt text
            formData.append('featured', isFeatured.toString());
            formData.append('displaySize', displaySize);
            formData.append('sortOrder', (fileIndex + 1).toString());
            
            console.log(`Uploading file: ${file.name}, size: ${(file.size / 1024).toFixed(2)} KB`);
            
            try {
              // Use XMLHttpRequest for better control over upload progress
              return new Promise((resolve) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/gallery/upload', true);
                
                xhr.onload = function() {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    resolve({
                      url: data.data.imageUrl,
                      name: file.name,
                      id: data.data.id,
                      success: true
                    });
                  } else {
                    console.error(`Upload failed for ${file.name} with status ${xhr.status}`);
                    resolve({
                      name: file.name,
                      success: false,
                      error: `Server returned ${xhr.status}: ${xhr.statusText}`
                    });
                  }
                };
                
                xhr.onerror = function() {
                  console.error(`Network error during upload of ${file.name}`);
                  resolve({
                    name: file.name,
                    success: false,
                    error: "Network error during upload"
                  });
                };
                
                xhr.send(formData);
              });
            } catch (error) {
              console.error(`Error uploading ${file.name}:`, error);
              return {
                name: file.name,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          })();
          
          batchPromises.push(uploadPromise);
        }
        
        // Wait for this batch to complete
        const batchResults = await Promise.all(batchPromises);
        
        // Process results from this batch
        for (const result of batchResults) {
          if (result && typeof result === 'object' && 'success' in result) {
            const typedResult = result as { 
              success: boolean; 
              url?: string; 
              name?: string;
              error?: string;
            };
            
            if (typedResult.success && typedResult.url && typedResult.name) {
              uploadedFiles.push({
                url: typedResult.url,
                name: typedResult.name,
                id: typedResult.id
              });
            } else {
              // Report failed uploads to the user
              console.error(`Failed to upload ${typedResult.name || 'file'}: ${typedResult.error || 'Unknown error'}`);
              setMessage({
                type: 'warning',
                text: `Some files failed to upload. Check the browser console for details.`
              });
            }
          }
        }
        
        // Update progress based on completed batches
        const completedFiles = batchEnd;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
        
        // Add a small delay between batches to prevent server overload
        if (batchIndex < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setUploadedImages(uploadedFiles);
      setMessage({ 
        type: 'success', 
        text: `Successfully uploaded ${totalFiles} image${totalFiles > 1 ? 's' : ''} to the ${category} category. Click on any image to add SEO tags.` 
      });
      
      // Show the first uploaded image for SEO tagging if only one image was uploaded
      if (uploadedFiles.length === 1) {
        setCurrentImageForTagging(uploadedFiles[0]);
        setShowTaggingDialog(true);
      }
      
      // Reset form
      setSelectedFiles(null);
      setDescription('');
      setIsFeatured(false);
      
      // Reset file input value
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unknown error occurred during upload.' 
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle SEO tagging dialog save
  const handleSaveTagging = async (tagData: {
    title: string;
    description: string;
    category: string;
    tags: string;
    featured: boolean;
  }) => {
    if (!currentImageForTagging?.id) return;

    try {
      const response = await fetch(`/api/gallery/${currentImageForTagging.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alt: tagData.title,
          description: tagData.description,
          category: tagData.category,
          tags: tagData.tags,
          featured: tagData.featured
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update image metadata');
      }

      setMessage({
        type: 'success',
        text: `SEO metadata saved for ${currentImageForTagging.name}`
      });

    } catch (error) {
      console.error('Error saving SEO metadata:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save SEO metadata'
      });
    }

    setShowTaggingDialog(false);
    setCurrentImageForTagging(null);
  };

  // Handle clicking on uploaded image to add SEO tags
  const handleImageClick = (image: {url: string; name: string; id?: number}) => {
    setCurrentImageForTagging(image);
    setShowTaggingDialog(true);
  };
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDF6EE]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF914D]"></div>
          <p className="mt-4 text-lg text-[#8B5E3C]">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not logged in, don't render anything (redirect will happen)
  if (!currentUser || !isAdmin) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-8 flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate('/admin')}
          >
            <BackIcon className="h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-[#8B5E3C]">Gallery Image Uploader</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="md:col-span-2">
            <Card className="bg-white border border-[#A0B985]/20">
              <CardHeader>
                <CardTitle className="text-[#8B5E3C]">Upload New Images</CardTitle>
                <CardDescription>
                  Upload images to the Ko Lake Villa gallery. Images will be added to the selected category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Select Images</Label>
                    <Input 
                      id="image-upload" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500">
                      You can select multiple images at once. Supported formats: JPG, PNG, WebP.
                    </p>
                    {selectedFiles && (
                      <p className="text-sm font-medium text-[#FF914D]">
                        {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                  
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Image Category</Label>
                    <Select 
                      value={category} 
                      onValueChange={setCategory}
                      disabled={uploading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {GALLERY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a description for these images"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={uploading}
                      className="resize-none"
                    />
                  </div>
                  
                  {/* Image Display Size */}
                  <div className="space-y-2">
                    <Label htmlFor="displaySize">Image Display Size</Label>
                    <Select 
                      value={displaySize || "medium"} 
                      onValueChange={setDisplaySize}
                      disabled={uploading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select image size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="big">Big (Full Page Width)</SelectItem>
                        <SelectItem value="medium">Medium (1/3 of Page)</SelectItem>
                        <SelectItem value="small">Small (Thumbnail)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      Choose how large this image should appear in the gallery.
                    </p>
                  </div>
                  
                  {/* Featured Image */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="featured" 
                      checked={isFeatured} 
                      onCheckedChange={(checked) => setIsFeatured(checked === true)}
                      disabled={uploading}
                    />
                    <Label 
                      htmlFor="featured" 
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Mark as featured image (will appear in highlighted sections)
                    </Label>
                  </div>
                  
                  {/* Status Message */}
                  {message && (
                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                      {message.type === 'success' ? (
                        <SuccessIcon className="h-4 w-4" />
                      ) : (
                        <ErrorIcon className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {message.type === 'success' ? 'Success' : 'Error'}
                      </AlertTitle>
                      <AlertDescription>
                        {message.text}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Progress Bar */}
                  {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-[#FF914D] h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                      <p className="text-sm text-gray-500 mt-1">
                        Uploading: {uploadProgress}% complete
                      </p>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-[#FF914D] hover:bg-[#FF914D]/90 text-white"
                    disabled={uploading || !selectedFiles}
                  >
                    {uploading ? (
                      <>
                        <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload to Gallery
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Links & Recently Uploaded */}
          <div>
            <div className="space-y-6">
              {/* Quick Links */}
              <Card className="bg-white border border-[#A0B985]/20">
                <CardHeader>
                  <CardTitle className="text-[#8B5E3C]">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/admin')}
                    >
                      <HomeIcon className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/admin/gallery')}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Gallery Manager
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/gallery')}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      View Public Gallery
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start mt-4"
                      onClick={handleClearGallery}
                      disabled={clearing}
                    >
                      {clearing ? (
                        <>
                          <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />
                          Clearing Gallery...
                        </>
                      ) : (
                        <>
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Clear All Gallery Images
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recently Uploaded */}
              {uploadedImages.length > 0 && (
                <Card className="bg-white border border-[#A0B985]/20">
                  <CardHeader>
                    <CardTitle className="text-[#8B5E3C]">Recently Uploaded</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((image, index) => (
                        <div 
                          key={index} 
                          className="relative group cursor-pointer"
                          onClick={() => handleImageClick(image)}
                        >
                          <img 
                            src={image.url} 
                            alt={image.name}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-md flex items-center justify-center">
                            <div className="text-white text-xs opacity-0 group-hover:opacity-100 text-center px-1">
                              <p className="font-medium">{image.name}</p>
                              <p className="text-xs mt-1">Click to add SEO tags</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        {/* Category Guidance */}
        <Card className="bg-white border border-[#A0B985]/20 mt-8">
          <CardHeader>
            <CardTitle className="text-[#8B5E3C]">Category Guide</CardTitle>
            <CardDescription>
              Use the following guide when uploading images to ensure they are properly categorized:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GALLERY_CATEGORIES.map((cat, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="bg-[#FF914D]/10 p-1 rounded-full">
                    <ImageIcon className="h-4 w-4 text-[#FF914D]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#8B5E3C]">{cat}</p>
                    <p className="text-sm text-[#8B5E3C]/70">
                      Images related to {cat.toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#A0B985]/20 text-center">
          <p className="text-sm text-[#8B5E3C]/60">
            &copy; {new Date().getFullYear()} Ko Lake Villa Admin Portal
          </p>
        </div>
      </div>

      {/* SEO Tagging Dialog */}
      <TaggingDialog
        isOpen={showTaggingDialog}
        onClose={() => {
          setShowTaggingDialog(false);
          setCurrentImageForTagging(null);
        }}
        onSave={handleSaveTagging}
        initialData={{
          title: currentImageForTagging?.name?.split('.')[0] || '',
          description: description,
          category: category,
          tags: '',
          featured: isFeatured
        }}
        imagePreview={currentImageForTagging?.url}
      />
    </div>
  );
}