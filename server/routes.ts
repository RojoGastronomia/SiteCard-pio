import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertEventSchema, insertMenuItemSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Check if user is authenticated and has admin role
  const isAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    next();
  };

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
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

  // Menu items routes
  app.get("/api/events/:eventId/menu-items", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const menuItems = await storage.getMenuItemsByEventId(eventId);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu items" });
    }
  });

  app.post("/api/menu-items", isAdmin, async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid menu item data" });
    }
  });

  app.put("/api/menu-items/:id", isAdmin, async (req, res) => {
    try {
      const menuItemId = parseInt(req.params.id);
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const updatedMenuItem = await storage.updateMenuItem(menuItemId, menuItemData);
      
      if (!updatedMenuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      res.json(updatedMenuItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid menu item data" });
    }
  });

  app.delete("/api/menu-items/:id", isAdmin, async (req, res) => {
    try {
      const menuItemId = parseInt(req.params.id);
      await storage.deleteMenuItem(menuItemId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting menu item" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      let orders;
      
      if (req.user.role === "admin") {
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
      if (req.user.role !== "admin" && order.userId !== req.user.id) {
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

  const httpServer = createServer(app);

  return httpServer;
}
