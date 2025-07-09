import { NextRequest, NextResponse } from 'next/server'
import { unlink, writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params
  try {
    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    // Decode the imageId which should be the relative path like "default/filename.jpg"
    const decodedPath = decodeURIComponent(imageId)
    
    // Construct the full file path
    const fullPath = path.join(process.cwd(), 'public', 'uploads', 'gallery', decodedPath)
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete the file
    await unlink(fullPath)
    
    // Also delete metadata file if it exists
    const metadataPath = fullPath + '.meta.json'
    if (existsSync(metadataPath)) {
      await unlink(metadataPath)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully',
      deletedPath: decodedPath
    })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ 
      error: 'Failed to delete image',
      details: error instanceof Error ? error.message : 'Unknown error'
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