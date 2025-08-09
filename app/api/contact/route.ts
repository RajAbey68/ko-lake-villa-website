import { NextResponse } from 'next/server';
import { z } from 'zod';
import { allowedOrigin } from '@/lib/validate';
import { rateLimit } from '@/lib/rateLimit';

const Schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000),
  phone: z.string().optional(),
  country: z.string().optional(),
  source: z.string().optional()
});

export const runtime = 'nodejs';

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  return res;
}

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || '127.0.0.1';
  const rl = rateLimit(`contact:${ip}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const origin = req.headers.get('origin') ?? req.headers.get('referer');
  if (!allowedOrigin(origin ?? '')) {
    return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parse = Schema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parse.error.flatten() }, { status: 400 });
  }
  const body = parse.data;

  // Optional: forward by email if configured
  try {
    const to = (process.env.CONTACT_FORWARD_TO ?? '')
      .split(',').map(s=>s.trim()).filter(Boolean);
    if (to.length) {
      const nodemailer = (await import('nodemailer')).default;
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! } : undefined
      });
      await transport.sendMail({
        from: process.env.SMTP_FROM ?? 'noreply@kolakevilla.com',
        to,
        subject: `Ko Lake Villa contact: ${body.name}`,
        text: `Name: ${body.name}\nEmail: ${body.email}\nPhone: ${body.phone ?? ''}\nCountry: ${body.country ?? ''}\n\n${body.message}`
      });
    }
  } catch (e) {
    // Don't fail the user if email relay is misconfigured
    console.error('Email forward failed', e);
  }

  return NextResponse.json({ ok: true });
}