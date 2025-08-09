import Link from 'next/link';
import { getRooms, guestsLabel, airbnbUrl } from '@/lib/rooms';
import { priceFromWeekly } from '@/lib/pricing-rules';

export default async function AccommodationPage(){
  const rooms = await getRooms();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Accommodation</h1>
      <section className="mb-8 card">
        <h2 className="text-lg font-semibold mb-2">📋 Airbnb Booking URLs (Copy &amp; Paste)</h2>
        <ul className="space-y-1 text-sm">
          {rooms.map(r => (
            <li key={r.id}>
              <strong>{r.title}:</strong> <code className="px-1 py-0.5 rounded bg-gray-100">{airbnbUrl(r.airbnbSlug).replace(/^https:\/\//,'')}</code>
            </li>
          ))}
          <li className="text-gray-600 mt-2">Click a URL to select, then copy &amp; paste.</li>
        </ul>
      </section>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {rooms.map(r => {
          const p = priceFromWeekly({ weeklyAirbnb: r.weeklyAirbnb });
          return (
            <article key={r.id} className="card relative">
              <div className="absolute right-3 top-3 rounded-full bg-red-500 text-white text-xs px-2 py-1">Save {p.totalPct}%</div>
              <h3 className="text-lg font-semibold">{r.title}</h3>
              <p className="text-sm text-gray-600">{guestsLabel(r.guestsMin, r.guestsMax)}</p>
              <div className="mt-3 text-sm">
                <p className="line-through text-gray-400">Airbnb: ${p.nightlyAirbnb}</p>
                <p className="text-2xl font-semibold text-amber-600">${p.final}<span className="text-sm text-gray-500">/night</span></p>
                <p className="text-green-600 text-sm">Save ${p.savings}</p>
              </div>
              <ul className="mt-3 text-sm text-gray-700 list-disc ml-5">
                {r.perks.map(x => <li key={x}>{x}</li>)}
              </ul>
              <div className="mt-4 grid gap-2">
                <Link href="/booking" className="btn btn-primary">Book Direct &amp; Save</Link>
                <Link href={airbnbUrl(r.airbnbSlug)} target="_blank" className="btn btn-outline">Open on Airbnb</Link>
              </div>
              {p.latePct>0 && (
                <p className="mt-2 text-xs text-emerald-700">Includes last-minute {p.latePct}% (Sun–Wed window)</p>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
