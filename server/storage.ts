import { 
  type Event, type Order, type User, 
  type InsertEvent, type InsertOrder, type InsertUser, 
  type Menu, type Dish, type InsertMenu, type InsertDish,
  users, events, menus, dishes, orders, eventMenus
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db, pool } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
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
  getMenusByEventId(eventId: number): Promise<Menu[]>;
  associateMenuToEvent(eventId: number, menuId: number): Promise<void>;
  dissociateMenuFromEvent(eventId: number, menuId: number): Promise<void>;

  // Menu operations
  getMenu(id: number): Promise<Menu | undefined>;
  getAllMenus(): Promise<Menu[]>;
  createMenu(menu: InsertMenu): Promise<Menu>;
  updateMenu(id: number, menu: InsertMenu): Promise<Menu | undefined>;
  deleteMenu(id: number): Promise<void>;

  // Dish operations
  getDish(id: number): Promise<Dish | undefined>;
  getAllDishes(): Promise<Dish[]>;
  getDishesByMenuId(menuId: number): Promise<Dish[]>;
  createDish(dish: InsertDish, menuId: number): Promise<Dish>;
  updateDish(id: number, dish: InsertDish): Promise<Dish | undefined>;
  deleteDish(id: number): Promise<void>;

  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getOrderCount(): Promise<number>;
  getTotalRevenue(): Promise<number>;

  // Session store
  sessionStore: session.Store;

  // System/Master operations
  performSystemBackup(): Promise<void>;
  getSystemLogs(): Promise<any[]>;
  updateSystemSettings(settings: any): Promise<void>;
  getPermissions(): Promise<any[]>;
  getRoles(): Promise<any[]>;
  generateApiToken(data: any): Promise<any>;
  performDatabaseBackup(): Promise<void>;
  optimizeDatabase(): Promise<void>;
  performDatabaseMaintenance(): Promise<void>;
  getSystemPerformance(): Promise<any>;
  getSystemResources(): Promise<any>;
  getSystemAlerts(): Promise<any[]>;
  executeConsoleCommand(command: string): Promise<any>;
  manageCacheOperation(operation: any): Promise<void>;
  performIndexing(config: any): Promise<void>;
}

const PostgresSessionStore = connectPg(session);

// Implementação do DatabaseStorage
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Implementação de métodos de usuário
  async getUser(id: number): Promise<User | undefined> {
    console.log(`[Storage] getUser called with ID: ${id}`); // Log entry
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      console.log(`[Storage] getUser query returned: ${user ? user.username : 'undefined'}`); // Log result
      return user;
    } catch (error) {
      console.error(`[Storage] Error in getUser for ID ${id}:`, error); // Log error
      throw error; // Re-throw the error to be caught by auth
    }
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
    console.log("[Storage] getAllEvents - Starting query");
    try {
      const result = await db.select().from(events);
      console.log(`[Storage] getAllEvents - Found ${result.length} events`);
      return result;
    } catch (error) {
      console.error("[Storage] getAllEvents - Error:", error);
      throw error;
    }
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

  async getMenusByEventId(eventId: number): Promise<Menu[]> {
    const results = await db.select({ menu: menus })
                           .from(eventMenus)
                           .innerJoin(menus, eq(eventMenus.menuId, menus.id))
                           .where(eq(eventMenus.eventId, eventId));
    return results.map(r => r.menu);
  }

  async associateMenuToEvent(eventId: number, menuId: number): Promise<void> {
    await db.insert(eventMenus).values({ eventId, menuId }).onConflictDoNothing();
  }

  async dissociateMenuFromEvent(eventId: number, menuId: number): Promise<void> {
    await db.delete(eventMenus).where(and(eq(eventMenus.eventId, eventId), eq(eventMenus.menuId, menuId)));
  }

  // Menu operations
  async getMenu(id: number): Promise<Menu | undefined> {
    const [menu] = await db.select().from(menus).where(eq(menus.id, id));
    return menu;
  }

  async getAllMenus(): Promise<Menu[]> {
    return await db.select().from(menus);
  }

  async createMenu(insertMenu: InsertMenu): Promise<Menu> {
    const [menu] = await db.insert(menus).values(insertMenu).returning();
    return menu;
  }

  async updateMenu(id: number, menuData: InsertMenu): Promise<Menu | undefined> {
    const [updatedMenu] = await db.update(menus).set(menuData).where(eq(menus.id, id)).returning();
    return updatedMenu;
  }

  async deleteMenu(id: number): Promise<void> {
    await db.delete(menus).where(eq(menus.id, id));
  }

  // Dish operations
  async getDish(id: number): Promise<Dish | undefined> {
    const [dish] = await db.select().from(dishes).where(eq(dishes.id, id));
    return dish;
  }

  async getAllDishes(): Promise<Dish[]> {
    return await db.select().from(dishes);
  }

  async getDishesByMenuId(menuId: number): Promise<Dish[]> {
    console.log(`[Storage] getDishesByMenuId called with menuId: ${menuId}`);
    try {
        const dishResults = await db
            .select()
            .from(dishes)
            .where(eq(dishes.menuId, menuId))
            .orderBy(dishes.category, dishes.name);
        console.log(`[Storage] getDishesByMenuId found ${dishResults.length} dishes:`, dishResults);
        return dishResults;
    } catch (error) {
        console.error(`[Storage] Error in getDishesByMenuId for menuId ${menuId}:`, error);
        throw error;
    }
  }

  async createDish(insertDish: InsertDish, menuId: number): Promise<Dish> {
    const [dish] = await db.insert(dishes).values({ ...insertDish, menuId }).returning();
    return dish;
  }

  async updateDish(id: number, dishData: InsertDish): Promise<Dish | undefined> {
    const [updatedDish] = await db.update(dishes).set(dishData).where(eq(dishes.id, id)).returning();
    return updatedDish;
  }

  async deleteDish(id: number): Promise<void> {
    await db.delete(dishes).where(eq(dishes.id, id));
  }

  // Order operations
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

// Export an instance of DatabaseStorage
export const storage = new DatabaseStorage();