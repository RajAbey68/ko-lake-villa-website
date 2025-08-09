'use client';
import Link from 'next/link';
import { useState } from 'react';
import { telHref, toE164, mailto } from '@/lib/intlPhone';

const CONTACTS = [
  { role: 'General Manager', phone: '+94 71 776 5780' },
  { role: 'Villa Team Lead (Sinhala speaker)', phone: '+94 77 315 0602' },
  { role: 'Owner', phone: '+94 71 173 0345' },
];

const ALIASES = [
  { label: 'Stay / General', addr: 'stay@kolakevilla.com' },
  { label: 'Bookings', addr: 'bookings@kolakevilla.com' },
  { label: 'Events', addr: 'events@kolakevilla.com' },
  { label: 'Info', addr: 'info@kolakevilla.com' },
];

function waLink(phone: string, message: string) {
  const p = toE164(phone).replace(/[^\d]/g,'');
  return `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', country:'', message:'' });
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'err'>('idle');
  const [err, setErr] = useState<string>('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending'); setErr('');
    try{
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, message: form.message,
          source: 'web-contact', phone: form.phone, country: form.country
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('ok');
      setForm({ name:'', email:'', phone:'', country:'', message:'' });
    }catch(e:any){
      setErr(e.message || 'Failed to send'); setStatus('err');
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Contact Us</h1>

      {/* People cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {CONTACTS.map(c => {
          const tel = telHref(c.phone);
          const wa = waLink(c.phone, 'Hello! I\'m contacting Ko Lake Villa via the website.');
          return (
            <section key={c.phone} className="card">
              <h2 className="text-lg font-semibold">{c.role}</h2>
              <p className="mt-1 text-gray-700">{c.phone}</p>
              <div className="mt-4 flex gap-3">
                <Link href={tel} aria-label={`Call ${c.role}`} className="btn btn-outline">Call</Link>
                <Link href={wa} target="_blank" aria-label={`WhatsApp ${c.role}`} className="btn btn-primary">WhatsApp</Link>
              </div>
            </section>
          );
        })}
      </div>

      {/* Mail aliases */}
      <section className="mt-8 card">
        <h3 className="font-semibold mb-2">Email</h3>
        <ul className="grid sm:grid-cols-2 gap-2">
          {ALIASES.map(a => {
            const link = mailto(
              a.addr,
              'Ko Lake Villa enquiry',
              'Hello Ko Lake Villa team,\n\n(Please provide details here)'
            );
            return (
              <li key={a.addr}>
                <a className="underline" href={link}>{a.label}: {a.addr}</a>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          International callers: please use the WhatsApp buttons or the +94 international format for Sri Lanka.
        </p>
      </section>

      {/* Message dialog / form */}
      <section className="mt-8 card" aria-label="Message us">
        <h3 className="font-semibold mb-2">Send us a message</h3>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
              placeholder="Your name" className="rounded-xl border px-3 py-2" />
            <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
              placeholder="Email" className="rounded-xl border px-3 py-2" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
              placeholder="Phone (e.g. +94 71 776 5780)" className="rounded-xl border px-3 py-2" />
            <input value={form.country} onChange={e=>setForm({...form,country:e.target.value})}
              placeholder="Country" className="rounded-xl border px-3 py-2" />
          </div>
          <textarea required value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
            placeholder="Message" rows={5} className="rounded-xl border px-3 py-2" />
          <div className="flex items-center gap-3">
            <button disabled={status==='sending'} className="btn btn-primary" type="submit">
              {status==='sending' ? 'Sending…' : 'Send'}
            </button>
            {status==='ok' && <span className="text-emerald-600 text-sm">Thanks! We'll get back to you shortly.</span>}
            {status==='err' && <span className="text-red-600 text-sm">Send failed: {err}</span>}
          </div>
        </form>
      </section>
    </main>
  );
}