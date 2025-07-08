// Gallery utility functions with tag-category consistency

export const GALLERY_CATEGORIES = [
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
  { value: "friends", label: "Friends" },
  { value: "events", label: "Events" }
];

export interface GalleryImage {
  id: number;
  imageUrl: string;
  alt: string;
  description?: string;
  category: string;
  tags?: string;
  featured: boolean;
  sortOrder: number;
  mediaType: 'image' | 'video';
  displaySize?: 'small' | 'medium' | 'big';
  fileSize?: number;
}

export interface ImageUploadData {
  file: File;
  category: string;
  alt: string;
  description?: string;
  featured: boolean;
  tags?: string;
}

// CRITICAL: Tags must be derived FROM category, not independent
export function generateConsistentTags(category: string, customTags?: string): string {
  const categoryTag = category; // Use category as primary tag
  const additionalTags = customTags ? 
    customTags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

  // Always include category as first tag
  const allTags = [categoryTag, ...additionalTags];

  // Remove duplicates and return
  return Array.from(new Set(allTags)).join(',');
}

// Validation function
export function validateImageData(data: Partial<ImageUploadData>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validCategories = GALLERY_CATEGORIES.map(c => c.value);

  // Category must be from approved list
  if (!data.category || !validCategories.includes(data.category)) {
    errors.push("Category must be selected from the approved list");
  }

  // Alt text is required
  if (!data.alt || data.alt.trim().length === 0) {
    errors.push("Image title/description is required");
  }

  // Tags must include category if provided
  if (data.tags && data.category && !data.tags.includes(data.category)) {
    errors.push("Tags must include the selected category");
  }

  return { valid: errors.length === 0, errors };
}

// Format category for display
export function formatCategoryLabel(categoryValue: string): string {
  const category = GALLERY_CATEGORIES.find(c => c.value === categoryValue);
  return category ? category.label : categoryValue
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Parse tags for display with hashtags
export function formatTagsForDisplay(tags?: string | string[]): string[] {
  if (!tags) return [];

  // Handle case where tags is already an array
  if (Array.isArray(tags)) {
    return tags
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);
  }

  // Handle case where tags is a string
  if (typeof tags === 'string') {
    return tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);
  }

  return [];
}

// Get category filter options
export function getCategoryFilterOptions() {
  return [
    { value: null, label: "All Categories" },
    ...GALLERY_CATEGORIES
  ];
}

// Sort images by priority and sort order
export function sortGalleryImages(images: GalleryImage[]): GalleryImage[] {
  return [...images].sort((a, b) => {
    // Featured images first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Then by sort order
    return (a.sortOrder || 1) - (b.sortOrder || 1);
  });
}

// Filter images by category
export function filterImagesByCategory(images: GalleryImage[], category: string | null): GalleryImage[] {
  if (!category) return images;
  return images.filter(img => img.category === category);
}

// Get file type from file extension
export function getFileType(filename: string): 'image' | 'video' {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return videoExtensions.includes(extension) ? 'video' : 'image';
}

// Format file size for display
export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown size';

  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}