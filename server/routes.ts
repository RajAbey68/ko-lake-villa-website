import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image and video files are allowed"))
    }
  },
})

// Health check endpoint
router.get("/health", (req, res) => {
  console.log("Health check requested")
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Ko Lake Villa API",
  })
})

// Gallery endpoints
router.get("/gallery", async (req, res) => {
  try {
    console.log("Gallery request received")
    const { category, featured } = req.query

    // Mock data for now - replace with your database query
    const mockGalleryData = [
      {
        id: 1,
        image_url: "/uploads/villa-exterior.jpg",
        title: "Villa Exterior View",
        alt: "Beautiful exterior view of Ko Lake Villa",
        description: "Stunning architectural design with traditional Sri Lankan elements",
        tags: "villa,exterior,architecture,lake view",
        category: "entire-villa",
        featured: true,
        sort_order: 1,
        media_type: "image",
        file_size: 245760,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        image_url: "/uploads/pool-deck.jpg",
        title: "Infinity Pool with Lake View",
        alt: "Stunning infinity pool overlooking Koggala Lake",
        description: "Relax by our infinity pool with breathtaking lake views",
        tags: "pool,infinity,lake view,relaxation",
        category: "pool-deck",
        featured: true,
        sort_order: 2,
        media_type: "image",
        file_size: 312450,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    let filteredData = mockGalleryData

    if (category && category !== "all") {
      filteredData = filteredData.filter((item) => item.category === category)
    }

    if (featured === "true") {
      filteredData = filteredData.filter((item) => item.featured)
    }

    console.log("Returning gallery data:", filteredData.length, "items")
    res.json(filteredData)
  } catch (error) {
    console.error("Gallery error:", error)
    res.status(500).json({ error: "Failed to fetch gallery data" })
  }
})

router.get("/gallery/categories", (req, res) => {
  try {
    console.log("Categories request received")
    const categories = [
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

    res.json(categories)
  } catch (error) {
    console.error("Categories error:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

// Upload endpoint
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    console.log("Upload request received")

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const fileUrl = `/uploads/${req.file.filename}`
    console.log("File uploaded successfully:", fileUrl)

    res.json({
      success: true,
      fileUrl: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ error: "Upload failed" })
  }
})

// Booking endpoints
router.post("/booking", async (req, res) => {
  try {
    console.log("Booking request received")
    const { checkIn, checkOut, guests, roomType, guestName, email, phone, specialRequests } = req.body

    // Validate required fields
    if (!checkIn || !checkOut || !guests || !roomType || !guestName || !email) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Create booking inquiry object
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

    console.log("New booking inquiry created:", bookingInquiry.id)

    // Here you would save to your database
    // await saveBookingToDatabase(bookingInquiry);

    res.json({
      success: true,
      message: "Booking inquiry submitted successfully",
      bookingId: bookingInquiry.id,
    })
  } catch (error) {
    console.error("Booking error:", error)
    res.status(500).json({ error: "Failed to submit booking inquiry" })
  }
})

// Contact endpoints
router.post("/contact", async (req, res) => {
  try {
    console.log("Contact request received")
    const { name, email, phone, subject, message, inquiryType } = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Create contact message object
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

    console.log("New contact message created:", contactMessage.id)

    // Here you would save to your database
    // await saveContactToDatabase(contactMessage);

    res.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Contact error:", error)
    res.status(500).json({ error: "Failed to send message" })
  }
})

// Admin endpoints
router.get("/admin/dashboard", async (req, res) => {
  try {
    console.log("Dashboard request received")

    // Mock dashboard data - replace with real database queries
    const dashboardData = {
      totalBookings: 12,
      confirmedBookings: 8,
      pendingBookings: 3,
      cancelledBookings: 1,
      totalImages: 131,
      totalGuests: 47,
      revenue: 3240,
      occupancyRate: 73,
    }

    res.json(dashboardData)
  } catch (error) {
    console.error("Dashboard error:", error)
    res.status(500).json({ error: "Failed to fetch dashboard data" })
  }
})

router.get("/admin/bookings", async (req, res) => {
  try {
    console.log("Admin bookings request received")

    // Mock bookings data - replace with real database query
    const bookings = [
      {
        id: 1,
        guestName: "John Smith",
        email: "john@example.com",
        phone: "+1234567890",
        checkIn: "2024-01-15",
        checkOut: "2024-01-20",
        guests: 4,
        roomType: "Master Family Suite",
        status: "confirmed",
        totalPrice: 535,
      },
      {
        id: 2,
        guestName: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1234567891",
        checkIn: "2024-01-25",
        checkOut: "2024-01-28",
        guests: 2,
        roomType: "Triple/Twin Room",
        status: "pending",
        totalPrice: 189,
      },
    ]

    res.json(bookings)
  } catch (error) {
    console.error("Admin bookings error:", error)
    res.status(500).json({ error: "Failed to fetch bookings" })
  }
})

// Room data endpoint
router.get("/rooms", (req, res) => {
  try {
    console.log("Rooms request received")

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

    res.json(rooms)
  } catch (error) {
    console.error("Rooms error:", error)
    res.status(500).json({ error: "Failed to fetch room data" })
  }
})

// AI analysis endpoint (placeholder)
router.post("/analyze-media", async (req, res) => {
  try {
    console.log("AI analysis request received")
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL required" })
    }

    // Mock AI analysis - replace with actual OpenAI integration
    const analysis = {
      title: "Beautiful Villa View",
      description: "Stunning lakeside villa with modern amenities",
      category: "entire-villa",
      tags: ["villa", "lake", "luxury", "accommodation"],
      confidence: 0.95,
    }

    console.log("AI analysis completed for:", imageUrl)
    res.json(analysis)
  } catch (error) {
    console.error("AI analysis error:", error)
    res.status(500).json({ error: "AI analysis failed" })
  }
})

// Error handling middleware
router.use((error, req, res, next) => {
  console.error("Route error:", error)
  res.status(500).json({ error: "Internal server error" })
})

export default router
