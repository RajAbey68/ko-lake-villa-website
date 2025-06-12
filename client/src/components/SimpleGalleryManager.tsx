import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  EditIcon, 
  TrashIcon, 
  ImageIcon,
  UploadIcon,
  Trash2Icon
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import TaggingDialog from './TaggingDialog';

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

export default function SimpleGalleryManager() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showTaggingDialog, setShowTaggingDialog] = useState(false);
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
                  variant="outline"
                  onClick={() => handleEditImage(image)}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

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