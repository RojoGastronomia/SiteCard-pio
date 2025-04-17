import { defineConfig } from "drizzle-kit";
import fs from 'fs';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const migrationsDir = './migrations/meta';

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const journalFile = './migrations/meta/_journal.json';

if (!fs.existsSync(journalFile)) {
  fs.writeFileSync(journalFile, '{}');
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
