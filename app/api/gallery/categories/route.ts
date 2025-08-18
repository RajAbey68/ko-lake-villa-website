import { NextResponse } from 'next/server';

// Ko Lake Villa specific categories
const VILLA_CATEGORIES = [
  { id: 'entire-villa', name: 'Entire Villa', description: 'Complete villa for 18+ guests', count: 0 },
  { id: 'family-suite', name: 'Family Suite', description: 'Master suite for 6+ guests', count: 0 },
  { id: 'triple-room', name: 'Triple Rooms', description: '5 rooms for 3+ guests each', count: 0 },
  { id: 'group-room', name: 'Group Room', description: 'Accommodation for 6+ guests', count: 0 },
  { id: 'dining-area', name: 'Dining Area', description: 'Indoor and outdoor dining spaces', count: 0 },
  { id: 'pool-deck', name: 'Pool Deck', description: '60ft infinity pool area', count: 0 },
  { id: 'lake-garden', name: 'Lake Garden', description: 'Koggala Lake views and gardens', count: 0 },
  { id: 'roof-garden', name: 'Roof Garden', description: 'Rooftop terrace with panoramic views', count: 0 },
  { id: 'front-garden', name: 'Front Garden', description: 'Entrance and front landscaping', count: 0 },
  { id: 'koggala-lake', name: 'Koggala Lake', description: 'Lake activities and views', count: 0 },
  { id: 'excursions', name: 'Excursions', description: 'Local attractions and activities', count: 0 }
];

export async function GET() {
  try {
    // TODO: In production, these counts would come from a database
    // For now, returning the category structure with mock counts
    const categoriesWithCounts = VILLA_CATEGORIES.map(category => ({
      ...category,
      count: Math.floor(Math.random() * 10) + 1 // Mock count for now
    }));

    return NextResponse.json({
      success: true,
      categories: categoriesWithCounts,
      total: categoriesWithCounts.length
    });
  } catch (error) {
    console.error('Failed to fetch gallery categories:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to load gallery categories',
        categories: [] 
      }, 
      { status: 500 }
    );
  }
} 