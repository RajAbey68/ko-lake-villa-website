import { NextResponse } from 'next/server';
import fs, { Dirent } from 'fs';
import path from 'path';

export async function GET() {
  const galleryDirectory = path.join(process.cwd(), 'public/uploads/gallery');

  try {
    // Check if directory exists first
    if (!fs.existsSync(galleryDirectory)) {
      console.warn('Gallery directory does not exist:', galleryDirectory);
      return NextResponse.json([]);
    }

    const categories = fs.readdirSync(galleryDirectory, { withFileTypes: true })
      .filter((dirent: Dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .map((dirent: Dirent) => dirent.name)
      .filter(name => name !== 'kolake-deploy-upgrade.zip'); // Filter out any zip files

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to read gallery categories:', error);
    return NextResponse.json({ error: 'Failed to load gallery categories.' }, { status: 500 });
  }
} 