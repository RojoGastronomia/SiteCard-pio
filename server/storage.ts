import { type Event, type MenuItem, type Order, type User, type InsertEvent, type InsertMenuItem, type InsertOrder, type InsertUser, users, events, menuItems, orders } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db, pool } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserCount(): Promise<number>;

  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: InsertEvent): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<void>;
  getEventCount(): Promise<number>;
  getRecentEvents(): Promise<Event[]>;

  // Menu item operations
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  getMenuItemsByEventId(eventId: number): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: InsertMenuItem): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<void>;

  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getOrderCount(): Promise<number>;
  getTotalRevenue(): Promise<number>;

  // Session store
  sessionStore: session.SessionStore;
}

import { Event, MenuItem, User } from "@shared/schema";

export class Storage {
  private events: Map<number, Event>;
  private menuItems: Map<number, MenuItem>;
  private users: Map<number, User>;
  private eventIdCounter: number;
  private menuItemIdCounter: number;
  private userIdCounter: number;

  constructor() {
    this.events = new Map();
    this.menuItems = new Map();
    this.users = new Map();
    this.eventIdCounter = 1;
    this.menuItemIdCounter = 1;
    this.userIdCounter = 1;
  }

  // Events
  getEvents(): Event[] {
    return Array.from(this.events.values());
  }

  getEvent(id: number): Event | undefined {
    return this.events.get(id);
  }

  addEvent(event: Omit<Event, "id">): Event {
    const newEvent = { ...event, id: this.eventIdCounter++ };
    this.events.set(newEvent.id, newEvent);
    return newEvent;
  }

  // Menu Items
  getMenuItems(eventId: number): MenuItem[] {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.eventId === eventId
    );
  }

  addMenuItem(menuItem: Omit<MenuItem, "id">): MenuItem {
    const newMenuItem = { ...menuItem, id: this.menuItemIdCounter++ };
    this.menuItems.set(newMenuItem.id, newMenuItem);
    return newMenuItem;
  }

  // Users
  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUser(id: number): User | undefined {
    return this.users.get(id);
  }

  addUser(user: Omit<User, "id">): User {
    const newUser = { ...user, id: this.userIdCounter++ };
    this.users.set(newUser.id, newUser);
    return newUser;
  }
}

const PostgresSessionStore = connectPg(session);

// Implementação do DatabaseStorage
export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Implementação de métodos de usuário
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result[0].count || 0;
  }

  // Implementação de métodos de evento
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async updateEvent(id: number, eventData: InsertEvent): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set(eventData)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getEventCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(events);
    return result[0].count || 0;
  }

  async getRecentEvents(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt))
      .limit(5);
  }

  // Implementação de métodos de item de menu
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem;
  }

  async getMenuItemsByEventId(eventId: number): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.eventId, eventId));
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db.insert(menuItems).values(insertMenuItem).returning();
    return menuItem;
  }

  async updateMenuItem(id: number, menuItemData: InsertMenuItem): Promise<MenuItem | undefined> {
    const [updatedMenuItem] = await db
      .update(menuItems)
      .set(menuItemData)
      .where(eq(menuItems.id, id))
      .returning();
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // Implementação de métodos de pedido
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrderCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(orders);
    return result[0].count || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await db
      .select({ sum: sql<number>`sum(total)` })
      .from(orders)
      .where(eq(orders.status, "completed"));
    return result[0].sum || 0;
  }

  // System Management
  async performSystemBackup(): Promise<void> {
    // Simulação de backup
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async getSystemLogs(): Promise<any[]> {
    return [
      { message: "Sistema iniciado com sucesso", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { message: "Backup automático realizado", timestamp: new Date(Date.now() - 7200000).toISOString() },
      { message: "Manutenção programada executada", timestamp: new Date(Date.now() - 7200000).toISOString() },
      { message: "Atualização de segurança aplicada", timestamp: new Date(Date.now() - 14400000).toISOString() }
    ];
  }

  async updateSystemSettings(settings: any): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Access Control
  async getPermissions(): Promise<any[]> {
    return [
      { id: 1, name: "read:users", description: "Ler usuários" },
      { id: 2, name: "write:users", description: "Modificar usuários" },
      { id: 3, name: "delete:users", description: "Deletar usuários" }
    ];
  }

  async getRoles(): Promise<any[]> {
    return [
      { id: 1, name: "admin", permissions: ["read:users", "write:users", "delete:users"] },
      { id: 2, name: "manager", permissions: ["read:users", "write:users"] },
      { id: 3, name: "user", permissions: ["read:users"] }
    ];
  }

  async generateApiToken(data: any): Promise<any> {
    return { token: "api_" + Math.random().toString(36).substring(7) };
  }

  // Database Management
  async performDatabaseBackup(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async optimizeDatabase(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async performDatabaseMaintenance(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Monitoring
  async getSystemPerformance(): Promise<any> {
    return {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskUsage: Math.random() * 100
    };
  }

  async getSystemResources(): Promise<any> {
    return {
      totalMemory: "16GB",
      usedMemory: "8GB",
      totalDisk: "500GB",
      usedDisk: "250GB"
    };
  }

  async getSystemAlerts(): Promise<any[]> {
    return [
      { type: "warning", message: "Alto uso de CPU", timestamp: new Date().toISOString() },
      { type: "info", message: "Backup agendado", timestamp: new Date().toISOString() }
    ];
  }

  // Advanced Tools
  async executeConsoleCommand(command: string): Promise<any> {
    return { output: `Executed: ${command}`, timestamp: new Date().toISOString() };
  }

  async manageCacheOperation(operation: any): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async performIndexing(config: any): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Use DatabaseStorage em vez de MemStorage
export const storage = new DatabaseStorage();