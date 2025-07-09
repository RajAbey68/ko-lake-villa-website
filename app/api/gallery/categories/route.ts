import { NextResponse } from 'next/server';
import fs, { Dirent } from 'fs';
import path from 'path';

export async function GET() {
  const galleryDirectory = path.join(process.cwd(), 'public/uploads/gallery');

  try {
    const categories = fs.readdirSync(galleryDirectory, { withFileTypes: true })
      .filter((dirent: Dirent) => dirent.isDirectory())
      .map((dirent: Dirent) => dirent.name);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to read gallery categories:', error);
    return NextResponse.json({ error: 'Failed to load gallery categories.' }, { status: 500 });
  }
} 