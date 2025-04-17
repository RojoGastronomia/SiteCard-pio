import { pgTable, text, serial, integer, timestamp, boolean, doublePrecision, json, varchar, primaryKey } from "drizzle-orm/pg-core"; "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("client"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location"),
  eventType: text("event_type").notNull(),
  menuOptions: integer("menu_options").notNull().default(2),
  status: text("status").notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Menus table
export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMenuSchema = createInsertSchema(menus).omit({ id: true, createdAt: true });
export type InsertMenu = z.infer<typeof insertMenuSchema>;
export type Menu = typeof menus.$inferSelect;

// Dishes table
export const dishes = pgTable("dishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  category: text("category").notNull(),
  menuId: integer("menu_id"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDishSchema = createInsertSchema(dishes).omit({ id: true, createdAt: true, menuId: true });
export type InsertDish = z.infer<typeof insertDishSchema>;
export type Dish = typeof dishes.$inferSelect;

// EventMenus join table
export const eventMenus = pgTable("event_menus", {
  eventId: integer("event_id").notNull().references(() => events.id, { onDelete: 'cascade' }),
  menuId: integer("menu_id").notNull().references(() => menus.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.eventId, table.menuId] })
}));

// Dishes relation to Menus (Many-to-One)
export const dishesRelations = relations(dishes, ({ one }) => ({
  menu: one(menus, {
    fields: [dishes.menuId],
    references: [menus.id],
  }),
}));

// Menus relations to Dishes (One-to-Many) and EventMenus (Many-to-Many)
export const menusRelations = relations(menus, ({ many }) => ({
  dishes: many(dishes),
  eventMenus: many(eventMenus),
}));

// Events relations to EventMenus (Many-to-Many)
export const eventsRelations = relations(events, ({ many }) => ({
  eventMenus: many(eventMenus),
}));

// EventMenus relations to Events and Menus (Many-to-One links)
export const eventMenusRelations = relations(eventMenus, ({ one }) => ({
  event: one(events, {
    fields: [eventMenus.eventId],
    references: [events.id],
  }),
  menu: one(menus, {
    fields: [eventMenus.menuId],
    references: [menus.id],
  }),
}));

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventId: integer("event_id").notNull(),
  status: text("status").notNull().default("pending"),
  date: timestamp("date").notNull(),
  guestCount: integer("guest_count").notNull(),
  menuSelection: text("menu_selection"),
  totalAmount: doublePrecision("total_amount").notNull(),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Cart type (not stored in database)
export type CartItem = {
  id: number;
  eventId: number;
  title: string;
  imageUrl: string;
  date: string;
  guestCount: number;
  menuSelection: string;
  price: number;
  quantity: number;
};
