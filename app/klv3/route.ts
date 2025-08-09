import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.AIRBNB_KLV3_URL || 'https://airbnb.co.uk/h/klv3';
  return NextResponse.redirect(url, 301);
}
