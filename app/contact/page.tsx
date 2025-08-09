import Link from 'next/link';
import { waLink } from '@/lib/whatsapp';

const CONTACTS = [
  { role: 'General Manager', phone: '+94 71 776 5780' },
  { role: 'Villa Team Lead (Sinhala speaker)', phone: '+94 77 315 0602' },
  { role: 'Owner', phone: '+94 71 173 0345' },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Contact Us</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {CONTACTS.map(c => {
          const tel = `tel:${c.phone.replace(/\\s+/g,'')}`;
          const wa = waLink(c.phone, 'Hello! I'm contacting Ko Lake Villa via the website.');
          return (
            <section key={c.phone} className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold">{c.role}</h2>
              <p className="mt-1 text-gray-700">{c.phone}</p>
              <div className="mt-4 flex gap-3">
                <Link href={tel} className="inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Call</Link>
                <Link href={wa} target="_blank" className="inline-flex items-center rounded-xl bg-green-600 text-white px-3 py-2 text-sm hover:opacity-90">WhatsApp</Link>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-semibold">Email</h3>
        <p><a className="underline" href="mailto:stay@kolakevilla.com">stay@kolakevilla.com</a></p>
      </div>
    </main>
  );
}