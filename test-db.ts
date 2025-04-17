import { db } from './server/db';
import { events } from './shared/schema';

async function testConnection() {
  try {
    console.log('\nBuscando todos os eventos usando Drizzle...');
    const allEvents = await db.select().from(events);
    console.log('Número de eventos:', allEvents.length);
    
    if (allEvents.length > 0) {
      console.log('\nEventos encontrados:');
      allEvents.forEach((event, index) => {
        console.log(`\nEvento ${index + 1}:`);
        console.log(JSON.stringify(event, null, 2));
      });
    } else {
      console.log('\nNenhum evento encontrado no banco de dados!');
    }
    
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
  }
}

testConnection(); 