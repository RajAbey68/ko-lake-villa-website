import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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