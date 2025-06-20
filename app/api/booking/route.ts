import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkIn, checkOut, guests, roomType, guestName, email, phone, specialRequests } = body

    // Validate required fields
    if (!checkIn || !checkOut || !guests || !roomType || !guestName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create booking inquiry
    const bookingInquiry = {
      id: Date.now(),
      check_in_date: checkIn,
      check_out_date: checkOut,
      guests: Number.parseInt(guests),
      room_type: roomType,
      name: guestName,
      email,
      phone: phone || "",
      special_requests: specialRequests || "",
      created_at: new Date(),
      processed: false,
    }

    // Log booking (in production, save to database)
    console.log("New booking inquiry:", bookingInquiry.id)

    return NextResponse.json({
      success: true,
      message: "Booking inquiry submitted successfully",
      bookingId: bookingInquiry.id,
    })
  } catch (error) {
    console.error("Booking API error:", error)
    return NextResponse.json({ error: "Failed to submit booking inquiry" }, { status: 500 })
  }
}
