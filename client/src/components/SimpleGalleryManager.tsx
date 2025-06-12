import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit as EditIcon, 
  Trash as TrashIcon, 
  Image as ImageIcon,
  Upload as UploadIcon,
  Trash2 as Trash2Icon
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import TaggingDialog from './TaggingDialog';
import { GalleryImage } from '@shared/schema';
import { updateGalleryImage } from '@/lib/galleryApi';

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

const GALLERY_CATEGORIES = [
  { value: "entire-villa", label: "Entire Villa" },
  { value: "family-suite", label: "Family Suite" },
  { value: "group-room", label: "Group Room" },
  { value: "triple-room", label: "Triple Room" },
  { value: "dining-area", label: "Dining Area" },
  { value: "pool-deck", label: "Pool Deck" },
  { value: "lake-garden", label: "Lake Garden" },
  { value: "koggala-lake", label: "Koggala Lake" },
  { value: "excursions", label: "Excursions" },
  { value: "friends", label: "Friends" },
  { value: "events", label: "Events" }
];

interface FileUpload {
  file: File;
  preview: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  featured: boolean;
}

export default function SimpleGalleryManager() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showTaggingDialog, setShowTaggingDialog] = useState(false);
  
  // Upload functionality state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gallery images
  const { data: images = [], isLoading, error } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
    queryFn: async () => {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch images');
      return response.json();
    }
  });

    // Update image mutation
    const updateMutation = useMutation({
      mutationFn: ({ id, updates }: { id: number; updates: any }) => 
        updateGalleryImage(id, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
        setEditingImage(null);
        toast({
          title: "Success",
          description: "Image updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update image",
          variant: "destructive",
        });
      },
    });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/gallery/${id}`);
      if (!response.ok) throw new Error('Failed to delete image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setDeleteConfirmId(null);
      toast({
        title: "Success",
        description: "Image deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to delete image",
        variant: "destructive"
      });
    }
  });

  // Delete all images mutation
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/gallery/all');
      if (!response.ok) throw new Error('Failed to delete all images');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setShowDeleteAllConfirm(false);
      toast({
        title: "Success",
        description: "All images and videos deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to delete all images",
        variant: "destructive"
      });
    }
  });

  // Update image metadata mutation
  const updateImageMutation = useMutation({
    mutationFn: async (data: { id: number; metadata: any }) => {
      const response = await apiRequest('PATCH', `/api/gallery/${data.id}`, data.metadata);
      if (!response.ok) throw new Error('Failed to update image metadata');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Success",
        description: "Image metadata updated successfully"
      });
      setShowTaggingDialog(false);
      setEditingImage(null);
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to update image metadata",
        variant: "destructive"
      });
    }
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (uploads: FileUpload[]) => {
      const formData = new FormData();
      
      uploads.forEach((upload, index) => {
        formData.append('images', upload.file);
        formData.append(`metadata[${index}]`, JSON.stringify({
          title: upload.title,
          description: upload.description,
          category: upload.category,
          tags: upload.tags,
          featured: upload.featured,
          alt: upload.title || upload.file.name
        }));
      });

      const response = await apiRequest('POST', '/api/gallery/upload', formData);
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Success",
        description: `${selectedFiles.length} file(s) uploaded successfully`
      });
      setSelectedFiles([]);
      setUploadProgress(0);
      setShowUploadDialog(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload files",
        variant: "destructive"
      });
    }
  });

  const handleEdit = (image: GalleryImage) => {
    console.log('Edit button clicked for image:', image.id);
    setEditingImage(image);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image);
    setShowTaggingDialog(true);
  };

  const handleSaveTagging = (tagData: {
    title: string;
    description: string;
    category: string;
    tags: string;
    featured: boolean;
  }) => {
    if (!editingImage) return;

    updateImageMutation.mutate({
      id: editingImage.id,
      metadata: {
        alt: tagData.title,
        description: tagData.description,
        category: tagData.category,
        tags: tagData.tags,
        featured: tagData.featured
      }
    });
  };

    // State for edit dialog
    const [editCategory, setEditCategory] = useState<string>('');
    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [editSortOrder, setEditSortOrder] = useState<number>(1);
    const [editFeatured, setEditFeatured] = useState<boolean>(false);
  
    // Initialize edit dialog when editing image changes
    useEffect(() => {
      if (editingImage) {
        setEditCategory(editingImage.category || '');
        setEditTitle(editingImage.alt || '');
        setEditDescription(editingImage.description || '');
        setEditSortOrder(editingImage.sortOrder || 1);
        setEditFeatured(editingImage.featured || false);
      }
    }, [editingImage]);
  
    const handleSaveEdit = () => {
      if (!editingImage) return;
  
      updateMutation.mutate({
        id: editingImage.id,
        updates: {
          category: editCategory,
          alt: editTitle,
          description: editDescription,
          featured: editFeatured,
          sortOrder: editSortOrder
        }
      });
    };

  // Filter images by category
  const filteredImages = selectedCategory 
    ? images.filter(img => img.category === selectedCategory)
    : images;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        <span className="ml-3 text-gray-600">Loading gallery...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading gallery images</p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#8B5E3C]">Gallery Management</h2>
        <div className="flex gap-2">
          {images.length > 0 && (
            <Button 
              onClick={() => setShowDeleteAllConfirm(true)}
              variant="destructive"
            >
              <Trash2Icon className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          )}
          <Button 
            onClick={() => window.location.href = '/admin/upload'}
            className="bg-[#FF914D] hover:bg-[#8B5E3C]"
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
        >
          All Categories ({images.length})
        </Button>
        {GALLERY_CATEGORIES.map(category => {
          const count = images.filter(img => img.category === category.value).length;
          return (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative aspect-square">
              {image.mediaType === 'video' ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                  src={image.imageUrl}
                />
              ) : (
                <img
                  src={image.imageUrl}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
              )}

              {/* Featured Badge */}
              {image.featured && (
                <Badge className="absolute top-2 left-2 bg-[#FF914D]">
                  Featured
                </Badge>
              )}

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEdit(image);
                  }}
                  className="h-8 w-8 p-0"
                  aria-label={`Edit ${image.alt}`}
                  title="Edit this image"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteConfirmId(image.id)}
                  className="h-8 w-8 p-0"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-[#8B5E3C] mb-2">{image.alt}</h3>

              <Badge variant="outline" className="mb-2">
                {GALLERY_CATEGORIES.find(c => c.value === image.category)?.label || image.category}
              </Badge>

              {image.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
              )}

              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Order: {image.sortOrder || 1}</span>
                <span>{image.mediaType}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No items found</p>
          {selectedCategory ? (
            <p className="text-sm text-gray-500">
              No images in the "{GALLERY_CATEGORIES.find(c => c.value === selectedCategory)?.label}" category
            </p>
          ) : (
            <p className="text-sm text-gray-500">Your gallery is empty</p>
          )}
          <Button onClick={() => window.location.href = '/admin/upload'} className="mt-4">
            Upload your first image
          </Button>
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={editingImage !== null} onOpenChange={(open) => {
        if (!open) {
          setEditingImage(null);
        }
      }}>
        {editingImage && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Image</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Media Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#8B5E3C]">Preview</h3>
                <img 
                  src={editingImage.imageUrl} 
                  alt={editingImage.alt}
                  className="w-full h-64 object-cover rounded-lg border shadow-md"
                />
                <div className="text-sm text-gray-600">
                  <p><strong>Current Title:</strong> {editingImage.alt}</p>
                  <p><strong>Category:</strong> {editingImage.category}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GALLERY_CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Title/Description *</Label>
                  <Input
                    id="title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Enter title for this media"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Enter description for this media"
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={editSortOrder}
                    onChange={(e) => setEditSortOrder(parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={editFeatured}
                    onCheckedChange={setEditFeatured}
                  />
                  <Label htmlFor="featured">Featured Image</Label>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="secondary" onClick={() => setEditingImage(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-[#8B5E3C] hover:bg-[#6B4B2F] text-white"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this image? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
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

      {/* Delete All Confirmation Dialog */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Delete All Images & Videos</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete ALL {images.length} images and videos? This action cannot be undone and will permanently remove all gallery content.
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteAllConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteAllMutation.mutate()}
                disabled={deleteAllMutation.isPending}
              >
                {deleteAllMutation.isPending ? 'Deleting All...' : 'Delete All'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Image TaggingDialog */}
      <TaggingDialog
        isOpen={showTaggingDialog}
        onClose={() => {
          setShowTaggingDialog(false);
          setEditingImage(null);
        }}
        onSave={handleSaveTagging}
        initialData={{
          title: editingImage?.alt || '',
          description: editingImage?.description || '',
          category: editingImage?.category || '',
          tags: editingImage?.tags || '',
          featured: editingImage?.featured || false
        }}
        imagePreview={editingImage?.imageUrl}
      />
    </div>
  );
}