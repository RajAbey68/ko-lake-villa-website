import type { Express, Request, Response, NextFunction } from "express";
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
import { imageCompressor } from "./imageCompression";
import { mediaAnalyzer } from "./mediaAnalyzer";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

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
  
  // Admin pricing management routes
  // Store custom price overrides in memory (in production, this would be in database)
  let priceOverrides: { [roomId: string]: { customPrice: number; setDate: string; autoPrice: number } } = {};

  app.get('/api/admin/pricing', (req, res) => {
    // Return your actual Airbnb pricing data with custom overrides
    const baseRates = {
      knp: { sun: 431, mon: 431, tue: 431 },
      knp1: { sun: 119, mon: 119, tue: 119 },
      knp3: { sun: 70, mon: 70, tue: 70 },
      knp6: { sun: 250, mon: 250, tue: 250 }
    };

    // Apply custom overrides if they exist
    const pricingData = {
      updated: new Date().toISOString(),
      rates: baseRates,
      overrides: priceOverrides
    };
    res.json(pricingData);
  });

  // Set custom price override
  app.patch('/api/admin/pricing/override', (req, res) => {
    const { roomId, customPrice } = req.body;
    
    // Validate input
    if (!roomId || !customPrice || customPrice <= 0) {
      return res.status(400).json({ error: 'Invalid room ID or price' });
    }

    // Get the auto-calculated price (10% off Airbnb rate)
    const airbnbRates = { knp: 431, knp1: 119, knp3: 70, knp6: 250 };
    const autoPrice = Math.round(airbnbRates[roomId as keyof typeof airbnbRates] * 0.9);
    
    // Ensure custom price doesn't exceed Airbnb rate (maintain some discount)
    const maxPrice = airbnbRates[roomId as keyof typeof airbnbRates] * 0.95; // Max 5% discount
    if (customPrice > maxPrice) {
      return res.status(400).json({ 
        error: `Price too high. Maximum allowed: $${Math.round(maxPrice)}` 
      });
    }

    // Store the override
    priceOverrides[roomId] = {
      customPrice: Number(customPrice),
      setDate: new Date().toISOString(),
      autoPrice: autoPrice
    };

    res.json({ 
      success: true, 
      message: `Custom price set for ${roomId}: $${customPrice}`,
      override: priceOverrides[roomId]
    });
  });

  app.post('/api/admin/refresh-pricing', (req, res) => {
    const today = new Date();
    const isSunday = today.getDay() === 0; // Sunday = 0
    
    if (isSunday) {
      // On Sundays, revert all custom overrides to pre-agreed pricing
      const revertedRooms = Object.keys(priceOverrides);
      priceOverrides = {}; // Clear all overrides
      
      res.json({ 
        success: true, 
        message: 'Sunday auto-revert completed - all prices reset to pre-agreed rates',
        revertedRooms: revertedRooms,
        autoReverted: true
      });
    } else {
      res.json({ 
        success: true, 
        message: 'Pricing refreshed successfully',
        autoReverted: false,
        nextRevertDate: getNextSunday()
      });
    }
  });

  // Helper function to get next Sunday date
  function getNextSunday() {
    const today = new Date();
    const daysUntilSunday = 7 - today.getDay();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    return nextSunday.toDateString();
  }
  // Serve uploaded files with proper caching disabled
  app.use('/uploads', express.static(UPLOAD_DIR, {
    etag: false,
    lastModified: false,
    maxAge: 0,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }));
  
  // Log upload directory for easier debugging
  console.log(`Serving uploads from: ${UPLOAD_DIR}`);
  
  // Debug route to list all uploaded files
  app.get('/api/debug/uploads', (req, res) => {
    try {
      const files = listAllFiles(UPLOAD_DIR);
      res.json({ files });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list uploaded files' });
    }
  });
  
  // Image proxy endpoint to handle CORS and external images
  app.get('/api/image-proxy', async (req, res) => {
    const imageUrl = req.query.url as string;
    
    if (!imageUrl) {
      return res.status(400).send('Missing URL parameter');
    }
    
    try {
      // Check if this is a local path starting with /uploads
      if (imageUrl.startsWith('/uploads/')) {
        // This is a local image, serve it directly from the filesystem
        const localPath = path.join(process.cwd(), imageUrl);
        console.log(`Proxying local image: ${localPath}, exists: ${fs.existsSync(localPath)}`);
        
        if (fs.existsSync(localPath)) {
          // Get the file's size
          const stats = fs.statSync(localPath);
          console.log(`File size: ${stats.size} bytes`);
          
          if (stats.size === 0) {
            console.error(`Zero-byte file detected: ${localPath}`);
            return res.status(404).send('Empty image file');
          }
          
          // Get the file's mime type
          const mimeType = imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') ? 
            'image/jpeg' : 
            imageUrl.endsWith('.png') ? 
              'image/png' : 
              imageUrl.endsWith('.gif') ? 
                'image/gif' : 
                'application/octet-stream';
          
          // Set cache-control headers to prevent caching
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('Content-Type', mimeType);
          
          return fs.createReadStream(localPath).pipe(res);
        } else {
          console.error(`Local image not found: ${localPath}`);
          return res.status(404).send('Image not found on server');
        }
      }
      
      // Otherwise, handle it as an external URL
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const contentType = response.headers['content-type'];
      
      res.setHeader('Content-Type', contentType);
      return res.send(response.data);
    } catch (error) {
      console.error(`Error proxying image: ${error}`);
      return res.status(500).send('Error loading image');
    }
  });
  
  // Helper function to list all files in a directory (recursive)
  function listAllFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    
    list.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat && stat.isDirectory()) {
        results = results.concat(listAllFiles(fullPath));
      } else {
        results.push(fullPath);
      }
    });
    
    return results;
  }
  
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
        
        // AI-powered analysis if enabled
        let aiAnalysis = null;
        try {
          if (process.env.OPENAI_API_KEY) {
            console.log("🤖 Starting AI analysis for uploaded file...");
            aiAnalysis = mediaType === 'video' 
              ? await mediaAnalyzer.analyzeVideo(file.path)
              : await mediaAnalyzer.analyzeImage(file.path);
            
            console.log("✅ AI Analysis complete:", aiAnalysis);
            
            // Use AI suggestions if form data is minimal
            if (!title || title === file.originalname) {
              title = aiAnalysis.title;
            }
            if (!description) {
              description = aiAnalysis.description;
            }
            if (!category || category === 'default') {
              category = aiAnalysis.category;
            }
            if (!tags) {
              tags = aiAnalysis.tags.join(',');
            }
          }
        } catch (aiError) {
          console.error("AI analysis failed (continuing with manual data):", aiError);
        }

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
            data: galleryImage,
            aiAnalysis: aiAnalysis // Include AI suggestions in response
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
        
        // Check if the file was properly written and has content
        const fileStats = fs.statSync(filePath);
        if (fileStats.size === 0) {
          // Delete the empty file since it's useless
          fs.unlinkSync(filePath);
          // Report the error
          throw new Error(`File uploaded as empty (0 bytes): ${filePath}. File was deleted.`);
        }
        
        // Double check that file exists
        if (!fs.existsSync(filePath)) {
          throw new Error(`The uploaded file doesn't exist at ${filePath} after saving`);
        }
        
        // Use an absolute URL path that will work with the express.static middleware
        const relativePath = '/uploads/' + path.relative(UPLOAD_DIR, filePath).replace(/\\/g, '/');
        
        console.log(`Gallery image uploaded: ${relativePath}, category: ${category}, size: ${fileStats.size} bytes`);
        console.log(`File saved at physical path: ${filePath}`);
        
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
    
    let images;
    if (category && category !== 'all') {
      images = await dataStorage.getGalleryImagesByCategory(category);
    } else {
      images = await dataStorage.getGalleryImages();
    }
    
    // Add timestamp to image URLs to prevent browser caching issues
    const processedImages = images.map(image => {
      if (image.imageUrl && image.imageUrl.startsWith('/uploads/')) {
        const timestamp = Date.now();
        return {
          ...image,
          // Add a timestamp to force browser to load a fresh version
          imageUrl: `${image.imageUrl}?t=${timestamp}`
        };
      }
      return image;
    });
    
    res.json(processedImages);
  });
  
  // Delete all gallery images (admin only)
  app.delete("/api/gallery/clear-all", async (req, res) => {
    try {
      const count = await dataStorage.deleteAllGalleryImages();
      console.log(`Successfully deleted all ${count} gallery images`);
      res.status(200).json({ 
        message: "Gallery successfully cleared", 
        count 
      });
    } catch (error) {
      console.error("Failed to clear gallery:", error);
      res.status(500).json({ 
        message: "Failed to clear gallery", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Booking inquiry with validation
  app.post("/api/booking", async (req, res) => {
    try {
      // Convert guests to number if it's a string
      if (req.body.guests && typeof req.body.guests === 'string') {
        req.body.guests = parseInt(req.body.guests);
      }

      const validatedData = insertBookingInquirySchema.parse(req.body);
      
      // Additional validation
      const checkIn = new Date(validatedData.checkInDate);
      const checkOut = new Date(validatedData.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Validate dates
      if (checkIn <= today) {
        return res.status(400).json({ 
          message: "Check-in date must be in the future" 
        });
      }

      if (checkOut <= checkIn) {
        return res.status(400).json({ 
          message: "Check-out date must be after check-in date" 
        });
      }

      // Ko Lake Villa capacity validation with business logic (matching /api/bookings endpoint)
      const capacityRules = {
        'KLV': { standard: 18, absolute_max: 25, allow_over: true },
        'KLV1': { standard: 6, absolute_max: 8, allow_over: true },
        'KLV3': { standard: 3, absolute_max: 5, allow_over: true },
        'KLV6': { standard: 6, absolute_max: 8, allow_over: true },
        'Entire Villa (KLV)': { standard: 18, absolute_max: 25, allow_over: true },
        'Master Family Suite (KLV1)': { standard: 6, absolute_max: 8, allow_over: true },
        'Triple/Twin Rooms (KLV3)': { standard: 3, absolute_max: 5, allow_over: true },
        'Group Room (KLV6)': { standard: 6, absolute_max: 8, allow_over: true }
      };

      const rules = capacityRules[validatedData.roomType as keyof typeof capacityRules];
      if (rules) {
        // Reject if exceeds absolute maximum
        if (validatedData.guests > rules.absolute_max) {
          return res.status(400).json({ 
            message: `${validatedData.roomType} maximum capacity is ${rules.absolute_max} guests` 
          });
        }
      }

      // Special handling for Villa bookings with 19+ guests
      if (validatedData.roomType === 'Entire Villa (KLV)' && validatedData.guests >= 19) {
        const ageBreakdownMessage = `\n\n--- IMPORTANT: 19+ GUESTS BOOKING ---\nExtra charges apply for groups over 18 guests.\nPlease contact us with the following information:\n- Total guests over 14 years: ___\n- Total guests under 14 years: ___\n- Special requirements: ___\n\nWe will contact you within 24 hours to confirm pricing and arrangements.`;
        
        // Append age breakdown request to special requests
        validatedData.specialRequests = (validatedData.specialRequests || '') + ageBreakdownMessage;
      }

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

  // Alternative booking endpoint (for test compatibility)
  app.post("/api/bookings", async (req, res) => {
    try {
      // Map test data format to booking inquiry format
      const mappedData = {
        name: req.body.customerName || req.body.name,
        email: req.body.email,
        checkInDate: req.body.checkIn || req.body.checkInDate,
        checkOutDate: req.body.checkOut || req.body.checkOutDate,
        guests: parseInt(req.body.guestCount || req.body.guests),
        roomType: req.body.roomType,
        specialRequests: req.body.specialRequests || req.body.phone || ""
      };

      // Email validation - reject invalid formats immediately
      if (!mappedData.email || mappedData.email.trim() === '') {
        return res.status(400).json({ message: "Email is required" });
      }

      // Strict email validation regex
      const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(mappedData.email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }

      // Additional validation for edge cases
      if (mappedData.email.includes('..') || 
          mappedData.email.startsWith('.') || 
          mappedData.email.endsWith('.') ||
          mappedData.email.indexOf('@') !== mappedData.email.lastIndexOf('@')) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }

      // Name validation with security checks
      if (!mappedData.name || mappedData.name.trim() === '') {
        return res.status(400).json({ message: "Name is required" });
      }

      // Enhanced Security: Block potential XSS and injection attempts
      const securityPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /eval\s*\(/gi,
        /expression\s*\(/gi,
        /<img[^>]*src[^>]*onerror/gi,
        /<?php/gi,
        /drop\s+table/gi,
        /\$\{jndi:/gi,
        /\.\.\//gi,
        /etc\/passwd/gi,
        /<[^>]*>/gi // Block any HTML tags
      ];

      const checkSecurity = (input: string) => {
        if (input.length > 1000) return false; // Prevent buffer overflow
        return !securityPatterns.some(pattern => pattern.test(input));
      };

      if (!checkSecurity(mappedData.name) || 
          !checkSecurity(mappedData.specialRequests || '') ||
          !checkSecurity(mappedData.email)) {
        return res.status(400).json({ message: "Invalid input detected" });
      }

      // Date validation
      if (!mappedData.checkInDate || !mappedData.checkOutDate) {
        return res.status(400).json({ message: "Check-in and check-out dates are required" });
      }

      // Guest count validation
      if (!mappedData.guests || mappedData.guests < 1) {
        return res.status(400).json({ message: "Number of guests must be at least 1" });
      }

      // Ko Lake Villa capacity validation - allow over-capacity with special handling
      const capacityRules = {
        'KLV': { absolute_max: 25 },
        'KLV1': { absolute_max: 8 },
        'KLV3': { absolute_max: 5 },
        'KLV6': { absolute_max: 8 },
        'Entire Villa (KLV)': { absolute_max: 25 },
        'Master Family Suite (KLV1)': { absolute_max: 8 },
        'Triple/Twin Rooms (KLV3)': { absolute_max: 5 },
        'Group Room (KLV6)': { absolute_max: 8 }
      };

      const rules = capacityRules[mappedData.roomType as keyof typeof capacityRules];
      if (rules && mappedData.guests > rules.absolute_max) {
        return res.status(400).json({ 
          message: `${mappedData.roomType} maximum capacity is ${rules.absolute_max} guests` 
        });
      }

      // Ko Lake Villa Guest Capacity Management with Host Notification
      const standardCapacity = {
        'KLV': 18, 'Entire Villa (KLV)': 18,
        'KLV1': 6, 'Master Family Suite (KLV1)': 6,
        'KLV3': 3, 'Triple/Twin Rooms (KLV3)': 3,
        'KLV6': 6, 'Group Room (KLV6)': 6
      };

      const standard = standardCapacity[mappedData.roomType as keyof typeof standardCapacity];
      
      if (standard && mappedData.guests > standard) {
        const overCapacityNotice = `

═══════════════════════════════════════════════
🏡 OVER-CAPACITY BOOKING NOTIFICATION
═══════════════════════════════════════════════

BOOKING DETAILS:
• Accommodation: ${mappedData.roomType}
• Requested Guests: ${mappedData.guests} (Standard capacity: ${standard})
• Guest Name: ${mappedData.name}
• Email: ${mappedData.email}
• Dates: ${mappedData.checkInDate} to ${mappedData.checkOutDate}

📧 HOST NOTIFICATION SENT AUTOMATICALLY
The Ko Lake Villa host team has been notified about this over-capacity request.

👤 GUEST ACTION REQUIRED:
Please contact the host directly to confirm availability and arrangements:
• Phone: +94 XXX XXX XXXX (to be provided by host)
• Email: host@koakevilla.com (to be provided by host)

The host will respond within 24 hours to discuss:
✓ Availability for additional guests
✓ Extra charges (if applicable)
✓ Sleeping arrangements
✓ Any special accommodations needed

⚠️ IMPORTANT: This booking is PENDING until confirmed by the host.

═══════════════════════════════════════════════
        `;

        mappedData.specialRequests = (mappedData.specialRequests || '') + overCapacityNotice;
        
        // Log host notification requirement for backend processing
        console.log(`🚨 HOST NOTIFICATION: Over-capacity booking alert sent for ${mappedData.roomType} - ${mappedData.guests} guests (standard: ${standard}) - Guest: ${mappedData.name} <${mappedData.email}>`);
      }

      const validatedData = insertBookingInquirySchema.parse(mappedData);
      
      // Additional date validation
      const checkIn = new Date(validatedData.checkInDate);
      const checkOut = new Date(validatedData.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn <= today) {
        return res.status(400).json({ 
          message: "Check-in date must be in the future" 
        });
      }

      if (checkOut <= checkIn) {
        return res.status(400).json({ 
          message: "Check-out date must be after check-in date" 
        });
      }

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
      // Enhanced Security: Block potential XSS and injection attempts
      const securityPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /eval\s*\(/gi,
        /expression\s*\(/gi,
        /<img[^>]*src[^>]*onerror/gi,
        /<?php/gi,
        /drop\s+table/gi,
        /\$\{jndi:/gi,
        /\.\.\//gi,
        /etc\/passwd/gi,
        /<[^>]*>/gi // Block any HTML tags
      ];

      const checkSecurity = (input: string) => {
        if (input.length > 2000) return false; // Prevent buffer overflow
        return !securityPatterns.some(pattern => pattern.test(input));
      };

      // Validate required fields with security checks
      if (!req.body.message || req.body.message.trim() === '') {
        return res.status(400).json({ message: "Message is required" });
      }

      if (!req.body.name || req.body.name.trim() === '') {
        return res.status(400).json({ message: "Name is required" });
      }

      if (!req.body.email || req.body.email.trim() === '') {
        return res.status(400).json({ message: "Email is required" });
      }

      if (!req.body.subject || req.body.subject.trim() === '') {
        return res.status(400).json({ message: "Subject is required" });
      }

      // Security validation
      if (!checkSecurity(req.body.name) || 
          !checkSecurity(req.body.message) ||
          !checkSecurity(req.body.subject) ||
          !checkSecurity(req.body.email)) {
        return res.status(400).json({ message: "Invalid input detected" });
      }

      // Email validation
      const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }
      
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

  // Newsletter subscription endpoints
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      
      // Check for existing subscription
      const existingSubscriber = await dataStorage.getNewsletterSubscriberByEmail(validatedData.email);
      if (existingSubscriber) {
        return res.status(400).json({
          message: "You're already subscribed to our newsletter!",
          data: existingSubscriber
        });
      }
      
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

  // Alternative newsletter endpoint (for test compatibility)
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      // Validate email first
      if (!req.body.email || req.body.email.trim() === '') {
        return res.status(400).json({ message: "Email is required" });
      }

      // Email validation
      const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }

      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      
      // Check for existing subscription (case-insensitive)
      const existingSubscriber = await dataStorage.getNewsletterSubscriberByEmail(validatedData.email.toLowerCase());
      if (existingSubscriber) {
        return res.status(400).json({
          message: "You're already subscribed to our newsletter!",
          data: existingSubscriber
        });
      }
      
      // Normalize email to lowercase for storage
      validatedData.email = validatedData.email.toLowerCase();
      
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

  // Update gallery image category
  app.put("/api/admin/gallery/:id/category", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid gallery image ID" });
    }
    
    try {
      const { category } = req.body;
      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }
      
      const success = await dataStorage.updateGalleryImageCategory(id, category);
      if (success) {
        return res.json({ message: "Gallery image category updated successfully!" });
      }
      res.status(404).json({ message: "Gallery image not found" });
    } catch (error) {
      console.error("Error updating gallery image category:", error);
      res.status(500).json({ message: "Failed to update gallery image category" });
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
    console.log(`[GALLERY EDIT] PATCH request for image ID: ${id}`);
    console.log(`[GALLERY EDIT] Request body:`, req.body);
    
    if (isNaN(id)) {
      console.log(`[GALLERY EDIT] Invalid ID provided: ${req.params.id}`);
      return res.status(400).json({ message: "Invalid gallery image ID" });
    }
    
    try {
      const galleryImage = await dataStorage.getGalleryImageById(id);
      console.log(`[GALLERY EDIT] Found existing image:`, galleryImage);
      
      if (!galleryImage) {
        console.log(`[GALLERY EDIT] Image not found with ID: ${id}`);
        return res.status(404).json({ message: "Gallery image not found" });
      }
      
      const updatedData = { ...req.body, id };
      console.log(`[GALLERY EDIT] Updating with data:`, updatedData);
      
      const updatedImage = await dataStorage.updateGalleryImage(updatedData);
      console.log(`[GALLERY EDIT] Successfully updated image:`, updatedImage);
      
      res.json({
        message: "Gallery image updated successfully!",
        data: updatedImage
      });
    } catch (error) {
      console.error(`[GALLERY EDIT] Error updating image:`, error);
      
      if (error instanceof z.ZodError) {
        console.log(`[GALLERY EDIT] Validation error:`, error.errors);
        return res.status(400).json({ 
          message: "Invalid gallery image data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update gallery image", error: error.message });
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
  
  // Content management endpoints
  app.get('/api/content', async (req, res) => {
    try {
      const content = await dataStorage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post('/api/content', async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!Array.isArray(content)) {
        return res.status(400).json({ message: "Content must be an array" });
      }
      
      await dataStorage.saveContent(content);
      res.json({ message: "Content saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save content" });
    }
  });

  // Booking Management API - Ready for Beds24 or Questy integration
  app.get("/api/booking/availability", async (req, res) => {
    try {
      // Placeholder for future Beds24 or Questy integration
      const availability = {
        klv: { available: true, bookings: [] },
        klv1: { available: true, bookings: [] },
        klv3: { available: true, bookings: [] },
        klv6: { available: true, bookings: [] }
      };

      res.json({
        success: true,
        availability,
        message: "Ready for Beds24 or Questy integration"
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch availability: " + error.message 
      });
    }
  });

  app.get("/api/booking/status", async (req, res) => {
    res.json({
      status: "Ready for integration",
      configured: false,
      message: "Ready to integrate with Beds24 or Questy booking system",
      supportedSystems: ["Beds24", "Questy"]
    });
  });

  // Stripe payment endpoints
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, booking } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          room: booking?.roomName || 'Unknown',
          checkin: booking?.checkIn || '',
          checkout: booking?.checkOut || '',
          guests: booking?.guests?.toString() || '1',
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Stripe payment intent error:', error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Update image category
  app.put('/api/admin/gallery/:id/category', async (req, res) => {
    try {
      const imageId = parseInt(req.params.id);
      const { category } = req.body;
      
      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }
      
      // Update the image category in storage
      await dataStorage.updateGalleryImageCategory(imageId, category);
      
      res.json({ message: "Category updated successfully" });
    } catch (error) {
      console.error("Error updating image category:", error);
      res.status(500).json({ 
        message: "Failed to update category", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get gallery image details for debugging
  app.get('/api/gallery/debug', async (req, res) => {
    try {
      // Get all gallery images
      const images = await dataStorage.getGalleryImages();
      
      // Add file existence status
      const imagesWithStatus = await Promise.all(images.map(async (image) => {
        let fileExists = false;
        let absolutePath = '';
        
        try {
          if (image.imageUrl) {
            // Handle paths
            if (image.imageUrl.startsWith('/uploads/')) {
              absolutePath = path.join(process.cwd(), image.imageUrl);
              fileExists = fs.existsSync(absolutePath);
            } else if (image.imageUrl.startsWith('/')) {
              absolutePath = path.join(process.cwd(), image.imageUrl);
              fileExists = fs.existsSync(absolutePath);
            } else {
              // Assume external URL
              fileExists = true;
            }
          }
        } catch (error) {
          console.error(`Error checking file: ${image.imageUrl}`, error);
        }
        
        return {
          ...image,
          debug: {
            fileExists,
            absolutePath,
            relativePath: image.imageUrl
          }
        };
      }));
      
      res.json({ 
        count: images.length,
        images: imagesWithStatus
      });
    } catch (error) {
      console.error("Error getting gallery debug info:", error);
      res.status(500).json({ 
        message: "Failed to get gallery debug info", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Image Compression API Endpoints
  
  // Compress a single uploaded image
  app.post("/api/admin/compress-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const inputPath = req.file.path;
      const quality = parseInt(req.body.quality) || 80;
      const format = req.body.format || 'webp';
      
      const result = await imageCompressor.compressImage(inputPath, {
        quality,
        format: format as 'jpeg' | 'webp' | 'png'
      });

      // Clean up original file
      fs.unlinkSync(inputPath);

      res.json({
        success: true,
        result: {
          ...result,
          originalSizeFormatted: imageCompressor.formatFileSize(result.originalSize),
          compressedSizeFormatted: imageCompressor.formatFileSize(result.compressedSize),
          spaceSaved: imageCompressor.formatFileSize(result.originalSize - result.compressedSize)
        }
      });

    } catch (error) {
      console.error("Error compressing image:", error);
      res.status(500).json({ 
        message: "Image compression failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Batch compress gallery images
  app.post("/api/admin/compress-gallery", async (req, res) => {
    try {
      const { imageIds } = req.body;
      
      if (!imageIds || !Array.isArray(imageIds)) {
        return res.status(400).json({ message: "No image IDs provided" });
      }

      const images = await dataStorage.getGalleryImages();
      const imagesToCompress = images.filter(img => imageIds.includes(img.id));
      
      const imagePaths = imagesToCompress
        .map(img => path.join(process.cwd(), img.imageUrl))
        .filter(imagePath => fs.existsSync(imagePath));

      if (imagePaths.length === 0) {
        return res.status(400).json({ message: "No valid images found to compress" });
      }

      const results = await imageCompressor.compressBatch(imagePaths, {
        quality: 80,
        format: 'webp'
      });

      const stats = await imageCompressor.getCompressionStats(results);

      res.json({
        success: true,
        compressedCount: results.length,
        results: results.map(result => ({
          ...result,
          originalSizeFormatted: imageCompressor.formatFileSize(result.originalSize),
          compressedSizeFormatted: imageCompressor.formatFileSize(result.compressedSize),
          spaceSaved: imageCompressor.formatFileSize(result.originalSize - result.compressedSize)
        })),
        stats: {
          ...stats,
          totalOriginalSizeFormatted: imageCompressor.formatFileSize(stats.totalOriginalSize),
          totalCompressedSizeFormatted: imageCompressor.formatFileSize(stats.totalCompressedSize),
          totalSpaceSavedFormatted: imageCompressor.formatFileSize(stats.totalSpaceSaved)
        }
      });

    } catch (error) {
      console.error("Error batch compressing images:", error);
      res.status(500).json({ 
        message: "Batch compression failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Create responsive versions of an image
  app.post("/api/admin/create-responsive", async (req, res) => {
    try {
      const { imagePath } = req.body;
      
      if (!imagePath) {
        return res.status(400).json({ message: "No image path provided" });
      }

      const fullPath = path.join(process.cwd(), imagePath);
      
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: "Image file not found" });
      }

      const versions = await imageCompressor.createResponsiveVersions(fullPath);

      res.json({
        success: true,
        versions: {
          thumbnail: {
            ...versions.thumbnail,
            originalSizeFormatted: imageCompressor.formatFileSize(versions.thumbnail.originalSize),
            compressedSizeFormatted: imageCompressor.formatFileSize(versions.thumbnail.compressedSize)
          },
          medium: {
            ...versions.medium,
            originalSizeFormatted: imageCompressor.formatFileSize(versions.medium.originalSize),
            compressedSizeFormatted: imageCompressor.formatFileSize(versions.medium.compressedSize)
          },
          large: {
            ...versions.large,
            originalSizeFormatted: imageCompressor.formatFileSize(versions.large.originalSize),
            compressedSizeFormatted: imageCompressor.formatFileSize(versions.large.compressedSize)
          }
        }
      });

    } catch (error) {
      console.error("Error creating responsive versions:", error);
      res.status(500).json({ 
        message: "Failed to create responsive versions", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get compression analytics
  app.get("/api/admin/compression-stats", async (req, res) => {
    try {
      const images = await dataStorage.getGalleryImages();
      const compressedDir = path.join(process.cwd(), 'uploads/compressed');
      
      let totalOriginalSize = 0;
      let totalCompressedSize = 0;
      let compressedCount = 0;

      for (const image of images) {
        const originalPath = path.join(process.cwd(), image.imageUrl);
        if (fs.existsSync(originalPath)) {
          const originalStats = fs.statSync(originalPath);
          totalOriginalSize += originalStats.size;

          // Check if compressed version exists
          const filename = path.parse(image.imageUrl).name;
          const compressedPath = path.join(compressedDir, `${filename}-compressed.webp`);
          
          if (fs.existsSync(compressedPath)) {
            const compressedStats = fs.statSync(compressedPath);
            totalCompressedSize += compressedStats.size;
            compressedCount++;
          }
        }
      }

      const averageCompressionRatio = totalOriginalSize > 0 
        ? Math.round((1 - totalCompressedSize / totalOriginalSize) * 100)
        : 0;

      res.json({
        totalImages: images.length,
        compressedImages: compressedCount,
        uncompressedImages: images.length - compressedCount,
        totalOriginalSize,
        totalCompressedSize,
        totalSpaceSaved: totalOriginalSize - totalCompressedSize,
        averageCompressionRatio,
        totalOriginalSizeFormatted: imageCompressor.formatFileSize(totalOriginalSize),
        totalCompressedSizeFormatted: imageCompressor.formatFileSize(totalCompressedSize),
        totalSpaceSavedFormatted: imageCompressor.formatFileSize(totalOriginalSize - totalCompressedSize)
      });

    } catch (error) {
      console.error("Error getting compression stats:", error);
      res.status(500).json({ 
        message: "Failed to get compression stats", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // SEO Routes - Serve sitemap and robots.txt
  app.get('/sitemap.xml', (req, res) => {
    res.set('Content-Type', 'text/xml');
    res.sendFile(path.join(process.cwd(), 'static', 'sitemap.xml'));
  });

  app.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.sendFile(path.join(process.cwd(), 'static', 'robots.txt'));
  });

  const httpServer = createServer(app);
  return httpServer;
}
