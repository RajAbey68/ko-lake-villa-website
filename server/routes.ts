import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage as dataStorage } from "./storage";
import { 
  insertBookingInquirySchema, 
  insertContactMessageSchema,
  insertNewsletterSubscriberSchema,
  insertGalleryImageSchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directories
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const GALLERY_DIR = path.join(UPLOAD_DIR, 'gallery');

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(GALLERY_DIR)) {
  fs.mkdirSync(GALLERY_DIR, { recursive: true });
}

// Set up multer for file uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Always use the default directory for simplicity
    // This ensures consistency between uploads and serving
    const destination = path.join(GALLERY_DIR, 'default');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniqueSuffix + '-' + safeFilename);
  }
});

const upload = multer({ 
  storage: fileStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(UPLOAD_DIR));
  
  // File upload endpoint
  app.post("/api/upload", (req, res) => {
    console.log("Upload endpoint called");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(500).json({ 
          message: "File upload error", 
          error: err.message 
        });
      }
      
      try {
        console.log("Processing file upload");
        console.log("Request file after multer:", req.file);
        
        if (!req.file) {
          console.error("No file in request");
          return res.status(400).json({ message: "No file uploaded" });
        }
        
        // Get file details
        const file = req.file;
        console.log("File details:", {
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        });
        
        const category = req.body.category || 'default';
        const title = req.body.title || file.originalname;
        const description = req.body.description || '';
        
        // Properly process tags - ensure they're in a consistent format
        let tags = req.body.tags || '';
        // Clean up tags by removing extra spaces and ensuring comma separation
        if (tags) {
          // Convert to array, clean each tag, and join back
          tags = tags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag) // Remove empty tags
            .join(',');
        }
        
        const featured = req.body.featured === 'true';
        
        console.log("Form data:", { category, title, description, tags, featured });
        
        // Create URL for the uploaded file - always using the default folder
        const fileUrl = `/uploads/gallery/default/${file.filename}`;
        console.log("Generated file URL:", fileUrl);
        
        // Save to database
        try {
          const galleryImage = await dataStorage.createGalleryImage({
            imageUrl: fileUrl,
            alt: title || file.originalname, // Using title as alt text
            description,
            category,
            tags,
            featured
          });
          console.log("Image saved to database:", galleryImage);
          
          res.status(201).json({
            message: "File uploaded successfully!",
            data: galleryImage
          });
        } catch (dbError: any) {
          console.error("Database error:", dbError);
          res.status(500).json({ 
            message: "Failed to save image to database",
            error: dbError?.message || 'Unknown database error'
          });
        }
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

  app.get("/api/rooms/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }
    
    const room = await dataStorage.getRoomById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    
    res.json(room);
  });

  app.get("/api/testimonials", async (req, res) => {
    const testimonials = await dataStorage.getTestimonials();
    res.json(testimonials);
  });

  app.get("/api/activities", async (req, res) => {
    const activities = await dataStorage.getActivities();
    res.json(activities);
  });

  app.get("/api/activities/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid activity ID" });
    }
    
    const activity = await dataStorage.getActivityById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    
    res.json(activity);
  });

  app.get("/api/dining-options", async (req, res) => {
    const diningOptions = await dataStorage.getDiningOptions();
    res.json(diningOptions);
  });

  app.get("/api/dining-options/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid dining option ID" });
    }
    
    const diningOption = await dataStorage.getDiningOptionById(id);
    if (!diningOption) {
      return res.status(404).json({ message: "Dining option not found" });
    }
    
    res.json(diningOption);
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

  // Newsletter unsubscribe
  app.delete("/api/newsletter/:email", async (req, res) => {
    const email = req.params.email;
    try {
      const success = await dataStorage.unsubscribeFromNewsletter(email);
      if (success) {
        return res.json({ message: "Unsubscribed from newsletter successfully!" });
      }
      res.status(404).json({ message: "Email not found in subscribers list" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unsubscribe from newsletter" });
    }
  });

  // Admin Gallery Management
  // Create a new gallery image
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

  // Delete a gallery image
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

  // Update a gallery image
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid gallery image data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update gallery image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
