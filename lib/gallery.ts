import path from 'node:path';
import { promises as fs } from 'node:fs';

export type GalleryItem = { id:string; src:string; alt:string; width?:number; height?:number; category?:string };

export async function getStaticGallery(): Promise<GalleryItem[]> {
  try {
    const p = path.join(process.cwd(), 'data', 'gallery.json');
    const raw = await fs.readFile(p, 'utf8');
    const arr = JSON.parse(raw) as GalleryItem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}