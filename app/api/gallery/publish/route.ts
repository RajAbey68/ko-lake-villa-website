import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

interface PublishRequest {
  imageId: string
  action: 'publish' | 'unpublish'
}

interface PublishStatus {
  [imageId: string]: {
    isPublished: boolean
    publishedAt?: string
    unpublishedAt?: string
    publishedBy?: string
  }
}

const getPublishStatusFile = () => {
  return path.join(process.cwd(), 'data', 'gallery-publish-status.json')
}

const ensureDataDirectory = async () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
}

const loadPublishStatus = async (): Promise<PublishStatus> => {
  try {
    const statusFile = getPublishStatusFile()
    if (existsSync(statusFile)) {
      const data = await readFile(statusFile, 'utf-8')
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
    await ensureDataDirectory()
    const statusFile = getPublishStatusFile()
    await writeFile(statusFile, JSON.stringify(status, null, 2))
  } catch (error) {
    console.error('Error saving publish status:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PublishRequest = await request.json()
    const { imageId, action } = body

    if (!imageId || !action) {
      return NextResponse.json(
        { error: 'Image ID and action are required' },
        { status: 400 }
      )
    }

    if (!['publish', 'unpublish'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "publish" or "unpublish"' },
        { status: 400 }
      )
    }

    // Load current publish status
    const publishStatus = await loadPublishStatus()

    // Update status based on action
    if (action === 'publish') {
      publishStatus[imageId] = {
        isPublished: true,
        publishedAt: new Date().toISOString(),
        publishedBy: 'admin', // In a real app, this would be the current user
      }
    } else {
      publishStatus[imageId] = {
        ...publishStatus[imageId],
        isPublished: false,
        unpublishedAt: new Date().toISOString(),
      }
    }

    // Save updated status
    await savePublishStatus(publishStatus)

    return NextResponse.json({
      success: true,
      message: `Image ${action}ed successfully`,
      status: publishStatus[imageId]
    })

  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: 'Failed to update publish status' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const publishStatus = await loadPublishStatus()
    return NextResponse.json(publishStatus)
  } catch (error) {
    console.error('Error loading publish status:', error)
    return NextResponse.json(
      { error: 'Failed to load publish status' },
      { status: 500 }
    )
  }
} 