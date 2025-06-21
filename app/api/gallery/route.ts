import { NextResponse } from 'next/server';

// This is a placeholder for a real database or image service.
// In a real application, you would fetch this data from a CMS, a database, or a cloud storage service.
const allImages = [
  // Entire Villa
  { id: '1', title: 'Spacious Living Area', description: 'Relax in our open-plan living space with views of the lake.', imageUrl: '/placeholder.svg?height=400&width=600&text=Villa+Living+Room', category: 'entire-villa', mediaType: 'image', tags: 'living room, interior, luxury' },
  { id: '2', title: 'Master Bedroom Retreat', description: 'A serene master bedroom for ultimate relaxation.', imageUrl: '/placeholder.svg?height=400&width=600&text=Master+Bedroom', category: 'entire-villa', mediaType: 'image', tags: 'bedroom, suite, comfort' },
  
  // Family Suite
  { id: '3', title: 'Family Suite Main Room', description: 'Ample space for the whole family to unwind.', imageUrl: '/placeholder.svg?height=400&width=600&text=Family+Suite', category: 'family-suite', mediaType: 'image', tags: 'family, suite, space' },

  // Group Room
  { id: '4', title: 'Modern Group Accommodation', description: 'Stylishly designed for friends and groups travelling together.', imageUrl: '/placeholder.svg?height=400&width=600&text=Group+Room', category: 'group-room', mediaType: 'image', tags: 'group, friends, modern' },

  // Triple Room
  { id: '5', title: 'Comfortable Triple Room', description: 'Perfect for three, combining style and comfort.', imageUrl: '/placeholder.svg?height=400&width=600&text=Triple+Room', category: 'triple-room', mediaType: 'image', tags: 'triple, room, cozy' },

  // Dining Area
  { id: '6', title: 'Lakeside Dining', description: 'Enjoy exquisite meals with a stunning lake backdrop.', imageUrl: '/placeholder.svg?height=400&width=600&text=Dining+Area', category: 'dining-area', mediaType: 'image', tags: 'dining, food, view' },

  // Pool Deck
  { id: '7', title: 'Infinity Pool Serenity', description: 'The infinity pool overlooking Koggala Lake.', imageUrl: '/placeholder.svg?height=400&width=600&text=Infinity+Pool', category: 'pool-deck', mediaType: 'image', tags: 'pool, swimming, sunset' },
  
  // Video Example
  { id: '8', title: 'A Quick Tour of the Villa', description: 'A short video walkthrough of the main areas.', imageUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', category: 'entire-villa', mediaType: 'video', tags: 'tour, video, walkthrough' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    let images = allImages;
    if (category) {
      images = allImages.filter(img => img.category === category);
    }
    return NextResponse.json(images);
  } catch (error) {
    console.error('Failed to fetch gallery images:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
