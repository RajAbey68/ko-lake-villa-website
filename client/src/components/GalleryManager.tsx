import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  ImageIcon, 
  EditIcon, 
  TrashIcon, 
  UploadIcon, 
  EyeIcon,
  FilterIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';

import { 
  GalleryImage, 
  GALLERY_CATEGORIES, 
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

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingImage) return;

    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as string;
    const alt = formData.get('alt') as string;
    const description = formData.get('description') as string;
    const featured = formData.get('featured') === 'on';
    const customTags = formData.get('customTags') as string;
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 1;

    // Validate data
    const validation = validateImageData({ category, alt, tags: customTags });
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
        category,
        alt,
        description,
        featured,
        customTags,
        sortOrder
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
          {/* Category Filter */}
          <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
            <SelectTrigger className="w-48">
              <FilterIcon className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {GALLERY_CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Upload Button */}
          <Button onClick={() => setUploadDialogOpen(true)} className="bg-[#FF914D] hover:bg-[#8B5E3C]">
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="grid"
        aria-label="Gallery images management grid"
      >
        {filteredAndSortedImages.map((image) => (
          <Card key={image.id} className="overflow-hidden" role="gridcell">
            <div className="relative aspect-square">
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
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                  className="h-8 w-8 p-0"
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
          <p className="text-gray-600">No images found</p>
          <Button onClick={() => setUploadDialogOpen(true)} className="mt-4">
            Upload your first image
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      {editingImage && (
        <EditImageDialog
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSubmit={handleUpdateSubmit}
          isLoading={updateMutation.isPending}
        />
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

// Edit Image Dialog Component
function EditImageDialog({ 
  image, 
  onClose, 
  onSubmit, 
  isLoading 
}: {
  image: GalleryImage;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}) {
  const [category, setCategory] = useState(image.category);
  const [customTags, setCustomTags] = useState(
    image.tags ? image.tags.split(',').filter(tag => tag !== image.category).join(',') : ''
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Preview */}
            <div className="space-y-4">
              <img
                src={image.imageUrl}
                alt={image.alt}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select name="category" value={category} onValueChange={setCategory}>
                  <SelectTrigger>
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

              <div>
                <Label htmlFor="alt">Title/Description *</Label>
                <Input
                  id="alt"
                  name="alt"
                  defaultValue={image.alt}
                  required
                />
              </div>

              <div>
                <Label htmlFor="customTags">Additional Tags</Label>
                <Input
                  id="customTags"
                  name="customTags"
                  value={customTags}
                  onChange={(e) => setCustomTags(e.target.value)}
                  placeholder="beach, sunset, relaxing"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Category "{formatCategoryLabel(category)}" will be automatically included
                </p>
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={image.sortOrder || 1}
                  min="1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  name="featured"
                  defaultChecked={image.featured}
                />
                <Label htmlFor="featured">Featured Image</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={image.description || ''}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Image'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}