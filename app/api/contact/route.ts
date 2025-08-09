import { NextResponse } from 'next/server';
import { ContactSchema, allowedOrigin } from '@/lib/validate';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  return res;
}

export async function POST(req: Request) {
  // Method enforcement & rate limit by IP
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || '127.0.0.1';
  const rl = rateLimit(`contact:${ip}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  // CSRF / Origin check
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  if (!allowedOrigin(origin ?? referer)) {
    return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
  }

  // Validate payload
  const json = await req.json().catch(() => null);
  const parse = ContactSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parse.error.flatten() }, { status: 400 });
  }
  const body = parse.data;

  // TODO: send email / write to Firestore. For now, return echo ok
  return NextResponse.json({ ok: true, data: { name: body.name, email: body.email, source: body.source ?? 'web' } }, { status: 200 });
}