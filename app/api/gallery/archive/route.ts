import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { existsSync } from 'fs'
import path from 'path'

interface ArchiveStatus {
  [imageId: string]: {
    isArchived: boolean
    archivedAt?: string
    archivedBy?: string
    reason?: string
  }
}

interface PublishStatus {
  [imageId: string]: {
    isPublished: boolean
    publishedAt?: string
    unpublishedAt?: string
    publishedBy?: string
  }
}

const loadArchiveStatus = async (): Promise<ArchiveStatus> => {
  try {
    const archiveFile = path.join(process.cwd(), 'data', 'gallery-archive-status.json')
    if (existsSync(archiveFile)) {
      const data = await fs.readFile(archiveFile, 'utf-8')
      return JSON.parse(data)
    }
    return {}
  } catch (error) {
    console.error('Error loading archive status:', error)
    return {}
  }
}

const saveArchiveStatus = async (status: ArchiveStatus): Promise<void> => {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      await fs.mkdir(dataDir, { recursive: true })
    }
    
    const archiveFile = path.join(dataDir, 'gallery-archive-status.json')
    await fs.writeFile(archiveFile, JSON.stringify(status, null, 2))
  } catch (error) {
    console.error('Error saving archive status:', error)
    throw error
  }
}

const loadPublishStatus = async (): Promise<PublishStatus> => {
  try {
    const statusFile = path.join(process.cwd(), 'data', 'gallery-publish-status.json')
    if (existsSync(statusFile)) {
      const data = await fs.readFile(statusFile, 'utf-8')
      return JSON.parse(data)
    }
    return {}
  } catch (error) {
    console.error('Error loading publish status:', error)
    return {}
  }
}

const savePublishStatus = async (status: PublishStatus): Promise<void> => {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      await fs.mkdir(dataDir, { recursive: true })
    }
    
    const statusFile = path.join(dataDir, 'gallery-publish-status.json')
    await fs.writeFile(statusFile, JSON.stringify(status, null, 2))
  } catch (error) {
    console.error('Error saving publish status:', error)
    throw error
  }
}

// GET - List archived items
export async function GET() {
  try {
    const archiveStatus = await loadArchiveStatus()
    const archivedItems = Object.entries(archiveStatus)
      .filter(([_, status]) => status.isArchived)
      .map(([imageId, status]) => ({
        imageId,
        ...status
      }))

    return NextResponse.json({
      success: true,
      archivedItems,
      total: archivedItems.length
    })
  } catch (error) {
    console.error('Error listing archived items:', error)
    return NextResponse.json({ 
      error: 'Failed to load archived items' 
    }, { status: 500 })
  }
}

