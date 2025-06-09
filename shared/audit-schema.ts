import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin audit log table
export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: serial("id").primaryKey(),
  adminId: text("admin_id").notNull(), // User ID of admin performing action
  adminEmail: text("admin_email").notNull(), // Email of admin for easy identification
  action: text("action").notNull(), // Action performed (e.g., "gallery_upload", "content_edit", "user_delete")
  resource: text("resource").notNull(), // Resource affected (e.g., "gallery_image", "content_page", "user")
  resourceId: text("resource_id"), // ID of the affected resource
  details: jsonb("details"), // Additional details about the action
  ipAddress: text("ip_address"), // IP address of admin
  userAgent: text("user_agent"), // Browser/client information
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: text("status").notNull().default("success"), // success, failed, partial
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