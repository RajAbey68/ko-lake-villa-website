'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Try autoplay; if blocked, fall back to GIF
    const play = async () => {
      try { await v.play(); setCanPlay(true); } catch { setCanPlay(false); }
    };
    play();
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-10 pb-12">
      {/* two-column on desktop, stacked on mobile */}
      <div className="grid items-center gap-6 md:grid-cols-[minmax(320px,420px)_1fr]">
        {/* CTA Card (left) */}
        <div className="rounded-2xl bg-white/95 shadow-md ring-1 ring-black/5 p-6 md:p-7">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ko Lake Villa</h1>
          <p className="mt-2 text-slate-600">Luxury Lakefront Accommodation in Sri Lanka</p>
          <p className="mt-2 text-[0.95rem] font-medium text-amber-700 italic">Relax, Revive, Reconnect</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/accommodation" className="inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-white hover:opacity-90">
              View Rooms &amp; Rates
            </Link>
            <Link href="/gallery" className="inline-flex items-center rounded-xl border px-4 py-2 text-slate-700 hover:bg-slate-50">
              Explore Gallery
            </Link>
            <Link href="/booking" className="inline-flex items-center rounded-xl border px-4 py-2 text-slate-700 hover:bg-slate-50">
              Book Direct
            </Link>
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-slate-700">
            <li>• Save 10–15% direct</li>
            <li>• Personal service</li>
            <li>• Flexible terms</li>
            <li>• Best rate guarantee</li>
          </ul>
        </div>

        {/* Video panel (right) */}
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/5 bg-black">
          {canPlay ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/videos/pool.mp4"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/yoga-sala.gif"
            />
          ) : (
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/yoga-sala.gif"
                alt="Yoga Sala"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3 right-3 rounded-xl bg-black/60 px-3 py-1 text-xs text-white">
                Preview
              </div>
            </div>
          )}
          {/* Corner title widget (as in your screenshot) */}
          <div className="pointer-events-none absolute right-3 top-3 rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur-sm">
            <div className="text-sm font-semibold">Ko Lake Villa</div>
            <div className="text-xs opacity-80">Tour • Soon</div>
          </div>
        </div>
      </div>
    </section>
  );
}