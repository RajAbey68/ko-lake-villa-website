import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  { value: "koggala-lake", label: "Koggala Lake Ahangama and Surrounding" },
  { value: "excursions", label: "Excursions" }
];

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ImageUploadDialog = ({ open, onOpenChange, onSuccess }: ImageUploadDialogProps) => {
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
      
      // If uploading a file, use Firebase Storage
      if (uploadMethod === 'file' && imageFile) {
        try {
          // Upload to Firebase with progress tracking
          uploadedImageUrl = await uploadFile(imageFile, `gallery/${category}/`, (progress) => {
            setUploadProgress(progress);
          });
        } catch (err) {
          console.error("Error uploading file to Firebase:", err);
          toast({
            title: "Upload Error",
            description: "Failed to upload image to storage. Please try again.",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
      } else {
        // If using a URL, use the provided URL
        uploadedImageUrl = imageUrl;
      }
      
      // Prepare the image data
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
      <DialogContent className="w-full max-w-[400px] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-[#8B5E3C] text-lg">Add to Gallery</DialogTitle>
        </DialogHeader>
        
        {/* Top tabs for upload method */}
        <div className="flex gap-2 mt-2 mb-4">
          <Button
            type="button"
            size="sm"
            variant={uploadMethod === 'file' ? "default" : "outline"}
            className={uploadMethod === 'file' ? "bg-[#FF914D] text-white" : ""}
            onClick={() => setUploadMethod('file')}
          >
            Upload File
          </Button>
          <Button
            type="button"
            size="sm"
            variant={uploadMethod === 'url' ? "default" : "outline"}
            className={uploadMethod === 'url' ? "bg-[#FF914D] text-white" : ""}
            onClick={() => setUploadMethod('url')}
          >
            Use URL
          </Button>
        </div>
        
        {/* Main form - vertical layout for better fit */}
        <div className="space-y-4">
          {/* Upload method-specific section */}
          {uploadMethod === 'file' ? (
            <div>
              <Label htmlFor="image-upload">Select Image File</Label>
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="mt-1"
              />
              {imageFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="image-url">Image or Video URL</Label>
                <Input 
                  id="image-url" 
                  type="url" 
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm">Media Type:</label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="mr-1"
                    checked={mediaType === 'image'}
                    onChange={() => setMediaType('image')}
                  />
                  <span className="text-sm">Image</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input
                    type="radio"
                    className="mr-1"
                    checked={mediaType === 'video'}
                    onChange={() => setMediaType('video')}
                  />
                  <span className="text-sm">Video</span>
                </label>
              </div>
            </>
          )}
          
          {/* Required fields */}
          <div>
            <Label htmlFor="alt-text">Alt Text / Title *</Label>
            <Input 
              id="alt-text" 
              placeholder="Title or description"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {galleryCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Optional fields */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Add more details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 h-16"
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input 
              id="tags" 
              placeholder="e.g. landscape, sunset"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="featured" 
              checked={featured}
              onCheckedChange={(checked) => setFeatured(!!checked)}
            />
            <Label htmlFor="featured">
              Featured image
            </Label>
          </div>
        </div>
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4 mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#FF914D] h-2 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1">{uploadProgress}% uploaded</p>
          </div>
        )}
        
        {/* Footer actions */}
        <DialogFooter className="mt-6 flex justify-between">
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isUploading || (uploadMethod === 'file' && !imageFile) || (uploadMethod === 'url' && !imageUrl)}
            className="bg-[#FF914D] hover:bg-[#e67e3d]"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;