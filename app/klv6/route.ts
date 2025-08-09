import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.AIRBNB_KLV6_URL || 'https://airbnb.co.uk/h/klv6';
  return NextResponse.redirect(url, 301);
}
