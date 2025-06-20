import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';

const UploadImages = () => {
  // Authentication check
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('entire-villa');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Categories based on your property
  const categories = [
    { value: "entire-villa", label: "Entire Villa" },
    { value: "family-suite", label: "Family Suite" },
    { value: "group-room", label: "Group Room" },
    { value: "triple-room", label: "Triple Room" },
    { value: "dining-area", label: "Dining Area" },
    { value: "pool-deck", label: "Pool Deck" },
    { value: "lake-garden", label: "Lake Garden" },
    { value: "roof-garden", label: "Roof Garden" },
    { value: "front-garden", label: "Front Garden and Entrance" },
    { value: "koggala-lake", label: "Koggala Lake and Surrounding" },
    { value: "excursions", label: "Excursions" }
  ];

  useEffect(() => {
    document.title = "Upload Images - Admin";
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Reset states
    setError(null);
    setSuccess(null);
    
    // Check file type
    const isImage = selectedFile.type.startsWith('image/');
    const isVideo = selectedFile.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setError('Please select an image or video file');
      return;
    }
    
    // Set the file and generate preview
    setFile(selectedFile);
    
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For videos, just use a placeholder
      setFilePreview('/uploads/video-placeholder.jpg');
    }
    
    // Set default title based on filename
    const fileName = selectedFile.name.split('.')[0].replace(/_/g, ' ');
    setTitle(fileName);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!title) {
      setError('Please provide a title for the image');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', tags);
      formData.append('featured', featured ? 'true' : 'false');
      formData.append('mediaType', file.type.startsWith('video/') ? 'video' : 'image');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const result = await response.json();
      
      // Clear form
      setFile(null);
      setFilePreview(null);
      setTitle('');
      setDescription('');
      setTags('');
      setFeatured(false);
      
      // Show success message
      setSuccess('Image uploaded successfully!');
      toast({
        title: 'Success!',
        description: 'Image uploaded successfully to the gallery.',
      });
      
      // Clear file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Upload Failed',
        description: err instanceof Error ? err.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Temporarily disable auth check for gallery management
  // if (!userLoading && (!user || !user.isAdmin)) {
  //   return (
  //     <div className="min-h-screen pt-32 pb-20 bg-[#F8F6F2]">
  //       <div className="container mx-auto px-4">
  //         <Alert variant="destructive" className="mb-4">
  //           <AlertCircleIcon className="h-4 w-4" />
  //           <AlertTitle>Unauthorized</AlertTitle>
  //           <AlertDescription>
  //             You must be an administrator to access this page.
  //           </AlertDescription>
  //         </Alert>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#F8F6F2]">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-[#8B5E3C] mb-4">Upload Gallery Images</h1>
          <p className="text-[#333333]">
            Add more authentic images from your property to showcase in the gallery.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Image</CardTitle>
                <CardDescription>
                  Upload authentic images from your property to add to the gallery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="file-input">Select Image or Video</Label>
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        <input
                          type="file"
                          id="file-input"
                          className="hidden"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                        />
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Click to browse or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Supports images and videos up to 100MB
                        </p>
                      </div>
                    </div>

                    {/* Image Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Image Title/Alt Text */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title/Alt Text</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Image title or alternative text"
                        required
                      />
                    </div>

                    {/* Image Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the image"
                        rows={3}
                      />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (Optional, comma separated)</Label>
                      <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="villa, lakeside, suite"
                      />
                    </div>

                    {/* Featured Flag */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="featured" 
                        checked={featured}
                        onCheckedChange={(checked) => setFeatured(checked === true)}
                      />
                      <Label htmlFor="featured" className="cursor-pointer">
                        Feature this image in highlights
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="mt-6 bg-[#FF914D] hover:bg-[#8B5E3C] text-white"
                    disabled={uploading || !file}
                  >
                    {uploading ? 'Uploading...' : 'Upload to Gallery'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6">
                {filePreview ? (
                  <>
                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-md mb-4">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-[#8B5E3C]">{title || 'No title'}</p>
                      {category && (
                        <p className="text-sm text-gray-500 mt-1">
                          Category: {categories.find(cat => cat.value === category)?.label || category}
                        </p>
                      )}
                      {description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                          {description}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-400">
                      No file selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tips for Quality Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FF914D] mr-2">✓</span>
                      <span>Use high-resolution authentic photos of your property</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF914D] mr-2">✓</span>
                      <span>Choose well-lit images that showcase the space accurately</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF914D] mr-2">✓</span>
                      <span>Add descriptive alt text to improve accessibility</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF914D] mr-2">✓</span>
                      <span>Categorize correctly to help guests find relevant images</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImages;