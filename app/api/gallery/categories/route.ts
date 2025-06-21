import { NextResponse } from "next/server"

export async function GET() {
  const categories = [
    "entire-villa",
    "family-suite",
    "group-room",
    "triple-room",
    "dining-area",
    "excursions",
    "koggala-lake",
    "front-garden",
    "lake-garden",
    "pool-deck",
    "roof-garden",
    "default",
  ]

  try {
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch gallery categories:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
