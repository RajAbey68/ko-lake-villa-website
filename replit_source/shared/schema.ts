import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Room model
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price per night in USD
  capacity: integer("capacity").notNull(), // Number of guests
  size: integer("size").notNull(), // Size in m²
  imageUrl: text("image_url").notNull(),
  features: text("features").array().notNull(), // Array of features
});

export const insertRoomSchema = createInsertSchema(rooms);
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

// Testimonial model
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  guestName: text("guest_name").notNull(),
  guestCountry: text("guest_country").notNull(),
  avatarInitials: text("avatar_initials").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials);
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Activity model
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertActivitySchema = createInsertSchema(activities);
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Dining option model
export const diningOptions = pgTable("dining_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  features: text("features").array().notNull(), // Array of features/included items
});

export const insertDiningOptionSchema = createInsertSchema(diningOptions);
export type InsertDiningOption = z.infer<typeof insertDiningOptionSchema>;
export type DiningOption = typeof diningOptions.$inferSelect;

// Gallery image model
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(), // Display title for guests
  alt: text("alt").notNull(), // Alt text for accessibility
  description: text("description"), // Additional details about the image
  tags: text("tags"), // Comma-separated list of tags for searching and filtering
  category: text("category").notNull(), // Specific areas like "family-suite", "pool-deck", etc.
  featured: boolean("featured").default(false).notNull(), // Flag for featured images
  sortOrder: integer("sort_order").default(0).notNull(), // For custom ordering within a category
  mediaType: text("media_type").default("image").notNull(), // "image" or "video"
  displaySize: text("display_size").default("medium").notNull(), // "big", "medium", or "small" 
  fileSize: integer("file_size").default(0), // File size in bytes
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).extend({
  // Make optional fields that have defaults
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
  displaySize: z.enum(["big", "medium", "small"]).optional(),
  category: z.enum([
    "entire-villa", "family-suite", "group-room", "triple-room", 
    "dining-area", "pool-deck", "lake-garden", "roof-garden", 
    "front-garden", "koggala-lake", "excursions", "friends", "events"
  ]).optional(),
});
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

