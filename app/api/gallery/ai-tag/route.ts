import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AITagRequest {
  imagePath: string;
  imageData?: string; // Base64 encoded image data
}

interface AITagResponse {
  tags: string[];
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  altText?: string;
  confidence: number;
  processingTime: number;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const body: AITagRequest = await request.json();
    
    if (!body.imagePath) {
      return NextResponse.json(
        { error: 'Image path is required.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not configured, falling back to mock data');
      return getMockResponse(body.imagePath, startTime);
    }

    // Get the full file path
    const fullPath = path.join(process.cwd(), 'public', body.imagePath);
    
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Image file not found.' },
        { status: 404 }
      );
    }

    // Read and encode the image
    const imageBuffer = fs.readFileSync(fullPath);
    let base64Image = imageBuffer.toString('base64');
    
    // Compress large images (>4MB) to stay within OpenAI limits
    if (imageBuffer.length > 4 * 1024 * 1024) {
      try {
        const sharp = require('sharp');
        const compressedBuffer = await sharp(imageBuffer)
          .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();
        base64Image = compressedBuffer.toString('base64');
        console.log(`📦 Compressed image from ${imageBuffer.length} to ${compressedBuffer.length} bytes`);
      } catch (compressionError) {
        console.warn('Image compression failed, using original:', compressionError);
      }
    }

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image from Ko Lake Villa, a luxury lakeside accommodation in Ahangama, Sri Lanka. 

Generate comprehensive SEO metadata:
1. 5-7 relevant tags (focus on: accommodation features, amenities, views, activities, luxury elements)
2. A compelling description (50-100 words)
3. SEO-optimized title (under 60 characters)
4. Meta description for search engines (under 160 characters)  
5. Accessible alt text (descriptive, under 125 characters)

Categories available: entire-villa, family-suite, group-room, triple-room, dining-area, pool-deck, lake-garden, roof-garden, front-garden, koggala-lake, excursions, default

Return JSON format:
{
  "tags": ["tag1", "tag2", ...],
  "description": "Compelling description...",
  "seoTitle": "SEO title under 60 chars",
  "seoDescription": "Meta description under 160 chars", 
  "altText": "Accessible alt text under 125 chars",
  "category": "suggested-category",
  "confidence": 0.95
}`
          },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Image}` }
          }
        ]
      }],
      response_format: { type: "json_object" },
      max_tokens: 600,
      temperature: 0.3
    });

    const aiResult = JSON.parse(response.choices[0].message.content || '{}');
    const processingTime = Date.now() - startTime;
    
    const aiResponse: AITagResponse = {
      tags: aiResult.tags || ['villa', 'luxury', 'sri-lanka'],
      description: aiResult.description || 'Beautiful accommodation at Ko Lake Villa',
      seoTitle: aiResult.seoTitle || 'Ko Lake Villa - Luxury Accommodation Sri Lanka',
      seoDescription: aiResult.seoDescription || 'Experience luxury at Ko Lake Villa with stunning lake views and premium amenities in Ahangama, Sri Lanka.',
      altText: aiResult.altText || 'Ko Lake Villa accommodation - luxury lakeside property in Sri Lanka',
      confidence: aiResult.confidence || 0.85,
      processingTime
    };

    console.log(`✅ OpenAI analysis completed in ${processingTime}ms`);
    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error('OpenAI Vision API error:', error);
    const processingTime = Date.now() - startTime;
    
    // Fallback to mock data if OpenAI fails
    if (error instanceof Error && error.message.includes('API key')) {
      console.warn('⚠️ OpenAI API key issue, falling back to mock data');
      return getMockResponse('default', startTime);
    }
    
    return NextResponse.json({
      error: 'AI analysis failed. Please try again.',
      fallback: getMockTags('default'),
      processingTime
    }, { status: 500 });
  }
}

