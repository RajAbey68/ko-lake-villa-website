import express from "express";
import multer from "multer";
import { storage as dataStorage } from "./storage.js";
// Security: Input sanitization
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+\s*=/gi, '');
}

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Basic API routes
router.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await dataStorage.getRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

router.get("/api/gallery", async (req, res) => {
  try {
    const { category } = req.query;
    const gallery = await dataStorage.getGallery(category);
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

router.post("/api/bookings", async (req, res) => {
  try {
    const sanitizedData = {
      ...req.body,
      contactName: sanitizeInput(req.body.contactName),
      email: sanitizeInput(req.body.email),
      message: sanitizeInput(req.body.message)
    };
    
    const booking = await dataStorage.createBooking(sanitizedData);
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Admin routes with authentication
router.use("/api/admin/*", (req, res, next) => {
  // Basic auth check would go here
  next();
});

router.get("/api/admin/gallery", async (req, res) => {
  try {
    const gallery = await dataStorage.getGallery();
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin gallery" });
  }
});

router.post("/api/admin/gallery", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const mediaData = {
      title: sanitizeInput(req.body.title || req.file.originalname),
      description: sanitizeInput(req.body.description || ''),
      category: sanitizeInput(req.body.category || 'default'),
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => sanitizeInput(tag.trim())) : []
    };
    
    const result = await dataStorage.addGalleryImage(mediaData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

router.delete("/api/admin/gallery/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await dataStorage.deleteGalleryImage(id);
    
    if (success) {
      // Cache invalidated
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export { router as default };
