# Ko Lake Villa Gallery System - Complete Source Code Specification

## Problem Statement
The current gallery system has a fundamental logic flaw where category selection and tag generation are independent, causing conflicting information (e.g., category shows "Family Suite" but tags show "#entire-villa").

## Required Architecture

### 1. Database Schema
```sql
CREATE TABLE gallery_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt TEXT,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 1,
  media_type TEXT DEFAULT 'image',
  display_size TEXT DEFAULT 'medium',
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Category System (Fixed List)
```typescript
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
  { value: "excursions", label: "Excursions" }
];
```

### 3. TypeScript Interfaces
```typescript
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
  displaySize: 'small' | 'medium' | 'big';
  fileSize?: number;
}

interface ImageUploadData {
  file: File;
  category: string;
  alt: string;
  description?: string;
  featured: boolean;
  tags?: string;
}
```

### 4. Core Logic Rules

#### Tag-Category Consistency Rule:
```typescript
// CRITICAL: Tags must be derived FROM category, not independent
function generateConsistentTags(category: string, customTags?: string): string {
  const categoryTag = category; // Use category as primary tag
  const additionalTags = customTags ? customTags.split(',').map(t => t.trim()) : [];
  
  // Always include category as first tag
  const allTags = [categoryTag, ...additionalTags];
  
  // Remove duplicates and return
  return Array.from(new Set(allTags)).join(',');
}
```

#### Validation Rule:
```typescript
function validateImageData(data: ImageUploadData): boolean {
  // Category must be from approved list
  const validCategories = GALLERY_CATEGORIES.map(c => c.value);
  if (!validCategories.includes(data.category)) return false;
  
  // Tags must include category
  if (data.tags && !data.tags.includes(data.category)) return false;
  
  return true;
}
```

### 5. API Endpoints Required

```typescript
// GET /api/gallery - Fetch all images
// GET /api/gallery?category=family-suite - Fetch by category
// POST /api/gallery - Upload new image
// PUT /api/gallery/:id - Update existing image
// DELETE /api/gallery/:id - Delete image
// POST /api/analyze-media - AI analysis (optional)
```

### 6. Component Structure

#### Main Gallery Manager Component:
```typescript
// client/src/components/GalleryManager.tsx
export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  
  // Fetch images with proper error handling
  // Display in grid with category filters
  // Handle edit/delete operations
  // Ensure tag-category consistency
}
```

#### Upload Dialog Component:
```typescript
// client/src/components/ImageUploadDialog.tsx
export default function ImageUploadDialog() {
  // File selection
  // Category selection (required)
  // Auto-generate tags based on category
  // Validation before upload
  // Progress tracking
}
```

#### Gallery Display Component:
```typescript
// client/src/pages/Gallery.tsx
export default function Gallery() {
  // Public gallery view
  // Category filtering
  // Modal view for full images
  // Responsive grid layout
}
```

### 7. Key Features Required

1. **Consistent Categorization**: Category and tags must always match
2. **Bulk Upload**: Multiple images with batch categorization
3. **AI Integration**: Optional auto-categorization
4. **Search/Filter**: By category, tags, or text
5. **Drag & Drop**: Easy reordering
6. **Image Optimization**: Automatic resizing/compression
7. **Video Support**: MP4 files with thumbnails

### 8. File Structure
```
client/src/
├── components/
│   ├── GalleryManager.tsx (main admin component)
│   ├── ImageUploadDialog.tsx (single upload)
│   ├── BulkUploadDialog.tsx (multiple upload)
│   ├── GalleryModal.tsx (full-size view)
│   └── CategoryFilter.tsx (filter controls)
├── pages/
│   ├── Gallery.tsx (public gallery)
│   └── admin/
│       └── Gallery.tsx (admin wrapper)
└── lib/
    ├── galleryApi.ts (API calls)
    └── galleryUtils.ts (validation, formatting)

server/
├── routes/
│   └── gallery.ts (API endpoints)
└── storage/
    └── galleryStorage.ts (database operations)
```

### 9. Critical Fixes Needed

1. **Remove Category-Tag Independence**: Tags must derive from category
2. **Fix Display Logic**: Show category prominently, tags as secondary
3. **Add Validation**: Prevent conflicting category/tag combinations
4. **Simplify UI**: Category dropdown as primary control
5. **Fix Modal Display**: Show full-size image, not category text
6. **Error Handling**: Proper fallbacks for missing images

### 10. Current Issues to Resolve

- ❌ Category shows "Family Suite" but tags show "#entire-villa"
- ❌ Modal shows category text instead of full image
- ❌ No validation between category and tags
- ❌ Inconsistent data across components
- ❌ React rendering errors with object display
- ❌ Missing image files causing 404 errors

### 11. Design Requirements

- Clean, professional interface
- Ko Lake Villa branding colors: #8B5E3C, #A0B985, #FF914D, #FDF6EE
- Responsive design for mobile/tablet/desktop
- Accessibility compliance
- Fast loading with image optimization

This specification provides the complete architecture needed to rebuild the gallery system correctly.