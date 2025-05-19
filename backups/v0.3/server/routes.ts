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
import axios from "axios";

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
    // Get category from request body, default to 'default' if not provided
    const category = req.body.category || 'default';
    
    // Sanitize the category name to prevent directory traversal
    const safeCategory = category.replace(/[^a-zA-Z0-9 -]/g, '_');
    
    // Create path to category directory
    const destination = path.join(GALLERY_DIR, safeCategory);
    
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
    fileSize: 500 * 1024 * 1024, // 500MB max file size for videos
  }
});

import { exportToGoogleDrive } from './googleDriveExport';
import { checkDbHealth } from './db';
import { scrapeWebsiteHandler, scrapeMultipleWebsites } from './scraper';

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
        
        // Determine media type from file mimetype or form data
        const isVideoFile = file.mimetype.startsWith('video/') || 
                            file.originalname.toLowerCase().endsWith('.mp4') ||
                            file.originalname.toLowerCase().endsWith('.mov') ||
                            file.originalname.toLowerCase().endsWith('.avi');
        
        const mediaType = req.body.mediaType || (isVideoFile ? 'video' : 'image');
        
        console.log("Media type detected:", mediaType, "for file:", file.originalname);
        
        // Properly process tags - ensure they're in a consistent format
        let tags = req.body.tags || '';
        console.log("Raw tags:", tags);
        
        // Clean up tags by removing extra spaces and ensuring comma separation
        if (tags) {
          // Convert to array, clean each tag, and join back with proper type annotation
          const tagArray: string[] = tags.split(',');
          tags = tagArray
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0) // Remove empty tags
            .join(',');
          
          console.log("Processed tags:", tags);
        }
        
        const featured = req.body.featured === 'true';
        
        console.log("Form data:", { category, title, description, tags, featured, mediaType });
        console.log("File mimetype:", file.mimetype);
        
        // Create URL for the uploaded file - always using the default folder
        const fileUrl = `/uploads/gallery/default/${file.filename}`;
        console.log("Generated file URL:", fileUrl);
        
        // Save to database
        try {
          // Prepare gallery image data
          const galleryImageData = {
            imageUrl: fileUrl,
            alt: title || file.originalname, // Using title as alt text
            description,
            category,
            tags,
            featured,
            mediaType,
            sortOrder: 0
          };
          
          console.log("Creating gallery image with data:", galleryImageData);
          
          const galleryImage = await dataStorage.createGalleryImage(galleryImageData);
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
  
  // Gallery image upload endpoint
  app.post("/api/gallery/upload", (req, res) => {
    console.log("Gallery upload endpoint called");
    
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error("Gallery upload error:", err);
        return res.status(500).json({ 
          message: "Gallery image upload failed",
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      
      try {
        // Extract form data
        const { category, alt, description, featured, sortOrder, displaySize } = req.body;
        
        // Create relative path for database
        const filePath = req.file.path;
        const relativePath = '/' + path.relative(process.cwd(), filePath).replace(/\\/g, '/');
        
        console.log(`Gallery image uploaded: ${relativePath}, category: ${category}, display size: ${displaySize || 'medium'}`);
        
        // Get file size
        const stats = fs.statSync(filePath);
        const fileSize = stats.size;
        
        // Create gallery image in database
        const galleryImage = await dataStorage.createGalleryImage({
          imageUrl: relativePath,
          alt: alt || 'Ko Lake Villa Image',
          description: description || null,
          category: category,
          featured: featured === 'true',
          sortOrder: parseInt(sortOrder) || 1,
          mediaType: 'image',
          displaySize: displaySize || 'medium',
          fileSize: fileSize,
          tags: category
        });
        
        res.json({ 
          message: "Gallery image uploaded successfully",
          data: galleryImage
        });
      } catch (error) {
        console.error("Error creating gallery image entry:", error);
        if (req.file && req.file.path) {
          // Clean up the uploaded file if database operation failed
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkError) {
            console.error("Failed to clean up uploaded file:", unlinkError);
          }
        }
        res.status(500).json({ 
          message: "Failed to create gallery image entry",
          error: error instanceof Error ? error.message : "Unknown error" 
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
  
  // Google Drive export endpoint
  app.post("/api/export/google-drive", async (req, res) => {
    try {
      await exportToGoogleDrive(req, res);
    } catch (error) {
      console.error('Error exporting to Google Drive:', error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to export to Google Drive' 
      });
    }
  });

  app.get("/api/dining-options", async (req, res) => {
    const diningOptions = await dataStorage.getDiningOptions();
    res.json(diningOptions);
  });
  
  // Database status endpoint for monitoring
  app.get("/api/system/db-status", async (req, res) => {
    try {
      const healthStatus = await checkDbHealth();
      res.json(healthStatus);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown database error'
      });
    }
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

  // Increase image priority (move up in sort order)
  app.post("/api/admin/gallery/:id/priority/increase", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid gallery image ID" });
    }
    
    try {
      const image = await dataStorage.getGalleryImageById(id);
      if (!image) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      
      // Decrease sortOrder to move it up (higher priority)
      const currentOrder = image.sortOrder || 0;
      const updatedImage = await dataStorage.updateGalleryImage({
        ...image,
        id,
        sortOrder: Math.max(0, currentOrder - 1) // Ensure we don't go below 0
      });
      
      res.json({
        message: "Gallery image priority increased!",
        data: updatedImage
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update image priority" });
    }
  });
  
  // Decrease image priority (move down in sort order)
  app.post("/api/admin/gallery/:id/priority/decrease", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid gallery image ID" });
    }
    
    try {
      const image = await dataStorage.getGalleryImageById(id);
      if (!image) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      
      // Increase sortOrder to move it down (lower priority)
      const currentOrder = image.sortOrder || 0;
      const updatedImage = await dataStorage.updateGalleryImage({
        ...image,
        id,
        sortOrder: currentOrder + 1
      });
      
      res.json({
        message: "Gallery image priority decreased!",
        data: updatedImage
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update image priority" });
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

  // Image proxy to bypass CORS restrictions
  app.get("/api/image-proxy", async (req, res) => {
    const imageUrl = req.query.url as string;
    
    console.log(`[IMAGE PROXY] Received request for: ${imageUrl}`);
    
    if (!imageUrl) {
      console.log('[IMAGE PROXY] Error: No URL provided');
      return res.status(400).json({ message: "No image URL provided" });
    }
    
    try {
      // Ensure the URL has a protocol
      let fetchUrl = imageUrl;
      if (!fetchUrl.startsWith('http://') && !fetchUrl.startsWith('https://')) {
        fetchUrl = 'https://' + fetchUrl;
        console.log(`[IMAGE PROXY] Added https protocol: ${fetchUrl}`);
      }
      
      console.log(`[IMAGE PROXY] Fetching from external source: ${fetchUrl}`);
      
      // Add default user agent and referer to appear like a browser request
      const response = await axios({
        method: 'get',
        url: fetchUrl,
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://kolakehouse.com/',
          'Origin': 'https://kolakehouse.com'
        },
        // Increase timeout for slow connections
        timeout: 15000,
        // Don't reject unauthorized SSL certificates
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
      });
      
      // Log success
      console.log(`[IMAGE PROXY] Successfully fetched image, size: ${response.data.length} bytes`);
      
      // Determine the content type from the response headers or default to image/jpeg
      const contentType = response.headers['content-type'] || 'image/jpeg';
      console.log(`[IMAGE PROXY] Content type: ${contentType}`);
      
      // Set the content type header for the response
      res.set('Content-Type', contentType);
      
      // Set cache headers for better performance
      res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      
      // Send the image data
      res.send(response.data);
    } catch (error) {
      console.error('[IMAGE PROXY] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Try to return a fallback image or an error message with more details
      res.status(500).json({ 
        message: "Failed to retrieve image",
        error: errorMessage,
        url: imageUrl
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
