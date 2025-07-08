
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';

interface SimpleGalleryUploadProps {
  onSuccess?: () => void;
}

export default function SimpleGalleryUpload({ onSuccess }: SimpleGalleryUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('family-suite');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'family-suite', label: 'Family Suite' },
    { value: 'group-room', label: 'Group Room' },
    { value: 'triple-room', label: 'Triple Room' },
    { value: 'dining-area', label: 'Dining Area' },
    { value: 'pool-deck', label: 'Pool Deck' },
    { value: 'lake-garden', label: 'Lake Garden' }
  ];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title) {
      toast({
        title: "Missing fields",
        description: "Please select a file and enter a title",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('alt', title);
      formData.append('description', title);
      formData.append('tags', category);
      formData.append('featured', 'false');
      formData.append('mediaType', file.type.startsWith('video/') ? 'video' : 'image');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      toast({
        title: "Success!",
        description: "Image uploaded successfully"
      });

      setFile(null);
      setTitle('');
      if (onSuccess) onSuccess();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-[#8B5E3C]">Upload Image</h2>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Image/Video</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              setFile(selectedFile || null);
              if (selectedFile) {
                setTitle(selectedFile.name.split('.')[0]);
              }
            }}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter image title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-[#FF914D] text-white py-2 px-4 rounded hover:bg-[#e67e3d] disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
