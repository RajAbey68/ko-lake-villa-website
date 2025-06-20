import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, inquiryType } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create contact message
    const contactMessage = {
      id: Date.now(),
      name,
      email,
      phone: phone || "",
      subject,
      message,
      inquiry_type: inquiryType || "general",
      created_at: new Date(),
      read: false,
    }

    // Log message (in production, save to database)
    console.log("New contact message:", contactMessage.id)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
