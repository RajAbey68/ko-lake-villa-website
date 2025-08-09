import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.AIRBNB_KLV_URL || 'https://airbnb.co.uk/h/klv';
  return NextResponse.redirect(url, 301);
}
