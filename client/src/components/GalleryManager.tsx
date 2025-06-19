import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
  EyeOffIcon,
  StarIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  CloudUploadIcon,
  FolderPlusIcon,
  LayoutGridIcon,
  ToggleLeftIcon,
  ToggleRightIcon
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
  { value: "amenities", label: "Amenities" },
  { value: "spa-wellness", label: "Spa & Wellness" },
  { value: "activities", label: "Activities" },
  { value: "default", label: "Uncategorized" }
];

interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

interface BatchMetadata {
  [fileId: string]: {
    category: string;
    title: string;
    description: string;
    tags: string;
    featured: boolean;
  };
}

export default function GalleryManager() {
  // Gallery State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'category' | 'featured'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');

  // Upload State
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk' | 'drag-drop'>('single');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [batchMetadata, setBatchMetadata] = useState<BatchMetadata>({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Edit State
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  // Modal State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [showClearGalleryConfirm, setShowClearGalleryConfirm] = useState(false);
  const [clearingGallery, setClearingGallery] = useState(false);

  // Upload Default Settings State
  const [defaultCategory, setDefaultCategory] = useState('default');
  const [defaultTags, setDefaultTags] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gallery images
  const { data: images = [], isLoading, error, refetch } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
    queryFn: async () => {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch images');
      return response.json();
    }
  });

  // Edit form state
  const [editCategory, setEditCategory] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTags, setEditTags] = useState<string>('');
  const [editSortOrder, setEditSortOrder] = useState<number>(1);
  const [editFeatured, setEditFeatured] = useState<boolean>(false);

  useEffect(() => {
    console.log('editingImage state changed:', editingImage);
    if (editingImage) {
      setEditCategory(editingImage.category || 'family-suite');
      setEditTitle(editingImage.title || editingImage.alt || '');
      setEditDescription(editingImage.description || '');
      setEditTags(editingImage.tags || '');
      setEditSortOrder(editingImage.sortOrder || 1);
      setEditFeatured(editingImage.featured || false);
      console.log('Edit dialog opening for image:', editingImage.id);
      console.log('Dialog should be visible now');
    } else {
      console.log('Edit dialog closed');
    }
  }, [editingImage]);

  const handleSaveEdit = () => {
    if (!editingImage) return;

    // Validate required fields
    if (!editTitle.trim()) {
      toast({ 
        title: "Error", 
        description: "Title is required", 
        variant: "destructive" 
      });
      return;
    }

    if (!editCategory) {
      toast({ 
        title: "Error", 
        description: "Category is required", 
        variant: "destructive" 
      });
      return;
    }

    updateMutation.mutate({
      id: editingImage.id,
      updates: {
        category: editCategory,
        alt: editTitle.trim(),
        title: editTitle.trim(),
        description: editDescription.trim(),
        tags: editTags.trim(),
        featured: editFeatured,
        sortOrder: editSortOrder || 1
      }
    });
  };

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      console.log('Updating image:', id, 'with data:', updates);
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed:', response.status, errorText);
        throw new Error(`Failed to update image: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setEditingImage(null);
      toast({ title: "Success", description: "Image updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: "Failed to update image", 
        variant: "destructive" 
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting image with ID:', id);
      const response = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete failed:', response.status, errorText);
        throw new Error(`Failed to delete image: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setDeleteConfirmId(null);
      toast({ title: "Success", description: "Image deleted successfully" });
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      setDeleteConfirmId(null);
      toast({ 
        title: "Error", 
        description: `Failed to delete image: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      console.log('Bulk deleting images with IDs:', ids);
      const response = await fetch('/api/admin/gallery/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bulk delete failed:', response.status, errorText);
        throw new Error(`Failed to delete images: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setSelectedImages([]);
      setShowDeleteAllConfirm(false);
      toast({ 
        title: "Success", 
        description: result.message || "Images deleted successfully" 
      });
    },
    onError: (error) => {
      console.error('Bulk delete mutation error:', error);
      setShowDeleteAllConfirm(false);
      toast({ 
        title: "Error", 
        description: `Failed to delete images: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Clear Gallery mutation
  const clearGalleryMutation = useMutation({
    mutationFn: async () => {
      console.log('Clearing entire gallery...');
      const response = await fetch('/api/gallery/clear-all', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Clear gallery failed:', response.status, errorText);
        throw new Error(`Failed to clear gallery: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setShowClearGalleryConfirm(false);
      setClearingGallery(false);
      toast({ 
        title: "Gallery Cleared", 
        description: result.message || `Successfully removed ${result.count || 0} images and videos` 
      });
    },
    onError: (error) => {
      console.error('Clear gallery mutation error:', error);
      setShowClearGalleryConfirm(false);
      setClearingGallery(false);
      toast({ 
        title: "Error", 
        description: `Failed to clear gallery: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  const handleClearGallery = () => {
    const password = prompt('Enter admin password to clear all gallery media:');
    if (password !== 'KoLakeVilla2024!') {
      toast({
        title: "Unauthorized",
        description: "Invalid admin password",
        variant: "destructive"
      });
      return;
    }
    setClearingGallery(true);
    clearGalleryMutation.mutate();
  };

  // AI Analysis mutation
  const analyzeImageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/analyze-media/${id}`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to analyze image');
      return response.json();
    },
    onSuccess: (result, imageId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });

      // Update the edit dialog with AI-generated content if it's open for this image
      if (editingImage && editingImage.id === imageId) {
        setEditTitle(result.title || editTitle);
        setEditDescription(result.description || editDescription);
        setEditCategory(result.category || editCategory);
        if (result.tags) {
          setEditTags(Array.isArray(result.tags) ? result.tags.join(', ') : result.tags);
        }
      }

      toast({ 
        title: "AI Analysis Complete", 
        description: result.message || "Image analyzed and updated successfully" 
      });
    },
    onError: (error) => {
      toast({
        title: "AI Analysis Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Filter and sort images
  const filteredImages = images.filter(image => {
    const matchesCategory = !selectedCategory || image.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      image.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && image.published !== false) ||
      (statusFilter === 'hidden' && image.published === false);
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.alt || '').localeCompare(b.alt || '');
      case 'category':
        return a.category.localeCompare(b.category);
      case 'featured':
        return b.featured ? 1 : -1;
      case 'date':
      default:
        return b.id - a.id;
    }
  });

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadDialogOpen(true);
      // Handle file processing here
    }
  };

  // Toggle image selection
  const toggleImageSelection = (imageId: number) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Initialize batch metadata for each file
    const newBatchMetadata: BatchMetadata = {};
    files.forEach((file) => {
      const fileId = `${file.name}-${Date.now()}`;
      newBatchMetadata[fileId] = {
        category: defaultCategory,
        title: file.name.split('.')[0], // Remove extension
        description: '',
        tags: defaultTags,
        featured: false
      };
    });

    setBatchMetadata(newBatchMetadata);

    // Initialize upload progress
    const newProgress: UploadProgress[] = files.map((file) => ({
      fileId: `${file.name}-${Date.now()}`,
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadProgress(newProgress);
  };

  const handleBatchUpload = async () => {
    setIsUploading(true);

    try {
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      const files = Array.from(fileInput?.files || []);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = Object.keys(batchMetadata)[i];
        const metadata = batchMetadata[fileId];

        try {
          // Update progress
          setUploadProgress(prev => prev.map(p => 
            p.fileId === fileId ? { ...p, progress: 25 } : p
          ));

          const formData = new FormData();
          formData.append('file', file);
          formData.append('category', metadata.category);
          formData.append('title', metadata.title);
          formData.append('description', metadata.description);
          formData.append('tags', metadata.tags);
          formData.append('featured', metadata.featured.toString());

          // Update progress
          setUploadProgress(prev => prev.map(p => 
            p.fileId === fileId ? { ...p, progress: 50 } : p
          ));

          const response = await fetch('/api/gallery/upload', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          // Update progress to complete
          setUploadProgress(prev => prev.map(p => 
            p.fileId === fileId ? { ...p, progress: 100, status: 'completed' } : p
          ));

        } catch (error) {
          // Update progress with error
          setUploadProgress(prev => prev.map(p => 
            p.fileId === fileId ? { 
              ...p, 
              status: 'error', 
              errorMessage: error instanceof Error ? error.message : 'Upload failed'
            } : p
          ));
        }
      }

      // Refresh gallery after uploads
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ 
        title: "Upload Complete", 
        description: "Files have been uploaded to the gallery" 
      });

      // Reset upload state after a delay
      setTimeout(() => {
        setUploadDialogOpen(false);
        setUploadProgress([]);
        setBatchMetadata({});
        setIsUploading(false);
      }, 2000);

    } catch (error) {
      toast({ 
        title: "Upload Error", 
        description: "Failed to upload files", 
        variant: "destructive" 
      });
      setIsUploading(false);
    }
  };

  const handleQuickCategoryChange = async (id: number, newCategory: string) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
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

  const handleDeleteItem = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
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
    <div 
      className="space-y-6"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag and Drop Overlay */}
      {dragActive && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-20 border-4 border-dashed border-blue-500 z-50 flex items-center justify-center">
          <div className="text-center">
            <CloudUploadIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-blue-600">Drop files here to upload</h3>
            <p className="text-blue-500 mt-2">Images and videos will be automatically organized</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#8B5E3C]">Gallery Manager</h1>
          <p className="text-gray-600 mt-2">
            Upload, organize, edit, and tag your images and videos with complete media management
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
          <Button 
            variant="destructive" 
            onClick={() => setShowClearGalleryConfirm(true)}
            disabled={clearingGallery || images.length === 0}
            className="bg-red-600 hover:bg-red-700"
          >
            {clearingGallery ? (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2Icon className="h-4 w-4 mr-2" />
                Clear All Media
              </>
            )}
          </Button>
          {selectedImages.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteAllConfirm(true)}
            >
              <Trash2Icon className="h-4 w-4 mr-2" />
              Delete Selected ({selectedImages.length})
            </Button>
          )}
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
              <EyeIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold">{images.filter(i => i.published !== false).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>

        <Select value={selectedCategory || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
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

        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-48">
            <EyeIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="published">Published Only</SelectItem>
            <SelectItem value="hidden">Hidden Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Latest First</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="featured">Featured First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedImages.map((image) => (
          <Card key={image.id} className="group overflow-hidden">
            <div className="relative">
              {image.mediaType === 'video' ? (
                <div className="relative w-full h-48">
                  <video 
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    loop
                    preload="metadata"
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
                      console.error('Failed to load video:', image.imageUrl);
                    }}
                  >
                    <source src={image.imageUrl} type="video/mp4" />
                    <source src={image.imageUrl} type="video/quicktime" />
                  </video>
                  <div className="absolute top-2 right-2">
                    <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ) : (
                <img 
                  src={image.imageUrl} 
                  alt={image.alt}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Failed to load image:', image.imageUrl);
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xNSAxMi0zLTMtMy0zdjZsMyAzIDMgM3YtNloiIGZpbGw9IiM5Y2EzYWYiLz4KPC9zdmc+';
                  }}
                />
              )}

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingImage(image);
                    }}
                    title="Edit Details"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={image.featured ? "default" : "outline"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateMutation.mutate({
                        id: image.id,
                        updates: { ...image, featured: !image.featured }
                      });
                    }}
                    title={image.featured ? "Remove from Featured" : "Add to Featured"}
                  >
                    <StarIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteConfirmId(image.id);
                    }}
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Action Controls - Always Visible */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant={image.published !== false ? "default" : "secondary"}
                  className={`h-8 w-8 p-0 ${image.published !== false ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-500'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateMutation.mutate({
                      id: image.id,
                      updates: { ...image, published: image.published !== false ? false : true }
                    });
                  }}
                  title={image.published !== false ? "Published - Click to Hide" : "Hidden - Click to Publish"}
                >
                  {image.published !== false ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                </Button>
              </div>

              {/* Status Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {image.featured && (
                  <Badge className="bg-[#FF914D] text-white">
                    Featured
                  </Badge>
                )}
                <Badge className={`${image.published !== false ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}`}>
                  {image.published !== false ? 'Published' : 'Hidden'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-[#8B5E3C] mb-2 line-clamp-2">{image.alt}</h3>

              {/* Quick Category Change Dropdown */}
              <div className="mb-2">
                <Select
                  value={image.category}
                  onValueChange={(newCategory) => {
                    updateMutation.mutate({
                      id: image.id,
                      updates: { 
                        ...image, 
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

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Sort: {image.sortOrder}</span>
                <span>{image.mediaType}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog - Custom Modal Implementation */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Edit Media - {editingImage.alt}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update the title, description, category, and other properties for this media item.
                </p>
              </div>
              <button
                onClick={() => {
                  console.log('Manual close button clicked');
                  setEditingImage(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-2"
              >
                ×
              </button>
            </div>

            <div className="p-6">
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

                  <div className="flex gap-2">
                    <Button
                      onClick={() => analyzeImageMutation.mutate(editingImage.id)}
                      disabled={analyzeImageMutation.isPending}
                      variant="outline"
                      size="sm"
                    >
                      <SparklesIcon className="h-4 w-4 mr-2" />
                      {analyzeImageMutation.isPending ? 'Analyzing...' : 'AI Analyze'}
                    </Button>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={editCategory} onValueChange={setEditCategory}>
                      <SelectTrigger>
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
                    <Label>Title</Label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter title"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Enter description"
                      rows={4}
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

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Media Files</DialogTitle>
            <DialogDescription>
              Upload images and videos to your gallery with automatic AI categorization and tagging.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <CloudUploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF, MP4, MOV up to 50MB each
                </p>
              </label>
            </div>

            {/* Upload Progress */}
            {uploadProgress.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Upload Progress</h3>
                {uploadProgress.map((progress) => (
                  <div key={progress.fileId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{progress.fileName}</span>
                      <span>{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    {progress.error && (
                      <p className="text-red-600 text-sm">{progress.error}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Batch Metadata */}
            {Object.keys(batchMetadata).length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Set Default Metadata for All Files</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Default Category</Label>
                    <Select
                      value={defaultCategory}
                      onValueChange={setDefaultCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {GALLERY_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Default Tags</Label>
                    <Input
                      value={defaultTags}
                      onChange={(e) => setDefaultTags(e.target.value)}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            {Object.keys(batchMetadata).length > 0 && (
              <Button 
                onClick={handleBatchUpload}
                disabled={isUploading}
                className="bg-[#8B5E3C] hover:bg-[#6B4B2F]"
              >
                {isUploading ? 'Uploading...' : `Upload ${Object.keys(batchMetadata).length} Files`}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteConfirmId && (
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-2">
                You are about to delete image ID: <strong>{deleteConfirmId}</strong>
              </p>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 text-sm font-medium">⚠️ Warning</p>
                <p className="text-red-700 text-sm">This will permanently remove the image from your gallery.</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Delete cancelled');
                setDeleteConfirmId(null);
              }}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (deleteConfirmId) {
                  console.log('Confirming delete for image:', deleteConfirmId);
                  deleteMutation.mutate(deleteConfirmId);
                }
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={showDeleteAllConfirm} onOpenChange={setShowDeleteAllConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Bulk Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedImages.length} selected images? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-2">
              You are about to delete <strong>{selectedImages.length}</strong> images.
            </p>
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-800 text-sm font-medium">⚠️ Warning</p>
              <p className="text-red-700 text-sm">This will permanently remove all selected images from your gallery.</p>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Selected image IDs: {selectedImages.join(', ')}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Bulk delete cancelled');
                setShowDeleteAllConfirm(false);
              }}
              disabled={bulkDeleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedImages.length > 0) {
                  console.log('Confirming bulk delete for images:', selectedImages);
                  bulkDeleteMutation.mutate(selectedImages);
                }
              }}
              disabled={bulkDeleteMutation.isPending || selectedImages.length === 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {bulkDeleteMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Deleting {selectedImages.length} images...
                </>
              ) : (
                <>
                  <Trash2Icon className="h-4 w-4 mr-2" />
                  Delete {selectedImages.length} Images
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Gallery Confirmation Dialog */}
      <Dialog open={showClearGalleryConfirm} onOpenChange={setShowClearGalleryConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Clear Entire Gallery</DialogTitle>
            <DialogDescription>
              This will permanently delete ALL images and videos from the gallery. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800 text-sm font-medium mb-2">⚠️ DANGER ZONE</p>
              <p className="text-red-700 text-sm mb-2">
                You are about to delete <strong>{images.length}</strong> media items from Ko Lake Villa gallery.
              </p>
              <p className="text-red-600 text-xs">
                This includes all images, videos, categories, and metadata. This operation cannot be reversed.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowClearGalleryConfirm(false)}
              disabled={clearingGallery}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClearGallery}
              disabled={clearingGallery}
              className="bg-red-600 hover:bg-red-700"
            >
              {clearingGallery ? (
                <>
                  <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                  Clearing Gallery...
                </>
              ) : (
                <>
                  <Trash2Icon className="h-4 w-4 mr-2" />
                  Clear All Media
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}