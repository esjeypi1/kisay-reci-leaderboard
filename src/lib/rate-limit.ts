import "server-only";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "@/db";

export const MAX_ATTEMPTS = 5;
export const WINDOW_MINUTES = 15;

/** Hashed client key, so raw IP addresses are never stored. */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return createHash("sha256")
    .update(`${process.env.SESSION_SECRET ?? ""}:${ip}`)
    .digest("hex");
}

/** Minutes until this key may try again, or 0 if it is not locked out. */
export async function lockedForMinutes(key: string): Promise<number> {
  const rows = await getDb().execute<{ minutes: number }>(sql`
    select ceil(extract(epoch from (window_start + make_interval(mins => ${WINDOW_MINUTES}) - now())) / 60)::int as minutes
    from login_attempts
    where key = ${key}
      and count >= ${MAX_ATTEMPTS}
      and window_start > now() - make_interval(mins => ${WINDOW_MINUTES})
  `);
  return rows[0]?.minutes ?? 0;
}

/** Records a failed attempt; the window restarts once it has expired. */
export async function recordFailure(key: string): Promise<number> {
  const rows = await getDb().execute<{ count: number }>(sql`
    insert into login_attempts (key, count, window_start)
    values (${key}, 1, now())
    on conflict (key) do update set
      count = case
        when login_attempts.window_start <= now() - make_interval(mins => ${WINDOW_MINUTES}) then 1
        else login_attempts.count + 1
      end,
      window_start = case
        when login_attempts.window_start <= now() - make_interval(mins => ${WINDOW_MINUTES}) then now()
        else login_attempts.window_start
      end
    returning count
  `);
  return rows[0]?.count ?? 1;
}

export async function clearFailures(key: string) {
  await getDb().execute(sql`
    delete from login_attempts
    where key = ${key} or window_start < now() - interval '1 day'
  `);
}
