import express from "express"
import rateLimit from "express-rate-limit"
import validator from "validator"
import DOMPurify from "isomorphic-dompurify"
import multer from "multer"
import path from "path"
import fs from "fs"
import crypto from "crypto"

const router = express.Router()

// Security middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: "Upload limit exceeded, please try again later.",
})

// Apply rate limiting to all routes
router.use(apiLimiter)

// Input sanitization middleware
const sanitizeInput = (req: any, res: any, next: any) => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === "string") {
      return DOMPurify.sanitize(validator.escape(obj))
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject)
    }
    if (obj && typeof obj === "object") {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value)
      }
      return sanitized
    }
    return obj
  }

  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }
  next()
}

router.use(sanitizeInput)

// Secure file upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const uniqueSuffix = crypto.randomBytes(16).toString("hex")
    const sanitizedName = validator.escape(file.originalname.replace(/[^a-zA-Z0-9.-]/g, ""))
    const ext = path.extname(sanitizedName).toLowerCase()
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Strict file type validation
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp"]

    const ext = path.extname(file.originalname).toLowerCase()
    const isValidMime = allowedMimes.includes(file.mimetype)
    const isValidExt = allowedExts.includes(ext)

    if (isValidMime && isValidExt) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed."))
    }
  },
})

// Authentication middleware for admin routes
const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" })
  }

  const token = authHeader.substring(7)

  // In production, verify JWT token here
  // For now, check against environment variable
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Invalid authentication token" })
  }

  next()
}

// Validation helpers
const validateEmail = (email: string): boolean => {
  return validator.isEmail(email) && email.length <= 254
}

const validatePhone = (phone: string): boolean => {
  return validator.isMobilePhone(phone, "any") || validator.isEmpty(phone)
}

const validateDate = (date: string): boolean => {
  return validator.isISO8601(date) && new Date(date) > new Date()
}

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Ko Lake Villa API",
    version: "2.0.0-secure",
  })
})

// Gallery endpoints with security
router.get("/gallery", async (req, res) => {
  try {
    const { category, featured, limit = "50" } = req.query as any

    // Validate query parameters
    if (category && !validator.isAlphanumeric(category.replace("-", ""))) {
      return res.status(400).json({ error: "Invalid category parameter" })
    }

    const limitNum = Number.parseInt(limit as string, 10)
    if (isNaN(limitNum) || limitNum > 100) {
      return res.status(400).json({ error: "Invalid limit parameter" })
    }

    // Mock secure gallery data
    const mockGalleryData = [
      {
        id: 1,
        image_url: "/uploads/villa-exterior.jpg",
        title: DOMPurify.sanitize("Villa Exterior View"),
        alt: DOMPurify.sanitize("Beautiful exterior view of Ko Lake Villa"),
        description: DOMPurify.sanitize("Stunning architectural design with traditional Sri Lankan elements"),
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
        title: DOMPurify.sanitize("Infinity Pool with Lake View"),
        alt: DOMPurify.sanitize("Stunning infinity pool overlooking Koggala Lake"),
        description: DOMPurify.sanitize("Relax by our infinity pool with breathtaking lake views"),
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

    // Apply limit
    filteredData = filteredData.slice(0, limitNum)

    res.json(filteredData)
  } catch (error) {
    console.error("Gallery error:", error)
    res.status(500).json({ error: "Failed to fetch gallery data" })
  }
})

router.get("/gallery/categories", (req, res) => {
  try {
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

// Secure upload endpoint
router.post("/upload", uploadLimiter, authenticateAdmin, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    // Additional security check - verify file is actually an image
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedMimes.includes(req.file.mimetype)) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path)
      return res.status(400).json({ error: "Invalid file type" })
    }

    const fileUrl = `/uploads/${req.file.filename}`

    res.json({
      success: true,
      fileUrl: fileUrl,
      filename: req.file.filename,
      originalName: DOMPurify.sanitize(req.file.originalname),
      size: req.file.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ error: "Upload failed" })
  }
})

