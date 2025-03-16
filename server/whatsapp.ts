import { Boom } from '@hapi/boom';
import { log } from './vite';
import { InsertMessage } from '@shared/schema';
import { storage } from './storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import qrcode from 'qrcode';
import NodeCache from 'node-cache';
import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, isJidUser, WAMessageKey, makeInMemoryStore } from '@whiskeysockets/baileys';
// For terminal debugging
import qrcodeTerminal from 'qrcode-terminal';

// Define path for sessions
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sessionsDir = path.join(__dirname, '..', 'sessions');

// Make sure sessions directory exists
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true });
}

// Create a message retry cache
const msgRetryCounterCache = new NodeCache();

// Define WhatsApp Status interface (from schema.ts)
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

class WhatsAppClient {
  private socket: any;
  private isConnected: boolean = false;
  private qrCode: string | null = null;
  private clientInfo = {
    name: '',
    phone: '',
    device: '',
    connectedSince: null as Date | null
  };
  private initializationInProgress: boolean = false;

  constructor() {
    log('WhatsApp client created', 'whatsapp');
  }

  // Initialize WhatsApp client and connect
  async initialize() {
    if (this.initializationInProgress) {
      log('Initialization already in progress', 'whatsapp');
      return;
    }
    
    this.initializationInProgress = true;
    
    try {
      log('Initializing WhatsApp client...', 'whatsapp');
      
      // Load auth state from file
      const { state, saveCreds } = await useMultiFileAuthState(sessionsDir);
      
      // Get the latest WhatsApp Web version
      const { version, isLatest } = await fetchLatestBaileysVersion();
      log(`Using WA v${version.join('.')}, isLatest: ${isLatest}`, 'whatsapp');

      // Create socket
      const socket = makeWASocket({
        version,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, {
            debug: (...args) => log(args.join(' '), 'whatsapp-keys'),
            info: (...args) => log(args.join(' '), 'whatsapp-keys'),
            warn: (...args) => log(args.join(' '), 'whatsapp-keys'),
            error: (...args) => log(args.join(' '), 'whatsapp-keys'),
            trace: (...args) => log(args.join(' '), 'whatsapp-keys'),
            level: 'debug',
            child: () => ({
              debug: (...args) => log(args.join(' '), 'whatsapp-keys-child'),
              info: (...args) => log(args.join(' '), 'whatsapp-keys-child'),
              warn: (...args) => log(args.join(' '), 'whatsapp-keys-child'),
              error: (...args) => log(args.join(' '), 'whatsapp-keys-child'),
              trace: (...args) => log(args.join(' '), 'whatsapp-keys-child'),
              level: 'debug',
              child: () => ({ level: 'debug' })
            })
          })
        },
        printQRInTerminal: true,
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true
      });
      
      this.socket = socket;
      
      // Listen for connection updates
      socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
          // Generate QR code
          this.qrCode = await qrcode.toDataURL(qr);
          log('New QR code generated', 'whatsapp');
          
