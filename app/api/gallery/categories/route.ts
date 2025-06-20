import { NextResponse } from "next/server"

export async function GET() {
  try {
    const categories = [
      { id: "all", name: "All Categories", count: 131 },
      { id: "entire-villa", name: "Entire Villa", count: 15 },
      { id: "family-suite", name: "Family Suite", count: 12 },
      { id: "group-room", name: "Group Room", count: 10 },
      { id: "triple-room", name: "Triple Room", count: 8 },
      { id: "dining-area", name: "Dining Area", count: 14 },
      { id: "pool-deck", name: "Pool Deck", count: 18 },
      { id: "lake-garden", name: "Lake Garden", count: 16 },
      { id: "roof-garden", name: "Roof Garden", count: 9 },
      { id: "front-garden", name: "Front Garden", count: 11 },
      { id: "koggala-lake", name: "Koggala Lake", count: 13 },
      { id: "excursions", name: "Excursions", count: 5 },
    ]

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