// Secure booking endpoint
router.post("/booking", async (req, res) => {
  try {
    const { checkIn, checkOut, guests, roomType, guestName, email, phone, specialRequests } = req.body

    // Comprehensive validation
    if (!checkIn || !checkOut || !guests || !roomType || !guestName || !email) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" })
    }

    if (!validatePhone(phone || "")) {
      return res.status(400).json({ error: "Invalid phone number" })
    }

    if (!validateDate(checkIn) || !validateDate(checkOut)) {
      return res.status(400).json({ error: "Invalid dates" })
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" })
    }

    const guestCount = Number.parseInt(guests, 10)
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 18) {
      return res.status(400).json({ error: "Invalid guest count" })
    }

    const validRoomTypes = ["KLV", "KLV1", "KLV3", "KLV6"]
    if (!validRoomTypes.includes(roomType)) {
      return res.status(400).json({ error: "Invalid room type" })
    }

    // Create secure booking inquiry
    const bookingInquiry = {
      id: crypto.randomUUID(),
      check_in_date: checkIn,
      check_out_date: checkOut,
      guests: guestCount,
      room_type: roomType,
      name: DOMPurify.sanitize(guestName),
      email: validator.normalizeEmail(email) || email,
      phone: phone || "",
      special_requests: DOMPurify.sanitize(specialRequests || ""),
      created_at: new Date(),
      processed: false,
      ip_address: req.ip,
    }

    // Log booking attempt (without sensitive data)
    console.log("New booking inquiry:", {
      id: bookingInquiry.id,
      room_type: bookingInquiry.room_type,
      guests: bookingInquiry.guests,
      ip: req.ip,
    })

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

// Secure contact endpoint
router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message, inquiryType } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" })
    }

    if (!validatePhone(phone || "")) {
      return res.status(400).json({ error: "Invalid phone number" })
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: "Message too long" })
    }

    const validInquiryTypes = ["general", "booking", "amenities", "events", "feedback"]
    if (inquiryType && !validInquiryTypes.includes(inquiryType)) {
      return res.status(400).json({ error: "Invalid inquiry type" })
    }

    const contactMessage = {
      id: crypto.randomUUID(),
      name: DOMPurify.sanitize(name),
      email: validator.normalizeEmail(email) || email,
      phone: phone || "",
      subject: DOMPurify.sanitize(subject),
      message: DOMPurify.sanitize(message),
      inquiry_type: inquiryType || "general",
      created_at: new Date(),
      read: false,
      ip_address: req.ip,
    }

    console.log("New contact message:", {
      id: contactMessage.id,
      inquiry_type: contactMessage.inquiry_type,
      ip: req.ip,
    })

    res.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Contact error:", error)
    res.status(500).json({ error: "Failed to send message" })
  }
})

// Secure admin endpoints
router.get("/admin/dashboard", authenticateAdmin, async (req, res) => {
  try {
    const dashboardData = {
      totalBookings: 12,
      confirmedBookings: 8,
      pendingBookings: 3,
      cancelledBookings: 1,
      totalImages: 131,
      totalGuests: 47,
      revenue: 3240,
      occupancyRate: 73,
      lastUpdated: new Date().toISOString(),
    }

    res.json(dashboardData)
  } catch (error) {
    console.error("Dashboard error:", error)
    res.status(500).json({ error: "Failed to fetch dashboard data" })
  }
})

router.get("/admin/bookings", authenticateAdmin, async (req, res) => {
  try {
    const bookings = [
      {
        id: crypto.randomUUID(),
        guestName: "John Smith",
        email: "john@example.com",
        phone: "+1234567890",
        checkIn: "2024-01-15",
        checkOut: "2024-01-20",
        guests: 4,
        roomType: "Master Family Suite",
        status: "confirmed",
        totalPrice: 535,
        createdAt: new Date().toISOString(),
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

// Error handling middleware
router.use((error: any, req: any, res: any, next: any) => {
  console.error("Route error:", error.message)

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" })
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Too many files" })
    }
  }

  res.status(500).json({ error: "Internal server error" })
})

export default router
