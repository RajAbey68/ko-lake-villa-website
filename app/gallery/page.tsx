import Image from 'next/image';
import { getStaticGallery } from '@/lib/gallery';

async function getGalleryData() {
  // Try dynamic API first; fall back to static file
  try {
    const res = await fetch(\`\${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/gallery\`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) return data;
    }
  } catch {}
  return await getStaticGallery();
}

export default async function GalleryPage() {
  const items = await getGalleryData();

  if (!items.length) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">Gallery</h1>
        <p className="text-gray-600">Gallery is temporarily unavailable. Please check back soon.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it:any) => (
          <figure key={it.id} className="rounded-xl overflow-hidden border border-gray-200 bg-white">
            <Image src={it.src} alt={it.alt ?? 'Gallery'} width={it.width ?? 1600} height={it.height ?? 900} />
            <figcaption className="p-2 text-sm text-gray-600">{it.alt ?? 'Photo'}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}