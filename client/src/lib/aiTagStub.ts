// AI tag logic for gallery images
export function generateTagsFromImage(imagePath: string): string[] {
  const filename = imagePath.toLowerCase();
  
  // Determine tags based on filename patterns
  if (filename.includes('pool')) return ['pool', 'luxury', 'relaxation'];
  if (filename.includes('room') || filename.includes('bedroom')) return ['accommodation', 'comfort', 'interior'];
  if (filename.includes('lake') || filename.includes('water')) return ['lake', 'nature', 'scenic'];
  if (filename.includes('dining') || filename.includes('kitchen')) return ['dining', 'culinary', 'amenities'];
  if (filename.includes('garden') || filename.includes('outdoor')) return ['garden', 'outdoor', 'nature'];
  if (filename.includes('sunset') || filename.includes('sunrise')) return ['sunset', 'scenic', 'golden-hour'];
  
  // Default villa tags
  return ['villa', 'koggala', 'sri-lanka'];
}

export function analyzeImageContent(imageUrl: string): Promise<string[]> {
  // This would integrate with OpenAI Vision API in production
  return Promise.resolve(generateTagsFromImage(imageUrl));
}