import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  // 1. Check if the API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not configured.');
    return new NextResponse('AI service is not configured.', { status: 501 }); // 501 Not Implemented
  }

  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return new NextResponse('imageUrl is required', { status: 400 });
    }

    // 2. Create a prompt for the AI
    const prompt = `
      Analyze the following image URL and generate a comma-separated list of 3-5 relevant, lowercase, single-word keywords for a luxury villa's photo gallery.
      Focus on themes like location, amenities, and mood. Do not include generic words like "image" or "photo".
      URL: "${imageUrl}"
    `;

    // 3. Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
      temperature: 0.5,
    });

    const tagsString = response.choices[0].message.content || '';
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);

    // 4. Return the tags
    return NextResponse.json({ tags });

  } catch (error) {
    console.error('AI Tagging API Error:', error);
    // Differentiate between configuration and other errors
    if (error instanceof OpenAI.APIError) {
      return new NextResponse(error.message, { status: error.status });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 