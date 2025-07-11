import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AIRequest {
  imageUrl: string;
  currentTitle: string;
  currentDescription: string;
  category: string;
  campaignText?: string;
}

interface AIResponse {
  altText: string;
  seoTitle: string;
  seoDescription: string;
  suggestedTags: string[];
  confidence: number;
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body: AIRequest = await request.json();
    
    if (!body.imageUrl || !body.currentTitle) {
      return NextResponse.json(
        { error: 'Image URL and title are required' },
        { status: 400 }
      );
    }

    // Create a comprehensive prompt for Ko Lake Villa
    const koLakeVillaPrompt = `You are a luxury hospitality SEO expert specializing in Ko Lake Villa, a boutique lakefront accommodation in Ahangama, Sri Lanka.

BRAND CONTEXT:
- Location: Koggala Lake, Ahangama, Galle District, Sri Lanka
- Brand essence: "Relax. Revive. Connect."
- Target audience: Luxury travelers, wellness seekers, digital nomads, families
- Unique selling points: Direct booking saves 10-15%, lakefront location, authentic Sri Lankan experience
- Tone: Warm, gracious, informed - never scripted or salesy
- Keywords: luxury villa Sri Lanka, Koggala Lake accommodation, Ahangama retreat, lakefront villa, boutique accommodation

CAMPAIGN FOCUS:
${body.campaignText || 'Focus on luxury, comfort, and authentic Sri Lankan lakefront experience with direct booking benefits.'}

CURRENT CONTENT:
- Category: ${body.category}
- Title: ${body.currentTitle}
- Description: ${body.currentDescription}

TASK: Analyze the image and generate optimized content for this accommodation listing:

1. ALT TEXT: Create descriptive, accessible alt text (50-80 characters)
2. SEO TITLE: Craft compelling title with target keywords (50-60 characters)
3. SEO DESCRIPTION: Write engaging meta description with call-to-action (140-160 characters)
4. TAGS: Suggest 5-7 relevant tags for categorization

Respond in JSON format:
{
  "altText": "descriptive alt text",
  "seoTitle": "SEO optimized title",
  "seoDescription": "compelling meta description",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "confidence": 0.95
}

Focus on luxury, comfort, value proposition, and location benefits.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: koLakeVillaPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: body.imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsedResponse = JSON.parse(response);
      
      // Validate the response structure
      if (!parsedResponse.altText || !parsedResponse.seoTitle || !parsedResponse.seoDescription) {
        throw new Error('Incomplete response from OpenAI');
      }

      const aiResponse: AIResponse = {
        altText: parsedResponse.altText,
        seoTitle: parsedResponse.seoTitle,
        seoDescription: parsedResponse.seoDescription,
        suggestedTags: parsedResponse.suggestedTags || [],
        confidence: parsedResponse.confidence || 0.85
      };

      return NextResponse.json(aiResponse);
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response);
      
      // Fallback: Extract content manually if JSON parsing fails
      const fallbackResponse: AIResponse = {
        altText: `${body.currentTitle} at Ko Lake Villa - luxury lakefront accommodation`,
        seoTitle: `${body.currentTitle} | Ko Lake Villa Luxury Accommodation Sri Lanka`,
        seoDescription: `${body.currentDescription} Experience luxury at Ko Lake Villa, Ahangama. Book direct and save 10%.`,
        suggestedTags: ['luxury', 'villa', 'lakefront', 'Sri Lanka', 'accommodation'],
        confidence: 0.7
      };
      
      return NextResponse.json(fallbackResponse);
    }

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Return a meaningful error response
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate AI content';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 