import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

const DEFAULT_URL = "file:./data/lan-ai.db";

function resolveDbPath(databaseUrl = process.env.DATABASE_URL ?? DEFAULT_URL) {
  const filePath = databaseUrl.replace(/^file:/, "");
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  return resolved;
}

let sqlite: Database.Database | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!dbInstance) {
    const dbPath = resolveDbPath();
    sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    dbInstance = drizzle(sqlite, { schema });
  }
  return dbInstance;
}

export function closeDb() {
  if (sqlite) {
    sqlite.close();
    sqlite = null;
    dbInstance = null;
  }
}
