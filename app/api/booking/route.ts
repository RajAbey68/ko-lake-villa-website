import { NextResponse } from 'next/server';

interface BookingRequest {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkinDate: string;
  checkoutDate: string;
  guestCount: string;
  roomType: string;
  specialRequests?: string;
}

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json();

    // Basic validation
    const { guestName, guestEmail, checkinDate, checkoutDate, roomType, guestCount } = body;
    if (!guestName || !guestEmail || !checkinDate || !checkoutDate || !roomType || !guestCount) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Check room availability with Guesty API
    // 2. Calculate the total price
    // 3. Create a reservation in Guesty
    // 4. Handle payment processing (e.g., with Stripe)
    // 5. Send a confirmation email

    console.log('Received booking request:', body);

    // For now, we simulate a successful booking
    return NextResponse.json({ success: true, message: 'Booking request received successfully.' });

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json({ error: 'Failed to process booking request.' }, { status: 500 });
  }
} 