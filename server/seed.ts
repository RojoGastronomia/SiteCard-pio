import { db } from "./db";
import { events, menuItems } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Limpar dados existentes (opcional)
  // await db.delete(menuItems);
  // await db.delete(events);
  
  try {
    // Verificar se já existem eventos no banco
    const existingEvents = await db.select().from(events);
    if (existingEvents.length > 0) {
      console.log("Database already has data, skipping seed...");
      return;
    }

    // Event 1
    const [event1] = await db.insert(events).values({
      title: "Pacote Almoço Corporativo",
      description: "Serviço completo de catering para almoços corporativos. Inclui opções de menu, serviço de garçom e montagem.",
      status: "available",
      category: "corporate",
      imageUrl: "https://public.readdy.ai/ai/img_res/68a2ff7ee6f61f6c6b0f78ca78bc5f13.jpg",
      menuOptions: 2,
      minGuests: 10,
      maxGuests: 100,
    }).returning();
    
    // Menu items for Event 1
    await db.insert(menuItems).values([
      {
        name: "Menu Executivo",
        description: "Menu completo com entrada, prato principal e sobremesa. Opções de carne, frango e vegetariano.",
        price: 80,
        category: "executive",
        eventId: event1.id,
        imageUrl: "https://via.placeholder.com/300x200?text=Menu+Executivo",
      },
      {
        name: "Menu Premium",
        description: "Menu premium com entrada, prato principal gourmet, sobremesa e bebidas inclusas. Diversas opções disponíveis.",
        price: 120,
        category: "premium",
        eventId: event1.id,
        imageUrl: "https://via.placeholder.com/300x200?text=Menu+Premium",
      }
    ]);
    
    // Event 2
    const [event2] = await db.insert(events).values({
      title: "Casamento",
      description: "Serviço de catering completo para casamentos. Inclui coquetel de entrada, jantar, sobremesa e open bar.",
      status: "available",
      category: "wedding",
      imageUrl: "https://public.readdy.ai/ai/img_res/6f8df1bd2a80878edaccbfb15a0a1a93.jpg",
      menuOptions: 3,
      minGuests: 50,
      maxGuests: 300,
    }).returning();
    
    // Menu items for Event 2
    await db.insert(menuItems).values([
      {
        name: "Menu Clássico",
        description: "Menu tradicional com entrada, prato principal e sobremesa. Opções de carne, frango e peixe.",
        price: 150,
        category: "classic",
        eventId: event2.id,
        imageUrl: "https://via.placeholder.com/300x200?text=Menu+Classico",
      },
      {
        name: "Menu Gourmet",
        description: "Menu gourmet com 5 tempos: entrada fria, entrada quente, prato principal, pre-sobremesa e sobremesa.",
        price: 250,
        category: "gourmet",
        eventId: event2.id,
        imageUrl: "https://via.placeholder.com/300x200?text=Menu+Gourmet",
      },
      {
        name: "Menu Internacional",
        description: "Menu exclusivo com pratos da gastronomia internacional, produtos premium e open bar completo.",
        price: 350,
        category: "international",
        eventId: event2.id,
        imageUrl: "https://via.placeholder.com/300x200?text=Menu+Internacional",
      }
    ]);
    
    // Event 3
    const [event3] = await db.insert(events).values({
      title: "Aniversário",
      description: "Buffet completo para festas de aniversário. Diversas opções de cardápio e temas.",
      status: "available",
      category: "birthday",
      imageUrl: "https://public.readdy.ai/ai/img_res/73f50ccacb2c3c2fba36fe1f8ea8f96c.jpg",
      menuOptions: 2,
      minGuests: 20,
      maxGuests: 150,
    }).returning();
    
    // Menu items for Event 3
    await db.insert(menuItems).values([
      {
        name: "Menu Festa",
        description: "Buffet completo com finger foods, mini-porções, mesa de doces e bolo personalizado.",
        price: 100,
        category: "party",
        eventId: event3.id,
        imageUrl: "https://via.placeholder.com/300x200?text=Menu+Festa",
      },
      {
        name: "Menu Premium Celebration",
        description: "Menu premium com estações gastronômicas, carnes nobres, doces finos e bebidas premium.",
        price: 180,
        category: "premium",
        eventId: event3.id,
        imageUrl: "https://via.placeholder.com/300x200?text=Menu+Premium+Celebration",
      }
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Executar o seed
seed().then(() => process.exit(0)).catch(console.error);