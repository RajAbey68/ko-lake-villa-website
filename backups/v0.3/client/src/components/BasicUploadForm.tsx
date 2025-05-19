import { useState } from 'react';
import { uploadFile } from '../lib/firebaseStorage';
import { useToast } from '../hooks/use-toast';

interface BasicUploadFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BasicUploadForm({ open, onClose, onSuccess }: BasicUploadFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [category, setCategory] = useState('all-villa');
  const [uploadType, setUploadType] = useState('file');
  const [mediaType, setMediaType] = useState('image');
  
  if (!open) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadType === 'file' && !imageFile) {
      alert('Please select a file to upload');
      return;
    }
    
    if (uploadType === 'url' && !imageUrl) {
      alert('Please enter an image URL');
      return;
    }
    
    if (!alt) {
      alert('Please enter a title');
      return;
    }
    
    try {
      setIsUploading(true);
      
      let finalImageUrl = '';
      
      if (uploadType === 'file' && imageFile) {
        finalImageUrl = await uploadFile(imageFile, `gallery/${category}/`);
      } else {
        finalImageUrl = imageUrl;
      }
      
      const imageData = {
        uploadMethod: uploadType,
        imageUrl: finalImageUrl,
        alt,
        description: alt, // Simple description
        category,
        tags: category, // Use category as tags
        featured: false,
        sortOrder: 0,
        mediaType
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'auto',
        padding: '20px'
      }}>
        <h2 style={{ marginTop: 0, color: '#8B5E3C' }}>Add to Gallery</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Upload Type Selection */}
          <div>
            <label>
              <input
                type="radio"
                name="uploadType"
                value="file"
                checked={uploadType === 'file'}
                onChange={() => setUploadType('file')}
              /> File Upload
            </label>
            <label style={{ marginLeft: '15px' }}>
              <input
                type="radio"
                name="uploadType"
                value="url"
                checked={uploadType === 'url'}
                onChange={() => setUploadType('url')}
              /> URL
            </label>
          </div>
          
          {/* File or URL input */}
          {uploadType === 'file' ? (
            <div>
              <label htmlFor="file-upload">Select Image:</label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                    // Auto-set title
                    const filename = e.target.files[0].name.split('.')[0];
                    setAlt(filename);
                  }
                }}
                style={{ width: '100%', marginTop: '5px' }}
              />
              {imageFile && (
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  Selected: {imageFile.name}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label htmlFor="image-url">Image URL:</label>
              <input
                id="image-url"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              
              <div style={{ marginTop: '10px' }}>
                <label>
                  <input
                    type="radio"
                    name="mediaType"
                    value="image"
                    checked={mediaType === 'image'}
                    onChange={() => setMediaType('image')}
                  /> Image
                </label>
                <label style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="mediaType"
                    value="video"
                    checked={mediaType === 'video'}
                    onChange={() => setMediaType('video')}
                  /> Video
                </label>
              </div>
            </div>
          )}
          
          {/* Title */}
          <div>
            <label htmlFor="alt-text">Title/Alt Text:</label>
            <input
              id="alt-text"
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Enter a title"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="all-villa">All Villa</option>
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
          
          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '15px',
            gap: '10px' 
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              style={{ 
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: isUploading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#FF914D',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isUploading ? 'not-allowed' : 'pointer'
              }}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}