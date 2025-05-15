import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { uploadFile } from "../lib/firebaseStorage";
import { useToast } from "../hooks/use-toast";

// Available categories for the gallery
const galleryCategories = [
  { value: "family-suite", label: "Family Suite" },
  { value: "group-room", label: "Group Room" },
  { value: "triple-room", label: "Triple Room" },
  { value: "dining-area", label: "Dining Area" },
  { value: "pool-deck", label: "Pool Deck" },
  { value: "lake-garden", label: "Lake Garden" },
  { value: "roof-garden", label: "Roof Garden" },
  { value: "front-garden", label: "Front Garden and Entrance" },
  { value: "koggala-lake", label: "Koggala Lake Ahangama" },
  { value: "excursions", label: "Excursions" }
];

interface SimpleImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const SimpleImageUploadDialog: React.FC<SimpleImageUploadDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  // Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("family-suite");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  
  // Reset the form
  const resetForm = () => {
    setImageFile(null);
    setImageUrl("");
    setAlt("");
    setDescription("");
    setCategory("family-suite");
    setTags("");
    setFeatured(false);
    setUploadMethod('file');
    setMediaType('image');
    setUploadProgress(0);
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Set alt text to file name (without extension) by default
      const fileName = e.target.files[0].name;
      const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setAlt(fileNameWithoutExt.replace(/[-_]/g, ' '));
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      console.log("Form submission starting with data:", {
        uploadMethod,
        imageFile: imageFile ? imageFile.name : null,
        imageUrl,
        alt,
        description,
        category,
        tags,
        featured
      });
      
      setIsUploading(true);
      
      if (uploadMethod === 'file' && !imageFile) {
        toast({
          title: "Error",
          description: "Please select a file to upload",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      if (uploadMethod === 'url' && !imageUrl) {
        toast({
          title: "Error",
          description: "Please enter an image URL",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      if (!alt) {
        toast({
          title: "Error",
          description: "Please enter alt text for accessibility",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      // Prepare the data object
      let uploadedImageUrl = "";
      
      // Check if we're using direct URL or file upload
      if (uploadMethod === 'file' && imageFile) {
        try {
          // Create a FormData object to submit the file
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('category', category);
          formData.append('title', alt); // Use alt text as title
          formData.append('description', description || '');
          
          // Ensure tags are properly formatted
          const tagsValue = tags || '';
          console.log("Adding tags to FormData:", tagsValue);
          formData.append('tags', tagsValue);
          
          formData.append('featured', featured ? 'true' : 'false');
          formData.append('mediaType', mediaType);
          
          // Log out formData entries for debugging
          console.log("FormData entries:");
          console.log("tags value:", formData.get('tags'));
          
          // Upload using our server-side API
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            // No Content-Type header - browser will set it with proper boundary
          });
          
          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Upload error: ${uploadResponse.status} - ${errorText}`);
          }
          
          const uploadResult = await uploadResponse.json();
          uploadedImageUrl = uploadResult.data.imageUrl;
          
          // Success - we'll exit early
          toast({
            title: "Success!",
            description: `${mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully!`,
          });
          
          // Reset form and close dialog
          resetForm();
          onOpenChange(false);
          
          // Call success callback to refresh the gallery
          onSuccess();
          return;
          
        } catch (err) {
          console.error("Error uploading file:", err);
          toast({
            title: "Upload Error",
            description: "Failed to upload file. Please try again.",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
      } else {
        // If using a URL, use the provided URL and continue with API call
        uploadedImageUrl = imageUrl;
        
        // Prepare the image data for direct URL
        const imageData = {
          uploadMethod,
          imageUrl: uploadedImageUrl,
          alt,
          description,
          category,
          tags,
          featured,
          sortOrder: 0,
          mediaType
        };
        
        // Submit to API
        const response = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(imageData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
      }
      
      // Show success message
      toast({
        title: "Success!",
        description: `${mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully!`,
      });
      
      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
      
      // Call success callback to refresh the gallery
      onSuccess();
      
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: `Failed to upload: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isUploading) {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#8B5E3C]">Add Media to Gallery</DialogTitle>
        </DialogHeader>
        
        {/* Method Selector */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button
            size="sm"
            variant={uploadMethod === 'file' ? "default" : "outline"}
            className={uploadMethod === 'file' ? "bg-[#FF914D]" : ""}
            onClick={() => setUploadMethod('file')}
          >
            Upload File
          </Button>
          <Button
            size="sm"
            variant={uploadMethod === 'url' ? "default" : "outline"}
            className={uploadMethod === 'url' ? "bg-[#FF914D]" : ""}
            onClick={() => setUploadMethod('url')}
          >
            Use URL
          </Button>
        </div>
        
        {/* Media Type Selector */}
        <div className="flex justify-between items-center mb-3 border-b pb-2">
          <span className="text-sm font-medium text-gray-700">Media Type:</span>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={mediaType === 'image'}
                onChange={() => setMediaType('image')}
                className="text-[#FF914D]"
              />
              <span className="text-sm">Image</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={mediaType === 'video'}
                onChange={() => setMediaType('video')}
                className="text-[#FF914D]"
              />
              <span className="text-sm">Video</span>
            </label>
          </div>
        </div>
        
        {/* Scrollable content area */}
        <div className="max-h-[50vh] overflow-y-auto pr-1 mb-12">
          <div className="space-y-3">
            {/* File or URL Input */}
            {uploadMethod === 'file' ? (
              <div>
                <Label className="text-xs mb-1 block">Select {mediaType === 'video' ? 'Video' : 'Image'} File</Label>
                <Input 
                  type="file" 
                  accept={mediaType === 'video' ? "video/*,.mp4,.webm,.mov" : "image/*,.jpg,.png,.gif,.webp"} 
                  onChange={handleFileChange}
                  className="mt-1"
                />
                {imageFile && (
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs">{imageFile.name}</p>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {mediaType === 'video' ? 'Video' : 'Image'}
                    </span>
                  </div>
                )}
                {mediaType === 'video' && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-amber-700">
                      Note: Video uploads may take longer depending on file size.
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum upload size: 100MB. For larger videos, use YouTube URL.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs mb-1 block">
                  {mediaType === 'video' ? 'YouTube Video URL' : 'Image URL'}
                </Label>
                <Input 
                  placeholder={mediaType === 'video' 
                    ? "Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEOID)" 
                    : "Enter image URL (e.g., https://example.com/image.jpg)"
                  } 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                
                {mediaType === 'video' && (
                  <p className="text-xs text-amber-700">
                    Currently supported: YouTube videos only
                  </p>
                )}
              </div>
            )}
            
            {/* Title */}
            <div>
              <Label className="text-xs">Title/Alt Text*</Label>
              <Input 
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Enter title"
                required
              />
            </div>
            
            {/* Category - Simple Select (No Radix) */}
            <div>
              <Label htmlFor="category-select" className="text-xs">Category*</Label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                {galleryCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Description */}
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea 
                placeholder="Optional description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-20"
              />
            </div>
            
            {/* Tags */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <Label className="text-xs font-semibold text-[#8B5E3C]">Tags (comma separated)</Label>
              <div className="relative mt-1">
                <Input 
                  placeholder="e.g. beach, sunset, view"
                  value={tags}
                  onChange={(e) => {
                    // Handle comma-separated tags and hashtags
                    let inputValue = e.target.value;
                    
                    // If user enters a hashtag, we'll handle it properly
                    if (inputValue.includes('#')) {
                      // Remove the # symbols but keep the words
                      inputValue = inputValue.replace(/#/g, '');
                    }
                    
                    // Auto-add commas between words if the user uses spaces instead
                    if (inputValue.includes(' ') && !inputValue.includes(',')) {
                      inputValue = inputValue.split(' ')
                        .filter(tag => tag.trim())
                        .join(',');
                    }
                    
                    setTags(inputValue);
                  }}
                />
                {/* Show clear button if there are tags */}
                {tags && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setTags('')}
                    title="Clear tags"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="mt-2">
                {tags && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tags.split(',').map((tag, index) => {
                      const trimmedTag = tag.trim();
                      if (!trimmedTag) return null;
                      return (
                        <span key={index} className="px-2 py-1 bg-[#62C3D2] bg-opacity-20 text-[#62C3D2] text-xs rounded-full">
                          #{trimmedTag}
                        </span>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Enter tags separated by commas. Hashtags will be converted automatically.
                </p>
              </div>
            </div>
            
            {/* Featured */}
            <div className="flex items-center gap-2">
              <Checkbox 
                id="featured-image" 
                checked={featured}
                onCheckedChange={(checked) => setFeatured(!!checked)}
              />
              <Label htmlFor="featured-image" className="text-xs">
                Featured image (shows on homepage)
              </Label>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        {isUploading && (
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div 
              className="bg-[#FF914D] h-2 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
            <p className="text-xs text-center mt-1">{uploadProgress}% uploaded</p>
          </div>
        )}
        
        {/* Actions */}
        <DialogFooter className="mt-6 border-t border-gray-100 pt-4">
          <div className="w-full flex items-center justify-between space-x-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#FF914D] hover:bg-[#e67e3d] px-6 font-medium"
              onClick={handleSubmit}
              disabled={isUploading || (!imageFile && !imageUrl) || !alt}
            >
              {isUploading ? 'Uploading...' : `Upload ${mediaType === 'video' ? 'Video' : 'Image'}`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleImageUploadDialog;