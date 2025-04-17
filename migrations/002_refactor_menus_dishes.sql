-- Make migration idempotent (safe to re-run)

-- 1. Create the menus table if it doesn't exist
CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Rename menu_items to dishes only if menu_items exists and dishes doesn't
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'menu_items') AND
     NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dishes') THEN
    ALTER TABLE menu_items RENAME TO dishes;
  END IF;
END$$;

-- 3. Add menu_id column to dishes only if it doesn't exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dishes') AND
     NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'menu_id') THEN
    ALTER TABLE dishes ADD COLUMN menu_id INTEGER;
  END IF;
END$$;

-- 4. Add foreign key constraint only if it doesn't exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dishes') AND
     NOT EXISTS (
       SELECT 1 FROM information_schema.table_constraints
       WHERE table_name = 'dishes' AND constraint_name = 'fk_menu' AND constraint_type = 'FOREIGN KEY'
     ) THEN
    ALTER TABLE dishes
    ADD CONSTRAINT fk_menu
    FOREIGN KEY (menu_id)
    REFERENCES menus(id)
    ON DELETE SET NULL;
  END IF;
END$$;

-- 5. Remove the old event_id column from dishes only if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'event_id') THEN
    ALTER TABLE dishes DROP COLUMN event_id;
  END IF;
END$$;

-- 6. Create the event_menus join table if it doesn't exist
CREATE TABLE IF NOT EXISTS event_menus (
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, menu_id)
);

-- Helper function to create index if it doesn't exist
CREATE OR REPLACE FUNCTION create_index_if_not_exists(table_name TEXT, index_name TEXT, index_def TEXT)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = index_name AND n.nspname = 'public') THEN
    EXECUTE 'CREATE INDEX ' || quote_ident(index_name) || ' ON ' || quote_ident(table_name) || ' ' || index_def;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 7. Create indexes if they don't exist
SELECT create_index_if_not_exists('dishes', 'idx_dishes_menu_id', '(menu_id)');
SELECT create_index_if_not_exists('event_menus', 'idx_event_menus_event_id', '(event_id)');
SELECT create_index_if_not_exists('event_menus', 'idx_event_menus_menu_id', '(menu_id)'); 