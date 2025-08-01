import { NextRequest, NextResponse } from 'next/server'
import { unlink, writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params
  
  console.log('DELETE request received for imageId:', imageId)
  
  try {
    if (!imageId) {
      console.log('No imageId provided')
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    // Decode the imageId which should be the relative path like "default/filename.jpg"
    const decodedPath = decodeURIComponent(imageId)
    console.log('Decoded path:', decodedPath)
    
    // Handle different ID formats - sometimes it might be just a filename
    let relativePath = decodedPath
    
    // If it doesn't contain a slash, it might be just a filename in the default folder
    if (!decodedPath.includes('/')) {
      relativePath = `default/${decodedPath}`
      console.log('Using default folder for path:', relativePath)
    }
    
    // Construct the full file path
    let fullPath = path.join(process.cwd(), 'public', 'uploads', 'gallery', relativePath)
    console.log('Full file path:', fullPath)
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      console.log('File not found at path:', fullPath)
      
      // Try alternative paths if the file wasn't found
      const galleryDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
      const categories = ['default', 'entire-villa', 'family-suite', 'group-room', 'triple-room', 
                         'dining-area', 'pool-deck', 'lake-garden', 'roof-garden', 'front-garden', 
                         'koggala-lake', 'excursions']
      
      let foundPath = null
      const filename = path.basename(decodedPath)
      
      for (const category of categories) {
        const testPath = path.join(galleryDir, category, filename)
        if (existsSync(testPath)) {
          foundPath = testPath
          console.log('Found file in alternative path:', testPath)
          break
        }
      }
      
      if (!foundPath) {
        return NextResponse.json({ 
          error: 'Image not found', 
          searchedPath: relativePath,
          fullPath: fullPath
        }, { status: 404 })
      }
      
      // Update the path to the found file
      fullPath = foundPath
      relativePath = path.relative(path.join(process.cwd(), 'public', 'uploads', 'gallery'), foundPath)
    }

    console.log('Attempting to delete file:', fullPath)
    
    // Delete the file
    await unlink(fullPath)
    console.log('File deleted successfully')
    
    // Also delete metadata file if it exists (legacy cleanup)
    const metadataPath = fullPath + '.meta.json'
    if (existsSync(metadataPath)) {
      await unlink(metadataPath)
      console.log('Legacy metadata file deleted')
    }
    
    // Remove from centralized metadata
    try {
      const metadataResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gallery/metadata?imageId=${encodeURIComponent(imageId)}`, {
        method: 'DELETE'
      })
      if (metadataResponse.ok) {
        console.log('Centralized metadata deleted successfully')
      } else {
        console.warn('Failed to delete centralized metadata, but file was deleted')
      }
    } catch (metadataError) {
      console.warn('Error deleting centralized metadata:', metadataError)
      // Don't fail the whole operation if metadata cleanup fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully',
      deletedPath: relativePath
    })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ 
      error: 'Failed to delete image',
      details: error instanceof Error ? error.message : 'Unknown error',
      imageId: imageId
    }, { status: 500 })
  }
}

// PUT method deprecated - use /api/gallery/metadata instead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params
  
  console.log('PUT request received for imageId (deprecated):', imageId)
  
  return NextResponse.json({ 
    error: 'PUT method deprecated. Use /api/gallery/metadata instead.',
    deprecatedEndpoint: `/api/gallery/${imageId}`,
    newEndpoint: '/api/gallery/metadata',
    migration: 'Use POST to /api/gallery/metadata with imageId in body'
  }, { status: 410 })
} 