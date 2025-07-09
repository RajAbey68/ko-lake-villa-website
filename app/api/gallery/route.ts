import { NextResponse } from 'next/server';
import fs, { Dirent } from 'fs';
import path from 'path';

interface PublishStatus {
  [imageId: string]: {
    isPublished: boolean
    publishedAt?: string
    unpublishedAt?: string
    publishedBy?: string
  }
}

const loadPublishStatus = (): PublishStatus => {
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
  const galleryDirectory = path.join(process.cwd(), 'public/uploads/gallery');

  try {
    const categories = fs.readdirSync(galleryDirectory, { withFileTypes: true })
      .filter((dirent: Dirent) => dirent.isDirectory())
      .map((dirent: Dirent) => dirent.name);

    // Load publish status
    const publishStatus = loadPublishStatus()

    const galleryData = categories.reduce((acc: Record<string, string[]>, category: string) => {
      const categoryDir = path.join(galleryDirectory, category);
      const files = fs.readdirSync(categoryDir)
        .filter((file: string) => /\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i.test(file))
        .filter((file: string) => {
          // Only include published images
          const imageId = `${category}/${file}`
          const publishInfo = publishStatus[imageId]
          return publishInfo && publishInfo.isPublished
        })
        .map((file: string) => `/uploads/gallery/${category}/${file}`);
      
      // Only include categories that have published images
      if (files.length > 0) {
        acc[category] = files;
      }
      return acc;
    }, {} as Record<string, string[]>);

    return NextResponse.json(galleryData);
  } catch (error) {
    console.error('Failed to read gallery images:', error);
    return NextResponse.json({ error: 'Failed to load gallery images.' }, { status: 500 });
  }
} 