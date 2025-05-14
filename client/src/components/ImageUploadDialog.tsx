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
  const [isUrlUpload, setIsUrlUpload] = useState(false);
  const [isVideoUpload, setIsVideoUpload] = useState(false);
  
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
    setIsUrlUpload(false);
    setIsVideoUpload(false);
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
      
      if (!isUrlUpload && !imageFile && !imageUrl) {
        toast({
          title: "Error",
          description: "Please select a file to upload or provide an image URL",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      if (isUrlUpload && !imageUrl) {
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
      let uploadMethod = "url";
      
      // If uploading a file, use Firebase Storage
      if (!isUrlUpload && imageFile) {
        uploadMethod = "file";
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
        mediaType: isVideoUpload ? "video" : "image"
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
        description: `${isVideoUpload ? 'Video' : 'Image'} uploaded successfully!`,
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#8B5E3C]">Add to Gallery</DialogTitle>
          <DialogDescription>
            Upload a new image or video to your gallery
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 mb-2">
              <Button
                type="button"
                variant={isUrlUpload ? "outline" : "default"}
                className={!isUrlUpload ? "bg-[#FF914D] text-white" : ""}
                onClick={() => {
                  setIsUrlUpload(false);
                  setImageUrl("");
                }}
              >
                Upload File
              </Button>
              <Button
                type="button"
                variant={!isUrlUpload ? "outline" : "default"}
                className={isUrlUpload ? "bg-[#FF914D] text-white" : ""}
                onClick={() => {
                  setIsUrlUpload(true);
                  setImageFile(null);
                }}
              >
                Use URL
              </Button>
            </div>
            
            {!isUrlUpload ? (
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
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Label htmlFor="image-url">Image or Video URL</Label>
                    <Input 
                      id="image-url" 
                      type="url" 
                      placeholder="https://example.com/image.jpg or YouTube URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox 
                      id="is-video" 
                      checked={isVideoUpload}
                      onCheckedChange={(checked) => {
                        setIsVideoUpload(checked === true);
                      }} 
                    />
                    <label
                      htmlFor="is-video"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      This is a video
                    </label>
                  </div>
                </div>
                {isVideoUpload && (
                  <p className="text-sm text-gray-500 mt-1">
                    For videos, use YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEOID)
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="alt-text">Alt Text / Title *</Label>
              <Input 
                id="alt-text" 
                placeholder="Description for accessibility"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Add more details about this image"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input 
              id="tags" 
              placeholder="e.g. landscape, sunset, room"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="featured" 
              checked={featured}
              onCheckedChange={(checked) => {
                setFeatured(checked === true);
              }} 
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Featured image (appears in highlights)
            </label>
          </div>
        </div>
        
        {isUploading && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#FF914D] h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-center mt-1">{uploadProgress}% uploaded</p>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isUploading || (!imageFile && !imageUrl)}
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