import { NextRequest, NextResponse } from 'next/server';

// Mock gallery data structure (in production, this would come from a database)
interface GalleryItem {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  mediaType: 'image' | 'video';
  uploadDate: string;
  views: number;
  likes: number;
  featured?: boolean;
}

// Sample gallery data for demonstration
const mockGalleryData: GalleryItem[] = [
  {
    id: '1',
    url: '/images/hero/drone-villa.jpg',
    title: 'Ko Lake Villa Aerial View',
    description: 'Stunning aerial view of the entire Ko Lake Villa property showcasing the infinity pool and lake',
    category: 'entire-villa',
    tags: ['aerial', 'drone', 'pool', 'villa', 'luxury'],
    mediaType: 'image',
    uploadDate: '2024-01-15',
    views: 245,
    likes: 42,
    featured: true
  },
  {
    id: '2',
    url: '/images/rooms/master.jpg',
    title: 'Master Suite with Lake View',
    description: 'Luxurious master suite featuring king-size bed and panoramic views of Koggala Lake',
    category: 'family-suite',
    tags: ['bedroom', 'suite', 'lake-view', 'luxury', 'master'],
    mediaType: 'image',
    uploadDate: '2024-01-16',
    views: 189,
    likes: 35
  },
  {
    id: '3',
    url: '/images/rooms/triple.jpg',
    title: 'Triple Room Comfort',
    description: 'Comfortable triple room perfect for friends or family groups',
    category: 'triple-room',
    tags: ['bedroom', 'triple', 'comfortable', 'group'],
    mediaType: 'image',
    uploadDate: '2024-01-17',
    views: 156,
    likes: 28
  },
  {
    id: '4',
    url: '/images/pool/infinity-sunset.jpg',
    title: '60ft Infinity Pool at Sunset',
    description: 'Breathtaking sunset views from the 60-foot infinity pool overlooking Koggala Lake',
    category: 'pool-deck',
    tags: ['pool', 'infinity', 'sunset', 'swimming', 'luxury'],
    mediaType: 'image',
    uploadDate: '2024-01-18',
    views: 312,
    likes: 58,
    featured: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category')?.toLowerCase();
    const tags = searchParams.get('tags')?.toLowerCase().split(',').filter(Boolean);
    const mediaType = searchParams.get('mediaType') as 'image' | 'video' | null;
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let results = [...mockGalleryData];

    // Filter by search query (searches in title, description, and tags)
    if (query) {
      results = results.filter(item => {
        const searchableText = [
          item.title,
          item.description,
          ...item.tags,
          item.category
        ].join(' ').toLowerCase();
        
        // Split query into words for better matching
        const queryWords = query.split(' ').filter(Boolean);
        return queryWords.every(word => searchableText.includes(word));
      });
    }

    // Filter by category
    if (category) {
      results = results.filter(item => item.category === category);
    }

    // Filter by tags (match any of the provided tags)
    if (tags && tags.length > 0) {
      results = results.filter(item => 
        tags.some(tag => item.tags.some(itemTag => itemTag.toLowerCase().includes(tag)))
      );
    }

    // Filter by media type
    if (mediaType) {
      results = results.filter(item => item.mediaType === mediaType);
    }

    // Filter by featured status
    if (featured) {
      results = results.filter(item => item.featured === true);
    }

    // Calculate relevance scores for sorting
    if (query && sortBy === 'relevance') {
      results = results.map(item => {
        let score = 0;
        const lowerQuery = query.toLowerCase();
        
        // Higher score for title matches
        if (item.title.toLowerCase().includes(lowerQuery)) score += 10;
        
        // Medium score for description matches
        if (item.description.toLowerCase().includes(lowerQuery)) score += 5;
        
        // Lower score for tag matches
        item.tags.forEach(tag => {
          if (tag.toLowerCase().includes(lowerQuery)) score += 2;
        });
        
        // Boost featured items
        if (item.featured) score += 3;
        
        return { ...item, relevanceScore: score };
      }).sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
    }

    // Sort results
    switch (sortBy) {
      case 'date':
        results.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'views':
        results.sort((a, b) => b.views - a.views);
        break;
      case 'likes':
        results.sort((a, b) => b.likes - a.likes);
        break;
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      // 'relevance' is already handled above
    }

    // Apply pagination
    const totalResults = results.length;
    const paginatedResults = results.slice(offset, offset + limit);

    // Generate search suggestions based on common tags
    const allTags = mockGalleryData.flatMap(item => item.tags);
    const tagFrequency = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const suggestions = Object.entries(tagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);

    return NextResponse.json({
      success: true,
      results: paginatedResults,
      total: totalResults,
      limit,
      offset,
      hasMore: offset + limit < totalResults,
      suggestions,
      query: {
        searchTerm: query || null,
        category: category || null,
        tags: tags || null,
        mediaType: mediaType || null,
        sortBy
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search gallery',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}