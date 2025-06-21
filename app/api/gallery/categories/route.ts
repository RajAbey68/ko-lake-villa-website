import { NextResponse } from "next/server"
import { galleryData } from '../route'

export async function GET() {
  try {
    // Dynamically get unique categories from the gallery data
    const categories = [...new Set(galleryData.map(image => image.category))]
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch gallery categories:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
