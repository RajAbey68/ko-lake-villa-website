import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { 
  ArrowLeft as BackIcon,
  Upload as UploadIcon,
  CheckCircle as SuccessIcon,
  AlertCircle as ErrorIcon,
  Loader as LoadingIcon,
  Home as HomeIcon,
  Image as ImageIcon,
  FolderOpen as FolderIcon,
  Plus as PlusIcon
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
import { Progress } from "../../components/ui/progress";
import { ScrollArea } from "../../components/ui/scroll-area";

// Define the gallery categories
const GALLERY_CATEGORIES = [
  { value: "entire-villa", label: "Entire Villa" },
  { value: "family-suite", label: "Family Suite" },
  { value: "group-room", label: "Group Room" },
  { value: "triple-room", label: "Triple Room" },
  { value: "dining-area", label: "Dining Area" },
  { value: "pool-deck", label: "Pool Deck" },
  { value: "lake-garden", label: "Lake Garden" },
  { value: "koggala-lake", label: "Koggala Lake and Surrounding" }
];

interface ImagePreview {
  file: File;
  preview: string;
  name: string;
  size: string;
  category: string;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'analyzing';
  error?: string;
  aiSuggestion?: string;
}

export default function BulkUploader() {
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [defaultCategory, setDefaultCategory] = useState<string>(GALLERY_CATEGORIES[0].value);
  const [uploading, setUploading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    success: 0,
    failed: 0
  });
  
  // Authentication check
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/admin/login');
    }
    
    if (!isLoading && currentUser && !isAdmin) {
      navigate('/');
    }
  }, [currentUser, isLoading, isAdmin, navigate]);
  
  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [imagePreviews]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: ImagePreview[] = Array.from(e.target.files).map(file => {
        // Create preview
        const preview = URL.createObjectURL(file);
        
        // Format file size
        const size = formatFileSize(file.size);
        
        return {
          file,
          preview,
          name: file.name,
          size,
          category: defaultCategory,
          status: 'pending'
        };
      });
      
      setImagePreviews(prev => [...prev, ...newFiles]);
      setUploadStats(prev => ({
        ...prev,
        total: prev.total + newFiles.length
      }));
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    
    setUploadStats(prev => ({
      ...prev,
      total: prev.total - 1
    }));
  };
  
  const updateImageCategory = (index: number, category: string) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews[index].category = category;
      return newPreviews;
    });
  };

  const analyzeImagesWithAI = async () => {
    if (imagePreviews.length === 0) return;
    
    setAnalyzing(true);
    
    for (let i = 0; i < imagePreviews.length; i++) {
      // Skip if already analyzed or has error
      if (imagePreviews[i].aiSuggestion || imagePreviews[i].status === 'error') {
        continue;
      }
      
      // Update status to analyzing
      setImagePreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[i].status = 'analyzing';
        return newPreviews;
      });
      
      try {
        // Prepare form data for AI analysis
        const formData = new FormData();
        formData.append('file', imagePreviews[i].file);
        
        // Call AI analysis API
        const response = await fetch('/api/analyze-media', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const analysis = await response.json();
          
          // Store AI suggestion but keep user's manual category selection
          setImagePreviews(prev => {
            const newPreviews = [...prev];
            newPreviews[i].status = 'pending';
            newPreviews[i].aiSuggestion = analysis.suggestedCategory || analysis.category;
            // Don't override user's manual category selection - only suggest
            return newPreviews;
          });
        } else {
          // AI analysis failed, keep original category
          setImagePreviews(prev => {
            const newPreviews = [...prev];
            newPreviews[i].status = 'pending';
            return newPreviews;
          });
        }
      } catch (error) {
        console.error(`AI analysis failed for ${imagePreviews[i].name}:`, error);
        setImagePreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[i].status = 'pending';
          return newPreviews;
        });
      }
    }
    
    setAnalyzing(false);
  };
  
  const processUploads = async () => {
    if (imagePreviews.length === 0) return;
    
    setUploading(true);
    setOverallProgress(0);
    
    let successCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < imagePreviews.length; i++) {
      // Skip already uploaded images
      if (imagePreviews[i].status === 'success') {
        continue;
      }
      
      // Update status to uploading
      setImagePreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[i].status = 'uploading';
        return newPreviews;
      });
      
      try {
        const formData = new FormData();
        formData.append('image', imagePreviews[i].file);
        formData.append('category', imagePreviews[i].category);
        formData.append('alt', imagePreviews[i].name.split('.')[0]); // Use filename as alt text
        formData.append('description', `Ko Lake Villa ${imagePreviews[i].category}`);
        formData.append('featured', 'false');
        formData.append('sortOrder', '1');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        // Update status to success
        setImagePreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[i].status = 'success';
          return newPreviews;
        });
        
        successCount++;
      } catch (error) {
        console.error(`Error uploading ${imagePreviews[i].name}:`, error);
        
        // Update status to error
        setImagePreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[i].status = 'error';
          newPreviews[i].error = error instanceof Error ? error.message : 'Unknown error';
          return newPreviews;
        });
        
        failedCount++;
      }
      
      // Update progress
      setOverallProgress(Math.round(((i + 1) / imagePreviews.length) * 100));
    }
    
    setUploadStats(prev => ({
      ...prev,
      success: prev.success + successCount,
      failed: prev.failed + failedCount
    }));
    
    setUploading(false);
  };
  
  const retryFailedUploads = () => {
    const hasFailedUploads = imagePreviews.some(img => img.status === 'error');
    if (!hasFailedUploads) return;
    
    processUploads();
  };
  
  const clearSuccessfulUploads = () => {
    setImagePreviews(prev => prev.filter(img => img.status !== 'success'));
  };
  
  const getFilteredImages = () => {
    if (activeCategory === 'all') {
      return imagePreviews;
    }
    
    if (activeCategory === 'pending') {
      return imagePreviews.filter(img => img.status === 'pending');
    }
    
    if (activeCategory === 'success') {
      return imagePreviews.filter(img => img.status === 'success');
    }
    
    if (activeCategory === 'error') {
      return imagePreviews.filter(img => img.status === 'error');
    }
    
    return imagePreviews.filter(img => img.category === activeCategory);
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
  
  const filteredImages = getFilteredImages();
  
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
          <h1 className="text-3xl font-bold text-[#8B5E3C]">Bulk Image Uploader</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Upload Controls */}
          <Card className="bg-white border border-[#A0B985]/20">
            <CardHeader>
              <CardTitle className="text-[#8B5E3C]">1. Select Images</CardTitle>
              <CardDescription>
                Add images by clicking the button below. You can add multiple batches of images.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="file-upload">Select Images for Upload</Label>
                    <Input 
                      id="file-upload" 
                      type="file"
                      ref={fileInputRef}
                      accept="image/*" 
                      multiple 
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="cursor-pointer mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="default-category">Default Category for New Images</Label>
                    <Select
                      value={defaultCategory}
                      onValueChange={setDefaultCategory}
                      disabled={uploading}
                    >
                      <SelectTrigger id="default-category" className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {GALLERY_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {imagePreviews.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={analyzeImagesWithAI}
                        disabled={analyzing || uploading}
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        {analyzing ? (
                          <>
                            <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />
                            AI Analyzing...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            AI Auto-Categorize
                          </>
                        )}
                      </Button>
                      <div>
                        <p className="text-sm font-medium text-[#8B5E3C]">
                          {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} ready for upload
                        </p>
                        {uploadStats.success > 0 && (
                          <p className="text-xs text-green-600">
                            {uploadStats.success} uploaded successfully
                          </p>
                        )}
                        {uploadStats.failed > 0 && (
                          <p className="text-xs text-red-600">
                            {uploadStats.failed} failed
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {uploadStats.success > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={clearSuccessfulUploads}
                            disabled={uploading}
                          >
                            Clear Successful
                          </Button>
                        )}
                        
                        {uploadStats.failed > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={retryFailedUploads}
                            disabled={uploading}
                          >
                            Retry Failed
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar when uploading */}
                    {uploading && (
                      <div className="mt-2">
                        <Progress value={overallProgress} className="h-2" />
                        <p className="text-xs text-[#8B5E3C]/70 mt-1">
                          Uploading images: {overallProgress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div>
                <p className="text-sm text-[#8B5E3C]/70">
                  Supported formats: JPG, PNG, WebP
                </p>
              </div>
              <Button 
                className="bg-[#FF914D] hover:bg-[#FF914D]/90 text-white"
                onClick={processUploads}
                disabled={uploading || imagePreviews.length === 0 || imagePreviews.every(img => img.status === 'success')}
              >
                {uploading ? (
                  <>
                    <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload All Images
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Image Preview Grid */}
          {imagePreviews.length > 0 && (
            <Card className="bg-white border border-[#A0B985]/20">
              <CardHeader>
                <CardTitle className="text-[#8B5E3C]">2. Manage &amp; Upload Images</CardTitle>
                <CardDescription>
                  Organize your images by category before uploading. Click on a category below to filter.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={activeCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory('all')}
                    className={activeCategory === 'all' ? 'bg-[#FF914D] hover:bg-[#FF914D]/90' : ''}
                  >
                    All ({imagePreviews.length})
                  </Button>
                  
                  <Button
                    variant={activeCategory === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory('pending')}
                    className={activeCategory === 'pending' ? 'bg-[#FF914D] hover:bg-[#FF914D]/90' : ''}
                  >
                    Pending ({imagePreviews.filter(img => img.status === 'pending').length})
                  </Button>
                  
                  <Button
                    variant={activeCategory === 'success' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory('success')}
                    className={activeCategory === 'success' ? 'bg-[#FF914D] hover:bg-[#FF914D]/90' : ''}
                  >
                    Uploaded ({imagePreviews.filter(img => img.status === 'success').length})
                  </Button>
                  
                  <Button
                    variant={activeCategory === 'error' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory('error')}
                    className={activeCategory === 'error' ? 'bg-[#FF914D] hover:bg-[#FF914D]/90' : ''}
                  >
                    Failed ({imagePreviews.filter(img => img.status === 'error').length})
                  </Button>
                  
                  {GALLERY_CATEGORIES.map(category => {
                    const count = imagePreviews.filter(img => img.category === category.value).length;
                    if (count === 0) return null;
                    
                    return (
                      <Button
                        key={category.value}
                        variant={activeCategory === category.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveCategory(category.value)}
                        className={activeCategory === category.value ? 'bg-[#FF914D] hover:bg-[#FF914D]/90' : ''}
                      >
                        {category.label} ({count})
                      </Button>
                    );
                  })}
                </div>
                
                {/* Image grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredImages.map((image, index) => {
                    try {
                      const originalIndex = imagePreviews.findIndex(img => img.preview === image.preview);
                      
                      return (
                        <div key={image.preview} className="relative">
                        <div className={`
                          relative rounded-md overflow-hidden border-2
                          ${image.status === 'success' ? 'border-green-500' : 
                            image.status === 'error' ? 'border-red-500' : 
                            image.status === 'uploading' ? 'border-blue-500' : 
                            'border-gray-200'}
                        `}>
                          {/* Status indicator */}
                          <div className={`
                            absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center z-10
                            ${image.status === 'success' ? 'bg-green-500' : 
                              image.status === 'error' ? 'bg-red-500' : 
                              image.status === 'uploading' ? 'bg-blue-500' : 
                              image.status === 'analyzing' ? 'bg-purple-500' :
                              'bg-gray-200'}
                          `}>
                            {image.status === 'success' ? (
                              <SuccessIcon className="h-4 w-4 text-white" />
                            ) : image.status === 'error' ? (
                              <ErrorIcon className="h-4 w-4 text-white" />
                            ) : image.status === 'uploading' ? (
                              <LoadingIcon className="h-4 w-4 text-white animate-spin" />
                            ) : image.status === 'analyzing' ? (
                              <LoadingIcon className="h-4 w-4 text-white animate-spin" />
                            ) : null}
                          </div>
                          
                          {/* AI suggestion indicator */}
                          {image.aiSuggestion && (
                            <div className="absolute top-2 left-2 bg-purple-100 text-purple-700 text-xs px-1 py-0.5 rounded">
                              AI
                            </div>
                          )}
                          
                          <img 
                            src={image.preview} 
                            alt={image.name}
                            className="h-32 w-full object-cover"
                            onError={(e) => {
                              console.warn('Image preview failed to load:', image.name);
                              // Keep the broken image visible rather than hiding it
                            }}
                          />
                          
                          <div className="p-2 bg-white">
                            <p className="text-xs font-medium truncate" title={image.name}>{image.name}</p>
                            <p className="text-xs text-gray-500">{image.size}</p>
                            
                            <Select
                              value={image.category}
                              onValueChange={(value) => updateImageCategory(originalIndex, value)}
                              disabled={uploading || image.status === 'success'}
                            >
                              <SelectTrigger className="h-7 mt-1 text-xs">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {GALLERY_CATEGORIES.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Error message tooltip */}
                        {image.status === 'error' && image.error && (
                          <div className="absolute -bottom-2 left-0 right-0 bg-red-100 text-red-800 text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {image.error}
                          </div>
                        )}
                        
                        {/* Remove button */}
                        {image.status !== 'success' && image.status !== 'uploading' && (
                          <button
                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                            onClick={() => removeImage(originalIndex)}
                            disabled={uploading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                    } catch (error) {
                      console.error('Error rendering image preview:', error);
                      return null;
                    }
                  })}
                </div>
                
                {filteredImages.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">No images matching the selected filter</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Instructions */}
          <Card className="bg-white border border-[#A0B985]/20">
            <CardHeader>
              <CardTitle className="text-[#8B5E3C]">How to Use the Bulk Uploader</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Select multiple images using the file browser at the top</li>
                <li>Use "AI Auto-Categorize" to automatically detect image categories (entire villa, rooms, pool, etc.)</li>
                <li>Review and adjust categories manually if needed</li>
                <li>Click "Upload All Images" to begin the upload process</li>
                <li>Wait for uploads to complete - you'll see green checkmarks next to successful uploads</li>
                <li>If any uploads fail, click "Retry Failed" to attempt again</li>
              </ol>
              
              <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
                <p className="text-amber-800 text-sm">
                  <strong>Tip:</strong> For best results, organize your images by category before uploading.
                  This will make it easier to assign them to the correct gallery sections.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#A0B985]/20 text-center">
          <p className="text-sm text-[#8B5E3C]/60">
            &copy; {new Date().getFullYear()} Ko Lake Villa Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}