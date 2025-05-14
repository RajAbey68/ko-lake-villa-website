import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  alt: text("alt").notNull(),
  category: text("category").notNull(), // Specific areas like "family-suite", "pool-deck", etc.
  featured: boolean("featured").default(false).notNull(), // Flag for featured images
  sortOrder: integer("sort_order").default(0).notNull(), // For custom ordering within a category
  mediaType: text("media_type").default("image").notNull(), // "image" or "video"
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).extend({
  // Make optional fields that have defaults
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
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
});

export type InsertBookingInquiry = z.infer<typeof insertBookingInquirySchema>;
export type BookingInquiry = typeof bookingInquiries.$inferSelect;

// Contact message model
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  read: boolean("read").default(false).notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  read: true
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
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Still keeping users model for admin functionality in the future
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
