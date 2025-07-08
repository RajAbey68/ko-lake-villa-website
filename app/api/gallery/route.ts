import { NextResponse } from 'next/server';
import fs, { Dirent } from 'fs';
import path from 'path';

export async function GET() {
  const galleryDirectory = path.join(process.cwd(), 'uploads/gallery');

  try {
    const categories = fs.readdirSync(galleryDirectory, { withFileTypes: true })
      .filter((dirent: Dirent) => dirent.isDirectory())
      .map((dirent: Dirent) => dirent.name);

    const galleryData = categories.reduce((acc: Record<string, string[]>, category: string) => {
      const categoryDir = path.join(galleryDirectory, category);
      const files = fs.readdirSync(categoryDir)
        .filter((file: string) => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .map((file: string) => `/uploads/gallery/${category}/${file}`);
      
      acc[category] = files;
      return acc;
    }, {} as Record<string, string[]>);

    return NextResponse.json(galleryData);
  } catch (error) {
    console.error('Failed to read gallery images:', error);
    return NextResponse.json({ error: 'Failed to load gallery images.' }, { status: 500 });
  }
} 