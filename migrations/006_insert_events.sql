-- Insert events based on menu categories
INSERT INTO events (title, description, status, event_type, image_url, menu_options) VALUES
-- Coffee Break Events
('Coffee Break Empresarial', 'Serviço de coffee break completo para eventos corporativos, reuniões e conferências.', 'available', 'corporate', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', 4),
('Coffee Break para Treinamentos', 'Coffee break personalizado para treinamentos e workshops empresariais.', 'available', 'training', 'https://images.unsplash.com/photo-1552581234-26160f608093', 3),

-- Breakfast Events
('Café da Manhã Executivo', 'Café da manhã completo para reuniões matinais e eventos corporativos.', 'available', 'corporate', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666', 2),
('Café da Manhã para Eventos', 'Serviço de café da manhã para eventos especiais e celebrações.', 'available', 'celebration', 'https://images.unsplash.com/photo-1550547660-d9450f859349', 2),

-- Lunch Events
('Almoço Corporativo', 'Almoço executivo para empresas, com opções de buffet e pratos empratados.', 'available', 'corporate', 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca', 3),
('Almoço para Eventos Sociais', 'Serviço de almoço para eventos sociais e celebrações.', 'available', 'social', 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868', 3),

-- Brunch Events
('Brunch Especial', 'Brunch completo para eventos sociais e corporativos.', 'available', 'social', 'https://images.unsplash.com/photo-1550547660-d9450f859349', 2),
('Brunch Celebration', 'Brunch premium para celebrações e eventos especiais.', 'available', 'celebration', 'https://images.unsplash.com/photo-1550547660-d9450f859349', 1),

-- Gastronomic Island Events
('Festival Gastronômico', 'Evento com diversas ilhas gastronômicas e experiências culinárias.', 'available', 'festival', 'https://images.unsplash.com/photo-1555244162-803834f70033', 2),
('Estações Gastronômicas', 'Evento com estações gastronômicas temáticas.', 'available', 'thematic', 'https://images.unsplash.com/photo-1555244162-803834f70033', 1),

-- Cocktail Events
('Coquetel Corporativo', 'Serviço de coquetel para eventos empresariais.', 'available', 'corporate', 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88', 2),
('Coquetel para Festas', 'Coquetel premium para festas e celebrações.', 'available', 'party', 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88', 1);

-- Link events with menus
WITH 
coffee_break_events AS (SELECT id FROM events WHERE title LIKE 'Coffee Break%'),
breakfast_events AS (SELECT id FROM events WHERE title LIKE 'Café da Manhã%'),
lunch_events AS (SELECT id FROM events WHERE title LIKE 'Almoço%'),
brunch_events AS (SELECT id FROM events WHERE title LIKE 'Brunch%'),
island_events AS (SELECT id FROM events WHERE title LIKE '%Gastronômic%'),
cocktail_events AS (SELECT id FROM events WHERE title LIKE 'Coquetel%')

INSERT INTO event_menus (event_id, menu_id)
SELECT e.id, m.id
FROM events e
CROSS JOIN menus m
WHERE 
  (e.id IN (SELECT id FROM coffee_break_events) AND m.name LIKE 'COFFEE BREAK%') OR
  (e.id IN (SELECT id FROM breakfast_events) AND m.name LIKE 'CAFÉ DA MANHÃ%') OR
  (e.id IN (SELECT id FROM lunch_events) AND m.name LIKE 'ALMOÇO%') OR
  (e.id IN (SELECT id FROM brunch_events) AND m.name LIKE 'BRUNCH%') OR
  (e.id IN (SELECT id FROM island_events) AND m.name LIKE 'ILHA GASTRONÔMICA%') OR
  (e.id IN (SELECT id FROM cocktail_events) AND m.name LIKE 'COQUETEL%'); 