// Booking inquiry model
export const bookingInquiries = pgTable("booking_inquiries", {
  id: serial("id").primaryKey(),
  checkInDate: text("check_in_date").notNull(),
  checkOutDate: text("check_out_date").notNull(),
  guests: integer("guests").notNull(),
  roomType: text("room_type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processed: boolean("processed").default(false).notNull(),
});

export const insertBookingInquirySchema = createInsertSchema(bookingInquiries).omit({
  id: true,
  createdAt: true,
  processed: true
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  checkInDate: z.string().refine(date => {
    const checkIn = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkIn >= today;
  }, "Check-in date must be today or in the future"),
  checkOutDate: z.string().refine(date => {
    const checkOut = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkOut >= today;
  }, "Check-out date must be today or in the future"),
  guests: z.union([
    z.string().transform(val => parseInt(val, 10)),
    z.number()
  ]).pipe(z.number().min(1).max(20)),
  specialRequests: z.string().max(1000, "Special requests too long").optional()
}).refine(data => {
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  return checkOut > checkIn;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"]
});

export type InsertBookingInquiry = z.infer<typeof insertBookingInquirySchema>;
export type BookingInquiry = typeof bookingInquiries.$inferSelect;

// Contact message model
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  timezone: text("timezone"),
  familiarity: text("familiarity"),
  messageType: text("message_type"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  read: boolean("read").default(false).notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  read: true
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  phone: z.string().min(7, "Please enter a valid phone number").optional().or(z.literal("")).nullable(),
  timezone: z.string().optional().nullable(),
  familiarity: z.enum(["yes", "no"]).optional().nullable(),
  messageType: z.enum(["message", "feedback", "testimonial"]).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
  subject: z.string().min(2, "Subject must be at least 2 characters").max(200, "Subject too long")
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Newsletter subscriber model
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  createdAt: true,
  active: true
}).extend({
  email: z.string().email("Please enter a valid email address")
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Firebase users model
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
  isAdmin: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Page hero images table for admin-managed page backgrounds
export const pageHeroImages = pgTable("page_hero_images", {
  id: serial("id").primaryKey(),
  pageName: text("page_name").notNull().unique(), // 'home', 'accommodation', 'gallery', etc.
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPageHeroImageSchema = createInsertSchema(pageHeroImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPageHeroImage = z.infer<typeof insertPageHeroImageSchema>;
export type PageHeroImage = typeof pageHeroImages.$inferSelect;

// Content documents table for marketing materials, news, and events
export const contentDocuments = pgTable("content_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // "pdf", "txt", "doc", "docx"
  fileSize: integer("file_size").notNull(), // in bytes
  category: text("category").notNull(), // "marketing", "news", "events", "seo", "content"
  targetTribes: text("target_tribes").array(), // ["leisure", "digital-nomads", "experienced-tourers"]
  eventTypes: text("event_types").array(), // ["cultural-events", "cricket-events", "surfing-events"]
  extractedKeywords: text("extracted_keywords"), // AI-generated keywords
  aiSummary: text("ai_summary"), // AI-generated summary
  seoScore: integer("seo_score").default(0), // 0-100 SEO optimization score
  status: text("status").default("pending").notNull(), // "pending", "processed", "active", "archived"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContentDocumentSchema = createInsertSchema(contentDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  extractedKeywords: true,
  aiSummary: true,
  seoScore: true,
}).extend({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title too long"),
  category: z.enum(["marketing", "news", "events", "seo", "content"]),
  targetTribes: z.array(z.enum(["leisure", "digital-nomads", "experienced-tourers"])).optional(),
  status: z.enum(["pending", "processed", "active", "archived"]).optional(),
});

export type InsertContentDocument = z.infer<typeof insertContentDocumentSchema>;
export type ContentDocument = typeof contentDocuments.$inferSelect;

// Visitor uploads table for user-generated content that requires approval
export const visitorUploads = pgTable("visitor_uploads", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  alt: text("alt").notNull(),
  description: text("description"),
  tags: text("tags"),
  category: text("category").notNull(),
  mediaType: text("media_type").default("image").notNull(),
  fileSize: integer("file_size").default(0),
  uploaderName: text("uploader_name").notNull(),
  uploaderEmail: text("uploader_email"),
  uploaderPhone: text("uploader_phone"),
  status: text("status").default("pending").notNull(), // "pending", "approved", "rejected"
  moderatorNotes: text("moderator_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by"), // Admin user ID
});

export const insertVisitorUploadSchema = createInsertSchema(visitorUploads).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  approvedBy: true,
  status: true,
}).extend({
  uploaderName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  uploaderEmail: z.string().email("Please enter a valid email address").optional(),
  uploaderPhone: z.string().optional(),
  category: z.enum([
    "entire-villa", "family-suite", "group-room", "triple-room", 
    "dining-area", "pool-deck", "lake-garden", "roof-garden", 
    "front-garden", "koggala-lake", "excursions", "friends", "events"
  ]),
  mediaType: z.enum(["image", "video"]).optional(),
});

export type InsertVisitorUpload = z.infer<typeof insertVisitorUploadSchema>;
export type VisitorUpload = typeof visitorUploads.$inferSelect;

// Virtual Tours table for 360-degree room views
export const virtualTours = pgTable("virtual_tours", {
  id: serial("id").primaryKey(),
  roomId: text("room_id").notNull(),
  roomName: text("room_name").notNull(),
  description: text("description").notNull(),
  panoramaUrl: text("panorama_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  features: text("features").array().default([]),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertVirtualTourSchema = createInsertSchema(virtualTours).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type VirtualTour = typeof virtualTours.$inferSelect;
export type InsertVirtualTour = z.infer<typeof insertVirtualTourSchema>;

// Admin audit log table
export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: serial("id").primaryKey(),
  adminId: text("admin_id").notNull(),
  adminEmail: text("admin_email").notNull(),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: text("status").notNull().default("success"),
});

export const insertAdminAuditLogSchema = createInsertSchema(adminAuditLogs).omit({
  id: true,
  timestamp: true
}).extend({
  adminId: z.string().min(1, "Admin ID is required"),
  adminEmail: z.string().email("Valid admin email is required"),
  action: z.string().min(1, "Action is required"),
  resource: z.string().min(1, "Resource is required"),
  resourceId: z.string().optional(),
  details: z.any().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  status: z.enum(["success", "failed", "partial"]).default("success")
});

export type InsertAdminAuditLog = z.infer<typeof insertAdminAuditLogSchema>;
export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
