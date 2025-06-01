import type { Express } from "express";
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
import multer from "multer";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

// Initialize OpenAI for AI-powered content generation
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// AI-powered content generation for gallery images
async function generateImageContent(filename: string, category: string, isVideo: boolean = false): Promise<{title: string, description: string}> {
  if (!openai) {
    // Fallback to rule-based generation if OpenAI is not available
    return generateFallbackContent(filename, category, isVideo);
  }

  try {
    const mediaType = isVideo ? 'video' : 'image';
    const prompt = `You are creating content for Ko Lake Villa, a luxury lakeside retreat in Ahangama, Galle, Sri Lanka. 
    
    Generate a beautiful title and description for this ${mediaType} in the "${category}" category.
    
    Guidelines:
    - Title should be elegant and guest-friendly (2-6 words)
    - Description should be enticing and descriptive (1-2 sentences)
    - Focus on the luxury experience and beautiful lake setting
    - Make it sound inviting for potential guests
    
    Category context:
    - family-suite: Spacious family accommodations with lake views
    - friends: Fun social spaces and experiences
    - dining-area: Culinary experiences and dining spaces
    - pool-deck: Private pool and relaxation areas
    - lake-view: Stunning views of Koggala Lake
    - gardens: Tropical landscaping and outdoor spaces
    
    Respond in JSON format: {"title": "Beautiful Title", "description": "Engaging description that makes guests want to visit."}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 200
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      title: result.title || generateFallbackContent(filename, category, isVideo).title,
      description: result.description || generateFallbackContent(filename, category, isVideo).description
    };
  } catch (error) {
    console.error('AI content generation error:', error);
    return generateFallbackContent(filename, category, isVideo);
  }
}

// Fallback content generation when AI is not available
function generateFallbackContent(filename: string, category: string, isVideo: boolean): {title: string, description: string} {
  const categoryTitles: Record<string, string> = {
    'family-suite': 'Family Suite',
    'friends': 'Friends & Fun',
    'events': 'Villa Events',
    'dining-area': 'Dining Experience',
    'pool-deck': 'Pool & Deck',
    'lake-view': 'Lake Views',
    'gardens': 'Tropical Gardens',
    'exterior': 'Villa Architecture',
    'amenities': 'Villa Amenities',
    'default': 'Ko Lake Villa'
  };

  const categoryDescriptions: Record<string, string> = {
    'family-suite': 'Spacious family accommodations with stunning lake views and modern amenities for the perfect getaway.',
    'friends': 'Create unforgettable memories with friends in our beautiful lakeside villa setting.',
    'events': 'Host your special celebrations with breathtaking lake views and elegant villa spaces.',
    'dining-area': 'Enjoy delicious Sri Lankan cuisine and international dishes in elegant settings.',
    'pool-deck': 'Relax by our private pool deck with panoramic views of Koggala Lake.',
    'lake-view': 'Wake up to stunning views of Koggala Lake from every window.',
    'gardens': 'Stroll through beautifully landscaped tropical gardens filled with local flora.',
    'exterior': 'Traditional Sri Lankan architecture blended with modern luxury amenities.',
    'amenities': 'Premium amenities that make your stay at Ko Lake Villa truly special.',
    'default': 'Experience the beauty and tranquility of Ko Lake Villa, your luxury lakeside retreat.'
  };

  const title = categoryTitles[category] || 'Ko Lake Villa Experience';
  const description = categoryDescriptions[category] || 'Beautiful moments at Ko Lake Villa, your luxury lakeside retreat in Ahangama.';

  return {
    title: isVideo ? `${title} - Video` : title,
    description
  };
}

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

        const file = Array.isArray(req.files) ? req.files[0] : req.files[Object.keys(req.files)[0]];
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
    try {
      const category = req.query.category as string | undefined;

      if (category && category !== 'all') {
        const images = await dataStorage.getGalleryImagesByCategory(category);
        return res.json(images);
      }

      const allImages = await dataStorage.getGalleryImages();
      res.json(allImages);
    } catch (error) {
      console.error('Gallery API error:', error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  // AI media analysis endpoint for bulk upload
  app.post("/api/analyze-media", async (req, res) => {
    try {
      const { imageData, filename, mediaType } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      if (!openai) {
        // Fallback analysis based on filename
        const lowerFilename = filename?.toLowerCase() || '';
        let suggestedCategory = 'entire-villa';
        
        if (lowerFilename.includes('pool')) suggestedCategory = 'pool-deck';
        else if (lowerFilename.includes('dining') || lowerFilename.includes('restaurant')) suggestedCategory = 'dining-area';
        else if (lowerFilename.includes('suite') || lowerFilename.includes('family')) suggestedCategory = 'family-suite';
        else if (lowerFilename.includes('room') || lowerFilename.includes('triple')) suggestedCategory = 'triple-room';
        else if (lowerFilename.includes('garden') || lowerFilename.includes('landscape')) suggestedCategory = 'lake-garden';
        else if (lowerFilename.includes('lake') || lowerFilename.includes('water')) suggestedCategory = 'koggala-lake';

        return res.json({
          suggestedCategory,
          category: suggestedCategory,
          confidence: 0.7,
          title: `Ko Lake Villa ${suggestedCategory.replace('-', ' ')}`,
          description: `Beautiful ${suggestedCategory.replace('-', ' ')} at Ko Lake Villa`,
          tags: [suggestedCategory, 'ko-lake-villa', 'accommodation']
        });
      }

      // AI analysis with OpenAI
      const prompt = `Analyze this Ko Lake Villa property image and categorize it appropriately.

Available categories:
- entire-villa: Complete villa views
- family-suite: Family accommodation spaces  
- group-room: Group accommodation
- triple-room: Triple occupancy rooms
- dining-area: Dining and restaurant spaces
- pool-deck: Pool and deck areas
- lake-garden: Garden and landscaping
- roof-garden: Rooftop garden areas
- front-garden: Front entrance gardens
- koggala-lake: Lake views and activities
- excursions: Tours and activities

Respond with JSON: {"category": "category-name", "title": "Engaging Title", "description": "Appealing description", "tags": ["tag1", "tag2"], "confidence": 0.9}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user", 
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageData}` } }
            ]
          }
        ],
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      
      res.json({
        suggestedCategory: analysis.category,
        category: analysis.category,
        confidence: analysis.confidence || 0.8,
        title: analysis.title,
        description: analysis.description,
        tags: analysis.tags || [analysis.category, 'ko-lake-villa']
      });

    } catch (error) {
      console.error('AI analysis error:', error);
      res.status(500).json({ error: 'AI analysis failed' });
    }
  });

  // AI content generation endpoint for existing gallery images
  app.post("/api/admin/generate-gallery-content", async (req, res) => {
    try {
      const images = await dataStorage.getGalleryImages();
      let updatedCount = 0;

      for (const image of images) {
        // Only generate content if title or description is missing
        if (!image.title || !image.description || image.title.trim() === '' || image.description.trim() === '') {
          const isVideo = image.mediaType === 'video' || image.imageUrl?.endsWith('.mp4') || image.imageUrl?.endsWith('.mov');
          const generatedContent = await generateImageContent(image.imageUrl, image.category, isVideo);
          
          // Update the image with AI-generated content
          await dataStorage.updateGalleryImage(image.id, {
            title: generatedContent.title,
            description: generatedContent.description
          });
          
          updatedCount++;
        }
      }

      res.json({ 
        message: `Successfully generated content for ${updatedCount} images`,
        updated: updatedCount,
        total: images.length
      });
    } catch (error) {
      console.error('AI content generation error:', error);
      res.status(500).json({ message: "Failed to generate AI content" });
    }
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
        console.error('Booking validation error:', error.errors);
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      console.error('Booking submission error:', error);
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
        console.error('Newsletter validation error:', error.errors);
        return res.status(400).json({ 
          message: "Invalid email format", 
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      console.error('Newsletter subscription error:', error);
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

  // Gallery deletion - admin only
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

  // Handle non-admin gallery deletion attempts
  app.delete("/api/gallery/:id", (req, res) => {
    res.status(403).json({ message: "Gallery deletion requires admin access. Use /api/admin/gallery/:id" });
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

      // Ensure all metadata fields are included
      const updatedData = {
        id,
        alt: req.body.alt || galleryImage.alt,
        description: req.body.description || galleryImage.description,
        category: req.body.category || galleryImage.category,
        tags: req.body.tags || galleryImage.tags,
        featured: req.body.featured !== undefined ? req.body.featured : galleryImage.featured,
        sortOrder: req.body.sortOrder !== undefined ? req.body.sortOrder : galleryImage.sortOrder,
        mediaType: req.body.mediaType || galleryImage.mediaType,
        imageUrl: galleryImage.imageUrl // Keep original URL
      };

      const updatedImage = await dataStorage.updateGalleryImage(updatedData);

      res.json({
        message: "Gallery image updated successfully!",
        data: updatedImage
      });
    } catch (error) {
      console.error('Gallery update error:', error);
      res.status(500).json({ message: "Failed to update gallery image" });
    }
  });

  // Admin health check and route verification
  app.get('/api/admin/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      routes: {
        gallery: '/api/admin/gallery',
        pricing: '/api/admin/pricing',
        upload: '/api/admin/upload'
      }
    });
  });

  // Admin routes
  app.get('/admin/page-images', async (req, res) => {
    try {
      // In a real-world scenario, you might fetch these from a database
      const pageImages = [
        { id: 1, page: 'home', imageUrl: '/uploads/home-banner.jpg', altText: 'Home Banner' },
        { id: 2, page: 'rooms', imageUrl: '/uploads/rooms-banner.jpg', altText: 'Rooms Banner' },
      ];
      res.json(pageImages);
    } catch (error) {
      console.error('Error fetching page images:', error);
      res.status(500).json({ error: 'Failed to fetch page images' });
    }
  });

  // Admin API health endpoints
  app.get('/api/admin/gallery', async (req, res) => {
    try {
      const allImages = await dataStorage.getGalleryImages();
      res.json(allImages);
    } catch (error) {
      console.error('Admin gallery API error:', error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.get('/api/admin/pricing', (req, res) => {
    try {
      // Return sample pricing data for admin
      const pricing = {
        rooms: {
          KNP: { basePrice: 431, directPrice: 388 },
          KNP1: { basePrice: 119, directPrice: 107 },
          KNP3: { basePrice: 70, directPrice: 63 },
          KNP6: { basePrice: 250, directPrice: 225 }
        },
        lastUpdated: new Date().toISOString()
      };
      res.json(pricing);
    } catch (error) {
      console.error('Admin pricing API error:', error);
      res.status(500).json({ message: "Failed to fetch pricing data" });
    }
  });

  // Deal configuration endpoints
  app.post('/admin/deal-config', async (req, res) => {
    try {
      const { earlyBirdDays, earlyBirdDiscount, lateDealDays, lateDealDiscount, baseDiscountPercent } = req.body;

      // Save to database or file
      const dealConfig = {
        earlyBirdDays: parseInt(earlyBirdDays) || 30,
        earlyBirdDiscount: parseInt(earlyBirdDiscount) || 15,
        lateDealDays: parseInt(lateDealDays) || 3,
        lateDealDiscount: parseInt(lateDealDiscount) || 20,
        baseDiscountPercent: parseInt(baseDiscountPercent) || 10,
        updatedAt: new Date().toISOString()
      };

      // For now, save to a JSON file
      const configPath = path.join(__dirname, '../shared/deal-config.json');
      fs.writeFileSync(configPath, JSON.stringify(dealConfig, null, 2));

      res.json({ success: true, config: dealConfig });
    } catch (error) {
      console.error('Error saving deal config:', error);
      res.status(500).json({ error: 'Failed to save deal configuration' });
    }
  });

  app.get('/admin/deal-config', async (req, res) => {
    try {
      const configPath = path.join(__dirname, '../shared/deal-config.json');

      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        res.json(config);
      } else {
        // Default configuration
        const defaultConfig = {
          earlyBirdDays: 30,
          earlyBirdDiscount: 15,
          lateDealDays: 3,
          lateDealDiscount: 20,
          baseDiscountPercent: 10
        };
        res.json(defaultConfig);
      }
    } catch (error) {
      console.error('Error loading deal config:', error);
      res.status(500).json({ error: 'Failed to load deal configuration' });
    }
  });

  // Booking endpoints
  app.get('/admin/bookings', async (req, res) => {
    try {
      // For demo purposes, return sample bookings
      // In production, this would query your booking database
      const sampleBookings = [
        {
          id: '1',
          room: 'KNP',
          guestName: 'John Smith',
          checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          guests: 6,
          originalPrice: 431,
          status: 'confirmed'
        },
        {
          id: '2',
          room: 'KNP1',
          guestName: 'Sarah Johnson',
          checkIn: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          checkOut: new Date(Date.now() + 48 * 24 * 60 * 60 * 1000).toISOString(),
          guests: 4,
          originalPrice: 119,
          status: 'confirmed'
        }
      ];

      res.json(sampleBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  // Deals routes
  app.get('/api/deals', (req, res) => {
    const deals = [
      {
        id: '1',
        type: 'early-bird',
        discount: 15,
        minDays: 14,
        description: 'Book 14+ days in advance',
        active: true
      },
      {
        id: '2', 
        type: 'late-deal',
        discount: 25,
        minDays: 3,
        description: 'Last-minute bookings (3 days or less)',
        active: true
      }
    ];
    res.json(deals);
  });

  app.post('/api/deals', (req, res) => {
    const { type, discount, minDays, description } = req.body;
    const newDeal = {
      id: Date.now().toString(),
      type,
      discount,
      minDays,
      description,
      active: true
    };
    res.json(newDeal);
  });

  app.get('/api/bookings', (req, res) => {
    const mockBookings = [
      {
        id: '1',
        guestName: 'John Smith',
        checkIn: '2025-06-01',
        checkOut: '2025-06-05',
        room: 'Family Suite',
        guests: 4,
        status: 'confirmed',
        totalAmount: 800
      },
      {
        id: '2',
        guestName: 'Sarah Johnson',
        checkIn: '2025-06-03',
        checkOut: '2025-06-07',
        room: 'Entire Villa',
        guests: 8,
        status: 'pending',
        totalAmount: 1500
      }
    ];
    res.json(mockBookings);
  });

  // Analytics routes
  app.get('/api/analytics/stats', (req, res) => {
    // Mock stats
    const stats = {
      totalRevenue: 50000,
      newCustomers: 200,
      bookingsThisMonth: 50
    };
    res.json(stats);
  });

  // Global error handler (only for actual errors)
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Server error:', err);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}