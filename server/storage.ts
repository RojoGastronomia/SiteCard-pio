import { 
  User, InsertUser, 
  Event, InsertEvent, 
  MenuItem, InsertMenuItem, 
  Order, InsertOrder 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
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

// In-memory storage implementation
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
      checkPeriod: 86400000, // 24h
    });
    
    // Create admin user
    this.createUser({
      username: "admin",
      email: "admin@example.com",
      password: "$2b$10$MblSPjoJfPb6VZg/46XaveWm5zfQ6QhNm8ByYPADLs5ZFCZ3vCBTC", // "password"
      name: "Admin User",
      role: "admin",
      phone: "123456789"
    });
    
    // Seed events
    this.seedEvents();
  }
  
  // Seed initial events
  private async seedEvents() {
    // Sample events
    const events = [
      {
        title: "Pacote Almoço Corporativo",
        description: "Perfeito para reuniões de escritório e eventos corporativos. Selecione entre nossa variedade de opções profissionais para impressionar seus clientes e colaboradores.",
        imageUrl: "https://public.readdy.ai/ai/img_res/1a2b7cfc31ac21de587bbb14f92dc047.jpg",
        location: "Sua empresa",
        eventType: "corporate",
        menuOptions: 2,
        status: "available"
      },
      {
        title: "Coffee Breaks",
        description: "Faça uma pausa e aproveite um momento de descontração com café fresquinho, petiscos deliciosos e boa companhia.",
        imageUrl: "https://public.readdy.ai/ai/img_res/3f3b128a2e3cb18ffd4204a6061d7b15.jpg",
        location: "Salas de reunião",
        eventType: "coffee",
        menuOptions: 2,
        status: "available"
      },
      {
        title: "Festa de Aniversário",
        description: "Celebre momentos especiais com nossos pacotes personalizados para festas de aniversário.",
        imageUrl: "https://public.readdy.ai/ai/img_res/05604aca8895a0a3a16f1451783f34c6.jpg",
        location: "A definir",
        eventType: "birthday",
        menuOptions: 2,
        status: "available"
      },
      {
        title: "Festa Infantil",
        description: "Proporcione uma festa inesquecível para os pequenos com nossos pacotes temáticos e cardápios divertidos.",
        imageUrl: "https://public.readdy.ai/ai/img_res/8d0ed35cd6bc776ccf294d69e68bc775.jpg",
        location: "A definir",
        eventType: "kids",
        menuOptions: 2,
        status: "available"
      },
      {
        title: "Eventos Corporativos",
        description: "Impressione seus clientes e colaboradores com nossos serviços de catering para eventos empresariais.",
        imageUrl: "https://public.readdy.ai/ai/img_res/5b3c734545b54039764d78a747593839.jpg",
        location: "Centro de convenções",
        eventType: "corporate",
        menuOptions: 2,
        status: "available"
      },
      {
        title: "Casamento",
        description: "Torne seu dia especial ainda mais memorável com nossos pacotes exclusivos para casamentos.",
        imageUrl: "https://public.readdy.ai/ai/img_res/b8905632f9218145207ecce49d4cdfb3.jpg",
        location: "Salão de festas",
        eventType: "wedding",
        menuOptions: 2,
        status: "available"
      }
    ];
    
    // Create events
    for (const eventData of events) {
      const event = await this.createEvent(eventData as InsertEvent);
      
      // Create menu items for each event
      await this.createMenuItem({
        name: "Menu Executivo",
        description: "Menu completo com entrada, prato principal e sobremesa. Opções de carne, frango e vegetariano.",
        price: 80.0,
        category: "executive",
        eventId: event.id,
        imageUrl: "https://via.placeholder.com/300x200?text=Menu+Executivo"
      });
      
      await this.createMenuItem({
        name: "Menu Premium",
        description: "Menu premium com entrada, prato principal gourmet, sobremesa e bebidas inclusas. Diversas opções disponíveis.",
        price: 120.0,
        category: "premium",
        eventId: event.id,
        imageUrl: "https://via.placeholder.com/300x200?text=Menu+Premium"
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
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

  // Event operations
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

  // Menu item operations
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

  // Order operations
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
    return Array.from(this.orders.values()).reduce(
      (total, order) => total + order.totalAmount,
      0
    );
  }
}

export const storage = new MemStorage();
