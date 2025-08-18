import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// File validation configuration
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/webm'
];

const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB for images
  video: 100 * 1024 * 1024  // 100MB for videos
};

// Forbidden file extensions for security
const FORBIDDEN_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.scr', '.vbs', '.js', '.jar',
  '.zip', '.rar', '.sh', '.ps1', '.app', '.deb', '.rpm'
];

// Helper function to validate file
function validateFile(file: File): { valid: boolean; error?: string; mediaType?: 'image' | 'video' } {
  // Check if file exists
  if (!file || !file.name) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file extension for security
  const fileName = file.name.toLowerCase();
  const hasForbidenExt = FORBIDDEN_EXTENSIONS.some(ext => fileName.endsWith(ext));
  if (hasForbidenExt) {
    return { valid: false, error: 'File type not allowed for security reasons' };
  }

  // Determine media type and validate
  let mediaType: 'image' | 'video' | null = null;
  
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
    mediaType = 'image';
    if (file.size > MAX_FILE_SIZE.image) {
      return { 
        valid: false, 
        error: `Image file too large. Maximum size is ${MAX_FILE_SIZE.image / (1024 * 1024)}MB` 
      };
    }
  } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
    mediaType = 'video';
    if (file.size > MAX_FILE_SIZE.video) {
      return { 
        valid: false, 
        error: `Video file too large. Maximum size is ${MAX_FILE_SIZE.video / (1024 * 1024)}MB` 
      };
    }
  } else {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed types: ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(', ')}` 
    };
  }

  // Basic filename validation
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return { valid: false, error: 'Invalid filename' };
  }

  return { valid: true, mediaType };
}

// Helper function to sanitize filename
function sanitizeFilename(filename: string): string {
  // Remove special characters and spaces
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

// Helper function to simulate virus scanning (in production, use real antivirus API)
async function scanForVirus(buffer: Buffer): Promise<boolean> {
  // Simulate virus scanning delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Check for suspicious patterns (basic simulation)
  const bufferString = buffer.toString('utf8', 0, Math.min(1000, buffer.length));
  const suspiciousPatterns = [
    '<script', 'eval(', 'document.write', 'window.location',
    'javascript:', 'onload=', 'onerror=', '.exe', '.bat'
  ];
  
  return !suspiciousPatterns.some(pattern => 
    bufferString.toLowerCase().includes(pattern.toLowerCase())
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File || formData.get('image') as File;
    const category = formData.get('category') as string || 'uncategorized';
    const title = formData.get('title') as string || '';
    const description = formData.get('description') as string || '';
    const tags = formData.get('tags') as string || '';

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Validate category
    const validCategories = [
      'entire-villa', 'family-suite', 'triple-room', 'group-room',
      'dining-area', 'pool-deck', 'lake-garden', 'roof-garden',
      'front-garden', 'koggala-lake', 'excursions', 'uncategorized'
    ];
    
    if (!validCategories.includes(category)) {
      return NextResponse.json({ 
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Simulate virus scanning
    const isClean = await scanForVirus(buffer);
    if (!isClean) {
      return NextResponse.json({ 
        error: 'File failed security scan. Please upload a different file.' 
      }, { status: 400 });
    }

    // Create upload directories
    const mediaType = validation.mediaType!;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'gallery', mediaType + 's');
    const categoryDir = path.join(uploadsDir, category);
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    if (!existsSync(categoryDir)) {
      await mkdir(categoryDir, { recursive: true });
    }

    // Generate unique and safe filename
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const originalName = sanitizeFilename(path.parse(file.name).name);
    const extension = path.extname(file.name).toLowerCase();
    const filename = `${originalName}_${timestamp}_${randomSuffix}${extension}`;
    const filepath = path.join(categoryDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Generate thumbnail path for videos (actual generation would be handled separately)
    let thumbnailUrl = null;
    if (mediaType === 'video') {
      thumbnailUrl = `/uploads/gallery/thumbnails/${category}/${filename.replace(extension, '.jpg')}`;
    }

    // Prepare response data
    const fileUrl = `/uploads/gallery/${mediaType}s/${category}/${filename}`;
    const metadata = {
      originalName: file.name,
      filename,
      size: file.size,
      sizeFormatted: formatFileSize(file.size),
      mimeType: file.type,
      uploadedAt: new Date().toISOString()
    };

    // Return success response with comprehensive file info
    return NextResponse.json({
      success: true,
      file: {
        url: fileUrl,
        thumbnailUrl,
        mediaType,
        category,
        title: title || originalName,
        description,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        metadata
      },
      message: `${mediaType === 'image' ? 'Image' : 'Video'} uploaded successfully!`
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ENOSPC')) {
        return NextResponse.json(
          { error: 'Server storage full. Please contact administrator.' },
          { status: 507 }
        );
      }
      if (error.message.includes('EACCES')) {
        return NextResponse.json(
          { error: 'Permission denied. Cannot save file.' },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
} 