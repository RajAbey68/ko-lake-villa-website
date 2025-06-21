/**
 * Utility functions for clean image display and validation
 */

export function validateAndDeduplicateImages(images: any[]): any[] {
  if (!Array.isArray(images)) return [];
  
  // Remove exact duplicates by imageUrl
  const uniqueByUrl = images.reduce((unique: any[], current) => {
    const isDuplicate = unique.some(item => item.imageUrl === current.imageUrl);
    if (!isDuplicate) {
      unique.push(current);
    }
    return unique;
  }, []);
  
  // Remove similar images (same visual content, different metadata)
  const deduplicated = uniqueByUrl.reduce((unique: any[], current) => {
    const filename = current.imageUrl.split('/').pop() || '';
    const basePattern = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/_\d+/g, '');
    
    const isSimilar = unique.some(item => {
      const existingFilename = item.imageUrl.split('/').pop() || '';
      const existingPattern = existingFilename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/_\d+/g, '');
      return basePattern === existingPattern;
    });
    
    if (!isSimilar) {
      unique.push(current);
    }
    return unique;
  }, []);
  
  return deduplicated;
}

export function generateCleanTitle(image: any): string {
  // If we have a proper title that's not a filename, use it
  if (image.title && !isFilename(image.title)) {
    return image.title;
  }

  // If we have a description, use first sentence
  if (image.description && image.description.length > 0) {
    const firstSentence = image.description.split('.')[0].trim();
    if (firstSentence.length > 3 && firstSentence.length < 60) {
      return firstSentence;
    }
  }

  // Generate title from category
  if (image.category) {
    return formatCategoryTitle(image.category);
  }

  // Last resort: use media type
  return image.mediaType === 'video' ? 'Villa Video' : 'Villa Image';
}

function isFilename(str: string): boolean {
  // Check if string looks like a filename
  return /^\d+[\-_]\d+[\-_]/.test(str) || // Timestamp patterns
         /WhatsApp\s+(Image|Video)/i.test(str) || // WhatsApp patterns
         str.includes('_') && str.length > 20 || // Long underscore names
         /\.(jpg|jpeg|png|gif|mp4|mov|webm)$/i.test(str); // File extensions
}

function formatCategoryTitle(category: string): string {
  const categoryTitles: Record<string, string> = {
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

  return categoryTitles[category] || categoryTitles['default'];
}

export function generateCleanDescription(image: any): string {
  // Use existing description if it's meaningful
  if (image.description && !isFilename(image.description) && image.description.length > 10) {
    return image.description;
  }

  // Generate description from category and tags
  const categoryDesc = getCategoryDescription(image.category);
  const tags = image.tags ? image.tags.split(',').map((t: string) => t.trim()).slice(0, 3) : [];
  
  if (tags.length > 0) {
    return `${categoryDesc} featuring ${tags.join(', ')}`;
  }

  return categoryDesc;
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
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

  return descriptions[category] || descriptions['default'];
}