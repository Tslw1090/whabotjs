import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { whatsAppClient } from "./whatsapp";
import { z } from "zod";
import { sendMessageRequestSchema } from "@shared/schema";
import { ZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = '/api';

  // Status endpoint
  app.get(`${apiPrefix}/status`, async (req: Request, res: Response) => {
    try {
      const status = await whatsAppClient.getStatus();
      res.json({
        success: true,
        ...status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get WhatsApp status"
      });
    }
  });

  // Disconnect endpoint
  app.post(`${apiPrefix}/disconnect`, async (req: Request, res: Response) => {
    try {
      await whatsAppClient.disconnect();
      res.json({
        success: true,
        message: "Successfully disconnected"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to disconnect WhatsApp"
      });
    }
  });

  // Send message endpoint
  app.post(`${apiPrefix}/send`, async (req: Request, res: Response) => {
    try {
      // Validate request body
      const data = sendMessageRequestSchema.parse(req.body);
      
      // Send message
      const result = await whatsAppClient.sendMessage(data);
      
      res.json({
        success: true,
        messageId: result.messageId,
        status: result.status,
        timestamp: result.timestamp
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: `Invalid request: ${error.errors.map(e => e.message).join(', ')}`
        });
      }
      
      // Handle other errors
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to send WhatsApp message"
      });
    }
  });

  // Get recent messages endpoint
  app.get(`${apiPrefix}/messages`, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get messages"
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
