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
    
    // Also delete metadata file if it exists
    const metadataPath = fullPath + '.meta.json'
    if (existsSync(metadataPath)) {
      await unlink(metadataPath)
      console.log('Metadata file deleted')
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params
  try {
    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    // Parse the request body
    const body = await request.json()
    const { title, description, category, tags, seoTitle, seoDescription, altText } = body

    // Decode the imageId which should be the relative path like "default/filename.jpg"
    const decodedPath = decodeURIComponent(imageId)
    
    // Construct the full file path
    const fullPath = path.join(process.cwd(), 'public', 'uploads', 'gallery', decodedPath)
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Create metadata object
    const metadata = {
      title: title || '',
      description: description || '',
      category: category || 'default',
      tags: tags || [],
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      altText: altText || '',
      updatedAt: new Date().toISOString()
    }

    // Save metadata to a .meta.json file
    const metadataPath = fullPath + '.meta.json'
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2))

    return NextResponse.json({ 
      success: true, 
      message: 'Image metadata updated successfully',
      metadata,
      imagePath: decodedPath
    })
  } catch (error) {
    console.error('Error updating image metadata:', error)
    return NextResponse.json({ 
      error: 'Failed to update image metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 