import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keep original)
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

// New WhatsApp message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  messageId: text("message_id"),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  phone: true,
  message: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// WhatsApp API schemas
export const sendMessageRequestSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Phone number must include country code (e.g. +1234567890)"),
  message: z.string().min(1, "Message is required"),
});

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

export interface WhatsAppStatus {
  success: boolean;
  connected: boolean;
  qrCode?: string;
  clientInfo?: {
    name: string;
    phone: string;
    device: string;
    connectedSince: string;
  };
}
