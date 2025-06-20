import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UploadIcon, 
  ImageIcon, 
  XIcon,
  LoaderIcon
} from 'lucide-react';

import { 
  GALLERY_CATEGORIES, 
  validateImageData, 
  generateConsistentTags,
  formatCategoryLabel,
  getFileType
} from '@/lib/galleryUtils';

import { uploadGalleryImage, analyzeMedia } from '@/lib/galleryApi';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageUploadDialog({ isOpen, onClose }: ImageUploadDialogProps) {
  console.log('🔷 ImageUploadDialog rendered with isOpen:', isOpen);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  const [alt, setAlt] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [customTags, setCustomTags] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !category || !alt) {
        throw new Error('Missing required fields');
      }

      console.log("Starting upload mutation...");

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', category);
      formData.append('title', alt);
      formData.append('alt', alt);
      formData.append('description', description || '');
      formData.append('tags', customTags || '');
      formData.append('featured', featured.toString());
      formData.append('mediaType', selectedFile.type.startsWith('video/') ? 'video' : 'image');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      console.log("Upload result:", result);

      if (!result.success) {
        throw new Error(result.message || result.error || 'Upload failed');
      }

      return result;
    },
    onSuccess: (result) => {
      console.log("Upload successful:", result);

      // Invalidate and refetch gallery queries
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      handleClose();
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image (JPEG, PNG, GIF, WebP) or video (MP4, MOV, AVI) file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Auto-fill alt text with filename if empty
    if (!alt) {
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setAlt(fileName);
    }

    // Try AI analysis if API key is available
    await tryAIAnalysis(file);
  };

  const tryAIAnalysis = async (file: File) => {
    try {
      setIsAnalyzing(true);

      // Use the AI analysis endpoint we built
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category || '');

      const response = await fetch('/api/analyze-media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const analysis = await response.json();

        if (analysis.suggestedCategory) {
          setAiSuggestion(analysis.suggestedCategory);

          // Auto-fill title and description if provided
          if (analysis.title && !alt) {
            setAlt(analysis.title);
          }
          if (analysis.description && !description) {
            setDescription(analysis.description);
          }
          if (analysis.tags && !customTags) {
            setCustomTags(Array.isArray(analysis.tags) ? analysis.tags.join(', ') : analysis.tags);
          }

          toast({
            title: "AI Analysis Complete",
            description: `Suggested: ${formatCategoryLabel(analysis.suggestedCategory)} (${Math.round(analysis.confidence * 100)}% confidence)`,
          });
        }
      }
    } catch (error) {
      console.log('AI analysis not available');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("ImageUploadDialog submit with:", {
      selectedFile: selectedFile?.name,
      category,
      alt,
      customTags,
      featured
    });

    // Validate form data
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an image or video to upload",
        variant: "destructive",
      });
      return;
    }

    if (!category || category.trim() === '') {
      toast({
        title: "Category Required",
        description: "Please select a category for the image",
        variant: "destructive",
      });
      return;
    }

    if (!alt || alt.trim() === '') {
      toast({
        title: "Title Required", 
        description: "Please enter a title for the image",
        variant: "destructive",
      });
      return;
    }

    // Proceed with upload
    uploadMutation.mutate();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCategory('');
    setAlt('');
    setDescription('');
    setCustomTags('');
    setFeatured(false);
    setAiSuggestion(null);
    onClose();
  };

  const acceptAISuggestion = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion);
      setAiSuggestion(null);
    }
  };

  console.log('🔷 Rendering Dialog with open:', isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('🔷 Dialog onOpenChange called with:', open);
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Image or Video</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative">
                {selectedFile?.type.startsWith('video/') ? (
                  <video
                    src={previewUrl}
                    className="max-h-32 mx-auto rounded"
                    controls
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-32 mx-auto rounded"
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click to select an image or video</p>
                <p className="text-sm text-gray-500 mt-2">Supports: JPEG, PNG, GIF, WebP, MP4, MOV, AVI (Max 50MB)</p>
              </div>
            )}
          </div>

          {/* AI Analysis Status */}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Analyzing image with AI...
            </div>
          )}

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">AI Suggestion</p>
                  <p className="text-sm text-blue-700">
                    Recommended category: {formatCategoryLabel(aiSuggestion)}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={acceptAISuggestion}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Use Suggestion
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Selection */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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

            {/* Title/Alt Text */}
            <div>
              <Label htmlFor="alt">Title/Description *</Label>
              <Input
                id="alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Enter image title"
                required
              />
            </div>
          </div>

          {/* Additional Tags */}
          <div>
            <Label htmlFor="customTags">Additional Tags</Label>
            <Input
              id="customTags"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
              placeholder="beach, sunset, relaxing (comma-separated)"
            />
            {category && (
              <p className="text-xs text-gray-500 mt-1">
                Category "{formatCategoryLabel(category)}" will be automatically included
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
            />
            <Label htmlFor="featured">Featured Image</Label>
          </div>

          {/* Upload Progress */}
          {uploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>Processing</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedFile || !category || !alt || uploadMutation.isPending}
              className="bg-[#FF914D] hover:bg-[#8B5E3C] min-w-[120px]"
              onClick={handleSubmit}
            >
              {uploadMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              ) : (
                'Upload Image'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}