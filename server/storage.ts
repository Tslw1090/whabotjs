import { users, type User, type InsertUser, messages, type Message, type InsertMessage } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message related methods
  getMessages(): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageStatus(id: number, status: string, messageId?: string): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private userCurrentId: number;
  private messageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      status: "pending", 
      timestamp: now,
      messageId: null
    };
    this.messages.set(id, message);
    return message;
  }

  async updateMessageStatus(id: number, status: string, messageId?: string): Promise<Message> {
    const message = this.messages.get(id);
    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }
    
    const updatedMessage: Message = { 
      ...message, 
      status, 
      messageId: messageId || message.messageId
    };
    
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new MemStorage();
