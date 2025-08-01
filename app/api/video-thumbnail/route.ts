import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const videoUrl = searchParams.get('videoUrl')
  
  if (!videoUrl) {
    return NextResponse.json({ error: 'Video URL required' }, { status: 400 })
  }
  
  try {
    // Extract video filename without extension
    const videoFilename = videoUrl.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
    
    // Define possible thumbnail paths (in order of preference)
    const thumbnailPaths = [
      `public/thumbnails/${videoFilename}.jpg`,
      `public/thumbnails/${videoFilename}.jpeg`,
      `public/thumbnails/${videoFilename}.png`,
      `public/thumbnails/${videoFilename}.svg`,
      `public/thumbnails/${videoFilename}-thumb.jpg`,
      `public/uploads/gallery/thumbnails/${videoFilename}.jpg`,
      `public/uploads/gallery/thumbnails/${videoFilename}.png`,
      `public/uploads/gallery/thumbnails/${videoFilename}.svg`,
    ]
    
    // Check which thumbnail exists
    for (const thumbnailPath of thumbnailPaths) {
      try {
        await fs.access(thumbnailPath)
        // Convert full path to web path
        const webPath = thumbnailPath.replace('public/', '/')
        return NextResponse.json({ 
          thumbnailUrl: webPath,
          source: 'existing-file',
          videoFilename 
        })
      } catch {
        // File doesn't exist, continue to next option
        continue
      }
    }
    
    // No specific thumbnail found, return default
    return NextResponse.json({ 
      thumbnailUrl: '/thumbnails/video-default.svg',
      source: 'default-fallback',
      videoFilename 
    })
    
  } catch (error) {
    console.error('Error checking video thumbnail:', error)
    return NextResponse.json({ 
      thumbnailUrl: '/thumbnails/video-default.svg',
      source: 'error-fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, generateThumbnail } = await request.json()
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL required' }, { status: 400 })
    }
    
    // This would be where you implement actual thumbnail generation
    // For now, we'll just log the request
    console.log(`📹 Thumbnail generation requested for: ${videoUrl}`)
    
    return NextResponse.json({
      message: 'Thumbnail generation queued',
      videoUrl,
      status: 'queued'
    })
    
  } catch (error) {
    console.error('Error in thumbnail generation:', error)
    return NextResponse.json({ 
      error: 'Failed to process thumbnail generation request' 
    }, { status: 500 })
  }
} 