-- Primeiro, vamos limpar as associações existentes
DELETE FROM event_menus;

-- Agora vamos inserir todas as associações em uma única instrução
INSERT INTO event_menus (event_id, menu_id)
SELECT e.id, m.id
FROM events e
CROSS JOIN menus m
WHERE 
  -- Coffee Break Events
  (
    e.title LIKE 'Coffee Break%' AND
    m.name LIKE 'COFFEE BREAK%'
  )
  OR
  -- Breakfast Events
  (
    e.title LIKE 'Café da Manhã%' AND
    m.name LIKE 'CAFÉ DA MANHÃ%'
  )
  OR
  -- Lunch Events
  (
    e.title LIKE 'Almoço%' AND
    m.name LIKE 'ALMOÇO%'
  )
  OR
  -- Brunch Events
  (
    e.title LIKE 'Brunch%' AND
    m.name LIKE 'BRUNCH%'
  )
  OR
  -- Gastronomic Island Events
  (
    e.title LIKE '%Gastronômic%' AND
    m.name LIKE 'ILHA GASTRONÔMICA%'
  )
  OR
  -- Cocktail Events
  (
    e.title LIKE 'Coquetel%' AND
    m.name LIKE 'COQUETEL%'
  ); 