import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { getDb, closeDb } from "./client";

const db = getDb();
migrate(db, { migrationsFolder: "./drizzle" });
closeDb();
console.log("Migrations applied.");
