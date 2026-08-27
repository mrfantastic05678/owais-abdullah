import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/schema/directory";

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  try {
    const client = neon(databaseUrl);
    return drizzle(client, { schema });
  } catch (error) {
    console.error("Failed to initialize database client:", error);
    return null;
  }
}

export const db = createDb();

export function getDb() {
  return db;
}
