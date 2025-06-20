import { type NextRequest, NextResponse } from "next/server"

// Mock gallery data
const mockGalleryData = [
  {
    id: 1,
    image_url: "/placeholder.svg?height=400&width=600&text=Villa Exterior",
    title: "Villa Exterior View",
    alt: "Beautiful exterior view of Ko Lake Villa",
    category: "entire-villa",
    featured: true,
  },
  {
    id: 2,
    image_url: "/placeholder.svg?height=400&width=600&text=Pool Deck",
    title: "Infinity Pool with Lake View",
    alt: "Stunning infinity pool overlooking Koggala Lake",
    category: "pool-deck",
    featured: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let filteredData = mockGalleryData

    if (category && category !== "all") {
      filteredData = filteredData.filter((item) => item.category === category)
    }

    return NextResponse.json(filteredData)
  } catch (error) {
    console.error("Gallery API error:", error)
    return NextResponse.json({ error: "Failed to fetch gallery data" }, { status: 500 })
  }
}
