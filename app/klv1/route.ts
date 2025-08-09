import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.AIRBNB_KLV1_URL || 'https://airbnb.co.uk/h/klv1';
  return NextResponse.redirect(url, 301);
}
