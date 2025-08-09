import Link from 'next/link';
import { computeDiscounts } from '@/lib/pricing';

type Room = {
  id: string;
  title: string;
  maxGuests: number;
  baseNight: number;         // base nightly price
  perks: string[];
  airbnbSlug: string;        // e.g. "eklv"
};

const ROOMS: Room[] = [
  { id: 'villa', title: 'Entire Villa Exclusive', maxGuests: 12, baseNight: 431, perks: ['Private Pool','Lake Views'], airbnbSlug: 'eklv' },
  { id: 'master', title: 'Master Family Suite', maxGuests: 4, baseNight: 119, perks: ['Lake View','Private Balcony'], airbnbSlug: 'klv6' },
  { id: 'triple', title: 'Triple/Twin Rooms', maxGuests: 3, baseNight: 70, perks: ['Garden View','Twin/Triple Beds'], airbnbSlug: 'klv2or3' },
  { id: 'group', title: 'Group Room', maxGuests: 6, baseNight: 250, perks: ['Multiple Beds','Shared Space'], airbnbSlug: 'klv-group' },
];

function AirbnbURL(slug:string){ return `https://airbnb.co.uk/h/${slug}`; }

export default function AccommodationPage() {
  const checkIn = new Date(); // today by default; could be tied to a picker in the future

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Accommodation</h1>

      {/* Airbnb copy-and-paste panel */}
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold mb-2">📋 Airbnb Booking URLs (Copy &amp; Paste)</h2>
        <ul className="space-y-1 text-sm">
          <li><strong>Entire Villa:</strong> <code className="px-1 py-0.5 rounded bg-gray-100">{'airbnb.co.uk/h/eklv'}</code></li>
          <li>7 air-conditioned ensuite bedrooms, sleeps max 23 on beds</li>
          <li><strong>Master Family Suite:</strong> <code className="px-1 py-0.5 rounded bg-gray-100">{'airbnb.co.uk/h/klv6'}</code></li>
          <li><strong>Triple/Twin Rooms:</strong> <code className="px-1 py-0.5 rounded bg-gray-100">{'airbnb.co.uk/h/klv2or3'}</code></li>
          <li className="text-gray-600 mt-2">Click on any URL to select all text, then copy and paste into your browser</li>
        </ul>
      </section>

      {/* Pricing cards with direct & last-minute logic */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {ROOMS.map(room => {
          const p = computeDiscounts({ base: room.baseNight, checkIn });
          return (
            <article key={room.id} className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="absolute right-3 top-3 rounded-full bg-red-500 text-white text-xs px-2 py-1">Save {p.totalPct}%</div>
              <h3 className="text-lg font-semibold">{room.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{room.maxGuests} guests</p>

              <div className="mt-3 text-sm">
                <p className="line-through text-gray-400">Airbnb: ${room.baseNight}</p>
                <p className="text-2xl font-semibold text-amber-600">${p.final}<span className="text-sm text-gray-500">/night</span></p>
                <p className="text-green-600 text-sm">Save ${p.savings}</p>
              </div>

              <ul className="mt-3 text-sm text-gray-700 list-disc ml-5">
                {room.perks.map(x => <li key={x}>{x}</li>)}
              </ul>

              <div className="mt-4 grid gap-2">
                <Link href="#" className="inline-flex items-center justify-center rounded-xl bg-amber-500 text-white px-4 py-2 text-sm hover:opacity-90">Book Direct &amp; Save</Link>
                <Link href={AirbnbURL(room.airbnbSlug)} target="_blank" className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">Open on Airbnb</Link>
              </div>

              {p.extraPct > 0 && (
                <p className="mt-2 text-xs text-emerald-700">Includes last-minute {p.extraPct}% (Sun–Thu, within 3 days)</p>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}