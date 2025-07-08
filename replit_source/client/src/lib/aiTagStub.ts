// AI tag logic for gallery images using OpenAI Vision API
export function generateTagsFromImage(imagePath: string): string[] {
  const filename = imagePath.toLowerCase();
  
  // Fallback tags based on filename patterns (used when API fails)
  if (filename.includes('pool')) return ['pool', 'luxury', 'relaxation'];
  if (filename.includes('room') || filename.includes('bedroom')) return ['accommodation', 'comfort', 'interior'];
  if (filename.includes('lake') || filename.includes('water')) return ['lake', 'nature', 'scenic'];
  if (filename.includes('dining') || filename.includes('kitchen')) return ['dining', 'culinary', 'amenities'];
  if (filename.includes('garden') || filename.includes('outdoor')) return ['garden', 'outdoor', 'nature'];
  if (filename.includes('sunset') || filename.includes('sunrise')) return ['sunset', 'scenic', 'golden-hour'];
  
  // Default villa tags
  return ['villa', 'koggala', 'sri-lanka'];
}

export async function analyzeImageContent(imageUrl: string): Promise<string[]> {
  try {
    // Call server-side OpenAI Vision API
    const response = await fetch('/api/ai/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl })
    });

    if (response.ok) {
      const data = await response.json();
      return data.tags || generateTagsFromImage(imageUrl);
    }
  } catch (error) {
    console.warn('AI image analysis failed, using filename-based tags:', error);
  }
  
  // Fallback to filename-based tagging
  return generateTagsFromImage(imageUrl);
}