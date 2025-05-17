import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { uploadFile } from '../lib/firebaseStorage';

const galleryCategories = [
  { value: "all-villa", label: "All Villa" },
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

interface MinimalUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MinimalUploadDialog({ open, onClose, onSuccess }: MinimalUploadDialogProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  // Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState("all-villa");
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Set alt text to file name by default
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
          description: "Please enter alt text/title",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      // Prepare data
      let uploadedImageUrl = "";
      
      // Handle file upload
      if (uploadMethod === 'file' && imageFile) {
        try {
          uploadedImageUrl = await uploadFile(imageFile, `gallery/${category}/`, (progress) => {
            setUploadProgress(progress);
          });
        } catch (err) {
          console.error("Error uploading file:", err);
          toast({
            title: "Upload Error",
            description: "Failed to upload file",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
      } else {
        uploadedImageUrl = imageUrl;
      }
      
      // Data to send to API
      const imageData = {
        uploadMethod,
        imageUrl: uploadedImageUrl,
        alt,
        description: alt, // Use alt text as description for simplicity
        category,
        tags: category, // Use category as tags for simplicity
        featured: false,
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
        throw new Error(`API error: ${response.status}`);
      }
      
      // Success
      toast({
        title: "Success!",
        description: "Image/video added to gallery",
      });
      
      // Reset and close
      setImageFile(null);
      setImageUrl("");
      setAlt("");
      setCategory("family-suite");
      setUploadMethod('file');
      setMediaType('image');
      onClose();
      onSuccess();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.message || "Upload failed",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-[#8B5E3C]">Add to Gallery</h2>
        </div>
        
        {/* Body - Scrollable */}
        <div className="p-4 overflow-y-auto" style={{maxHeight: "60vh"}}>
          {/* Upload Type */}
          <div className="flex space-x-2 mb-4">
            <button 
              className={`px-3 py-1 rounded ${uploadMethod === 'file' ? 'bg-[#FF914D] text-white' : 'bg-gray-200'}`}
              onClick={() => setUploadMethod('file')}
            >
              Upload File
            </button>
            <button 
              className={`px-3 py-1 rounded ${uploadMethod === 'url' ? 'bg-[#FF914D] text-white' : 'bg-gray-200'}`}
              onClick={() => setUploadMethod('url')}
            >
              Use URL
            </button>
          </div>
          
          {/* Upload Controls */}
          {uploadMethod === 'file' ? (
            <div className="mb-4">
              <Label>Select Image</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="mt-1"
              />
              {imageFile && (
                <p className="text-sm mt-1">{imageFile.name}</p>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <Label>Image or Video URL</Label>
              <Input 
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1"
              />
              
              <div className="flex items-center mt-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    className="mr-1"
                    checked={mediaType === 'image'}
                    onChange={() => setMediaType('image')}
                  />
                  <span>Image</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="mr-1"
                    checked={mediaType === 'video'}
                    onChange={() => setMediaType('video')}
                  />
                  <span>Video</span>
                </label>
              </div>
            </div>
          )}
          
          {/* Title/Alt Text */}
          <div className="mb-4">
            <Label>Title/Alt Text*</Label>
            <Input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Enter a title"
              className="mt-1"
            />
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <Label>Category*</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              {galleryCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Progress */}
          {isUploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div 
                  className="bg-[#FF914D] h-2 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-center mt-1">{uploadProgress}% uploaded</p>
            </div>
          )}
        </div>
        
        {/* Footer - Fixed */}
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#FF914D] text-white rounded"
            disabled={isUploading || (!imageFile && !imageUrl) || !alt}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}