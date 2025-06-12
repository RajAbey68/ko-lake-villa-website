import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
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
  const [viewingMedia, setViewingMedia] = useState<{ type: 'image' | 'video', url: string, title: string } | null>(null);
  
  // Edit form state
  const [editCategory, setEditCategory] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editSortOrder, setEditSortOrder] = useState<number>(1);
  const [editFeatured, setEditFeatured] = useState<boolean>(false);

  // Debug logging for state changes
  useEffect(() => {
    console.log('Gallery Manager mounted, states initialized');
  }, []);

  useEffect(() => {
    if (editingImage) {
      console.log('Edit dialog should open for:', editingImage.alt);
      console.log('showTaggingDialog state:', showTaggingDialog);
      // Initialize edit form with current image data
      setEditCategory(editingImage.category || '');
      setEditTitle(editingImage.alt || '');
      setEditDescription(editingImage.description || '');
      setEditSortOrder(editingImage.sortOrder || 1);
      setEditFeatured(editingImage.featured || false);
    } else {
      console.log('Edit dialog closed');
    }
  }, [editingImage, showTaggingDialog]);

  useEffect(() => {
    if (viewingMedia) {
      console.log('Fullscreen viewer opening for:', viewingMedia.type, viewingMedia.title);
      console.log('Modal state should be open:', viewingMedia !== null);
    } else {
      console.log('Fullscreen viewer closed');
    }
  }, [viewingMedia]);
  
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

  // Handle save edit function
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
      setIsUploading(false);
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
    console.log('Confirming delete for ID:', deleteConfirmId);
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
          tags: editingImage.tags || '',
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
            onClick={() => setShowUploadDialog(true)}
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
        {filteredImages.map((image) => {
          const handleMediaClick = () => {
            console.log(`${image.mediaType} clicked:`, image.alt);
            setViewingMedia({ 
              type: image.mediaType as 'image' | 'video', 
              url: image.imageUrl, 
              title: image.alt 
            });
          };

          const handleEditClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Edit button clicked for image:', image.id);
            console.log('Editing image initialized:', {
              id: image.id,
              category: image.category,
              title: image.alt,
              description: image.description
            });
            setEditingImage(image);
            // Don't use TaggingDialog, use the built-in dialog instead
          };

          const handleDeleteClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Delete clicked for:', image.id);
            setDeleteConfirmId(image.id);
          };

          return (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <div 
                  className="relative w-full h-full bg-gray-100 cursor-pointer"
                  onClick={handleMediaClick}
                >
                  {image.mediaType === 'video' ? (
                    <>
                      <video
                        controls={false}
                        preload="metadata"
                        muted
                        loop
                        className="w-full h-full object-cover pointer-events-none"
                        onMouseEnter={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video.play().catch(() => {});
                        }}
                        onMouseLeave={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video.pause();
                          video.currentTime = 0;
                        }}
                        onError={(e) => {
                          console.error('Video failed to load:', image.imageUrl);
                        }}
                      >
                        <source src={image.imageUrl} type="video/mp4" />
                        <source src={image.imageUrl} type="video/quicktime" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm font-medium">
                          ▶ Click to play fullscreen
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={image.imageUrl}
                      alt={image.alt}
                      className="w-full h-full object-cover bg-gray-100 pointer-events-none"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', image.imageUrl);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-red-50 text-red-600 text-sm">
                              <div class="text-center">
                                <div class="mb-2">⚠️</div>
                                <div>Image not found</div>
                                <div class="text-xs mt-1">${image.alt}</div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  )}
                </div>

              {/* Featured Badge */}
              {image.featured && (
                <Badge className="absolute top-2 left-2 bg-[#FF914D]">
                  Featured
                </Badge>
              )}

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleEditClick}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white border"
                    title="Edit this image"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDeleteClick}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-red-100 border"
                    title="Delete this image"
                  >
                    <TrashIcon className="h-4 w-4 text-red-600" />
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
          );
        })}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editingImage?.mediaType === 'video' ? 'Video' : 'Image'}</DialogTitle>
            <DialogDescription>
              Update the title, description, and category for this media item
            </DialogDescription>
          </DialogHeader>
          
          {editingImage && (

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
                  <Label htmlFor="seoTags">SEO Tags</Label>
                  <Input
                    id="seoTags"
                    value={editingImage?.tags || ''}
                    onChange={(e) => {
                      if (editingImage) {
                        // Update the tags in the editing image state
                        const updatedImage = { ...editingImage, tags: e.target.value };
                        setEditingImage(updatedImage);
                      }
                    }}
                    placeholder="Enter SEO tags separated by commas (e.g., luxury villa, koggala lake, sri lanka)"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Add relevant keywords for better search engine visibility
                  </p>
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Media Files</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Input */}
            <div>
              <Label htmlFor="file-upload">Select Files</Label>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const uploads = files.map(file => ({
                    file,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    description: '',
                    category: 'default',
                    tags: '',
                    featured: false
                  }));
                  setSelectedFiles(uploads);
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF914D] file:text-white hover:file:bg-[#8B5E3C]"
              />
              <p className="text-sm text-gray-500 mt-2">
                Supports images (JPG, PNG, GIF) and videos (MP4, MOV)
              </p>
            </div>

            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Files to Upload ({selectedFiles.length})</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {selectedFiles.map((upload, index) => (
                    <div key={index} className="border rounded p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{upload.file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newFiles = selectedFiles.filter((_, i) => i !== index);
                            setSelectedFiles(newFiles);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Title</Label>
                          <Input
                            value={upload.title}
                            onChange={(e) => {
                              const newFiles = [...selectedFiles];
                              newFiles[index].title = e.target.value;
                              setSelectedFiles(newFiles);
                            }}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Category</Label>
                          <Select
                            value={upload.category}
                            onValueChange={(value) => {
                              const newFiles = [...selectedFiles];
                              newFiles[index].category = value;
                              setSelectedFiles(newFiles);
                            }}
                          >
                            <SelectTrigger className="text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {GALLERY_CATEGORIES.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#FF914D] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false);
                  setSelectedFiles([]);
                  setUploadProgress(0);
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedFiles.length > 0) {
                    setIsUploading(true);
                    uploadMutation.mutate(selectedFiles);
                  }
                }}
                disabled={selectedFiles.length === 0 || isUploading}
                className="bg-[#FF914D] hover:bg-[#8B5E3C]"
              >
                {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>



      {/* Fullscreen Media Viewer */}
      {viewingMedia && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {viewingMedia.type === 'video' ? (
            <video
              key={viewingMedia.url}
              controls
              autoPlay
              playsInline
              className="max-w-[90vw] max-h-[90vh] object-contain"
              style={{ width: 'auto', height: 'auto' }}
              onLoadStart={() => console.log('Video loading:', viewingMedia.url)}
              onCanPlay={() => console.log('Video can play:', viewingMedia.url)}
              onError={(e) => console.error('Video error:', e)}
            >
              <source src={viewingMedia.url} type="video/mp4" />
              <source src={viewingMedia.url} type="video/quicktime" />
              <source src={viewingMedia.url} type="video/webm" />
            </video>
          ) : (
            <img
              src={viewingMedia.url}
              alt={viewingMedia.title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onError={(e) => console.error('Image error:', e)}
            />
          )}
          
          <button
            onClick={() => setViewingMedia(null)}
            className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-100"
          >
            Close
          </button>
          
          <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded">
            <h3 className="font-medium">{viewingMedia.title}</h3>
            <p className="text-sm opacity-80">{viewingMedia.type}</p>
          </div>
        </div>
      )}
    </div>
  );
}