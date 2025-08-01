import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { existsSync } from 'fs'
import path from 'path'

interface ImageMetadata {
  [imageId: string]: {
    title?: string
    description?: string
    category?: string
    tags?: string[]
    seoTitle?: string
    seoDescription?: string
    altText?: string
    updatedAt?: string
    updatedBy?: string
  }
}

const getMetadataFilePath = () => {
  return path.join(process.cwd(), 'data', 'gallery-metadata.json')
}

const loadMetadata = async (): Promise<ImageMetadata> => {
  try {
    const metadataFile = getMetadataFilePath()
    if (existsSync(metadataFile)) {
      const data = await fs.readFile(metadataFile, 'utf-8')
      return JSON.parse(data)
    }
    return {}
  } catch (error) {
    console.error('Error loading metadata:', error)
    return {}
  }
}

const saveMetadata = async (metadata: ImageMetadata): Promise<void> => {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      await fs.mkdir(dataDir, { recursive: true })
    }
    
    const metadataFile = getMetadataFilePath()
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2))
    console.log('Metadata saved successfully to:', metadataFile)
  } catch (error) {
    console.error('Error saving metadata:', error)
    throw error
  }
}

// GET - Retrieve metadata for specific image or all images
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const imageId = url.searchParams.get('imageId')
    
    const metadata = await loadMetadata()
    
    if (imageId) {
      // Return metadata for specific image
      const decodedImageId = decodeURIComponent(imageId)
      return NextResponse.json({
        success: true,
        metadata: metadata[decodedImageId] || {}
      })
    } else {
      // Return all metadata
      return NextResponse.json({
        success: true,
        metadata
      })
    }
  } catch (error) {
    console.error('Error retrieving metadata:', error)
    return NextResponse.json({
      error: 'Failed to retrieve metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - Update metadata for an image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageId, title, description, category, tags, seoTitle, seoDescription, altText } = body
    
    if (!imageId) {
      return NextResponse.json({
        error: 'imageId is required'
      }, { status: 400 })
    }
    
    const decodedImageId = decodeURIComponent(imageId)
    console.log('Updating metadata for:', decodedImageId)
    
    // Load current metadata
    const metadata = await loadMetadata()
    
    // Update metadata for the specific image
    metadata[decodedImageId] = {
      title: title || '',
      description: description || '',
      category: category || 'default',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      altText: altText || '',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin'
    }
    
    console.log('Saving metadata:', metadata[decodedImageId])
    
    // Save updated metadata
    await saveMetadata(metadata)
    
    return NextResponse.json({
      success: true,
      message: 'Metadata updated successfully',
      metadata: metadata[decodedImageId]
    })
    
  } catch (error) {
    console.error('Error updating metadata:', error)
    return NextResponse.json({
      error: 'Failed to update metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Remove metadata for an image
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const imageId = url.searchParams.get('imageId')
    
    if (!imageId) {
      return NextResponse.json({
        error: 'imageId is required'
      }, { status: 400 })
    }
    
    const decodedImageId = decodeURIComponent(imageId)
    console.log('Deleting metadata for:', decodedImageId)
    
    // Load current metadata
    const metadata = await loadMetadata()
    
    // Remove metadata for the specific image
    delete metadata[decodedImageId]
    
    // Save updated metadata
    await saveMetadata(metadata)
    
    return NextResponse.json({
      success: true,
      message: 'Metadata deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting metadata:', error)
    return NextResponse.json({
      error: 'Failed to delete metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 