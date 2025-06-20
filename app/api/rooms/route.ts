import { NextResponse } from "next/server"

export async function GET() {
  try {
    const rooms = {
      KLV: {
        name: "Entire Villa",
        capacity: "Up to 18 guests",
        rooms: "7 bedrooms",
        basePrice: 388,
        airbnbPrice: 431,
        savings: 43,
      },
      KLV1: {
        name: "Master Family Suite",
        capacity: "6+ guests",
        rooms: "Large suite",
        basePrice: 107,
        airbnbPrice: 119,
        savings: 12,
      },
      KLV3: {
        name: "Triple/Twin Room",
        capacity: "3+ guests per room",
        rooms: "Individual rooms",
        basePrice: 63,
        airbnbPrice: 70,
        savings: 7,
      },
      KLV6: {
        name: "Group Room",
        capacity: "6+ guests",
        rooms: "Large group space",
        basePrice: 225,
        airbnbPrice: 250,
        savings: 25,
      },
    }

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Rooms API error:", error)
    return NextResponse.json({ error: "Failed to fetch room data" }, { status: 500 })
  }
}
