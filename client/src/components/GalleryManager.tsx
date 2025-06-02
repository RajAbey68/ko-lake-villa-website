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
  UploadIcon,
  BrainIcon,
  SparklesIcon
} from 'lucide-react';
import { GalleryImage } from '@shared/schema';
import ImageUploadDialog from './ImageUploadDialog';
import BulkUploadDialog from './BulkUploadDialog';

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
  const { data: images = [], isLoading, error, refetch } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery', selectedCategory],
    queryFn: () => fetchGalleryImages(selectedCategory || undefined),
    staleTime: 0, // Always consider data stale to force refresh
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

  // AI re-analysis mutation
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const aiAnalysisMutation = useMutation({
    mutationFn: async (imageId: number) => {
      const response = await fetch(`/api/analyze-media/${imageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('AI analysis failed');
      return response.json();
    },
    onSuccess: (analysis, imageId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setAnalyzingId(null);
      toast({
        title: "AI Analysis Complete",
        description: `Updated: ${analysis.title} (${analysis.category})`,
      });
    },
    onError: (error: any) => {
      setAnalyzingId(null);
      toast({
        title: "AI Analysis Failed",
        description: error.message || "Could not analyze image",
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
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          <span className="ml-3 text-gray-600">Loading gallery...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading gallery images</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);

  // Debug logging for dialog state changes
  useEffect(() => {
    console.log('🔍 Upload dialog state changed:', showUploadDialog);
  }, [showUploadDialog]);

  const handleUploadClick = () => {
    console.log('🔵 BLUE Upload button clicked - Opening dialog');
    console.log('Current showUploadDialog state:', showUploadDialog);
    setShowUploadDialog(true);
    console.log('Set showUploadDialog to true');
  };

  const handleUploadComplete = () => {
    console.log("Upload complete - Refreshing gallery");
    refetch(); // Refresh the gallery data
  };

  return (
    <div className="space-y-6">
      {/* Header with Upload and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#8B5E3C]">Gallery Management</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Upload Button */}
          <div className="flex gap-2">
            <Button onClick={handleUploadClick} className="bg-[#FF914D] hover:bg-[#8B5E3C] text-white font-medium px-6 py-3">
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
            <Button onClick={() => setShowBulkUploadDialog(true)} variant="outline" className="px-6 py-3">
              <UploadIcon className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Secondary Upload Button for visibility */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-blue-900">Add New Media</h3>
            <p className="text-blue-700">Upload images or videos to your gallery</p>
          </div>
          <Button onClick={handleUploadClick} className="bg-blue-600 hover:bg-blue-700 text-white">
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload Now
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
                  variant="outline"
                  onClick={() => {
                    setAnalyzingId(image.id);
                    aiAnalysisMutation.mutate(image.id);
                  }}
                  disabled={analyzingId === image.id}
                  className="h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
                  aria-label={`AI analyze ${image.alt}`}
                  title="AI Re-analyze Image"
                >
                  {analyzingId === image.id ? (
                    <div className="h-4 w-4 animate-spin border-2 border-purple-600 border-t-transparent rounded-full" />
                  ) : (
                    <SparklesIcon className="h-4 w-4 text-purple-600" />
                  )}
                </Button>
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
                <Button onClick={handleUploadClick}>
                  Upload to this Category
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">No items found</p>
              <p className="text-sm text-gray-500">Your gallery is empty</p>
              <Button onClick={handleUploadClick} className="mt-4">
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
                  <h3 className="text-lg font-semibold text-[#8B5E3C]">Preview</h3>
                  {(editingImage.mediaType === 'video' || editingImage.imageUrl?.endsWith('.mp4') || editingImage.imageUrl?.endsWith('.mov')) ? (
                    <video
                      className="w-full h-64 object-cover rounded-lg border shadow-md"
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
                      className="w-full h-64 object-cover rounded-lg border shadow-md"
                      onError={(e) => {
                        console.error('Failed to load image:', editingImage.imageUrl);
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', editingImage.imageUrl);
                      }}
                    />
                  )}
                  <div className="text-sm text-gray-600">
                    <p><strong>Current Title:</strong> {editingImage.title || editingImage.alt}</p>
                    <p><strong>Category:</strong> {editingImage.category}</p>
                    <p><strong>Media Type:</strong> {editingImage.mediaType}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <div className="flex gap-2">
                      <Select value={editCategory} onValueChange={setEditCategory}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entire-villa">Entire Villa</SelectItem>
                          <SelectItem value="family-suite">Family Suite</SelectItem>
                          <SelectItem value="group-room">Group Room</SelectItem>
                          <SelectItem value="triple-room">Triple Room</SelectItem>
                          <SelectItem value="dining-area">Dining Area</SelectItem>
                          <SelectItem value="pool-deck">Pool & Deck</SelectItem>
                          <SelectItem value="lake-garden">Lake Garden</SelectItem>
                          <SelectItem value="roof-garden">Roof Garden</SelectItem>
                          <SelectItem value="front-garden">Front Garden</SelectItem>
                          <SelectItem value="koggala-lake">Koggala Lake</SelectItem>
                          <SelectItem value="excursions">Excursions</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (editingImage) {
                            setAnalyzingId(editingImage.id);
                            aiAnalysisMutation.mutate(editingImage.id);
                          }
                        }}
                        disabled={!editingImage || analyzingId === editingImage?.id}
                        className="mt-1 bg-purple-50 hover:bg-purple-100 border-purple-300"
                        title="AI Re-analyze for better category and content"
                      >
                        {analyzingId === editingImage?.id ? (
                          <div className="h-4 w-4 animate-spin border-2 border-purple-600 border-t-transparent rounded-full" />
                        ) : (
                          <SparklesIcon className="h-4 w-4 text-purple-600" />
                        )}
                        <span className="ml-1 text-xs">AI</span>
                      </Button>
                    </div>
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

      {/* Upload Dialog */}
      {uploadDialogOpen && (
        <ImageUploadDialog
          isOpen={uploadDialogOpen}
          onClose={() => {
            console.log('🔴 Closing upload dialog');
            setUploadDialogOpen(false);
          }}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Bulk Upload Dialog */}
      {showBulkUploadDialog && (
        <BulkUploadDialog
          isOpen={showBulkUploadDialog}
          onClose={() => setShowBulkUploadDialog(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Debugging info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px', zIndex: 9999 }}>
          Upload Dialog: {showUploadDialog ? 'OPEN' : 'CLOSED'}
        </div>
      )}
    </div>
  );
}