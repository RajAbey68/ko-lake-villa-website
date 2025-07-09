import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface GalleryImage {
  id: string
  type: 'image' | 'video'
  url: string
  title: string
  description: string
  category: string
  tags: string[]
  seoTitle: string
  seoDescription: string
  altText: string
  uploadDate: string
  filename: string
  size: number
  isPublished: boolean
  publishedAt?: string
  unpublishedAt?: string
  publishedBy?: string
}

interface PublishStatus {
  [imageId: string]: {
    isPublished: boolean
    publishedAt?: string
    unpublishedAt?: string
    publishedBy?: string
  }
}

const loadPublishStatus = async (): Promise<PublishStatus> => {
  try {
    const statusFile = path.join(process.cwd(), 'data', 'gallery-publish-status.json')
    if (fs.existsSync(statusFile)) {
      const data = fs.readFileSync(statusFile, 'utf-8')
      return JSON.parse(data)
    }
    return {}
  } catch (error) {
    console.error('Error loading publish status:', error)
    return {}
  }
}

export async function GET() {
  try {
    const galleryDirectory = path.join(process.cwd(), 'public', 'uploads', 'gallery')
    
    if (!fs.existsSync(galleryDirectory)) {
      return NextResponse.json([])
    }

    const categories = fs.readdirSync(galleryDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    const images: GalleryImage[] = []
    
    // Load publish status
    const publishStatus = await loadPublishStatus()

    for (const category of categories) {
      const categoryPath = path.join(galleryDirectory, category)
      const files = fs.readdirSync(categoryPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i.test(file))

      for (const file of files) {
        const filePath = path.join(categoryPath, file)
        const stats = fs.statSync(filePath)
        const isVideo = /\.(mp4|mov|avi)$/i.test(file)
        
        // Generate a unique ID based on category and filename
        const imageId = `${category}/${file}`
        
        // Extract title from filename (remove timestamp and extension)
        const title = file
          .replace(/^\d+-\d+-/, '') // Remove timestamp prefix
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
          .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word

        // Get publish status for this image
        const publishInfo = publishStatus[imageId] || { isPublished: false }

        const image: GalleryImage = {
          id: imageId,
          type: isVideo ? 'video' : 'image',
          url: `/uploads/gallery/${category}/${file}`,
          title,
          description: `${isVideo ? 'Video' : 'Image'} from ${category.replace(/[-_]/g, ' ')} category`,
          category: category.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          tags: [category, isVideo ? 'video' : 'image'],
          seoTitle: `${title} | Ko Lake Villa Gallery`,
          seoDescription: `${title} at Ko Lake Villa - luxury accommodation in Ahangama, Sri Lanka`,
          altText: `${title} at Ko Lake Villa`,
          uploadDate: stats.birthtime.toISOString().split('T')[0],
          filename: file,
          size: stats.size,
          isPublished: publishInfo.isPublished,
          publishedAt: publishInfo.publishedAt,
          unpublishedAt: publishInfo.unpublishedAt,
          publishedBy: publishInfo.publishedBy
        }

        images.push(image)
      }
    }

    // Sort by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())

    return NextResponse.json(images)

  } catch (error) {
    console.error('Failed to list gallery images:', error)
    return NextResponse.json({ error: 'Failed to load gallery images' }, { status: 500 })
  }
} 