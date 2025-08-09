'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/accommodation', label: 'Accommodation' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin', label: 'Admin' },
];

export default function MainHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/90 backdrop-blur border-b border-gray-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">Ko Lake Villa</Link>
        <ul className="hidden md:flex gap-6">
          {NAV.map(i=>(
            <li key={i.href}>
              <Link href={i.href} className={`text-sm hover:opacity-80 ${pathname===i.href?'font-semibold':''}`}>
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="md:hidden h-10 w-10 rounded-xl border border-gray-300" aria-expanded={open}
          onClick={()=>setOpen(v=>!v)}>☰</button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <ul className="mx-auto max-w-6xl px-4 py-2 space-y-1">
            {NAV.map(i=>(
              <li key={i.href}>
                <Link href={i.href} className={`block rounded-lg px-3 py-2 text-sm hover:bg-gray-50 ${pathname===i.href?'font-semibold':''}`}>
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}