// Fallback mock response for when OpenAI is not available
function getMockResponse(imagePath: string, startTime: number): NextResponse {
  const mockData = getMockAnalysis(imagePath);
  const processingTime = Date.now() - startTime;
  
  return NextResponse.json({
    ...mockData,
    processingTime,
    note: 'Mock data - OpenAI API not configured'
  });
}

function getMockAnalysis(imagePath: string) {
  const path = imagePath.toLowerCase();
  
  if (path.includes('family-suite')) {
    return {
      tags: ['luxury', 'family', 'suite', 'lake view', 'balcony', 'premium', 'spacious'],
      description: 'Spacious family suite with stunning lake views and premium amenities, perfect for families seeking luxury and comfort at Ko Lake Villa.',
      seoTitle: 'Family Suite | Ko Lake Villa Luxury Accommodation Sri Lanka',
      seoDescription: 'Enjoy spacious family suite with lake views at Ko Lake Villa. Premium amenities, private balcony, perfect for families. Book direct and save.',
      altText: 'Luxury family suite with lake views at Ko Lake Villa Sri Lanka',
      confidence: 0.80
    };
  } else if (path.includes('pool')) {
    return {
      tags: ['infinity pool', 'swimming', 'relaxation', 'sunset', 'lake view', 'luxury', 'outdoor'],
      description: 'Stunning infinity pool overlooking Koggala Lake, perfect for relaxation and enjoying breathtaking sunset views at Ko Lake Villa.',
      seoTitle: 'Infinity Pool | Ko Lake Villa Luxury Resort Sri Lanka',
      seoDescription: 'Relax in our infinity pool with stunning lake views at Ko Lake Villa. Perfect for swimming and sunset viewing in luxury surroundings.',
      altText: 'Infinity pool with lake views at Ko Lake Villa luxury resort',
      confidence: 0.85
    };
  } else if (path.includes('dining')) {
    return {
      tags: ['dining', 'cuisine', 'lakeside', 'restaurant', 'gourmet', 'sri lankan', 'al fresco'],
      description: 'Exquisite dining experience with authentic Sri Lankan and international cuisine, served with stunning lake views at Ko Lake Villa.',
      seoTitle: 'Lakeside Dining | Ko Lake Villa Restaurant Sri Lanka',
      seoDescription: 'Enjoy gourmet dining with lake views at Ko Lake Villa. Authentic Sri Lankan cuisine and international dishes in luxury setting.',
      altText: 'Lakeside dining area with gourmet cuisine at Ko Lake Villa',
      confidence: 0.82
    };
  } else {
    return {
      tags: ['luxury', 'accommodation', 'lake view', 'sri lanka', 'villa', 'premium', 'koggala'],
      description: 'Beautiful luxury accommodation showcasing the exceptional comfort and stunning natural beauty available at Ko Lake Villa.',
      seoTitle: 'Ko Lake Villa | Luxury Accommodation Koggala Sri Lanka',
      seoDescription: 'Experience luxury at Ko Lake Villa with stunning lake views, premium amenities and exceptional service in Koggala, Sri Lanka.',
      altText: 'Luxury accommodation with lake views at Ko Lake Villa Sri Lanka',
      confidence: 0.75
    };
  }
}

function getMockTags(imagePath: string): string[] {
  const path = imagePath.toLowerCase();
  
  if (path.includes('family-suite')) {
    return ['luxury', 'family', 'suite', 'lake view', 'balcony'];
  } else if (path.includes('triple-room')) {
    return ['comfortable', 'triple', 'twin', 'garden view', 'budget-friendly'];
  } else if (path.includes('pool')) {
    return ['pool', 'infinity', 'swimming', 'sunset', 'relaxation'];
  } else if (path.includes('dining')) {
    return ['dining', 'cuisine', 'lakeside', 'gourmet', 'restaurant'];
  } else {
    return ['luxury', 'villa', 'lake view', 'accommodation', 'sri lanka'];
  }
} 