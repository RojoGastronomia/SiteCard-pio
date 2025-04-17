import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertEventSchema, insertDishSchema, insertOrderSchema, insertMenuSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Check if user is authenticated and has admin role
  const isAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (req.user.role !== "Administrador") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    next();
  };

  // Events routes
  app.get("/api/events", async (req, res) => {
    console.log("[API] GET /api/events - Request received");
    console.log("[API] User authenticated:", req.isAuthenticated());
    if (req.user) {
      console.log("[API] User role:", req.user.role);
    }
    try {
      const events = await storage.getAllEvents();
      console.log(`[API] GET /api/events - Found ${events.length} events:`, events);
      res.json(events);
    } catch (error) {
      console.error("[API] GET /api/events - Error:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Error fetching event" });
    }
  });

  app.post("/api/events", isAdmin, async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const eventData = insertEventSchema.parse(req.body);
      const updatedEvent = await storage.updateEvent(eventId, eventData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.delete("/api/events/:id", isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      await storage.deleteEvent(eventId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting event" });
    }
  });

  // --- NEW: Routes for Event <-> Menu association ---
  app.get("/api/events/:eventId/menus", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const menus = await storage.getMenusByEventId(eventId);
      res.json(menus);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menus for event" });
    }
  });

  app.post("/api/events/:eventId/menus/:menuId", isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const menuId = parseInt(req.params.menuId);
      await storage.associateMenuToEvent(eventId, menuId);
      res.status(201).send();
    } catch (error) {
      res.status(500).json({ message: "Error associating menu to event" });
    }
  });
  
  app.delete("/api/events/:eventId/menus/:menuId", isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const menuId = parseInt(req.params.menuId);
      await storage.dissociateMenuFromEvent(eventId, menuId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error dissociating menu from event" });
    }
  });

  // --- NEW: Menu CRUD routes ---
  app.get("/api/menus", isAdmin, async (req, res) => {
    try {
      const menus = await storage.getAllMenus();
      res.json(menus);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menus" });
    }
  });

  app.post("/api/menus", isAdmin, async (req, res) => {
    try {
      const menuData = insertMenuSchema.parse(req.body);
      const menu = await storage.createMenu(menuData);
      res.status(201).json(menu);
    } catch (error) {
      res.status(400).json({ message: "Invalid menu data" });
    }
  });

  app.put("/api/menus/:id", isAdmin, async (req, res) => {
    try {
      const menuId = parseInt(req.params.id);
      const menuData = insertMenuSchema.parse(req.body);
      const updatedMenu = await storage.updateMenu(menuId, menuData);
      if (!updatedMenu) return res.status(404).json({ message: "Menu not found" });
      res.json(updatedMenu);
    } catch (error) {
      res.status(400).json({ message: "Invalid menu data" });
    }
  });

  app.delete("/api/menus/:id", isAdmin, async (req, res) => {
    try {
      const menuId = parseInt(req.params.id);
      await storage.deleteMenu(menuId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting menu" });
    }
  });

  // --- UPDATED: Dish (formerly MenuItem) routes ---
  app.get("/api/dishes", isAdmin, async (req, res) => {
    try {
      const allDishes = await storage.getAllDishes();
      res.json(allDishes);
    } catch (error) {
      console.error("Error fetching all dishes:", error);
      res.status(500).json({ message: "Error fetching dishes" });
    }
  });
  
  // Route to get dishes for a specific menu
  app.get("/api/menus/:menuId/dishes", async (req, res) => {
    try {
      const menuId = parseInt(req.params.menuId);
      const dishes = await storage.getDishesByMenuId(menuId);
      res.json(dishes);
    } catch (error) {
      console.error("Error fetching dishes for menu:", error);
      res.status(500).json({ message: "Error fetching dishes for menu" });
    }
  });
  
  app.post("/api/menus/:menuId/dishes", isAdmin, async (req, res) => {
    try {
      const menuId = parseInt(req.params.menuId);
      const dishData = insertDishSchema.parse(req.body);
      const dish = await storage.createDish(dishData, menuId);
      res.status(201).json(dish);
    } catch (error) {
      res.status(400).json({ message: "Invalid dish data" });
    }
  });

  app.put("/api/dishes/:id", isAdmin, async (req, res) => {
    try {
      const dishId = parseInt(req.params.id);
      const dishData = insertDishSchema.parse(req.body);
      const updatedDish = await storage.updateDish(dishId, dishData);
      if (!updatedDish) return res.status(404).json({ message: "Dish not found" });
      res.json(updatedDish);
    } catch (error) {
      res.status(400).json({ message: "Invalid dish data" });
    }
  });

  app.delete("/api/dishes/:id", isAdmin, async (req, res) => {
    try {
      const dishId = parseInt(req.params.id);
      await storage.deleteDish(dishId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting dish" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      let orders;
      
      if (req.user.role === "Administrador") {
        orders = await storage.getAllOrders();
      } else {
        orders = await storage.getOrdersByUserId(req.user.id);
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if user is admin or if the order belongs to the user
      if (req.user.role !== "Administrador" && order.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.put("/api/orders/:id/status", isAdmin, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = z.object({ status: z.string() }).parse(req.body);
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: "Invalid status data" });
    }
  });

  // Users routes (admin only)
  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Master System Management routes
  app.post("/api/admin/system/backup", isAdmin, async (req, res) => {
    try {
      await storage.performSystemBackup();
      res.json({ message: "Backup realizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao realizar backup" });
    }
  });

  app.get("/api/admin/system/logs", isAdmin, async (req, res) => {
    try {
      const logs = await storage.getSystemLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar logs" });
    }
  });

  app.post("/api/admin/system/settings", isAdmin, async (req, res) => {
    try {
      await storage.updateSystemSettings(req.body);
      res.json({ message: "Configurações atualizadas com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar configurações" });
    }
  });

  // Access Control routes
  app.get("/api/admin/access/permissions", isAdmin, async (req, res) => {
    try {
      const permissions = await storage.getPermissions();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar permissões" });
    }
  });

  app.get("/api/admin/access/roles", isAdmin, async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar roles" });
    }
  });

  app.post("/api/admin/access/tokens", isAdmin, async (req, res) => {
    try {
      const token = await storage.generateApiToken(req.body);
      res.json(token);
    } catch (error) {
      res.status(500).json({ message: "Erro ao gerar token" });
    }
  });

  // Database Management routes
  app.post("/api/admin/database/backup", isAdmin, async (req, res) => {
    try {
      await storage.performDatabaseBackup();
      res.json({ message: "Backup do banco realizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao realizar backup do banco" });
    }
  });

  app.post("/api/admin/database/optimize", isAdmin, async (req, res) => {
    try {
      await storage.optimizeDatabase();
      res.json({ message: "Banco otimizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao otimizar banco" });
    }
  });

  app.post("/api/admin/database/maintenance", isAdmin, async (req, res) => {
    try {
      await storage.performDatabaseMaintenance();
      res.json({ message: "Manutenção realizada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao realizar manutenção" });
    }
  });

  // Monitoring routes
  app.get("/api/admin/system/performance", isAdmin, async (req, res) => {
    try {
      const metrics = await storage.getSystemPerformance();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar métricas" });
    }
  });

  app.get("/api/admin/system/resources", isAdmin, async (req, res) => {
    try {
      const resources = await storage.getSystemResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar recursos" });
    }
  });

  app.get("/api/admin/system/alerts", isAdmin, async (req, res) => {
    try {
      const alerts = await storage.getSystemAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar alertas" });
    }
  });

  // Advanced Tools routes
  app.post("/api/admin/tools/console", isAdmin, async (req, res) => {
    try {
      const result = await storage.executeConsoleCommand(req.body.command);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao executar comando" });
    }
  });

  app.post("/api/admin/tools/cache", isAdmin, async (req, res) => {
    try {
      await storage.manageCacheOperation(req.body);
      res.json({ message: "Operação de cache realizada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro na operação de cache" });
    }
  });

  app.post("/api/admin/tools/indexing", isAdmin, async (req, res) => {
    try {
      await storage.performIndexing(req.body);
      res.json({ message: "Indexação realizada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao realizar indexação" });
    }
  });

  // Stats routes (admin only)
  app.get("/api/stats", isAdmin, async (req, res) => {
    try {
      const totalEvents = await storage.getEventCount();
      const totalUsers = await storage.getUserCount();
      const totalOrders = await storage.getOrderCount();
      const totalRevenue = await storage.getTotalRevenue();
      
      const stats = {
        totalEvents,
        totalUsers,
        totalOrders,
        totalRevenue,
        recentEvents: [], // Temporariamente vazio para solucionar erro
        eventsPerMonth: [
          { month: "Jan", count: 12 },
          { month: "Feb", count: 15 },
          { month: "Mar", count: 18 },
          { month: "Apr", count: 20 },
          { month: "May", count: 25 },
          { month: "Jun", count: 22 },
          { month: "Jul", count: 30 },
          { month: "Aug", count: 35 },
          { month: "Sep", count: 42 },
          { month: "Oct", count: 48 },
          { month: "Nov", count: 52 },
          { month: "Dec", count: 56 },
        ],
        eventCategories: [
          { name: "Weddings", count: 35 },
          { name: "Corporate Events", count: 45 },
          { name: "Birthdays", count: 30 },
          { name: "Coffee Breaks", count: 25 },
          { name: "Children's Parties", count: 21 },
        ],
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  const server = createServer(app);
  return server;
}
