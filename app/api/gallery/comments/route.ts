import { NextRequest, NextResponse } from 'next/server';

interface Comment {
  id: string;
  mediaId: string;  // Can be image or video ID
  mediaType: 'image' | 'video';
  author: string;
  email?: string;
  content: string;
  timestamp: string;
  rating?: number;
  likes: number;
  replies: Reply[];
  edited?: boolean;
  editedAt?: string;
}

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

// In-memory storage for comments (in production, this would be a database)
// This persists only during the server session
let comments: Comment[] = [
  // Sample comment for demonstration
  {
    id: '1',
    mediaId: 'sample-villa-image',
    mediaType: 'image',
    author: 'John Doe',
    email: 'john@example.com',
    content: 'Beautiful villa! The pool area looks amazing.',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    rating: 5,
    likes: 3,
    replies: [
      {
        id: 'r1',
        author: 'Ko Lake Villa',
        content: 'Thank you for your kind words! We hope to welcome you soon.',
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        likes: 1
      }
    ]
  }
];

// GET: Fetch comments for a specific media item or all comments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mediaId = searchParams.get('mediaId');
    const mediaType = searchParams.get('mediaType');

    let filteredComments = comments;

    // Filter by mediaId if provided
    if (mediaId) {
      filteredComments = comments.filter(c => c.mediaId === mediaId);
    }

    // Filter by mediaType if provided
    if (mediaType && (mediaType === 'image' || mediaType === 'video')) {
      filteredComments = filteredComments.filter(c => c.mediaType === mediaType);
    }

    // Sort by timestamp (newest first)
    filteredComments.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      success: true,
      comments: filteredComments,
      total: filteredComments.length
    });
  } catch (error) {
    console.error('Failed to load comments:', error);
    return NextResponse.json(
      { error: 'Failed to load comments' },
      { status: 500 }
    );
  }
}

// POST: Add a new comment or reply
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a reply to an existing comment
    if (body.parentCommentId && body.replyContent && body.replyAuthor) {
      const parentComment = comments.find(c => c.id === body.parentCommentId);
      
      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }

      const newReply: Reply = {
        id: `r${Date.now()}`,
        author: body.replyAuthor,
        content: body.replyContent,
        timestamp: new Date().toISOString(),
        likes: 0
      };

      parentComment.replies.push(newReply);

      return NextResponse.json({
        success: true,
        reply: newReply,
        message: 'Reply added successfully!'
      });
    }

    // Validate required fields for new comment
    if (!body.mediaId || !body.author || !body.content) {
      return NextResponse.json(
        { error: 'Media ID, author, and content are required' },
        { status: 400 }
      );
    }

    // Create new comment
    const newComment: Comment = {
      id: Date.now().toString(),
      mediaId: body.mediaId,
      mediaType: body.mediaType || 'image',
      author: body.author,
      email: body.email,
      content: body.content,
      timestamp: new Date().toISOString(),
      rating: body.rating,
      likes: 0,
      replies: []
    };

    // Add to comments array
    comments.unshift(newComment); // Add to beginning

    // Keep only last 100 comments in memory
    if (comments.length > 100) {
      comments = comments.slice(0, 100);
    }

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
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}

// PUT: Update a comment or like/unlike
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, action, content, replyId } = body;

    const comment = comments.find(c => c.id === commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'like':
        if (replyId) {
          const reply = comment.replies.find(r => r.id === replyId);
          if (reply) {
            reply.likes++;
          }
        } else {
          comment.likes++;
        }
        break;

      case 'unlike':
        if (replyId) {
          const reply = comment.replies.find(r => r.id === replyId);
          if (reply && reply.likes > 0) {
            reply.likes--;
          }
        } else if (comment.likes > 0) {
          comment.likes--;
        }
        break;

      case 'edit':
        if (content && content.trim()) {
          comment.content = content;
          comment.edited = true;
          comment.editedAt = new Date().toISOString();
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      comment,
      message: 'Comment updated successfully!'
    });
  } catch (error) {
    console.error('Failed to update comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a comment
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commentId = searchParams.get('id');
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Remove the comment
    const deletedComment = comments.splice(commentIndex, 1)[0];

    return NextResponse.json({
      success: true,
      deletedComment,
      message: 'Comment deleted successfully!'
    });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
} 