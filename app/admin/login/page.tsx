'use client';
import { useState } from 'react';

/**
 * NOTE TO CONTRIBUTORS:
 * This is a TEMPORARY login placeholder so the header route works.
 * DO NOT switch frameworks or auth providers here without ARCHITECTURE APPROVAL.
 */
export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState<string|null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Minimal guard: compare to env var if present; otherwise just warn.
    const required = process.env.NEXT_PUBLIC_ADMIN_PASS;
    if (required) {
      if (pass === required) {
        setMsg('✅ Auth OK (placeholder). Replace with real admin auth.');
        return;
      }
      setMsg('❌ Invalid credentials (placeholder).');
      return;
    }
    setMsg('ℹ️ Placeholder login only. Set NEXT_PUBLIC_ADMIN_PASS to enable the temp check.');
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Staff Login</h1>
      <p className="mt-2 text-gray-600 text-sm">
        Temporary screen so the header button works. Replace with real auth when ready.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button className="rounded-lg bg-amber-600 text-white px-4 py-2">Sign in</button>
      </form>
      {msg && <p className="mt-4 text-amber-700">{msg}</p>}
    </main>
  );
}
