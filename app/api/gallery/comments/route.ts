import { NextResponse } from 'next/server';

interface Comment {
  id: string;
  imagePath: string;
  author: string;
  content: string;
  timestamp: string;
  rating?: number;
}

// In-memory storage for comments (in production, this would be a database)
let comments: Comment[] = [];

export async function GET() {
  try {
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to load comments:', error);
    return NextResponse.json({ error: 'Failed to load comments.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.imagePath || !body.author || !body.content) {
      return NextResponse.json(
        { error: 'Image path, author, and content are required.' },
        { status: 400 }
      );
    }

    // Create new comment
    const newComment: Comment = {
      id: Date.now().toString(),
      imagePath: body.imagePath,
      author: body.author,
      content: body.content,
      timestamp: new Date().toISOString(),
      rating: body.rating || undefined
    };

    // Add to comments array
    comments.push(newComment);

    return NextResponse.json(
      { 
        success: true, 
        comment: newComment,
        message: 'Comment added successfully!' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to add comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment. Please try again.' },
      { status: 500 }
    );
  }
} 