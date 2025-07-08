import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Upload, Play, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface GalleryImage {
  id: number;
  imageUrl: string;
  alt: string;
  description?: string;
  category: string;
  tags?: string;
  featured: boolean;
  sortOrder: number;
  mediaType: 'image' | 'video';
}

export default function WorkingGalleryManager() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gallery images
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['/api/gallery'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery');
      return response.json();
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/gallery/${id}`);
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setShowDeleteDialog(false);
      setSelectedImage(null);
      toast({ title: "Success", description: "Image deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete image", variant: "destructive" });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; alt: string; description: string; category: string }) => {
      const response = await apiRequest('PATCH', `/api/gallery/${data.id}`, data);
      if (!response.ok) throw new Error('Failed to update');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setShowEditDialog(false);
      setSelectedImage(null);
      toast({ title: "Success", description: "Image updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update image", variant: "destructive" });
    }
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setShowUploadDialog(false);
      setSelectedFiles([]);
      setIsUploading(false);
      toast({ title: "Success", description: "Files uploaded successfully" });
    },
    onError: () => {
      setIsUploading(false);
      toast({ title: "Error", description: "Upload failed", variant: "destructive" });
    }
  });

  const handleEdit = (image: GalleryImage) => {
    setSelectedImage(image);
    setEditTitle(image.alt);
    setEditDescription(image.description || '');
    setEditCategory(image.category);
    setShowEditDialog(true);
  };

  const handleDelete = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowDeleteDialog(true);
  };

  const handleView = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowFullscreen(true);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      setIsUploading(true);
      uploadMutation.mutate(selectedFiles);
    }
  };

  const saveEdit = () => {
    if (selectedImage) {
      updateMutation.mutate({
        id: selectedImage.id,
        alt: editTitle,
        description: editDescription,
        category: editCategory
      });
    }
  };

  const confirmDelete = () => {
    if (selectedImage) {
      deleteMutation.mutate(selectedImage.id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading gallery...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Button 
          onClick={() => setShowUploadDialog(true)}
          className="bg-[#FF914D] hover:bg-[#8B5E3C]"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image: GalleryImage) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative aspect-square">
              {/* Media Preview */}
              <div 
                className="w-full h-full cursor-pointer bg-gray-100"
                onClick={() => handleView(image)}
              >
                {image.mediaType === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      src={image.imageUrl}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={image.imageUrl}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(image);
                  }}
                  className="w-8 h-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image);
                  }}
                  className="w-8 h-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Featured Badge */}
              {image.featured && (
                <Badge className="absolute top-2 left-2 bg-[#FF914D]">
                  Featured
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-[#8B5E3C] mb-2">{image.alt}</h3>
              <Badge variant="outline" className="mb-2">
                {image.category}
              </Badge>
              {image.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Image title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Image description"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Category"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveEdit}
              disabled={updateMutation.isPending}
              className="bg-[#8B5E3C] hover:bg-[#6B4B2F]"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this image? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF914D] file:text-white hover:file:bg-[#8B5E3C]"
            />
            {selectedFiles.length > 0 && (
              <p className="text-sm text-gray-600">
                Selected {selectedFiles.length} file(s)
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="bg-[#FF914D] hover:bg-[#8B5E3C]"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Viewer */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedImage && (
              <>
                {selectedImage.mediaType === 'video' ? (
                  <video
                    src={selectedImage.imageUrl}
                    controls
                    autoPlay
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setShowFullscreen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}