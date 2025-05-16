import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeftIcon, UploadIcon, ImageIcon, RefreshCwIcon, FolderIcon, AlertCircleIcon, CheckCircleIcon, ChevronLeftIcon } from 'lucide-react';

// List of all categories used in the gallery
const CATEGORIES = [
  'Family Suite',
  'Garden Twin Room',
  'Group Room',
  'Triple Room',
  'Dining Area',
  'Pool Deck',
  'Lake Garden',
  'Roof Garden',
  'Front Garden and Entrance',
  'Koggala Lake Ahangama and Surrounding',
  'Excursions'
];

// Interface for file with upload status
interface FileWithStatus {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  preview?: string;
}

const BulkUploader = () => {
  // Authentication check
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [category, setCategory] = useState<string>('');
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [totalUploaded, setTotalUploaded] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Bulk Image Uploader - Admin";
  }, []);

  // Update overall progress based on individual file progress
  useEffect(() => {
    if (files.length === 0) {
      setOverallProgress(0);
      return;
    }

    const totalProgress = files.reduce((acc, file) => acc + file.progress, 0);
    setOverallProgress(Math.floor(totalProgress / files.length));
  }, [files]);

  // Clear all selected files
  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadDisabled(false);
    setUploading(false);
    setCurrentUploadIndex(0);
    setTotalUploaded(0);
    setUploadComplete(false);
    setError(null);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Validate number of files (limit to 100 for performance)
    if (selectedFiles.length > 100) {
      toast({
        title: "Too many files",
        description: "Please select no more than 100 files at once.",
        variant: "destructive",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Reset states
    setUploadComplete(false);
    setError(null);
    setCurrentUploadIndex(0);
    setTotalUploaded(0);

    // Build file array with status
    const newFiles: FileWithStatus[] = Array.from(selectedFiles).map(file => {
      let preview = '';
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      } else if (file.type.startsWith('video/')) {
        preview = '/assets/video-placeholder.png';
      }

      return {
        file,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        progress: 0,
        preview
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  // Remove a single file from the list
  const removeFile = (id: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== id);
      
      // If we're deleting a file with preview URL, clean it up
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove?.preview && fileToRemove.file.type.startsWith('image/')) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      return updatedFiles;
    });
  };

  // Process all files for upload
  const processUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload first.",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Missing category",
        description: "Please select a category for these images.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadDisabled(true);
    setCurrentUploadIndex(0);
    setTotalUploaded(0);
    setUploadComplete(false);
    setError(null);

    // Upload files sequentially to prevent server overload
    await uploadNextFile();
  };

  // Upload files one by one
  const uploadNextFile = async () => {
    if (currentUploadIndex >= files.length) {
      // All files processed
      setUploading(false);
      setUploadComplete(true);
      
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${totalUploaded} of ${files.length} files.`,
      });
      
      return;
    }

    const file = files[currentUploadIndex];
    
    if (file.status === 'success') {
      // Skip already uploaded files
      setCurrentUploadIndex(prev => prev + 1);
      uploadNextFile();
      return;
    }

    // Update status to uploading
    setFiles(prev => 
      prev.map((f, i) => 
        i === currentUploadIndex ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );

    try {
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('category', category);
      formData.append('title', file.file.name.split('.')[0].replace(/_/g, ' '));
      formData.append('description', `Image from ${category} at Ko Lake House`);
      formData.append('tags', category);
      formData.append('featured', isFeatured ? 'true' : 'false');
      formData.append('mediaType', file.file.type.startsWith('video/') ? 'video' : 'image');

      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/api/upload');
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          
          setFiles(prev => 
            prev.map((f, i) => 
              i === currentUploadIndex ? { ...f, progress } : f
            )
          );
        }
      };
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success
          setFiles(prev => 
            prev.map((f, i) => 
              i === currentUploadIndex ? { ...f, status: 'success', progress: 100 } : f
            )
          );
          
          setTotalUploaded(prev => prev + 1);
          setCurrentUploadIndex(prev => prev + 1);
          
          // Process next file
          setTimeout(() => uploadNextFile(), 200);
        } else {
          // Error
          const errorMsg = `Upload failed: ${xhr.statusText}`;
          
          setFiles(prev => 
            prev.map((f, i) => 
              i === currentUploadIndex ? { ...f, status: 'error', error: errorMsg } : f
            )
          );
          
          setCurrentUploadIndex(prev => prev + 1);
          
          // Continue with next file
          setTimeout(() => uploadNextFile(), 200);
        }
      };
      
      xhr.onerror = () => {
        const errorMsg = "Network error occurred during upload";
        
        setFiles(prev => 
          prev.map((f, i) => 
            i === currentUploadIndex ? { ...f, status: 'error', error: errorMsg } : f
          )
        );
        
        setCurrentUploadIndex(prev => prev + 1);
        
        // Continue with next file
        setTimeout(() => uploadNextFile(), 200);
      };
      
      xhr.send(formData);
      
    } catch (err) {
      console.error("Error uploading file:", err);
      
      const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
      
      setFiles(prev => 
        prev.map((f, i) => 
          i === currentUploadIndex ? { ...f, status: 'error', error: errorMsg } : f
        )
      );
      
      setCurrentUploadIndex(prev => prev + 1);
      
      // Continue with next file despite error
      setTimeout(() => uploadNextFile(), 200);
    }
  };

  // If not an admin, show unauthorized message
  if (!userLoading && (!user || !user.isAdmin)) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Unauthorized</AlertTitle>
            <AlertDescription>
              You must be an administrator to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#F8F6F2]">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-10">
          <Link href="/admin" className="mr-4">
            <Button variant="outline" size="icon">
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-[#8B5E3C] mb-1">Bulk Image Uploader</h1>
            <p className="text-[#333333]">
              Upload multiple images or videos to your gallery at once
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {uploadComplete && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Upload Complete</AlertTitle>
            <AlertDescription className="text-green-700">
              Successfully uploaded {totalUploaded} of {files.length} files to the gallery.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Upload Settings</CardTitle>
                <CardDescription>
                  Configure settings for all uploaded files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-medium">Category</Label>
                  <Select value={category} onValueChange={setCategory} disabled={uploading}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    All files will be uploaded to this category
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(checked === true)}
                    disabled={uploading}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Mark as featured images
                  </Label>
                </div>

                <div className="pt-4">
                  <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    disabled={uploading}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[#FF914D] hover:bg-[#8B5E3C] text-white mb-3"
                    disabled={uploading}
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Select Files
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    Select up to 100 images or videos at once
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {files.length} file(s) selected
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={clearFiles}
                        disabled={uploading}
                      >
                        Clear All
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{overallProgress}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-2" />
                    </div>

                    {uploading ? (
                      <div className="text-center text-sm text-gray-600">
                        Uploading file {currentUploadIndex + 1} of {files.length}...
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-[#8B5E3C] hover:bg-[#62C3D2] text-white"
                        onClick={processUpload}
                        disabled={uploadDisabled || files.length === 0 || !category}
                      >
                        {uploadComplete ? (
                          <>
                            <RefreshCwIcon className="mr-2 h-4 w-4" />
                            Upload More Files
                          </>
                        ) : (
                          <>
                            <UploadIcon className="mr-2 h-4 w-4" />
                            Start Uploading {files.length} Files
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Files to Upload</CardTitle>
                <CardDescription>
                  {files.length > 0 
                    ? `${files.length} files selected for upload to ${category || "gallery"}`
                    : "No files selected yet"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No files selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Click the "Select Files" button to choose images or videos
                    </p>
                    <Button 
                      className="mt-4 bg-[#FF914D] hover:bg-[#8B5E3C] text-white"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Select Files
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {files.map((file, index) => (
                        <div 
                          key={file.id} 
                          className={`relative border rounded-lg overflow-hidden ${
                            file.status === 'success' ? 'border-green-300 bg-green-50' :
                            file.status === 'error' ? 'border-red-300 bg-red-50' :
                            file.status === 'uploading' ? 'border-blue-300 bg-blue-50' :
                            'border-gray-200'
                          }`}
                        >
                          <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                            {file.preview ? (
                              <img 
                                src={file.preview}
                                alt={file.file.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <FolderIcon className="h-12 w-12 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="p-3">
                            <p className="text-sm font-medium truncate">{file.file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              {file.file.type.startsWith('video/') && ' (Video)'}
                            </p>
                            
                            {file.status === 'uploading' && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs">
                                  <span>Uploading...</span>
                                  <span>{file.progress}%</span>
                                </div>
                                <Progress value={file.progress} className="h-1 mt-1" />
                              </div>
                            )}
                            
                            {file.status === 'error' && (
                              <p className="mt-2 text-xs text-red-600 truncate">
                                {file.error || 'Upload failed'}
                              </p>
                            )}
                            
                            {file.status === 'success' && (
                              <p className="mt-2 text-xs text-green-600 flex items-center">
                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                Uploaded successfully
                              </p>
                            )}
                          </div>
                          
                          {file.status !== 'uploading' && !uploading && (
                            <button
                              className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 text-white hover:bg-opacity-80 transition-all"
                              onClick={() => removeFile(file.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <div className="text-sm text-gray-500">
                  {files.length > 0 && (
                    <>
                      {totalUploaded > 0 && (
                        <span className="text-green-600 font-medium mr-2">
                          {totalUploaded} uploaded successfully
                        </span>
                      )}
                      
                      {files.filter(f => f.status === 'error').length > 0 && (
                        <span className="text-red-600 font-medium mr-2">
                          {files.filter(f => f.status === 'error').length} failed
                        </span>
                      )}
                      
                      {files.filter(f => f.status === 'pending' || f.status === 'uploading').length > 0 && (
                        <span className="text-gray-600 font-medium">
                          {files.filter(f => f.status === 'pending' || f.status === 'uploading').length} pending
                        </span>
                      )}
                    </>
                  )}
                </div>
                
                {uploadComplete && (
                  <Link href="/gallery">
                    <Button variant="outline">
                      View in Gallery
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploader;