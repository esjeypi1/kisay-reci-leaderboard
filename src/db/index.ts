import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  // prepare: false keeps this compatible with Neon's pooled (PgBouncer) connection string.
  // A few connections per instance so concurrent page views don't queue on one socket.
  const client = postgres(url, { prepare: false, max: 3 });
  return drizzle(client, { schema });
}

type Db = ReturnType<typeof createDb>;

// Reuse one client per server instance (and across hot reloads in dev).
const globalForDb = globalThis as unknown as { db?: Db };

export function getDb(): Db {
  globalForDb.db ??= createDb();
  return globalForDb.db;
}
