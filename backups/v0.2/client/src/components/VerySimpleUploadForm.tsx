import { useState } from 'react';
import { uploadFile } from '../lib/firebaseStorage';
import { useToast } from '../hooks/use-toast';

interface VerySimpleUploadFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerySimpleUploadForm({ open, onClose, onSuccess }: VerySimpleUploadFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('family-suite');
  
  if (!open) return null;
  
  const handleFileUpload = async () => {
    if (!imageFile && !imageUrl) {
      alert("Please select a file or enter a URL");
      return;
    }
    
    if (!title) {
      alert("Please enter a title");
      return;
    }
    
    try {
      setIsUploading(true);
      
      let finalImageUrl = '';
      
      if (imageFile) {
        finalImageUrl = await uploadFile(imageFile, `gallery/${category}/`);
      } else {
        finalImageUrl = imageUrl;
      }
      
      const imageData = {
        imageUrl: finalImageUrl,
        alt: title,
        description: title,
        category,
        tags: category,
        featured: false,
        sortOrder: 0,
        mediaType: 'image'
      };
      
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload');
      }
      
      toast({
        title: "Success!",
        description: "Image uploaded successfully",
      });
      
      // Reset form
      setImageFile(null);
      setImageUrl('');
      setTitle('');
      
      onSuccess();
      onClose();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-[#8B5E3C]">Add to Gallery</h2>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 flex-1">
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block mb-2">Upload File:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                    // Auto-set title
                    const filename = e.target.files[0].name.split('.')[0];
                    setTitle(filename);
                  }
                }}
                className="w-full"
              />
              
              {imageFile && (
                <div className="mt-2 text-sm">
                  Selected: {imageFile.name}
                </div>
              )}
            </div>
            
            {/* OR Divider */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-2 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            {/* Image URL */}
            <div>
              <label className="block mb-2">Image URL:</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Title */}
            <div>
              <label className="block mb-2">Title/Alt Text:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title"
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Category */}
            <div>
              <label className="block mb-2">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="family-suite">Family Suite</option>
                <option value="group-room">Group Room</option>
                <option value="triple-room">Triple Room</option>
                <option value="dining-area">Dining Area</option>
                <option value="pool-deck">Pool Deck</option>
                <option value="lake-garden">Lake Garden</option>
                <option value="roof-garden">Roof Garden</option>
                <option value="front-garden">Front Garden and Entrance</option>
                <option value="koggala-lake">Koggala Lake Ahangama</option>
                <option value="excursions">Excursions</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Fixed Footer with Buttons */}
        <div className="p-4 border-t flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFileUpload}
            disabled={isUploading}
            className="px-4 py-2 bg-[#FF914D] text-white rounded hover:bg-[#e07a3a] transition-colors"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}