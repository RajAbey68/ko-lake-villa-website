import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { dataStorage } from "./storage";
import {
  insertBookingInquirySchema,
  insertContactMessageSchema,
  insertNewsletterSubscriberSchema,
  insertGalleryImageSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// File upload configuration
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directories exist
const uploadPaths = [
  path.join(UPLOAD_DIR, 'gallery', 'default'),
  path.join(UPLOAD_DIR, 'gallery', 'entire-villa'),
  path.join(UPLOAD_DIR, 'gallery', 'family-suite'),
  path.join(UPLOAD_DIR, 'gallery', 'group-room'),
  path.join(UPLOAD_DIR, 'gallery', 'triple-room'),
  path.join(UPLOAD_DIR, 'gallery', 'dining-area'),
  path.join(UPLOAD_DIR, 'gallery', 'pool-deck'),
  path.join(UPLOAD_DIR, 'gallery', 'lake-garden'),
  path.join(UPLOAD_DIR, 'gallery', 'roof-garden'),
  path.join(UPLOAD_DIR, 'gallery', 'front-garden'),
  path.join(UPLOAD_DIR, 'gallery', 'koggala-lake'),
  path.join(UPLOAD_DIR, 'gallery', 'excursions')
];

uploadPaths.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || 'default';
    const uploadPath = path.join(UPLOAD_DIR, 'gallery', 'default');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${timestamp}-${name}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(UPLOAD_DIR));
  
  console.log(`Serving uploads from: ${UPLOAD_DIR}`);

  // File upload endpoint
  app.post("/api/upload", (req, res) => {
    upload.any()(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(500).json({ 
          message: "File upload error", 
          error: err.message 
        });
      }

      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.files[0];
        const category = req.body.category || 'default';
        const title = req.body.title || file.originalname;
        const description = req.body.description || '';
        const featured = req.body.featured === 'true';
        const tags = req.body.tags || '';

        const isVideoFile = file.mimetype.startsWith('video/') || 
                            file.originalname.toLowerCase().endsWith('.mp4') ||
                            file.originalname.toLowerCase().endsWith('.mov') ||
                            file.originalname.toLowerCase().endsWith('.avi');

        const mediaType = req.body.mediaType || (isVideoFile ? 'video' : 'image');
        const fileUrl = `/uploads/gallery/default/${file.filename}`;

        const galleryImageData = {
          imageUrl: fileUrl,
          alt: title,
          description,
          category,
          tags,
          featured,
          mediaType,
          sortOrder: 0
        };

        const galleryImage = await dataStorage.createGalleryImage(galleryImageData);
        
        res.status(201).json({
          message: "File uploaded successfully!",
          data: galleryImage
        });
      } catch (error: any) {
        console.error("Upload processing error:", error);
        res.status(500).json({ 
          message: "Failed to process uploaded file",
          error: error?.message || 'Unknown error'
        });
      }
    });
  });

  // API Routes
  app.get("/api/rooms", async (req, res) => {
    const rooms = await dataStorage.getRooms();
    res.json(rooms);
  });

  app.get("/api/testimonials", async (req, res) => {
    const testimonials = await dataStorage.getTestimonials();
    res.json(testimonials);
  });

  app.get("/api/activities", async (req, res) => {
    const activities = await dataStorage.getActivities();
    res.json(activities);
  });

  app.get("/api/dining-options", async (req, res) => {
    const diningOptions = await dataStorage.getDiningOptions();
    res.json(diningOptions);
  });

  app.get("/api/gallery", async (req, res) => {
    const category = req.query.category as string | undefined;
    
    if (category) {
      const images = await dataStorage.getGalleryImagesByCategory(category);
      return res.json(images);
    }
    
    const allImages = await dataStorage.getGalleryImages();
    res.json(allImages);
  });

  // Booking inquiry
  app.post("/api/booking", async (req, res) => {
    try {
      const validatedData = insertBookingInquirySchema.parse(req.body);
      const bookingInquiry = await dataStorage.createBookingInquiry(validatedData);
      res.status(201).json({
        message: "Booking inquiry submitted successfully!",
        data: bookingInquiry
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit booking inquiry" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await dataStorage.createContactMessage(validatedData);
      res.status(201).json({
        message: "Message sent successfully!",
        data: contactMessage
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid contact form data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await dataStorage.subscribeToNewsletter(validatedData);
      res.status(201).json({
        message: "Subscribed to newsletter successfully!",
        data: subscriber
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid email", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Admin Gallery Management
  app.post("/api/admin/gallery", async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const galleryImage = await dataStorage.createGalleryImage(validatedData);
      res.status(201).json({
        message: "Gallery image added successfully!",
        data: galleryImage
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid gallery image data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to add gallery image" });
    }
  });

  app.delete("/api/admin/gallery/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid gallery image ID" });
    }
    
    try {
      const success = await dataStorage.deleteGalleryImage(id);
      if (success) {
        return res.json({ message: "Gallery image deleted successfully!" });
      }
      res.status(404).json({ message: "Gallery image not found" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  app.patch("/api/admin/gallery/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid gallery image ID" });
    }
    
    try {
      const galleryImage = await dataStorage.getGalleryImageById(id);
      if (!galleryImage) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      
      const updatedData = { ...req.body, id };
      const updatedImage = await dataStorage.updateGalleryImage(updatedData);
      
      res.json({
        message: "Gallery image updated successfully!",
        data: updatedImage
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update gallery image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}