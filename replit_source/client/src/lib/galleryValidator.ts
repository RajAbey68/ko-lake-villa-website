/**
 * Comprehensive Gallery Validation System
 * Ensures data integrity, no duplicates, clean titles, proper layout
 */

export interface ValidatedGalleryImage {
  id: number;
  imageUrl: string;
  title: string;
  alt: string;
  description: string | null;
  category: string;
  mediaType: string;
  tags: string | null;
  featured: boolean;
  sortOrder: number;
  displaySize: string;
  fileSize: number | null;
  isValid: boolean;
  validationNotes: string[];
}

export class GalleryValidator {
  private validationRules = {
    // No duplicates by URL
    noDuplicateUrls: true,
    // No similar visual content
    noSimilarContent: true,
    // Clean, meaningful titles
    cleanTitles: true,
    // Proper descriptions
    properDescriptions: true,
    // Valid categories
    validCategories: true,
    // Consistent aspect ratios
    consistentDisplay: true
  };

  private categoryTitles: Record<string, string> = {
    'entire-villa': 'Complete Villa Experience',
    'family-suite': 'Family Suite',
    'group-room': 'Group Accommodation', 
    'triple-room': 'Triple Room',
    'dining-area': 'Dining Experience',
    'pool-deck': 'Pool & Deck Area',
    'lake-garden': 'Lake Garden Views',
    'roof-garden': 'Rooftop Garden',
    'front-garden': 'Front Garden',
    'koggala-lake': 'Koggala Lake',
    'excursions': 'Local Excursions',
    'friends': 'Social Spaces',
    'events': 'Event Spaces',
    'default': 'Villa Gallery'
  };

  private categoryDescriptions: Record<string, string> = {
    'entire-villa': 'Experience the complete Ko Lake Villa with exclusive access to all amenities',
    'family-suite': 'Spacious family accommodation with lake views and premium amenities',
    'group-room': 'Perfect for groups and families traveling together',
    'triple-room': 'Comfortable triple occupancy with modern facilities',
    'dining-area': 'Elegant dining spaces with authentic Sri Lankan cuisine',
    'pool-deck': 'Relaxing pool area with panoramic lake views',
    'lake-garden': 'Beautiful gardens overlooking Koggala Lake',
    'roof-garden': 'Serene rooftop garden with 360-degree views',
    'front-garden': 'Welcoming entrance gardens with tropical landscaping',
    'koggala-lake': 'Stunning Koggala Lake with pristine natural beauty',
    'excursions': 'Exciting local adventures and cultural experiences',
    'friends': 'Social spaces perfect for gathering and relaxation',
    'events': 'Memorable venues for special occasions and celebrations',
    'default': 'Beautiful spaces at Ko Lake Villa'
  };

  validateAndProcessImages(rawImages: any[]): ValidatedGalleryImage[] {
    if (!Array.isArray(rawImages)) return [];

    console.log(`Gallery Validator: Processing ${rawImages.length} images`);

    // Step 1: Remove exact duplicates by URL only
    const uniqueByUrl = this.removeDuplicateUrls(rawImages);
    
    // Step 2: Skip similarity checking to show all unique images
    // const deduplicatedImages = this.removeSimilarImages(uniqueByUrl);
    
    // Step 3: Validate and clean each image
    const validatedImages = uniqueByUrl.map(image => this.validateSingleImage(image));
    
    // Step 4: Sort by priority (featured first, then by category importance)
    const sortedImages = this.sortImagesByPriority(validatedImages);
    
    console.log(`Gallery Validator: Processed ${sortedImages.length} unique, validated images`);
    
    return sortedImages;
  }

  private removeDuplicateUrls(images: any[]): any[] {
    const seen = new Set<string>();
    return images.filter(image => {
      if (seen.has(image.imageUrl)) {
        return false;
      }
      seen.add(image.imageUrl);
      return true;
    });
  }

  private removeSimilarImages(images: any[]): any[] {
    const unique: any[] = [];
    
    for (const image of images) {
      const filename = this.extractBaseFilename(image.imageUrl);
      
      // Check if we already have a similar image
      const similarExists = unique.some(existing => {
        const existingFilename = this.extractBaseFilename(existing.imageUrl);
        return this.areImagesSimilar(filename, existingFilename);
      });
      
      if (!similarExists) {
        unique.push(image);
      }
    }
    
    return unique;
  }