          // Also display in terminal for debugging
          qrcodeTerminal.generate(qr, { small: true });
        }
        
        if (connection === 'close') {
          this.isConnected = false;
          this.clientInfo.connectedSince = null;
          
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          
          log(`Connection closed with status code: ${statusCode}`, 'whatsapp');
          
          if (statusCode !== DisconnectReason.loggedOut) {
            log('Reconnecting...', 'whatsapp');
            this.initializationInProgress = false;
            this.initialize();
          } else {
            log('Logged out, clearing auth state', 'whatsapp');
            // Clear auth state
            fs.rmSync(sessionsDir, { recursive: true, force: true });
            fs.mkdirSync(sessionsDir, { recursive: true });
            this.initializationInProgress = false;
          }
        } else if (connection === 'open') {
          this.isConnected = true;
          this.qrCode = null;
          this.clientInfo.connectedSince = new Date();
          
          // Get client info
          try {
            const userInfo = await socket.user;
            if (userInfo) {
              const phoneNumber = userInfo.id.split(':')[0];
              this.clientInfo.name = userInfo.name || phoneNumber;
              this.clientInfo.phone = phoneNumber;
              this.clientInfo.device = userInfo.platform || 'Unknown';
            }
          } catch (error) {
            log(`Error getting user info: ${error}`, 'whatsapp');
          }
          
          log(`Connected as ${this.clientInfo.name}`, 'whatsapp');
        }
      });
      
      // Listen for credential updates
      socket.ev.on('creds.update', saveCreds);
      
      // Listen for messages
      socket.ev.on('messages.upsert', async (m: any) => {
        log(`Received ${m.messages.length} new messages`, 'whatsapp');
      });

      log('WhatsApp client initialized', 'whatsapp');
    } catch (error) {
      log(`Error initializing WhatsApp client: ${error}`, 'whatsapp');
    } finally {
      this.initializationInProgress = false;
    }
  }

  // Public methods
  async getStatus(): Promise<WhatsAppStatus> {
    // Ensure the client is initialized
    if (!this.isConnected && !this.initializationInProgress && !this.qrCode) {
      await this.initialize();
    }

    return {
      success: true,
      connected: this.isConnected,
      qrCode: this.isConnected ? undefined : this.qrCode || undefined,
      clientInfo: this.isConnected ? {
        name: this.clientInfo.name,
        phone: this.clientInfo.phone,
        device: this.clientInfo.device,
        connectedSince: this.clientInfo.connectedSince?.toISOString() || ''
      } : undefined
    };
  }

  async disconnect(): Promise<boolean> {
    if (this.isConnected && this.socket) {
      try {
        log('Logging out WhatsApp client...', 'whatsapp');
        await this.socket.logout();
        this.isConnected = false;
        this.clientInfo.connectedSince = null;
        log('WhatsApp client disconnected', 'whatsapp');
        return true;
      } catch (error) {
        log(`Error during logout: ${error}`, 'whatsapp');
        return false;
      }
    }
    return false;
  }

  async sendMessage(messageData: InsertMessage) {
    // First, save the message with pending status
    const savedMessage = await storage.createMessage(messageData);
    
    // Check if connected
    if (!this.isConnected || !this.socket) {
      // Update status to failed
      const updatedMessage = await storage.updateMessageStatus(
        savedMessage.id, 
        'failed', 
        null
      );
      throw new Error('WhatsApp client is not connected. Please scan the QR code first.');
    }
    
    try {
      // Format the phone number
      let recipient = messageData.phone.replace(/[^\d]/g, '');
      
      log(`Sending message to ${recipient}...`, 'whatsapp');
      
      // Check if the number exists on WhatsApp
      try {
        const [result] = await this.socket.onWhatsApp(recipient);
        if (!result || !result.exists) {
          const updatedMessage = await storage.updateMessageStatus(
            savedMessage.id, 
            'failed', 
            null
          );
          throw new Error(`The number ${messageData.phone} is not registered on WhatsApp`);
        }
        
        // Format the number for WhatsApp
        recipient = `${recipient}@s.whatsapp.net`;
      } catch (error) {
        log(`Error checking if number exists: ${error}`, 'whatsapp');
        // If we can't check, assume it exists and try to send anyway
        recipient = `${recipient}@s.whatsapp.net`;
      }
      
      // Send the message
      const sentMsg = await this.socket.sendMessage(recipient, { 
        text: messageData.message 
      });
      
      log(`Message sent successfully: ${sentMsg.key.id}`, 'whatsapp');
      
      // Update status to sent
      const updatedMessage = await storage.updateMessageStatus(
        savedMessage.id, 
        'sent', 
        sentMsg.key.id
      );
      
      return updatedMessage;
    } catch (error) {
      log(`Error sending message: ${error}`, 'whatsapp');
      
      // Update status to failed
      const updatedMessage = await storage.updateMessageStatus(
        savedMessage.id, 
        'failed', 
        null
      );
      
      throw error;
    }
  }
}

// Create and export WhatsApp client singleton
export const whatsAppClient = new WhatsAppClient();
