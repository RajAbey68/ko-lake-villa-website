import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  ArrowLeft as BackIcon,
  Upload as UploadIcon,
  CheckCircle as SuccessIcon,
  AlertCircle as ErrorIcon,
  Loader as LoadingIcon,
  Home as HomeIcon,
  Video as VideoIcon
} from 'lucide-react';
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
import { Textarea } from "../../components/ui/textarea";
import { Progress } from "../../components/ui/progress";

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

export default function VideoUploader() {
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [uploadedVideos, setUploadedVideos] = useState<{name: string; success: boolean}[]>([]);
  
  // Authentication check
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/admin/login');
    }
    
    if (!isLoading && currentUser && !isAdmin) {
      navigate('/');
    }
  }, [currentUser, isLoading, isAdmin, navigate]);
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      
      // Get all file names
      const names: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        names.push(e.target.files[i].name);
      }
      setFileNames(names);
      
      // Auto-fill title from the first filename (without extension) if multiple files
      if (e.target.files.length === 1) {
        const nameWithoutExt = e.target.files[0].name.split('.').slice(0, -1).join('.');
        setTitle(nameWithoutExt.replace(/_/g, ' '));
      } else {
        setTitle(`${e.target.files.length} videos for ${category}`);
      }
      
      // Reset any previous messages
      setMessage(null);
    }
  };

  // Handle direct file selection (for when file is selected from outside input)
  const handleDirectFileSelection = (file: File) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    setSelectedFiles(dataTransfer.files);
    setFileNames([file.name]);
    
    // Auto-fill title from filename (without extension)
    const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
    setTitle(nameWithoutExt.replace(/_/g, ' '));
    
    // Reset any previous messages
    setMessage(null);
  };
  
  // Handle manual title entry
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one video file to upload.' });
      return;
    }
    
    setUploading(true);
    setMessage(null);
    setUploadProgress(0);
    setUploadedVideos([]);
    
    try {
      const totalFiles = selectedFiles.length;
      const results: {name: string; success: boolean}[] = [];
      
      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        
        // For multiple files, use filename as title
        const videoTitle = totalFiles === 1 ? title : file.name.split('.').slice(0, -1).join('.');
        
        formData.append('file', file);
        formData.append('title', videoTitle);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('mediaType', 'video');
        
        try {
          // Use upload endpoint
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload video');
          }
          
          await response.json();
          results.push({ name: file.name, success: true });
        } catch (error) {
          console.error(`Upload error for ${file.name}:`, error);
          results.push({ name: file.name, success: false });
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }
      
      // Count successful uploads
      const successCount = results.filter(r => r.success).length;
      
      setMessage({ 
        type: 'success', 
        text: `Successfully uploaded ${successCount} of ${totalFiles} videos to the ${category} category.` 
      });
      
      setUploadedVideos(results);
      
      // Reset form if all uploads were successful
      if (successCount === totalFiles) {
        setSelectedFiles(null);
        setFileNames([]);
        setTitle("");
        setDescription('');
        
        // Reset file input value
        const fileInput = document.getElementById('video-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
      
    } catch (error) {
      console.error('Upload process error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unknown error occurred during upload.' 
      });
    } finally {
      setUploading(false);
    }
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
      <div className="max-w-5xl mx-auto px-4 py-8">
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
          <h1 className="text-3xl font-bold text-[#8B5E3C]">Video Uploader</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="md:col-span-2">
            <Card className="bg-white border border-[#A0B985]/20">
              <CardHeader>
                <CardTitle className="text-[#8B5E3C]">Upload Video</CardTitle>
                <CardDescription>
                  Upload videos to the Ko Lake Villa gallery. Videos will be added to the selected category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="video-upload">Select Video Files</Label>
                    <Input 
                      id="video-upload" 
                      type="file" 
                      accept="video/*" 
                      multiple
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500">
                      You can select multiple videos. Supported formats: MP4, MOV, AVI. Maximum size: 500MB per video.
                    </p>
                    {fileNames.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-[#FF914D] mb-1">
                          {fileNames.length} video{fileNames.length > 1 ? 's' : ''} selected:
                        </p>
                        <div className="max-h-24 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
                          {fileNames.map((name, index) => (
                            <p key={index} className="text-xs text-gray-600 truncate mb-1">
                              {index + 1}. {name}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="video-title">Title/Alt Text*</Label>
                    <Input
                      id="video-title"
                      placeholder="Enter a title for this video"
                      value={title}
                      onChange={handleTitleChange}
                      disabled={uploading}
                      required
                    />
                  </div>
                  
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Video Category</Label>
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
                      placeholder="Enter a description for this video"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={uploading}
                      className="resize-none"
                    />
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
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-sm text-gray-500">
                        Uploading: {uploadProgress}% complete
                      </p>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-[#FF914D] hover:bg-[#FF914D]/90 text-white"
                    disabled={uploading || !selectedFiles || fileNames.length === 0}
                  >
                    {uploading ? (
                      <>
                        <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />
                        Uploading {fileNames.length > 1 ? `${fileNames.length} Videos...` : 'Video...'}
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        {fileNames.length > 1 ? `Upload ${fileNames.length} Videos` : 'Upload Video'}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Links & Info */}
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
                      <VideoIcon className="mr-2 h-4 w-4" />
                      Gallery Manager
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/gallery')}
                    >
                      <VideoIcon className="mr-2 h-4 w-4" />
                      View Public Gallery
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recently Uploaded (if any) */}
              {uploadedVideos.length > 0 && (
                <Card className="bg-white border border-[#A0B985]/20 mb-6">
                  <CardHeader>
                    <CardTitle className="text-[#8B5E3C]">Recently Uploaded</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {uploadedVideos.map((video, index) => (
                        <div 
                          key={index} 
                          className={`p-2 text-sm rounded flex items-center gap-2 ${
                            video.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {video.success ? (
                            <SuccessIcon className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <ErrorIcon className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="truncate">{video.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Upload Tips */}
              <Card className="bg-white border border-[#A0B985]/20">
                <CardHeader>
                  <CardTitle className="text-[#8B5E3C]">Video Upload Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-medium text-[#8B5E3C]">Multiple Video Upload</h3>
                    <p className="text-sm text-[#8B5E3C]/70">
                      You can now select multiple videos at once for batch upload. Each video will be processed individually.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-[#8B5E3C]">File Size</h3>
                    <p className="text-sm text-[#8B5E3C]/70">
                      Videos should be under 500MB each for direct upload. For larger videos, consider using YouTube and embedding.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-[#8B5E3C]">Formats</h3>
                    <p className="text-sm text-[#8B5E3C]/70">
                      MP4 format with H.264 encoding works best for web compatibility.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-[#8B5E3C]">Duration</h3>
                    <p className="text-sm text-[#8B5E3C]/70">
                      Keep videos under 3 minutes for optimal website performance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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