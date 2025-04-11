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

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private userIdCounter: number;
  private eventIdCounter: number;
  private menuItemIdCounter: number;
  private orderIdCounter: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.menuItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Seed data
    this.seedEvents();
  }

  private async seedEvents() {
    // Event 1
    const event1: Event = {
      id: this.eventIdCounter++,
      title: "Pacote Almoço Corporativo",
      description: "Serviço completo de catering para almoços corporativos. Inclui opções de menu, serviço de garçom e montagem.",
      status: "available",
      category: "corporate",
      imageUrl: "https://public.readdy.ai/ai/img_res/68a2ff7ee6f61f6c6b0f78ca78bc5f13.jpg",
      menuOptions: 2,
      minGuests: 10,
      maxGuests: 100,
      createdAt: new Date(),
    };
    this.events.set(event1.id, event1);
    
    // Menu items for Event 1
    const menuItem1: MenuItem = {
      id: this.menuItemIdCounter++,
      name: "Menu Executivo",
      description: "Menu completo com entrada, prato principal e sobremesa. Opções de carne, frango e vegetariano.",
      price: 80,
      category: "executive",
      eventId: event1.id,
      imageUrl: "https://via.placeholder.com/300x200?text=Menu+Executivo",
      createdAt: new Date(),
    };
    
    const menuItem2: MenuItem = {
      id: this.menuItemIdCounter++,
      name: "Menu Premium",
      description: "Menu premium com entrada, prato principal gourmet, sobremesa e bebidas inclusas. Diversas opções disponíveis.",
      price: 120,
      category: "premium",
      eventId: event1.id,
      imageUrl: "https://via.placeholder.com/300x200?text=Menu+Premium",
      createdAt: new Date(),
    };
    
    this.menuItems.set(menuItem1.id, menuItem1);
    this.menuItems.set(menuItem2.id, menuItem2);
    
    // Event 2
    const event2: Event = {
      id: this.eventIdCounter++,
      title: "Casamento",
      description: "Serviço de catering completo para casamentos. Inclui coquetel de entrada, jantar, sobremesa e open bar.",
      status: "available",
      category: "wedding",
      imageUrl: "https://public.readdy.ai/ai/img_res/6f8df1bd2a80878edaccbfb15a0a1a93.jpg",
      menuOptions: 3,
      minGuests: 50,
      maxGuests: 300,
      createdAt: new Date(),
    };
    this.events.set(event2.id, event2);
    
    // Menu items for Event 2
    const menuItem3: MenuItem = {
      id: this.menuItemIdCounter++,
      name: "Menu Clássico",
      description: "Menu tradicional com entrada, prato principal e sobremesa. Opções de carne, frango e peixe.",
      price: 150,
      category: "classic",
      eventId: event2.id,
      imageUrl: "https://via.placeholder.com/300x200?text=Menu+Classico",
      createdAt: new Date(),
    };
    
    const menuItem4: MenuItem = {
      id: this.menuItemIdCounter++,
      name: "Menu Gourmet",
      description: "Menu gourmet com 5 tempos: entrada fria, entrada quente, prato principal, pre-sobremesa e sobremesa.",
      price: 250,
      category: "gourmet",
      eventId: event2.id,
      imageUrl: "https://via.placeholder.com/300x200?text=Menu+Gourmet",
      createdAt: new Date(),
    };
    
    const menuItem5: MenuItem = {
      id: this.menuItemIdCounter++,
      name: "Menu Internacional",
      description: "Menu exclusivo com pratos da gastronomia internacional, produtos premium e open bar completo.",
      price: 350,
      category: "international",
      eventId: event2.id,
      imageUrl: "https://via.placeholder.com/300x200?text=Menu+Internacional",
      createdAt: new Date(),
    };
    
    this.menuItems.set(menuItem3.id, menuItem3);
    this.menuItems.set(menuItem4.id, menuItem4);
    this.menuItems.set(menuItem5.id, menuItem5);
    
    // Event 3
    const event3: Event = {
      id: this.eventIdCounter++,
      title: "Aniversário",
      description: "Buffet completo para festas de aniversário. Diversas opções de cardápio e temas.",
      status: "available",
      category: "birthday",
      imageUrl: "https://public.readdy.ai/ai/img_res/73f50ccacb2c3c2fba36fe1f8ea8f96c.jpg",
      menuOptions: 2,
      minGuests: 20,
      maxGuests: 150,
      createdAt: new Date(),
    };
    this.events.set(event3.id, event3);
    
    // Menu items for Event 3
    const menuItem6: MenuItem = {
      id: this.menuItemIdCounter++,
      name: "Menu Festa",
      description: "Buffet completo com finger foods, mini-porções, mesa de doces e bolo personalizado.",
      price: 100,
      category: "party",
      eventId: event3.id,
      imageUrl: "https://via.placeholder.com/300x200?text=Menu+Festa",
      createdAt: new Date(),
    };
    
    const menuItem7: MenuItem = {
      id: this.menuItemIdCounter++,
      name: "Menu Premium Celebration",
      description: "Menu premium com estações gastronômicas, carnes nobres, doces finos e bebidas premium.",
      price: 180,
      category: "premium",
      eventId: event3.id,
      imageUrl: "https://via.placeholder.com/300x200?text=Menu+Premium+Celebration",
      createdAt: new Date(),
    };
    
    this.menuItems.set(menuItem6.id, menuItem6);
    this.menuItems.set(menuItem7.id, menuItem7);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserCount(): Promise<number> {
    return this.users.size;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const now = new Date();
    const event: Event = { ...insertEvent, id, createdAt: now };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventData: InsertEvent): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent: Event = { ...event, ...eventData, id };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    this.events.delete(id);
  }

  async getEventCount(): Promise<number> {
    return this.events.size;
  }

  async getRecentEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getMenuItemsByEventId(eventId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (menuItem) => menuItem.eventId === eventId
    );
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemIdCounter++;
    const now = new Date();
    const menuItem: MenuItem = { ...insertMenuItem, id, createdAt: now };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: number, menuItemData: InsertMenuItem): Promise<MenuItem | undefined> {
    const menuItem = this.menuItems.get(id);
    if (!menuItem) return undefined;
    
    const updatedMenuItem: MenuItem = { ...menuItem, ...menuItemData, id };
    this.menuItems.set(id, updatedMenuItem);
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number): Promise<void> {
    this.menuItems.delete(id);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    const order: Order = { ...insertOrder, id, createdAt: now };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrderCount(): Promise<number> {
    return this.orders.size;
  }

  async getTotalRevenue(): Promise<number> {
    return Array.from(this.orders.values())
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + order.total, 0);
  }
}

const PostgresSessionStore = connectPg(session);

// Implementação do DatabaseStorage
export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
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
}

// Use DatabaseStorage em vez de MemStorage
export const storage = new DatabaseStorage();