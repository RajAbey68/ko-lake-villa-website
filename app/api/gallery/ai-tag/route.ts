import { NextResponse } from 'next/server';

interface AITagRequest {
  imagePath: string;
  imageData?: string; // Base64 encoded image data
}

interface AITagResponse {
  tags: string[];
  description: string;
  confidence: number;
  processingTime: number;
}

export async function POST(request: Request) {
  try {
    const body: AITagRequest = await request.json();
    
    if (!body.imagePath) {
      return NextResponse.json(
        { error: 'Image path is required.' },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock AI tagging based on image path
    const tags = generateMockTags(body.imagePath);
    const description = generateMockDescription(body.imagePath);
    
    const response: AITagResponse = {
      tags,
      description,
      confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
      processingTime: 1000 + Math.random() * 500 // 1-1.5 seconds
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI tagging error:', error);
    return NextResponse.json(
      { error: 'Failed to process image tagging. Please try again.' },
      { status: 500 }
    );
  }
}

function generateMockTags(imagePath: string): string[] {
  const path = imagePath.toLowerCase();
  
  if (path.includes('family-suite')) {
    return ['luxury', 'family', 'suite', 'lake view', 'balcony', 'premium', 'spacious'];
  } else if (path.includes('triple-room')) {
    return ['comfortable', 'triple', 'twin', 'garden view', 'shared', 'budget-friendly'];
  } else if (path.includes('group-room')) {
    return ['group', 'multiple beds', 'shared space', 'social', 'friends', 'family'];
  } else if (path.includes('pool-deck')) {
    return ['pool', 'outdoor', 'relaxation', 'swimming', 'deck', 'sunset', 'lake'];
  } else if (path.includes('lake-garden')) {
    return ['lake', 'garden', 'nature', 'serene', 'peaceful', 'outdoor', 'greenery'];
  } else if (path.includes('dining-area')) {
    return ['dining', 'food', 'restaurant', 'meals', 'social', 'gathering'];
  } else if (path.includes('excursions')) {
    return ['adventure', 'excursion', 'activity', 'exploration', 'experience'];
  } else {
    return ['villa', 'accommodation', 'luxury', 'vacation', 'travel'];
  }
}

function generateMockDescription(imagePath: string): string {
  const path = imagePath.toLowerCase();
  
  if (path.includes('family-suite')) {
    return 'Spacious family suite with stunning lake views and premium amenities, perfect for families seeking luxury and comfort.';
  } else if (path.includes('triple-room')) {
    return 'Comfortable triple occupancy room with modern amenities and peaceful garden views, ideal for small groups.';
  } else if (path.includes('group-room')) {
    return 'Large group accommodation perfect for extended families or friends traveling together with shared facilities.';
  } else if (path.includes('pool-deck')) {
    return 'Beautiful infinity pool deck overlooking the lake, perfect for relaxation and enjoying the stunning views.';
  } else if (path.includes('lake-garden')) {
    return 'Serene lake garden area with lush greenery and peaceful atmosphere, ideal for quiet contemplation.';
  } else if (path.includes('dining-area')) {
    return 'Elegant dining area where guests can enjoy delicious meals while taking in the beautiful surroundings.';
  } else if (path.includes('excursions')) {
    return 'Exciting excursion opportunities showcasing the local area and providing memorable experiences for guests.';
  } else {
    return 'Beautiful accommodation showcasing the luxury and comfort available at Ko Lake Villa.';
  }
} 