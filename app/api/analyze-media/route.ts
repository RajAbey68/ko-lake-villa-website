import { NextRequest, NextResponse } from 'next/server';

// Ko Lake Villa specific categories for AI categorization
const VILLA_CATEGORIES = [
  'entire-villa',
  'family-suite',
  'group-room',
  'triple-room',
  'dining-area',
  'pool-deck',
  'lake-garden',
  'roof-garden',
  'front-garden',
  'koggala-lake',
  'excursions'
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, mediaType = 'image' } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY || process.env.API_SECRET_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not configured, returning default analysis');
      return NextResponse.json({
        success: true,
        analysis: {
          category: 'entire-villa',
          title: 'Ko Lake Villa',
          description: 'Beautiful luxury accommodation at Ko Lake Villa, Ahangama',
          tags: ['villa', 'luxury', 'koggala', 'sri-lanka', 'accommodation'],
          confidence: 0.5,
          mediaType
        }
      });
    }

    // Prepare the image URL (handle relative URLs)
    let fullImageUrl = imageUrl;
    if (imageUrl.startsWith('/')) {
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      fullImageUrl = `${protocol}://${host}${imageUrl}`;
    }

    // Call OpenAI Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image from Ko Lake Villa, a luxury lakeside accommodation in Ahangama, Sri Lanka. 
                
                Categories to choose from: ${VILLA_CATEGORIES.join(', ')}
                
                Generate:
                1. The most appropriate category from the list above
                2. A captivating title (max 50 characters)
                3. An engaging description (max 150 characters) 
                4. 5 relevant tags
                5. A confidence score (0-1)
                
                Return ONLY a JSON object in this format:
                {
                  "category": "...",
                  "title": "...",
                  "description": "...",
                  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
                  "confidence": 0.95
                }`
              },
              {
                type: 'image_url',
                image_url: {
                  url: fullImageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      // Return fallback analysis on API error
      return NextResponse.json({
        success: true,
        analysis: {
          category: 'entire-villa',
          title: 'Ko Lake Villa Experience',
          description: 'Discover luxury accommodation at Ko Lake Villa in beautiful Ahangama, Sri Lanka',
          tags: ['villa', 'luxury', 'pool', 'garden', 'sri-lanka'],
          confidence: 0.6,
          mediaType
        }
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    try {
      const analysis = JSON.parse(content);
      
      // Validate and sanitize the response
      const validatedAnalysis = {
        category: VILLA_CATEGORIES.includes(analysis.category) ? analysis.category : 'entire-villa',
        title: (analysis.title || 'Ko Lake Villa').substring(0, 50),
        description: (analysis.description || 'Experience luxury at Ko Lake Villa').substring(0, 150),
        tags: Array.isArray(analysis.tags) ? analysis.tags.slice(0, 5) : ['villa', 'luxury', 'koggala'],
        confidence: typeof analysis.confidence === 'number' ? analysis.confidence : 0.85,
        mediaType
      };

      return NextResponse.json({
        success: true,
        analysis: validatedAnalysis
      });

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      
      // Extract what we can from the text response
      return NextResponse.json({
        success: true,
        analysis: {
          category: 'entire-villa',
          title: 'Ko Lake Villa',
          description: content ? content.substring(0, 150) : 'Luxury accommodation at Ko Lake Villa',
          tags: ['villa', 'luxury', 'ahangama', 'sri-lanka', 'accommodation'],
          confidence: 0.7,
          mediaType
        }
      });
    }

  } catch (error) {
    console.error('Media analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze media',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}