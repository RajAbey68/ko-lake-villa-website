import { apiRequest } from "./queryClient";
import { GalleryImage, ImageUploadData, generateConsistentTags } from "./galleryUtils";

export interface GalleryApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  errors?: string[];
}

// Fetch all gallery images or filter by category
export async function fetchGalleryImages(category?: string): Promise<GalleryImage[]> {
  try {
    const url = category ? `/api/gallery?category=${category}` : '/api/gallery';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery images: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw error;
  }
}

// Upload a new image to the gallery
export async function uploadGalleryImage(
  file: File, 
  category: string, 
  alt: string, 
  description?: string, 
  featured: boolean = false,
  customTags?: string
): Promise<GalleryApiResponse> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    formData.append('alt', alt);
    formData.append('featured', featured.toString());
    
    if (description) {
      formData.append('description', description);
    }
    
    if (customTags) {
      formData.append('tags', customTags);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Upload failed',
        errors: result.errors
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

// Update an existing gallery image
export async function updateGalleryImage(
  id: number,
  updates: {
    category?: string;
    alt?: string;
    description?: string;
    featured?: boolean;
    customTags?: string;
    sortOrder?: number;
  }
): Promise<GalleryApiResponse> {
  try {
    const response = await apiRequest('PATCH', `/api/admin/gallery/${id}`, updates);
    
    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        error: result.error || 'Update failed',
        errors: result.errors
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error updating image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Update failed'
    };
  }
}

// Delete a gallery image
export async function deleteGalleryImage(id: number): Promise<GalleryApiResponse> {
  try {
    const response = await apiRequest('DELETE', `/api/gallery/${id}`);
    
    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        error: result.error || 'Delete failed'
      };
    }

    return {
      success: true,
      data: { message: 'Image deleted successfully' }
    };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    };
  }
}

// AI analysis for auto-categorization
export async function analyzeMedia(
  imageData: string, 
  filename: string, 
  mediaType: 'image' | 'video' = 'image'
): Promise<{
  suggestedCategory?: string;
  confidence?: number;
  description?: string;
  error?: string;
}> {
  try {
    const response = await apiRequest('POST', '/api/analyze-media', {
      imageData,
      filename,
      mediaType
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        error: result.error || 'AI analysis failed'
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing media:', error);
    return {
      error: error instanceof Error ? error.message : 'AI analysis failed'
    };
  }
}

// Bulk upload multiple images
export async function bulkUploadImages(
  uploads: Array<{
    file: File;
    category: string;
    alt: string;
    description?: string;
    featured?: boolean;
    customTags?: string;
  }>
): Promise<{
  successful: number;
  failed: number;
  results: GalleryApiResponse[];
}> {
  const results: GalleryApiResponse[] = [];
  let successful = 0;
  let failed = 0;

  for (const upload of uploads) {
    const result = await uploadGalleryImage(
      upload.file,
      upload.category,
      upload.alt,
      upload.description,
      upload.featured,
      upload.customTags
    );

    results.push(result);
    
    if (result.success) {
      successful++;
    } else {
      failed++;
    }
  }

  return {
    successful,
    failed,
    results
  };
}