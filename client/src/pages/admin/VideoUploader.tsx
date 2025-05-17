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
  "Family Suite",
  "Group Room", 
  "Triple Room", 
  "Dining Area", 
  "Pool Deck", 
  "Lake Garden", 
  "Roof Garden", 
  "Front Garden and Entrance", 
  "Koggala Lake Ahangama and Surrounding", 
  "Excursions"
];

export default function VideoUploader() {
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  
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
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      
      // Auto-fill title from filename (without extension)
      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      setTitle(nameWithoutExt.replace(/_/g, ' '));
      
      // Reset any previous messages
      setMessage(null);
    }
  };

  // Handle direct file selection (for when file is selected from outside input)
  const handleDirectFileSelection = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    
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
    
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a video file to upload.' });
      return;
    }
    
    setUploading(true);
    setMessage(null);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('mediaType', 'video');
      
      // Use upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload video');
      }
      
      const data = await response.json();
      
      setMessage({ 
        type: 'success', 
        text: `Successfully uploaded "${title}" to the ${category} category.` 
      });
      
      // Reset form
      setSelectedFile(null);
      setFileName("");
      setTitle("");
      setDescription('');
      
      // Reset file input value
      const fileInput = document.getElementById('video-upload') as HTMLInputElement;
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
                    <Label htmlFor="video-upload">Select Video File</Label>
                    <Input 
                      id="video-upload" 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500">
                      Supported formats: MP4, MOV, AVI. Maximum size: 500MB.
                    </p>
                    {fileName && (
                      <p className="text-sm font-medium text-[#FF914D]">
                        Selected: {fileName}
                      </p>
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
                    disabled={uploading || !selectedFile}
                  >
                    {uploading ? (
                      <>
                        <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />
                        Uploading Video...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload Video
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
              
              {/* Upload Tips */}
              <Card className="bg-white border border-[#A0B985]/20">
                <CardHeader>
                  <CardTitle className="text-[#8B5E3C]">Video Upload Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-medium text-[#8B5E3C]">File Size</h3>
                    <p className="text-sm text-[#8B5E3C]/70">
                      Videos should be under 500MB for direct upload. For larger videos, consider using YouTube and embedding.
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