  private extractBaseFilename(url: string): string {
    const filename = url.split('/').pop() || '';
    return filename
      .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
      .replace(/_thumb|_small|_medium|_large|_\d+x\d+/i, '')
      .replace(/\-\d{13}\-\d+\-/, '-')
      .toLowerCase();
  }

  private areImagesSimilar(filename1: string, filename2: string): boolean {
    // Remove common variations
    const normalize = (name: string) => name
      .replace(/[\-_\s]+/g, '')
      .replace(/\d+/g, '')
      .toLowerCase();
    
    const norm1 = normalize(filename1);
    const norm2 = normalize(filename2);
    
    // Check if they're essentially the same
    return norm1 === norm2 || 
           norm1.includes(norm2) || 
           norm2.includes(norm1) ||
           this.levenshteinDistance(norm1, norm2) < 3;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[b.length][a.length];
  }

  private validateSingleImage(image: any): ValidatedGalleryImage {
    const validationNotes: string[] = [];
    let isValid = true;

    // Generate clean title
    const cleanTitle = this.generateCleanTitle(image);
    if (cleanTitle !== image.title) {
      validationNotes.push('Title cleaned from filename');
    }

    // Generate clean description
    const cleanDescription = this.generateCleanDescription(image);
    if (!image.description || this.isFilenamePattern(image.description)) {
      validationNotes.push('Description generated from category');
    }

    // Validate category
    if (!this.categoryTitles[image.category]) {
      validationNotes.push('Invalid category, using default');
      image.category = 'default';
    }

    // Check for filename patterns in title
    if (this.isFilenamePattern(image.title)) {
      validationNotes.push('Original title was filename pattern');
    }

    return {
      id: image.id,
      imageUrl: image.imageUrl,
      title: cleanTitle,
      alt: image.alt || cleanTitle,
      description: cleanDescription,
      category: image.category,
      mediaType: image.mediaType || 'image',
      tags: image.tags || null,
      featured: image.featured || false,
      sortOrder: image.sortOrder || 0,
      displaySize: image.displaySize || 'medium',
      fileSize: image.fileSize || null,
      isValid,
      validationNotes
    };
  }

  private generateCleanTitle(image: any): string {
    // Use existing title if it's clean
    if (image.title && !this.isFilenamePattern(image.title) && image.title.length < 60) {
      return image.title;
    }

    // Generate from category
    return this.categoryTitles[image.category] || this.categoryTitles['default'];
  }

  private generateCleanDescription(image: any): string {
    // Use existing description if it's meaningful
    if (image.description && !this.isFilenamePattern(image.description) && image.description.length > 10) {
      return image.description;
    }

    // Generate from category
    const baseDescription = this.categoryDescriptions[image.category] || this.categoryDescriptions['default'];
    
    // Add tags if available
    if (image.tags) {
      const tags = image.tags.split(',').map((t: string) => t.trim()).slice(0, 3);
      if (tags.length > 0) {
        return `${baseDescription} featuring ${tags.join(', ')}`;
      }
    }

    return baseDescription;
  }

  private isFilenamePattern(str: string): boolean {
    if (!str) return true;
    
    return /^\d+[\-_]\d+/.test(str) || 
           /WhatsApp\s+(Image|Video)/i.test(str) ||
           str.includes('_') && str.length > 20 ||
           /\.(jpg|jpeg|png|gif|mp4|mov|webm)$/i.test(str) ||
           /^\d{8,}/.test(str);
  }

  private sortImagesByPriority(images: ValidatedGalleryImage[]): ValidatedGalleryImage[] {
    const categoryPriority: Record<string, number> = {
      'entire-villa': 1,
      'family-suite': 2,
      'pool-deck': 3,
      'lake-garden': 4,
      'dining-area': 5,
      'roof-garden': 6,
      'front-garden': 7,
      'group-room': 8,
      'triple-room': 9,
      'koggala-lake': 10,
      'excursions': 11,
      'events': 12,
      'friends': 13,
      'default': 99
    };

    return images.sort((a, b) => {
      // Featured images first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by category priority
      const aPriority = categoryPriority[a.category] || 50;
      const bPriority = categoryPriority[b.category] || 50;
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // Then by sort order
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      
      // Finally by ID
      return a.id - b.id;
    });
  }
}

// Export singleton instance
export const galleryValidator = new GalleryValidator();