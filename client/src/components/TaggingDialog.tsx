import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageIcon } from 'lucide-react';

const GALLERY_CATEGORIES = [
  { value: "entire-villa", label: "Entire Villa" },
  { value: "family-suite", label: "Family Suite" },
  { value: "group-room", label: "Group Room" },
  { value: "triple-room", label: "Triple Room" },
  { value: "dining-area", label: "Dining Area" },
  { value: "pool-deck", label: "Pool Deck" },
  { value: "lake-garden", label: "Lake Garden" },
  { value: "roof-garden", label: "Roof Garden" },
  { value: "front-garden", label: "Front Garden and Entrance" },
  { value: "koggala-lake", label: "Koggala Lake and Surrounding" },
  { value: "excursions", label: "Excursions" }
];

interface TaggingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    category: string;
    tags: string;
    featured: boolean;
  }) => void;
  initialData?: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string;
    featured?: boolean;
  };
  imagePreview?: string;
}

export default function TaggingDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = {}, 
  imagePreview 
}: TaggingDialogProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [category, setCategory] = useState(initialData.category || GALLERY_CATEGORIES[0].value);
  const [tags, setTags] = useState(initialData.tags || '');
  const [featured, setFeatured] = useState(initialData.featured || false);

  // Update state when initialData changes (for editing existing images)
  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || GALLERY_CATEGORIES[0].value);
      setTags(initialData.tags || '');
      setFeatured(initialData.featured || false);
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      tags: tags.trim(),
      featured
    });
    onClose();
  };

  const handleTagsChange = (value: string) => {
    // Auto-format tags: remove duplicates, trim spaces, ensure comma separation with spaces
    const tagList = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const uniqueTags = Array.from(new Set(tagList));
    setTags(uniqueTags.join(', '));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Tag Your Photo</DialogTitle>
        </DialogHeader>
        <p id="dialog-description" className="text-sm text-gray-600 -mt-2 mb-4">
          Edit the title, description, category, and tags for this image
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview.startsWith('http') ? imagePreview : `${window.location.origin}${imagePreview}`} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border"
                  onLoad={() => console.log('Image preview loaded successfully')}
                  onError={(e) => {
                    console.error('Image preview failed to load:', imagePreview);
                    e.currentTarget.style.display = 'none';
                    const errorDiv = e.currentTarget.parentElement?.querySelector('.error-message') as HTMLElement;
                    if (errorDiv) errorDiv.style.display = 'block';
                  }}
                />
                <div className="error-message text-red-500 text-sm mt-2" style={{display: 'none'}}>
                  Preview unavailable - image will be processed after upload
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                  <p className="text-sm">Image preview will appear here</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Photo Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Beautiful Lake View"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Give your photo a descriptive title
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GALLERY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what's shown in this photo..."
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags for SEO</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="lake, sunset, peaceful, accommodation"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use comma-separated words. I'll automatically format them with hashtags for SEO.
              </p>
              {tags && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                  <strong>SEO Tags:</strong> {tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).map(tag => `#${tag}`).join(' ')}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
              <Label htmlFor="featured">Featured Photo</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#8B5E3C] hover:bg-[#6B4B2F]">
            Save Tags
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}