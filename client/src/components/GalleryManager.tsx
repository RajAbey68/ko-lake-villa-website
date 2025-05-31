import { useState, useEffect } from 'react';
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
  EditIcon, 
  TrashIcon, 
  ImageIcon,
  StarIcon,
  EyeIcon,
  FilterIcon,
  UploadIcon
} from 'lucide-react';
import { GalleryImage } from '@shared/schema';

const GALLERY_CATEGORIES = [
  { value: "entire-villa", label: "Entire Villa" },
  { value: "family-suite", label: "Family Suite" },
  { value: "group-room", label: "Group Room" },
  { value: "triple-room", label: "Triple Room" },
  { value: "dining-area", label: "Dining Area" },
  { value: "pool-deck", label: "Pool Deck" },
  { value: "lake-garden", label: "Lake Garden" },
  { value: "roof-garden", label: "Roof Garden" },
  { value: "front-garden", label: "Front Garden" },
  { value: "koggala-lake", label: "Koggala Lake" },
  { value: "excursions", label: "Excursions" },
  { value: "events", label: "Events" },
  { value: "friends", label: "Friends" }
];

import { 
  GalleryImage, 
  generateConsistentTags, 
  validateImageData,
  formatCategoryLabel,
  formatTagsForDisplay,
  sortGalleryImages,
  filterImagesByCategory
} from '@/lib/galleryUtils';

import { 
  fetchGalleryImages, 
  updateGalleryImage, 
  deleteGalleryImage,
  uploadGalleryImage 
} from '@/lib/galleryApi';

import { TagCategoryHint } from './TagCategoryHint';

export default function GalleryManager() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gallery images
  const { data: images = [], isLoading, error } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery', selectedCategory],
    queryFn: () => fetchGalleryImages(selectedCategory || undefined),
  });

  // Filter and sort images
  const filteredAndSortedImages = sortGalleryImages(
    filterImagesByCategory(images, selectedCategory)
  );

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
    mutationFn: (id: number) => deleteGalleryImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setDeleteConfirmId(null);
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
    }
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

    // Validate data
    const validation = validateImageData({ category: editCategory, alt: editTitle, tags: '' });
    if (!validation.valid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading gallery images</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Upload and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#8B5E3C]">Gallery Management</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Upload Button */}
          <Button onClick={() => setUploadDialogOpen(true)} className="bg-[#FF914D] hover:bg-[#8B5E3C]">
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="mb-2"
        >
          All Categories
        </Button>
        {GALLERY_CATEGORIES.map(category => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.value)}
            className="mb-2"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Tag-Category Consistency Information */}
      <TagCategoryHint />

      {/* Gallery Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="grid"
        aria-label="Gallery images management grid"
      >
        {filteredAndSortedImages.map((image) => (
          <Card key={image.id} className="overflow-hidden gallery-image" role="gridcell">
            <div className="relative aspect-square">
              {image.mediaType === 'video' ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Video failed to load:', image.imageUrl);
                  }}
                >
                  <source src={image.imageUrl} type="video/mp4" />
                  <source src={image.imageUrl} type="video/webm" />
                  <source src={image.imageUrl} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={image.imageUrl}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    (e.target as HTMLImageElement).alt = 'Image not available';
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
                  onClick={() => handleEdit(image)}
                  className="h-8 w-8 p-0"
                  aria-label={`Edit ${image.alt}`}
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                  className="h-8 w-8 p-0"
                  aria-label={`Delete ${image.alt}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-[#8B5E3C] mb-2 line-clamp-2">{image.alt}</h3>

              {/* Category Badge */}
              <Badge variant="outline" className="mb-2">
                {formatCategoryLabel(image.category)}
              </Badge>

              {/* Tags */}
              {image.tags && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {formatTagsForDisplay(image.tags).slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {image.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
              )}

              {/* Sort Order */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Order: {image.sortOrder || 1}</span>
                <span>{image.mediaType}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {selectedCategory ? (
            <div>
              <p className="text-gray-600 mb-2">No items found</p>
              <p className="text-sm text-gray-500">No images or videos in the "{formatCategoryLabel(selectedCategory)}" category</p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => setSelectedCategory(null)} variant="outline">
                  View All Categories
                </Button>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  Upload to this Category
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">No items found</p>
              <p className="text-sm text-gray-500">Your gallery is empty</p>
              <Button onClick={() => setUploadDialogOpen(true)} className="mt-4">
                Upload your first image
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      {editingImage && (
          <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Image</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Media Preview */}
                <div className="space-y-4">
                  {(editingImage.mediaType === 'video' || editingImage.imageUrl?.endsWith('.mp4') || editingImage.imageUrl?.endsWith('.mov')) ? (
                    <video
                      className="w-full h-64 object-cover rounded-lg border"
                      controls
                      preload="metadata"
                      onError={(e) => {
                        console.error('Failed to load video:', editingImage.imageUrl);
                      }}
                    >
                      <source src={editingImage.imageUrl} type="video/mp4" />
                      <source src={editingImage.imageUrl} type="video/quicktime" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={editingImage.imageUrl} 
                      alt={editingImage.alt}
                      className="w-full h-64 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                    />
                  )}
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
                        {GALLERY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
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

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="secondary" onClick={() => setEditingImage(null)}>
                  Cancel
                </Button>
                <Button
                    onClick={handleSaveEdit}
                    className="bg-[#8B5E3C] hover:bg-[#6B4B2F] text-white"
                  >
                    Save Changes
                  </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <Dialog open={true} onOpenChange={() => setDeleteConfirmId(null)}>
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
      )}
    </div>
  );
}