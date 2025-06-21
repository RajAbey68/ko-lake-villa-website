import { NextResponse } from 'next/server';

// Placeholder for in-memory comment storage
let comments: Record<string, any[]> = {
  '1': [
    { id: 'c1', author: 'Jane Doe', text: 'Absolutely stunning view!', timestamp: new Date().toISOString() },
    { id: 'c2', author: 'John Smith', text: 'I could stay here forever.', timestamp: new Date().toISOString() },
  ],
  '2': [
    { id: 'c3', author: 'Emily White', text: 'So peaceful and serene.', timestamp: new Date().toISOString() },
  ]
};

// GET handler to fetch comments for a specific image
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get('imageId');

  if (!imageId) {
    return new NextResponse('Image ID is required', { status: 400 });
  }

  try {
    const imageComments = comments[imageId] || [];
    return NextResponse.json(imageComments);
  } catch (error) {
    console.error(`Failed to fetch comments for image ${imageId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST handler to add a new comment
export async function POST(request: Request) {
  try {
    const { imageId, author, text } = await request.json();

    if (!imageId || !author || !text) {
      return new NextResponse('Missing required fields (imageId, author, text)', { status: 400 });
    }

    const newComment = {
      id: `c${Date.now()}`, // Simple unique ID
      author,
      text,
      timestamp: new Date().toISOString(),
    };

    if (!comments[imageId]) {
      comments[imageId] = [];
    }
    comments[imageId].push(newComment);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Failed to post comment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 