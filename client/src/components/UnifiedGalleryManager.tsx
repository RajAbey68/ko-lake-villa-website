import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  EditIcon, 
  TrashIcon, 
  ImageIcon,
  UploadIcon,
  VideoIcon,
  TagIcon,
  SparklesIcon,
  FolderIcon,
  SearchIcon,
  FilterIcon,
  Trash2Icon,
  EyeIcon,
  StarIcon,
  RefreshCwIcon,
  CheckCircleIcon
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

interface UploadProgress {
  fileId: string;
  filename: string;
  progress: number;
  status: 'pending' | 'uploading' | 'analyzing' | 'success' | 'error';
  errorMessage?: string;
  preview?: string;
}

interface BatchMetadata {
  [fileId: string]: {
    title: string;
    description: string;
    category: string;
    tags: string;
    featured: boolean;
  };
}

export default function UnifiedGalleryManager() {
  // Gallery State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'category' | 'featured'>('date');

  // Upload State
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [batchMetadata, setBatchMetadata] = useState<BatchMetadata>({});
  const [isUploading, setIsUploading] = useState(false);

  // Edit State
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // Modal State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gallery images
  const { data: images = [], isLoading, error, refetch } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory ? `/api/gallery?category=${selectedCategory}` : '/api/gallery';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch images');
      return response.json();
    },
    staleTime: 0,
  });

  // Filter and sort images
  const filteredAndSortedImages = images
    .filter(image => {
      const matchesSearch = !searchTerm || 
        image.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || image.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.alt || '').localeCompare(b.alt || '');
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'date':
        default:
          return b.id - a.id;
      }
    });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => 
      fetch(`/api/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).then(res => {
        if (!res.ok) throw new Error('Failed to update');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setEditingImage(null);
      toast({ title: "Success", description: "Image updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      fetch(`/api/gallery/${id}`, { method: 'DELETE' }).then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setDeleteConfirmId(null);
      toast({ title: "Success", description: "Image deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Update image mutation
  const updateImageMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<GalleryImage> }) => {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: "Success", description: "Category updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // AI Analysis mutation
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
        description: `Updated: ${analysis.title} (${analysis.category})`
      });
    },
    onError: (error: any) => {
      setAnalyzingId(null);
      toast({
        title: "AI Analysis Failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Handle file selection
  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    const newProgress: UploadProgress[] = fileArray.map(file => ({
      fileId: `${Date.now()}-${Math.random()}`,
      filename: file.name,
      progress: 0,
      status: 'pending',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setUploadProgress(newProgress);

    // Initialize metadata for each file
    const newMetadata: BatchMetadata = {};
    newProgress.forEach(progress => {
      newMetadata[progress.fileId] = {
        title: progress.filename.replace(/\.[^/.]+$/, ""),
        description: '',
        category: 'family-suite',
        tags: '',
        featured: false
      };
    });
    setBatchMetadata(newMetadata);
  };

  // Handle upload
  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const fileId = uploadProgress[i]?.fileId;

      if (!fileId) continue;

      try {
        // Update status to uploading
        setUploadProgress(prev => prev.map(p => 
          p.fileId === fileId ? { ...p, status: 'uploading', progress: 25 } : p
        ));

        const formData = new FormData();
        formData.append('file', file);

        const metadata = batchMetadata[fileId];
        if (metadata) {
          formData.append('title', metadata.title);
          formData.append('description', metadata.description);
          formData.append('category', metadata.category);
          formData.append('tags', metadata.tags);
          formData.append('featured', metadata.featured.toString());
        }

        // Upload file
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }

        // Update progress
        setUploadProgress(prev => prev.map(p => 
          p.fileId === fileId ? { ...p, status: 'analyzing', progress: 75 } : p
        ));

        // Complete
        setUploadProgress(prev => prev.map(p => 
          p.fileId === fileId ? { ...p, status: 'success', progress: 100 } : p
        ));

      } catch (error) {
        setUploadProgress(prev => prev.map(p => 
          p.fileId === fileId ? { 
            ...p, 
            status: 'error', 
            errorMessage: error instanceof Error ? error.message : 'Upload failed',
            progress: 0 
          } : p
        ));
      }
    }

    setIsUploading(false);
    refetch();

    // Clear after delay
    setTimeout(() => {
      setUploadProgress([]);
      setBatchMetadata({});
    }, 3000);
  };

  // Edit form state
  const [editCategory, setEditCategory] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTags, setEditTags] = useState<string>('');
  const [editSortOrder, setEditSortOrder] = useState<number>(1);
  const [editFeatured, setEditFeatured] = useState<boolean>(false);

  useEffect(() => {
    if (editingImage) {
      setEditCategory(editingImage.category || '');
      setEditTitle(editingImage.alt || '');
      setEditDescription(editingImage.description || '');
      setEditTags(editingImage.tags || '');
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
        tags: editTags,
        featured: editFeatured,
        sortOrder: editSortOrder
      }
    });
  };

  // Update batch metadata
  const updateBatchMetadata = (fileId: string, field: string, value: any) => {
    setBatchMetadata(prev => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        [field]: value
      }
    }));
  };

  // Quick category change handler
  const handleQuickCategoryChange = async (id: number, newCategory: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      // Refresh the gallery
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });

      toast({
        title: "Success",
        description: `Category changed to ${newCategory}`,
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  // Delete handler
  const handleDeleteItem = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Refresh the gallery
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

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
        <p className="text-red-600 mb-4">Error loading gallery</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const availableCategories = GALLERY_CATEGORIES.map(cat => cat.value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#8B5E3C]">Unified Gallery Manager</h1>
          <p className="text-gray-600 mt-2">
            Complete media management - upload, organize, edit, and optimize all your images and videos
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setUploadDialogOpen(true)} className="bg-[#FF914D] hover:bg-[#8B5E3C]">
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Images</p>
                <p className="text-2xl font-bold">{images.filter(i => i.mediaType === 'image').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <VideoIcon className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold">{images.filter(i => i.mediaType === 'video').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <StarIcon className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{images.filter(i => i.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FolderIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{new Set(images.map(i => i.category)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search images and videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={selectedCategory || ''} onValueChange={(value) => setSelectedCategory(value || null)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {GALLERY_CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date Added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="mb-2"
        >
          All ({images.length})
        </Button>
        {GALLERY_CATEGORIES.map(category => {
          const count = images.filter(img => img.category === category.value).length;
          return (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className="mb-2"
            >
              {category.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedImages.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-square">
              {image.mediaType === 'video' ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                  onError={(e) => console.error('Video failed to load:', image.imageUrl)}
                >
                  <source src={image.imageUrl} type="video/mp4" />
                  <source src={image.imageUrl} type="video/webm" />
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
                  }}
                />
              )}

              {/* Featured Badge */}
              {image.featured && (
                <Badge className="absolute top-2 left-2 bg-[#FF914D]">
                  <StarIcon className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}

              {/* Media Type Badge */}
              <Badge variant="secondary" className="absolute top-2 right-2">
                {image.mediaType === 'video' ? (
                  <VideoIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ImageIcon className="h-3 w-3 mr-1" />
                )}
                {image.mediaType}
              </Badge>

              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setAnalyzingId(image.id);
                      aiAnalysisMutation.mutate(image.id);
                    }}
                    disabled={analyzingId === image.id}
                    className="bg-purple-100 hover:bg-purple-200"
                    title="AI Re-analyze"
                  >
                    {analyzingId === image.id ? (
                      <div className="h-4 w-4 animate-spin border-2 border-purple-600 border-t-transparent rounded-full" />
                    ) : (
                      <SparklesIcon className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingImage(image)}
                    title="Edit"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteConfirmId(image.id)}
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-[#8B5E3C] mb-2 line-clamp-2">{image.alt}</h3>

              {/* Quick Category Dropdown */}
              <div className="mb-2">
                <Select
                  value={image.category}
                  onValueChange={(newCategory) => {
                    updateImageMutation.mutate({
                      id: image.id,
                      updates: { 
                        category: newCategory,
                        tags: image.tags ? `${newCategory},${image.tags.replace(image.category, '').replace(/^,+|,+$/g, '')}` : newCategory
                      }
                    });
                  }}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue>
                      {GALLERY_CATEGORIES.find(c => c.value === image.category)?.label || image.category}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value} className="text-xs">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {image.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{image.description}</p>
              )}

              {image.tags && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {image.tags.split(',').slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Order: {image.sortOrder || 1}</span>
                <span>ID: {image.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No items found</p>
          {selectedCategory || searchTerm ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Try adjusting your filters or search terms
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setSelectedCategory(null)} variant="outline">
                  Clear Category Filter
                </Button>
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">Your gallery is empty</p>
              <Button onClick={() => setUploadDialogOpen(true)}>
                Upload your first image or video
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Images & Videos</DialogTitle>
          </DialogHeader>

          <Tabs value={uploadMode} onValueChange={(value: any) => setUploadMode(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Upload</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                  id="single-file-input"
                />
                <label htmlFor="single-file-input" className="cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Click to select an image or video</p>
                  <p className="text-sm text-gray-500">Supports JPG, PNG, GIF, MP4, MOV (max 50MB)</p>
                </label>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                  id="bulk-file-input"
                />
                <label htmlFor="bulk-file-input" className="cursor-pointer">
                  <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Click to select multiple files</p>
                  <p className="text-sm text-gray-500">Select multiple images and videos to upload at once</p>
                </label>
              </div>
            </TabsContent>
          </Tabs>

          {/* Upload Progress & Metadata */}
          {uploadProgress.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Upload Progress & Metadata</h4>

              {uploadProgress.map((progress) => (
                <Card key={progress.fileId}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {progress.preview && (
                        <img src={progress.preview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                      )}

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{progress.filename}</span>
                          <Badge variant={
                            progress.status === 'success' ? 'default' :
                            progress.status === 'error' ? 'destructive' :
                            'secondary'
                          }>
                            {progress.status}
                          </Badge>
                        </div>

                        <Progress value={progress.progress} className="w-full" />

                        {progress.status === 'error' && progress.errorMessage && (
                          <p className="text-red-600 text-sm">{progress.errorMessage}</p>
                        )}

                        {progress.status === 'pending' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={batchMetadata[progress.fileId]?.title || ''}
                                onChange={(e) => updateBatchMetadata(progress.fileId, 'title', e.target.value)}
                                placeholder="Enter title"
                              />
                            </div>

                            <div>
                              <Label>Category</Label>
                              <Select
                                value={batchMetadata[progress.fileId]?.category || 'family-suite'}
                                onValueChange={(value) => updateBatchMetadata(progress.fileId, 'category', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {GALLERY_CATEGORIES.map(cat => (
                                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="md:col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={batchMetadata[progress.fileId]?.description || ''}
                                onChange={(e) => updateBatchMetadata(progress.fileId, 'description', e.target.value)}
                                placeholder="Enter description"
                                rows={2}
                              />
                            </div>

                            <div>
                              <Label>SEO Tags</Label>
                              <Input
                                value={batchMetadata[progress.fileId]?.tags || ''}
                                onChange={(e) => updateBatchMetadata(progress.fileId, 'tags', e.target.value)}
                                placeholder="tag1, tag2, tag3"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
```
                              <Switch
                                checked={batchMetadata[progress.fileId]?.featured || false}
                                onCheckedChange={(checked) => updateBatchMetadata(progress.fileId, 'featured', checked)}
                              />
                              <Label>Featured</Label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            {uploadProgress.length > 0 && (
              <Button
                onClick={() => {
                  const fileInput = uploadMode === 'single' 
                    ? document.getElementById('single-file-input') as HTMLInputElement
                    : document.getElementById('bulk-file-input') as HTMLInputElement;
                  if (fileInput?.files) {
                    handleUpload(fileInput.files);
                  }
                }}
                disabled={isUploading}
                className="bg-[#FF914D] hover:bg-[#8B5E3C]"
              >
                {isUploading ? 'Uploading...' : `Upload ${uploadProgress.length} file(s)`}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editingImage !== null} onOpenChange={(open) => !open && setEditingImage(null)}>
        {editingImage && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Media - {editingImage.alt}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                {editingImage.mediaType === 'video' ? (
                  <video controls className="w-full h-64 object-cover rounded-lg">
                    <source src={editingImage.imageUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img 
                    src={editingImage.imageUrl} 
                    alt={editingImage.alt}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <Label>Category *</Label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GALLERY_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>SEO Tags</Label>
                  <Input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div>
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={editSortOrder}
                    onChange={(e) => setEditSortOrder(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editFeatured}
                    onCheckedChange={setEditFeatured}
                  />
                  <Label>Featured</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingImage(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending}
                className="bg-[#8B5E3C] hover:bg-[#6B4B2F]"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}