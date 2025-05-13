import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBookingInquirySchema, 
  insertContactMessageSchema,
  insertNewsletterSubscriberSchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get("/api/rooms", async (req, res) => {
    const rooms = await storage.getRooms();
    res.json(rooms);
  });

  app.get("/api/rooms/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }
    
    const room = await storage.getRoomById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    
    res.json(room);
  });

  app.get("/api/testimonials", async (req, res) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  app.get("/api/activities", async (req, res) => {
    const activities = await storage.getActivities();
    res.json(activities);
  });

  app.get("/api/activities/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid activity ID" });
    }
    
    const activity = await storage.getActivityById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    
    res.json(activity);
  });

  app.get("/api/dining-options", async (req, res) => {
    const diningOptions = await storage.getDiningOptions();
    res.json(diningOptions);
  });

  app.get("/api/dining-options/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid dining option ID" });
    }
    
    const diningOption = await storage.getDiningOptionById(id);
    if (!diningOption) {
      return res.status(404).json({ message: "Dining option not found" });
    }
    
    res.json(diningOption);
  });

  app.get("/api/gallery", async (req, res) => {
    const category = req.query.category as string | undefined;
    
    if (category) {
      const images = await storage.getGalleryImagesByCategory(category);
      return res.json(images);
    }
    
    const allImages = await storage.getGalleryImages();
    res.json(allImages);
  });

  // Booking inquiry
  app.post("/api/booking", async (req, res) => {
    try {
      const validatedData = insertBookingInquirySchema.parse(req.body);
      const bookingInquiry = await storage.createBookingInquiry(validatedData);
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
      const contactMessage = await storage.createContactMessage(validatedData);
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
      const subscriber = await storage.subscribeToNewsletter(validatedData);
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
      const success = await storage.unsubscribeFromNewsletter(email);
      if (success) {
        return res.json({ message: "Unsubscribed from newsletter successfully!" });
      }
      res.status(404).json({ message: "Email not found in subscribers list" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unsubscribe from newsletter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
