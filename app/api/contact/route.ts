import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string | null;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const inquiryType = formData.get('inquiryType') as string;
    const file = formData.get('attachment') as File | null;

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    let attachmentUrl = '';
    if (file) {
      // Basic validation for safety
      if (file.size > 30 * 1024 * 1024) { // 30MB
          return NextResponse.json({ message: "File is too large." }, { status: 400 });
      }
      
      // In a real app, upload to a cloud storage like S3, Cloudinary, or Vercel Blob
      // For this example, we'll "save" it locally (this won't work reliably on serverless platforms)
      // This is a placeholder for actual file handling logic.
      console.log(`Received file: ${file.name}, size: ${file.size}`);
      attachmentUrl = `/uploads/contact/${Date.now()}_${file.name}`; // Example path
    }

    const contactMessage = {
      id: Date.now(),
      name: fullName,
      email,
      phone: phone || "",
      subject,
      message,
      inquiry_type: inquiryType || "General Inquiry",
      attachment_url: attachmentUrl,
      created_at: new Date(),
      read: false,
    }

    // In a real app, you would save `contactMessage` to your database.
    console.log("New contact inquiry received:", contactMessage);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    })
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}