// POST - Archive operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, imageIds, reason = 'Archived by admin' } = body

    if (!action || !Array.isArray(imageIds)) {
      return NextResponse.json({ 
        error: 'Invalid request. Action and imageIds array required.' 
      }, { status: 400 })
    }

    const archiveStatus = await loadArchiveStatus()
    const publishStatus = await loadPublishStatus()
    const timestamp = new Date().toISOString()

    let successCount = 0
    const errors: string[] = []

    switch (action) {
      case 'archive':
        // Archive items (move to archive, unpublish from public site)
        for (const imageId of imageIds) {
          try {
            archiveStatus[imageId] = {
              isArchived: true,
              archivedAt: timestamp,
              archivedBy: 'admin',
              reason
            }
            
            // Also unpublish the item
            if (publishStatus[imageId]) {
              publishStatus[imageId].isPublished = false
              publishStatus[imageId].unpublishedAt = timestamp
            }
            
            successCount++
          } catch (error) {
            errors.push(`Failed to archive ${imageId}: ${error}`)
          }
        }
        break

      case 'restore':
        // Restore items from archive
        for (const imageId of imageIds) {
          try {
            if (archiveStatus[imageId]) {
              delete archiveStatus[imageId]
              successCount++
            }
          } catch (error) {
            errors.push(`Failed to restore ${imageId}: ${error}`)
          }
        }
        break

      case 'clear-gallery':
        // Archive ALL published items
        try {
          for (const [imageId, status] of Object.entries(publishStatus)) {
            if (status.isPublished) {
              archiveStatus[imageId] = {
                isArchived: true,
                archivedAt: timestamp,
                archivedBy: 'admin',
                reason: 'Bulk clear gallery operation'
              }
              
              publishStatus[imageId].isPublished = false
              publishStatus[imageId].unpublishedAt = timestamp
              successCount++
            }
          }
        } catch (error) {
          errors.push(`Failed to clear gallery: ${error}`)
        }
        break

      case 'permanent-delete':
        // Permanently delete files and all metadata
        for (const imageId of imageIds) {
          try {
            // Delete the actual file
            const galleryDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
            const filePath = path.join(galleryDir, imageId)
            
            if (existsSync(filePath)) {
              await fs.unlink(filePath)
              console.log(`Permanently deleted file: ${filePath}`)
            }
            
            // Delete metadata file (legacy cleanup)
            const metadataPath = filePath + '.meta.json'
            if (existsSync(metadataPath)) {
              await fs.unlink(metadataPath)
              console.log(`Deleted legacy metadata: ${metadataPath}`)
            }
            
            // Remove from centralized metadata
            try {
              const metadataFile = path.join(process.cwd(), 'data', 'gallery-metadata.json')
              if (existsSync(metadataFile)) {
                const metadataContent = await fs.readFile(metadataFile, 'utf-8')
                const metadata = JSON.parse(metadataContent)
                delete metadata[imageId]
                await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2))
                console.log(`Deleted centralized metadata for: ${imageId}`)
              }
            } catch (metadataError) {
              console.warn(`Failed to delete centralized metadata for ${imageId}:`, metadataError)
            }
            
            // Remove from all tracking systems
            delete archiveStatus[imageId]
            delete publishStatus[imageId]
            
            successCount++
          } catch (error) {
            errors.push(`Failed to permanently delete ${imageId}: ${error}`)
          }
        }
        break

      default:
        return NextResponse.json({ 
          error: `Unknown action: ${action}` 
        }, { status: 400 })
    }

    // Save updated statuses
    await saveArchiveStatus(archiveStatus)
    await savePublishStatus(publishStatus)

    return NextResponse.json({
      success: true,
      action,
      successCount,
      totalRequested: imageIds.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp
    })

  } catch (error) {
    console.error('Error in archive operation:', error)
    return NextResponse.json({ 
      error: 'Failed to process archive operation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Clear entire archive (permanent delete all archived items)
export async function DELETE() {
  try {
    const archiveStatus = await loadArchiveStatus()
    const publishStatus = await loadPublishStatus()
    
    let deletedCount = 0
    const errors: string[] = []
    
    // Get all archived items
    const archivedItems = Object.entries(archiveStatus)
      .filter(([_, status]) => status.isArchived)
      .map(([imageId]) => imageId)
    
    // Permanently delete each archived item
    for (const imageId of archivedItems) {
      try {
        const galleryDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
        const filePath = path.join(galleryDir, imageId)
        
        if (existsSync(filePath)) {
          await fs.unlink(filePath)
        }
        
        const metadataPath = filePath + '.meta.json'
        if (existsSync(metadataPath)) {
          await fs.unlink(metadataPath)
        }
        
        // Remove from centralized metadata
        try {
          const metadataFile = path.join(process.cwd(), 'data', 'gallery-metadata.json')
          if (existsSync(metadataFile)) {
            const metadataContent = await fs.readFile(metadataFile, 'utf-8')
            const metadata = JSON.parse(metadataContent)
            delete metadata[imageId]
            await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2))
          }
        } catch (metadataError) {
          console.warn(`Failed to delete centralized metadata for ${imageId}:`, metadataError)
        }
        
        // Remove from tracking
        delete archiveStatus[imageId]
        delete publishStatus[imageId]
        
        deletedCount++
      } catch (error) {
        errors.push(`Failed to delete ${imageId}: ${error}`)
      }
    }
    
    // Save updated statuses
    await saveArchiveStatus(archiveStatus)
    await savePublishStatus(publishStatus)
    
    return NextResponse.json({
      success: true,
      message: 'Archive cleared successfully',
      deletedCount,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error clearing archive:', error)
    return NextResponse.json({ 
      error: 'Failed to clear archive',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 